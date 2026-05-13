<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
const open = ref(false); const root = ref(null)
const close = (e) => { if (root.value && !root.value.contains(e.target)) open.value = false }
onMounted(() => document.addEventListener('click', close))
onUnmounted(() => document.removeEventListener('click', close))
</script>
<template>
  <div ref="root" class="relative">
    <div @click="open=!open"><slot name="trigger" :open="open" /></div>
    <Transition enter-active-class="transition" enter-from-class="opacity-0 scale-95" leave-active-class="transition" leave-to-class="opacity-0 scale-95">
      <div v-if="open" class="absolute right-0 mt-2 w-72 origin-top-right card p-1 z-40">
        <slot :close="()=>open=false" />
      </div>
    </Transition>
  </div>
</template>
