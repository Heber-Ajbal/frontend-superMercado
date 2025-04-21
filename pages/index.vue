<script setup lang="ts">
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import Page from '~/components/Page.vue'
import { faUsers, faBox, faCashRegister, faShoppingCart, faWarehouse, faUserTie,faUserShield } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const modules = [
  { label: 'Clientes', icon: faUsers, to: '/clientes' },
  { label: 'Empleados', icon: faUserTie, to: '/empleados' },
  { label: 'Productos', icon: faBox, to: '/productos' },
  { label: 'Ventas', icon: faCashRegister, to: '/ventas' },
  { label: 'Compras', icon: faShoppingCart, to: '/compras' },
  { label: 'Inventario', icon: faWarehouse, to: '/inventario' },
  { label: 'Usuarios', icon: faUserShield, to: '/usuarios' },
]
</script>

<template>
  <div>
    <Page>
      <template #header>
        <Breadcrumb />
      </template>

      <section class="bg-white dark:bg-gray-900">
        <div class="mx-auto max-w-screen-xl px-4 py-2 lg:py-4">
          <div
            class="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-8 dark:border-gray-700 dark:bg-gray-800 md:p-12"
          >
            <h1
              class="mb-2 text-center text-xl font-extrabold text-gray-800 dark:text-white md:text-4xl"
            >
              Sistema de Gestión - Supermercado
            </h1>
            <p class="text-center text-gray-500 dark:text-gray-300">
              Bienvenido, seleccione un módulo para continuar
            </p>
          </div>

          <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <NuxtLink
              v-for="item in modules"
              :key="item.label"
              :to="item.to"
              class="flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-6 py-4 text-xl font-medium text-gray-700 shadow hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              <FontAwesomeIcon :icon="item.icon" />
              {{ item.label }}
            </NuxtLink>
          </div>
        </div>
      </section>
    </Page>
  </div>
</template>
