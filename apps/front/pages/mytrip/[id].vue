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
              <span class="text-primary font-bold">{{
                new Date(mytrip.start_date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              }}</span>
              {{ t('trip.recap.5') }}
              <span class="text-primary font-bold">{{
                new Date(mytrip.end_date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              }}</span>
            </p>
          </div>
          <UDropdown :items="menuItems" :popper="{ placement: 'bottom-start' }" class="m-2">
            <UButton icon="i-heroicons-share-solid" color="primary" square variant="ghost" />
          </UDropdown>
        </div>
        <TripMap
          class="h-72 w-full"
          :zoom="7"
          :routes="RouteCoords"
          :fullscreen-map="true"
          :copyright="true"
        />
        <div>
          <h2 class="font-bold text-md lg:text-lg mx-4">{{ t('trip.waypoints') }}</h2>
        </div>
        <div class="text-lg p-4 mb-4">
          <div v-for="(coord, index) in RouteCoords" :key="index">
            <div class="mb-1">
              <UBadge class="my-2" color="white" variant="solid">{{
                new Date(dates[index]).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              }}</UBadge>
              <h2 class="font-bold text-primary text-sm lg:text-md mb-2">{{ coord.name }}</h2>
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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { z } from 'zod';

const route = useRoute();
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
  })
  .nullable();

const StepSchema = z.object({
  lat: z.number(),
  long: z.number(),
  name: z.string(),
  steps: z.array(z.unknown()).optional(),
});

const RouteCoordsSchema = z.array(StepSchema).nullable();

const DateSchema = z.array(z.instanceof(Date));

const mytrip = ref<z.infer<typeof TripSchema>>(null);
const RouteCoords = ref<z.infer<typeof RouteCoordsSchema>>(null);
const dates = ref<z.infer<typeof DateSchema>>([]);

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

function getDatesBetween(startDate: Date | string, endDate: Date | string): Date[] {
  const dates = [];
  let currentDate = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate += 24 * 60 * 60 * 1000;
  }

  return dates;
}

async function copyToClipboard() {
  await navigator.clipboard.writeText(window.location.href);
  toast.add({ title: 'Copied to clipboard' });
}

async function exportToPdf() {
  toast.add({ title: 'Exporting to pdf' });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const elements = document.querySelectorAll('.pdf-content');
  // eslint-disable-next-line new-cap
  const pdf = new jsPDF('p', 'mm', 'a4');

  let pdfHeight = 0;

  for (let i = 0; i < elements.length; i++) {
    const canvas = await html2canvas(elements[i]);
    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, pdfHeight, pdfWidth, imgHeight);
    pdfHeight += imgHeight;
  }

  pdf.save(
    `${mytrip.value.origin} - ${mytrip.value.destination} (${mytrip.value.start_date}${mytrip.value.end_date}).pdf`,
  );
}

async function fetchData() {
  const { data: trip, error } = await $supabase.from('trips').select('*').eq('id', id);
  if (error) {
    console.error('Error fetching trips:', error);
  } else if (trip && trip.length > 0) {
    mytrip.value = trip[0];
    RouteCoords.value = trip[0].route;
    dates.value = getDatesBetween(mytrip.value.start_date, mytrip.value.end_date);
  } else {
    console.log('No trip found with id:', id);
  }
  loading.value = false;
}

onMounted(fetchData);
</script>
