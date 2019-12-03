---
layout: default
title: '#HFBR19 Final - Solving "Login" programming challenge'
description: 'The final was about 4 hours long, and we had 10 challenges to solve: 8 of them were challenges related to exploiting Web vulnerabilities, and the rest were related to programming, and this publication aims to explain how the second challenge of programming can be solved.'
og_image: https://heitorgouvea.me/images/publications/ctf-hfbr/timeout.png
---

# #HFBR19 Final - Solving "Login" programming challenge


## Introduction

The #HFBR19 is a Brazilian CTF that took place throughout 2019, organized by the Hackaflag team. This CTF had 12 in-class qualifiers, where each qualifier was held within Roadsec (an itinerant event that takes place in Brazil), ie each qualifier was held in a different state of Brazil, thus ensuring a finalist from each region of the country. I was classified in the first quals, which took place at the beginning of the year, in the city of Campinas, interior of São Paulo, and later competed in the final that took place in November. 

The final was about 4 hours long, and we had 10 challenges to solve: 8 of them were challenges related to exploiting Web vulnerabilities, and the rest were related to programming, and this publication aims to explain how the second challenge of programming can be solved.

-

### The challenge

Within the Hackaflag platform, when the challenge was selected, the information you obtained was as follows:

![Image](/images/publications/ctf-hfbr/the-challenge.png)

The only information we had was an IP and a port, so my first move was to use Netcat to try to discover something new, the response of the request is:

![Image](/images/publications/ctf-hfbr/server.png)


Shortly after the ASCII Art illustrated above, there is a value input field, if we do not fill it in, within seconds we receive the following timeout message:

![Image](/images/publications/ctf-hfbr/timeout.png)

Interacting a little more with this service, we can see the following behaviors, sending the value A, we receive the following response:

![Image](/images/publications/ctf-hfbr/send-A.png)

And, sending the value Z, we receive the following response:

![Image](/images/publications/ctf-hfbr/send-Z.png)

-

### Resolution

Well, with a little more time and intersections with this service, you would realize that it has only this one behavior.

The logic I framed to solve this challenge at first was that I needed the answer always to be the "." blue, so I decided to make a kind of brute-force, at first, with only one character.

To make this faster, I developed a Perl script that automates all this, let's call it: exploit.pl. This is his content at first:

```perl
#!/usr/bin/env perl

use 5.018;
use strict;
use warnings;
use IO::Socket::INET;

my $target = "142.93.73.149";
my $port   = "23112";

if ($target && $port) {
    say "[ ! ] -> Target: $target:$port";

    my $data  = "";
    my @chars = 'A'..'Z';

    foreach my $char (@chars) {
        my $socket = IO::Socket::INET->new(
            PeerAddr => $target,
            PeerPort => $port,
            Proto    => "tcp",
            Timeout  => "10",
            Reuse    => "1",
        );

        sleep (1);

        $socket -> autoflush(1);
        $socket -> recv($data, 9216);

        if ($socket) {
            $socket -> send($char);
            $socket -> recv($data, 1024);

            say "[ - ] Send -> $char \t Response ->$data";
        }

        close ($socket);
    }
}
```

What this script does is very simple: we have an array with values from A to Z, our script goes through this Array sending one character at a time to the target server and captures each response, while executing this process, we print this action on the screen.
And this is the result obtained:


![Image](/images/publications/ctf-hfbr/first-result.png)

We can see that when we send the characters A through H, we get the blue response, which represents success, and any character sent after H, returns red, signaling that we are doing something wrong. From this behavior, we can conclude that the correct first letter is the letter H, because after that letter we only have the server error response.

From this point, the next step is to try to capture the next letter, we can add the letter H directly to our code that will be sent, and try to capture the next letter:

![Image](/images/publications/ctf-hfbr/second-result.png)

We quickly identified that the next correct letter is A. And, doing this a few more times, we will get to the following string: "HACKAFLAG". However, this is not our flag yet, we need to keep doing this brute-force to capture the rest of it. But we are only working with A through Z, and the flag is made up of other values, such as numbers, lowercase letters, and special characters.

Therefore, we need to add to our character array all these values. A good way to do this is to copy this data from the ASCII table in order to avoid any other problems. In the end, the array you will use should look like this:

```perl
    my @chars = (
        "!", "\"", "#", "\$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/",
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":",  ";", "<", "=", ">", "?", "@",
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",  "N", "O", "P", "Q",
        "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^",  "_", "`", "a", "b",
        "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
        "u", "v", "w", "x", "y", "z", "{", "|", "}", "~"
    );
```

And then we can continue with brute-force:

![Image](/images/publications/ctf-hfbr/third-result.png)

So far, we have the following piece of the flag: "HACKAFLAG {", so we can assume this is really working. However, if we keep running our script this way, and keep interacting the value manually, it will take a long time before we can find the flag, as well as being a rather boring activity and of course we can automate it.

Our code, with intelligent automation of interaction and continuity would look like this:

```perl
#!/usr/bin/env perl

use 5.018;
use strict;
use warnings;
use IO::Socket::INET;
use Digest::MD5 qw(md5_hex);

my $target = "142.93.73.149";
my $port   = "23112";
my $flag   = "";

sub find {
    my $char = shift;
    my $data = "";

    my $socket = IO::Socket::INET -> new (
        PeerAddr => $target,
        PeerPort => $port,
        Proto    => "tcp",
        Timeout  => "10",
        Reuse    => "1",
    );
            
    sleep (2);

    $socket -> autoflush(1);
    $socket -> recv($data, 9216);
            
    if ($socket) {   
        my $payload = $flag . $char;

        $socket -> send($payload);
        $socket -> recv($data, 1024);

        print "[ - ] Send -> $payload \t Response ->$data\n";

        if (md5_hex($data) eq "41b55689188cd3005192b7cf33c8075f") {
            $flag = $payload;
            return main();
        }
    }

    close ($socket);
}

sub main {
    my @chars = (
        "!", "\"", "#", "\$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", "/",
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":",  ";", "<", "=", ">", "?", "@",
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",  "N", "O", "P", "Q",
        "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "[", "\\", "]", "^",  "_", "`", "a", "b",
        "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
        "u", "v", "w", "x", "y", "z", "{", "|", "}", "~"
    );

    foreach my $char (reverse @chars) {
        my $find = find($char, $flag);
    }

}

main();
exit;
```

Demo:

<iframe width="750" height="450" src="https://www.youtube.com/embed/ZgV3UUH3DM4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

-

## Conclusion

To conclude this post, I would just like to thank all [Hackaflag Team](https://hackaflag.com.br), and especially [Jeremias](https://twitter.com/) for this super interesting challenge!

-

### Referencies

- [ctf.hackaflag.com.br](https://ctf.hackaflag.com.br/)
- [ASCII Table](https://pt.wikipedia.org/wiki/ASCII)
