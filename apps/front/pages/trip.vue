<template>
  <div>
    <TripLoading v-if="loading" />
    <div v-else class="relative w-screen h-screen">
      <TripMap class="absolute z-0 w-screen h-screen" :routes="routes" />
      <div
        class="absolute bottom-0 lg:top-0 left-0 right-0 lg:w-1/3 p-2 lg:p-6 lg:m-6 z-10 flex flex-col bg-white"
        :class="{ 'rounded-l': drawerOpen, rounded: !drawerOpen }"
      >
        <div
          class="sticky top-0 flex flex-col items-center lg:text-md text-sm z-20 mb-2 text-center"
        >
          <UButton
            class="md:hidden lg:hidden"
            variant="ghost"
            :icon="collasped ? 'i-heroicons-chevron-double-up' : 'i-heroicons-chevron-double-down'"
            @click="openClose"
          ></UButton>
          <UButton
            class="absolute top-0 right-0"
            variant="ghost"
            icon="i-heroicons-adjustments-horizontal-solid"
            @click="showFilters()"
          ></UButton>
          <div class="mb-4">
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
          <UTabs v-if="!collasped" :items="tabsItems" />
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
            class="relative grid grid-cols-1 overflow-y-auto rounded mb-2 h-72 lg:h-auto"
          >
            <div v-for="item in places" :key="item" class="flex justify-between p-2">
              <div class="flex justify-between gap-2">
                <img
                  :src="`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${item.imgRef}&key=${apiKey}`"
                  alt="Hotel Image"
                  class="w-20 h-20 lg:w-32 lg:h-32 object-cover rounded"
                />
                <div class="mx-2">
                  <div class="flex items-center">
                    <h2 class="text-primary">{{ item?.name }}</h2>
                  </div>
                  <vue3StarRatings
                    v-if="item.rating"
                    v-model="item.rating"
                    :star-size="12"
                    star-color="#FF6B00"
                    inactive-color="#595959"
                    :number-of-stars="5"
                    :disable-click="true"
                  />
                  <div class="my-2">
                    <h2 class="text-sm lg:text-xs">{{ item?.formatted_address }}</h2>
                    <p
                      class="text-xs underline text-primary cursor-pointer"
                      @click="showDrawer(item)"
                    >
                      {{ t('trip.info') }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex">
                <UTooltip v-if="!isWaypointAdded(item)" :text="t('trip.addTooltip')">
                  <UButton class="text-xl" :disabled="waypointLoading" @click="addWaypoint(item)"
                    >+</UButton
                  >
                </UTooltip>
                <UTooltip v-if="isWaypointAdded(item)" :text="t('trip.removeTooltip')">
                  <UButton
                    class="text-xl"
                    color="red"
                    :disabled="waypointLoading"
                    @click="removeWaypoint(item)"
                    >-</UButton
                  >
                </UTooltip>
              </div>
            </div>
          </div>
        </Transition>
        <div class="sticky bottom-0 h-min-64 flex flex-col items-center z-20 text-center">
          <div v-if="!collasped">
            <p class="text-xs lg:text-sm">
              <span class="font-bold">{{ nmbrResults }} {{ t('trip.res') }} </span
              ><span class="text-primary">{{ t('trip.avlb') }}</span>
            </p>
          </div>
          <div class="xl:hidden lg:hidden">
            <UButton class="my-2" @click="validateTrip()">{{ t('trip.validate') }} </UButton>
          </div>
        </div>
      </div>
      <div class="absolute top-0 right-0 m-6">
        <UDropdown :items="menuItems" :popper="{ placement: 'bottom-start' }">
          <UButton size="xl" class="p-2" icon="i-heroicons-cog-8-tooth-solid" />
        </UDropdown>
      </div>
      <div class="absolute bottom-0 right-0 xl:block lg:block sm:hidden m-6">
        <UButton size="xl" class="text-xl mx-2" @click="validateTrip()">{{
          t('trip.validate')
        }}</UButton>
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
          class="absolute lg:bottom-0 lg:top-0 lg:left-1/3 right-0 lg:w-1/4 w-full p-6 lg:p-6 lg:m-6 z-5 flex flex-col bg-white"
        >
          <UButton
            class="absolute top-0 right-0 m-2"
            icon="i-heroicons-x-circle"
            variant="ghost"
            @click="drawerOpen = false"
          ></UButton>
          <div class="relative grid grid-cols-1 gap-4 mt-6">
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
            </div>
            <img
              v-if="selectedItem?.imgRef"
              :src="`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${selectedItem?.imgRef}&key=${apiKey}`"
              alt="Hotel Image"
              class="w-full h-full object-cover rounded"
            />
            <UCard v-if="selectedItem?.editorial_summary">
              <div>
                <span>
                  {{ selectedItem?.editorial_summary.overview }}
                </span>
              </div>
            </UCard>
          </div>
          <div v-if="selectedItem.length == 0">
            <div class="flex flex-col">
              <div class="space-y-4 md:space-x-2 md:space-y-0 mt-7 md:flex md:items-center md:mt-0">
                <InputMenuCities
                  v-model="state.departure"
                  :placeholder="t('landing.form.departure')"
                  size="md"
                />
                <UButton
                  variant="ghost"
                  color="black"
                  icon="i-heroicons-arrows-right-left"
                  role="button"
                  @click="invertDestinations"
                />
                <InputMenuCities
                  v-model="state.arrival"
                  :placeholder="t('landing.form.arrival')"
                  size="md"
                />
              </div>
              <div class="space-y-4 md:space-x-2 md:space-y-0 mt-7 md:mt-0">
                <DatePicker
                  v-model="state.range"
                  :ranges="ranges"
                  pop-over-direction="bottom-start"
                  class=""
                  inner-style="text-md w-full font-light bg-transparent hover:bg-transparent focus:bg-transparent border-b-2 border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </Transition>
      <div class="absolute bottom-0 left-0 right-0">
        <UProgress v-if="waypointLoading" animation="carousel" />
      </div>
      <AppAuthModal v-model:open="authModalOpen" />
    </div>
  </div>
</template>

<script setup lang="ts">
import vue3StarRatings from 'vue3-star-ratings';
import { z } from 'zod';

const localePath = useLocalePath();

const { $supabase } = useNuxtApp();

definePageMeta({
  layout: 'trip',
});

const route = useRoute();
const router = useRouter();
const query = {
  origin: route.query.departure,
  destination: route.query.arrival,
  date_start: route.query.d_start,
  date_end: route.query.d_end,
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
  status: z.string(),
});

