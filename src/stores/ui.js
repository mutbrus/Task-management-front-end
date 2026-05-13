import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    theme: 'light',
    sidebarOpen: false,
    sidebarCollapsed: false,
    toasts: [],
    globalSearch: '',
    taskViewMode: 'list'
  }),
  actions: {
    initTheme() {
      const saved = localStorage.getItem('tf_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      this.setTheme(saved)
    },
    setTheme(t) {
      this.theme = t
      localStorage.setItem('tf_theme', t)
      document.documentElement.classList.toggle('dark', t === 'dark')
    },
    toggleTheme() { this.setTheme(this.theme === 'dark' ? 'light' : 'dark') },
    toggleSidebar() { this.sidebarOpen = !this.sidebarOpen },
    closeSidebar() { this.sidebarOpen = false },
    toggleSidebarCollapsed() { this.sidebarCollapsed = !this.sidebarCollapsed },
    setTaskViewMode(mode) { this.taskViewMode = mode },
    toast(message, type='success') {
      const id = Date.now() + Math.random()
      this.toasts.push({ id, message, type })
      setTimeout(()=> this.toasts = this.toasts.filter(t=>t.id!==id), 3200)
    },
  }
})
