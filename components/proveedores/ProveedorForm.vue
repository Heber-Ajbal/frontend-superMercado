<script setup lang="ts">
import { defineEmits, ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import CrearProveedor from '~/api/proveedores/crearProveedor.gql'

const emit = defineEmits(['close'])

const form = ref({
  nombre: '',
  ubicacion: '',
  telefono: ''
})

const { mutate, onDone, onError } = useMutation(CrearProveedor)

async function guardar() {
  try {
    const { data, errors } = await mutate({
      nombre: form.value.nombre,
      ubicacion: form.value.ubicacion,
      telefono: form.value.telefono
    })

    if (errors?.length) {
      console.error('Errores en la mutación:', errors)
      return
    }

    console.log('Proveedor creado:', data.proveedor.crearProveedor)
    emit('close')  // ✅ Cerramos el modal correctamente

  } catch (err) {
    console.error('Error al crear proveedor:', err)
  }
}

</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-xl">
      <h3 class="text-xl font-bold mb-4">Registrar Proveedor</h3>

      <form @submit.prevent="guardar" class="grid gap-4">
        <input v-model="form.nombre" placeholder="Nombre" class="input" required />
        <input v-model="form.ubicacion" placeholder="Ubicación" class="input" required />
        <input v-model="form.telefono" placeholder="Teléfono" class="input" required />

        <div class="flex justify-end gap-2">
          <button type="button" class="bg-gray-500 text-white px-4 py-2 rounded" @click="$emit('close')">
            Cancelar
          </button>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
            Guardar
          </button>
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
