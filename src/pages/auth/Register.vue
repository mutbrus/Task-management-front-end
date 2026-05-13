<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
const name = ref(''); const email = ref(''); const password = ref('')
const auth = useAuthStore(); const router = useRouter(); const ui = useUiStore()
const submit = async () => {
  const ok = await auth.register({ name: name.value, email: email.value, password: password.value })
  if (ok) { ui.toast('Account created!'); router.push('/dashboard') }
  else ui.toast(auth.error || 'Registration failed', 'error')
}
</script>
<template>
  <div>
    <h2 class="text-2xl font-bold">Create your account</h2>
    <p class="text-sm text-slate-500 mt-1">Start managing projects in minutes.</p>
    <form @submit.prevent="submit" class="mt-8 space-y-4">
      <div><label class="label">Full name</label><input v-model="name" required class="input" placeholder="Alex Morgan" /></div>
      <div><label class="label">Email</label><input v-model="email" type="email" required class="input" placeholder="you@company.com" /></div>
      <div><label class="label">Password</label><input v-model="password" type="password" required minlength="6" class="input" placeholder="At least 6 characters" /></div>
      <button class="btn-primary w-full" :disabled="auth.loading">{{ auth.loading ? 'Creating...' : 'Create account' }}</button>
    </form>
    <p class="text-sm text-slate-500 mt-6 text-center">Already have an account? <RouterLink to="/auth/login" class="text-brand-600 font-medium hover:underline">Sign in</RouterLink></p>
  </div>
</template>
