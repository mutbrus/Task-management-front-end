<script setup>
import { computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import Avatar from '@/components/ui/Avatar.vue'
import Dropdown from '@/components/ui/Dropdown.vue'
const ui = useUiStore(); const auth = useAuthStore(); const notif = useNotificationsStore(); const router = useRouter(); const route = useRoute()
const logout = () => { auth.logout(); router.push('/auth/login') }
const pageTitle = computed(() => route.meta?.title || route.name || 'Workspace')
const viewModes = [
  { key: 'list', label: 'List', to: '/tasks' },
  { key: 'board', label: 'Board', to: '/board' },
  { key: 'calendar', label: 'Calendar', to: '/calendar' },
]
const switchView = (item) => { ui.setTaskViewMode(item.key); router.push(item.to) }
</script>

<template>
  <header class="sticky top-0 z-20 min-h-16 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center px-4 sm:px-6 gap-3">
    <button class="lg:hidden btn-ghost !p-2" @click="ui.toggleSidebar()" aria-label="Open menu">
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
    </button>

    <div class="min-w-0">
      <div class="text-xs font-semibold uppercase tracking-wide text-violet-500">{{ pageTitle }}</div>
      <div class="hidden sm:block text-sm text-slate-500">Plan, track, and ship tasks faster.</div>
    </div>

    <div class="flex-1 max-w-2xl relative order-last w-full sm:order-none sm:w-auto">
      <svg class="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      <input v-model="ui.globalSearch" class="input pl-9 !rounded-2xl" placeholder="Search tasks, projects, people..." />
    </div>

    <div class="hidden md:flex items-center rounded-2xl bg-slate-100 dark:bg-slate-900 p-1">
      <button v-for="item in viewModes" :key="item.key" @click="switchView(item)" :class="['px-3 py-1.5 rounded-xl text-xs font-bold transition', ui.taskViewMode === item.key ? 'bg-white dark:bg-slate-800 text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white']">{{ item.label }}</button>
    </div>

    <div class="ml-auto flex items-center gap-1">
      <button class="btn-ghost !p-2" @click="ui.toggleTheme()" aria-label="Toggle theme">
        <svg v-if="ui.theme==='dark'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
        <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>
      </button>
      <Dropdown>
        <template #trigger>
          <button class="btn-ghost !p-2 relative" aria-label="Notifications">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 11-6 0"/></svg>
            <span v-if="notif.unreadCount" class="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-fuchsia-500 ring-2 ring-white dark:ring-slate-950"></span>
          </button>
        </template>
        <template #default="{ close }">
          <div class="px-3 py-2 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            <div class="text-sm font-semibold">Notifications</div>
            <button class="text-xs text-violet-600 hover:underline" @click="notif.markAllRead()">Mark all read</button>
          </div>
          <div class="max-h-80 overflow-auto scrollbar-thin">
            <div v-if="!notif.items.length" class="p-4 text-sm text-slate-500 text-center">You're all caught up</div>
            <div v-for="n in notif.items" :key="n.id" :class="['flex gap-3 px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer', !n.read && 'bg-violet-50/70 dark:bg-violet-500/5']">
              <div :class="['h-2 w-2 rounded-full mt-2 shrink-0', n.read?'bg-slate-300':'bg-violet-500']"></div>
              <div class="text-sm"><div>{{ n.text }}</div><div class="text-xs text-slate-500 mt-0.5">{{ n.at }}</div></div>
            </div>
          </div>
          <RouterLink to="/notifications" class="block text-center text-xs font-medium text-violet-600 py-2 border-t border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50" @click="close">View all</RouterLink>
        </template>
      </Dropdown>
      <Dropdown>
        <template #trigger>
          <button class="flex items-center gap-2 pl-1 pr-2 py-1 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800">
            <Avatar :name="auth.user?.name || 'Guest User'" size="sm" />
            <div class="hidden sm:block text-left"><div class="text-sm font-bold leading-tight">{{ auth.user?.name || 'Guest' }}</div><div class="text-xs text-slate-500">{{ auth.user?.email || '' }}</div></div>
          </button>
        </template>
        <template #default="{ close }">
          <RouterLink to="/settings" class="block px-3 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-800" @click="close">Profile & Settings</RouterLink>
          <button class="w-full text-left px-3 py-2 text-sm rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10" @click="logout">Log out</button>
        </template>
      </Dropdown>
    </div>
  </header>
</template>
