<script setup>
const props = defineProps({ name: String, size: { type: String, default: 'md' } })
const sizes = { xs:'h-6 w-6 text-[10px]', sm:'h-7 w-7 text-xs', md:'h-9 w-9 text-sm', lg:'h-12 w-12 text-base' }
const colors = ['bg-brand-500','bg-emerald-500','bg-amber-500','bg-purple-500','bg-pink-500','bg-sky-500','bg-rose-500']
const initials = (props.name||'?').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()
const color = colors[(props.name?.charCodeAt(0)||0) % colors.length]
</script>
<template>
  <span :class="['inline-flex items-center justify-center rounded-full text-white font-semibold ring-2 ring-white dark:ring-slate-900', sizes[size], color]">{{ initials }}</span>
</template>
