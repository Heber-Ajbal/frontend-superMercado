<script setup lang="ts">
import Page from '~/components/Page.vue'
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import UsuarioForm from '~/components/usuarios/UsuarioForm.vue'
import Table from '~/components/ui/Table.vue'
import { ref } from 'vue'

const showModal = ref(false)
const usuarioSeleccionado = ref(null)

const usuarios = ref([
  {
    idUsuario: 1,
    NombreUsuario: 'cramirez',
    Empleado: 'Carlos Ramírez',
    Rol: 'Cajero',
    Activo: true,
  },
  {
    idUsuario: 2,
    NombreUsuario: 'amorales',
    Empleado: 'Ana Morales',
    Rol: 'Supervisor',
    Activo: false,
  }
])

function agregarUsuario() {
  usuarioSeleccionado.value = null
  showModal.value = true
}

function editarUsuario(usuario: any) {
  usuarioSeleccionado.value = { ...usuario }
  showModal.value = true
}
</script>

<template>
  <Page>
    <template #header>
      <Breadcrumb :items="['Usuarios']" />
    </template>

    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">Gestión de Usuarios</h2>
      <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" @click="agregarUsuario">
        Agregar Usuario
      </button>
    </div>

    <!-- Tabla de usuarios -->
    <Table
      :columns="['Usuario', 'Empleado', 'Rol', 'Estado', 'Acciones']"
      :rows="usuarios.map(u => [
        '@' + u.NombreUsuario,
        u.Empleado,
        u.Rol,
        u.Activo ? 'Activo' : 'Inactivo',
        { type: 'button', label: 'Editar', action: () => editarUsuario(u) }
      ])"
    />

    <UsuarioForm v-if="showModal" :usuario="usuarioSeleccionado" @close="showModal = false" />
  </Page>
</template>
