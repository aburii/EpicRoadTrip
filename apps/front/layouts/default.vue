<script setup lang="ts"></script>

<template>
  <section class="flex flex-col h-full">
    <AppHeader />
    <main class="flex-grow md:px-16 px-4 py-2">
      <slot />
    </main>
    <AppFooter />
  </section>
</template>
