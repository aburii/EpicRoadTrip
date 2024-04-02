<template>
  <div>
    <GoogleMap
      :api-key="apiKey"
      :center="center"
      :street-view-control="false"
      :zoom-control="false"
      :fullscreen-control="false"
      :map-type-control="false"
      :zoom="7"
      class="w-screen h-screen"
    >
      <Marker :options="markerStart" />
      <Marker :options="markerEnd" />
      <Marker
        v-for="(route, index) in props.routes.slice(1, -1)"
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
  </div>
</template>

<script setup lang="ts">
import { GoogleMap, Marker, Polyline } from "vue3-google-map";
import { decode } from '@mapbox/polyline';

const { t } = useI18n();

const runtimeConfig = useRuntimeConfig();
const apiKey = `${runtimeConfig.public.GOOGLE_API_KEY}`;

const props = defineProps({
  routes: {
    type: Object,
    default: () => ({}),
  },
});

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

const tripCoordinates = reactive(
  props.routes.flatMap((route) =>
    route.steps.flatMap((step) => 
      decode(step.polyline).map(([lat, lng]) => ({ lat, lng }))
    ),
  ),
);

const markerIcon = {
  path: "M0,-48v48h48v-48z",
  fillColor: "#FF6B00",
  fillOpacity: 1,
  strokeWeight: 0,
  scale: 1,
  labelOrigin: { x: 24, y: -24 },
};

const markerStart = {
  position: startPoint,
  label: { text: t("trip.start"), color: "white" },
  title: "Starting Point",
  icon: markerIcon,
};

const markerEnd = {
  position: endPoint,
  label: { text: t("trip.stop"), color: "white" },
  title: "Ending Point",
  icon: markerIcon,
};

const tripPath = {
  path: tripCoordinates,
  geodesic: true,
  strokeColor: "#FF6B00",
  strokeOpacity: 1.0,
  strokeWeight: 5,
};
</script>
