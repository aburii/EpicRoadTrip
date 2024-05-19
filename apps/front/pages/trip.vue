<template>
  <div>
    <TripLoading v-if="loading" />
    <div v-else class="relative w-screen h-screen">
      <TripMap class="absolute z-0 w-screen h-screen" :routes="routes" :marker="marker" />
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
          <div class="mb-4 mx-5">
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
              <span class="text-primary font-bold">{{ formatDate($route.query.d_start) }}</span>
              {{ t('trip.recap.5') }}
              <span class="text-primary font-bold">{{ formatDate($route.query.d_end) }}</span>
            </p>
          </div>
          <UTabs v-if="!collasped" :items="tabsItems" @change="handleTabClick" />
        </div>
        <div
          v-if="!collasped"
          class="relative grid grid-cols-1 overflow-y-auto rounded mb-2 h-72 lg:h-auto"
        >
          <div v-if="filteredPlaces.length > 0">
            <div v-for="item in filteredPlaces" :key="item" class="flex justify-between p-2">
              <div class="flex justify-between gap-2">
                <img
                  :src="imageSrc"
                  alt="Image places"
                  class="w-20 h-20 lg:w-28 lg:h-28 object-cover rounded"
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
                    <p v-if="item.url" class="text-xs underline text-primary cursor-pointer">
                      <a :href="fullUrl(item)" target="_blank">{{ t('trip.info') }}</a>
                    </p>
                  </div>
                </div>
              </div>
              <div class="flex">
                <UTooltip v-if="!isWaypointAdded(item)" :text="t('trip.addTooltip')">
                  <UButton
                    class="text-xl"
                    :disabled="waypointLoading"
                    @mouseover="showLocation(item as typeof markerSchema)"
                    @mouseleave="showLocation(null)"
                    @click="addWaypoint(item)"
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
          <div v-for="i in 8" v-else :key="i" class="my-2">
            <div class="flex justify-between gap-2">
              <USkeleton class="w-20 h-20 lg:w-28 lg:h-28 object-cover rounded" />
              <div class="mx-2">
                <div class="flex">
                  <USkeleton class="my-2 w-48 h-5" />
                </div>
                <div>
                  <USkeleton class="my-2 w-36 h-3" />
                </div>
              </div>
              <div class="flex">
                <UButton class="text-xl" disabled="true">+</UButton>
              </div>
            </div>
          </div>
        </div>
        <div class="sticky bottom-0 h-min-64 flex flex-col items-center z-20 text-center">
          <div v-if="!collasped">
            <p class="text-xs lg:text-sm">
              <span class="font-bold">{{ nmbrResults }} {{ t('trip.res') }} </span
              ><span class="text-primary">{{ t('trip.avlb') }}</span>
            </p>
          </div>
          <div class="xl:hidden lg:hidden">
            <UButton class="my-2" @click="validateTrip()">
              {{ route.query.id ? t('trip.save') : t('trip.validate') }}
            </UButton>
          </div>
        </div>
      </div>
      <div class="absolute top-0 right-0 m-6">
        <UDropdown :items="menuItems" :popper="{ placement: 'bottom-start' }">
          <UButton size="xl" class="p-2" icon="i-heroicons-cog-8-tooth-solid" />
        </UDropdown>
      </div>
      <div class="absolute bottom-0 right-0 xl:block lg:block sm:hidden m-6">
        <UButton size="xl" class="my-2" @click="validateTrip()">
          {{ route.query.id ? t('trip.save') : t('trip.validate') }}
        </UButton>
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
              <div class="space-y-4 md:space-x-2 md:space-y-0 mt-7 md:mt-2">
                <UInput v-model="filterWord" variant="outline" placeholder="Search..." />
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
const formatDate = useFormatDate();

const { $supabase } = useNuxtApp();

definePageMeta({
  layout: 'trip',
});

const route = useRoute();
const router = useRouter();

