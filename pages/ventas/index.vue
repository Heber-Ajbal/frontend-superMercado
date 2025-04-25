<script setup lang="ts">
import Page from '~/components/Page.vue'
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import VentaForm from '~/components/ventas/VentaForm.vue'
import { ref, computed, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import GetVentas from '~/api/ventas/getVentas.gql'

const showModal = ref(false)
const ventaExpandidaId = ref<number | null>(null)

const { result, loading, error, refetch } = useQuery(GetVentas)
const ventas = ref<any[]>([])

watch(result, () => {
  if (result.value?.ventas) {
    ventas.value = result.value.ventas.map(v => ({
      idVenta: v.idVenta,
      Cliente: `${v.idClienteNavigation?.nombre ?? 'Desconocido'} ${v.idClienteNavigation?.apellidoPaterno ?? ''}`,
      Empleado: `${v.idEmpleadoNavigation?.nombre ?? 'Desconocido'} ${v.idEmpleadoNavigation?.apellidoPaterno ?? ''}`,
      Fecha: v.fecha,
      Hora: v.hora?.slice(0, 5),
      Monto: v.monto,
      Detalle: (v.detalleVenta || []).map(d => ({
        producto: d.codProductoNavigation?.nombre ?? 'Producto desconocido',
        cantidad: d.cantidad,
        precio: d.codProductoNavigation?.precioVenta ?? 0,
        descuento: d.descuento
      }))
    }))
  }
}, { immediate: true })

function generarFactura(venta: any) {
  console.log('Generar factura para:', venta)
  // Aquí más adelante se agregará la lógica real
}
</script>

<template>
  <Page>
    <template #header>
      <Breadcrumb :items="['Ventas']" />
    </template>

    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Ventas Registradas</h2>
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        @click="showModal = true"
      >
        Registrar Venta
      </button>
    </div>

    <div v-if="loading" class="text-center text-gray-500 dark:text-gray-300">
      Cargando ventas...
    </div>

    <div v-else-if="ventas.length === 0" class="text-center text-gray-500 dark:text-gray-300">
      No hay ventas registradas.
    </div>

    <div
      v-else
      class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 items-start"
    >
      <div
        v-for="venta in ventas"
        :key="venta.idVenta"
        class="flex flex-col justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all p-4"
      >
        <div class="mb-2">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white">
            {{ venta.Cliente }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-300">
            Empleado: {{ venta.Empleado }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-300">
            Fecha: {{ venta.Fecha }} {{ venta.Hora }}
          </p>
          <p class="text-sm text-gray-800 dark:text-white font-semibold mt-1">
            Total: ${{ (venta.Monto ?? 0).toFixed(2) }}
          </p>
        </div>

        <div class="flex justify-between mt-2 gap-2">
          <button
            class="text-blue-600 hover:underline text-sm"
            @click="ventaExpandidaId = ventaExpandidaId === venta.idVenta ? null : venta.idVenta"
          >
            {{ ventaExpandidaId === venta.idVenta ? 'Ocultar Detalles' : 'Ver Detalles' }}
          </button>

          <button
            class="text-green-600 hover:underline text-sm"
            @click="generarFactura(venta)"
          >
            Generar Factura
          </button>
        </div>

        <div
          v-show="ventaExpandidaId === venta.idVenta"
          class="mt-3 border-t pt-2 text-sm text-gray-700 dark:text-white space-y-1"
        >
          <p class="font-semibold">Productos:</p>
          <ul>
            <li
              v-for="(item, i) in venta.Detalle"
              :key="i"
              class="flex flex-col border-b pb-2 mb-2"
            >
              <div class="flex justify-between">
                <span>{{ item.producto }} (x{{ item.cantidad }})</span>
                <span>
                  Total: ${{ (item.precio * item.cantidad - item.descuento).toFixed(2) }}
                </span>
              </div>
              <div class="text-sm text-gray-500">
                Precio unitario: ${{ item.precio.toFixed(2) }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <VentaForm :visible="showModal" @close="showModal = false; refetch()" />
  </Page>
</template>
