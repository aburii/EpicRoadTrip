import type { User } from '@supabase/supabase-js';

export default function useSupabaseAuth() {
  const { $supabase } = useNuxtApp();
  const user = ref<User | null>(null);
  const loading = ref(true);

  $supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session ? session.user : null;
    loading.value = false;
  });

  const signInWithGoogle = async () => {
    loading.value = true;
    const { data, error } = await $supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    loading.value = false;

    return { data, error };
  };

  const signInWithEmail = async (email: string, password: string) => {
    loading.value = true;
    const { data, error } = await $supabase.auth.signInWithPassword({
      email,
      password,
    });
    loading.value = false;
    return { data, error };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    loading.value = true;
    const { data, error } = await $supabase.auth.signUp({ email, password });
    loading.value = false;
    return { data, error };
  };

  const signOut = async () => {
    loading.value = true;
    await $supabase.auth.signOut();
    user.value = null;
    loading.value = false;
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };
}
