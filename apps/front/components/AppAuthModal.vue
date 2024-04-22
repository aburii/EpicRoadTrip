<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import type { User } from '~/types/user';

const { t } = useI18n();
const supabase = useSupabaseAuth();
const { signInWithGoogle, signUpWithEmail, signInWithEmail } = supabase;
const toast = useToast();
const { $supabase } = useNuxtApp();
const open = defineModel<boolean>('open');
const existingUser = ref<User | undefined>();
const loading = ref(false);
const authEmailStep = ref<'email' | 'password' | 'confirmation'>('email');
const userEmail = ref<string | undefined>();
const passwordFieldType = ref<'password' | 'text'>('password');
const confirmFieldType = ref<'password' | 'text'>('password');

const emailFormSchema = z.object({
  email: z
    .string({ required_error: t('authModal.errors.invalid-email') })
    .email(t('authModal.errors.invalid-email')),
});

type EmailSchema = z.output<typeof emailFormSchema>;

const emailFormState = reactive({
  email: undefined,
});

const passwordFormSchema = z
  .object({
    password: z
      .string({ required_error: t('authModal.errors.password-length') })
      .min(6, t('authModal.errors.password-length', { nb: 6 }))
      .optional()
      .or(z.literal('')),
    passwordConfirm: z.optional(z.string()),
  })
  .refine(
    (data) => {
      if (existingUser.value) {
        return true;
      }

      return data.password === data.passwordConfirm;
    },
    {
      message: t('authModal.errors.confirm-password'),
      path: ['passwordConfirm'],
    },
  );

type PasswordSchema = z.output<typeof passwordFormSchema>;

const passwordFormState = reactive({
  password: undefined,
  passwordConfirm: undefined,
});

function loginWithGoogle() {
  return signInWithGoogle();
}

watch(open, (value) => {
  if (value !== false) {
    return;
  }
  resetFormsValue();
});

function togglePasswordVisible() {
  if (passwordFieldType.value === 'password') {
    passwordFieldType.value = 'text';
  } else {
    passwordFieldType.value = 'password';
  }
}

function toggleConfirmVisible() {
  if (confirmFieldType.value === 'password') {
    confirmFieldType.value = 'text';
  } else {
    confirmFieldType.value = 'password';
  }
}

function resetFormsValue() {
  passwordFormState.password = undefined;
  passwordFormState.passwordConfirm = undefined;
  emailFormState.email = undefined;
  existingUser.value = undefined;
  authEmailStep.value = 'email';
  passwordFieldType.value = 'password';
  confirmFieldType.value = 'password';
}

async function findUserByEmail(event: FormSubmitEvent<EmailSchema>) {
  loading.value = true;
  userEmail.value = event.data.email;
  const { status, data } = await $supabase
    .from('users')
    .select()
    .eq('email', userEmail.value)
    .eq('provider', 'email');

  loading.value = false;
  authEmailStep.value = 'password';
  if (status === 200) {
    if (data?.length === 1) {
      existingUser.value = data[0];
    }
  } else if (status !== 404) {
    toast.add({ title: 'Error', color: 'red' });
  }
}

async function onEmailContinue(event: FormSubmitEvent<PasswordSchema>) {
  loading.value = true;
  if (authEmailStep.value !== 'password') {
    return;
  }

  if (!userEmail.value) {
    return toast.add({ title: t('internal-error'), color: 'red' });
  }

  userEmail.value = userEmail.value.toLowerCase();

  if (existingUser.value) {
    if (!event.data.password) {
      loading.value = false;
      return;
    }

    const { error } = await signInWithEmail(userEmail.value, event.data.password);

    if (error) {
      toast.add({ title: error.message, color: 'red' });
    } else {
      open.value = false;
      toast.add({ title: t('authModal.success-login', { user: userEmail.value }), timeout: 5000 });
    }
    loading.value = false;
  } else {
    const { error } = await signUpWithEmail(userEmail.value, event.data.password!);

    if (error) {
      toast.add({ title: error.message, color: 'red' });
    } else {
      authEmailStep.value = 'confirmation';
      toast.add({
        title: t('authModal.success-register', { user: userEmail.value }),
        timeout: 5000,
      });
    }
    loading.value = false;
  }
}
</script>

