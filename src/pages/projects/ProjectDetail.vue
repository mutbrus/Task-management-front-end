<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { useTasksStore } from '@/stores/tasks'
import { useUsersStore } from '@/stores/users'
import { useUiStore } from '@/stores/ui'
import { statusColor, priorityColor, relativeDate, STATUSES } from '@/utils/format'

import Avatar from '@/components/ui/Avatar.vue'
import Spinner from '@/components/ui/Spinner.vue'
import TaskModal from '@/components/modals/TaskModal.vue'
import TaskDetailPanel from '@/components/task/TaskDetailPanel.vue'

const route = useRoute()

const projects = useProjectsStore()
const tasks = useTasksStore()
const users = useUsersStore()
const ui = useUiStore()

const showCreate = ref(false)
const selectedTaskId = ref(null)
const tab = ref('list')

const projectId = computed(() => String(route.params.id))

const project = computed(() =>
  projects.items.find(p => String(p.id) === projectId.value)
)

const projectTasks = computed(() =>
  tasks.items.filter(t => String(t.projectId) === projectId.value)
)

const getAssigneeId = (task) => {
  return task.assignee || task.assignees?.[0] || ''
}

const userName = (id) => {
  if (!id) return 'Unassigned'

  const user = users.items.find(u =>
    String(u.id) === String(id) ||
    String(u.user_id) === String(id) ||
    String(u.hash) === String(id)
  )

  return user?.name || user?.full_name || user?.email || 'Unassigned'
}

const byStatus = (status) => {
  return projectTasks.value.filter(t => t.status === status)
}

const loadPage = async () => {
  if (!users.items.length) {
    await users.fetch()
  }

  if (!projects.items.length) {
    await projects.fetch()
  }

  await tasks.fetch({ projectId: projectId.value })
}

const onSave = async (data) => {
  await tasks.create({
    ...data,
    projectId: projectId.value
  })

  await tasks.fetch({ projectId: projectId.value })

  ui.toast('Task created')
  showCreate.value = false
}

onMounted(loadPage)

watch(
  () => route.params.id,
  async () => {
    await loadPage()
  }
)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-2 text-sm text-slate-500">
      <RouterLink to="/projects" class="hover:text-brand-600">
        Projects
      </RouterLink>
      <span>/</span>
      <span v-if="project" class="text-slate-700 dark:text-slate-300">
        {{ project.name }}
      </span>
    </div>

    <Spinner v-if="projects.loading || tasks.loading" />

    <div v-else-if="!project" class="card p-6 text-slate-500">
      Project not found.
    </div>

    <div v-else class="space-y-6">
      <div class="card p-6">
        <div class="flex flex-col lg:flex-row lg:items-center gap-4">
          <div :class="['h-14 w-14 rounded-xl', project.color]"></div>

          <div class="flex-1">
            <h1 class="text-2xl font-bold">
              {{ project.name }}
            </h1>

            <p class="text-sm text-slate-500 mt-1">
              {{ project.description }}
            </p>
          </div>

          <div class="flex items-center gap-3">
            <span :class="['badge', statusColor(project.status)]">
              {{ project.status }}
            </span>

            <div class="flex -space-x-2">
              <Avatar
                v-for="member in project.members"
                :key="member"
                :name="userName(member)"
                size="sm"
              />
            </div>

            <button class="btn-primary" @click="showCreate = true">
              + Task
            </button>
          </div>
        </div>
      </div>

      <div class="flex gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          v-for="item in ['list', 'board']"
          :key="item"
          @click="tab = item"
          :class="[
            'px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px',
            tab === item
              ? 'border-brand-500 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          ]"
        >
          {{ item }} view
        </button>
      </div>

      <div v-if="tab === 'list'" class="card overflow-hidden">
        <table class="w-full text-sm">
          <thead class="text-left text-xs uppercase text-slate-500 bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th class="px-4 py-3">Task</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Priority</th>
              <th class="px-4 py-3">Assignee</th>
              <th class="px-4 py-3">Due</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="task in projectTasks"
              :key="task.id"
              class="border-t border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer"
              @click="selectedTaskId = task.id"
            >
              <td class="px-4 py-3 font-medium">
                {{ task.title }}
              </td>

              <td class="px-4 py-3">
                <span :class="['badge', statusColor(task.status)]">
                  {{ task.status }}
                </span>
              </td>

              <td class="px-4 py-3">
                <span :class="['badge', priorityColor(task.priority)]">
                  {{ task.priority }}
                </span>
              </td>

              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <Avatar :name="userName(task.assignee || task.assignees?.[0])" size="xs" />
                  {{ userName(task.assignee || task.assignees?.[0]) }}
                </div>
              </td>

              <td class="px-4 py-3 text-slate-500">
                {{ relativeDate(task.dueDate) }}
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="!projectTasks.length" class="p-6 text-center text-slate-500">
          No tasks in this project yet.
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div
          v-for="status in STATUSES"
          :key="status"
          class="card p-3"
        >
          <div class="flex items-center justify-between px-2 py-1.5">
            <div class="flex items-center gap-2">
              <span :class="['badge', statusColor(status)]">
                {{ status }}
              </span>

              <span class="text-xs text-slate-500">
                {{ byStatus(status).length }}
              </span>
            </div>
          </div>

          <div class="space-y-2 mt-2 min-h-[100px]">
            <div
              v-for="task in byStatus(status)"
              :key="task.id"
              @click="selectedTaskId = task.id"
              class="rounded-lg border border-slate-200 dark:border-slate-800 p-3 bg-white dark:bg-slate-900 cursor-pointer hover:shadow-md transition"
            >
              <div class="text-sm font-medium">
                {{ task.title }}
              </div>

              <div class="flex items-center justify-between mt-2">
                <span :class="['badge', priorityColor(task.priority)]">
                  {{ task.priority }}
                </span>

                <div class="flex items-center gap-2">
                  <Avatar :name="userName(getAssigneeId(task))" size="xs" />
                  <span class="text-xs text-slate-500">
                    {{ userName(getAssigneeId(task)) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TaskModal
        :open="showCreate"
        :default-project-id="project.id"
        :saving="tasks.saving"
        @close="showCreate = false"
        @save="onSave"
      />

      <TaskDetailPanel
        :task-id="selectedTaskId"
        @close="selectedTaskId = null"
      />
    </div>
  </div>
</template>