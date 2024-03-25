<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <footer class="min-h-[80px] md:px-16 px-4 py-2 bg-transparent">
    <section
      class="w-full h-full flex flex-col-reverse md:flex-row items-center justify-between"
    >
      <div class="text-xs">© 2024 Lana. {{ t("footer.copyrights") }}</div>
      <div>
        <UButton :label="t('footer.termsOfUse')" color="black" variant="link" />
        <UButton :label="t('footer.privacy')" color="black" variant="link" />
      </div>
    </section>
  </footer>
</template>

<style scoped></style>
