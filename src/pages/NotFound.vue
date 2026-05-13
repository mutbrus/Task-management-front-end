<script setup>
import { RouterLink } from 'vue-router'
</script>
<template>
  <div class="min-h-screen grid place-items-center p-6">
    <div class="text-center">
      <div class="text-7xl font-extrabold text-brand-600">404</div>
      <h1 class="mt-2 text-2xl font-bold">Page not found</h1>
      <p class="text-slate-500 mt-2">The page you're looking for doesn't exist.</p>
      <RouterLink to="/dashboard" class="btn-primary mt-6 inline-flex">Go to dashboard</RouterLink>
    </div>
  </div>
</template>
