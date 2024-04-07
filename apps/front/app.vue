<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <UNotifications />
</template>

<script lang="ts" setup>
const i18n = useI18n();

i18n.setLocaleCookie(i18n.locale.value);
</script>
