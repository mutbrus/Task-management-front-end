<script setup>
import { ref, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useUiStore } from '@/stores/ui'
import Avatar from '@/components/ui/Avatar.vue'
import InviteModal from '@/components/modals/InviteModal.vue'
const users = useUsersStore(); const ui = useUiStore()
const showInvite = ref(false)
onMounted(() => users.fetch())
const onInvite = async ({ email }) => { await users.invite(email); ui.toast('Invitation sent'); showInvite.value = false }
const roleColor = (r) => ({ Admin:'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300', Member:'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300', Viewer:'bg-slate-100 text-slate-700 dark:bg-slate-700/40' }[r])
</script>
<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div><h1 class="text-2xl font-bold">Team</h1><p class="text-sm text-slate-500">{{ users.items.length }} members</p></div>
      <button class="btn-primary" @click="showInvite = true">+ Invite member</button>
    </div>
    <div class="card overflow-hidden">
      <table class="w-full text-sm">
        <thead class="text-left text-xs uppercase text-slate-500 bg-slate-50 dark:bg-slate-800/50">
          <tr><th class="px-4 py-3">Member</th><th class="px-4 py-3">Email</th><th class="px-4 py-3">Role</th><th class="px-4 py-3"></th></tr>
        </thead>
        <tbody>
          <tr v-for="u in users.items" :key="u.id" class="border-t border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30">
            <td class="px-4 py-3"><div class="flex items-center gap-3"><Avatar :name="u.name" /> <div><div class="font-medium">{{ u.name }}</div><div class="text-xs text-slate-500">@{{ u.name.toLowerCase().replace(' ','') }}</div></div></div></td>
            <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ u.email }}</td>
            <td class="px-4 py-3"><span :class="['badge', roleColor(u.role)]">{{ u.role }}</span></td>
            <td class="px-4 py-3 text-right"><button class="btn-secondary !py-1 !px-2 text-xs">Manage</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <InviteModal :open="showInvite" @close="showInvite=false" @invite="onInvite" />
  </div>
</template>
