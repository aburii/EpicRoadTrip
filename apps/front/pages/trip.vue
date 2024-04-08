<template>
  <TripLoading v-if="loading" />
  <div v-else class="relative w-screen h-screen">
    <TripMap class="absolute z-0" :routes="routes" />
    <div
      class="absolute bottom-0 lg:top-0 left-0 right-0 lg:w-1/3 p-2 lg:p-12 lg:m-6 z-10 flex flex-col"
      :class="{ 'rounded-l': drawerOpen, rounded: !drawerOpen }"
      style="background-color: rgba(255, 255, 255, 0.9)"
    >
      <div class="sticky top-0 flex flex-col items-center lg:text-xl text-sm z-20 mb-2 text-center">
        <UButton
          class="md:hidden lg:hidden"
          variant="ghost"
          icon="i-heroicons-chevron-double-down"
          @click="openClose"
        ></UButton>
        <div class="mb-6">
          <p>
            <span class="font-bold"> {{ t('trip.recap.1') }} </span>
            {{ t('trip.recap.2') }}
            <span class="font-bold text-primary">
              {{ $route.query.departure }}
            </span>
            {{ t('trip.recap.3') }}
            <span class="font-bold text-primary">{{ $route.query.arrival }}</span>
          </p>
          <p>
            {{ t('trip.recap.4') }}
            <span class="text-primary font-bold">{{
              new Date($route.query.d_start).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            }}</span>
            {{ t('trip.recap.5') }}
            <span class="text-primary font-bold">{{
              new Date($route.query.d_end).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
            }}</span>
          </p>
        </div>
        <UTabs v-if="!collasped" :items="items" />
      </div>
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-300"
        leave-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="!collasped"
          class="relative grid grid-cols-1 gap-4 overflow-y-auto rounded mb-2 h-72 lg:h-auto"
        >
          <UCard v-for="item in places" :key="item">
            <div class="flex justify-between">
              <div class="flex justify-between gap-2">
                <img
                  :src="`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${item.imgRef}&key=${apiKey}`"
                  alt="Hotel Image"
                  class="w-20 h-20 lg:w-32 lg:h-32 object-cover rounded"
                />
                <div>
                  <div class="flex items-center justify-between">
                    <h2 class="lg:text-xl text-primary">{{ item?.name }}</h2>
                  </div>
                  <vue3StarRatings
                    v-if="item.rating"
                    v-model="item.rating"
                    :star-size="16"
                    star-color="#FF6B00"
                    inactive-color="#595959"
                    :number-of-stars="5"
                    :disable-click="true"
                  />
                  <h2 class="text-sm lg:text">{{ item?.formatted_address }}</h2>
                  <p
                    class="text-sm lg:text underline text-primary cursor-pointer"
                    @click="showDrawer(item)"
                  >
                    {{ t('trip.info') }}
                  </p>
                </div>
              </div>
              <div class="flex">
                <UTooltip :text="t('trip.addTooltip')">
                  <UButton
                    class="text-2xl lg:text-3xl"
                    :disabled="waypointLoading"
                    @click="addWaypoint(item)"
                    >+</UButton
                  >
                </UTooltip>
              </div>
            </div>
          </UCard>
        </div>
      </Transition>
      <div v-if="!collasped" class="sticky bottom-0 flex flex-col items-center z-20 text-center">
        <p class="text-xs lg:text-sm">
          <span class="font-bold">{{ nmbrResults }} {{ t('trip.res') }} </span
          ><span class="text-primary">{{ t('trip.avlb') }}</span>
        </p>
      </div>
    </div>
    <!-- DRAWER -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-class="transform -translate-x-full"
      enter-to-class="transform translate-x-0"
      leave-active-class="transition ease-in duration-300"
      leave-class="transform translate-x-0"
      leave-to-class="transform -translate-x-full"
    >
      <div
        v-show="drawerOpen"
        class="absolute lg:bottom-0 lg:top-0 lg:left-1/3 right-0 lg:w-1/4 w-full p-6 lg:p-12 lg:m-6 z-5 flex flex-col"
        style="background-color: rgba(255, 255, 255, 0.9)"
      >
        <UButton
          class="absolute top-0 right-0 m-2"
          icon="i-heroicons-x-circle"
          variant="ghost"
          @click="drawerOpen = false"
        ></UButton>
        <div class="relative grid grid-cols-1 gap-4 mt-6">
          <UCard>
            <div class="flex flex-col justify-center items-center mx-2">
              <h2 class="text-xs lg:text-xl text-primary">
                {{ selectedItem?.name }}
              </h2>
              <vue3StarRatings
                v-if="selectedItem?.rating"
                v-model="selectedItem.rating"
                :star-size="16"
                star-color="#FF6B00"
                inactive-color="#595959"
                :number-of-stars="5"
                :disable-click="true"
              />
              <span class="text-secondary">
                {{ selectedItem?.formatted_address }}
              </span>
              <span class="text-secondary">
                {{ selectedItem?.international_phone_number }}
              </span>
              <UButton
                :to="selectedItem?.website"
                target="_blank"
                variant="ghost"
                icon="i-heroicons-globe-alt"
              ></UButton>
            </div>
          </UCard>
          <UCard>
            <img
              :src="`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${selectedItem?.imgRef}&key=${apiKey}`"
              alt="Hotel Image"
              class="w-full h-full object-cover rounded"
            />
          </UCard>
          <UCard v-if="selectedItem?.editorial_summary">
            <div>
              <span>
                {{ selectedItem?.editorial_summary.overview }}
              </span>
            </div>
          </UCard>
        </div>
      </div>
    </Transition>
    <div class="absolute bottom-0 left-0 right-0">
      <UProgress v-if="waypointLoading" animation="carousel" />
    </div>
  </div>
