---
layout: page
title: Projects | Heitor Gouvêa - Independent Researcher
og_image: https://heitorgouvea.me/images/photos/section.jpg
permalink: /projects
description: During my research, I developed some projects in order to solve some types of recurring problems or validate a theory discovered and on this page, you can check out some of these currently open source projects.
---

## Research projects

I developed some projects in order to solve some recurring problems or validate a theory discovered and on this page, you can check out some of these currently open source projects:

---

### [Nipe:](https://github.com/htrgouvea/nipe) an engine to make Tor Network your default gateway

The Tor project allows users to surf the Internet, chat and send instant messages anonymously through its own mechanism. 
It is used by a wide variety of people, companies and organizations, both for lawful activities and for other illicit purposes. Tor has been largely used by intelligence agencies, hacking groups, criminal activities and even ordinary users who care about their privacy in the digital world.
  
Nipe is an engine, developed in Perl, that aims on making the Tor network your default network gateway. Nipe can route the traffic from your machine to the Internet through Tor network, so you can surf the Internet having a more formidable stance on privacy and anonymity in cyberspace.
  
Currently, only IPv4 is supported by Nipe, but we are working on a solution that adds IPv6 support. Also, only traffic other than DNS requests destined for local and/or loopback addresses is not trafficked through Tor. All non-local UDP/ICMP traffic is also blocked by the Tor project.

Link: [https://github.com/htrgouvea/nipe](https://github.com/htrgouvea/nipe)

---

### [Spellbook](https://github.com/htrgouvea/spellbook): micro-framework for rapid development of security tools

Spellbook uses FBP: "In computer programming, flow-based programming (FBP) is a programming paradigm that defines applications as networks of "black box" processes, which exchange data across predefined connections by message passing, where the connections are specified externally to the processes. These black box processes can be reconnected endlessly to form different applications without having to be changed internally. FBP is thus naturally component-oriented."

The main focus of this "micro-framework" is to keep my personal scripts organized and make them available in a structure where I can reuse the code that has already been written to write something else. Here you will find my "spellbook": scripts, exploits and other small things I wrote during my bug hunting jorney, pentesting or red teaming missions.

Link: [https://github.com/htrgouvea/spellbook](https://github.com/htrgouvea/spellbook)

---

### [Nozaki](https://github.com/htrgouvea/nozaki): HTTP fuzzer engine security oriented

"Fuzzing is one of the most powerful and proven strategies for identifying security issues in real-world software" and for this reason, Nozaki tries to bridge the gap for a complete solution focused on web applications.

The idea is that this solution is complete enough to cover the entire fuzzing process in a web application (be it a monolith, a REST API, or even a GraphQL API) being fully parameterized, piped with other tools and with amazing filters.

Link: [https://github.com/htrgouvea/nozaki](https://github.com/htrgouvea/nozaki)

---

### [Uranus](https://github.com/htrgouvea/uranus): an ecosystem of crawlers for detecting: leaks, sensitive data exposure and attempts exfiltration of data

This project is summarized in several crawlers that constitute a single ecosystem, that monitor certain channels such as: Github, Bing, Pastebin and iHaveBeenPwned? in order to perform data leak detection, exposed sensitive files and data exfiltration attempts.

Link: [https://github.com/htrgouvea/nozaki](https://github.com/htrgouvea/nozaki)