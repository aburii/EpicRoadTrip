// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      title: "Lana",
    },
    pageTransition: {
      name: "fade",
      mode: "out-in",
    },
  },

  nitro: {},

  colorMode: {
    preference: "light",
  },

  css: ["~/assets/main.css"],

  modules: [
    "@nuxt/ui",
    "@vueuse/nuxt",
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          Roboto: true,
          Raleway: true,
        },
      },
    ],
  ],
  ssr: false,

  typescript: {
    strict: true,
    shim: false,
  },

  runtimeConfig: {
    public: {
      SUPABASE_KEY: process.env.NUXT_PUBLIC_SUPABASE_KEY,
      SUPABASE_URL: process.env.NUXT_PUBLIC_SUPABASE_URL,
    },
  },
});
