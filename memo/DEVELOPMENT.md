# DEVELOPMENT

```bash
git clone https://github.com/smallkirby/wywiwya.git # clone the repo
npm run ci && npm -w functions run ci # install deps
npm run nirugiri # start emulators and local server
```

- `npm run nirugiri` utilizes tmux and does:
  - building and watching Cloud Functions code.
  - start emulators by importing existing data in `/emu-sample`.
  - start nuxt.
