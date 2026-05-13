<script setup>
import { onMounted, onUnmounted } from 'vue'
const props = defineProps({ open: Boolean, title: String, size: { type: String, default: 'md' } })
const emit = defineEmits(['close'])
const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
const onKey = (e) => { if (e.key === 'Escape') emit('close') }
onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>
<template>
  <Transition enter-active-class="transition" enter-from-class="opacity-0" leave-active-class="transition" leave-to-class="opacity-0">
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="emit('close')"></div>
      <div :class="['relative w-full card p-0 overflow-hidden', sizes[size]]">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 class="text-base font-semibold">{{ title }}</h3>
          <button class="btn-ghost !p-1.5" @click="emit('close')" aria-label="Close">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="p-5"><slot /></div>
        <div v-if="$slots.footer" class="px-5 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2 bg-slate-50 dark:bg-slate-900/50"><slot name="footer" /></div>
      </div>
    </div>
  </Transition>
</template>
