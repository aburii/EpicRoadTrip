<script setup lang="ts">
import type { DropdownItem } from '#ui/types';

const i18n = useI18n();
const { locales } = i18n;
const supabase = useSupabaseAuth();
const { signInWithGoogle, signOut, user } = supabase;

const userLoggedIn = computed(() => !!supabase.user.value);

const guestDropdownItems: DropdownItem[][] = [
  [
    {
      label: "S'inscrire",
      slot: 'register',
      disabled: userLoggedIn.value,
      labelClass: 'font-bold',
      click: openAuthModal,
    },
  ],
  [
    {
      label: 'Se connecter',
      slot: 'connect',
      disabled: userLoggedIn.value,
      click: openAuthModal,
    },
  ],
];

const userDropdownItem: DropdownItem[][] = [
  [{ label: 'Connecté en tant que', disabled: true, slot: 'account' }],
  [
    {
      label: 'Deconnexion',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      class: 'text-red-500 hover:text-red-600',
      click: async () => {
        await signOut();
      },
    },
  ],
];

const authDropdownItems = computed(() => {
  return userLoggedIn.value ? userDropdownItem : guestDropdownItems;
});

const authModalOpen = ref(false);

const userEmail = ref<string | undefined>();

function openAuthModal() {
  authModalOpen.value = true;
}

function loginWithGoogle() {
  return signInWithGoogle();
}
</script>

<template>
  <header class="min-h-[80px] bg-blue-500 md:px-16 px-4 py-2 bg-transparent">
    <section class="w-full h-full flex items-center font justify-between">
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
      <UDropdown :items="authDropdownItems">
        <UButton
          icon="i-heroicons-user-circle"
          size="xl"
          color="black"
          variant="ghost"
          :trailing="false"
        />
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
      <UModal v-model="authModalOpen">
        <UCard :ui="{ ring: '' }">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">
                Connexion ou inscription
              </h3>
              <UButton
                color="gray"
                size="xl"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="-my-1"
                @click="authModalOpen = false"
              />
            </div>
          </template>

          <div class="space-y-5 pb-5">
            <div class="space-y-8">
              <h4 class="text-lg font-bold mt-5">Bienvenue sur Lana.</h4>
              <UInput
                v-model="userEmail"
                class="font-medium"
                size="xl"
                placeholder="Adresse e-mail"
              />
              <UButton size="xl" label="Continuer" class="w-full text-center" padded block />
            </div>
            <UDivider label="ou" />
            <UButton
              color="white"
              size="xl"
              padded
              label="Continuer avec Google"
              icon="i-simple-icons-google"
              block
              @click="loginWithGoogle"
            />
          </div>
        </UCard>
      </UModal>
    </section>
  </header>
</template>

<style scoped></style>
