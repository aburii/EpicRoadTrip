<script setup lang="ts">
import { add } from "date-fns";
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import AppTextWriter from "~/components/AppTextWriter.vue";

definePageMeta({
  layout: "landing",
});

const { t, tm } = useI18n();

const travelSentences = tm("travelKeywords");

const ranges = [
  { label: t("datePicker.ranges.oneDay"), duration: { days: 1 } },
  { label: t("datePicker.ranges.oneDay"), duration: { days: 7 } },
  { label: t("datePicker.ranges.oneDay"), duration: { days: 14 } },
  { label: t("datePicker.ranges.oneDay"), duration: { months: 1 } },
  { label: t("datePicker.ranges.oneDay"), duration: { months: 3 } },
  { label: t("datePicker.ranges.oneDay"), duration: { months: 6 } },
  { label: t("datePicker.ranges.oneDay"), duration: { years: 1 } },
];

const cities = ["Paris", "Londres", "New York", "Singapour"];

const prices = ["$", "$$", "$$$", "$$$$"];

const schema = z.object({
  departure: z.string(),
  arrival: z.string(),
  price: z.string().optional(),
  range: z.object({ start: z.date(), end: z.date() }),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  departure: undefined,
  arrival: undefined,
  price: undefined,
  range: { start: new Date(), end: add(new Date(), { days: 14 }) },
});

function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data);
}

const invertDestinations = () => {
  const tmpDep = state.departure;

  state.departure = state.arrival;
  state.arrival = tmpDep;
};
</script>

<template>
  <section class="flex h-full w-full md:items-center justify-normal">
    <section class="md:h-1/3 h-full w-full px-[10px] flex flex-col">
      <h2 class="md:text-5xl text-4xl font-bold leading-snug">
        {{ t("travelPrefix") }}
        <AppTextWriter
          id="travelSentence"
          :duration="1"
          :sentences="travelSentences"
          :interval="1500"
          class="font-light italic"
        />
      </h2>

      <div class="flex flex-grow md:items-center">
        <UForm
          :schema="schema"
          :state="state"
          class="flex flex-col md:justify-start md:space-y-0 md:mt-0 mt-8 w-full"
          @submit="onSubmit"
        >
          <div class="mb-4">
            <USelect
              v-model="state.price"
              class="w-fit"
              :options="prices"
              :placeholder="t('landing.form.price')"
            />
          </div>
          <div class="lg:flex lg:items-center lg:justify-between">
            <div
              class="space-y-7 md:space-x-6 md:space-y-0 mt-7 md:flex md:items-center md:mt-0"
            >
              <InputMenuCities
                v-model="state.departure"
                :placeholder="t('landing.form.departure')"
                size="lg"
                :options="cities"
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
                size="lg"
                :options="cities"
              />
              <DatePicker
                v-model="state.range"
                :ranges="ranges"
                pop-over-direction="bottom-start"
                class=""
                inner-style="text-xl w-full font-light bg-transparent hover:bg-transparent focus:bg-transparent border-b-2 border-primary"
              />
            </div>
            <div class="mt-16 lg:mt-0 lg:w-1/4 w-full">
              <UButton
                :label="t('landing.form.cta')"
                padded
                block
                class="w-full lg:w-4/5 text-center font-bold lg:ms-auto"
                size="xl"
                type="submit"
              />
            </div>
          </div>
        </UForm>
      </div>
    </section>
  </section>
</template>

<style scoped></style>
