---
layout: default
title: 'A technical overview about the Nipe'
description: 'Tor enables users to surf the internet, chat and send instant messages anonymously,  and is used by a wide variety of people for both licit and illicit purposes. Tor has, for example, been used by criminals enterprises, hacktivism groups, and law enforcement  agencies at cross purposes, sometimes simultaneously.'
# og_image: https://heitorgouvea.me/images/
---

# [DRAFT POST] A technical overview about the Nipe


## Summary

Tor enables users to surf the internet, chat and send instant messages anonymously,  and is used by a wide variety of people for both licit and illicit purposes. Tor has, for example, been used by criminals enterprises, hacktivism groups, and law enforcement  agencies at cross purposes, sometimes simultaneously.

This Perl script enables you to directly route all your traffic from your computer to the Tor network through which you can surf the internet anonymously without having to worry about being tracked or traced back.

Currently Nipe only supports IPv4, we are working on a solution to add IPv6 support and also only traffic other than DNS requests destined for local/loopback addresses is not passed through Tor. All non-local UDP/ICMP traffic is blocked.


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

### License and Contribuitions
 
This work is licensed under [MIT License](https://github.com/GouveaHeitor/nipe/blob/master/LICENSE.md) and your contributions and suggestions are heartily♥ welcome. [See here the contribution guidelines.](https://github.com/GouveaHeitor/nipe/blob/master/.github/CONTRIBUTING.md) Please, report bugs via [issues page on Github.](https://github.com/GouveaHeitor/nipe/issues)(✿◕‿◕) 

-

### Referencies

- [https://github.com/GouveaHeitor/nipe](https://github.com/GouveaHeitor/nipe)