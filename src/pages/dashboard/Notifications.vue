<script setup>
import { onMounted } from 'vue'
import { useNotificationsStore } from '@/stores/notifications'
import EmptyState from '@/components/ui/EmptyState.vue'
const notif = useNotificationsStore()
onMounted(() => notif.fetch())
</script>
<template>
  <div class="space-y-6 max-w-3xl">
    <div class="flex items-center justify-between">
      <div><h1 class="text-2xl font-bold">Notifications</h1><p class="text-sm text-slate-500">{{ notif.unreadCount }} unread</p></div>
      <button class="btn-secondary" @click="notif.markAllRead()">Mark all read</button>
    </div>
    <div class="card divide-y divide-slate-200 dark:divide-slate-800">
      <EmptyState v-if="!notif.items.length" title="No notifications" description="You're all caught up." icon="🔔" />
      <div v-for="n in notif.items" :key="n.id" :class="['flex items-start gap-3 p-4', !n.read && 'bg-brand-50/40 dark:bg-brand-500/5']">
        <div :class="['h-2 w-2 rounded-full mt-2', n.read?'bg-slate-300':'bg-brand-500']"></div>
        <div class="flex-1">
          <div class="text-sm">{{ n.text }}</div>
          <div class="text-xs text-slate-500 mt-0.5">{{ n.at }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
