---
layout: page
title: Perl Style Guide - A starting point for Perl development teams to provide consistency through good practices
description: 'This paper is summarized in some good practice guidelines for Perl coding using "post-modern" practices. This work is in progress and any suggestions/contributions are welcome. This project is just one of several other coding style guides, there is no intention of setting a pattern from it. Please do not take this as absolute truth. The most important thing here is that you and your team feel comfortable with a certain guideline and make use of it.'
permalink: /projects/perl-style-guide
---

<p align="center">
  <h3 align="center">Perl Style Guide</h3>
  <p align="center">A starting point for Perl development teams to provide consistency through good practices</p>
  <p align="center">
    <a href="/LICENSE.md">
      <img src="https://img.shields.io/badge/license-MIT-blue.svg">
    </a>
    <a href="https://github.com/htrgouvea/perl-style-guide/releases">
      <img src="https://img.shields.io/badge/version-0.1.7-blue.svg">
    </a>
  </p>
</p>

---

#### Summary

This paper is summarized in some good practice guidelines for Perl coding using "post-modern" practices. This work is in progress and any suggestions/contributions are welcome.

This project is just one of several other coding style guides, there is no intention of setting a pattern from it. Please do not take this as absolute truth. The most important thing here is that you and your team feel comfortable with a certain guideline and make use of it.

This paper is a fork of the paper written by [Eric Lorenzana](https://github.com/chusqui/perl-style-guide), with only a few changes in the sense of organization of the material and some adjustments to current market practices. 

---

#### Code layout

- Avoid using comments: your code must be self explanatory, using comments proves that it is a confusing code.

- Make use of the "strict" and "warnings" modules in all your codes, they provided you:
    1. strict: It forces you to code properly to make your program less error-prone. For example: It forces you to declare variables before you use them. You can declare variable using “my” keyword. “my” keyword restricts the scope of the variable to local. It makes the code more readable and less error prone. If you don’t declare variable using my keyword then the created variable would be global, which you should avoid, reducing the scope of the variable to the place where it is needed is a good programming practice.

    2. warnings: It helps you find typing mistakes, it warns you whenever it sees something wrong with your program. It would help you find mistakes in your program faster.


- Try to limit your code to 72-78 column lines...
  - But don't stress over it. Real world code often has very long sentences, and trying to force them to be below 78 columns leads to tight, but ugly code. In a nutshell: <= 72 is perfect, <= 78 is great, > 78 is not as bad as some folks might try to make you believe.
  
- Use two spaces per indentation level. The main advantage being that it makes it a bit more difficult for undisciplined coders to insert tabs all over the place. Decreasing the level of indentation also helps in keeping a maximum of 78 column lines.

- Do not use tabs. It makes code difficult to browse in some hosts (where 8 spaces per tab is the standard) and only works when indenting by blocks.

---
  
#### Good practices  

```perl
# Don't do this:
my $string =
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor aliqua.";

# Do this instead:
my $string = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor aliqua."

my $fn = sub {$_[0] + 1};              # Bad
my $fn = sub { $_[0] + 1 };            # Good
```

* Don't cuddle an else.

```perl
# Good
if (condition) {
  ...
}

else {
  ...
}

# Bad
if (condition) {
  ...
} else {
  ...
}
```

```perl
# Good
sub function {
  if (test) {
    ...
  }
}

# Bad
sub function
{
  if (test)
  {
    ...
  }
}
```

- Always unpack the stack first.
- Do not, ever, modify the stack. Unless necessary.

```perl
# Bad
sub my_method {
  my $self = shift;
  my %params = @_;
  ...
}

# Good
sub my_method {
  my ($self, %params) = @_;
  ...
}
```

- Do not put spaces between spaces, braces and brackets. That is, arrays, hashes, array and hash references, string and command line delimiters.

```perl
my ( $self, $who, @params ) = @_;      # Bad
my ($self, $who, @params) = @_;        # Good

my $self = { name => "Eric", age => 26 };  # Bad
my $self = {name => "Eric", age => 26};    # Good

my @files = qx| ls $str |;             # Bad
my @files = qx|ls $str|;               # Good
```

- Please keep in mind that this does not apply to operators.

```perl
my $fn = sub {$_[0] + 1};              # Bad
my $fn = sub { $_[0] + 1 };            # Good

my @items = map {do_something_to $_} @_;    # Bad
my @items = map { do_something_to $_ } @_;  # Good
```

- Use whitespace between operators.

```perl
# Good
my $area = $pi * ($radius ^ 2);

# Bad
my $area = $pi*($radius^2);
```

- Associate hash key and values by using fat comma.

```perl

# Correct, but bad style
my %hash = (key1, 'val1',
            key2, 'val2',
            key3, 'val3');

# Good
my %hash = (
              key1 => 'val1',
              key2 => 'val2',
              key3 => 'val3'
           );
```

---

#### Contribution

- Your contributions and suggestions are heartily ♥ welcome. [See here the contribution guidelines.](https://github.com/htrgouvea/perl-style-guide/blob/master/.github/CONTRIBUTING.md) Please, report bugs via [issues page.](https://github.com/htrgouvea/perl-style-guide/issues)  and for security issues see here the [security policy.](https://github.com/htrgouvea/perl-style-guide/blob/master/SECURITY.md) (✿ ◕‿◕)

---

#### License

- This work is licensed under [MIT License.](https://github.com/htrgouvea/perl-style-guide/blob/master/LICENSE.md)