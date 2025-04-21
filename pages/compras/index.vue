<script setup lang="ts">
import Page from '~/components/Page.vue'
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import CompraForm from '~/components/compras/CompraForm.vue'
import { ref } from 'vue'

const showModal = ref(false)

const compras = ref([
  {
    idCompra: 1,
    Proveedor: 'Proveedor A',
    Empleado: 'Carlos Ramírez',
    Fecha: '2024-04-20',
    TipoPago: 'Efectivo',
    Monto: 150.75,
    Detalle: [
      { producto: 'Leche', cantidad: 10, precio: 5.5 },
      { producto: 'Pan', cantidad: 5, precio: 3.5 }
    ]
  },
  {
    idCompra: 2,
    Proveedor: 'Proveedor B',
    Empleado: 'Ana Morales',
    Fecha: '2024-04-19',
    TipoPago: 'Transferencia',
    Monto: 230.0,
    Detalle: [
      { producto: 'Jugo', cantidad: 20, precio: 4.5 }
    ]
  }
])

const compraExpandidaId = ref<number | null>(null)

function toggleDetalles(id: number) {
  compraExpandidaId.value = compraExpandidaId.value === id ? null : id
}

function agregarCompra() {
  showModal.value = true
}
</script>

<template>
  <Page>
    <template #header>
      <Breadcrumb :items="['Compras']" />
    </template>

    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Compras Registradas</h2>
      <button
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        @click="agregarCompra"
      >
        Registrar Compra
      </button>
    </div>

    <!-- Corrección importante: items-start evita que el grid iguale alturas -->
    <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 items-start">
      <div
        v-for="compra in compras"
        :key="compra.idCompra"
        class="flex flex-col justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all p-4"
      >
        <div class="mb-2">
          <h3 class="text-lg font-bold text-gray-800 dark:text-white">
            {{ compra.Proveedor }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-300">
            Empleado: {{ compra.Empleado }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-300">
            Fecha: {{ compra.Fecha }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-300">
            Pago: {{ compra.TipoPago }}
          </p>
          <p class="text-sm text-gray-800 dark:text-white font-semibold mt-1">
            Total: ${{ compra.Monto.toFixed(2) }}
          </p>
        </div>

        <button
          class="mt-2 text-blue-600 hover:underline text-sm self-start"
          @click="toggleDetalles(compra.idCompra)"
        >
          {{ compraExpandidaId === compra.idCompra ? 'Ocultar Detalles' : 'Ver Detalles' }}
        </button>

        <!-- Detalle expandible solo en esta tarjeta -->
        <div
          v-show="compraExpandidaId === compra.idCompra"
          class="mt-3 border-t pt-2 text-sm text-gray-700 dark:text-white space-y-1"
        >
          <p class="font-semibold">Productos:</p>
          <ul>
            <li
              v-for="item in compra.Detalle"
              :key="item.producto"
              class="flex justify-between"
            >
              <span>{{ item.producto }} (x{{ item.cantidad }})</span>
              <span>${{ (item.precio * item.cantidad).toFixed(2) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <CompraForm v-if="showModal" @close="showModal = false" />
  </Page>
</template>
