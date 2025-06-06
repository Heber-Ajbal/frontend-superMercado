<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue'
import { useMutation, useQuery } from '@vue/apollo-composable'
import CrearMovimiento from '~/api/movimientos/crearMovimiento.gql'
import GetInventario from '~/api/inventario/getInventario.gql'
import GetEmpleados from '~/api/empleados/getEmpleados.gql'
import GetAlmacenes from '~/api/almacenes/getAlmacenes.gql'
import GetProductos from '~/api/productos/getProductos.gql'

const props = defineProps<{ registro: any | null }>()
const emit = defineEmits(['close'])

const form = ref({
  idAlmacen: '',
  codProducto: '',
  cantidad: 1,
  idEmpleado: ''
})

const tipoMovimiento = ref('Bodega a Piso') // Valores posibles: 'Bodega a Piso' o 'Piso a Bodega'

const { result: inventarioResult } = useQuery(GetInventario)
const { result: empleadosResult } = useQuery(GetEmpleados)
const { result: almacenesResult } = useQuery(GetAlmacenes)
const { result: productosResult } = useQuery(GetProductos)
const { mutate } = useMutation(CrearMovimiento)

const almacenesDisponibles = computed(() => almacenesResult.value?.almacenes ?? [])
const productosDisponibles = computed(() => productosResult.value?.productos ?? [])

const ubicacionOrigen = computed(() =>
  tipoMovimiento.value === 'Bodega a Piso' ? 'Almacen' : 'Piso de Ventas'
)

const productoInventario = computed(() =>
  inventarioResult.value?.inventarios.find(i =>
    i.codProducto == form.value.codProducto &&
    i.ubicacion === ubicacionOrigen.value &&
    (ubicacionOrigen.value === 'Piso de Ventas' || i.idAlmacen == form.value.idAlmacen)
  )
)

async function guardar() {
  if (!form.value.codProducto || !form.value.idEmpleado || form.value.cantidad < 1) {
    alert('Todos los campos son obligatorios.')
    return
  }

  if ((tipoMovimiento.value !== 'Piso a Bodega') && !form.value.idAlmacen) {
    alert('Debe seleccionar un almacén.')
    return
  }

  const stock = productoInventario.value?.cantidad ?? 0
  if (form.value.cantidad > stock) {
    alert(`Stock insuficiente. Solo hay ${stock} unidades disponibles en ${ubicacionOrigen.value}.`)
    return
  }

  try {
    await mutate({
      input: {
        codProducto: parseInt(form.value.codProducto),
        cantidad: form.value.cantidad,
        tipoMovimiento: tipoMovimiento.value === 'Bodega a Piso'
          ? 'Salida a Piso de Ventas'
          : 'Ingreso a Almacén',
        idEmpleado: parseInt(form.value.idEmpleado),
        idAlmacen: parseInt(form.value.idAlmacen)
      }
    })

    emit('close')
  } catch (error: any) {
    alert('Error al guardar movimiento: ' + error.message)
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-xl">
      <h3 class="text-xl font-bold mb-4">Movimiento de Producto</h3>

      <form @submit.prevent="guardar" class="grid gap-4">
        <!-- Tipo de Movimiento -->
        <div>
          <label class="block text-sm font-medium mb-1">Tipo de Movimiento:</label>
          <select v-model="tipoMovimiento" class="input" required>
            <option value="Bodega a Piso">De Bodega a Piso de Ventas</option>
            <option value="Piso a Bodega">De Piso de Ventas a Bodega</option>
          </select>
        </div>

        <!-- Almacén -->
        <div v-if="tipoMovimiento === 'Bodega a Piso' || tipoMovimiento === 'Piso a Bodega'">
          <label class="block text-sm font-medium mb-1">
            {{ tipoMovimiento === 'Bodega a Piso' ? 'Bodega de origen:' : 'Bodega de destino:' }}
          </label>
          <select v-model="form.idAlmacen" class="input" required>
            <option value="">Seleccionar almacén</option>
            <option v-for="a in almacenesDisponibles" :key="a.idAlmacen" :value="a.idAlmacen">
              {{ a.nombre }}
            </option>
          </select>
        </div>

        <!-- Producto -->
        <div>
          <label class="block text-sm font-medium mb-1">Producto:</label>
          <select v-model="form.codProducto" class="input" required>
            <option value="">Seleccionar producto</option>
            <option v-for="p in productosDisponibles" :key="p.codProducto" :value="p.codProducto">
              {{ p.nombre }}
            </option>
          </select>
        </div>

        <!-- Cantidad -->
        <div>
          <label class="block text-sm font-medium mb-1">Cantidad a mover:</label>
          <input
            type="number"
            v-model.number="form.cantidad"
            class="input"
            min="1"
            :max="productoInventario?.cantidad > 0 ? productoInventario.cantidad : undefined"
            :disabled="!productoInventario || productoInventario.cantidad < 1"
            required
          />
          <p v-if="productoInventario && productoInventario.cantidad > 0" class="text-xs text-gray-500 mt-1">
            Stock disponible: {{ productoInventario.cantidad }}
          </p>
          <p v-else-if="productoInventario" class="text-xs text-red-500 mt-1">
            No hay stock disponible en esta ubicación.
          </p>
        </div>

        <!-- Empleado -->
        <div>
          <label class="block text-sm font-medium mb-1">Empleado encargado:</label>
          <select v-model="form.idEmpleado" class="input" required>
            <option value="">Seleccionar empleado</option>
            <option v-for="e in empleadosResult?.empleados || []" :key="e.idEmpleado" :value="e.idEmpleado">
              {{ e.nombre }} {{ e.apellidoPaterno }}
            </option>
          </select>
        </div>

        <!-- Acciones -->
        <div class="flex justify-end gap-2 mt-4">
          <button type="button" class="bg-gray-500 text-white px-4 py-2 rounded" @click="$emit('close')">
            Cancelar
          </button>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
            Confirmar Movimiento
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring;
}
</style>
