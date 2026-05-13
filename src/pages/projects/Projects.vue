<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { useUsersStore } from '@/stores/users'
import { useUiStore } from '@/stores/ui'
import { statusColor } from '@/utils/format'
import Avatar from '@/components/ui/Avatar.vue'
import Spinner from '@/components/ui/Spinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import ProjectModal from '@/components/modals/ProjectModal.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'

const projects = useProjectsStore(); const users = useUsersStore(); const ui = useUiStore()
const search = ref(''); const showCreate = ref(false); const editing = ref(null); const deleting = ref(null)
onMounted(() => projects.fetch())
const filtered = computed(() => projects.items.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase())))
const userName = (id) => users.items.find(u=>u.id===id)?.name || ''
const onSave = async (data) => {
  if (editing.value) { await projects.update(editing.value.id, data); ui.toast('Project updated') }
  else { await projects.create(data); ui.toast('Project created') }
  showCreate.value = false; editing.value = null
}
const onDelete = async () => { await projects.remove(deleting.value.id); ui.toast('Project deleted','info'); deleting.value = null }
</script>
<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center gap-3">
      <div class="flex-1"><h1 class="text-2xl font-bold">Projects</h1><p class="text-sm text-slate-500">{{ projects.items.length }} total</p></div>
      <input v-model="search" class="input sm:max-w-xs" placeholder="Search projects..." />
      <button class="btn-primary" @click="showCreate = true">+ New project</button>
    </div>

    <Spinner v-if="projects.loading" />
    <EmptyState v-else-if="!filtered.length" title="No projects yet" description="Create your first project to get started." icon="📁">
      <button class="btn-primary mt-4" @click="showCreate = true">Create project</button>
    </EmptyState>

    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="p in filtered" :key="p.id" class="card p-5 hover:shadow-md transition group">
        <div class="flex items-start justify-between">
          <div :class="['h-10 w-10 rounded-lg', p.color]"></div>
          <div class="opacity-0 group-hover:opacity-100 transition flex gap-1">
            <button class="btn-ghost !p-1.5" @click="editing = p" title="Edit">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
            </button>
            <button class="btn-ghost !p-1.5 text-red-600" @click="deleting = p" title="Delete">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>
            </button>
          </div>
        </div>
        <RouterLink :to="{ name: 'project-detail', params: { id: p.id } }">
          <h3 class="font-semibold mt-3 hover:text-brand-600">{{ p.name }}</h3>
          <p class="text-sm text-slate-500 mt-1 line-clamp-2 min-h-[2.5rem]">
            {{ p.description }}
          </p>
        </RouterLink>
        <div class="mt-4">
          <div class="flex items-center justify-between text-xs mb-1.5"><span class="text-slate-500">Progress</span><span class="font-medium">{{ p.progress }}%</span></div>
          <div class="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"><div class="h-full bg-brand-500" :style="{width:p.progress+'%'}"></div></div>
        </div>
        <div class="flex items-center justify-between mt-4">
          <span :class="['badge', statusColor(p.status)]">{{ p.status }}</span>
          <div class="flex -space-x-2">
            <Avatar v-for="m in p.members.slice(0,4)" :key="m" :name="userName(m)" size="xs" />
          </div>
        </div>
      </div>
    </div>

  <ProjectModal
    :open="showCreate || !!editing"
    :project="editing"
    :saving="projects.saving"
    @close="showCreate=false; editing=null"
    @save="onSave"
  />
<ConfirmModal :open="!!deleting" :message="`Delete project '${deleting?.name}'? This can't be undone.`" @close="deleting=null" @confirm="onDelete" />
  </div>
</template>
