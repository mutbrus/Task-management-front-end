<script setup>
import { RouterView } from 'vue-router'
</script>
<template>
  <div class="min-h-screen grid lg:grid-cols-2">
    <div class="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-brand-800 text-white">
      <div class="absolute inset-0 opacity-20" style="background-image:radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 70%, white 1px, transparent 1px); background-size: 40px 40px;"></div>
      <div class="relative z-10 p-12 flex flex-col justify-between w-full">
        <div class="flex items-center gap-2 text-xl font-bold">
          <div class="h-9 w-9 rounded-lg bg-white/20 backdrop-blur grid place-items-center">✓</div>
          TaskFlow
        </div>
        <div>
          <h1 class="text-4xl font-extrabold leading-tight">Plan, track, and ship work — together.</h1>
          <p class="mt-4 text-white/80 max-w-md">A clean, fast workspace for teams to manage projects, tasks, and timelines.</p>
          <div class="mt-8 grid grid-cols-3 gap-4">
            <div class="rounded-xl bg-white/10 p-4 backdrop-blur"><div class="text-2xl font-bold">12k+</div><div class="text-xs text-white/70">Teams</div></div>
            <div class="rounded-xl bg-white/10 p-4 backdrop-blur"><div class="text-2xl font-bold">99.9%</div><div class="text-xs text-white/70">Uptime</div></div>
            <div class="rounded-xl bg-white/10 p-4 backdrop-blur"><div class="text-2xl font-bold">4.9★</div><div class="text-xs text-white/70">Rated</div></div>
          </div>
        </div>
        <div class="text-sm text-white/70">© {{ new Date().getFullYear() }} TaskFlow. All rights reserved.</div>
      </div>
    </div>
    <div class="flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-slate-950">
      <div class="w-full max-w-md">
        <RouterView />
      </div>
    </div>
  </div>
</template>
