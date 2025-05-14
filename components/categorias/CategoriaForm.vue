<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import CrearCategoria from '~/api/categorias/crearCategoria.gql'
import ActualizarCategoria from '~/api/categorias/actualizarCategoria.gql'

const props = defineProps<{ categoria: any | null }>()
const emit = defineEmits(['close'])

const form = ref({
  id: null,
  nombre: '',
  descripcion: ''
})

watch(() => props.categoria, (nuevo) => {
  form.value = nuevo
    ? {
        id: nuevo.idCategoria, // Capturamos correctamente el ID para edición
        nombre: nuevo.nombre,
        descripcion: nuevo.descripcion
      }
    : { id: null, nombre: '', descripcion: '' }
}, { immediate: true })

const { mutate: crearCategoria } = useMutation(CrearCategoria)
const { mutate: actualizarCategoria } = useMutation(ActualizarCategoria)

async function guardar() {
  try {
    if (form.value.id !== null) {
      // ✅ Editar categoría
      await actualizarCategoria({
        input: {
          idCategoria: form.value.id, // Enviamos ID correctamente
          nombre: form.value.nombre,
          descripcion: form.value.descripcion
        }
      })
    } else {
      // ✅ Crear nueva categoría
      await crearCategoria({
        input: {
          nombre: form.value.nombre,
          descripcion: form.value.descripcion
        }
      })
    }
    emit('close')
  } catch (error) {
    console.error('Error al guardar categoría:', error)
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-xl dark:bg-gray-800">
      <h3 class="text-xl font-bold mb-4">
        {{ props.categoria ? 'Editar Categoría' : 'Agregar Categoría' }}
      </h3>
      <form @submit.prevent="guardar" class="grid gap-4">
        <input v-model="form.nombre" placeholder="Nombre" class="input" required />
        <textarea v-model="form.descripcion" placeholder="Descripción" class="input" rows="3"></textarea>

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
