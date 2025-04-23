<script setup lang="ts">
import Page from '~/components/Page.vue'
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import ProductoForm from '~/components/productos/ProductoForm.vue'
import { ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import GetProductos from '~/api/productos/getProductos.gql'

const showModal = ref(false)
const productoSeleccionado = ref(null)
const productos = ref([])

const { result, refetch } = useQuery(GetProductos)

watch(result, () => {
  if (result.value?.productos) {
    productos.value = result.value.productos
  }
}, { immediate: true })

function agregarProducto() {
  productoSeleccionado.value = null
  showModal.value = true
}

function editarProducto(producto: any) {
  productoSeleccionado.value = { ...producto }
  showModal.value = true
}

function cerrarModal() {
  showModal.value = false
  refetch()
}
</script>

<template>
  <Page>
    <template #header>
      <Breadcrumb :items="['Productos']" />
    </template>

    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Productos</h2>
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        @click="agregarProducto"
      >
        Agregar Producto
      </button>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      <div
        v-for="p in productos"
        :key="p.codProducto"
        class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow hover:shadow-md transition p-4 flex flex-col justify-between"
      >
        <img
          :src="p.imagen || 'https://via.placeholder.com/150'"
          alt="producto"
          class="h-40 object-cover rounded mb-4"
        />
        <div class="mb-2">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white">{{ p.nombre }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-300">
            {{ p.idCategoriaNavigation?.nombre || 'Sin categoría' }}
          </p>
        </div>
        <div class="flex justify-between items-center mt-auto">
          <span class="text-green-600 font-semibold text-md">${{ p.precioVenta.toFixed(2) }}</span>
          <button
            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            @click="editarProducto(p)"
          >
            Editar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de agregar/editar producto -->
    <ProductoForm
      v-if="showModal"
      :producto="productoSeleccionado"
      @close="cerrarModal"
    />
  </Page>
</template>
