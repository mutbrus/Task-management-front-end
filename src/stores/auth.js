import { defineStore } from 'pinia'
import { authService } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null, token: localStorage.getItem('tf_token') || null, loading: false, error: null }),
  getters: { isAuthenticated: (s) => !!s.token },
  actions: {
    async login(email, password) {
      this.loading = true; this.error = null
      try { const { token, user } = await authService.login(email, password); this.token = token; this.user = user; localStorage.setItem('tf_token', token); return true }
      catch (e) { this.error = e.response?.data?.message || 'Login failed'; return false }
      finally { this.loading = false }
    },
    async register(payload) {
      this.loading = true; this.error = null
      try { const { token, user } = await authService.register(payload); this.token = token; this.user = user; localStorage.setItem('tf_token', token); return true }
      catch (e) { this.error = e.response?.data?.message || 'Registration failed'; return false }
      finally { this.loading = false }
    },
    async forgot(email) { return authService.forgotPassword(email) },
    async fetchMe() { if (!this.token) return; try { this.user = await authService.me() } catch {} },
    logout() { this.user = null; this.token = null; localStorage.removeItem('tf_token') },
  },
})
