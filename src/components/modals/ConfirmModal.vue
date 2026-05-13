<script setup>
import Modal from '@/components/ui/Modal.vue'
defineProps({ open: Boolean, title: { type:String, default:'Are you sure?' }, message: String, confirmText: { type:String, default:'Delete' } })
const emit = defineEmits(['close','confirm'])
</script>
<template>
  <Modal :open="open" :title="title" size="sm" @close="emit('close')">
    <p class="text-sm text-slate-600 dark:text-slate-400">{{ message }}</p>
    <template #footer>
      <button class="btn-secondary" @click="emit('close')">Cancel</button>
      <button class="btn-danger" @click="emit('confirm')">{{ confirmText }}</button>
    </template>
  </Modal>
</template>
