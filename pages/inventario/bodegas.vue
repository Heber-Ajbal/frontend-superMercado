<script setup lang="ts">
import { ref } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import GetAlmacenes from '~/api/almacenes/getAlmacenes.gql'
import CrearAlmacen from '~/api/almacenes/crearAlmacen.gql'

const form = ref({ nombre: '', ubicacion: '' })
const { result, refetch } = useQuery(GetAlmacenes)
const { mutate } = useMutation(CrearAlmacen)

async function guardar() {
  await mutate({
    input: {
      nombre: form.value.nombre,
      ubicacion: form.value.ubicacion || null,
    }
  })
  form.value = { nombre: '', ubicacion: '' }
  refetch()
}
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-xl font-bold mb-4">Administrar Bodegas / Almacenes</h2>
    <form @submit.prevent="guardar" class="grid gap-3 mb-6">
      <input v-model="form.nombre" placeholder="Nombre del Almacén" class="input" required />
      <input v-model="form.ubicacion" placeholder="Dirección (opcional)" class="input" />
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
    </form>

    <div v-if="result?.almacenes?.length">
      <h3 class="font-semibold mb-2">Bodegas existentes:</h3>
      <ul class="list-disc list-inside">
        <li v-for="a in result.almacenes" :key="a.idAlmacen">
          {{ a.nombre }} <span class="text-gray-500 text-sm">({{ a.ubicacion || 'Sin dirección' }})</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded;
}
</style>
