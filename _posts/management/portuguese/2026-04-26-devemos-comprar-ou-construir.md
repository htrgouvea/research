---
layout: content
title: 'Devemos comprar ou construir?'
description: 'Uma reflexão sobre decisões de engenharia entre comprar e construir, diferenciação competitiva, custo de manutenção, tempo até valor e identidade técnica.'
og_image: https://heitorgouvea.me/images/photos/section.jpg
---

Ao longo do tempo que trabalhei no Nubank, uma das coisas que mais me chamou atenção foi a cultura de engenharia que permeava as decisões técnicas. O Nubank foi construído, desde seus primeiros dias, sobre a premissa de que engenheiros de alto nível resolvem problemas difíceis construindo soluções próprias. Essa cultura criou times extraordinariamente capazes, mas também nos colocava, com frequência, diante de uma armadilha sutil: a tendência de construir tudo internamente, não porque era a decisão certa, mas porque construir era parte da identidade do time.

Essa experiência me ensinou que a pergunta "devemos comprar ou construir?" é, na verdade, mal formulada. Não porque seja inválida, mas porque a forma como ela costuma ser feita pressupõe uma escolha binária que raramente corresponde à realidade. Na prática, quase nenhuma decisão de engenharia é puramente uma coisa ou outra. Você sempre constrói sobre fundações que não criou. Você sempre compra componentes que alguém escolheu abstrair para você. A pergunta mais precisa é: até onde devemos construir e a partir de onde devemos comprar?

Entender isso muda completamente o quadro de análise.

## O custo invisível de construir

Quando um time técnico forte se depara com um problema, a inclinação natural é construir. Há uma série de razões legítimas para isso: controle total sobre o comportamento da solução, capacidade de adaptá-la ao contexto específico do negócio, ausência de dependência externa, e, em muitos casos, o prazer genuíno de resolver problemas complexos do zero. Em ambientes de alta densidade técnica, como os que eu vivia no Nubank, essa inclinação é quase gravitacional.

O problema é que construir tem custos que raramente aparecem na proposta inicial. O custo mais óbvio é o tempo de desenvolvimento. Mas há outro, menos visível e mais perigoso: o custo de manutenção ao longo do tempo. Uma solução construída internamente precisa de alguém para mantê-la, evoluí-la, documentá-la e fazer onboarding de novos membros que precisam entendê-la. Em times que crescem rápido, isso vira dívida técnica antes mesmo de virar um produto maduro. E em times que passam por rotatividade, vira um sistema legado sem dono antes de completar dois anos de vida.

Charlie Munger, sócio de Warren Buffett, tinha um princípio que se aplica bem aqui: antes de resolver um problema, inverta-o. Em vez de perguntar "por que deveríamos comprar?", pergunte "quais são as razões para não construir?". Esse exercício de inversão força o time a confrontar os custos reais da construção antes de romantizá-la.

## Diferenciação versus paridade

Um dos frameworks mais úteis que encontrei para estruturar essa decisão vem de Niel Nickolaisen, e ele parte de uma pergunta simples: esse processo ou essa capacidade nos diferencia no mercado, ou apenas nos mantém competitivos?

Nickolaisen propõe avaliar qualquer processo ou sistema em duas dimensões: o grau em que ele diferencia a empresa no mercado e o grau em que ele é essencial para a missão do negócio. Processos que são simultaneamente diferenciais e essenciais merecem investimento máximo. São eles que atraem clientes, criam vantagem competitiva e precisam ser melhores do que o que qualquer concorrente oferece. Aqui, construir faz sentido, porque a solução precisa refletir um entendimento único do seu problema.

Mas a maioria dos processos e sistemas não se encaixa nessa categoria. A maior parte do que um time de engenharia mantém é essencial para o funcionamento do negócio, mas não diferencia a empresa de nenhuma concorrente. Um sistema de autenticação, uma pipeline de CI/CD, uma solução de monitoramento: todos são críticos, mas nenhum deles vai fazer um cliente escolher o seu produto em vez do concorrente. Para esses sistemas, o objetivo não é ser melhor que a concorrência, é estar no mesmo nível. Tratar processos de paridade como se fossem diferenciais é uma das formas mais eficientes de desperdiçar capacidade de engenharia.

A frase que melhor resume esse princípio é: construa para diferenciar, compre para alcançar paridade.

