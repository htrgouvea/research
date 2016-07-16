---
layout: post_layout
title: Nipe: script to redirect all traffic from the machine to the Tor network!
time: 15/07/2016
location: São Paulo, Brazil
pulished: true
excerpt_separator: "#"
---

![Image](https://cdn-images-1.medium.com/max/600/1*S9xp2RtovtrimwSc-LBatA.png)

The nipe is a tool written in Perl Script, it use the Tor project and iptables,
to create routing rules, forcing all traffic to pass in the Tor network.

Download nipe:

```bash
    git clone https://github.com/GouveaHeitor/nipe
    cd nipe
```

Install dependecies:

```bash
    sudo cpan install Switch JSON LWP::UserAgent
```

Install nipe:

```bash
    sudo perl nipe.pl install
```

Start nipe:

```bash
    sudo perl nipe.pl start
```

Stop nipe:

```bash
    sudo perl nipe.pl stop
```

![Image](https://cdn-images-1.medium.com/max/800/1*prMxBsonY40OqtfFgqUwJQ.jpeg)