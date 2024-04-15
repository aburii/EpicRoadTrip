export default defineNuxtRouteMiddleware(async () => {
  const { $supabase } = useNuxtApp();
  const localePath = useLocalePath();

  const session = await $supabase.auth.getSession();

  if (!session.data.session) {
    return navigateTo(localePath('/Demologin'));
  }
});
