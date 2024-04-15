export default defineNuxtRouteMiddleware(async () => {
  const { $supabase } = useNuxtApp();
  const localePath = useLocalePath();

  const session = await $supabase.auth.getSession();

  if (!session.data.session) {
    return navigateTo(localePath('/'));
  }

  $supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_OUT' || !session) {
      await navigateTo(localePath('/'));
    }
  });
});
