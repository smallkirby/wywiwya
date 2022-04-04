export default {
  head: {
    title: 'WYWIWYA',
    htmlAttrs: {
      lang: 'jp',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'What You Write is What You Are' },
      { name: 'format-detection', content: 'telephone=no' },
      { hid: 'og:site_name', name: 'og:site_name', content: 'WYWIWYA: what you write is what you are.' },
      { hid: 'og:type', name: 'og:type', content: 'website' },
      { hid: 'og:url', name: 'og:url', content: 'https://wywiwya.smallkirby.xyz' },
      { hid: 'og:title', name: 'og:title', content: 'What You Write is What You Are.' },
      {
        hid: 'og:description',
        name: 'og:description',
        content: '書いたものがその人の全てならば、漢字の書き取りドリルをしている小学3年生は、もはや漢字そのものなのだろうか。',
      },
      {
        hid: 'og:image',
        name: 'og:image',
        content: 'https://wywiwya.smallkirby.xyz/logo/wywiwya-mini.png',
      },
      { name: 'twitte:card', content: 'summary' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },

  ssr: false,

  css: [
  ],

  plugins: [
    {
      src: '~/plugins/firebase.ts',
    },
    {
      src: '~/plugins/fontawesome.ts',
    },
    {
      src: '~/plugins/tooltip.ts',
    },
    {
      src: '~/plugins/toggle.ts',
    },
  ],

  components: true,

  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss',
  ],

  modules: [
    '@nuxtjs/axios',
    'nuxt-webfontloader',
  ],

  axios: {
    baseURL: '/',
  },

  webfontloader: {
    google: {
      families: ['Ubuntu Mono'],
    },
  },

  build: {
    extractCSS: true,
  },

  router: {
    middleware: [
      'session',
      'loading',
    ],
  },

  publicRuntimeConfig: {
    FB_APIKEY: process.env.FB_APIKEY,
    FB_AUTHDOMAIN: process.env.FB_AUTHDOMAIN,
    FB_PROJECTID: process.env.FB_PROJECTID,
    FB_STORAGEBUCKET: process.env.FB_STORAGEBUCKET,
    FB_MESSAGINGSENDERID: process.env.FB_MESSAGINGSENDERID,
    FB_APPID: process.env.FB_APPID,
    FB_MEASUREMENTID: process.env.FB_MEASUREMENTID,

    FB_FIRESTORE_EMULATE: process.env.FB_FIRESTORE_EMULATE,
    FB_FUNCTIONS_EMULATE: process.env.FB_FUNCTIONS_EMULATE,
    FB_AUTH_EMULATE: process.env.FB_AUTH_EMULATE,
  },
};
