<script setup lang="ts">
import Page from '~/components/Page.vue'
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import Table from '~/components/ui/Table.vue'
import ClienteForm from '~/components/clientes/ClienteForm.vue'
import { ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import GetClientes from '~/api/clientes/getClientes.gql'

const showModal = ref(false)
const clienteSeleccionado = ref(null)
const clientes = ref([])

const { result, refetch } = useQuery(GetClientes)


const breadcrumb = [
  {
    route: '/clientes',
    parameters: [],
    text: 'Clientes',
  }
]

watch(result, () => {
  if (result.value?.clientes) {
    clientes.value = result.value.clientes
  }
}, { immediate: true })

function agregarCliente() {
  clienteSeleccionado.value = null
  showModal.value = true
}

function editarCliente(cliente: any) {
  clienteSeleccionado.value = { ...cliente }
  showModal.value = true
}

function cerrarModal() {
  showModal.value = false
  refetch()
}
</script>

<template>
  <Page>
    <template #header>
                <Breadcrumb :paths="breadcrumb" />
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
        c.nombre,
        `${c.apellidoPaterno} ${c.apellidoMaterno}`,
        c.direccion,
        c.telefono,
        { type: 'button', label: 'Editar', action: () => editarCliente(c) }
      ])"
    />

    <ClienteForm v-if="showModal" :cliente="clienteSeleccionado" @close="cerrarModal" />
  </Page>
</template>
