import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()

  // Permitir acceso libre al login
  if (to.path === '/login') return

  // Si no está autenticado, redirigir
  if (!auth.user) {
    return navigateTo('/login')
  }
})