## O tempo até gerar valor

Outro ângulo que precisa entrar na análise é o tempo. Construir leva tempo. E tempo, em contextos de produto, é custo de oportunidade. Cada sprint dedicada a construir uma solução interna de monitoramento é uma sprint que não foi dedicada a uma funcionalidade que poderia gerar receita, reter clientes ou reduzir churn.

Isso não significa que construir é sempre errado quando há uma solução pronta no mercado. Significa que o custo de oportunidade precisa ser explicitado antes da decisão. Uma solução comprada, mesmo imperfeita, que pode ser colocada em produção em duas semanas, precisa ser comparada honestamente com uma solução construída internamente que vai levar quatro meses para atingir a mesma cobertura funcional. Em muitos casos, o tempo até gerar valor é o fator que inclina a decisão de forma determinante.

No Nubank, aprendemos isso da forma mais concreta possível: havia ferramentas que construímos com muito orgulho técnico, que funcionavam muito bem, mas que consumiam capacidade de times inteiros para continuar existindo. Em alguns casos, olhando para trás, a decisão correta teria sido comprar uma solução boa o suficiente e redirecionar aquele time para os problemas que realmente ninguém mais no mercado sabia resolver.

## A armadilha da identidade técnica

O ponto mais difícil de reconhecer é quando a decisão de construir não está sendo guiada por análise, mas por identidade. Times técnicos muito bons frequentemente associam sua competência à capacidade de construir coisas complexas. Há um orgulho legítimo nisso. Mas esse orgulho pode distorcer o julgamento quando ele começa a influenciar decisões que deveriam ser tratadas como escolhas pragmáticas.

Um Engineering Manager ou Engineer Lead/Staff+ precisa estar atento a esse viés. A pergunta não é "somos capazes de construir isso?". A resposta para essa pergunta em um time técnico forte é quase sempre sim. A pergunta relevante é "construir isso é o melhor uso da capacidade desse time agora?". E essa é uma pergunta que exige colocar o ego de lado.

Uma das formas que o Nubank encontrou para endereçar parcialmente esse problema foi através do processo de RFCs. Antes de uma decisão técnica relevante ser tomada, ela era formalizada em um documento que descrevia o problema, as opções consideradas e os trade-offs de cada uma. Esse documento circulava entre stakeholders técnicos e recebia comentários antes de qualquer implementação começar. O processo não elimina a subjetividade, e nem poderia, porque toda decisão de engenharia carrega algum grau de julgamento. Mas ele cria uma superfície onde vieses implícitos ficam expostos. Um comentário de alguém de fora do time muitas vezes era suficiente para identificar que a preferência por construir estava sendo justificada com argumentos técnicos que, na verdade, mascaravam uma inclinação cultural. Esse tipo de fricção saudável é difícil de criar de outra forma.

Algumas das melhores decisões técnicas que já vi foram decisões de não construir. De adotar uma solução existente, mesmo que imperfeita, e concentrar energia nos problemas que de fato precisavam de uma resposta própria porque nenhum produto no mercado poderia oferecê-la.

## Um processo para a decisão

Na prática, quando um time se depara com esse tipo de escolha, algumas perguntas ajudam a estruturar a análise. Primeiro: esse problema é um diferencial competitivo ou um requisito de paridade? Se for paridade, a presunção inicial deve ser comprar. Segundo: qual é o custo total de construir, incluindo manutenção, documentação e onboarding ao longo dos próximos dois anos? Terceiro: qual é o tempo até que cada opção comece a gerar valor para o negócio? Quarto: quais são as fronteiras entre o que vamos construir e o que vamos comprar, e quais são os contratos entre essas fronteiras?

Essa última pergunta é especialmente importante. A discussão entre comprar e construir não é só sobre a escolha inicial. É sobre entender onde uma solução termina e outra começa, e garantir que essas fronteiras sejam explícitas, documentadas e compreendidas pelo time. Muitos problemas de integração e manutenção nascem não de escolhas ruins entre comprar e construir, mas da ausência de clareza sobre onde cada componente começa e termina.

A decisão entre comprar e construir não tem resposta universal. Mas ela tem uma abordagem. E equipes técnicas de alta performance se distinguem não pela capacidade de construir qualquer coisa, mas pela sabedoria de saber quando não construir.
