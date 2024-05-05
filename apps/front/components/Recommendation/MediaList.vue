<template>
  <div class="lg:mx-32">
    <h1 class="font-bold text-3xl lg:text-4xl"> {{ t('recommendations.title') }}</h1>
    <div v-if="!loading && displayedRecommendations.length > 0">
      <div v-for="trip in displayedRecommendations" :key="trip.id" class="flex justify-center">
        <RecommendationCard :trip="trip" :range="range" />
      </div>
    </div>
    <div v-else>
      <div class="my-8 mb-8 w-full">
        <USkeleton class="w-full h-96 rounded-2xl" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import { add, format } from 'date-fns';

const { $supabase } = useNuxtApp();

const toast = useToast();

const loading = ref(true);

const { t } = useI18n();

const TripSchema = z.object({
  id: z.string(),
  waypoints: z.string(),
  title: z.string(),
  start_point: z.string(),
  end_point: z.string(),
  image: z.string(),
});

const recommendations = ref<Array<z.infer<typeof TripSchema>>>([]);

export interface Props {
  size?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 4,
});

const range = reactive({
  start: format(add(new Date(), { days: 7 }), 'MM/dd/yyyy'),
  end: format(add(new Date(), { days: 14 }), 'MM/dd/yyyy'),
});

const displayedRecommendations = computed(() => {
  const shuffled = [...recommendations.value].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, props.size);
});

async function fetchData() {
  const { data: fetchedRecommendations, error } = await $supabase
    .from('recommendations')
    .select('*');

  if (error) {
    toast.add({ title: 'Error getting recommendations trips' });
    return;
  }

  recommendations.value = fetchedRecommendations;

  loading.value = false;
}

onMounted(fetchData);
</script>
