<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import type { User } from '~/types/user';

const supabase = useSupabaseAuth();
const { signInWithGoogle, signUpWithEmail, signInWithEmail } = supabase;
const toast = useToast();
const { $supabase } = useNuxtApp();
const open = defineModel<boolean>('open');
const existingUser = ref<User | undefined>();
const loading = ref(false);
const authEmailStep = ref<'email' | 'password'>('email');
const userEmail = ref<string | undefined>();
const passwordFieldType = ref<'password' | 'text'>('password');
const confirmFieldType = ref<'password' | 'text'>('password');

const emailFormSchema = z.object({
  email: z.string().email('Invalid email'),
});

type EmailSchema = z.output<typeof emailFormSchema>;

const emailFormState = reactive({
  email: undefined,
});

const passwordFormSchema = z
  .object({
    password: z.string().min(6, 'Must be 6 length'),
    passwordConfirm: z.optional(z.string()),
  })
  .refine((data) => !existingUser.value && data.passwordConfirm === data.password, {
    message: "Passwords don't match",
    path: ['passwordConfirm'],
  });

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
    return toast.add({ title: 'Error mail missing', color: 'red' });
  }

  if (existingUser.value) {
    const { error } = await signInWithEmail(userEmail.value, event.data.password);

    if (error) {
      toast.add({ title: error.message, color: 'red' });
    } else {
      open.value = false;
    }
    loading.value = false;
  } else {
    const { error } = await signUpWithEmail(userEmail.value, event.data.password);

    if (error) {
      toast.add({ title: error.message, color: 'red' });
    } else {
      open.value = false;
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
            Connexion ou inscription
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
          <h4 class="text-lg font-bold mt-5">Bienvenue sur Lana.</h4>
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
                placeholder="Adresse e-mail"
                autocomplete
              />
            </UFormGroup>
            <UButton
              :loading="loading"
              size="xl"
              label="Continuer"
              class="w-full text-center"
              padded
              block
              type="submit"
            />
          </UForm>
          <UForm
            v-else
            :schema="passwordFormSchema"
            :state="passwordFormState"
            class="space-y-8"
            @submit="onEmailContinue"
          >
            <div v-if="existingUser" class="flex justify-between">
              <span>Hello, {{ existingUser.email }}</span>
              <span class="text-gray-500 text-sm"
                >Not you ?
                <UButton
                  type="button"
                  variant="link"
                  color="gray"
                  class="underline"
                  label="Go back"
                  @click="resetFormsValue"
              /></span>
            </div>
            <div v-else>
              Registering with : <span class="font-bold">{{ userEmail }}</span>
            </div>
            <UFormGroup name="password">
              <UInput
                v-model="passwordFormState.password"
                :type="passwordFieldType"
                class="font-medium"
                size="xl"
                autocomplete="off"
                placeholder="Mot de passe"
                :ui="{ icon: { trailing: { pointer: '' } } }"
              >
                <template #trailing>
                  <UButton
                    type="button"
                    :icon="
                      passwordFieldType !== 'password' ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'
                    "
                    class=""
                    variant="ghost"
                    color="black"
                    block
                    @click="togglePasswordVisible"
                  ></UButton>
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
                placeholder="Confirmer le mot de passe"
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
                  ></UButton>
                </template>
              </UInput>
            </UFormGroup>

            <UButton
              v-if="authEmailStep === 'password'"
              type="submit"
              :loading="loading"
              size="xl"
              :label="existingUser ? 'Se connecter' : 'S\'inscrire'"
              class="w-full text-center"
              padded
              block
            />
          </UForm>
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
</template>

<style scoped></style>