const PlaceSchema = z.object({
  name: z.string().nullable(),
  url: z.string().nullable().optional(),
  formatted_address: z.string().nullable().optional(),
  lat: z.number(),
  long: z.number(),
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

const markerSchema = z.object({
  name: z.string().nullable(),
  lat: z.number().nullable(),
  long: z.number().nullable(),
});

const loading = ref(true);
const toast = useToast();
const nmbrResults = ref<number>(0);
const waypointLoading = ref(false);
const collasped = ref(false);
const drawerOpen = ref(false);
const authModalOpen = ref(false);
const selectedType = ref<String>('7314');
const filterWord = ref<String>('');
const selectedItem = ref<Array<z.infer<typeof PlaceSchema>>>([]);
const places = ref<Array<z.infer<typeof PlaceSchema>>>([]);
const routes = ref<z.infer<typeof RouteSchema>>([]);
const marker = ref<z.infer<typeof markerSchema>>(null);
const { t } = useI18n();

const query = {
  origin: route.query.departure,
  places_type: selectedType.value,
  destination: route.query.arrival,
  ...(route.query.waypoints ? { waypoints: route.query.waypoints } : {}),
  language: 'fr-FR',
};
const {
  data: fetchedData,
  error,
  execute,
} = await useFetch('/api/call', {
  immediate: false,
  query,
});

const imageSrc = computed(() => {
  switch (selectedType.value) {
    case '7314':
      return 'https://em-content.zobj.net/source/apple/118/hotel_1f3e8.png';
    case '7317':
      return 'https://em-content.zobj.net/source/facebook/92/classical-building_1f3db-fe0f.png';
    case '9376':
      return 'https://em-content.zobj.net/source/apple/81/tropical-drink_1f379.png';
    case '7315':
      return 'https://em-content.zobj.net/source/apple/118/fork-and-knife-with-plate_1f37d.png';
    default:
      return 'https://i.pinimg.com/originals/56/13/d9/5613d9449b7ac04941fbef109f0506dd.png';
  }
});

const isWaypointAdded = (item) => {
  const waypoints = route.query.waypoints && route.query.waypoints.split('|');
  return waypoints && waypoints.includes(item.formatted_address);
};

const tabsItems = [
  {
    label: t('trip.types.hotel'),
    id: '7314',
  },
  {
    label: t('trip.types.activity'),
    id: '7317',
  },
  {
    label: t('trip.types.bar'),
    id: '9376',
  },
  {
    label: t('trip.types.restaurant'),
    id: '7315',
  },
];

const filteredPlaces = computed(() => {
  if (filterWord.value) {
    return places.value.filter((place) =>
      place.name.toLowerCase().includes(filterWord.value.toLowerCase()),
    );
  }
  return places.value;
});

function getRandomIntString() {
  const randomInt = Math.floor(Math.random() * 1000000);
  return randomInt.toString();
}

const state = reactive({
  departure: { name: query.origin, id: getRandomIntString() },
  arrival: { name: query.destination, id: getRandomIntString() },
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
          path: localePath('/my-trips/'),
        });
      },
    },
  ],
];

watch(
  state,
  async (newState) => {
    waypointLoading.value = true;
    await navigateTo({
      query: {
        departure: newState.departure.name ? newState.departure.name : newState.departure,
        arrival: newState.arrival.name ? newState.arrival.name : newState.arrival,
        price: route.query.price,
        d_start: route.query.d_start,
        d_end: route.query.d_end,
        waypoints: route.query.waypoints,
        id: route.query.id,
      },
    });
    query.origin = route.query.departure;
    query.destination = route.query.arrival;
    fetchData();
  },
  { deep: true },
);

function fullUrl(item: { url?: string } | null | undefined): string {
  return item && item.url ? `https://` + item.url : '';
}

function showLocation(item: typeof markerSchema) {
  marker.value = item;
}

async function handleTabClick(index: number) {
  waypointLoading.value = true;
  places.value = [];
  const item = tabsItems[index];
  selectedType.value = item.id;
  query.places_type = selectedType.value;
  await navigateTo({
    query: {
      departure: route.query.departure,
      arrival: route.query.arrival,
      places_type: item.id,
      price: route.query.price,
      d_start: route.query.d_start,
      d_end: route.query.d_end,
      waypoints: route.query.waypoints,
      id: route.query.id,
    },
  });
  fetchData();
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
      id: route.query.id,
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
      id: route.query.id,
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
  const url = new URL(route.fullPath, window.location.origin);
  url.searchParams.delete('id');
  const fullPath = url.pathname + url.search;

  if (!data || !data.session) {
    openAuthModal();
    return;
  }
  try {
    let data, error;
    if (route.query.id) {
      // Update existing trip
      ({ data, error } = await $supabase
        .from('trips')
        .update({
          origin: route.query.departure,
          destination: route.query.arrival,
          waypoints: route.query.waypoints,
          route: routes.value,
          start_date: route.query.d_start,
          end_date: route.query.d_end,
          path: fullPath,
        })
        .eq('id', route.query.id));
    } else {
      // Insert new trip
      ({ data, error } = await $supabase
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
        .select());
    }

    if (error) {
      toast.add({ title: 'Failed to save/update trip' });
      return;
    }
    const tripId = data ? data[0].id : route.query.id;
    await navigateTo({
      path: localePath('/my-trips/' + tripId),
    });
  } catch (error) {
    toast.add({ title: 'Unexpected Error' });
  }
}

async function fetchData() {
  await execute();

  if (!fetchedData || error.value) {
    toast.add({ title: 'Failed to fetch data' });
  } else {
    const validatedData = DataSchema.parse(fetchedData.value);
    if (validatedData.status === 'NOT_FOUND' || validatedData.status === 'ZERO_RESULTS') {
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
