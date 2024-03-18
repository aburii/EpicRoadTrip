<script setup lang="ts">
const { data } = useFetch('/api/directions', {
  query: {
    origin: 'Toronto',
    destination: 'Montreal',
  },
});

const directionsData = computed(() => {
  return data;
});
</script>

<template>
  <UCard class="mt-2 ml-2 w-1/3">
    <template #default>
      <span>{{ directionsData }}</span>
    </template>
    <template #footer>
      <UButton size="xl"> Click to test </UButton>
    </template>
  </UCard>
</template>

<style scoped></style>
