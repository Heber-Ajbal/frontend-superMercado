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
        <div class="flex flex-wrap gap-4">
                    
            <!-- Nombre del producto -->
            <div class="flex-1 min-w-[200px]">
              <label class="block text-sm font-medium mb-1">Nombre del Producto:</label>
              <input v-model="form.Producto" placeholder="Nombre del Producto" class="input" />
            </div>

            <!-- Cantidad -->
            <div class="flex-1 min-w-[120px]">
              <label class="block text-sm font-medium mb-1">Cantidad:</label>
              <input v-model.number="form.Cantidad" type="number" placeholder="Cantidad" class="input" />
            </div>

            <!-- Ubicación -->
            <div class="flex-1 min-w-[160px]">
              <label class="block text-sm font-medium mb-1">Ubicación:</label>
              <select v-model="form.Ubicacion" class="input">
                <option v-for="u in ubicaciones" :key="u" :value="u">{{ u }}</option>
              </select>
            </div>

            <!-- Almacén (solo si se selecciona "Almacen" como ubicación) -->
            <div v-if="form.Ubicacion === 'Almacen'" class="flex-1 min-w-[160px]">
              <label class="block text-sm font-medium mb-1">Almacén:</label>
              <select v-model="form.Almacen" class="input">
                <option v-for="a in almacenes" :key="a" :value="a">{{ a }}</option>
              </select>
            </div>
          </div>

                  

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
