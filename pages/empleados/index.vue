<script setup lang="ts">
import Page from '~/components/Page.vue'
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import Table from '~/components/ui/Table.vue'
import EmpleadoForm from '~/components/empleados/EmpleadoForm.vue'
import { ref } from 'vue'

const empleados = ref([
  { idEmpleado: 1, Nombre: 'Carlos', Apellido_Paterno: 'Ramírez', Apellido_Materno: 'García', Sueldo: 5000, Turno: 'Mañana', Cargo: 'Cajero' },
  { idEmpleado: 2, Nombre: 'Ana', Apellido_Paterno: 'Morales', Apellido_Materno: 'López', Sueldo: 6000, Turno: 'Tarde', Cargo: 'Supervisor' },
])

const showModal = ref(false)
const empleadoSeleccionado = ref(null)

function agregarEmpleado() {
  empleadoSeleccionado.value = null
  showModal.value = true
}

function editarEmpleado(empleado: any) {
  empleadoSeleccionado.value = { ...empleado }
  showModal.value = true
}
</script>

<template>
  <Page>
    <template #header>
      <Breadcrumb :items="['Empleados']" />
    </template>

    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Empleados</h2>
      <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" @click="agregarEmpleado">
        Agregar Empleado
      </button>
    </div>

    <Table
      :columns="['Nombre', 'Apellidos', 'Sueldo', 'Turno', 'Cargo', 'Acciones']"
      :rows="empleados.map(e => [
        e.Nombre,
        `${e.Apellido_Paterno} ${e.Apellido_Materno}`,
        `$${e.Sueldo.toFixed(2)}`,
        e.Turno,
        e.Cargo,
        { type: 'button', label: 'Editar', action: () => editarEmpleado(e) }
      ])"
    />

    <EmpleadoForm v-if="showModal" :empleado="empleadoSeleccionado" @close="showModal = false" />
  </Page>
</template>
