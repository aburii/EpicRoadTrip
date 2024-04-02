<script lang="ts" setup>
defineProps<{
  placeholder: string;
  size: 'sm' | 'md' | 'lg' | 'xl';
}>();

const country = defineModel<{ id: string; name: string }>();
const query = ref('');
const loading = ref(false);
const { locale } = useI18n();
const { data: suggestions, execute } = await useFetch('/api/autocomplete', {
  query: { input: query, lang: locale },
  immediate: false,
  watch: false,
});

async function search() {
  loading.value = true;

  if (!query.value) {
    loading.value = false;
    return [];
  }

  await execute();

  if (!suggestions.value) {
    loading.value = false;
    return [];
  }

  loading.value = false;
  return suggestions.value;
}
</script>

<template>
  <UInputMenu
    v-model="country"
    v-model:query="query"
    :loading="loading"
    :search="search"
    :placeholder="placeholder"
    :size="size"
    :debounce="500"
    option-attribute="name"
    :search-attributes="['name']"
    by="id"
    trailing
    :ui="{ color: { white: { outline: `text-${size}` } } }"
  >
    <template v-if="!loading" #option-empty="{ query }">
      Pas de résultats pour : "
      <q>{{ query }}</q
      >"
    </template>
    <template v-if="!loading" #empty></template>
  </UInputMenu>
</template>

<style scoped></style>
