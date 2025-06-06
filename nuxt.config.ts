// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  ssr: false,
  target: 'static',
  build: {
    transpile: [
      '@fortawesome/vue-fontawesome',
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-solid-svg-icons',
      '@vuepic/vue-datepicker',
    ],
  },
  css: ['@fortawesome/fontawesome-svg-core/styles.css'],
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/apollo',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
  ],
  pinia: {
    autoImports: [
      'defineStore', // import { defineStore } from 'pinia'
    ],
  },
  runtimeConfig: {
    graphqlURL: process.env.PORTAL_URL,
    graphqlToken: process.env.GRAPHQL_TOKEN,
    graphUrlServer: process.env.GRAPHQL_URL_SERVER,
    apiKey: process.env.API_KEY,
    public: {
       companyAccount: process.env.COMPANY_ACCOUNT,
      graphqlURL: process.env.PORTAL_URL,
      graphqlToken: process.env.GRAPHQL_TOKEN,
      graphUrlServer: process.env.GRAPHQL_URL_SERVER,
      apiKey: process.env.API_KEY,
    },
  },
  apollo: {
    autoImports: true,
    clients: {
      default: {
        httpEndpoint: process.env.PORTAL_URL,
        httpLinkOptions: {
          credentials: 'include',
        },
      },
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  devtools: { enabled: true },
})
