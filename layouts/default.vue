<script setup lang="ts">
import { ref } from 'vue'
import ApplicationMark from '@/components/ui/ApplicationMark.vue'
import Dropdown from '@/components/ui/Dropdown.vue'
import DropdownLink from '@/components/ui/DropdownLink.vue'
import NavLink from '@/components/ui/NavLink.vue'
import ResponsiveNavLink from '@/components/ui/ResponsiveNavLink.vue'
import DarkModeToggle from '~/components/ui/DarkModeToggle.vue'
import { useAuthStore } from '~/stores/auth'

const showingNavigationDropdown = ref(false)
const user = ''
const auth = useAuthStore()

function cerrarSesion() {
  auth.logout()
}
</script>

<template>
  <div>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav
        class="z-30 w-full border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
      >
        <!-- Primary Navigation Menu -->
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 justify-between">
            <div class="flex">
              <!-- Logo -->
              <div class="flex shrink-0 items-center">
                <NuxtLink href="/">
                  <ApplicationMark class="block h-9 w-auto" />
                </NuxtLink>
              </div>

              <!-- Navigation Links -->
              
            </div>

            <div class="hidden sm:ms-6 sm:flex sm:items-center gap-x-6">
            <DarkModeToggle />

            <button 
              @click="cerrarSesion"  class="text-sm text-gray-700 hover:underline dark:text-gray-300 dark:hover:text-white transition">
              Cerrar Sesión
            </button>
          </div>

          </div>
        </div>
      </nav>

      <!-- Page Content -->
      <slot />
    </div>
  </div>
</template>
