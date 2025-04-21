// stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | { username: string; rol: string }
  }),

  actions: {
    login(username: string, rol: string) {
      this.user = { username, rol }
    },
    logout() {
      this.user = null
    }
  },

  persist: true // mantiene sesión entre recargas si usas pinia-plugin-persistedstate
})
