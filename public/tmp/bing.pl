#!/usr/bin/env perl

use 5.018;
use strict;
use warnings;
use Mojo::UserAgent;
use Mojo::Util qw( url_escape);
use Data::Printer;

sub main {
    my $dork = $ARGV[0];

    if ($dork) {
        my $userAgent = Mojo::UserAgent -> new();
        my $seen = {};

        $dork = url_escape($dork);

        for my $page (0 .. 10) {
            my $endpoint = "http://www.bing.com/search?q=${dork}&first=${page}0";
            my $request  = $userAgent -> get($endpoint) -> result();
            my $links    = $request -> dom -> find("a") -> map(attr => "href") -> to_array();

            for my $link_url ($links) {
                print "here\n";
                
                p $link_url;

            #     next if $seen -> {$link_url}++;
            #     if ($link_url =~ m/^https?/ && $link_url !~ m/bing|live|microsoft|msn/) {
            #         print $link_url, "\n";
            #     }
            }
        }
    }
}

main();
exit;


