<script setup lang="ts">
import { defineEmits, ref, computed, watch } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'

import GetProveedores from '~/api/proveedores/getProveedores.gql'
import GetEmpleados from '~/api/empleados/getEmpleados.gql'
import GetProductos from '~/api/productos/getProductos.gql'
import CrearCompra from '~/api/compras/crearCompra.gql'
import ProductoForm from '~/components/productos/ProductoForm.vue'

const emit = defineEmits(['close'])

const form = ref({
  codProveedor: null,
  idEmpleado: null,
  fecha: new Date().toISOString().slice(0, 10),
  tipoPago: 'Efectivo',
  productos: [
    { codProducto: null, cantidad: 1, precioProducto: 0 }
  ]
})

const showProductoForm = ref(false)

const { result: proveedoresResult } = useQuery(GetProveedores)
const { result: empleadosResult } = useQuery(GetEmpleados)
const { result: productosResult, refetch: refetchProductos } = useQuery(GetProductos)
const { mutate } = useMutation(CrearCompra)

function agregarProducto() {
  form.value.productos.push({ codProducto: null, cantidad: 1, precioProducto: 0 })
}

function eliminarProducto(index: number) {
  form.value.productos.splice(index, 1)
}

function abrirProductoForm() {
  showProductoForm.value = true
}

function cerrarProductoForm() {
  showProductoForm.value = false
  refetchProductos()
}

function formatoMoneda(valor: number) {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    minimumFractionDigits: 2
  }).format(valor)
}

const total = computed(() =>
  form.value.productos.reduce((acc, p) => acc + (p.precioProducto * p.cantidad), 0)
)

async function guardar() {
  try {
    await mutate({
      input: {
        codProveedor: parseInt(form.value.codProveedor),
        idEmpleado: parseInt(form.value.idEmpleado),
        fecha: form.value.fecha,
        tipoPago: form.value.tipoPago,
        monto: total.value,
        detalleCompras: form.value.productos.map(p => ({
          codProducto: parseInt(p.codProducto),
          cantidad: p.cantidad,
          precioProducto: p.precioProducto
        }))
      }
    })
    emit('close')
  } catch (e) {
    console.error('Error al guardar compra:', e)
  }
}

// Watch para asignar precioVenta automáticamente
watch(
  () => form.value.productos,
  (productos) => {
    productos.forEach((prod) => {
      watch(
        () => prod.codProducto,
        (nuevoCod) => {
          const productoSeleccionado = productosResult.value?.productos.find(
            p => p.codProducto === parseInt(nuevoCod)
          )
          prod.precioProducto = productoSeleccionado ? productoSeleccionado.precioCompra : 0
        }
      )
    })
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl shadow-xl">
      <h3 class="text-xl font-bold mb-4">Registrar Compra</h3>

      <form @submit.prevent="guardar" class="grid gap-4">
        <!-- Proveedor y Empleado -->
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1">Seleccionar Proveedor:</label>
            <select v-model="form.codProveedor" class="input" required>
              <option value="">Seleccionar Proveedor</option>
              <option v-for="p in proveedoresResult?.proveedores || []" :key="p.codProveedor" :value="p.codProveedor">
                {{ p.nombre }}
              </option>
            </select>
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1">Seleccionar Empleado:</label>
            <select v-model="form.idEmpleado" class="input" required>
              <option value="">Seleccionar Empleado</option>
              <option v-for="e in empleadosResult?.empleados || []" :key="e.idEmpleado" :value="e.idEmpleado">
                {{ e.nombre }} {{ e.apellidoPaterno }}
              </option>
            </select>
          </div>
        </div>

        <!-- Fecha y Tipo de Pago -->
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1">Fecha:</label>
            <input type="date" v-model="form.fecha" class="input" required />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1">Tipo de Pago:</label>
            <select v-model="form.tipoPago" class="input">
              <option value="Efectivo">Efectivo</option>
            </select>
          </div>
        </div>

        <!-- Productos -->
        <div class="border rounded p-4">
          <div class="flex justify-between items-center mb-3">
            <h4 class="text-md font-bold">Productos</h4>
            <button type="button" @click="abrirProductoForm" class="text-blue-600 hover:underline text-sm">Nuevo Producto</button>
          </div>
          <div v-for="(prod, index) in form.productos" :key="index" class="flex flex-wrap gap-2 mb-4">
            <select v-model="prod.codProducto" class="input flex-grow min-w-[180px]" required>
              <option value="">Producto</option>
              <option v-for="p in productosResult?.productos || []" :key="p.codProducto" :value="p.codProducto">
                {{ p.nombre }}
              </option>
            </select>

            <div class="flex gap-4">
              <div class="flex-1">
                <label class="block text-sm font-medium mb-1">Cantidad:</label>
                <input type="number" v-model.number="prod.cantidad" min="1" class="input w-[100px]" />
              </div>

              <div class="flex-1">
                <label class="block text-sm font-medium mb-1">Precio:</label>
                <input type="number" :value="prod.precioProducto" readonly class="input w-[100px]" />
              </div>
            </div>

            <!-- Subtotal en Quetzales -->
            <p class="text-sm text-gray-600 mt-1 w-full">
              Subtotal: {{ formatoMoneda(prod.precioProducto * prod.cantidad) }}
            </p>

            <button v-if="form.productos.length > 1" type="button" class="text-red-600 text-sm hover:underline w-full" @click="eliminarProducto(index)">
              Quitar producto
            </button>
          </div>

          <button type="button" class="text-blue-600 text-sm hover:underline" @click="agregarProducto">
            + Agregar producto
          </button>
        </div>

        <!-- Total -->
        <label class="block text-sm font-medium mb-1">Precio Total:</label>
        <p class="text-right font-bold text-lg mt-2">{{ formatoMoneda(total) }}</p>

        <!-- Acciones -->
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" class="bg-gray-500 text-white px-4 py-2 rounded" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
        </div>
      </form>

      <ProductoForm v-if="showProductoForm" :producto="null" @close="cerrarProductoForm" />
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300;
}
</style>
