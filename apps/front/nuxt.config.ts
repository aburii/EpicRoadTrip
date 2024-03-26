// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,

  app: {
    head: {
      title: "Lana",
    },
    pageTransition: {
      name: "fade",
      mode: "out-in",
    },
  },

  modules: [
    "@nuxt/ui",
    "@vueuse/nuxt",
    "@nuxt/fonts",
    "@nuxtjs/i18n",
    "@pinia/nuxt",
  ],

  fonts: {
    experimental: {
      processCSSVariables: true,
    },
  },

  i18n: {
    vueI18n: "./i18n.config.ts",
    locales: [
      {
        code: "en",
        name: "English",
      },
      {
        code: "fr",
        name: "Français",
      },
    ],
    detectBrowserLanguage: {
      fallbackLocale: "en",
      useCookie: true,
      cookieKey: "nuxt-i18n-locale",
    },
  },

  nitro: {},

  colorMode: {
    preference: "light",
  },

  css: ["~/assets/main.css"],

  typescript: {
    strict: true,
    shim: false,
  },

  runtimeConfig: {
    public: {
      SUPABASE_KEY: process.env.NUXT_PUBLIC_SUPABASE_KEY,
      SUPABASE_URL: process.env.NUXT_PUBLIC_SUPABASE_URL,
      googleApiKey: process.env.GOOGLE_API_KEY,
    },
  },
});
