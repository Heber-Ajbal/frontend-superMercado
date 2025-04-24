<script setup lang="ts">
import Page from '~/components/Page.vue'
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import Table from '~/components/ui/Table.vue'
import ProveedorForm from '~/components/proveedores/ProveedorForm.vue'
import { ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import GetProveedores from '~/api/proveedores/getProveedores.gql'

const showModal = ref(false)
const proveedorSeleccionado = ref(null)

const { result, refetch } = useQuery(GetProveedores)

const proveedores = computed(() => result.value?.proveedores || [])

function abrirModal() {
  proveedorSeleccionado.value = null
  showModal.value = true
}
</script>

<template>
  <Page>
    <template #header>
      <Breadcrumb :items="['Proveedores']" />
    </template>

    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Proveedores</h2>
      <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" @click="abrirModal">
        Nuevo Proveedor
      </button>
    </div>

    <Table
      :columns="['Nombre', 'Ubicación', 'Teléfono']"
      :rows="proveedores.map(p => [p.nombre, p.ubicacion, p.telefono])"
    />

    <ProveedorForm v-if="showModal" :proveedor="proveedorSeleccionado" @close="showModal = false; refetch()" />
  </Page>
</template>
