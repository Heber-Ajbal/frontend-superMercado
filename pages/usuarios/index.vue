<script setup lang="ts">
import Page from '~/components/Page.vue'
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import Table from '~/components/ui/Table.vue'
import UsuarioForm from '~/components/usuarios/UsuarioForm.vue'
import { ref } from 'vue'
import { useQuery, onResult } from '@vue/apollo-composable'
import GetUsuarios from '~/api/users/getUsers.gql'

const showModal = ref(false)
const usuarios = ref([])

const { result, refetch } = useQuery(GetUsuarios)

// ✅ Cargar usuarios cuando los datos estén disponibles
watch(result, (value) => {
  if (value?.usuarios) {
    usuarios.value = value.usuarios
  }
}, { immediate: true }) // 👈 esto es clave para que se dispare al inicio


// ✅ Cerrar modal y refrescar usuarios
function handleClose() {
  showModal.value = false
  refetch().then(({ data }) => {
    usuarios.value = data?.usuarios ?? []
  })
}

function abrirModal() {
  showModal.value = true
}
</script>

<template>
  <Page>
    <template #header>
      <Breadcrumb :items="['Usuarios']" />
    </template>

    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Lista de Usuarios</h2>
      <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" @click="abrirModal">
        Nuevo Usuario
      </button>
    </div>

    <Table
      :columns="['Usuario', 'Empleado', 'Rol', 'Activo']"
      :rows="usuarios.map(u => [
        u.nombreUsuario,
        `${u.idEmpleadoNavigation?.nombre ?? ''} ${u.idEmpleadoNavigation?.apellidoPaterno ?? ''}`,
        u.rol,
        u.activo ? 'Sí' : 'No'
      ])"
    />

    <UsuarioForm v-if="showModal" @close="handleClose" />
  </Page>
</template>
