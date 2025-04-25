<script setup lang="ts">
import { defineEmits, ref } from 'vue'
import { useMutation } from '@vue/apollo-composable'
import CrearEmpleadoConUsuario from '~/api/users/crearUsuario.gql'

const emit = defineEmits(['close'])

const roles = ['Cajero', 'Supervisor', 'Encargado de Almacén']
const turnos = ['Mañana', 'Tarde', 'Completo']

const form = ref({
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  sueldo: 0,
  turno: 'Mañana',
  cargo: 'Cajero',

  nombreUsuario: '',
  contrasena: '',
  rol: 'Cajero'
})

const { mutate } = useMutation(CrearEmpleadoConUsuario)

async function guardar() {
  try {
    await mutate({
      nombreEmpleado: form.value.nombre,
      apellidoPaterno: form.value.apellidoPaterno,
      apellidoMaterno: form.value.apellidoMaterno,
      sueldo: form.value.sueldo,
      turno: form.value.turno,
      cargo: form.value.rol,
      nombreUsuario: form.value.nombreUsuario,
      contrasena: form.value.contrasena,
      rol: form.value.rol
    })

    emit('close')
  } catch (err) {
    console.error('Error al crear usuario:', err)
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-xl shadow-xl">
      <h3 class="text-xl font-bold mb-4">Registrar Empleado + Usuario</h3>

      <form @submit.prevent="guardar" class="grid gap-4">
        <!-- Datos del empleado -->
        <div class="grid gap-2">
          <div class="flex items-center gap-4">
            <label class="w-40 font-medium text-gray-700 dark:text-white">Nombre del empleado:</label>
            <input v-model="form.nombre" placeholder="Nombre del empleado" class="input" required />
          </div>

          <div class="flex items-center gap-4">
            <label class="w-40 font-medium text-gray-700 dark:text-white">Primer Apellido:</label>
            <input v-model="form.apellidoPaterno" placeholder="Primer Apellido" class="input" required />
          </div>

          <div class="flex items-center gap-4">
            <label class="w-40 font-medium text-gray-700 dark:text-white">Segundo Apellido:</label>
            <input v-model="form.apellidoMaterno" placeholder="Segundo Apellido" class="input" required />
          </div>

          <div class="flex items-center gap-4">
            <label class="w-40 font-medium text-gray-700 dark:text-white">Sueldo:</label>
            <input v-model.number="form.sueldo" type="number" min="0" step="0.01" placeholder="Sueldo" class="input" required />
          </div>

          <div class="flex items-center gap-4">
            <label class="w-40 font-medium text-gray-700 dark:text-white">Jornada:</label>
            <select v-model="form.turno" class="input">
              <option v-for="t in turnos" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
        </div>

        <!-- Datos del usuario -->
        <div class="grid gap-2 border-t pt-4 mt-4">
          <div class="flex items-center gap-4">
            <label class="w-40 font-medium text-gray-700 dark:text-white">Nombre de Usuario:</label>
            <input v-model="form.nombreUsuario" placeholder="Nombre de Usuario" class="input" required />
          </div>

          <div class="flex items-center gap-4">
            <label class="w-40 font-medium text-gray-700 dark:text-white">Contraseña:</label>
            <input v-model="form.contrasena" type="password" placeholder="Contraseña" class="input" required />
          </div>

          <div class="flex items-center gap-4">
            <label class="w-40 font-medium text-gray-700 dark:text-white">Puesto:</label>
            <select v-model="form.rol" class="input">
              <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>
        </div>

        <!-- Botones -->
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
  @apply w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300;
}
</style>
