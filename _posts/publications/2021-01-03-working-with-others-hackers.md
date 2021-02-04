---
layout: content
title: 'Working with others hackers on the same targets/bounty'
description: 'In the last year I had the privilege of making some collabs with incredible hackers and from this opportunity came many learnings, in addition to learning about new techniques, bypass executions in super restricted resources, creative chains and etc, I was also able to learn and try ways to organize/synchronize information, discussions and any other topic that was relevant to success at the end of Pentest/Hunting'
og_image: https://heitorgouvea.me/images/publications/collab-methology/commits.png
---

### Summary

Working with other people in the same Pentest or Bug Bounty Target is always motivating because it is a unique experience where you share your knowledge with others and also learn a lot. However, it is not easy to stay organized between the number of applications, features, different technologies and still be synchronized with what the other person is doing or has already done and this ends up being the cause of some problems.

In the last year I had the privilege of making some collabs with incredible hackers and from this opportunity came many learnings, in addition to learning about new techniques, bypass executions in super restricted resources, creative chains and etc, I was also able to learn and try ways to organize/synchronize information, discussions and any other topic that was relevant to success at the end of Pentest/Hunting.

---

### Communication is the key of success

Before going into more technical topics, I would like to reinforce this point: “good communication is the key to success”. Talk to the other people involved in this collab, ask about everything, try to suggest different ways to arrive at a more elegant solution or something like that. Remember that the collab is your opportunity to get the best out of each one.

Great communication tools you can use:

- Slack: it offers several rooms for communication on different topics, you can share rooms for each Bug Bounty Program or for each client of your company if it is a consultancy. In addition it has support for “syntax highlighting" which can help a lot when it is necessary to share a PoC;

- Google Meeting: if you have the opportunity to hold a meeting with the other people involved in the collab it will also make a difference, because via meeting you can share your screen and explain a complex flow in the application, you can demonstrate with feelings what you really want say about an intuition and so on...

---

### BurpSuite Team Extension

I can say with conviction that at some point you asked for help from your collab partner and to illustrate the problem you sent a screenshot of the request / response from Burp Suite, right? What if you could just send the requisition ready to your partner's repeater? Or something that is on your intruder?

It would be awesome, wouldn't it? The BurpSuite Team extension was created just to solve this. Tanner Barnes presented this extension on [BSidesLV](https://www.youtube.com/channel/UCpNGmljppAJbTIA5Msms1Pw) in 2019 on the talk “**Burpsuite Team Collaborator: Enabling Collaborative App Testing**”.

Github repositorie: [https://github.com/Static-Flow/BurpSuite-Team-Extension](https://github.com/Static-Flow/BurpSuite-Team-Extension)

I met this extension at the end of 2020 and I simply found the experience magnificent, since then I always use it when I'm in a collab. I recommend that you watch Tanner's talk to understand the dynamics of the extension:

<iframe width="708" height="398" src="https://www.youtube.com/embed/OvMdwRQSSe0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

---

### Git and Github?! WTF?!

In a Pentest/Bug Bounty where more than 3 or 4 people are collaborating, it is very common to have rework and non-sharing of information. The way I found to get around these problems was to create a private repository on Github dedicated to the Bug Bounty program, so that everyone involved in the process can synchronize with the information obtained in recon, exploits that have been developed, past reports, new identifications and everything else.

To illustrate a little better, I will use an Adobe repository (public program) that I worked on recently. At the beginning we created a simple folder structure to organize the information and then we left to do the recognition. At the beginning our repository looked something like this:

![](/images/publications/collab-methology/first-repo.png)

We identified some hosts that were in scope, active web service ports, we used waybackurls to find URLs and during this process it was possible to learn more about the environment, making it possible to identify an Open Redirect and a PII leak. (Obviously it didn't happen in 5 minutes)

We started by putting "little" information in the repository because we thought that this way we would avoid a flood of information.

Can you imagine how useful Github was at that time? We were able to share a very large amount of information in a few seconds, with just a "git add/push" and a "git pull" performed.

After that, we identified one more feature of Github that would help us: the possibility of opening threads on specific commits.

![](/images/publications/collab-methology/commits.png)

Unfortunately, I can't use better examples of discussions because I want to avoid any kind of leakage of information about this program, but I think that through this image you can already imagine how interesting this functionality is.

Another positive point is the power of file synchronization through "git pull":

![](/images/publications/collab-methology/git-pull.png)

It is also possible to use the MarkDown resources of Github to write the reports collaboratively before sending it on the actual platform.

Anyway, I don't want to go into this topic of Git / Github, but show that you can use this tool as a means of collaboration.

---

### Conclusion

The practices reflected in this article work for my reality, but they may not be as effective for yours. I advise you to focus on the conceptual part of each solution and not on the tools so that you will be able to find the best resources to solve your problems.

---

### References

- [https://slack.com](https://slack.com/)
- [https://en.wikipedia.org/wiki/Syntax_highlighting](https://en.wikipedia.org/wiki/Syntax_highlighting)
- [https://meet.google.com](https://meet.google.com/)
- [https://github.com/Static-Flow/BurpSuite-Team-Extension](https://github.com/Static-Flow/BurpSuite-Team-Extension)