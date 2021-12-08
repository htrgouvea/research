---
layout: content
title: 'Scaling Perl Libs security analysis with Differential Fuzzing'
description: 'A technique that can help us strongly on this journey is fuzzing, more specifically the Differential Fuzzing approach due to its ease of implementation and speed. I will illustrate how I have used this approach in some widely used modules to identify divergences, which can lead to bug identification that in some contexts could be a security vulnerability.'
og_image: https://heitorgouvea.me/images/publications/perl-lib-fuzz/fuzzer-output.png
---

### Introduction

Applications have been using the Perl language in their backends for decades, unfortunately the use has been decreasing over time, a consequence of this is the low amount of material on how to make these applications secure, more specifically in modern contexts, but often we can see that some researchers find bugs in software used on a large scale that use this language, such as:

- [RCE in Gitlab's Bug Bounty program](https://hackerone.com/reports/1154542) using [CVE-2021-22204](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-22204) which is an issue in [Exiftool](https://github.com/exiftool/exiftool), tool written in Perl, found by [vakzz](https://twitter.com/wcbowling);
- [CVE-2019-11539](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-11539): RCE on PulseSecure VPN by [Orange Tsai](https://twitter.com/orange_8361);
- URL parsing divergences in Perl libraries, also by Orange Tsai;

This publication aims to illustrate how the differential fuzzing approach can help in this journey, especially on a large scale, introducing some basic concepts about the language and its functioning and later how I made an implementation, tips, lessons and recommendations from this journey.

---

### Introduction to Perl

Before we get into the topics of this publication itself, we need to have some contexts about the Perl language: it is a high-level, interpreted and dynamically typed language. It supports several programming paradigms, it was mainly developed for handling large amounts of strings and with a high performance.

As in other languages, Perl allows the use of codes built by other users, called modules. They are distributed on the CPAN (Comprehensive Perl Archive Network): a repository where Perl software modules and their respective documentation are stored. CPAN also has a program that allows the automatic and simple installation of modules for Perl. [1]

If for some reason you are interested in understanding a little more about how the Perl Interpreter works, a good recommendation to read is: ["Perlinterp - An overview of the Perl interpreter"](https://docs.mojolicious.org/perlinterp). [2]

If you're looking for code examples to familiarize yourself with the language before moving on, I recommend snooping around [some of my repositories on Github](https://github.com/htrgouvea?tab=repositories) [3] or else check out this Style Guide [4].


---

### Issue: Automated Security Analysis

Depending on your goal, performing manual analytics may turn out to be unfeasible, you may need a large scale and shallow depth at the moment and to solve this, automated analytics tools can help a lot - or even give you a direction or understanding of the code to conduct a manual analysis. Unfortunately we have few options related to this topic in Perl.

- **Perl::Critic**: is the most popular solution when it comes to static analysis, its main focus is on code quality but still there are some pointers related to code security.

- **SAST with AppScan**: is a commercial solution, its free version is extremely limited and with few details. I did some tests, with 4 different projects and had a total of 40 findings, but all were false positives;

- **SCA with ActiveState**: another commercial and limited SCA solution in Perl, its CVE's database doesn't seem to be updated but anyway it seems to be the best solution available at the moment;

- **Semgrep & CodeQL**: unfortunately neither of these two wonderful solutions has native Perl support at this point, maybe in the future we will see some implementation;

In addition to the few options, some are commercial solutions and all have several technical limitations.

---

### Differential Fuzzing to hunt logic bugs 

A technique that can help us strongly on this journey is fuzzing, more specifically the Differential Fuzzing approach due to its ease of implementation and speed. I will illustrate how I have used this approach in some widely used modules to identify divergences, which can lead to bug identification that in some contexts could be a security vulnerability.

Differential Fuzzing: in this approach we have our seeds being sent to two or more inputs, where they are consumed and must produce the same output. At the end of the tests, these outputs are analyzed, in case of divergences, the fuzzer will signal a possible failure. [7]

I implemented some extremely simplistic fuzzing cases just to validate how useful this approach would be for the context of this research, its final structure was something like:

![image](/images/publications/perl-lib-fuzz/fuzz-diagram.png)

This project is available on my Github and is easy to use: fuzz.pm [9].

We need to write a test case in YML with the libs that will be audited and which seed file(s) will be used:

![image](/images/publications/perl-lib-fuzz/test-case.png)

Still, we just need to create packages for each module, like our fuzz target, referencing the nomenclature listed above, this way our fuzzer doesn't need details to know which method will be used or the like, examples:

1:

![image](/images/publications/perl-lib-fuzz/1-fuzz-target.png)

2:

![image](/images/publications/perl-lib-fuzz/2-fuzz-target.png)

Example of output of fuzzer:

![image](/images/publications/perl-lib-fuzz/fuzzer-output.png)

---

### JSON Interoperability

Quite frankly, it will be difficult for you to interact directly with an API written in Perl, the chances are greater that these APIs are internal, consumed by another backend, and that's a good thing, as it opens up scope for exploring JSON contexts. Interoperability [5]. As there are many modules in Perl to handle this type of information, the attack margin ends up being quite large. Here we will cover the 4 most used modules based on CPAN;

![image](/images/publications/perl-lib-fuzz/json-libs.png)

In this case, 8 different JSON entries were provided, taken from Bishop Fox's research on the topic [5]. To better illustrate, I'll leave a table below with all the detailed view of the outputs:

![image](/images/publications/perl-lib-fuzz/json-output.png)


Based on this output, a small challenge came to my mind that a co-worker [rick2600](https://twitter.com/rick2600) showed me some time ago:

![image](/images/publications/perl-lib-fuzz/source-code-chall.png)

This small piece of code is a simple implementation of a mechanism to buy some items, as the user enters his name at the beginning of the journey and has a starting balance of 10000.

![image](/images/publications/perl-lib-fuzz/chall-demo.png)

Reading the code, we can see that our user can use his starting balance to buy almost all the products, except item 4. If he could do that, he could get a shell on the machine hosting the application because after this feat a system function is called .

We have 3 entry-points here:

1. When we inform our name;
2. When we say which item we want to buy;
3. How much do we want to buy;

The fact of the name can be discarded, as this information is not used for the logic of the algorithm. The implementation regarding which item we want to buy would also not lead us to be able to acquire item 4.

![image](/images/publications/perl-lib-fuzz/example-buy.png)

The entrypoint related to item quantity allows us to do this in two ways. The first possibility being:

- Inform a fractional amount enough so that after multiplied by the value of the product, it would be less than the balance:

![image](/images/publications/perl-lib-fuzz/frac-number.png)

Inform NaN or a representation thereof:

![image](/images/publications/perl-lib-fuzz/nan-demo.png)

Original script in Python: [https://gist.github.com/rick2600/1a815905cf2dd8bca5e4a98e27144e6d](https://gist.github.com/rick2600/1a815905cf2dd8bca5e4a98e27144e6d)

The idea of using this little challenge, is to exemplify that through an API we could use this interpretation of some Perl modules that results in NaN to exploit a logical bug.

---

### Abusing of URL Parsing

In Perl, we still have a wide variety of modules for URL parsing and also for requests, which can be used as a complement to each other. Therefore, I also adopted the differential fuzzing solution for the most common libs at the time of this research:

![image](/images/publications/perl-lib-fuzz/urls-libs.png)

From the research produced by Orange Tsai, I made the same implementation in a larger amount of libs, I used the same samples but with the use of ramdasa to generate just a few more tests and again it was possible to see many divergences, unfortunately I didn't find anything exploitable in a real context so far:

![image](/images/publications/perl-lib-fuzz/urls-demo.png)

---

### Others targets works

Also in this research, I implemented the same technique for email validator libs, ORMs and regex engines. I managed to identify some divergences and I'm in contact with the project maintainers to assess whether there will be a correction or not, because of this and some other details, I preferred not to list here which were the other libs.

---

### Conclusion

The idea of this publication was to illustrate how simple, fast and powerful the differential fuzzing technique can be, especially in this context to analyze the security of dependencies that are created and maintained by third parties.

I would like to take the end of this post to thank a friend in particular, who has been helping me a lot in several implementations, not only in this research but in others: thanks [LvMalware!](https://twitter.com/lvmalware)


---

### Bonus Tip 

Through the discrepancies found, you can use your knowledge of code auditing to review key points in the library and then find valid security bugs.

After you've found some divergences, it's likely that you're doing a white-box analysis, two modules that might make your job easier are:

- **Data::Dumper**: can help you understand how a dataset is being presented in some part of the flow, whether it is a string, array, hash and also what the hierarchy of attributes is;
- **Devel::StackTrace**: is an object representation of Stack Trace, it can bring you a lot of information about the program flow;

As applications written in Perl are not something you see every day, it is common that standard wordlists do not have paths that these applications normally use, so a first step is to include the following values ​​in your wordlist:

- **cpanfile**: it's like a package.json or requirements.txt, this file specifies which modules the application uses, this can help your understanding of the app or even identify a module with public vulnerabilities;
- **app.conf** or **app.psgi**: naming commonly used for configuration files of an application written in Perl;
- **.perlcriticrc**: Perl Critic configuration file, a module that does static code analysis and points out best practices in the language;
mojo.log: debug file created by Mojo framework;

---

### References

- [1] [https://www.cpan.org/](https://www.cpan.org/)
- [2] [https://docs.mojolicious.org/perlinterp](https://docs.mojolicious.org/perlinterp)
- [3] [https://github.com/htrgouvea?tab=repositories](https://github.com/htrgouvea?tab=repositories)
- [4] [https://github.com/htrgouvea/perl-style-guide](https://github.com/htrgouvea/perl-style-guide)
- [5] [https://labs.bishopfox.com/tech-blog/an-exploration-of-json-interoperability-vulnerabilities](https://labs.bishopfox.com/tech-blog/an-exploration-of-json-interoperability-vulnerabilities)
- [6] [https://www.blackhat.com/docs/us-17/thursday/us-17-Tsai-A-New-Era-Of-SSRF-Exploiting-URL-Parser-In-Trending-Programming-Languages.pdf](https://www.blackhat.com/docs/us-17/thursday/us-17-Tsai-A-New-Era-Of-SSRF-Exploiting-URL-Parser-In-Trending-Programming-Languages.pdf)
- [7] [https://en.wikipedia.org/wiki/Differential\_testing](https://en.wikipedia.org/wiki/Differential_testing)
- [8] [https://defparam.medium.com/finding-issues-in-regular-expression-logic-using-differential-fuzzing-30d78d4cb1d5](https://defparam.medium.com/finding-issues-in-regular-expression-logic-using-differential-fuzzing-30d78d4cb1d5)
- [9] [https://github.com/htrgouvea/vulnerability-research/tree/main/fuzz.pm](https://github.com/htrgouvea/vulnerability-research/tree/main/fuzz.pm)
- [10] [https://github.com/orangetw/Tiny-URL-Fuzzer](https://github.com/orangetw/Tiny-URL-Fuzzer)