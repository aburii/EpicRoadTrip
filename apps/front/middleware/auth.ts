export default defineNuxtRouteMiddleware(async () => {
  const { $supabase } = useNuxtApp();

  const session = await $supabase.auth.getSession();

  if (!session.data.session) {
    return navigateTo("/Demologin");
  }
});
