<script setup lang="ts">
import { defineEmits, ref } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import GetProveedores from '~/api/proveedores/getProveedores.gql'
import GetEmpleados from '~/api/empleados/getEmpleados.gql'
import GetProductos from '~/api/productos/getProductos.gql'
import CrearCompra from '~/api/compras/crearCompra.gql'

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

const { result: proveedoresResult } = useQuery(GetProveedores)
const { result: empleadosResult } = useQuery(GetEmpleados)
const { result: productosResult } = useQuery(GetProductos)
const { mutate, onDone, onError } = useMutation(CrearCompra)

function agregarProducto() {
  form.value.productos.push({ codProducto: null, cantidad: 1, precioProducto: 0 })
}

function eliminarProducto(index: number) {
  form.value.productos.splice(index, 1)
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
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl shadow-xl">
      <h3 class="text-xl font-bold mb-4">Registrar Compra</h3>

      <form @submit.prevent="guardar" class="grid gap-4">
        <select v-model="form.codProveedor" class="input" required>
          <option value="">Seleccionar Proveedor</option>
          <option v-for="p in proveedoresResult?.proveedores || []" :key="p.codProveedor" :value="p.codProveedor">
            {{ p.nombre }}
          </option>
        </select>

        <select v-model="form.idEmpleado" class="input" required>
          <option value="">Seleccionar Empleado</option>
          <option v-for="e in empleadosResult?.empleados || []" :key="e.idEmpleado" :value="e.idEmpleado">
            {{ e.nombre }} {{ e.apellidoPaterno }}
          </option>
        </select>

        <input type="date" v-model="form.fecha" class="input" />
        <select v-model="form.tipoPago" class="input">
          <option value="Efectivo">Efectivo</option>
          <option value="Tarjeta">Tarjeta</option>
          <option value="Transferencia">Transferencia</option>
        </select>

        <div class="border rounded p-3">
          <h4 class="text-md font-bold mb-2">Productos</h4>

          <div v-for="(prod, index) in form.productos" :key="index" class="grid grid-cols-4 gap-2 mb-2">
            <select v-model="prod.codProducto" class="input col-span-2" required>
              <option value="">Producto</option>
              <option v-for="p in productosResult?.productos || []" :key="p.codProducto" :value="p.codProducto">
                {{ p.nombre }}
              </option>
            </select>
            <input type="number" v-model.number="prod.cantidad" min="1" class="input" placeholder="Cantidad" />
            <input type="number" v-model.number="prod.precioProducto" min="0" class="input" placeholder="Precio" />
            <button type="button" class="text-red-600 hover:text-red-800 col-span-4 text-left text-sm mt-1" @click="eliminarProducto(index)" v-if="form.productos.length > 1">
              Quitar
            </button>
          </div>

          <button type="button" class="text-blue-600 hover:text-blue-800 text-sm mt-2" @click="agregarProducto">
            + Agregar producto
          </button>
        </div>

        <p class="text-right font-bold text-lg">
          Total: ${{ total.toFixed(2) }}
        </p>

        <div class="flex justify-end gap-2">
          <button type="button" class="bg-gray-500 text-white px-4 py-2 rounded" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
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
