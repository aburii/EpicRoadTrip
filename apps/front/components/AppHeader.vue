<script setup lang="ts">
const i18n = useI18n();
const { t } = i18n;
const { locales } = i18n;
const supabase = useSupabaseAuth();
const { signOut, user } = supabase;
const localePath = useLocalePath();
const toast = useToast();

const userLoggedIn = computed(() => !!supabase.user.value);
const guestDropdownItems = computed(() => {
  return [
    [
      {
        label: t('header.dropdown.register'),
        slot: 'register',
        disabled: userLoggedIn.value,
        labelClass: 'font-bold',
        click: openAuthModal,
      },
    ],
    [
      {
        label: t('header.dropdown.login'),
        slot: 'connect',
        disabled: userLoggedIn.value,
        click: openAuthModal,
      },
    ],
  ];
});
const userDropdownItem = computed(() => {
  return [
    [{ label: t('header.dropdown.logged-as'), disabled: true, slot: 'account' }],
    [
      {
        label: t('header.dropdown.my-trips'),
        icon: 'i-heroicons-map',
        click: async () => {
          await navigateTo(localePath('/mytrips'));
        },
      },
    ],
    [
      {
        label: t('header.dropdown.logout'),
        icon: 'i-heroicons-arrow-left-on-rectangle',
        class: 'text-red-500 hover:text-red-600',
        click: async () => {
          await signOut();
          toast.add({ title: t('logout'), timeout: 5000 });
        },
      },
    ],
  ];
});

const authDropdownItems = computed(() => {
  return userLoggedIn.value ? userDropdownItem.value : guestDropdownItems.value;
});
const authModalOpen = ref(false);

function openAuthModal() {
  authModalOpen.value = true;
}
</script>

<template>
  <header class="min-h-[80px] bg-blue-500 md:px-16 px-4 py-2 bg-transparent">
    <section class="w-full h-full flex items-center font justify-between">
      <div class="w-1/3 text-start">
        <UPopover :popper="{ placement: 'bottom-start' }">
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
              color="black"
              size="lg"
              :ui="{ rounded: 'rounded-none' }"
              @click="i18n.setLocale(loc.code)"
            >
              {{ loc.name }}
            </UButton>
          </template>
        </UPopover>
      </div>
      <h1
        class="font-title w-1/3 md:tracking-[0.8rem] tracking-[0.5rem] font-bold md:text-3xl text-2xl text-center uppercase"
      >
        Lana
      </h1>
      <div class="w-1/3 text-end">
        <UDropdown :items="authDropdownItems">
          <UButton icon="i-heroicons-user-circle" size="xl" color="black" variant="ghost" trailing>
            <template #default>
              <span class="hidden lg:block">
                {{ user?.email }}
              </span>
            </template>
          </UButton>
          <template #account="{ item }">
            <div class="text-left">
              <p>{{ item.label }}</p>
              <p class="truncate font-medium text-gray-900 dark:text-white">{{ user?.email }}</p>
            </div>
          </template>
          <template #item="{ item }">
            <span class="truncate">{{ item.label }}</span>

            <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 dark:text-gray-500 ms-auto" />
          </template>
        </UDropdown>
      </div>
      <AppAuthModal v-model:open="authModalOpen" />
    </section>
  </header>
</template>

<style scoped></style>
