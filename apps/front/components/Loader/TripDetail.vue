<template>
  <div>
    <USkeleton class="h-64 w-full" />
    <div class="p-4 flex-grow">
      <p>
        <USkeleton class="h-5 w-1/3 my-2" />
      </p>
      <p>
        <USkeleton class="h-5 w-1/2 my-2" />
      </p>
    </div>
    <div class="p-4 flex justify-end">
      <UButton name="i-heroicons-chevron-right" disabled>{{ t('trip.more') }}</UButton>
    </div>
  </div>
</template>

<script setup LANG="ts">
const { t } = useI18n();
</script>
