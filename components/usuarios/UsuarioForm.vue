<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps<{ usuario: any | null }>()
const emit = defineEmits(['close'])

const empleados = ['Carlos Ramírez', 'Ana Morales']
const roles = ['Cajero', 'Supervisor', 'Encargado de Almacén']

const form = ref({
  NombreUsuario: '',
  Empleado: '',
  Contrasena: '',
  Rol: 'Cajero',
  Activo: true,
})

watch(() => props.usuario, (nuevo) => {
  if (nuevo) {
    form.value = {
      NombreUsuario: nuevo.NombreUsuario,
      Empleado: nuevo.Empleado,
      Contrasena: '', // No mostramos la actual por seguridad
      Rol: nuevo.Rol,
      Activo: nuevo.Activo,
    }
  } else {
    form.value = {
      NombreUsuario: '',
      Empleado: '',
      Contrasena: '',
      Rol: 'Cajero',
      Activo: true,
    }
  }
}, { immediate: true })

function guardar() {
  // Aquí conectarás con el backend
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-xl">
      <h3 class="text-xl font-bold mb-4">{{ props.usuario ? 'Editar Usuario' : 'Nuevo Usuario' }}</h3>

      <form @submit.prevent="guardar" class="grid gap-4">
        <input v-model="form.NombreUsuario" placeholder="Nombre de Usuario" class="input" required />
        <select v-model="form.Empleado" class="input" required>
          <option value="">Seleccionar Empleado</option>
          <option v-for="e in empleados" :key="e" :value="e">{{ e }}</option>
        </select>
        <input v-model="form.Contrasena" type="password" placeholder="Contraseña" class="input" :required="!props.usuario" />
        <select v-model="form.Rol" class="input">
          <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
        </select>
        <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
          <input type="checkbox" v-model="form.Activo" />
          Usuario activo
        </label>

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
