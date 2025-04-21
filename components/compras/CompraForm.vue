<script setup lang="ts">
import { defineEmits, ref, watch } from 'vue'

const emit = defineEmits(['close'])

// Datos de ejemplo (luego se obtendrán de la base)
const proveedores = ['Proveedor A', 'Proveedor B', 'Proveedor C']
const empleados = ['Carlos Ramírez', 'Ana Morales']
const productosDisponibles = ['Leche', 'Arroz', 'Galletas', 'Jugo']

const form = ref({
  Proveedor: '',
  Empleado: '',
  Fecha: new Date().toISOString().slice(0, 10),
  TipoPago: 'Efectivo',
  Productos: [
    { nombre: '', cantidad: 1, precio: 0 }
  ]
})

function agregarProducto() {
  form.value.Productos.push({ nombre: '', cantidad: 1, precio: 0 })
}

function eliminarProducto(index: number) {
  form.value.Productos.splice(index, 1)
}

const total = computed(() =>
  form.value.Productos.reduce((acc, p) => acc + (p.precio * p.cantidad), 0)
)

function guardar() {
  // Aquí iría la llamada al backend
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl shadow-xl">
      <h3 class="text-xl font-bold mb-4">Registrar Compra</h3>

      <form @submit.prevent="guardar" class="grid gap-4">
        <select v-model="form.Proveedor" class="input" required>
          <option value="">Seleccionar Proveedor</option>
          <option v-for="p in proveedores" :key="p" :value="p">{{ p }}</option>
        </select>

        <select v-model="form.Empleado" class="input" required>
          <option value="">Empleado Responsable</option>
          <option v-for="e in empleados" :key="e" :value="e">{{ e }}</option>
        </select>

        <input type="date" v-model="form.Fecha" class="input" />
        <select v-model="form.TipoPago" class="input">
          <option value="Efectivo">Efectivo</option>
          <option value="Tarjeta">Tarjeta</option>
          <option value="Transferencia">Transferencia</option>
        </select>

        <div class="border rounded p-3">
          <h4 class="text-md font-bold mb-2">Productos</h4>

          <div
            v-for="(prod, index) in form.Productos"
            :key="index"
            class="grid grid-cols-4 gap-2 mb-2"
          >
            <select v-model="prod.nombre" class="input col-span-2" required>
              <option value="">Producto</option>
              <option v-for="p in productosDisponibles" :key="p" :value="p">{{ p }}</option>
            </select>
            <input type="number" v-model.number="prod.cantidad" min="1" class="input" placeholder="Cantidad" />
            <input type="number" v-model.number="prod.precio" min="0" class="input" placeholder="Precio" />
            <button
              type="button"
              class="text-red-600 hover:text-red-800 col-span-4 text-left text-sm mt-1"
              @click="eliminarProducto(index)"
              v-if="form.Productos.length > 1"
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
