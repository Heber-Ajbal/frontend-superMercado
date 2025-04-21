<script setup lang="ts">
import Page from '~/components/Page.vue'
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import VentaForm from '~/components/ventas/VentaForm.vue'
import { ref } from 'vue'

const showModal = ref(false)

const ventas = ref([
  {
    idVenta: 1,
    Cliente: 'Juan Pérez',
    Empleado: 'Carlos Ramírez',
    Fecha: '2024-04-20',
    Hora: '10:30',
    Monto: 75.5,
    Detalle: [
      { producto: 'Leche', cantidad: 2, precio: 5.5, descuento: 0 },
      { producto: 'Pan', cantidad: 1, precio: 3.5, descuento: 1.0 }
    ]
  },
  {
    idVenta: 2,
    Cliente: 'María López',
    Empleado: 'Ana Morales',
    Fecha: '2024-04-19',
    Hora: '14:15',
    Monto: 120.0,
    Detalle: [
      { producto: 'Jugo', cantidad: 4, precio: 4.5, descuento: 0 }
    ]
  }
])

const ventaExpandidaId = ref<number | null>(null)

function toggleDetalles(id: number) {
  ventaExpandidaId.value = ventaExpandidaId.value === id ? null : id
}

function registrarVenta() {
  showModal.value = true
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
        @click="registrarVenta"
      >
        Registrar Venta
      </button>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 items-start">
      <div
        v-for="venta in ventas"
        :key="venta.idVenta"
        class="flex flex-col justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all p-4"
      >
        <div class="mb-2">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white">
            {{ venta.Cliente }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-300">Empleado: {{ venta.Empleado }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-300">
            Fecha: {{ venta.Fecha }} {{ venta.Hora }}
          </p>
          <p class="text-sm text-gray-800 dark:text-white font-semibold mt-1">
            Total: ${{ venta.Monto.toFixed(2) }}
          </p>
        </div>

        <button
          class="mt-2 text-blue-600 hover:underline text-sm self-start"
          @click="toggleDetalles(venta.idVenta)"
        >
          {{ ventaExpandidaId === venta.idVenta ? 'Ocultar Detalles' : 'Ver Detalles' }}
        </button>

        <div
          v-show="ventaExpandidaId === venta.idVenta"
          class="mt-3 border-t pt-2 text-sm text-gray-700 dark:text-white space-y-1"
        >
          <p class="font-semibold">Productos:</p>
          <ul>
            <li
              v-for="item in venta.Detalle"
              :key="item.producto"
              class="flex justify-between"
            >
              <span>{{ item.producto }} (x{{ item.cantidad }})</span>
              <span>
                ${{ (item.precio * item.cantidad - item.descuento).toFixed(2) }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <VentaForm v-if="showModal" @close="showModal = false" />
  </Page>
</template>

