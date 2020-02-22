---
layout: content
title: 'Anonymizing your traffic in cyberspace: a approach about TOR Network'


description: 'TOR enables users to surf the internet, chat and send instant messages anonymously,  and is used by a wide variety of people for both licit and illicit purposes. TOR has, for example, been used by criminals enterprises, hacktivism groups, and law enforcement  agencies at cross purposes, sometimes simultaneously.'
og_image: https://heitorgouvea.me/images/publications/nipe-research/thumb.png
---

![Image](/images/publications/nipe-research/logo.png){:height="230px" width="180px"}

## WARNING

This post is still a draft, so a lot of things here won't make much sense at first, but it's continually being updated with new content, restricted changes, and so on.

-

## Introduction

TOR enables users to surf the internet, chat and send instant messages anonymously,  and is used by a wide variety of people for both licit and illicit purposes. Tor has, for example, been used by criminals enterprises, hacktivism groups, and law enforcement  agencies at cross purposes, sometimes simultaneously.

This Perl script enables you to directly route all your traffic from your computer to the TOR network through which you can surf the internet anonymously without having to worry about being tracked or traced back.

Currently Nipe only supports IPv4, we are working on a solution to add IPv6 support and also only traffic other than DNS requests destined for local/loopback addresses is not passed through TOR. All non-local UDP/ICMP traffic is blocked.

-

## Whats is TOR?
### The basic about TOR
### TOR VS VPN

-

## Using Nipe

### Download and install:

```bash
    # Download
    $ git clone https://github.com/GouveaHeitor/nipe
    $ cd nipe

    # Automatic installation
    $ chmod +x setup.sh
    $ ./setup.sh
    
    # Manual installation
    $ cpan install Switch JSON LWP::UserAgent Config::Simple
    $ perl nipe.pl install
```

### Commands:

```bash
    COMMAND          FUNCTION
    install          Install dependencies
    start            Start routing
    stop             Stop routing
    restart          Restart the Nipe process
    status           See status

    Examples:

    perl nipe.pl install
    perl nipe.pl start
    perl nipe.pl stop
    perl nipe.pl restart
    perl nipe.pl status
```

-

## Internal Engineering

### A little about the code

Nipe follows some specific guidelines in its code, the first of which is the code design standard, referenced by: ["Perl Style Guide"](https://github.com/GouveaHeitor/perl-style-guide). In addition, the Design Pattern adopted is [FBP - Flow-Based Programming](), together with the concept of ["Minimalist Architecture"]();

### Install
### Start
### Stop
### Status

-

### License and Contribuitions
 
This work is licensed under [MIT License](https://github.com/GouveaHeitor/nipe/blob/master/LICENSE.md) and your contributions and suggestions are heartily♥ welcome. [See here the contribution guidelines.](https://github.com/GouveaHeitor/nipe/blob/master/.github/CONTRIBUTING.md) Please, report bugs via [issues page on Github.](https://github.com/GouveaHeitor/nipe/issues)(✿◕‿◕) 

-

### Referencies

- [Nipe](https://github.com/GouveaHeitor/nipe)
- [About TOR Browser](https://tb-manual.torproject.org/about/)
- [TOR Documentation](https://2019.www.torproject.org/docs/documentation.html.en)
- [Perl Style Guide](https://github.com/GouveaHeitor/perl-style-guide)