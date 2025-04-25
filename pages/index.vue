<script setup lang="ts">
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import Page from '~/components/Page.vue'
import { faUsers, faBox, faCashRegister, faShoppingCart, faWarehouse, faUserTie, faUserShield, faTruck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const modules = [
  { label: 'Clientes', icon: faUsers, to: '/clientes', colorClass: 'text-blue-700' },
  { label: 'Empleados', icon: faUserTie, to: '/empleados', colorClass: 'text-emerald-600' },
  { label: 'Productos', icon: faBox, to: '/productos', colorClass: 'text-orange-600' },
  { label: 'Ventas', icon: faCashRegister, to: '/ventas', colorClass: 'text-red-600' },
  { label: 'Compras', icon: faShoppingCart, to: '/compras', colorClass: 'text-fuchsia-600' },
  { label: 'Inventario', icon: faWarehouse, to: '/inventario', colorClass: 'text-indigo-700' },
  { label: 'Usuarios', icon: faUserShield, to: '/usuarios', colorClass: 'text-pink-600' },
  { label: 'Proveedores', icon: faTruck, to: '/proveedores', colorClass: 'text-teal-600' },
  { label: 'Categorías', icon: faBox, to: '/categorias', colorClass: 'text-yellow-600' } 
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
              SISTEMA DE SUPERMARKET E.H.N
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
              class="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 py-5 text-center font-semibold text-gray-700 shadow-md transition-all hover:scale-105 hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            >
              <!-- Ícono mantiene su color original, solo cambia a blanco en hover -->
              <FontAwesomeIcon :icon="item.icon" :class="['text-4xl', item.colorClass, 'transition-colors duration-300 group-hover:text-white']" />
              <span class="text-lg tracking-wide group-hover:underline">{{ item.label }}</span>
            </NuxtLink>
          </div>
        </div>
      </section>
    </Page>
  </div>
</template>

<style scoped>

</style>

