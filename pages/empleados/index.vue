<script setup lang="ts">
import Page from '~/components/Page.vue'
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import Table from '~/components/ui/Table.vue'
import EmpleadoForm from '~/components/empleados/EmpleadoForm.vue'
import { ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import GetEmpleados from '~/api/empleados/getEmpleados.gql'

const showModal = ref(false)
const empleadoSeleccionado = ref(null)
const empleados = ref([])

const { result, refetch } = useQuery(GetEmpleados)

watch(result, (value) => {
  if (value?.empleados) {
    empleados.value = value.empleados
  }
}, { immediate: true })

function handleClose() {
  showModal.value = false
  refetch().then(({ data }) => {
    empleados.value = data?.empleados ?? []
  })
}

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
        e.nombre ?? '',
        `${e.apellidoPaterno ?? ''} ${e.apellidoMaterno ?? ''}`,
        `$${e.sueldo?.toFixed(2) ?? '0.00'}`,
        e.turno ?? '',
        e.cargo ?? '',
        { type: 'button', label: 'Editar', action: () => editarEmpleado(e) }
      ])"
    />

    <EmpleadoForm v-if="showModal" :empleado="empleadoSeleccionado" @close="handleClose" />
  </Page>
</template>
