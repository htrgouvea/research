# Security Practices & Vulnerability Disclosure

To keep this project secure, we have implemented various security practices. This includes automated analysis tools, tests and clear vulnerability reporting guidelines.

### Automated Security with GitHub Actions

This blog uses GitHub Actions to streamline development and deployment processes, along with essential security tools to help maintain an up-to-date and secure codebase.

**Security Measures**

- ***DependaBot (SCA):*** Automatically monitors dependencies for known vulnerabilities, opening pull requests to update insecure packages when necessary. This minimizes risks associated with third-party libraries.
- ***Semgrep (SAST):*** Used for Static Application Security Testing (SAST), Semgrep scans code at every push to detect potential security issues before deployment, ensuring safer code from the start.
- ***OWASP ZAP (DAST):*** Configured to run Dynamic Application Security Testing (DAST), OWASP ZAP simulates external attacks on the live application, identifying vulnerabilities that may only appear at runtime, such as injection attacks and authentication flaws.
- ***Cloudflare WAF:*** The Cloudflare Web Application Firewall (WAF) adds an extra layer of protection against external threats like DDoS and exploitation attempts by filtering out suspicious traffic before it reaches the blog.

### Responsible Disclosure Policy


If you identify a security vulnerability, please DO NOT report it via the issue tracker. Instead, we encourage responsible disclosure by emailing details directly to security@heitorgouvea.me. This allows us to assess and address the issue before any public disclosure.

You’ll receive an acknowledgment within 24 hours. Even if you’re uncertain or lack complete information, please reach out as soon as possible. We can collaborate to investigate and assess the issue together. Your assistance in keeping this project secure is invaluable!
