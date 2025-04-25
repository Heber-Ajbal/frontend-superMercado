<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import CrearEmpleado from '~/api/empleados/crearEmpleado.gql'

const props = defineProps<{ empleado: any | null }>()
const emit = defineEmits(['close'])

const form = ref({
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  sueldo: 0,
  turno: 'Mañana',
  cargo: 'Cajero',
})

watch(() => props.empleado, (nuevo) => {
  if (nuevo) {
    form.value = {
      nombre: nuevo.nombre,
      apellidoPaterno: nuevo.apellidoPaterno,
      apellidoMaterno: nuevo.apellidoMaterno,
      sueldo: nuevo.sueldo,
      turno: nuevo.turno,
      cargo: nuevo.cargo,
    }
  } else {
    form.value = {
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      sueldo: 0,
      turno: 'Mañana',
      cargo: 'Cajero',
    }
  }
}, { immediate: true })

const { mutate, onDone, onError } = useMutation(CrearEmpleado)

async function guardar() {
  try {
    await mutate({ input: { ...form.value } })
    onDone(() => emit('close'))
    onError((err) => console.error('Error al crear empleado:', err))
  } catch (err) {
    console.error('Error inesperado:', err)
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-xl dark:bg-gray-800">
      <h3 class="text-xl font-bold mb-4">{{ props.empleado ? 'Editar Empleado' : 'Agregar Empleado' }}</h3>

      <form @submit.prevent="guardar" class="grid gap-4">

        <div class="flex items-center gap-4">
          <label class="w-32 font-medium text-gray-700 dark:text-white">Nombre: </label>
          <input v-model="form.nombre" placeholder="Nombre" class="input" required />
        </div>

        <div class="flex items-center gap-4">
          <label class="w-32 font-medium text-gray-700 dark:text-white">Primer Apellido: </label>
          <input v-model="form.apellidoPaterno" placeholder="Primer Apellido" class="input" required />
        </div>

        <div class="flex items-center gap-4">
          <label class="w-32 font-medium text-gray-700 dark:text-white">Segundo Apellido: </label>
          <input v-model="form.apellidoMaterno" placeholder="Segundo Apellido" class="input" required />
        </div>
        
        <div class="flex items-center gap-4">
          <label class="w-32 font-medium text-gray-700 dark:text-white">Sueldo: </label>
          <input v-model.number="form.sueldo" type="number" placeholder="Sueldo" class="input" required />
        </div>

        

        <div class="flex items-center gap-4">
          <label class="w-32 font-medium text-gray-700 dark:text-white">Jornada: </label>
          <select v-model="form.turno" class="input">
          <option value="Mañana">Mañana</option>
          <option value="Tarde">Tarde</option>
          <option value="Noche">Noche</option>
        </select>
        </div>

        
        <div class="flex items-center gap-4">
          <label class="w-32 font-medium text-gray-700 dark:text-white">Puesto: </label>
          <select v-model="form.cargo" class="input">
          <option value="Cajero">Cajero</option>
          <option value="Encargado de Almacén">Encargado de Almacén</option>
          <option value="Supervisor">Supervisor</option>
        </select>
        </div>

        

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
