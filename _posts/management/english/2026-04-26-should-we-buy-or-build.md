---
layout: content
title: 'Should we buy or build?'
description: 'A reflection on engineering decisions between buying and building, competitive differentiation, maintenance cost, time to value, and technical identity.'
og_image: https://heitorgouvea.me/images/photos/section.jpg
---

During the time I worked at Nubank, one of the things that most caught my attention was the engineering culture behind technical decisions. Nubank was built, from its earliest days, on the premise that high-caliber engineers solve hard problems by building their own solutions. That culture created extraordinarily capable teams, but it also often put us in front of a subtle trap: the tendency to build everything internally, not because it was the right decision, but because building was part of the team's identity.

That experience taught me that the question "should we buy or build?" is, in fact, poorly framed. Not because it is invalid, but because the way it is usually asked assumes a binary choice that rarely matches reality. In practice, almost no engineering decision is purely one thing or the other. You always build on foundations you did not create. You always buy components that someone else chose to abstract for you. The more precise question is: how far should we build, and from which point should we buy?

Understanding this completely changes the analytical frame.

## The invisible cost of building

When a strong technical team faces a problem, its natural inclination is to build. There are several legitimate reasons for this: full control over the solution's behavior, the ability to adapt it to the specific business context, the absence of external dependency, and, in many cases, the genuine pleasure of solving complex problems from scratch. In environments with high technical density, like the ones I experienced at Nubank, this inclination is almost gravitational.

The problem is that building has costs that rarely appear in the initial proposal. The most obvious cost is development time. But there is another one, less visible and more dangerous: the long-term cost of maintenance. An internally built solution needs someone to maintain it, evolve it, document it, and onboard new team members who need to understand it. In fast-growing teams, this becomes technical debt before it even becomes a mature product. And in teams with turnover, it becomes a legacy system without an owner before it is two years old.

Charlie Munger, Warren Buffett's partner, had a principle that applies well here: before solving a problem, invert it. Instead of asking "why should we buy?", ask "what are the reasons not to build?". This inversion exercise forces the team to confront the real costs of building before romanticizing it.

## Differentiation versus parity

One of the most useful frameworks I have found to structure this decision comes from Niel Nickolaisen, and it starts with a simple question: does this process or capability differentiate us in the market, or does it merely keep us competitive?

Nickolaisen proposes evaluating any process or system across two dimensions: the degree to which it differentiates the company in the market, and the degree to which it is essential to the business mission. Processes that are both differentiating and essential deserve maximum investment. They are the ones that attract customers, create competitive advantage, and need to be better than what any competitor offers. Here, building makes sense, because the solution needs to reflect a unique understanding of your problem.

But most processes and systems do not fit into that category. Most of what an engineering team maintains is essential for the business to operate, but does not differentiate the company from any competitor. An authentication system, a CI/CD pipeline, a monitoring solution: all of them are critical, but none of them will make a customer choose your product over a competitor's. For these systems, the goal is not to be better than the competition; it is to be at the same level. Treating parity processes as if they were differentiators is one of the most efficient ways to waste engineering capacity.

The sentence that best summarizes this principle is: build to differentiate, buy to reach parity.

## Time to value

Another angle that needs to be part of the analysis is time. Building takes time. And time, in product contexts, is opportunity cost. Every sprint dedicated to building an internal monitoring solution is a sprint that was not dedicated to a feature that could generate revenue, retain customers, or reduce churn.

This does not mean that building is always wrong when there is a ready-made solution in the market. It means the opportunity cost needs to be made explicit before the decision. A bought solution, even an imperfect one, that can be put into production in two weeks must be compared honestly with an internally built solution that will take four months to reach the same functional coverage. In many cases, time to value is the factor that decisively tilts the decision.

At Nubank, we learned this in the most concrete way possible: there were tools we built with great technical pride, that worked very well, but that consumed the capacity of entire teams just to keep existing. In some cases, looking back, the right decision would have been to buy a good-enough solution and redirect that team toward the problems that truly no one else in the market knew how to solve.

## The trap of technical identity

The hardest point to recognize is when the decision to build is not being guided by analysis, but by identity. Very strong technical teams often associate their competence with the ability to build complex things. There is legitimate pride in that. But this pride can distort judgment when it starts influencing decisions that should be treated as pragmatic choices.

An Engineering Manager or Engineer Lead/Staff+ needs to watch for this bias. The question is not "are we capable of building this?". In a strong technical team, the answer to that question is almost always yes. The relevant question is "is building this the best use of this team's capacity right now?". And that is a question that requires putting ego aside.

One of the ways Nubank found to partially address this problem was through the RFC process. Before a relevant technical decision was made, it was formalized in a document describing the problem, the options considered, and the trade-offs of each one. That document circulated among technical stakeholders and received comments before any implementation began. The process does not eliminate subjectivity, nor could it, because every engineering decision carries some degree of judgment. But it creates a surface where implicit biases become exposed. A comment from someone outside the team was often enough to identify that the preference for building was being justified with technical arguments that were, in reality, masking a cultural inclination. This kind of healthy friction is hard to create any other way.

Some of the best technical decisions I have ever seen were decisions not to build. To adopt an existing solution, even an imperfect one, and concentrate energy on the problems that truly required a custom answer because no product in the market could offer it.

## A process for the decision

In practice, when a team faces this kind of choice, a few questions help structure the analysis. First: is this problem a competitive differentiator or a parity requirement? If it is parity, the initial presumption should be to buy. Second: what is the total cost of building, including maintenance, documentation, and onboarding over the next two years? Third: how long will it take for each option to start generating value for the business? Fourth: what are the boundaries between what we will build and what we will buy, and what are the contracts across those boundaries?

That last question is especially important. The discussion between buying and building is not only about the initial choice. It is about understanding where one solution ends and another begins, and ensuring those boundaries are explicit, documented, and understood by the team. Many integration and maintenance problems are born not from bad choices between buying and building, but from the lack of clarity about where each component starts and ends.

The decision between buying and building has no universal answer. But it does have an approach. And high-performing technical teams distinguish themselves not by their ability to build anything, but by the wisdom to know when not to build.
