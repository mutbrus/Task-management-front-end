<script setup>
defineProps({ title: String, description: String, icon: { type: String, default: '📋' } })
</script>
<template>
  <div class="flex flex-col items-center justify-center text-center py-16 px-6">
    <div class="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl mb-4">{{ icon }}</div>
    <h3 class="text-base font-semibold">{{ title }}</h3>
    <p v-if="description" class="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">{{ description }}</p>
    <slot />
  </div>
</template>
