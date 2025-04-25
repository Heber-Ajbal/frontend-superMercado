<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import CrearProducto from '~/api/productos/crearProducto.gql'
import GetCategorias from '~/api/categorias/getCategorias.gql'
import CategoriaForm from '~/components/categorias/CategoriaForm.vue'

const props = defineProps<{ producto: any | null }>()
const emit = defineEmits(['close'])

const form = ref({
  nombre: '',
  precioCompra: 0,
  precioVenta: 0,
  categoriaId: 1,
  imagen: null as string | null
})

const showCategoriaModal = ref(false)
const categoriasResult = ref([])
const { result, refetch: refetchCategorias } = useQuery(GetCategorias)

watch(result, () => {
  if (result.value?.categorias) {
    categoriasResult.value = result.value.categorias
  }
}, { immediate: true })

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
    const base64 = (reader.result as string).split(',')[1]
    form.value.imagen = base64
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
      idCategoria: form.value.categoriaId,
      imagen: form.value.imagen
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
        <div class="flex items-center gap-4">
          <label class="w-32 font-medium text-gray-700 dark:text-white">Nombre</label>
          <input v-model="form.nombre" type="text" class="input" required />
        </div>

        <div class="flex items-center gap-4">
          <label class="w-32 font-medium text-gray-700 dark:text-white">Precio Compra</label>
          <input v-model.number="form.precioCompra" type="number" min="0" step="0.01" class="input" required />
        </div>

        <div class="flex items-center gap-4">
          <label class="w-32 font-medium text-gray-700 dark:text-white">Precio Venta</label>
          <input v-model.number="form.precioVenta" type="number" min="0" step="0.01" class="input" required />
        </div>

        <div class="flex items-center gap-4">
          <label class="w-32 font-medium text-gray-700 dark:text-white">Categoría</label>
          <div class="flex-1 flex gap-2">
            <select v-model.number="form.categoriaId" class="input" required>
              <option v-for="c in categoriasResult" :key="c.idCategoria" :value="c.idCategoria">
                {{ c.nombre }}
              </option>
            </select>
            <button
              type="button"
              class="bg-blue-600 text-white px-2 rounded text-sm"
              @click="showCategoriaModal = true"
            >+
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium text-gray-700 dark:text-white">Imagen</label>
          <input type="file" @change="handleImageChange" accept="image/*" class="input" />
          <img v-if="form.imagen" :src="`data:image/*;base64,${form.imagen}`" class="h-32 object-cover rounded" />
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <button type="button" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600" @click="$emit('close')">
            Cancelar
          </button>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Guardar
          </button>
        </div>
      </form>

      <CategoriaForm v-if="showCategoriaModal" @close="showCategoriaModal = false; refetchCategorias()" />
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white;
}
</style>
