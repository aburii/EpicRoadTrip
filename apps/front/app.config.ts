export default defineAppConfig({
  ui: {
    primary: "yellow-orange",
    gray: "white-gray",

    button: {
      rounded: "rounded-full",
    },

    input: {
      base: "relative block w-full disabled:cursor-not-allowed disabled:opacity-75 outline-none focus:outline-none focus:bg-opacity-20 focus:bg-white border-b-2 border-primary ring-transparent focus:border-primary-700",
      rounded: "rounded-none",

      color: {
        white: {
          outline:
            "shadow-none bg-transparent dark:bg-transparent text-gray-900 dark:text-white ring-0 dark:ring-0 focus:ring-0 focus:ring-0 dark:focus:ring-0",
        },
      },
    },

    select: {
      rounded: "rounded-none",
      base: "relative block w-full disabled:cursor-not-allowed disabled:opacity-75 outline-none focus:outline-none",

      color: {
        white: {
          outline:
            "shadow-none bg-transparent dark:bg-transparent text-gray-900 dark:text-white ring-0 ring-transparent dark:ring-transparent focus:ring-0 focus:ring-0 dark:focus:ring-0",
        },
      },

      icon: {
        base: "text-primary",
      },
    },
  },
});
