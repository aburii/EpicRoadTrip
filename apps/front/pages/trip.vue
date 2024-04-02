<template>
  <div v-if="!loading" class="relative w-screen h-screen">
    <TripMap class="absolute z-0" :routes="routes" />
    <div
      class="absolute bottom-0 lg:top-0 left-0 right-0 lg:w-1/3 p-2 lg:p-12 lg:m-6 z-10 flex flex-col"
      :class="{ 'rounded-l': drawerOpen, rounded: !drawerOpen }"
      style="background-color: rgba(255, 255, 255, 0.9)"
    >
      <div
        class="sticky top-0 flex flex-col items-center lg:text-xl text-sm z-20 mb-2 text-center"
      >
        <UButton class="md:hidden lg:hidden" variant="ghost" @click="openClose"
          >Toggle</UButton
        >
        <div class="mb-6">
          <p>
            <span class="font-bold"> {{ t("trip.recap.1") }} </span>
            {{ t("trip.recap.2") }}
            <span class="font-bold text-primary">
              {{ $route.query.departure }}
            </span>
            {{ t("trip.recap.3") }}
            <span class="font-bold text-primary">{{
              $route.query.arrival
            }}</span>
          </p>
          <p>
            {{ t("trip.recap.4") }}
            <span class="text-primary font-bold">{{
              new Date($route.query.d_start).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            }}</span>
            {{ t("trip.recap.5") }}
            <span class="text-primary font-bold">{{
              new Date($route.query.d_end).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            }}</span>
          </p>
        </div>
        <UTabs v-if="!collasped" :items="items" />
      </div>
      <transition
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
                  <h2 class="text-sm lg:text">Portland, AB1523</h2>
                  <p
                    class="text-sm lg:text underline text-primary cursor-pointer"
                    @click="showDrawer(item)"
                  >
                    {{ t("trip.info") }}
                  </p>
                </div>
              </div>
              <div class="flex">
                <UTooltip :text="t('trip.addTooltip')">
                  <UButton
                    class="text-2xl lg:text-3xl"
                    @click="addItemToRoute(item)"
                    >+</UButton
                  >
                </UTooltip>
              </div>
            </div>
          </UCard>
        </div>
      </transition>
      <div
        v-if="!collasped"
        class="sticky bottom-0 flex flex-col items-center z-20 text-center"
      >
        <p class="text-xs lg:text-sm">
          <span class="font-bold">{{ nmbrResults }} {{ t("trip.res") }} </span
          ><span class="text-primary">{{ t("trip.avlb") }}</span>
        </p>
      </div>
    </div>
    <!-- DRAWER -->
    <transition
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
        <UButton class="absolute top-0 right-0 m-2" @click="drawerOpen = false">
          Close
        </UButton>
        <div class="relative grid grid-cols-1 gap-4 mt-6">
          <UCard>
            <div>
              <h2 class="text-sm lg:text-2xl text-primary">
                {{ selectedItem?.name }}
              </h2>
            </div>
          </UCard>
          <UCard>
            <img
              :src="`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${selectedItem?.imgRef}&key=${apiKey}`"
              alt="Hotel Image"
              class="w-full h-full object-cover rounded"
            />
          </UCard>
        </div>
      </div>
    </transition>
  </div>
  <div
    v-else
    class="flex items-center justify-center bg-white h-screen w-screen relative"
  >
    <img
      src="https://i.pinimg.com/originals/43/3b/6c/433b6c5336c72a21bcfd9db8d831562a.gif"
      alt="Loading"
    />
    <h2
      class="absolute inset-0 flex items-center justify-center text-xl lg:text-2xl top-1/3 text-center mx-8"
    >
      <AppTextWriter
        id="loadingSentences"
        :duration="0.5"
        :sentences="loadingSentences"
        :interval="1000"
      />
    </h2>
  </div>
</template>

<script setup lang="ts">
const nmbrResults = ref(null);
const loading = ref(true);
const collasped = ref(false);
const drawerOpen = ref(false);
const selectedItem = ref(null);
const places = ref(null);
const routes = ref({});
const route = useRoute();
const { t, tm } = useI18n();
const runtimeConfig = useRuntimeConfig();
const apiKey = `${runtimeConfig.public.GOOGLE_API_KEY}`;

const loadingSentences = tm("trip.loadingSentences");

const items = [
  {
    label: t("trip.types.all"),
  },
  {
    label: t("trip.types.hotel"),
  },
  {
    label: t("trip.types.activity"),
  },
  {
    label: t("trip.types.bar"),
  },
  {
    label: t("trip.types.restaurant"),
  },
];

function showDrawer(item) {
  selectedItem.value = item;
  drawerOpen.value = true;
}

function addItemToRoute(item) {
  const { lat, long } = item;

  if (routes.value.length > 0) {
    const newRoutes = [
      ...routes.value.slice(0, routes.value.length - 1),
      { lat, long },
      routes.value[routes.value.length - 1],
    ];
    routes.value = newRoutes;
  }
}

function openClose() {
  collasped.value = !collasped.value;
}

onMounted(async () => {
  const { data, error } = await useFetch(
    `/api/call?origin=${route.query.departure}&destination=${route.query.arrival}`,
  );
  if (error.value) {
    console.error("Failed to fetch data:", error.value);
  } else {
    places.value = data.value.places;
    routes.value = data.value.routes;
    nmbrResults.value = data.value.places.length;
    loading.value = false;
  }
});
</script>
