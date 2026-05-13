<script setup>
import { computed, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import Sidebar from '@/components/layout/Sidebar.vue'
import Topbar from '@/components/layout/Topbar.vue'
import { useUiStore } from '@/stores/ui'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import { useNotificationsStore } from '@/stores/notifications'

const ui = useUiStore()
const layoutOffset = computed(() => ui.sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72')

onMounted(async () => {
  await useAuthStore().fetchMe()
  useUsersStore().fetch()
  useNotificationsStore().fetch()
})
</script>

<template>
  <div class="min-h-screen bg-[#f7f6fb] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <Sidebar />
    <div v-if="ui.sidebarOpen" class="fixed inset-0 bg-slate-950/50 z-30 lg:hidden" @click="ui.closeSidebar()"></div>
    <div :class="['min-h-screen flex flex-col transition-all duration-300', layoutOffset]">
      <Topbar />
      <main class="flex-1 p-3 sm:p-5 lg:p-7">
        <RouterView />
      </main>
    </div>
  </div>
</template>
