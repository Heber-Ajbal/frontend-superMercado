<script setup lang="ts">
import Page from '~/components/Page.vue'
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import Table from '~/components/ui/Table.vue'
import ClienteForm from '~/components/clientes/ClienteForm.vue'
import { ref } from 'vue'

const clientes = ref([
  { idCliente: 1, Nombre: 'Juan', Apellido_Paterno: 'Pérez', Apellido_Materno: 'Gómez', Direccion: 'Av. Siempre Viva 123', Telefono: '555-1234' },
  { idCliente: 2, Nombre: 'María', Apellido_Paterno: 'López', Apellido_Materno: 'Martínez', Direccion: 'Calle Falsa 456', Telefono: '555-5678' },
])

const showModal = ref(false)
const clienteSeleccionado = ref(null)

function agregarCliente() {
  clienteSeleccionado.value = null
  showModal.value = true
}

function editarCliente(cliente: any) {
  clienteSeleccionado.value = { ...cliente }
  showModal.value = true
}
</script>

<template>
  <Page>
    <template #header>
      <Breadcrumb :items="['Clientes']" />
    </template>

    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Clientes</h2>
      <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" @click="agregarCliente">
        Agregar Cliente
      </button>
    </div>

    <Table
      :columns="['Nombre', 'Apellidos', 'Dirección', 'Teléfono', 'Acciones']"
      :rows="clientes.map(c => [
        c.Nombre,
        `${c.Apellido_Paterno} ${c.Apellido_Materno}`,
        c.Direccion,
        c.Telefono,
        { type: 'button', label: 'Editar', action: () => editarCliente(c) }
      ])"
    />

    <ClienteForm v-if="showModal" :cliente="clienteSeleccionado" @close="showModal = false" />
  </Page>
</template>
