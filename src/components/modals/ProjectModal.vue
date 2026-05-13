<script setup>
import { ref, watch } from 'vue'
import Modal from '@/components/ui/Modal.vue'
const props = defineProps({
  open: Boolean,
  project: Object,
  saving: Boolean
})
const emit = defineEmits(['close','save'])
const colors = ['bg-brand-500','bg-emerald-500','bg-amber-500','bg-purple-500','bg-pink-500','bg-sky-500']
const form = ref({ name:'', description:'', color:'bg-brand-500', status:'Planning' })
watch(() => props.open, (v) => { if(v) form.value = props.project ? {...props.project} : { name:'', description:'', color:'bg-brand-500', status:'Planning' } })
</script>
<template>
  <Modal :open="open" :title="project ? 'Edit project' : 'Create project'" @close="emit('close')">
    <div class="space-y-4">
      <div><label class="label">Project name</label><input v-model="form.name" class="input" placeholder="e.g. Website Redesign" /></div>
      <div><label class="label">Description</label><textarea v-model="form.description" rows="3" class="input" placeholder="What's this project about?"></textarea></div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="label">Status</label>
          <select v-model="form.status" class="input"><option>Planning</option><option>In Progress</option><option>Done</option></select>
        </div>
        <div><label class="label">Color</label>
          <div class="flex gap-2 pt-2">
            <button v-for="c in colors" :key="c" type="button" @click="form.color=c" :class="['h-7 w-7 rounded-full transition', c, form.color===c && 'ring-2 ring-offset-2 ring-brand-500 dark:ring-offset-slate-900']"></button>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <button class="btn-secondary" @click="emit('close')">Cancel</button>
<button
  class="btn-primary"
  :disabled="!form.name || saving"
  @click="emit('save', form)"
>
  {{ saving ? 'Saving...' : (project ? 'Save changes' : 'Create project') }}
</button>
</template>
  </Modal>
</template>
