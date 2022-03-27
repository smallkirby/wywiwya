export default {
  head: {
    title: 'wywiwya',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
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
  },

  router: {
    base: '/',
    middleware: [
      'firebase',
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
  },
};
