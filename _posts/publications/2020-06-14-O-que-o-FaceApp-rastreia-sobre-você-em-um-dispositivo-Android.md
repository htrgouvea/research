---
layout: content
title: 'O que o FaceApp rastreia sobre você em um dispositivo Android'
description: 'O FaceApp pode gerar uma identificação exclusiva de cada um de seus usuários e mapear como esses usuários usam o aplicativo (quais recursos acessam, horários, quais aplicativos compartilham as fotos, como se movem no aplicativo e muito mais), e também não é possível garantir que as fotos usadas no aplicativo sejam realmente acessíveis apenas ao dispositivo em que foram geradas'
og_image: https://heitorgouvea.me/images/publications/faceapp/table-faceapp-privacy.png
---

### Sumário

Recentemente notei que muitas pessoas voltaram a usar o aplicativo FaceApp - "um aplicativo móvel que gera transformações altamente realistas de rostos humanos em fotografias usando redes neurais baseadas em inteligência artificial" -  e juntamente a isso surgiu um debate sobre como esse aplicativo pode usar suas informações de forma comercial, com esse cenário em mente, decidi realizar uma análise do aplicativo e ver quais informações ele realmente coleta e como isso pode ser utilizado para fins comerciais. Essa publicação tem como objetivo mostrar como a análise ocorreu, de forma clara e acessível para o maior número de pessoas, logo, algumas técnicas um pouco mais complexas ficaram de fora do escopo dessa publicação e além disso, essa publicação não tem como objetivo avaliar a segurança do aplicativo.

---

### Descrição

Primeiramente eu quero adiantar que o FaceApp possuí uma página muito clara e acessível sobre sua política de privacidade, onde ele lista quais informações ele coleta e para qual finalidade ele as usa.

