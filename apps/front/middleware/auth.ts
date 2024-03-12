import { createClient } from "@supabase/supabase-js";

export default defineNuxtRouteMiddleware(async () => {
  const runtimeConfig = useRuntimeConfig();
  const supabaseKey = `${runtimeConfig.public.SUPABASE_KEY}`;
  const supabaseUrl = `${runtimeConfig.public.SUPABASE_URL}`;

  const supabase = createClient(supabaseUrl, supabaseKey);
  const session = await supabase.auth.getSession();

  if (!session.data.session) {
    return navigateTo("/Demologin");
  }
});
