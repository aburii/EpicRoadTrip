const { supabase } = useSupabase();

export default defineNuxtRouteMiddleware(async () => {
  const session = await supabase.auth.getSession();

  if (!session.data.session) {
    return navigateTo("/Demologin");
  }
});
