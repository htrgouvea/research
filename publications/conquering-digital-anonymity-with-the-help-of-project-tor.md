---
layout: default
title: Conquering digital anonymity with the help of Project Tor
description:
---

## Introduction

Much has been said about digital anonymity in recent times, but few attempt to do such an act. A good tool that can help with this task is Project Tor!

-

## The Tor Project

Tor (The Onion Router) is a free, open source project that provides personal anonymity when surfing the Internet and online activities, protecting against censorship and especially personal privacy.

It can be understood basically as 3 different things: a network, a protocol or a browser.

  - The project is registered as a non-governmental, non-profit organization;
  - The network provides its users with the privacy to access and publish various content and services;
  - The protocol is defined publicly in technical specifications in the project repositories;
  - The browser is the simplest gateway to access the network.

-

## What is it?!

The project itself defines the term Tor as a network of many server-operated servers that give its users the ability to remain anonymous on the Internet.

In fact, it is a wide range of virtual tunnels that are used between the original connection and the servers/services that users wish to use over the Internet in a way that does not compromise the privacy of these users. Tor also acts as an important tool to combat the censorship attempt and information filters. In addition to providing the possibility for users to access services and content anonymously, it is also possible to publish and serve content anonymously through so-called "onion services". All addresses within the Tor network are identified by an .onion suffix judiciously to the service name/hash that the user wants to access.

Tor can be used on Windows operating systems, Linux kernel, Mac/OSX, and other [BSD/UNIX](https://torbsd.org/) lineage systems.

-

## What is not?

  - The stereotypical image that the film industry created in its films where there were any illicit Internet crime and misconduct.
  - In fact there are some cases in which the project is used to carry out crimes, however, the execution of such actions can easily be performed even without the Tor network existed.
  - The direct connection to a criminalizing image of your users and/or developers.

-

## What is it for?

Using Tor can protect you against various types of attacks or unwanted monitoring, both related to traffic analysis.

Many different e-commerce websites / portals can identify the behaviors of their users and abusively change prices and send differentiated advertisements to their visitors (many may even block or redirect visitors to other portals). With Tor's help you can prevent your behavior from being traced on a public network, or even on a private network.

If you are traveling on vacation and visiting your personal email account through a hotel/motel/hostel network, and it is possible for poorly trained people to intercept your traffic, you may start receiving unwanted messages from the corridors or even at the front desk to be questioned about promotions and other quirky situations.

-

## Who use?

![Image](https://cdn-images-1.medium.com/max/1000/1*bz7UFiVftMFEVuT7jm51Dw.jpeg)

  - I;
  - Journalists and Reporters;
  - Non-Governmental Organizations;
  - Families (concerned about privacy / safety of relatives);
  - Activists and Ciberativists;
  - Universities or Institutes of Technology;
  - Research and Development Companies;
  - ...

-

## How it works?

If you need to access a server or service, briefly, it works like this:

```bash
  Client -> Entry guard -> Relay -> Exit Nodes -> Internet
```

![Image](https://cdn-images-1.medium.com/max/800/1*TDvD1tuMPqQgSweUKRPJAQ.png)

Now, if you need to access an onion service, it works like this:

```bash
  Client -> Entry guard-> Relay -> ~ -> address.onion
```

Each hop that is given into the network has its own encryption layer. The last jump, to the Internet, does not know where the request originally came from.


### Entry guard

It is always the first relay of the circuit, it acts as a support / bridge connection so that you can make the first jump into the Tor network, it occupies an extremely delicate position in the network,
as it is responsible for dealing with the real IP of the user.

### Relay

They are the intermediate relays;

### Exit Relay

They are the nodes that allow you to exit the Tor network and reach portals / servers / services hosted on the Internet.

-


## The layers of the onion

It was no accident that the developers chose an onion to replace the "O" of the acronym Tor. This was because it represents the layers of asymmetric encryption that define the way in which information travels across the network.

The information is encrypted using the public key of relay C, then encrypted using the key of B, and finally, with the public key of A. The original message remains hidden as it is transferred from one node to another, and none of the intermediaries know the origin and the final destination of the data, allowing the sender to remain anonymous.

![Image](https://cdn-images-1.medium.com/max/800/1*bTWtk3gq7tDz_yliBpDUDA.png)

When the circuit is complete, the user can send data over the Internet anonymously. When the final recipient of the data sends data back, the intermediate relays keep the same link back to the user,
with the data layered again, but in reverse, so that the exit relay this time removes the first layer of encryption and the entry guard removes the last layer of encryption before sending the data.

-

## Automating the use of the Tor Network

These lower options are some of the many ways to make use of network tor:

### Tor Browser

The simplest way is to use the browser provided by the project, the [Tor Browser](https://www.torproject.org/download/download-easy.html.en). This is undoubtedly the most recommended way to have your first contact with Tor.

### Whonix

[Whonix](https://www.whonix.org/) is a desktop operating system designed for advanced security and privacy. Whonix mitigates the threat of common attack vectors while maintaining usability. Online anonymity is accomplished through the safe, automatic use and throughout the work area of the Tor network.

### Nipe

[Nipe](https://heitorgouvea.me/nipe/#/is) a Perl script that makes the Tor network its default network gateway, it is available for all Linux distributions.

### Ricochet

[Ricochet](https://ricochet.im) is a different approach to instant messaging that relies on no one to protect your privacy, part of your Core Engine is the Tor project.

### Tails

[Tails](https://tails.boum.org/index.pt.html) is a live operating system that you can use on almost any computer from a USB memory or DVD. It aims to preserve your privacy and your anonymity.

### Orbot

[Orbot](https://guardianproject.info/apps/orbot/) is an Android device application that sets up your smartphone to use Tor as a default proxy on your device.

-

## How to collaborate?

If you found the project interesting and want to help, go to the official project page and find out how to [volunteer](https://www.torproject.org/getinvolved/volunteer.html.en). You can also make a [donation.](https://www.torproject.org/donate/donate-button.html.en)

-

## The cracks in the armor

All this complexity that provides anonymity unfortunately does not provide us with confidentiality, since the final connection to the server is not encrypted at the last relay of the connection, the relay output.

The tor relay directory is public, so a number of sites may block your access when you are browsing through it. This occurs mainly in countries where censorship is very large, directly interfering with the freedom of expression of each individual.

However, fortunately we have the option to use a Bridge, which uses specific protocols to bypass transport-level locks (ISP's and Government).

Although the sent message is transmitted within several layers of encryption, the job of the exit relay, like the final node of the circuit, is to decrypt the last layer and deliver the message to the recipient / server.

A committed exit relay is able to acquire the raw data being transmitted, potentially including passwords, private messages, bank account numbers, and other forms of personal information.

To work around this problem, we can use a secure connection such as TLS or HTTPS.

-

## "But I have nothing to hide, why should I worry about using Tor?"

The answer to this question may even yield another publication, and it really goes !! So follow me here, that soon I will make an exclusive publication on such subject!

-

### About the autor:

[Heitor Gouvêa](https://heitorgouvea.me) is a Information Security Researcher and Technical Writer from Brazil, with over 3 years of experience in the field of offensive security. Author of the anonymity tool [Nipe](https://github.com/GouveaHeitor/nipe), present in several Linux distributions focused on information security such as BlackArch, LionSec and WeakNet.

-
