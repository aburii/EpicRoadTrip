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

  typescript: {
    strict: true,
    shim: false,
  },
});
