
<p align="center">
  <h3 align="center">gouveaheitor.github.io</h3>
  <p align="center">Just a simple web blog</p>

  <p align="center">
    <a href="https://github.com/GouveaHeitor/gouveaheitor.github.io/blob/master/LICENSE.md">
      <img src="https://img.shields.io/badge/license-MIT-blue.svg">
    </a>
    <a href="https://github.com/GouveaHeitor/gouveaheitor.github.io/releases">
      <img src="https://img.shields.io/badge/version-1.0-blue.svg">
    </a>
  </p>
</p>

---

### Summary

This repository stores all the structure, code and files of my personal website ([https://heitorgouvea.me](https://heitorgouvea.me)).

My website was developed using Jekyll. Its basic structure revolves around this and some HTML5, CSS3 (with sass) and JavaScript files.

---

### Download and Set-up

```bash
  # Download
  $ git clone https://github.com/GouveaHeitor/gouveaheitor.github.io && cd gouveaheitor.github.io
    
  # Building and running docker image
  $ docker build --rm --squash -t blog-jekyll .
  $ docker run -d -p 4000:4000 --name heitorgouvea.me blog-jekyll
```

---

### Contribution

- Your contributions and suggestions are heartily ♥ welcome. [See here the contribution guidelines.](/.github/CONTRIBUTING.md) Please, report bugs via [issues page.](https://github.com/GouveaHeitor/gouveaheitor.github.io/issues) See here the [security policy.](./SECURITY.md) (✿ ◕‿◕) 

---

### License

- This work is licensed under [MIT License.](./LICENSE.md)
