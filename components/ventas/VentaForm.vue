<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue'
import { useQuery, useMutation } from '@vue/apollo-composable'
import GetClientes from '~/api/clientes/getClientes.gql'
import GetEmpleados from '~/api/empleados/getEmpleados.gql'
import GetProductos from '~/api/productos/getProductos.gql'
import CrearVenta from '~/api/ventas/crearVenta.gql'
import ClienteForm from '~/components/clientes/ClienteForm.vue'
import GetInventario from '~/api/inventario/getInventario.gql'


const props = defineProps<{ visible: boolean }>()
const emit = defineEmits(['close'])

const { result: clientesResult, refetch: refetchClientes } = useQuery(GetClientes)

const { result: empleadosResult } = useQuery(GetEmpleados)
const { result: productosResult } = useQuery(GetProductos)
const { result: inventarioResult } = useQuery(GetInventario)
const inventario = computed(() => inventarioResult.value?.inventario ?? [])


const clientes = computed(() => clientesResult.value?.clientes ?? [])
const empleados = computed(() => empleadosResult.value?.empleados ?? [])
const productos = computed(() => productosResult.value?.productos ?? [])

const showClienteModal = ref(false)
const clienteCreado = ref<any | null>(null)

const form = ref({
  Cliente: '',
  Empleado: '',
  Fecha: new Date().toISOString().slice(0, 10),
  Hora: new Date().toLocaleTimeString('en-GB').slice(0, 5),
  tipoPago: 'Efectivo',
  Detalle: [{ producto: '', cantidad: 1, descuento: 0 }],
  tarjeta: {
    numero: '',
    expiracion: '',
    codigo: ''
  }
})

watch(clienteCreado, (nuevoCliente) => {
  if (nuevoCliente) {
    form.value.Cliente = nuevoCliente.idCliente
    refetchClientes() // para que aparezca en el select
  }
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

async function procesarPagoConTarjeta(): Promise<boolean> {
  try {
    const response = await fetch('/api/card', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        card_number: form.value.tarjeta.numero,
        expiration_date: form.value.tarjeta.expiracion,
        security_code: form.value.tarjeta.codigo,
        amount: total.value,
        company_name: 'SUPERMARKET E.H.N'
      })
    })

    const data = await response.json()

    console.log(data.success)
    return response.ok && data.success === true;
  } catch (error) {
    console.error('Error en el pago con tarjeta:', error)
    return false
  }
}


async function guardar() {

  const erroresStock = form.value.Detalle.filter(item => {
    const stockDisponible = inventario.value.find(i =>
      i.codProducto === item.producto && i.Ubicacion === 'Piso de Ventas'
    )?.Cantidad || 0

    return item.cantidad > stockDisponible
  })

  if (erroresStock.length > 0) {
    alert('No hay suficiente stock en el piso de ventas para uno o más productos.')
    return
  }

  if (form.value.tipoPago === 'Tarjeta') {
    const exito = await procesarPagoConTarjeta()
    if (!exito) {
      alert('Error al procesar el pago con tarjeta. Intenta nuevamente.')
      return
    }
  }

  const payload = {
    idCliente: form.value.Cliente,
    idEmpleado: form.value.Empleado,
    fecha: form.value.Fecha,
    hora: form.value.Hora + ':00',
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
  <div v-show="props.visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
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
            <button type="button" class="text-blue-600 text-sm mt-1 hover:underline" @click="showClienteModal = true">
              + Agregar nuevo cliente
            </button>
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

        <!-- Campos de tarjeta -->
        <div v-if="form.tipoPago === 'Tarjeta'" class="grid gap-4 mt-2">
          <div>
            <label class="block text-sm font-medium mb-1">Número de Tarjeta:</label>
            <input type="text" v-model="form.tarjeta.numero" class="input" required />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Fecha de Expiración (MM/YY):</label>
            <input type="text" v-model="form.tarjeta.expiracion" class="input" placeholder="03/30" required />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Código de Seguridad:</label>
            <input type="text" v-model="form.tarjeta.codigo" class="input" required />
          </div>
        </div>

        <!-- Productos -->
        <div class="border rounded p-4">
          <h4 class="text-md font-bold mb-3">Productos</h4>
          <div v-for="(prod, index) in form.Detalle" :key="index" class="flex flex-wrap gap-2 mb-4">
            <select v-model="prod.producto" class="input flex-grow min-w-[180px]" required>
              <option value="">Producto</option>
              <option v-for="p in productos" :key="p.codProducto" :value="p.codProducto">
                {{ p.nombre }}
              </option>
            </select>

            <div class="flex gap-4">
              <div class="flex-1">
                <label class="block text-sm font-medium mb-1">Cantidad:</label>
                <input type="number" v-model.number="prod.cantidad" min="1" class="input w-[100px]" required />
              </div>

              <div class="flex-1">
                <label class="block text-sm font-medium mb-1">Descuento (%):</label>
                <input type="number" v-model.number="prod.descuento" min="0" max="100" class="input w-[100px]" />
              </div>
            </div>

            <button v-if="form.Detalle.length > 1" type="button" class="text-red-600 text-sm hover:underline w-full"
              @click="eliminarProducto(index)">
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

    <ClienteForm v-if="showClienteModal" :cliente="null" @close="() => {
      showClienteModal = false
      refetchClientes()
    }" />


  </div>


</template>

<style scoped>
.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300;
}
</style>
