<template>
  <div class="relative shadow-md my-8 mb-8 w-full rounded-2xl">
    <img :src="trip.image" :alt="trip.title" class="w-full h-80 object-cover rounded-2xl" />
    <div class="absolute bottom-0 w-full p-4">
      <div class="flex flex-col">
        <div>
          <h2 class="text-white font-bold text-xl md:2text-lg lg:text-4xl">{{ trip.title }}</h2>
        </div>
        <div class="flex justify-between">
          <div>
            <p class="text-white text-sm md:text-lg lg:text-xl">{{
              trip.waypoints.replace(/\|/g, ' | ')
            }}</p>
          </div>
          <div class="p-2 lg:p-0">
            <NuxtLink
              :to="
                localePath(
                  `/trip?departure=${trip.start_point}&arrival=${trip.end_point}&d_start=${range.start}&d_end=${range.end}&waypoints=${trip.waypoints.split('|').slice(1, -1).join('|')}`,
                )
              "
            >
              <UButton size="xl">Discover</UButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();

defineProps<{
  trip: {
    id: string;
    waypoints: string;
    title: string;
    start_point: string;
    end_point: string;
    image: string;
  };
  range: { start: string; end: string };
}>();
</script>
