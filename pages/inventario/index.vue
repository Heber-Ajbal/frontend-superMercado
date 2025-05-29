<script setup lang="ts">
import Page from '~/components/Page.vue'
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import InventarioForm from '~/components/inventario/InventarioForm.vue'
import { ref, computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import GetInventario from '~/api/inventario/getInventario.gql'

const { result, loading, refetch } = useQuery(GetInventario)
const inventario = computed(() => result.value?.inventarios ?? [])

// ✅ Agrupar por producto + (piso de ventas o idAlmacen)
const inventarioAgrupado = computed(() => {
  const mapa = new Map<string, any>()

  for (const item of inventario.value) {
    const cod = item.codProducto
    const ubicacion = item.ubicacion
    const idAlmacen = item.idAlmacen
    const esPisoVentas = ubicacion === 'Piso de Ventas'

    // Clave por producto + tipo ubicación
    const clave = esPisoVentas
      ? `${cod}-PisoDeVentas`
      : `${cod}-Almacen-${idAlmacen}`

    if (!mapa.has(clave)) {
      mapa.set(clave, {
        codProducto: cod,
        cantidad: item.cantidad ?? 0,
        codProductoNavigation: item.codProductoNavigation,
        ubicacion: esPisoVentas ? 'Piso de Ventas' : item.idAlmacenNavigation?.nombre ?? 'Almacén',
      })
    } else {
      mapa.get(clave).cantidad += item.cantidad ?? 0
    }
  }

  return Array.from(mapa.values())
})

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

    <div class="flex flex-wrap justify-between items-center mb-4 gap-2">
      <h2 class="text-2xl font-semibold">Inventario</h2>
      <div class="flex gap-2">
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" @click="agregarRegistro">
          Agregar Movimiento
        </button>
        <NuxtLink to="/inventario/bodegas" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          Administrar Bodegas
        </NuxtLink>
      </div>
    </div>

    <div v-if="loading" class="text-center text-gray-500 dark:text-gray-300">
      Cargando inventario...
    </div>

    <div v-else-if="inventarioAgrupado.length === 0" class="text-center text-gray-500 dark:text-gray-300">
      No hay registros de inventario.
    </div>

    <div v-else class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      <div
        v-for="item in inventarioAgrupado"
        :key="`${item.codProducto}-${item.ubicacion}`"
        class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow hover:shadow-md transition p-4 flex flex-col justify-between"
      >
        <div class="flex justify-center mb-3">
          <img
            :src="item.codProductoNavigation?.imagen ? `data:image/png;base64,${item.codProductoNavigation.imagen}` : 'https://via.placeholder.com/150'"
            alt="producto"
            class="object-contain rounded max-h-32 w-full"
          />
        </div>

        <div class="mb-2">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white">
            {{ item.codProductoNavigation?.nombre ?? 'Producto desconocido' }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-300">
            Ubicación: {{ item.ubicacion }}
          </p>
          <p class="text-sm text-gray-800 dark:text-white font-semibold mt-1">
            Cantidad: {{ item.cantidad }}
          </p>
        </div>

        <div class="flex justify-end mt-auto">
          <button class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            @click="editarRegistro(item)">
            Editar
          </button>
        </div>
      </div>
    </div>

    <InventarioForm
      v-if="showModal"
      :registro="inventarioSeleccionado"
      @close="showModal = false; refetch()" />
  </Page>
</template>
