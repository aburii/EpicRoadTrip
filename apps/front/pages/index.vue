<template>
  <div>
    <UButton v-if="user?.email">{{ user?.email }}</UButton>
    <UButton @click="logout">Logout</UButton>
    <NuxtWelcome />
  </div>
</template>

<script setup lang="ts">
const { signOut, user } = useSupabaseAuth();

const logout = async () => {
  await signOut();
  navigateTo({ path: "/demoLogin" });
};

definePageMeta({
  middleware: "auth",
});
</script>
