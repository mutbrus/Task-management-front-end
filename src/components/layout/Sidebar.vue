<script setup>
import { RouterLink } from 'vue-router'
import { useUiStore } from '@/stores/ui'
const ui = useUiStore()
const items = [
  { to: '/dashboard', label: 'Home', icon: 'M3 12l9-9 9 9M5 10v10h14V10' },
  { to: '/tasks', label: 'My Tasks', icon: 'M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11' },
  { to: '/board', label: 'Board', icon: 'M4 6h4v14H4zM10 6h4v9h-4zM16 6h4v6h-4z' },
  { to: '/calendar', label: 'Calendar', icon: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z' },
  { to: '/projects', label: 'Projects', icon: 'M3 7h18M3 12h18M3 17h18' },
  { to: '/members', label: 'Assigned to me', icon: 'M17 21v-2a4 4 0 00-3-3.87M7 21v-2a4 4 0 013-3.87M12 7a4 4 0 100 8 4 4 0 000-8z' },
  { to: '/settings', label: 'Settings', icon: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z' },
]
</script>

<template>
  <aside :class="[
    'fixed inset-y-0 left-0 z-40 border-r border-white/10 bg-[#17112b] text-white shadow-2xl transform transition-all duration-300 lg:translate-x-0',
    ui.sidebarCollapsed ? 'w-20' : 'w-72',
    ui.sidebarOpen ? 'translate-x-0' : '-translate-x-full'
  ]">
    <div class="h-16 px-4 flex items-center gap-3 border-b border-white/10">
      <div class="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-400 via-fuchsia-500 to-indigo-500 grid place-items-center text-white font-black shadow-lg shadow-violet-900/30">T</div>
      <div v-if="!ui.sidebarCollapsed" class="min-w-0">
        <div class="font-black text-lg leading-tight">TaskManagement</div>
        <div class="text-[11px] text-violet-200/80">Task style workspace</div>
      </div>
      <button class="hidden lg:grid ml-auto h-8 w-8 place-items-center rounded-xl hover:bg-white/10" @click="ui.toggleSidebarCollapsed()" title="Collapse sidebar">
        <svg :class="['h-4 w-4 transition', ui.sidebarCollapsed && 'rotate-180']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
    </div>

    <div v-if="!ui.sidebarCollapsed" class="mx-4 mt-4 rounded-2xl bg-white/10 p-3 border border-white/10">
      <div class="text-xs text-violet-100/80">Workspace</div>
      <div class="font-semibold mt-1 truncate">Task Management System</div>
    </div>

    <nav class="p-3 space-y-1.5">
      <RouterLink v-for="i in items" :key="i.to" :to="i.to" @click="ui.closeSidebar()"
        :class="['group flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-semibold text-violet-100/80 hover:bg-white/10 hover:text-white transition', ui.sidebarCollapsed && 'justify-center']"
        active-class="!bg-white !text-[#6b3df4] shadow-lg shadow-violet-950/20">
        <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="i.icon"/></svg>
        <span v-if="!ui.sidebarCollapsed" class="truncate">{{ i.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>
