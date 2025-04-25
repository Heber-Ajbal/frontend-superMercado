<script setup lang="ts">
import Page from '~/components/Page.vue'
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import Table from '~/components/ui/Table.vue'
import CategoriaForm from '~/components/categorias/CategoriaForm.vue'
import { ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import GetCategorias from '~/api/categorias/getCategorias.gql'

const showModal = ref(false)
const categoriaSeleccionada = ref(null)
const categorias = ref([])

const { result, refetch } = useQuery(GetCategorias)

const breadcrumb = [
  { route: '/categorias', parameters: [], text: 'Categorías' }
]

watch(result, () => {
  if (result.value?.categorias) {
    categorias.value = result.value.categorias
  }
}, { immediate: true })

function agregarCategoria() {
  categoriaSeleccionada.value = null
  showModal.value = true
}

function editarCategoria(categoria: any) {
  categoriaSeleccionada.value = { ...categoria }
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
      <h2 class="text-2xl font-semibold">Categorías</h2>
      <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" @click="agregarCategoria">
        Agregar Categoría
      </button>
    </div>

    <Table
      :columns="['Nombre', 'Descripción', 'Acciones']"
      :rows="categorias.map(c => [
        c.nombre,
        c.descripcion,
        { type: 'button', label: 'Editar', action: () => editarCategoria(c) }
      ])"
    />

    <CategoriaForm v-if="showModal" :categoria="categoriaSeleccionada" @close="cerrarModal" />
  </Page>
</template>
