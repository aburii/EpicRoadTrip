import { createClient } from "@supabase/supabase-js";

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();
  const supabaseKey = `${runtimeConfig.public.SUPABASE_KEY}`;
  const supabaseUrl = `${runtimeConfig.public.SUPABASE_URL}`;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL or key is missing");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  return {
    provide: {
      supabase,
    },
  };
});
