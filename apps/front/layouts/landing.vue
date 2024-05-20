<script setup lang="ts"></script>

<template>
  <section class="flex flex-col h-screen bg-radient">
    <AppHeader />
    <main class="flex-grow md:px-16 px-4 py-2">
      <slot />
    </main>
    <AppFooter />
  </section>
</template>

<style scoped>
.bg-radient {
  background: radial-gradient(closest-side, #ffcda9, #ffe1cc, #ffffff);
}
</style>
