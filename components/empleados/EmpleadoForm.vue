<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps<{ empleado: any | null }>()
const emit = defineEmits(['close'])

const form = ref({
  Nombre: '',
  Apellido_Paterno: '',
  Apellido_Materno: '',
  Sueldo: 0,
  Turno: 'Mañana',
  Cargo: 'Cajero',
})

watch(() => props.empleado, (nuevo) => {
  if (nuevo) {
    form.value = { ...nuevo }
  } else {
    form.value = {
      Nombre: '',
      Apellido_Paterno: '',
      Apellido_Materno: '',
      Sueldo: 0,
      Turno: 'Mañana',
      Cargo: 'Cajero',
    }
  }
}, { immediate: true })

function guardar() {
  // Aquí luego conectaremos a la API
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-xl dark:bg-gray-800">
      <h3 class="text-xl font-bold mb-4">{{ props.empleado ? 'Editar Empleado' : 'Agregar Empleado' }}</h3>

      <form @submit.prevent="guardar" class="grid gap-4">
        <input v-model="form.Nombre" placeholder="Nombre" class="input" />
        <input v-model="form.Apellido_Paterno" placeholder="Apellido Paterno" class="input" />
        <input v-model="form.Apellido_Materno" placeholder="Apellido Materno" class="input" />
        <input v-model.number="form.Sueldo" type="number" placeholder="Sueldo" class="input" />

        <select v-model="form.Turno" class="input">
          <option value="Mañana">Mañana</option>
          <option value="Tarde">Tarde</option>
          <option value="Noche">Noche</option>
        </select>

        <select v-model="form.Cargo" class="input">
          <option value="Cajero">Cajero</option>
          <option value="Encargado de Almacén">Encargado de Almacén</option>
          <option value="Supervisor">Supervisor</option>
        </select>

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
