<script setup lang="ts">
import { defineEmits, ref, computed } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import GetClientes from '~/api/clientes/getClientes.gql'
import GetEmpleados from '~/api/empleados/getEmpleados.gql'
import GetProductos from '~/api/productos/getProductos.gql'
import CrearVenta from '~/api/ventas/crearVenta.gql'

const emit = defineEmits(['close'])

const { result: clientesResult } = useQuery(GetClientes)
const { result: empleadosResult } = useQuery(GetEmpleados)
const { result: productosResult } = useQuery(GetProductos)

const clientes = computed(() => clientesResult.value?.clientes || [])
const empleados = computed(() => empleadosResult.value?.empleados || [])
const productos = computed(() => productosResult.value?.productos || [])

const form = ref({
  Cliente: '',
  Empleado: '',
  Fecha: new Date().toISOString().slice(0, 10),
  Hora: new Date().toLocaleTimeString('en-GB').slice(0, 5),
  Detalle: [{ producto: '', cantidad: 1, descuento: 0 }]
})

function agregarProducto() {
  form.value.Detalle.push({ producto: '', cantidad: 1, descuento: 0 })
}

function eliminarProducto(index: number) {
  form.value.Detalle.splice(index, 1)
}

const total = computed(() =>
  form.value.Detalle.reduce((acc, p) => {
    const precio = productos.value.find(prod => prod.codProducto === p.producto)?.precioVenta || 0
    const subtotal = p.cantidad * precio
    return acc + (subtotal - p.descuento)
  }, 0)
)

const { mutate } = useMutation(CrearVenta)

async function guardar() {
  const payload = {
    idCliente: form.value.Cliente,
    idEmpleado: form.value.Empleado,
    fecha: form.value.Fecha,
    hora: form.value.Hora + ':00',
    monto: total.value,
    detalles: form.value.Detalle.map(d => ({
      codProducto: d.producto,
      cantidad: d.cantidad,
      descuento: d.descuento
    }))
  }

  await mutate({ input: payload })
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl shadow-xl">
      <h3 class="text-xl font-bold mb-4">Registrar Venta</h3>

      <form @submit.prevent="guardar" class="grid gap-4">
        <select v-model="form.Cliente" class="input" required>
          <option value="">Seleccionar Cliente</option>
          <option v-for="c in clientes" :key="c.idCliente" :value="c.idCliente">
            {{ c.nombre }} {{ c.apellidoPaterno }}
          </option>
        </select>

        <select v-model="form.Empleado" class="input" required>
          <option value="">Empleado Responsable</option>
          <option v-for="e in empleados" :key="e.idEmpleado" :value="e.idEmpleado">
            {{ e.nombre }} {{ e.apellidoPaterno }}
          </option>
        </select>

        <input type="date" v-model="form.Fecha" class="input" />
        <input type="time" v-model="form.Hora" class="input" />

        <div class="border rounded p-3">
          <h4 class="text-md font-bold mb-2">Productos</h4>

          <div
            v-for="(prod, index) in form.Detalle"
            :key="index"
            class="grid grid-cols-4 gap-2 mb-2"
          >
            <select v-model="prod.producto" class="input col-span-2" required>
              <option value="">Producto</option>
              <option v-for="p in productos" :key="p.codProducto" :value="p.codProducto">
                {{ p.nombre }}
              </option>
            </select>
            <input type="number" v-model.number="prod.cantidad" min="1" class="input" placeholder="Cantidad" />
            <input type="number" v-model.number="prod.descuento" min="0" class="input" placeholder="Descuento" />
            <button
              type="button"
              class="text-red-600 hover:text-red-800 col-span-4 text-left text-sm mt-1"
              @click="eliminarProducto(index)"
              v-if="form.Detalle.length > 1"
            >
              Quitar
            </button>
          </div>

          <button
            type="button"
            class="text-blue-600 hover:text-blue-800 text-sm mt-2"
            @click="agregarProducto"
          >
            + Agregar producto
          </button>
        </div>

        <p class="text-right font-bold text-lg">
          Total: ${{ total.toFixed(2) }}
        </p>

        <div class="flex justify-end gap-2">
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
  @apply w-full px-3 py-2 border border-gray-300 rounded;
}
</style>
