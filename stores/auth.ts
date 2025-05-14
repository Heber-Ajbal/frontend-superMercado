// stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | { username: string; rol: string },
    token: '' as string
  }),
  actions: {
    login(username: string, rol: string, token: string) {
      this.user = { username, rol }
      this.token = token
    },
    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('token') // Limpiamos token guardado manualmente

      // Redirigimos al login
      if (process.client) {
        navigateTo('/login')
      }
    }
  },
  persist: true
})
