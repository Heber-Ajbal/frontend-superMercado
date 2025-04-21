<script setup lang="ts">
import Page from '~/components/Page.vue'
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import InventarioForm from '~/components/inventario/InventarioForm.vue'
import { ref } from 'vue'

const inventario = ref([
  {
    idInventario: 1,
    Producto: {
      Nombre: 'Leche',
      Imagen: 'https://via.placeholder.com/150'
    },
    Almacen: { Nombre: 'Almacén Central' },
    Cantidad: 50,
    Ubicacion: 'Almacen',
  },
  {
    idInventario: 2,
    Producto: {
      Nombre: 'Arroz',
      Imagen: null
    },
    Almacen: null,
    Cantidad: 20,
    Ubicacion: 'Piso de Ventas',
  }
])

const showModal = ref(false)
const inventarioSeleccionado = ref(null)

function agregarRegistro() {
  inventarioSeleccionado.value = null
  showModal.value = true
}

function editarRegistro(item: any) {
  inventarioSeleccionado.value = { ...item }
  showModal.value = true
}
</script>

<template>
  <Page>
    <template #header>
      <Breadcrumb :items="['Inventario']" />
    </template>

    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Inventario</h2>
      <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" @click="agregarRegistro">
        Agregar Movimiento
      </button>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      <div
        v-for="item in inventario"
        :key="item.idInventario"
        class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow hover:shadow-md transition p-4 flex flex-col justify-between"
      >
        <img
          :src="item.Producto.Imagen || 'https://via.placeholder.com/150'"
          alt="producto"
          class="h-32 object-cover rounded mb-3"
        />
        <div class="mb-2">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white">{{ item.Producto.Nombre }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-300">Ubicación: {{ item.Ubicacion }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-300">
            Almacén: {{ item.Almacen?.Nombre || 'Piso de ventas' }}
          </p>
          <p class="text-sm text-gray-800 dark:text-white font-semibold mt-1">Cantidad: {{ item.Cantidad }}</p>
        </div>
        <div class="flex justify-end mt-auto">
          <button
            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            @click="editarRegistro(item)"
          >
            Editar
          </button>
        </div>
      </div>
    </div>

    <InventarioForm v-if="showModal" :registro="inventarioSeleccionado" @close="showModal = false" />
  </Page>
</template>