<template>
  <UModal v-model="open">
    <UCard :ui="{ ring: '' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="font-semibold leading-6 text-gray-900 dark:text-white">
            {{ t('authModal.title') }}
          </h3>
          <UButton
            color="gray"
            size="xl"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="open = false"
          />
        </div>
      </template>

      <div class="space-y-5 pb-5">
        <div class="space-y-8">
          <h4 class="text-lg font-bold mt-5">{{ t('authModal.welcome') }}</h4>
          <UForm
            v-if="authEmailStep === 'email'"
            :schema="emailFormSchema"
            :state="emailFormState"
            class="space-y-8"
            @submit="findUserByEmail"
          >
            <UFormGroup name="email">
              <UInput
                v-model="emailFormState.email"
                class="font-medium"
                size="xl"
                :placeholder="t('authModal.placeholders.email')"
                autocomplete
              />
            </UFormGroup>
            <UButton
              :loading="loading"
              size="xl"
              :label="t('authModal.buttons.continue')"
              class="w-full text-center"
              padded
              block
              type="submit"
            />
          </UForm>
          <UForm
            v-else-if="authEmailStep === 'password'"
            :schema="passwordFormSchema"
            :state="passwordFormState"
            class="space-y-8"
            @submit="onEmailContinue"
          >
            <div v-if="existingUser" class="flex lg:justify-between flex-col lg:flex-row">
              <span>{{ t('authModal.hello') }}, {{ existingUser.email }}</span>
              <span class="text-gray-500 text-sm">
                {{ t('authModal.not-you') }}
                <UButton
                  type="button"
                  variant="link"
                  color="gray"
                  class="underline"
                  :label="t('authModal.buttons.back')"
                  @click="resetFormsValue"
              /></span>
            </div>
            <div v-else>
              {{ t('authModal.registering-with') }} <span class="font-bold">{{ userEmail }}</span>
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
                    :icon="
                      passwordFieldType !== 'password' ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'
                    "
                    variant="ghost"
                    color="black"
                    block
                    @click="togglePasswordVisible"
                  />
                </template>
              </UInput>
            </UFormGroup>

            <UFormGroup name="passwordConfirm">
              <UInput
                v-if="!existingUser"
                v-model="passwordFormState.passwordConfirm"
                :type="confirmFieldType"
                class="font-medium"
                size="xl"
                :placeholder="t('authModal.placeholders.confirm')"
                :ui="{ icon: { trailing: { pointer: '' } } }"
              >
                <template #trailing>
                  <UButton
                    type="button"
                    role="button"
                    :icon="
                      confirmFieldType !== 'password' ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'
                    "
                    variant="ghost"
                    color="black"
                    block
                    autocomplete="off"
                    @click="toggleConfirmVisible"
                  />
                </template>
              </UInput>
            </UFormGroup>

            <UButton
              v-if="authEmailStep === 'password'"
              type="submit"
              :loading="loading"
              size="xl"
              :label="existingUser ? t('authModal.buttons.login') : t('authModal.buttons.register')"
              class="w-full text-center"
              :disabled="!passwordFormState.password"
              padded
              block
            />
          </UForm>
          <div v-else-if="authEmailStep" class="flex lg:justify-between flex-col lg:flex-row">
            <span>
              {{ t('authModal.waiting-confirmation', { email: userEmail }) }}
            </span>
            <span class="text-gray-500 text-sm">
              <UButton
                type="button"
                variant="link"
                color="gray"
                class="underline"
                :label="t('authModal.buttons.login')"
                @click="resetFormsValue"
              />
            </span>
          </div>
        </div>
        <UDivider :label="t('authModal.divider')" />
        <UButton
          color="white"
          size="xl"
          padded
          :label="t('authModal.buttons.google')"
          icon="i-simple-icons-google"
          block
          @click="loginWithGoogle"
        />
      </div>
    </UCard>
  </UModal>
</template>

<style scoped></style>
