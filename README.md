<p align="center">
  <h3 align="center">heitorgouvea.me</h3>
  <p align="center">Some notes, analysis and proof-of-concepts about my vulnerability research journey</p>
  <p align="center">
    <a href="https://github.com/htrgouvea/research/blob/master/LICENSE.md">
      <img src="https://img.shields.io/badge/license-MIT-blue.svg">
    </a>
    <a href="https://github.com/htrgouvea/research/releases">
      <img src="https://img.shields.io/badge/version-1.0-blue.svg">
    </a>
  </p>
</p>

---

### Summary

My research focus is vulnerability discovery in applications/services and exploit devlopment, I have fun bypassing modern defenses, exploring systems and playing with new technologies and in parallel: sharing some of my research notes on [my blog](https://heitorgouvea.me); Here, you can find some of my experiments, advisories and analysis of advisories from others researchers.


This repository stores all the structure, code and files of my personal website ([https://heitorgouvea.me](https://heitorgouvea.me)). My website was developed using Jekyll. Its basic structure revolves around this and some HTML5, CSS3 (with sass) and JavaScript files.

---

### Research

| Name      | Description | Category |
| ----------- | ----------- | ----------- |
| [Open Redirect at a ](/experiments/puppet/) | Puppeter module to find client-side vulns | Experiment |
| [CVE-2020-9376 & CVE-2020-9377 ](/) | 0-day authentication bypass + RCE on D-LINK 610 | Advisories |
| [Fuzz.PM](/experiments/fuzz.pm) | Differential fuzzing to find logic bugs on Perl Modules | Experiment |
| [CVE-2021-22204](/analysis/CVE-2021-22204) | N-Day for RCE on Exiftool | Analysis |
| [CVE-2021-41773](/analysis/CVE-2021-41773) | RCE & LFI on feature to path normalization in Apache HTTP Server| Analysis |

---

### Download and Set-up

```bash
  # Download
  $ git clone https://github.com/htrgouvea/research && cd research
    
  # Building and running docker image
  $ docker build -t blog-jekyll .
  $ docker run -d -p 4000:4000 --name heitorgouvea.me blog-jekyll
```

---

### Contribution

- Your contributions and suggestions are heartily ♥ welcome. [See here the contribution guidelines.](/.github/CONTRIBUTING.md) Please, report bugs via [issues page](https://github.com/htrgouvea/research/issues) and for security issues, see here the [security policy.](./SECURITY.md) (✿ ◕‿◕) 

- If you are interested in providing financial support to this project, please visit: [heitorgouvea.me/donate](https://heitorgouvea.me/donate)

---

### License

- This work is licensed under [MIT License.](./LICENSE.md)