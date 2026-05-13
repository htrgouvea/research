---
layout: content
title: '¿Debemos comprar o construir?'
description: 'Una reflexión sobre decisiones de ingeniería entre comprar y construir, diferenciación competitiva, costo de mantenimiento, tiempo hasta generar valor e identidad técnica.'
og_image: https://heitorgouvea.me/images/photos/section.jpg
---

A lo largo del tiempo que trabajé en Nubank, una de las cosas que más me llamó la atención fue la cultura de ingeniería que atravesaba las decisiones técnicas. Nubank fue construido, desde sus primeros días, sobre la premisa de que ingenieros de alto nivel resuelven problemas difíciles construyendo soluciones propias. Esa cultura creó equipos extraordinariamente capaces, pero también nos ponía, con frecuencia, frente a una trampa sutil: la tendencia a construir todo internamente, no porque fuera la decisión correcta, sino porque construir era parte de la identidad del equipo.

Esa experiencia me enseñó que la pregunta "¿debemos comprar o construir?" está, en realidad, mal formulada. No porque sea inválida, sino porque la forma en que suele hacerse presupone una elección binaria que rara vez corresponde a la realidad. En la práctica, casi ninguna decisión de ingeniería es puramente una cosa u otra. Siempre construyes sobre fundamentos que no creaste. Siempre compras componentes que alguien eligió abstraer por ti. La pregunta más precisa es: ¿hasta dónde debemos construir y a partir de dónde debemos comprar?

Entender esto cambia por completo el marco de análisis.

## El costo invisible de construir

Cuando un equipo técnico fuerte se enfrenta a un problema, la inclinación natural es construir. Hay varias razones legítimas para eso: control total sobre el comportamiento de la solución, capacidad de adaptarla al contexto específico del negocio, ausencia de dependencia externa y, en muchos casos, el placer genuino de resolver problemas complejos desde cero. En entornos de alta densidad técnica, como los que viví en Nubank, esa inclinación es casi gravitacional.

El problema es que construir tiene costos que rara vez aparecen en la propuesta inicial. El costo más obvio es el tiempo de desarrollo. Pero hay otro, menos visible y más peligroso: el costo de mantenimiento a lo largo del tiempo. Una solución construida internamente necesita a alguien que la mantenga, la evolucione, la documente y haga onboarding de nuevos miembros que necesitan entenderla. En equipos que crecen rápido, eso se convierte en deuda técnica antes incluso de convertirse en un producto maduro. Y en equipos con rotación, se convierte en un sistema legado sin dueño antes de cumplir dos años de vida.

Charlie Munger, socio de Warren Buffett, tenía un principio que se aplica bien aquí: antes de resolver un problema, inviértelo. En vez de preguntar "¿por qué deberíamos comprar?", pregunta "¿cuáles son las razones para no construir?". Este ejercicio de inversión obliga al equipo a confrontar los costos reales de la construcción antes de romantizarla.

## Diferenciación versus paridad

Uno de los frameworks más útiles que encontré para estructurar esta decisión viene de Niel Nickolaisen, y parte de una pregunta simple: ¿este proceso o esta capacidad nos diferencia en el mercado, o solo nos mantiene competitivos?

Nickolaisen propone evaluar cualquier proceso o sistema en dos dimensiones: el grado en que diferencia a la empresa en el mercado y el grado en que es esencial para la misión del negocio. Los procesos que son simultáneamente diferenciales y esenciales merecen inversión máxima. Son los que atraen clientes, crean ventaja competitiva y necesitan ser mejores que lo que cualquier competidor ofrece. Aquí, construir tiene sentido, porque la solución necesita reflejar una comprensión única de tu problema.

Pero la mayoría de los procesos y sistemas no encaja en esa categoría. La mayor parte de lo que un equipo de ingeniería mantiene es esencial para el funcionamiento del negocio, pero no diferencia a la empresa de ningún competidor. Un sistema de autenticación, una pipeline de CI/CD, una solución de monitoreo: todos son críticos, pero ninguno hará que un cliente elija tu producto en vez del de la competencia. Para estos sistemas, el objetivo no es ser mejor que la competencia, sino estar al mismo nivel. Tratar procesos de paridad como si fueran diferenciales es una de las formas más eficientes de desperdiciar capacidad de ingeniería.

La frase que mejor resume este principio es: construye para diferenciar, compra para alcanzar paridad.

## El tiempo hasta generar valor

