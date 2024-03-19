import { createClient, type User } from "@supabase/supabase-js";

export const useSupabase = () => {
  const runtimeConfig = useRuntimeConfig();
  const supabaseKey = `${runtimeConfig.public.SUPABASE_KEY}`;
  const supabaseUrl = `${runtimeConfig.public.SUPABASE_URL}`;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL or key is missing");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  return { supabase };
};

export type { User };
