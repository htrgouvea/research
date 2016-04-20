---
layout: post
title:  "Nipe: script to redirect all traffic from the machine to the Tor network!"
---

![Image](https://cdn-images-1.medium.com/max/600/1*S9xp2RtovtrimwSc-LBatA.png)

The nipe is a tool written in Perl Script, it use the Tor project and iptables,  to create routing rules, forcing all traffic to pass in the Tor network.

Download nipe:

{% highlight bash %}
git clone https://github.com/HeitorG/nipe
cd nipe
{% endhighlight %}

Install dependecies:

{% highlight bash %}
sudo cpan install Switch WWW::Mechanize LWP::Protocol::https
{% endhighlight %}

Install Nipe:

{% highlight bash %}
sudo perl nipe.pl install
{% endhighlight %}

Start the Nipe:

{% highlight bash %}
sudo perl nipe.pl start
{% endhighlight %}

Stop the Nipe:

{% highlight bash %}
sudo perl nipe.pl stop
{% endhighlight %}

The End!! Bye =P

![Image](https://cdn-images-1.medium.com/max/800/1*prMxBsonY40OqtfFgqUwJQ.jpeg)