Otro ángulo que debe entrar en el análisis es el tiempo. Construir lleva tiempo. Y el tiempo, en contextos de producto, es costo de oportunidad. Cada sprint dedicado a construir una solución interna de monitoreo es un sprint que no se dedicó a una funcionalidad que podría generar ingresos, retener clientes o reducir churn.

Esto no significa que construir siempre sea incorrecto cuando existe una solución lista en el mercado. Significa que el costo de oportunidad debe explicitarse antes de la decisión. Una solución comprada, incluso imperfecta, que puede ponerse en producción en dos semanas, debe compararse honestamente con una solución construida internamente que tardará cuatro meses en alcanzar la misma cobertura funcional. En muchos casos, el tiempo hasta generar valor es el factor que inclina la decisión de forma determinante.

En Nubank, aprendimos esto de la forma más concreta posible: había herramientas que construimos con mucho orgullo técnico, que funcionaban muy bien, pero que consumían la capacidad de equipos enteros para seguir existiendo. En algunos casos, mirando hacia atrás, la decisión correcta habría sido comprar una solución suficientemente buena y redirigir ese equipo hacia los problemas que realmente nadie más en el mercado sabía resolver.

## La trampa de la identidad técnica

El punto más difícil de reconocer es cuando la decisión de construir no está guiada por análisis, sino por identidad. Los equipos técnicos muy buenos frecuentemente asocian su competencia con la capacidad de construir cosas complejas. Hay un orgullo legítimo en eso. Pero ese orgullo puede distorsionar el juicio cuando empieza a influir en decisiones que deberían tratarse como elecciones pragmáticas.

Un Engineering Manager o Engineer Lead/Staff+ necesita estar atento a este sesgo. La pregunta no es "¿somos capaces de construir esto?". La respuesta a esa pregunta en un equipo técnico fuerte casi siempre es sí. La pregunta relevante es "¿construir esto es el mejor uso de la capacidad de este equipo ahora?". Y esa es una pregunta que exige dejar el ego de lado.

Una de las formas que Nubank encontró para abordar parcialmente este problema fue a través del proceso de RFCs. Antes de que se tomara una decisión técnica relevante, se formalizaba en un documento que describía el problema, las opciones consideradas y los trade-offs de cada una. Ese documento circulaba entre stakeholders técnicos y recibía comentarios antes de que comenzara cualquier implementación. El proceso no elimina la subjetividad, ni podría hacerlo, porque toda decisión de ingeniería carga algún grado de juicio. Pero crea una superficie donde los sesgos implícitos quedan expuestos. Un comentario de alguien de fuera del equipo muchas veces era suficiente para identificar que la preferencia por construir estaba siendo justificada con argumentos técnicos que, en realidad, enmascaraban una inclinación cultural. Este tipo de fricción saludable es difícil de crear de otra forma.

Algunas de las mejores decisiones técnicas que he visto fueron decisiones de no construir. De adoptar una solución existente, aunque imperfecta, y concentrar energía en los problemas que de hecho necesitaban una respuesta propia porque ningún producto en el mercado podía ofrecerla.

## Un proceso para la decisión

En la práctica, cuando un equipo se enfrenta a este tipo de elección, algunas preguntas ayudan a estructurar el análisis. Primero: ¿este problema es un diferencial competitivo o un requisito de paridad? Si es paridad, la presunción inicial debería ser comprar. Segundo: ¿cuál es el costo total de construir, incluyendo mantenimiento, documentación y onboarding durante los próximos dos años? Tercero: ¿cuál es el tiempo hasta que cada opción empiece a generar valor para el negocio? Cuarto: ¿cuáles son las fronteras entre lo que vamos a construir y lo que vamos a comprar, y cuáles son los contratos entre esas fronteras?

Esta última pregunta es especialmente importante. La discusión entre comprar y construir no trata solo sobre la elección inicial. Trata sobre entender dónde termina una solución y dónde empieza otra, y garantizar que esas fronteras sean explícitas, documentadas y comprendidas por el equipo. Muchos problemas de integración y mantenimiento nacen no de malas elecciones entre comprar y construir, sino de la falta de claridad sobre dónde empieza y termina cada componente.

La decisión entre comprar y construir no tiene una respuesta universal. Pero sí tiene un enfoque. Y los equipos técnicos de alta performance se distinguen no por la capacidad de construir cualquier cosa, sino por la sabiduría de saber cuándo no construir.
