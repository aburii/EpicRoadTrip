<template>
  <UCard>
    <UInput v-model="email" type="email" placeholder="Email" />
    <UInput v-model="password" type="password" placeholder="Password" />
    <UButton @click="register">Register</UButton>
    <p v-if="error">{{ error }}</p>
  </UCard>
</template>

<script lang="ts" setup>
const { signUpWithEmail } = useSupabaseAuth();
const email = ref<string>("");
const password = ref<string>("");
const error = ref<string | null>(null);

const register = async () => {
  const { error: signInError } = await signUpWithEmail(
    email.value,
    password.value,
  );
  error.value = signInError?.message || null;
};
</script>
