<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import CrearCliente from '~/api/clientes/crearCliente.gql'

const props = defineProps<{ cliente: any | null }>()
const emit = defineEmits(['close'])

const form = ref({
  Nombre: '',
  Apellido_Paterno: '',
  Apellido_Materno: '',
  Direccion: '',
  Telefono: '',
})

// Cuando se edita un cliente, carga los datos en el formulario
watch(() => props.cliente, (nuevo) => {
  form.value = nuevo
    ? { ...nuevo }
    : {
        Nombre: '',
        Apellido_Paterno: '',
        Apellido_Materno: '',
        Direccion: '',
        Telefono: ''
      }
}, { immediate: true })

const { mutate } = useMutation(CrearCliente)

async function guardar() {
  try {
    await mutate({
      input: {
        nombre: form.value.Nombre,
        apellidoPaterno: form.value.Apellido_Paterno,
        apellidoMaterno: form.value.Apellido_Materno,
        direccion: form.value.Direccion,
        telefono: form.value.Telefono
      }
    })
    emit('close')
  } catch (error) {
    console.error('Error al guardar cliente:', error)
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-xl dark:bg-gray-800">
      <h3 class="text-xl font-bold mb-4">{{ props.cliente ? 'Editar Cliente' : 'Agregar Cliente' }}</h3>

      <form @submit.prevent="guardar" class="grid gap-4">
        <input v-model="form.Nombre" placeholder="Nombre" class="input" required />
        <input v-model="form.Apellido_Paterno" placeholder="Apellido Paterno" class="input" required />
        <input v-model="form.Apellido_Materno" placeholder="Apellido Materno" class="input" required />
        <input v-model="form.Direccion" placeholder="Dirección" class="input" required />
        <input v-model="form.Telefono" placeholder="Teléfono" class="input" required />

        <div class="flex justify-end gap-2">
          <button type="button" class="bg-gray-500 text-white px-4 py-2 rounded" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded;
}
</style>
