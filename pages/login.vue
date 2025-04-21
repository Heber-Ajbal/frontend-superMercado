<script setup lang="ts">
import AuthenticationCard from '~/components/ui/AuthenticationCard.vue'
import AuthenticationCardLogo from '~/components/ui/AuthenticationCardLogo.vue'
import InputLabel from '~/components/inputs/InputLabel.vue'
import PrimaryButton from '~/components/buttons/PrimaryButton.vue'
import TextInput from '~/components/inputs/TextInput.vue'
import { Form } from 'vee-validate'
import * as yup from 'yup'
import { ref } from 'vue'


const auth = useAuthStore()

definePageMeta({
  title: 'Iniciar Sesión',
  layout: 'login',
})

defineProps({
  canResetPassword: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: '',
  },
})

const schema = yup.object({
  Username: yup.string().required('El nombre de usuario es obligatorio'),
  Password: yup.string().required('La contraseña es obligatoria'),
})

const processing = ref(false)
const errorMessage = ref('')

const submit = async (values: any) => {
  processing.value = true
  errorMessage.value = ''

  try {
    // Simulamos login
    const usuariosSimulados = [
      { username: 'cramirez', password: '1234', rol: 'Cajero' },
      { username: 'amorales', password: '1234', rol: 'Supervisor' }
    ]

    const usuario = usuariosSimulados.find(
      u => u.username === values.Username && u.password === values.Password
    )

    if (!usuario) {
      errorMessage.value = 'Usuario o contraseña incorrectos'
    } else {
      auth.login(usuario.username, usuario.rol)
      return navigateTo('/')
    }
  } catch (err) {
    errorMessage.value = 'Error inesperado'
  } finally {
    processing.value = false
  }
}

function onInvalidSubmit() {
  console.log('Formulario inválido')
}
</script>

<template>
  <AuthenticationCard>
    <template #logo>
      <AuthenticationCardLogo />
    </template>

    <h2 class="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
      Iniciar Sesión
    </h2>

    <div v-if="status" class="mb-4 rounded bg-green-100 px-4 py-2 text-sm text-green-800 dark:bg-green-900 dark:text-white">
      {{ status }}
    </div>

    <div v-if="errorMessage" class="mb-4 rounded bg-red-100 px-4 py-2 text-sm text-red-700 dark:bg-red-900 dark:text-white">
      {{ errorMessage }}
    </div>

    <Form
      :validation-schema="schema"
      @submit="submit"
      @invalid-submit="onInvalidSubmit"
      class="grid gap-4"
    >
      <div>
        <InputLabel for="Username" value="Usuario" />
        <TextInput
          name="Username"
          type="text"
          placeholder="Ingresa tu usuario"
          class="mt-1 block w-full"
          required
          autofocus
        />
      </div>

      <div>
        <InputLabel for="Password" value="Contraseña" />
        <TextInput
          name="Password"
          type="password"
          placeholder="••••••••"
          required
          autocomplete="current-password"
        />
      </div>

      <div class="mt-2 flex items-center justify-between text-sm">
        <NuxtLink
          v-if="canResetPassword"
          class="text-blue-600 hover:underline dark:text-blue-400"
        >
          ¿Olvidaste tu contraseña?
        </NuxtLink>
      </div>

      <PrimaryButton
        class="mt-4 w-full"
        :class="{ 'opacity-25': processing }"
        :disabled="processing"
      >
        Iniciar sesión
      </PrimaryButton>
    </Form>
  </AuthenticationCard>
</template>
