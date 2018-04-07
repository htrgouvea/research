---
layout: default
title: The anatomy of port scanning, playing with sockets
description:
---

## The anatomy of port scanning, playing with sockets

### Introduction:

A long time ago the simplest way to perform a port scanning was to use Telnet, manually, a very archaic method. However, today we have more
sophisticated solutions, with a lot of scanning methods and extremely effective.

This paper aims to approach in a didactic, simple and fast the different methods of scanning that tools like Nmap perform in an automated way.

-

### Open Scan:

Also known as TCP Scan, this technique is old and works in a way as if we were doing a full connection
with the server, just as Telnet does. This is the case when the user does not have privileges to create raw packets or scan IPv6 networks.
Instead of creating raw packets like most other scan types do, you ask the operating system to establish a connection to the machine and
port by sending a connect() system call. This is the same high-level call as web browsers, P2P clients, and most other applications for
network to establish a connection.

This makes a connection with 3 packets, known as "three-way-handshake":

For open ports we have:

```bash
      Client ---->   SYN   ---->
            <---- SYN/ACK <---- Server
      Client ---->   ACK   ---->
```

For closed ports we have:

```bash
      Client ---->   SYN   ---->
             <----   RST   <---- Server
```

The system call completes the connections on the open target ports instead of performing the half-open port reset that the SYN scan does. This not only takes more time and requires
more packets to get the same information, but also makes it more likely that the target machines will log the connection.

A decent IDS system will detect this easily, but most machines do not have this type of alarm system. Many services on most Unix systems will add a note in syslog,
and sometimes an obscure error message, when your scanner connects and then closes the connection without sending any data. Truly pathetic services will crash when this happens, although this is unusual. An administrator who sees a handful of connection attempts in records from a single system should know that it has been scanned with connect().

* Pros: very easy to program.

* Cons: very easy to detect and generates many logs.

-


### Half Open Scan

-

### About the autor:

[Heitor Gouvêa:](https://heitorgouvea.me) with more than 3 years of experience in the field of information security offensive, now acts as Pentester Freelancer besides being the main developer of the [project Nipe](https://github.com/GouveaHeitor/nipe), tool responsible for guaranteeing anonymity to its users, present in various Linux distributions such as: Black Arch, Weak Net and LionSec Linux.

*
 If you think the writer of this text has some potential, take a look at the other things I create. I have a weekly [newsletter](https://heitorgouvea.me/newsletter) on possibly interesting things and I even think about creating a youtube channel in the future. But seriously, [subscribe to the newsletter](https://heitorgouvea.me/newsletter) that is very legal and this is the way we can continue to exchange ideas.
