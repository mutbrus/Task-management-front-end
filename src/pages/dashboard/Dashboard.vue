<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'
import { useUsersStore } from '@/stores/users'
import { statusColor, priorityColor, formatDate, relativeDate } from '@/utils/format'
import Avatar from '@/components/ui/Avatar.vue'
import Spinner from '@/components/ui/Spinner.vue'

const projects = useProjectsStore(); const tasks = useTasksStore(); const users = useUsersStore()
onMounted(() => { projects.fetch(); tasks.fetch() })
const stats = computed(() => ({
  projects: projects.items.length,
  tasks: tasks.items.length,
  done: tasks.items.filter(t=>t.status==='Done').length,
  pending: tasks.items.filter(t=>t.status!=='Done').length,
}))
const cards = computed(() => [
  { label:'Projects', value: stats.value.projects, icon:'📁', tint:'from-brand-500 to-brand-700' },
  { label:'Total Tasks', value: stats.value.tasks, icon:'✓', tint:'from-emerald-500 to-emerald-700' },
  { label:'Completed', value: stats.value.done, icon:'🏁', tint:'from-purple-500 to-purple-700' },
  { label:'Pending', value: stats.value.pending, icon:'⏳', tint:'from-amber-500 to-amber-700' },
])
const recentProjects = computed(() => projects.items.slice(0,4))
const recentTasks = computed(() => [...tasks.items].sort((a,b)=>new Date(b.dueDate)-new Date(a.dueDate)).slice(0,5))
const userName = (id) => users.items.find(u=>u.id===id)?.name || 'Unassigned'
</script>
<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="text-sm text-slate-500 mt-1">Here's what's happening across your workspace.</p>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="c in cards" :key="c.label" class="card p-5">
        <div class="flex items-start justify-between">
          <div>
            <div class="text-sm text-slate-500">{{ c.label }}</div>
            <div class="text-3xl font-bold mt-1">{{ c.value }}</div>
          </div>
          <div :class="['h-10 w-10 rounded-xl bg-gradient-to-br grid place-items-center text-white text-lg', c.tint]">{{ c.icon }}</div>
        </div>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <div class="card p-5 lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold">Recent Projects</h2>
          <RouterLink to="/projects" class="text-sm text-brand-600 hover:underline">View all</RouterLink>
        </div>
        <Spinner v-if="projects.loading" />
        <div v-else class="space-y-3">
          <RouterLink v-for="p in recentProjects" :key="p.id" :to="`/projects/${p.id}`" class="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
            <div :class="['h-10 w-10 rounded-lg', p.color]"></div>
            <div class="flex-1 min-w-0">
              <div class="font-medium truncate">{{ p.name }}</div>
              <div class="text-xs text-slate-500 truncate">{{ p.description }}</div>
            </div>
            <div class="hidden sm:flex flex-col items-end w-32">
              <div class="text-xs text-slate-500 mb-1">{{ p.progress }}%</div>
              <div class="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div class="h-full bg-brand-500" :style="{width: p.progress+'%'}"></div>
              </div>
            </div>
            <div class="flex -space-x-2">
              <Avatar v-for="m in p.members.slice(0,3)" :key="m" :name="userName(m)" size="xs" />
            </div>
          </RouterLink>
        </div>
      </div>

      <div class="card p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold">Activity</h2>
        </div>
        <div class="space-y-4">
          <div v-for="(a,i) in [
            {who:'Sara', what:'created task', sub:'Design new landing hero', when:'2h ago'},
            {who:'You', what:'completed', sub:'Launch checklist', when:'Yesterday'},
            {who:'Jordan', what:'commented on', sub:'SEO audit', when:'2d ago'},
            {who:'Priya', what:'joined', sub:'Mobile App v2', when:'3d ago'},
          ]" :key="i" class="flex gap-3">
            <Avatar :name="a.who" size="sm" />
            <div class="text-sm flex-1">
              <div><strong>{{ a.who }}</strong> {{ a.what }} <span class="text-brand-600">{{ a.sub }}</span></div>
              <div class="text-xs text-slate-500 mt-0.5">{{ a.when }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card p-5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-semibold">Recent Tasks</h2>
        <RouterLink to="/tasks" class="text-sm text-brand-600 hover:underline">View all</RouterLink>
      </div>
      <Spinner v-if="tasks.loading" />
      <div v-else class="overflow-x-auto scrollbar-thin">
        <table class="w-full text-sm">
          <thead class="text-left text-xs uppercase text-slate-500 border-b border-slate-200 dark:border-slate-800">
            <tr><th class="py-2 pr-4">Task</th><th class="py-2 pr-4">Status</th><th class="py-2 pr-4">Priority</th><th class="py-2 pr-4">Assignee</th><th class="py-2 pr-4">Due</th></tr>
          </thead>
          <tbody>
            <tr v-for="t in recentTasks" :key="t.id" class="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30">
              <td class="py-3 pr-4 font-medium">{{ t.title }}</td>
              <td class="py-3 pr-4"><span :class="['badge', statusColor(t.status)]">{{ t.status }}</span></td>
              <td class="py-3 pr-4"><span :class="['badge', priorityColor(t.priority)]">{{ t.priority }}</span></td>
              <td class="py-3 pr-4"><div class="flex items-center gap-2"><Avatar :name="userName(t.assignee)" size="xs" /><span class="text-slate-600 dark:text-slate-300">{{ userName(t.assignee) }}</span></div></td>
              <td class="py-3 pr-4 text-slate-500">{{ relativeDate(t.dueDate) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
