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

<<<<<<< HEAD
  nitro: {},

=======
>>>>>>> 68fd2c4 (feat : Supabase auth)
  colorMode: {
    preference: "light",
  },

  css: ["~/assets/main.css"],

  modules: [
    "@nuxt/ui",
    "@vueuse/nuxt",
<<<<<<< HEAD
=======
    "@pinia/nuxt",
>>>>>>> 68fd2c4 (feat : Supabase auth)
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
<<<<<<< HEAD
=======
  ssr: false,
>>>>>>> 68fd2c4 (feat : Supabase auth)

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
