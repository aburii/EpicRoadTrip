<template>
  <UCard>
    <UInput v-model="email" type="email" placeholder="Email" />
    <UInput v-model="password" type="password" placeholder="Password" />
    <UButton @click="login">Login</UButton>
    <UButton @click="loginWithGoogle">Login with Google</UButton>
    <p v-if="error">{{ error }}</p>
  </UCard>
</template>

<script lang="ts" setup>
const { signInWithEmail, signInWithGoogle } = useSupabaseAuth();

const email = ref<string>("");
const password = ref<string>("");
const error = ref<string | null>(null);

const login = async () => {
  const { error: signInError } = await signInWithEmail(
    email.value,
    password.value,
  );
  error.value = signInError?.message || null;
};

const loginWithGoogle = async () => {
  const { error: signInError } = await signInWithGoogle();
  error.value = signInError?.message || null;
};
</script>
