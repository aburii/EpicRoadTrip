<script setup lang="ts">
import { add } from "date-fns";
import { gsap } from "gsap";

definePageMeta({
  layout: "landing",
});

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const travelKeyWords = [
  "rider la puff ?",
  "kiffer votre vie ?",
  "faire un roadtrip ?",
  "voyager ?",
];

const gsapTextInterval = useIntervalFn(
  () => {
    const tl = gsap.timeline({ yoyo: true });
    tl.to("#myText", {
      duration: 1,
      text: travelKeyWords[randomIntFromInterval(0, 3)],
    });
  },
  2000,
  {
    immediateCallback: false,
    immediate: false,
  },
);

onMounted(() => {
  gsap.defaults({ ease: "none" });
  gsapTextInterval.resume();
});

const ranges = [
  { label: "1 jour", duration: { days: 1 } },
  { label: "1 semaine", duration: { days: 7 } },
  { label: "2 semaines", duration: { days: 14 } },
  { label: "1 mois", duration: { months: 1 } },
  { label: "3 mois", duration: { months: 3 } },
  { label: "6 mois", duration: { months: 6 } },
  { label: "1 an", duration: { years: 1 } },
];

const selected = ref({ end: add(new Date(), { days: 14 }), start: new Date() });

const prices = ["$", "$$", "$$$", "$$$$"];

const price = ref();

const one = ref("");
const two = ref("");
</script>

<template>
  <section class="flex h-full w-full md:items-center justify-normal">
    <section class="md:h-1/3 h-full w-full px-[10px] flex flex-col">
      <h2 class="md:text-5xl text-4xl font-bold leading-snug">
        Où voulez vous
        <span
          id="myText"
          class="italic font-light"
          style="font-family: -apple-system, sans-serif"
        >
        </span>
      </h2>

      <div class="flex flex-grow md:items-center">
        <UForm
          class="flex flex-col md:justify-start md:space-y-0 md:mt-0 mt-8 w-full"
        >
          <div class="mb-4">
            <USelect
              v-model="price"
              class="w-fit"
              :options="prices"
              placeholder="Prix (optionnel)"
            />
          </div>
          <div class="lg:flex lg:items-center lg:justify-between">
            <div
              class="space-y-6 md:space-x-6 md:space-y-0 mt-7 md:flex md:items-center md:mt-0"
            >
              <UInput
                v-model="one"
                placeholder="Depuis"
                size="lg"
                :ui="{ color: { white: { outline: 'text-xl' } } }"
              />
              <UButton
                variant="ghost"
                color="black"
                icon="i-heroicons-arrows-right-left"
              />
              <UInput
                v-model="two"
                placeholder="à"
                size="lg"
                :ui="{ color: { white: { outline: 'text-xl' } } }"
              />

              <DatePicker
                v-model="selected"
                :ranges="ranges"
                pop-over-direction="top-start"
                class="md:hidden"
                inner-style="text-xl w-fit overflow-hidden text-ellipsis whitespace-nowrap w-full font-light bg-transparent hover:bg-transparent focus:bg-transparent border-b-2 border-primary"
              />

              <DatePicker
                v-model="selected"
                :ranges="ranges"
                pop-over-direction="bottom-start"
                class="hidden md:block"
                inner-style="text-xl w-full font-light bg-transparent hover:bg-transparent focus:bg-transparent border-b-2 border-primary"
              />
            </div>
            <div class="mt-16 lg:mt-0 lg:w-1/4 w-full">
              <UButton
                label="Voyager !"
                padded
                block
                class="w-full text-center font-bold"
                size="xl"
              />
            </div>
          </div>
        </UForm>
      </div>
    </section>
  </section>
</template>

<style scoped></style>
