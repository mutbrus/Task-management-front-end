<script setup>
import { useUiStore } from '@/stores/ui'
const ui = useUiStore()
const styles = { success:'bg-emerald-600', error:'bg-red-600', info:'bg-slate-800' }
</script>
<template>
  <div class="fixed top-4 right-4 z-[100] space-y-2">
    <TransitionGroup enter-active-class="transition" enter-from-class="opacity-0 translate-x-4" leave-active-class="transition" leave-to-class="opacity-0 translate-x-4">
      <div v-for="t in ui.toasts" :key="t.id" :class="['text-white text-sm px-4 py-2.5 rounded-lg shadow-soft', styles[t.type]||styles.info]">{{ t.message }}</div>
    </TransitionGroup>
  </div>
</template>
