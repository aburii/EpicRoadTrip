<template>
  <div class="relative">
    <USkeleton v-if="loading" class="w-full h-full" />
    <div v-if="fullscreenMap" class="absolute top-0 right-0 m-2 z-10">
      <UButton
        icon="i-heroicons-arrows-pointing-out"
        color="primary"
        variant="ghost"
        @click="isOpen = true"
      />
    </div>
    <GoogleMap
      id="map"
      ref="mapRef"
      :api-key="apiKey"
      :center="center"
      :street-view-control="false"
      :zoom-control="false"
      :fullscreen-control="false"
      :map-type-control="false"
      :zoom="props.zoom"
      :min-zoom="3"
      class="w-full h-full"
    >
      <Marker :options="markerStart" />
      <Marker :options="markerEnd" />
      <Marker
        v-if="props.marker"
        :options="{
          position: { lat: props.marker.lat, lng: props.marker.long },
          icon: markerTemp,
        }"
      />
      <Marker
        v-for="(route, index) in slicedRoutes"
        :key="index"
        :options="{
          position: { lat: route.lat, lng: route.long },
          icon: markerIcon,
          label: { text: (index + 1).toString(), color: 'white' },
          title: route.name,
        }"
      />
      <Polyline :options="tripPath" />
    </GoogleMap>
    <div v-if="copyright" class="absolute bottom-0 left-0 w-full h-6 bg-white"></div>
    <UModal v-model="isOpen" fullscreen>
      <UCard
        :ui="{
          base: 'h-full flex flex-col',
          rounded: '',
          body: {
            base: 'grow',
          },
        }"
      >
        <div class="absolute top-0 right-0 m-8 z-10">
          <UButton
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isOpen = false"
          />
        </div>

        <GoogleMap
          id="map"
          ref="mapRef"
          :api-key="apiKey"
          :center="center"
          :street-view-control="false"
          :zoom-control="false"
          :fullscreen-control="false"
          :map-type-control="false"
          :zoom="props.zoom"
          class="w-full h-full"
        >
          <Marker :options="markerStart" />
          <Marker :options="markerEnd" />
          <Marker
            v-for="(route, index) in slicedRoutes"
            :key="index"
            :options="{
              position: { lat: route.lat, lng: route.long },
              icon: markerIcon,
              label: { text: (index + 1).toString(), color: 'black' },
              title: route.name,
            }"
          />
          <Polyline :options="tripPath" />
        </GoogleMap>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { GoogleMap, Marker, Polyline } from 'vue3-google-map';
import { decode } from '@mapbox/polyline';
import { z } from 'zod';
const { t } = useI18n();

const runtimeConfig = useRuntimeConfig();
const apiKey = runtimeConfig.public.GOOGLE_API_KEY;

const loading = ref(true);
const isOpen = ref(false);

const mapRef = ref(null);

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

const markerSchema = z.object({
  name: z.string(),
  lat: z.number(),
  long: z.number(),
});

export interface Props {
  routes?: z.infer<typeof RouteSchema>[];
  zoom?: number;
  fullscreenMap?: boolean;
  copyright?: boolean;
  marker?: z.infer<typeof markerSchema>;
}

const props = withDefaults(defineProps<Props>(), {
  routes: () => [],
  zoom: 7,
  fullscreenMap: false,
  copyright: false,
});

const slicedRoutes = computed(() => props.routes.slice(1, -1));

const tripCoordinates = computed(() =>
  props.routes.length > 0
    ? props.routes.flatMap((route) =>
        route.steps.flatMap((step) => decode(step.polyline).map(([lat, lng]) => ({ lat, lng }))),
      )
    : [],
);

const tripPath = computed(() => ({
  path: tripCoordinates.value,
  geodesic: true,
  strokeColor: '#FF6B00',
  strokeOpacity: 1.0,
  strokeWeight: 5,
}));

const startPoint = reactive({
  lat: props.routes[0].lat,
  lng: props.routes[0].long,
});
const endPoint = reactive({
  lat: props.routes[props.routes.length - 1].lat,
  lng: props.routes[props.routes.length - 1].long,
});
const center = reactive({
  lat: props.routes[0].lat,
  lng: props.routes[0].long,
});

const markerIcon = {
  path: 'M0,-48v48h48v-48z',
  fillColor: '#FF6B00',
  fillOpacity: 1,
  strokeWeight: 0,
  scale: 0.6,
  labelOrigin: { x: 24, y: -24 },
};

const markerTemp = {
  fillColor: '#FF6B00',
  fillOpacity: 1,
  strokeWeight: 0,
  scale: 2,
};

const markerStart = {
  position: startPoint,
  label: { text: t('trip.start'), color: 'white', fontSize: '10px' },
  title: 'Starting Point',
  icon: markerIcon,
};

const markerEnd = {
  position: endPoint,
  label: { text: t('trip.stop'), color: 'white', fontSize: '10px' },
  title: 'Ending Point',
  icon: markerIcon,
};

watch(
  () => mapRef.value?.ready,
  (ready) => {
    if (!ready) return;
    loading.value = false;
  },
);
</script>
