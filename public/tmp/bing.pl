#!/usr/bin/env perl

use 5.018;
use strict;
use warnings;
use Mojo::UserAgent;
use Mojo::Util qw(url_escape);
use Data::Dumper;

sub main {
    my $dork = $ARGV[0];

    if ($dork) {
        my $seen = {};
        my $userAgent = Mojo::UserAgent -> new();

        $dork = url_escape($dork);

        for my $page (0 .. 10) {
            my $endpoint = "http://www.bing.com/search?q=${dork}&first=${page}0";
            my $response = $userAgent -> get($endpoint) -> result();

            for my $link ($response -> dom -> find("a") -> each) {
                my $link_url = $link -> attr("href");

                # next if $seen -> {$link_url}++;

                if (${link_url} =~ m/^https?/ && ${link_url} !~ m/bing|live|microsoft|msn/) {
                    # print ${link_url}, "\n";
                }
            }
        }
    }
}

main();
exit;