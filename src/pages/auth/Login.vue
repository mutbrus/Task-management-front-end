<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
const email = ref('demo@taskflow.app'); const password = ref('demo1234'); const remember = ref(true)
const auth = useAuthStore(); const router = useRouter(); const route = useRoute(); const ui = useUiStore()
const submit = async () => {
  const ok = await auth.login(email.value, password.value)
  if (ok) { ui.toast('Welcome to task management '); router.push(route.query.redirect || '/dashboard') }
  else ui.toast(auth.error || 'Login failed', 'error')
}
</script>
<template>
  <div>
    <h2 class="text-2xl font-bold">Welcome back</h2>
    <p class="text-sm text-slate-500 mt-1">Sign in to your TaskFlow workspace.</p>
    <form @submit.prevent="submit" class="mt-8 space-y-4">
      <div><label class="label">Email</label><input v-model="email" type="email" required class="input" placeholder="you@company.com" /></div>
      <div><label class="label">Password</label><input v-model="password" type="password" required class="input" placeholder="••••••••" /></div>
      <div class="flex items-center justify-between text-sm">
        <label class="flex items-center gap-2"><input v-model="remember" type="checkbox" class="rounded border-slate-300" /> Remember me</label>
        <RouterLink to="/auth/forgot" class="text-brand-600 hover:underline">Forgot password?</RouterLink>
      </div>
      <button class="btn-primary w-full" :disabled="auth.loading">{{ auth.loading ? 'Signing in...' : 'Sign in' }}</button>
    </form>
    <p class="text-sm text-slate-500 mt-6 text-center">Don't have an account? <RouterLink to="/auth/register" class="text-brand-600 font-medium hover:underline">Create one</RouterLink></p>
  </div>
</template>
