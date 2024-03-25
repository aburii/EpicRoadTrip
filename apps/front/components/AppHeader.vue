<script setup lang="ts">
const i18n = useI18n();
const { locales } = i18n;
</script>

<template>
  <header class="min-h-[80px] bg-blue-500 md:px-16 px-4 py-2 bg-transparent">
    <section class="w-full h-full flex items-center justify-between">
      <UPopover mode="hover">
        <UButton
          icon="i-heroicons-language"
          size="xl"
          color="black"
          variant="ghost"
          :trailing="false"
        />

        <template #panel>
          <UButton
            v-for="loc in locales"
            :key="loc.code"
            variant="ghost"
            class="block w-full"
            size="lg"
            :ui="{ rounded: 'rounded-none' }"
            @click="i18n.setLocale(loc.code)"
          >
            {{ loc.name }}
          </UButton>
        </template>
      </UPopover>

      <h1
        class="font-title md:tracking-[0.8rem] tracking-[0.5rem] font-bold md:text-3xl text-2xl text-center uppercase"
      >
        Lana
      </h1>
      <UButton
        icon="i-heroicons-user-circle"
        size="xl"
        color="black"
        variant="ghost"
        :trailing="false"
      />
    </section>
  </header>
</template>

<style scoped></style>
