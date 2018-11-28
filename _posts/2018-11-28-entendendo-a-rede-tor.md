---
layout: blog
title:  Entendendo de uma vez por todas o que é a Rede Tor e como ela funciona!
category: stories
---

![Image](https://i.imgur.com/q5nabw9.jpg)

Muito se fala em anonimato digital nos últimos tempos, mas poucos tentam praticar tal ato de fato. Uma boa ferramenta que pode ajudar nessa tarefa é o Projeto Tor!

## The Tor Project

Tor (O roteador cebola, do inglês “The Onion Router”) é um projeto livre e de código aberto que pro‘por’ciona o anonimato pessoal ao navegar na Internet e em atividades online, protegendo contra a censura e principalmente a privacidade pessoal.

Ele pode ser entendido basicamente como 3 coisas diferentes: uma rede, um protocolo ou um navegador.

  - O projeto está registrado como uma organização não governamental, sem fins lucrativos;
  - A rede fornece à seus usuários a privacidade para acessar e publicar diversos conteúdos e serviços;
  - O protocolo está definido publicamente em especificações técnicas nos repositórios do projeto;
  - O navegador é a porta de entrada mais simples para se ter acesso a rede.

## O que é de fato?!

O próprio projeto define o termo Tor como uma rede de ínumeros servidores operados por vonlutários que fornecem a seus usuários a possibilidade de permanecerem anônimos na Internet.

De fato é uma vasta gama de túneis virtuais que são utilizados/criados entre a conexão original e os servidores/serviços que os usuários desejam utilizar através da Internet, de forma a não comprometer a privacidade destes usuários. O Tor também age como uma importante ferramenta de combate a tentativa de censura e filtros de informações. Além de oferecer a possibilidade de usuários acessarem serviços e conteúdos de forma anônima, também é possível publicar e servir conteúdos de forma anônima através dos chamados “onion services”. Todos os endereços dentro da rede Tor são identificados por um sufixo .onion jutamente ao nome/hash do serviço que o usuário deseja acessar.

O Tor pode ser utilizado em sistemas operacionais Windows, em sistemas baseados no kernel Linux, Mac/OSX e em outros sistemas de linhagem BSD/UNIX.

## O que não é?

  - A imagem estereotipada que a indústria do cinema criou em seus filmes onde existiam quaisquer crimes e condutas ilícitas na Internet.
  - De fato existem alguns casos em que o projeto é utilizado para realizar crimes, porém, a execução de tais ações podem ser fácilmente realizada mesmo sem que a rede Tor existisse.
  - A conexão direta a uma imagem de criminalizadora de seus usuários e/ou desenvolvedores.

## Para que serve?

Utilizar o Tor pode te proteger contra vários tipos de ataques ou monitoramentos indesejados, ambos relacionados a análise de tráfego.

Diversos e diferentes sites/portais de comércio eletrônico podem identificar os comportamentos de seus usuários e, de maneira abusiva, alterar preços e enviar propagandas diferenciadas a seus visitantes (muitos podem, até, bloquear ou redirecionar visitantes para outros portais). Com ajuda do Tor você pode prevenir que seus comportamentos sejam rastreados numa rede pública, ou até mesmo numa rede privada.

Se você estiver viajando de férias e visitar sua conta de email pessoal através da rede de um hotel/motel/hostel, além de ser possível que pessoas mal intensionadas interceptem seu tráfego, é possível que você comece a receber mensagens indesejadas , seja abordado nos corredores ou até mesmo na recepção para ser questionado sobre promoções e outras situações peculiares.

## Quem usa?

  - eu;
  - Jornalistas e Repórteres;
  - Organizações não Governamentais;
  - Famílias (preocupadas com a privacidade/segurança dos parentes);
  - Ativistas e Ciberativistas;
  - Universidades ou Institutos de Tecnologia;
  - Companhias de Pesquisa e Desenvolvimento;
  - …

## Como funciona?

Se você precisa acessar um servidor ou serviço, de forma resumida, funciona assim:

```bash
  Cliente -> Entry guard -> Relay -> Nós de Saída -> Internet
```

![Image](https://i.imgur.com/NcrSK1x.png)

Agora, se você precisa acessar um onion service, funciona assim:

```bash
  Cliente -> Entry guard-> Relay -> ~ -> endereço.onion
```

![Image](https://i.imgur.com/xGSJOSH.png)

Cada salto que é dado para dentro da rede têm sua própria camada de criptografia. O último salto, para a Internet, não sabe de onde a solicitação originalmente veio.

### Entry guard

É sempre o primeiro relay do circuito, funciona como uma conexão de apoio/ponte para que você consiga realizar o primeiro salto para dentro da rede Tor, o mesmo ocupa uma posição extremamente delicada na rede, pois é responsável por lidar com o IP real do usuário.

### Relay

São os relays intermediários;

### Nó de Saída

São os nós que permitem você sair da rede Tor e chegar até portais/servidores/serviços hospedados na Internet.

## As camadas da cebola

Não foi por acaso que os desenvolvedores escolheram uma cebola para substituir o “O” da sigla Tor. Isso foi porque ela representa as camadas de criptografia assimétrica que definem o modo em que as informações transitam na rede.

A informação é criptografada usando a chave pública do relay C, depois é criptografada usando a chave do B, e por fim, com a chave pública do A. A mensagem original permanece oculta na medida que é transferida de um nó para o outro, e nenhum dos intermediários conhecem a origem e o destino final dos dados, permitindo que o remetente permaneça anônimo.

![Image](https://i.imgur.com/BRa2ZPS.png)

Quando o circuito estiver completo, o usuário pode enviar dados pela Internet anonimamente. Quando o destinatário final dos dados envia dados de volta, os relays intermediários mantêm o mesmo link de volta para o usuário, com os dados novamente em camadas, mas em sentido inverso, de modo que o exit relay desta vez remova a primeira camada de criptografia e o entry guard remova a última camada de criptografia antes de enviar os dados.

## Automatizando o uso da Rede Tor

Essas opções abaixos são algumas das ínumeras formas de se fazer o uso da rede tor:

### Tor browser

A forma mais simples é a utilização do navegador disponibilizado pelo projeto, o Tor Browser. Esta é, sem dúvida, a forma mais recomendada para ter seu primeiro contato com Tor.

### Whonix

O Whonix é um sistema operacional de desktop projetado para segurança e privacidade avançadas. O Whonix atenua a ameaça de vetores de ataque comuns enquanto mantém a usabilidade. O anonimato on-line é realizado através do uso seguro, automático e em toda a área de trabalho da rede Tor.

### Nipe

O Nipe é um script Perl que torna a rede Tor o seu gateway de rede padrão, ele está disponível para todas as distribuições Linux.

### Ricochet

O Ricochet é uma abordagem diferente para mensagens instantâneas que não confia em ninguém para proteger sua privacidade, parte da sua Core Engine é o projeto Tor.

### Tails

Tails é um sistema operacional live, que você pode usar em quase qualquer computador a partir de uma memória USB ou de um DVD. Ele tem como objetivo preservar sua privacidade e seu anonimato.

### Orbot

O Orbot é um aplicativo para disposítivos Android, que configura seu smartphone para usar o Tor como um proxy default em seu aparelho.

### Como colaborar?

Se você achou o projeto intessante e deseja ajudar, acesse a página oficial do projeto e descubra como ser voluntário. Você também pode, ainda, fazer uma doação.

## As fendas na armadura

Toda essa complexidade que proporciona anonimato infelizmente não nos fornece confidencialidade, pois a conexão final com o servidor não é encriptada no último relay da conexão, o relay de saída.

O diretório de relays do tor é publico, portanto diversos sites podem bloquear o seu acesso quando estiver navegando através do mesmo. Isso ocorre principalmente em países onde a censura é muito grande, interferindo diretamente na liberdade de expressão de cada indivíduo.

Porém, felizmente temos a opção de utilizar uma Bridge, que utiliza protocolos específicos para contornar bloqueios à nível de transporte (ISP’s e Governo).

Embora a mensagem enviada seja transmitida dentro de várias camadas de criptografia, o trabalho do exit relay, como o nó final do circuito, é descriptografar a última camada e entregar a mensagem ao destinatário/servidor.

Um exit relay comprometido é capaz de adquirir os dados brutos que estão sendo transmitidos, potencialmente incluindo senhas, mensagens privadas, números de conta bancária e outras formas de informações pessoais.

Para contornar este problema, podemos utilizar uma uma conexão segura como o TLS ou HTTPS.
“Mas eu não tenho nada a esconder, por que deveria me preocupar em usar Tor?”

A resposta para esta pergunta pode até render outra publicação, e vai mesmo!! Então me siga em alguma rede social que logo mais irei fazer uma publicação exclusiva sobre tal assunto!
