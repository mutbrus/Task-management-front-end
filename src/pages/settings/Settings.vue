<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import Avatar from '@/components/ui/Avatar.vue'
const auth = useAuthStore(); const ui = useUiStore()
const tab = ref('profile')
const profile = ref({ name: auth.user?.name || 'Alex Morgan', email: auth.user?.email || 'alex@taskflow.app', bio: 'Product designer focused on clarity and craft.' })
const pwd = ref({ current:'', next:'', confirm:'' })
const save = () => { auth.user = { ...auth.user, ...profile.value }; ui.toast('Profile updated') }
const savePwd = () => { if(pwd.value.next !== pwd.value.confirm) return ui.toast('Passwords do not match','error'); ui.toast('Password updated'); pwd.value = { current:'', next:'', confirm:'' } }
</script>
<template>
  <div class="max-w-4xl space-y-6">
    <div><h1 class="text-2xl font-bold">Settings</h1><p class="text-sm text-slate-500">Manage your account preferences.</p></div>
    <div class="flex gap-2 border-b border-slate-200 dark:border-slate-800">
      <button v-for="t in ['profile','security','appearance']" :key="t" @click="tab=t" :class="['px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px', tab===t?'border-brand-500 text-brand-600':'border-transparent text-slate-500 hover:text-slate-700']">{{ t }}</button>
    </div>

    <div v-if="tab==='profile'" class="card p-6 space-y-5">
      <div class="flex items-center gap-4">
        <Avatar :name="profile.name" size="lg" />
        <div><button class="btn-secondary">Change photo</button><div class="text-xs text-slate-500 mt-1">PNG or JPG, up to 2MB</div></div>
      </div>
      <div class="grid sm:grid-cols-2 gap-4">
        <div><label class="label">Full name</label><input v-model="profile.name" class="input" /></div>
        <div><label class="label">Email</label><input v-model="profile.email" type="email" class="input" /></div>
      </div>
      <div><label class="label">Bio</label><textarea v-model="profile.bio" rows="3" class="input"></textarea></div>
      <div class="flex justify-end"><button class="btn-primary" @click="save">Save changes</button></div>
    </div>

    <div v-else-if="tab==='security'" class="card p-6 space-y-4 max-w-md">
      <h2 class="font-semibold">Change password</h2>
      <div><label class="label">Current password</label><input v-model="pwd.current" type="password" class="input" /></div>
      <div><label class="label">New password</label><input v-model="pwd.next" type="password" class="input" /></div>
      <div><label class="label">Confirm new password</label><input v-model="pwd.confirm" type="password" class="input" /></div>
      <div class="flex justify-end"><button class="btn-primary" @click="savePwd">Update password</button></div>
    </div>

    <div v-else class="card p-6 space-y-4">
      <h2 class="font-semibold">Theme</h2>
      <p class="text-sm text-slate-500">Choose how TaskFlow looks to you.</p>
      <div class="grid grid-cols-2 gap-4 max-w-md">
        <button @click="ui.setTheme('light')" :class="['rounded-xl border-2 p-4 text-left transition', ui.theme==='light'?'border-brand-500':'border-slate-200 dark:border-slate-800 hover:border-slate-300']">
          <div class="h-16 rounded-md bg-gradient-to-br from-slate-50 to-slate-200 mb-2 border border-slate-200"></div>
          <div class="font-medium text-sm">Light</div>
        </button>
        <button @click="ui.setTheme('dark')" :class="['rounded-xl border-2 p-4 text-left transition', ui.theme==='dark'?'border-brand-500':'border-slate-200 dark:border-slate-800 hover:border-slate-300']">
          <div class="h-16 rounded-md bg-gradient-to-br from-slate-800 to-slate-950 mb-2 border border-slate-700"></div>
          <div class="font-medium text-sm">Dark</div>
        </button>
      </div>
    </div>
  </div>
</template>
