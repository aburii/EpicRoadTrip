<script setup lang="ts"></script>

<template>
  <header class="min-h-[80px] bg-blue-500 md:px-16 px-4 py-2 bg-transparent">
    <section class="w-full h-full flex items-center justify-between">
      <UButton
        icon="i-heroicons-language"
        size="xl"
        color="black"
        variant="ghost"
        :trailing="false"
      />
      <h1
        class="font-title md:tracking-[0.8rem] tracking-[0.5rem] font-bold md:text-3xl text-2xl text-center"
      >
        LANA
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
