<template>
  <UIcon name="i-heroicons-exclamation-circle" class="text-6xl text-primary my-4" />
  <p class="text-xl">{{ title }}</p>
  <NuxtLink :to="localePath('/')">
    <UButton :label="t('trip.back-home')" color="primary" class="my-4">
      <template #trailing>
        <UIcon name="i-heroicons-arrow-right-20-solid" class="w-5 h-5" />
      </template>
    </UButton>
  </NuxtLink>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { t } = useI18n();

const props = defineProps<{
  title: string;
}>();

const title = computed(() => props.title ?? t('no-data'));
</script>
