<script setup>
defineProps({ variant: { type: String, default: '' } })
</script>
<template><span :class="['badge', variant || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300']"><slot /></span></template>
