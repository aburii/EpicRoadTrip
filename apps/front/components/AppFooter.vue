<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();

const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="min-h-[80px] md:px-16 px-4 py-2 bg-transparent no-print">
    <section class="w-full h-full flex flex-col-reverse md:flex-row items-center justify-between">
      <div class="text-xs">© {{ currentYear }} Lana. {{ t('footer.copyrights') }}</div>
      <div>
        <UButton
          :label="t('footer.legalNotice')"
          color="black"
          variant="link"
          :to="localePath('/legal-notice')"
        />
      </div>
    </section>
  </footer>
</template>

<style scoped></style>
