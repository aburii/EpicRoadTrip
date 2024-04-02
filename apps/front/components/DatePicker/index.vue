<script setup lang="ts">
import { type Duration, format, isSameDay, add } from 'date-fns';
import type { DatePickerRange } from '~/types/date-picker';

defineProps<{
  innerStyle: string;
  ranges: DatePickerRange[];
}>();

const selected = defineModel<{ start: Date; end: Date }>();

function isRangeSelected(duration: Duration) {
  if (!selected.value) {
    return false;
  }

  return (
    isSameDay(selected.value.start, add(new Date(), duration)) &&
    isSameDay(selected.value.end, new Date())
  );
}

function selectRange(duration: Duration) {
  selected.value = { end: add(new Date(), duration), start: new Date() };
}
</script>

<template>
  <UPopover v-if="selected" :popper="{ placement: 'auto' }">
    <UButton
      icon="i-heroicons-calendar-days-20-solid"
      size="lg"
      :ui="{
        base: 'overflow-hidden text-ellipsis whitespace-nowrap',
        rounded: 'rounded-none',
        color: {
          primary: {
            solid: innerStyle,
          },
        },
      }"
    >
      {{ format(selected.start, 'd MMM, yyy') }} -
      {{ format(selected.end, 'd MMM, yyy') }}
    </UButton>

    <template #panel="{ close }">
      <div class="flex items-center sm:divide-x font- divide-gray-200 dark:divide-gray-800">
        <div class="hidden sm:flex flex-col py-4">
          <UButton
            v-for="(range, index) in ranges"
            :key="index"
            :label="range.label"
            color="gray"
            variant="ghost"
            class="rounded-none px-6"
            :class="[
              isRangeSelected(range.duration)
                ? 'bg-gray-100 dark:bg-gray-800'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
            ]"
            truncate
            @click="selectRange(range.duration)"
          />
        </div>

        <DatePickerRaw v-model="selected" @close="close" />
      </div>
    </template>
  </UPopover>
</template>

<style scoped></style>