</template>

<script setup lang="ts">
import vue3StarRatings from 'vue3-star-ratings';
import { z } from 'zod';

definePageMeta({
  layout: 'trip',
});

const route = useRoute();
const query = {
  origin: route.query.departure,
  destination: route.query.arrival,
  ...(route.query.waypoints ? { waypoints: route.query.waypoints } : {}),
};
const {
  data: fetchedData,
  error,
  execute,
} = await useFetch('/api/call', {
  immediate: false,
  query,
});

const PlaceSchema = z.object({
  imgRef: z.string(),
  name: z.string().nullable(),
  rating: z.number().nullable().optional(),
  formatted_address: z.string().nullable().optional(),
  international_phone_number: z.string().nullable().optional(),
  website: z.string().nullable().optional(),
  editorial_summary: z
    .object({
      overview: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

const StepSchema = z.object({
  start_location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  end_location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  polyline: z.string(),
});

const RouteSchema = z.object({
  name: z.string(),
  lat: z.number(),
  long: z.number(),
  steps: z.array(StepSchema),
});

const DataSchema = z.object({
  places: z.array(PlaceSchema),
  routes: z.array(RouteSchema),
});

const loading = ref(true);
const toast = useToast();
const nmbrResults = ref<number>(0);
const waypointLoading = ref(false);
const collasped = ref(false);
const drawerOpen = ref(false);
const selectedItem = ref(null);
const places = ref<Array<z.infer<typeof PlaceSchema>>>([]);
const routes = ref<z.infer<typeof RouteSchema>>({
  name: '',
  lat: 0,
  long: 0,
  steps: [],
});
const { t } = useI18n();
const runtimeConfig = useRuntimeConfig();
const apiKey = `${runtimeConfig.public.GOOGLE_API_KEY}`;

const items = [
  {
    label: t('trip.types.all'),
  },
  {
    label: t('trip.types.hotel'),
  },
  {
    label: t('trip.types.activity'),
  },
  {
    label: t('trip.types.bar'),
  },
  {
    label: t('trip.types.restaurant'),
  },
];

function showDrawer(item: typeof PlaceSchema) {
  selectedItem.value = item;
  drawerOpen.value = true;
}

async function addWaypoint(item: { formatted_address: any }) {
  waypointLoading.value = true;
  const waypoint = route.query.waypoints
    ? `${route.query.waypoints}|${item.formatted_address}`
    : item.formatted_address;
  await navigateTo({
    query: {
      departure: route.query.departure,
      arrival: route.query.arrival,
      price: route.query.price,
      d_start: route.query.d_start,
      d_end: route.query.d_end,
      waypoints: waypoint,
    },
  });
  query.origin = route.query.departure;
  query.destination = route.query.arrival;
  query.waypoints = route.query.waypoints ? route.query.waypoints : {};
  fetchData();
}

function openClose() {
  collasped.value = !collasped.value;
}

async function fetchData() {
  await execute();

  if (!fetchedData || error.value) {
    toast.add({ title: 'Failed to fetch data' });
  } else {
    const validatedData = DataSchema.parse(fetchedData.value);
    places.value = validatedData.places;
    routes.value = validatedData.routes;
    nmbrResults.value = validatedData.places.length;
    waypointLoading.value = false;
    loading.value = false;
  }
}

onMounted(fetchData);
</script>
