<script setup lang="ts">
const { data } = useFetch('/api/places', {
  query: {
    location_lat: '-33.8670522',
    location_long: '151.1957362',
    type: 'restaurant',
    radius: 50000,
  },
});

const { $supabase } = useNuxtApp();

const directionsData = computed(() => {
  return data.value?.status;
});
</script>

<template>
  <div>
    <UCard class="mt-2 ml-2 w-1/3">
      <template #default>
        <span>{{ directionsData }}</span>
      </template>
      <template #footer>
        <UButton size="xl"> Click to test </UButton>
      </template>
    </UCard>
    <span>{{ $supabase }}</span>
  </div>
</template>

<style scoped></style>
