<script lang="ts" setup>
defineProps<{
  placeholder: string;
  size: "sm" | "md" | "lg" | "xl";
  options: string[];
}>();

const country = defineModel<string>();
</script>

<template>
  <UInputMenu
    v-model="country"
    :placeholder="placeholder"
    :size="size"
    :ui="{ color: { white: { outline: `text-${size}` } } }"
    :options="options"
  >
    <template #option-empty="{ query }">
      Pas de résultats pour : "
      <q>{{ query }}</q
      >"
    </template>
    <template #empty> Pas de pays </template>
  </UInputMenu>
</template>

<style scoped></style>
