<script setup lang="ts">
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import Page from '~/components/Page.vue'
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faBox,
  faCashRegister,
  faChartPie,
  faShoppingCart,
  faTruck,
  faUsers,
  faUserShield,
  faUserTie,
  faWarehouse
} from '@fortawesome/free-solid-svg-icons'
import { useAuthStore } from '~/stores/auth'
import { canAccessRoute, normalizeRole } from '~/utils/roleAccess'

const auth = useAuthStore()

const modules = [
  { label: 'Dashboard', icon: faChartPie, to: '/dashboard', colorClass: 'text-cyan-600', description: 'KPIs, tendencias y alertas del negocio.' },
  { label: 'Clientes', icon: faUsers, to: '/clientes', colorClass: 'text-blue-700', description: 'Consulta y administración de clientes.' },
  { label: 'Empleados', icon: faUserTie, to: '/empleados', colorClass: 'text-emerald-600', description: 'Gestión del personal operativo.' },
  { label: 'Productos', icon: faBox, to: '/productos', colorClass: 'text-orange-600', description: 'Catálogo, precios e imágenes.' },
  { label: 'Ventas', icon: faCashRegister, to: '/ventas', colorClass: 'text-red-600', description: 'Registro de ventas y facturación.' },
  { label: 'Compras', icon: faShoppingCart, to: '/compras', colorClass: 'text-fuchsia-600', description: 'Ingreso de compras y abastecimiento.' },
  { label: 'Inventario', icon: faWarehouse, to: '/inventario', colorClass: 'text-indigo-700', description: 'Stock, movimientos y bodegas.' },
  { label: 'Usuarios', icon: faUserShield, to: '/usuarios', colorClass: 'text-pink-600', description: 'Usuarios del sistema y roles.' },
  { label: 'Proveedores', icon: faTruck, to: '/proveedores', colorClass: 'text-teal-600', description: 'Administración de proveedores.' },
  { label: 'Categorías', icon: faBox, to: '/categorias', colorClass: 'text-yellow-600', description: 'Clasificación de productos.' }
]

const visibleModules = computed(() =>
  modules.filter(module => canAccessRoute(auth.user?.rol, module.to))
)

const currentRole = computed(() => normalizeRole(auth.user?.rol))
</script>

<template>
  <Page>
    <template #header>
      <Breadcrumb />
    </template>

    <section class="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-8 text-white shadow-xl dark:border-slate-700 md:px-10 md:py-10">
      <div class="grid gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
        <div>
          <p class="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-cyan-100">
            Centro de control
          </p>
          <h1 class="text-3xl font-black tracking-tight md:text-5xl">
            Sistema de Supermarket E.H.N
          </h1>
          <p class="mt-4 max-w-2xl text-sm text-slate-200 md:text-base">
            Elige el módulo con el que quieres trabajar. El acceso visible cambia según el rol con el que iniciaste sesión.
          </p>
        </div>

        <div class="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-300">Rol actual</p>
          <p class="mt-2 text-2xl font-bold">{{ currentRole }}</p>
          <p class="mt-3 text-sm text-slate-200">{{ visibleModules.length }} módulos disponibles para este perfil.</p>
        </div>
      </div>
    </section>

    <section class="mt-8">
      <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        <NuxtLink
          v-for="item in visibleModules"
          :key="item.label"
          :to="item.to"
          class="group flex min-h-[220px] flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-md transition-all hover:-translate-y-1 hover:shadow-xl hover:bg-gradient-to-br hover:from-slate-900 hover:via-blue-900 hover:to-cyan-700 dark:border-gray-700 dark:bg-gray-800"
        >
          <div>
            <FontAwesomeIcon
              :icon="item.icon"
              :class="['text-4xl transition-colors duration-300', item.colorClass, 'group-hover:text-white']"
            />
            <h2 class="mt-5 text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-white dark:text-white">
              {{ item.label }}
            </h2>
            <p class="mt-3 text-sm leading-6 text-gray-500 transition-colors duration-300 group-hover:text-cyan-100 dark:text-gray-300">
              {{ item.description }}
            </p>
          </div>

          <span class="mt-6 inline-flex items-center text-sm font-semibold text-blue-700 transition-colors duration-300 group-hover:text-white dark:text-blue-300">
            Abrir módulo
          </span>
        </NuxtLink>
      </div>
    </section>
  </Page>
</template>
