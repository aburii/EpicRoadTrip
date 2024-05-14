<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

definePageMeta({
  middleware: 'auth',
});

const { user } = useSupabaseAuth();
const { $supabase } = useNuxtApp();
const { t } = useI18n();
const loading = ref(false);
const toast = useToast();

const passwordFieldType = ref<'password' | 'text'>('password');

const passwordFormSchema = z.object({
  password: z
    .string({ required_error: t('authModal.errors.password-length') })
    .min(6, t('authModal.errors.password-length', { nb: 6 }))
    .optional()
    .or(z.literal('')),
});

type PasswordSchema = z.output<typeof passwordFormSchema>;

const passwordFormState = reactive({
  password: undefined,
});

function togglePasswordVisible() {
  if (passwordFieldType.value === 'password') {
    passwordFieldType.value = 'text';
  } else {
    passwordFieldType.value = 'password';
  }
}

async function onSubmit(event: FormSubmitEvent<PasswordSchema>) {
  const response = await $supabase.auth.updateUser({
    password: event.data.password,
  });

  if (response.error || !response.data) {
    return toast.add({ title: t('password-change-fail'), color: 'red' });
  }

  toast.add({ title: t('password-changed'), color: 'green' });

  return navigateTo(useLocalePath()('/'));
}
</script>

<template>
  <section v-if="user" class="max-w-lg m-auto">
    <UForm
      :schema="passwordFormSchema"
      :state="passwordFormState"
      class="space-y-8"
      @submit="onSubmit"
    >
      <div>
        <span class="font-bold">{{ user.email }}</span>
      </div>
      <UFormGroup name="password">
        <UInput
          v-model="passwordFormState.password"
          :type="passwordFieldType"
          class="font-medium"
          size="xl"
          autocomplete="off"
          :placeholder="t('authModal.placeholders.password')"
          :ui="{ icon: { trailing: { pointer: '' } } }"
        >
          <template #trailing>
            <UButton
              type="button"
              :icon="passwordFieldType !== 'password' ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'"
              variant="ghost"
              color="black"
              block
              @click="togglePasswordVisible"
            />
          </template>
        </UInput>
      </UFormGroup>

      <UButton
        type="submit"
        :loading="loading"
        size="xl"
        :label="t('submit')"
        class="w-full text-center"
        :disabled="!passwordFormState.password"
        padded
        block
      />
    </UForm>
  </section>
</template>

<style scoped></style>
