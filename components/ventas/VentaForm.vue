<script setup lang="ts">
import { defineProps, defineEmits, ref, computed, watch } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import GetClientes from '~/api/clientes/getClientes.gql'
import GetEmpleados from '~/api/empleados/getEmpleados.gql'
import GetProductos from '~/api/productos/getProductos.gql'
import CrearVenta from '~/api/ventas/crearVenta.gql'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits(['close'])

const { result: clientesResult } = useQuery(GetClientes)
const { result: empleadosResult } = useQuery(GetEmpleados)
const { result: productosResult } = useQuery(GetProductos)

const clientes = computed(() => clientesResult.value?.clientes ?? [])
const empleados = computed(() => empleadosResult.value?.empleados ?? [])
const productos = computed(() => productosResult.value?.productos ?? [])

const form = ref({
  Cliente: '',
  Empleado: '',
  Fecha: new Date().toISOString().slice(0, 10),
  Hora: new Date().toLocaleTimeString('en-GB').slice(0, 5),
  tipoPago: 'Efectivo',
  Detalle: [{ producto: '', cantidad: 1, descuento: 0 }]
})

function agregarProducto() {
  form.value.Detalle.push({ producto: '', cantidad: 1, descuento: 0 })
}

function eliminarProducto(index: number) {
  form.value.Detalle.splice(index, 1)
}

const total = computed(() =>
  form.value.Detalle.reduce((acc, item) => {
    const prod = productos.value.find(p => p.codProducto === item.producto)
    const precio = prod?.precioVenta ?? 0
    const descuentoAplicado = (item.descuento / 100) * precio * item.cantidad
    return acc + (precio * item.cantidad - descuentoAplicado)
  }, 0)
)

const { mutate } = useMutation(CrearVenta)

async function guardar() {
  const payload = {
    idCliente: form.value.Cliente,
    idEmpleado: form.value.Empleado,
    fecha: form.value.Fecha,
    hora: form.value.Hora + ':00',
    //tipoPago: form.value.tipoPago, // por ahora es solo visual
    monto: total.value,
    detalles: form.value.Detalle.map(({ producto, cantidad, descuento }) => {
      const precio = productos.value.find(p => p.codProducto === producto)?.precioVenta ?? 0
      const descuentoFinal = (descuento / 100) * precio * cantidad
      return {
        codProducto: producto,
        cantidad,
        descuento: descuentoFinal
      }
    })
  }

  await mutate({ input: payload })
  emit('close')
}
</script>

<template>
  <div v-show="props.visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl shadow-xl">
      <h3 class="text-xl font-bold mb-4">Registrar Venta</h3>

      <form @submit.prevent="guardar" class="grid gap-4">
        <!-- Cliente y Empleado -->
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1">Nombre del Cliente:</label>
            <select v-model="form.Cliente" class="input" required>
              <option value="">Seleccionar Cliente</option>
              <option v-for="c in clientes" :key="c.idCliente" :value="c.idCliente">
                {{ c.nombre }} {{ c.apellidoPaterno }}
              </option>
            </select>
          </div>

          <div class="flex-1">
            <label class="block text-sm font-medium mb-1">Nombre del Empleado:</label>
            <select v-model="form.Empleado" class="input" required>
              <option value="">Seleccionar Empleado</option>
              <option v-for="e in empleados" :key="e.idEmpleado" :value="e.idEmpleado">
                {{ e.nombre }} {{ e.apellidoPaterno }}
              </option>
            </select>
          </div>
        </div>

        <!-- Fecha y Hora -->
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1">Fecha:</label>
            <input type="date" v-model="form.Fecha" class="input" required />
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium mb-1">Hora:</label>
            <input type="time" v-model="form.Hora" class="input" required />
          </div>
        </div>

        <!-- Tipo de Pago -->
        <div>
          <label class="block text-sm font-medium mb-1">Tipo de Pago:</label>
          <select v-model="form.tipoPago" class="input" required>
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta">Tarjeta</option>
            <option value="Transferencia">Transferencia</option>
          </select>
        </div>

        <!-- Productos -->
        <div class="border rounded p-4">
          <h4 class="text-md font-bold mb-3">Productos</h4>
          <div
            v-for="(prod, index) in form.Detalle"
            :key="index"
            class="flex flex-wrap gap-2 mb-4"
          >
            <select v-model="prod.producto" class="input flex-grow min-w-[180px]" required>
              <option value="">Producto</option>
              <option v-for="p in productos" :key="p.codProducto" :value="p.codProducto">
                {{ p.nombre }}
              </option>
            </select>

            <div class="flex gap-4">
              <div class="flex-1">
                <label class="block text-sm font-medium mb-1">Cantidad:</label>
                <input
                  type="number"
                  v-model.number="prod.cantidad"
                  min="1"
                  class="input w-[100px]"
                  placeholder="Cantidad"
                  required
                />
              </div>

              <div class="flex-1">
                <label class="block text-sm font-medium mb-1">Descuento (%):</label>
                <input
                  type="number"
                  v-model.number="prod.descuento"
                  min="0"
                  max="100"
                  class="input w-[100px]"
                  placeholder="0%"
                />
              </div>
            </div>

            <button
              v-if="form.Detalle.length > 1"
              type="button"
              class="text-red-600 text-sm hover:underline w-full"
              @click="eliminarProducto(index)"
            >
              Quitar producto
            </button>
          </div>

          <button type="button" class="text-blue-600 text-sm hover:underline" @click="agregarProducto">
            + Agregar producto
          </button>
        </div>

        <!-- Total -->
        <p class="text-right font-bold text-lg mt-2">Total: Q{{ total.toFixed(2) }}</p>

        <!-- Acciones -->
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" class="bg-gray-500 text-white px-4 py-2 rounded" @click="$emit('close')">
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
  @apply w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300;
}
</style>
