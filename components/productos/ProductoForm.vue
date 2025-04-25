<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import CrearProducto from '~/api/productos/crearProducto.gql'

const props = defineProps<{ producto: any | null }>()
const emit = defineEmits(['close'])

const categorias = [
  { nombre: 'Lácteos', id: 1 },
  { nombre: 'Granos', id: 2 },
  { nombre: 'Bebidas', id: 3 },
  { nombre: 'Snacks', id: 4 }
]

const form = ref({
  nombre: '',
  precioCompra: 0,
  precioVenta: 0,
  categoriaId: 1,
  imagen: null as string | null
})

watch(
  () => props.producto,
  (nuevo) => {
    form.value = nuevo
      ? {
          nombre: nuevo.nombre,
          precioCompra: nuevo.precioCompra,
          precioVenta: nuevo.precioVenta,
          categoriaId: nuevo.idCategoria,
          imagen: nuevo.imagen || null
        }
      : {
          nombre: '',
          precioCompra: 0,
          precioVenta: 0,
          categoriaId: 1,
          imagen: null
        }
  },
  { immediate: true }
)

function handleImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    form.value.imagen = reader.result as string
  }
  reader.readAsDataURL(file)
}

const { mutate } = useMutation(CrearProducto)

async function guardar() {
  await mutate({
    input: {
      nombre: form.value.nombre,
      precioCompra: form.value.precioCompra,
      precioVenta: form.value.precioVenta,
      idCategoria: form.value.categoriaId
    }
  })
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-full max-w-xl shadow-xl dark:bg-gray-800">
      <h3 class="text-xl font-bold mb-6 text-center">
        {{ props.producto ? 'Editar Producto' : 'Agregar Producto' }}
      </h3>

      <form @submit.prevent="guardar" class="space-y-4">
        <!-- Nombre -->
        <div class="flex items-center gap-4">
          <label class="w-32 font-medium text-gray-700 dark:text-white">Nombre</label>
          <input v-model="form.nombre" type="text" class="input" required />
        </div>

        <!-- Precio Compra -->
        <div class="flex items-center gap-4">
          <label class="w-32 font-medium text-gray-700 dark:text-white">Precio Compra</label>
          <input v-model.number="form.precioCompra" type="number" min="0" step="0.01" class="input" required />
        </div>

        <!-- Precio Venta -->
        <div class="flex items-center gap-4">
          <label class="w-32 font-medium text-gray-700 dark:text-white">Precio Venta</label>
          <input v-model.number="form.precioVenta" type="number" min="0" step="0.01" class="input" required />
        </div>

        <!-- Categoría -->
        <div class="flex items-center gap-4">
          <label class="w-32 font-medium text-gray-700 dark:text-white">Categoría</label>
          <select v-model.number="form.categoriaId" class="input" required>
            <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre }}</option>
          </select>
        </div>

        <!-- Imagen -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-gray-700 dark:text-white">Imagen</label>
          <input type="file" @change="handleImageChange" accept="image/*" class="input" />
          <img v-if="form.imagen" :src="form.imagen" class="h-32 object-cover rounded" />
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-2 pt-4">
          <button
            type="button"
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            @click="$emit('close')"
          >
            Cancelar
          </button>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white;
}
</style>
