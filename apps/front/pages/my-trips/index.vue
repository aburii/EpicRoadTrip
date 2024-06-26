<template>
  <div>
    <div>
      <div v-if="!loading && trips.length > 0">
        <div v-for="group in groupedTrips" :key="group.label">
          <UDivider class="" :label="group.label" />
          <div
            v-for="trip in group.trips"
            :key="trip.id"
            class="flex flex-col rounded-lg overflow-hidden shadow-md my-4 mb-8 relative bg-white"
          >
            <TripMap class="h-72 w-full" :zoom="6" :routes="trip.route" :copyright="true" />
            <div class="absolute top-0 left-0 bg-white p-2 m-2 shadow-md">
              <span class="text-primary font-bold">
                {{ tripStatus(trip.start_date, trip.end_date) }}
              </span>
            </div>
            <div class="absolute top-0 right-0 m-2">
              <UDropdown :items="menuItems" :popper="{ placement: 'bottom-start' }" class="m-2">
                <UButton
                  icon="i-heroicons-cog-8-tooth-solid"
                  color="primary"
                  variant="solid"
                  @click="selectedTrip = trip"
                />
              </UDropdown>
            </div>
            <div class="px-4 flex-grow">
              <p class="text-md lg:text-xl">
                <span class="font-bold text-primary">
                  {{ trip.origin }}
                </span>
                {{ t('trip.recap.3') }}
                <span class="font-bold text-primary">
                  {{ trip.destination }}
                </span>
              </p>
              <p class="lg:text-xl">
                <span class="text-primary font-bold">{{ formatDate(trip.start_date) }}</span>
                {{ t('trip.recap.5') }}
                <span class="text-primary font-bold">{{ formatDate(trip.end_date) }}</span>
              </p>
            </div>
            <div class="p-4 flex justify-end">
              <NuxtLink :to="localePath(`/my-trips/${trip.id}`)">
                <UButton :label="t('trip.more')" color="primary">
                  <template #trailing>
                    <UIcon name="i-heroicons-arrow-right-20-solid" class="w-5 h-5" />
                  </template>
                </UButton>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      <div v-if="loading">
        <div
          v-for="i in 2"
          :key="i"
          class="flex flex-col rounded-lg overflow-hidden shadow-md my-4"
        >
          <LoaderTripDetail />
        </div>
      </div>
    </div>
    <div v-if="!loading && trips.length == 0" class="flex flex-col items-center justify-center">
      <NoDataFound :title="t('trip.none-saved')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';

const { $supabase } = useNuxtApp();
const formatDate = useFormatDate();
const localePath = useLocalePath();
const { t } = useI18n();

const toast = useToast();

const TripSchema = z.object({
  id: z.string(),
  path: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  user_id: z.string(),
  origin: z.string(),
  destination: z.string(),
});

const loading = ref(true);

const selectedTrip = ref<z.infer<typeof TripSchema>>(null);
const trips = ref<Array<z.infer<typeof TripSchema>>>([]);

definePageMeta({
  layout: 'default',
  middleware: 'auth',
});

const menuItems = [
  [
    {
      label: t('trip.edit'),
      icon: 'i-heroicons-pencil-square-solid',
      click: () => {
        editTrip(selectedTrip.value.path);
      },
    },
    {
      label: t('trip.remove'),
      icon: 'i-heroicons-trash-solid',
      click: () => {
        deleteTrip(selectedTrip.value.id);
      },
    },
  ],
];

async function editTrip(path) {
  await navigateTo(path + '&id=' + selectedTrip.value.id);
}

async function deleteTrip(tripId) {
  const { error } = await $supabase.from('trips').delete().eq('id', tripId);

  if (error) {
    toast.add({ title: 'Error deleting trip' });
  } else {
    fetchData();
  }
}

const tripStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    const diff = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
    return `${t('trip.in')} ${diff} ${t('trip.days')}`;
  } else if (now > end) {
    return t('trip.finished');
  } else {
    return t('trip.progress');
  }
};

function sortTrips(trips) {
  const now = new Date();
  return trips.sort((a, b) => {
    const startA = new Date(a.start_date);
    const endA = new Date(a.end_date);
    const startB = new Date(b.start_date);
    const endB = new Date(b.end_date);

    const isFinishedA = now > endA;
    const isFinishedB = now > endB;

    if (isFinishedA === isFinishedB) {
      return startA - startB;
    } else if (isFinishedA && !isFinishedB) {
      return 1;
    } else {
      return -1;
    }
  });
}

const groupedTrips = computed(() => {
  const upcoming = [];
  const inProgress = [];
  const finished = [];

  for (const trip of trips.value) {
    const status = tripStatus(trip.start_date, trip.end_date);
    if (status.includes(t('trip.days'))) {
      upcoming.push(trip);
    } else if (status === t('trip.progress')) {
      inProgress.push(trip);
    } else {
      finished.push(trip);
    }
  }

  const groups = [];
  if (inProgress.length > 0) {
    groups.push({ label: t('trip.progress'), trips: inProgress });
  }
  if (upcoming.length > 0) {
    groups.push({ label: t('trip.upcoming'), trips: upcoming });
  }
  if (finished.length > 0) {
    groups.push({ label: t('trip.finished'), trips: finished });
  }

  return groups;
});

async function fetchData() {
  const { data } = await $supabase.auth.getSession();

  if (!data || !data.session) {
    return;
  }

  const userId = data.session.user.id;

  const { data: fetchedTrips, error: errorTrip } = await $supabase
    .from('trips')
    .select('*')
    .eq('user_id', userId);

  if (errorTrip) {
    toast.add({ title: 'Error deleting trip' });
    return;
  }

  trips.value = sortTrips(fetchedTrips);

  loading.value = false;
}

onMounted(fetchData);
</script>
