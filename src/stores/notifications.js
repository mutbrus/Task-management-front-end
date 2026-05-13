import { defineStore } from 'pinia'
import { notificationsService } from '@/services/notifications.service'
export const useNotificationsStore = defineStore('notifications', {
  state: () => ({ items: [], loading: false }),
  getters: { unreadCount: (s) => s.items.filter(n=>!n.read).length },
  actions: {
    async fetch(){ this.loading=true; try{ this.items = await notificationsService.list() } finally{ this.loading=false } },
    async markAllRead(){ this.items = await notificationsService.markAllRead() },
  }
})