const loading = ref(true);
const toast = useToast();
const nmbrResults = ref<number>(0);
const waypointLoading = ref(false);
const collasped = ref(false);
const drawerOpen = ref(false);
const authModalOpen = ref(false);
const selectedItem = ref<Array<z.infer<typeof PlaceSchema>>>([]);
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

const isWaypointAdded = (item) => {
  const waypoints = route.query.waypoints && route.query.waypoints.split('|');
  return waypoints && waypoints.includes(item.formatted_address);
};

const ranges = [
  { label: t('datePicker.ranges.oneDay'), duration: { days: 1 } },
  { label: t('datePicker.ranges.oneDay'), duration: { days: 7 } },
  { label: t('datePicker.ranges.oneDay'), duration: { days: 14 } },
  { label: t('datePicker.ranges.oneDay'), duration: { months: 1 } },
  { label: t('datePicker.ranges.oneDay'), duration: { months: 3 } },
  { label: t('datePicker.ranges.oneDay'), duration: { months: 6 } },
  { label: t('datePicker.ranges.oneDay'), duration: { years: 1 } },
];

const tabsItems = [
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

const state = reactive({
  departure: query.origin,
  arrival: query.destination,
  range: { start: new Date(route.query.d_start), end: new Date(route.query.d_end) },
});

const menuItems = [
  [
    {
      label: t('trip.home'),
      icon: 'i-heroicons-home-solid',
      click: () => {
        navigateTo({
          path: localePath('/'),
        });
      },
    },
  ],
  [
    {
      label: t('trip.mytrips'),
      icon: 'i-heroicons-map-solid',
      click: () => {
        navigateTo({
          path: localePath('/mytrips/'),
        });
      },
    },
  ],
];

function showDrawer(item: typeof PlaceSchema) {
  selectedItem.value = item;
  drawerOpen.value = true;
}

function showFilters() {
  selectedItem.value = [];
  drawerOpen.value = true;
}

const invertDestinations = () => {
  const tmpDep = state.departure;

  state.departure = state.arrival;
  state.arrival = tmpDep;
};

async function addWaypoint(item: { formatted_address: String }) {
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

async function removeWaypoint(item: { formatted_address: String }) {
  waypointLoading.value = true;
  let waypoints = route.query.waypoints ? route.query.waypoints.split('|') : [];
  waypoints = waypoints.filter((waypoint) => waypoint !== item.formatted_address);
  const waypointsParam = waypoints.length > 0 ? waypoints.join('|') : undefined;
  await navigateTo({
    query: {
      departure: route.query.departure,
      arrival: route.query.arrival,
      price: route.query.price,
      d_start: route.query.d_start,
      d_end: route.query.d_end,
      waypoints: waypointsParam,
    },
  });
  query.origin = route.query.departure;
  query.destination = route.query.arrival;
  query.waypoints = route.query.waypoints || undefined;
  fetchData();
}

function openClose() {
  collasped.value = !collasped.value;
}

function openAuthModal() {
  authModalOpen.value = true;
}

async function validateTrip() {
  const { data } = await $supabase.auth.getSession();

  if (!data || !data.session) {
    openAuthModal();
    return;
  }
  try {
    const { data, error } = await $supabase
      .from('trips')
      .insert([
        {
          origin: route.query.departure,
          destination: route.query.arrival,
          waypoints: route.query.waypoints,
          route: routes.value,
          start_date: route.query.d_start,
          end_date: route.query.d_end,
          path: route.fullPath,
        },
      ])
      .select();

    if (error) {
      console.error('Error inserting trip:', error);
      return;
    }
    const tripId = data[0].id;
    await navigateTo({
      path: localePath('/mytrip/' + tripId),
    });
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

async function fetchData() {
  await execute();

  if (!fetchedData || error.value) {
    toast.add({ title: 'Failed to fetch data' });
  } else {
    const validatedData = DataSchema.parse(fetchedData.value);
    if (validatedData.status === 'NOT_FOUND') {
      waypointLoading.value = false;
      loading.value = false;
      router.back();
      toast.add({ title: 'No data found' });
      return;
    }
    places.value = validatedData.places;
    routes.value = validatedData.routes;
    nmbrResults.value = validatedData.places.length;
    waypointLoading.value = false;
    loading.value = false;
  }
}

onMounted(fetchData);
</script>
