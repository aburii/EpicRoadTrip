<script setup lang="ts">
const { data, execute } = useFetch("/api/health");

const appHealthy = computed(() => {
  return data.value?.healthy;
});
</script>

<template>
  <UCard class="mt-2 ml-2 w-1/3">
    <template #default>
      <span>{{ appHealthy }}</span>
    </template>
    <template #footer>
      <UButton size="xl" @click="execute"> Click to test </UButton>
    </template>
  </UCard>
</template>

<style scoped></style>
