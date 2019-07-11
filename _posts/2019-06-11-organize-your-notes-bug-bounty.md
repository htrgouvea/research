---
layout: blog
title: How to better organize your notes while hunting for bugs
category: stories
og_image: https://heitorgouvea.me/files/0x01/home.png
---

<blockquote align="center" class="twitter-tweet" data-lang="pt"><p lang="en" dir="ltr">Maybe one of the most valuable tips I can give you all is: be organized<br><br>Due to the extreme amount of targets, techs, payloads and differents contexts, it is very easy to get lost and don&#39;t give enough attention to some of the most important details during your hunt<a href="https://twitter.com/hashtag/bugbountytip?src=hash&amp;ref_src=twsrc%5Etfw">#bugbountytip</a></p>&mdash; Heitor Gouvêa (@GouveaHeitor) <a href="https://twitter.com/GouveaHeitor/status/1129142073305784323?ref_src=twsrc%5Etfw">16 de maio de 2019</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

--

A while time ago I did a Tweet about the importance of the effective organization on your annotations for Bug Bounty Hunting and I was asked about how I do it and through this article, I want to share my favorite tool.

## SwiftnessX: "A cross-platform note-taking & target-tracking app for penetration testers"

![Image](/files/0x01/home.png)

Certainly, my favorite tool for information organization is [Swiftness.](https://github.com/ehrishirajsharma/SwiftnessX) I discovered it through my Github feed and as soon as I used it for the first time I found myself in love with all the ease and dynamics it delivers.

Swiftness is a cross-platform (Windows, Linux, and MacOS) annotation software for Pentesters/Bug Bounty Hunters made in ElectronJS.

### Templates

The first feature that I want mention is the section of "Templates", with the content templates for reports, you are reusing reports that you already write in another moment, example:

![Image](/files/0x01/templates.png)

### Payloads

In addition, Swiftness has an excellent solution for you to save your Payloads in an organized way:

![Image](/files/0x01/payloads.png)

### Libraries

Through the Libraries you are able to pre-establish a workflow/checklist that you will follow during your hunting:

![Image](/files/0x01/libraries.png)

This for example is a Checklist based on OTGv5. You can download the same by [clicking here](https://raw.githubusercontent.com/ehrishirajsharma/swiftness-static/master/Checklist/OWASP-Testing-Checklist.json). You can create your own Libraries.

-

Switness is an incredible tool, but it by itself is still not enough. I still use a structured folder organization for the files, Quiver for more essay notes, the option for projects in the Burp Suite, and I also try to make my API-related tests in Insomnia well organized. Maybe someday I can write a little more about this in more detail.