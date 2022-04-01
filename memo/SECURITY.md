# SECURITY

## Firestore

- All accesses are managed by [a rule file](../fconfig/firestore.rules).
- Note that Cloud Functions uses Firebase Admin SDK. So Functions must impl its own authT/authZ logic.

## XSS

Markdown file is compiled into raw HTML and is rendered in `innerHTML`.

Therefore, XSS preventions are required. WYWIWYA does below:

### sanitizing

- It uses [DOMPurify](https://github.com/cure53/DOMPurify).
- All HTML to Markdown compilation must be done by functions exported by `~/lib/md.ts`, to prevent developers from accidentally use raw HTML without sanitizing.
  - [check-raw-md.py](../misc/check-raw-md.bash) statically checks if there are no files where raw HTML is not used without sanitizing.

### CSP

- CSP policies are provided as `<meta>` tag in `index.html`.
- Nuxt has inline scripts in its only HTML file `index.html`. So they must be hashed and `<meta>` must have corresponding hash as `script-src` for CSP to correctly prohibit other malicious inline scripts.
  - [set-csp.py](../misc/set-csp.py) post-hooks `nuxt build` and adds appropriate CSP policies into generated `index.html`.
- Below are CSP policies WYWIWYA uses:

| Directive | Sources |
|:---|:---|
| `default-src` | `self` |
| `script-src` | `self`, `*.apis.google.com`, `*.smallkirby.xyz`, `<Firebase Auth Domain>` |
| `child-src` |  `none` |
| `connect-src` | `self`, `*.googleapis.com`, `*.smallkirby.xyz`, `<Firebase Auth Domain>`, `<Cloud Functions Location>` |
| `font-src` |  `*` |
| `frame-src` |  `self`, `apis.google.com`, `<Firebase Auth Domain>` |
| `media-src` |  `*` |
| `style-src` |  `*` |

### Sandboxed iframe

All HTML compiled from Markdown are rendered only in sandboxed iframe, with `allow-popups` and `allow-same-origin`.
