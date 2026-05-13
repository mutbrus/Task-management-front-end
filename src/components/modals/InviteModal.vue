<script setup>
import { ref } from 'vue'
import Modal from '@/components/ui/Modal.vue'
defineProps({ open: Boolean })
const emit = defineEmits(['close','invite'])
const email = ref(''); const role = ref('Member')
</script>
<template>
  <Modal :open="open" title="Invite team member" @close="emit('close')">
    <div class="space-y-4">
      <div><label class="label">Email address</label><input v-model="email" type="email" class="input" placeholder="teammate@company.com" /></div>
      <div><label class="label">Role</label>
        <select v-model="role" class="input"><option>Admin</option><option>Member</option><option>Viewer</option></select>
      </div>
    </div>
    <template #footer>
      <button class="btn-secondary" @click="emit('close')">Cancel</button>
      <button class="btn-primary" :disabled="!email" @click="emit('invite', { email, role })">Send invite</button>
    </template>
  </Modal>
</template>