Essa página pode ser acessada neste link: [https://www.faceapp.com/privacy-en.html](https://www.faceapp.com/privacy-en.html)

De forma resumida essa tabela ilustra bem tudo que é coletado e como é usado:

![Image](/images/publications/faceapp/table-faceapp-privacy.png)

Além disso, o aplicativo fornecesse uma opção para que o usuário solicite a exclusão de todos os seus dados presentes nos servidores do FaceApp.

---

### Análise

Para a execução dessa análise decidi seguir um escopo bem específico, onde vou utilizar o aplicativo em um dispositivo emulado (virtual) e não vou fazer nenhum tipo de autenticação, nem mesmo através de redes sociais. Utilizei o Android SDK para a emulação desse dispositivo, que foi um Android na versão 8.1 com arquitetura x86 e permissões do usuário root habilitada. 

Para começar essa análise fiz download do aplicativo através da loja oficial do Android, a Play Store ([https://play.google.com/store/apps/details?id=io.faceapp](https://play.google.com/store/apps/details?id=io.faceapp&hl=pt_BR)) e posteriormente iniciei a análise estática do artefato. 

![Image](/images/publications/faceapp/check-md5-faceapp.png)

Analisando o *AndroidManifest.xml* do aplicativo em questão, é possível notar que ele solicita permissão para acessar inúmeros recursos do dispositivo:

![Image](/images/publications/faceapp/androidmanifest.png)

Em resumo, as permissões que ele solicita são para: ter acesso a Internet, ao estado da rede, câmera, escrita e leitura no *sdcard,* impedir o processador de "dormir" ou deixar a tela escurecer, entre outras. Bom, até o momento, comparando as permissões do aplicativo com suas funcionalidades, não temos nada de estranho.

Posteriormente continuei dando uma olhada no código fonte do aplicativo e descobri que o mesmo não possuí nenhum tipo de [técnica anti-debugging](https://mobile-security.gitbook.io/mobile-security-testing-guide/android-testing-guide/0x05j-testing-resiliency-against-reverse-engineering) aplicada... O que me surpreendeu bastante pois na minha opinião esse App iria ter diversos controles do gênero e esse foi um dos motivos que me fez querer analisa-lo. Afim de verificar de fato isso, decidi começar a análise dinâmica de uma vez e instalei o aplicativo no meu emulador e realmente, o aplicativo não me impediu de executa-lo em um dispositivo emulador/com permissões de root:

![Image](/images/publications/faceapp/first-app-open.png)

Bom, agora eu já estava com o aplicativo em execução e provavelmente diversas coisas estavam acontecendo no meu dispositivo, partindo  adiante decidi analisar se algum tipo de requisição para servidores externos estava acontecendo e assim me deparei com  uso de [*certificate pinning](https://owasp.org/www-community/controls/Certificate_and_Public_Key_Pinning)* pelo App, mas isso foi facilmente contornado utilizando o [Frida](https://frida.re/). E então, logo de cara, a primeira requisição que o aplicativo realizava assim que era aberto, era a seguinte:

![Image](/images/publications/faceapp/request-sending-device-datas.png)

E aí estava o começo do monitoramento que o App realiza em todos seus usuários, uma única requisição que envia para um servidor as informações sobre seu dispositivo como:  versão do aplicativo utilizada naquela momento, DeviceID, Modelo do dispositivo, idioma utilizado, RegistrationID e versão do sistema operacional (Ah, e não se esqueça que seu IP também está atrelado a esses informações).

Bom, mais qual o impacto disso? O DeviceID é determinado de forma aleatória durante a primeira inicialização de um dispositivo e ele é responsável pela identificação do dispositivo e deve permanecer constante, durante a vida útil dispositivo a menos que uma redefinição de fábrica seja realizada.

Já o registrationID:  "Um ID de registro é um identificador atribuído pelo GCM a uma única instância de um único aplicativo instalado em um dispositivo Android. O dispositivo recebe esse identificador quando se registra no Google Cloud Messaging."

Através da combinação dessas duas informações e as demais ilustradas anteriormente é possível que uma  entidade (empresas ou agências de inteligência) consiga criar uma assinatura única referente a você. Ou seja, qualquer entidade que possua em mãos essa assinatura única será capaz de correlacionar certas informações e identificar você em diversos contextos.

Utilizando mais um pouco o aplicativo, decidi olhar os arquivos que ele estava gerando no meu dispositivo já que mais nenhuma outra requisição chamou minha atenção e acabei encontrando uma pasta chamada "*logs*":

![Image](/images/publications/faceapp/logs-android.png)

Assim como o próprio nome do diretório indica, tais arquivos são utilizados para guardar informações de log, algumas informações contidas nesses arquivos são:

![Image](/images/publications/faceapp/first-log.png)

![Image](/images/publications/faceapp/second-log.png)

Informações sobre permissões que o aplicativo possuí no meu dispositivo, endpoints que foram acessados durante o uso, versão de API, quantidade de fotos na minha galeria, o que eu fiz dentro do aplicativo, horário de utilização, se eu estava usando Wi-Fi ou não e por aí vai... Esses arquivos são enviados para um servidor externo de tempos em tempos (não me atentei em marcar qual quantidade específica de horas). 

Bom, com essas informações o FaceApp já consegue atrelar um comportamento específico àquela assinatura única que faz referência a minha pessoa.

Para as pessoas que já estão familiarizados com análise de aplicativos Android essas informações parecem muito com informações que são acessíveis através do ADB usando o logcat, quando uma App esta com o modo Debug habilitado mas este não é o caso, a App está com o modo Debug e ela gera esses arquivos de Log usando um código interno.

Além dessas informações, o App só envia para o servidor as fotos que eu decidi aplicar algum efeito, no entanto, ele mapea que possuo uma quantidade específica de fotos recentes e envia esse valor para o back-end deles. 

Na política de privacidade o FaceApp diz que a imagem não é compartilhada com terceiros e que ela só fica hospedada em seus servidores por 48hrs e para reforçar a confiabilidade desse ação eles dizem que adotam um mecanismo de criptografia para cada fotografia enviada utilizando o aplicativo e a chave que é utilizada fica armazenada localmente no seu dispositivo (isso é uma medida para que somente o seu dispositivo possa visualizar a foto), no entanto o arquivo que possuí essa chave pode ser acessado por terceiros, já que aplicativo pode ser utilizado por um dispositivo que possuí o usuário root "habilitado":

![Image](/images/publications/faceapp/photo-key.png)

Esse tipo de cenário pode ser explorado por um Malware, e também existem outros métodos para acessar esses dados além de ser root no dispositivo.

---

### Conclusão

Podemos afirmar que pelo menos para o escopo abordado nessa publicação o FaceApp realmente cumpre seus termos de privacidade, e as informações que ele coleta são o suficiente para: gerar uma identificação única de cada um de seus usuários e mapear como esses usuário fazem uso do aplicativo (quais recursos eles acessam, horários, quais aplicativos eles compartilham as fotos, como é a movimentação dentro do App e muito mais), e também não é possível garantir que as fotos utilizadas no aplicativo realmente são acessíveis apenas para o dispositivo em que elas foram geradas. 

Neste cenário um malware é capaz de coletar as informações que o FaceApp armazena localmente no meu dispositivo e utiliza-las como bem entender e na minha opinião, talvez esse seja o maior risco ao utilizar esse aplicativo.

---

### Referências

[**https://en.wikipedia.org/wiki/FaceApp**](https://en.wikipedia.org/wiki/FaceApp)

[**https://play.google.com/store/apps/details?id=io.faceapp**](https://play.google.com/store/apps/details?id=io.faceapp)

[**https://developer.android.com/reference/android/Manifest.permission**](https://developer.android.com/reference/android/Manifest.permission)

[**https://owasp.org/www-community/controls/Certificate_and_Public_Key_Pinning**](https://owasp.org/www-community/controls/Certificate_and_Public_Key_Pinning)

[**https://frida.re/**](https://frida.re/)

[**https://developer.android.com/training/articles/user-data-ids**](https://developer.android.com/training/articles/user-data-ids?hl=pt-br)

[**https://mobile-security.gitbook.io/mobile-security-testing-guide/android-testing-guide/0x05j-testing-resiliency-against-reverse-engineering**](https://mobile-security.gitbook.io/mobile-security-testing-guide/android-testing-guide/0x05j-testing-resiliency-against-reverse-engineering)

---