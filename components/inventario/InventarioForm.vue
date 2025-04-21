<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps<{ registro: any | null }>()
const emit = defineEmits(['close'])

const ubicaciones = ['Almacen', 'Piso de Ventas']
const almacenes = ['Almacén Central', 'Sucursal Norte', 'Depósito Secundario']

const form = ref({
  Producto: '',
  Cantidad: 0,
  Ubicacion: 'Almacen',
  Almacen: '',
})

watch(() => props.registro, (nuevo) => {
  if (nuevo) {
    form.value = {
      Producto: nuevo.Producto?.Nombre || '',
      Cantidad: nuevo.Cantidad,
      Ubicacion: nuevo.Ubicacion,
      Almacen: nuevo.Almacen?.Nombre || '',
    }
  } else {
    form.value = {
      Producto: '',
      Cantidad: 0,
      Ubicacion: 'Almacen',
      Almacen: '',
    }
  }
}, { immediate: true })

function guardar() {
  // Aquí se enviará al backend más adelante
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-xl dark:bg-gray-800">
      <h3 class="text-xl font-bold mb-4">{{ props.registro ? 'Editar Movimiento' : 'Nuevo Movimiento' }}</h3>

      <form @submit.prevent="guardar" class="grid gap-4">
        <input v-model="form.Producto" placeholder="Nombre del Producto" class="input" />
        <input v-model.number="form.Cantidad" type="number" placeholder="Cantidad" class="input" />

        <select v-model="form.Ubicacion" class="input">
          <option v-for="u in ubicaciones" :key="u" :value="u">{{ u }}</option>
        </select>

        <select v-if="form.Ubicacion === 'Almacen'" v-model="form.Almacen" class="input">
          <option v-for="a in almacenes" :key="a" :value="a">{{ a }}</option>
        </select>

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
