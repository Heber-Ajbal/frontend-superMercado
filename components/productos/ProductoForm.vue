<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import CrearProducto from '~/api/productos/crearProducto.gql'

const props = defineProps<{ producto: any | null }>()
const emit = defineEmits(['close'])

// Simulación de categorías (en futuro lo cargamos dinámico)
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
    if (nuevo) {
      form.value = {
        nombre: nuevo.nombre,
        precioCompra: nuevo.precioCompra,
        precioVenta: nuevo.precioVenta,
        categoriaId: nuevo.idCategoria,
        imagen: nuevo.imagen || null
      }
    } else {
      form.value = {
        nombre: '',
        precioCompra: 0,
        precioVenta: 0,
        categoriaId: 1,
        imagen: null
      }
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
    <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-xl dark:bg-gray-800">
      <h3 class="text-xl font-bold mb-4">
        {{ props.producto ? 'Editar Producto' : 'Agregar Producto' }}
      </h3>

      <form @submit.prevent="guardar" class="grid gap-4">
        <input v-model="form.nombre" placeholder="Nombre" class="input" required />
        <input
          v-model.number="form.precioCompra"
          type="number"
          min="0"
          step="0.01"
          placeholder="Precio Compra"
          class="input"
          required
        />
        <input
          v-model.number="form.precioVenta"
          type="number"
          min="0"
          step="0.01"
          placeholder="Precio Venta"
          class="input"
          required
        />

        <select v-model.number="form.categoriaId" class="input" required>
          <option v-for="c in categorias" :key="c.id" :value="c.id">
            {{ c.nombre }}
          </option>
        </select>

        <div class="flex flex-col gap-2">
          <input type="file" @change="handleImageChange" accept="image/*" class="input" />
          <img v-if="form.imagen" :src="form.imagen" class="h-32 object-cover rounded" />
        </div>

        <div class="flex justify-end gap-2">
          <button
            type="button"
            class="bg-gray-500 text-white px-4 py-2 rounded"
            @click="$emit('close')"
          >
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
