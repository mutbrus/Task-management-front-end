<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
const email = ref(''); const sent = ref(false); const loading = ref(false)
const auth = useAuthStore(); const ui = useUiStore()
const submit = async () => { loading.value = true; await auth.forgot(email.value); loading.value = false; sent.value = true; ui.toast('Reset link sent') }
</script>
<template>
  <div>
    <h2 class="text-2xl font-bold">Reset password</h2>
    <p class="text-sm text-slate-500 mt-1">Enter your email and we'll send you a reset link.</p>
    <div v-if="sent" class="mt-8 card p-4 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-sm">
      Check your inbox at <strong>{{ email }}</strong> for instructions.
    </div>
    <form v-else @submit.prevent="submit" class="mt-8 space-y-4">
      <div><label class="label">Email</label><input v-model="email" type="email" required class="input" placeholder="you@company.com" /></div>
      <button class="btn-primary w-full" :disabled="loading">{{ loading ? 'Sending...' : 'Send reset link' }}</button>
    </form>
    <p class="text-sm text-slate-500 mt-6 text-center"><RouterLink to="/auth/login" class="text-brand-600 font-medium hover:underline">Back to sign in</RouterLink></p>
  </div>
</template>
