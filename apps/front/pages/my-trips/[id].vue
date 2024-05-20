<template>
  <div class="pdf-content">
    <div v-if="!loading && mytrip">
      <div class="flex flex-col rounded-lg overflow-hidden shadow-md my-4 relative bg-white">
        <div class="flex justify-between items-start">
          <div class="p-4 flex-grow">
            <p class="text-md lg:text-lg">
              <span class="font-bold"> {{ t('trip.recap.1') }} </span>
              {{ t('trip.recap.2') }}
              <span class="font-bold text-primary">
                {{ mytrip.origin }}
              </span>
              {{ t('trip.recap.3') }}
              <span class="font-bold text-primary">
                {{ mytrip.destination }}
              </span>
            </p>
            <p class="text-md lg:text-lg">
              {{ t('trip.recap.4') }}
              <span class="text-primary font-bold">{{ formatDate(mytrip.start_date) }}</span>
              {{ t('trip.recap.5') }}
              <span class="text-primary font-bold">{{ formatDate(mytrip.end_date) }}</span>
            </p>
          </div>
          <UDropdown
            :items="menuItems"
            :popper="{ placement: 'bottom-start' }"
            class="m-2 no-print"
          >
            <UButton icon="i-heroicons-share-solid" color="primary" square variant="ghost" />
          </UDropdown>
        </div>
        <TripMap
          class="h-72 w-full"
          :zoom="4"
          :routes="RouteCoords"
          :fullscreen-map="true"
          :copyright="true"
        />
        <div>
          <h2 class="font-bold text-md lg:text-lg mx-4">{{ t('trip.waypoints') }}</h2>
        </div>
        <div class="text-lg p-4 mb-4">
          <div v-for="(place, index) in mytrip.places" :key="index">
            <div class="mb-1">
              <a v-if="place.url" :href="fullUrl(place)" target="_blank" rel="noopener noreferrer"
                ><UBadge class="my-2 mr-2" color="primary" variant="solid">{{
                  'website'
                }}</UBadge></a
              >
              <UBadge
                v-for="categorie in place.categories"
                :key="categorie"
                class="my-2 mr-2"
                color="white"
                variant="solid"
                >{{ categorie }}</UBadge
              >
              <h2 class="font-bold text-primary text-sm lg:text-md mb-2">{{ place.name }}</h2>
              <p class="text-sm lg:text-md">{{ place.formatted_address }}</p>
              <UDivider />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!loading && !mytrip" class="flex flex-col items-center justify-center">
      <NoDataFound :title="t('trip.none-found')" />
    </div>
    <div v-if="loading">
      <LoaderTripView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';

const route = useRoute();
const formatDate = useFormatDate();
const { $supabase } = useNuxtApp();

const toast = useToast();

const { t } = useI18n();

const id = route.params.id;

const loading = ref(true);

const TripSchema = z
  .object({
    id: z.string(),
    path: z.string(),
    start_date: z.string(),
    end_date: z.string(),
    user_id: z.string(),
    origin: z.string(),
    destination: z.string(),
    places: z.array(
      z.object({
        name: z.string(),
        lat: z.number(),
        long: z.number(),
        formatted_address: z.string(),
        url: z.string().optional(),
        categories: z.array(z.string()).optional(),
      }),
    ),
  })
  .nullable();

const StepSchema = z.object({
  lat: z.number(),
  long: z.number(),
  name: z.string(),
  steps: z.array(z.unknown()).optional(),
});

const RouteCoordsSchema = z.array(StepSchema).nullable();

const mytrip = ref<z.infer<typeof TripSchema>>(null);
const RouteCoords = ref<z.infer<typeof RouteCoordsSchema>>(null);

definePageMeta({
  layout: 'default',
});

const menuItems = [
  [
    {
      label: t('trip.copy'),
      icon: 'i-heroicons-link-solid',
      click: () => {
        copyToClipboard();
      },
    },
    {
      label: t('trip.export'),
      icon: 'i-heroicons-document-solid',
      click: () => {
        exportToPdf();
      },
    },
    {
      label: t('trip.share-email'),
      icon: 'i-heroicons-envelope-solid',
      disabled: true,
      click: () => {
        console.log('Share by email');
      },
    },
  ],
];

async function copyToClipboard() {
  await navigator.clipboard.writeText(window.location.href);
  toast.add({ title: 'Copied to clipboard' });
}

function exportToPdf() {
  print();
}

function fullUrl(item: { url?: string } | null | undefined): string {
  return item && item.url ? `https://` + item.url : '';
}

async function fetchData() {
  const { data: trip, error } = await $supabase.from('trips').select('*').eq('id', id);
  if (error) {
    console.error('Error fetching trips:', error);
  } else if (trip && trip.length > 0) {
    mytrip.value = trip[0];
    RouteCoords.value = trip[0].route;
  } else {
    console.log('No trip found with id:', id);
  }
  loading.value = false;
}

onMounted(fetchData);
</script>
