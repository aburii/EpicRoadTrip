const { supabase } = useSupabase();

export default function useSupabaseAuth() {
  const user = ref<User | null>(null);
  const loading = ref(true);

  // eslint-disable-next-line require-await
  supabase.auth.onAuthStateChange(async (_event, session) => {
    user.value = session ? session.user : null;
    loading.value = false;
  });

  const signInWithGoogle = async () => {
    loading.value = true;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      // error handler
    }
    loading.value = false;
    return { data, error };
  };

  const signInWithEmail = async (email: string, password: string) => {
    loading.value = true;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      // error handler
    } else {
      navigateTo("/");
    }
    loading.value = false;
    return { data, error };
  };

  const signUpWithEmail = async (email: string, password: string) => {
    loading.value = true;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      // error handler
    } else {
      await navigateTo("/demoLogin");
    }
    loading.value = false;
    return { data, error };
  };

  const signOut = async () => {
    loading.value = true;
    await supabase.auth.signOut();
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
