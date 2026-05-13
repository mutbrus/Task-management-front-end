<script setup>
import { computed, ref, onMounted } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useUsersStore } from '@/stores/users'
import { useUiStore } from '@/stores/ui'

import TaskBoardView from '@/components/task/TaskBoardView.vue'
import TaskModal from '@/components/modals/TaskModal.vue'
import TaskDetailPanel from '@/components/task/TaskDetailPanel.vue'
import Spinner from '@/components/ui/Spinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const tasks = useTasksStore()
const users = useUsersStore()
const ui = useUiStore()

const showCreate = ref(false)
const selectedTaskId = ref(null)

onMounted(async () => {
  ui.setTaskViewMode('board')

  // Important: load users first, then tasks
  await users.fetch()
  await tasks.fetch()
})

const visibleTasks = computed(() => {
  const q = (ui.globalSearch || '').toLowerCase()

  if (!q) return tasks.filtered

  return tasks.filtered.filter((t) => {
    return (
      (t.title || '').toLowerCase().includes(q) ||
      (t.description || '').toLowerCase().includes(q) ||
      getAssigneeName(t).toLowerCase().includes(q)
    )
  })
})

const getAssigneeName = (task) => {
  if (!task) return 'Unassigned'

  if (task.assigneeName) return task.assigneeName
  if (task.assignee_name) return task.assignee_name
  if (task.full_name) return task.full_name

  if (task.assignee && typeof task.assignee === 'object') {
    return task.assignee.name || task.assignee.full_name || task.assignee.email || 'Unassigned'
  }

  if (Array.isArray(task.assignees) && task.assignees.length > 0) {
    const first = task.assignees[0]

    if (typeof first === 'object') {
      return first.name || first.full_name || first.email || 'Unassigned'
    }

    const foundUser = users.items.find((u) => String(u.id) === String(first))
    return foundUser?.name || foundUser?.full_name || foundUser?.email || 'Unassigned'
  }

  const assigneeId =
    task.assignee ??
    task.assigneeId ??
    task.assignee_id ??
    task.assignee_user_id ??
    task.user_id

  if (!assigneeId) return 'Unassigned'

  const user = users.items.find((u) => {
    return (
      String(u.id) === String(assigneeId) ||
      String(u.user_id) === String(assigneeId)
    )
  })

  return user?.name || user?.full_name || user?.email || 'Unassigned'
}

const onSave = async (data) => {
  await tasks.create(data)
  ui.toast('Task created')
  showCreate.value = false

  // Refresh after create to show latest backend data
  await users.fetch()
  await tasks.fetch()
}
</script>

<template>
  <div class="space-y-5">
    <section
      class="rounded-[2rem] overflow-hidden bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-700 text-white shadow-xl shadow-violet-900/20"
    >
      <div class="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end gap-5">
        <div class="flex-1">
          <div class="text-xs font-black uppercase tracking-[0.22em] text-violet-100">
            ClickUp-style board
          </div>

          <h1 class="mt-2 text-3xl sm:text-4xl font-black">
            Board
          </h1>

          <p class="mt-2 text-violet-100 max-w-2xl">
            Drag cards between columns to update task status and manage work visually.
          </p>
        </div>

        <button
          class="rounded-2xl bg-white px-4 py-2 text-sm font-black text-violet-700 shadow-lg hover:bg-violet-50"
          @click="showCreate = true"
        >
          + New Task
        </button>
      </div>
    </section>

    <Spinner v-if="tasks.loading" />

    <EmptyState
      v-else-if="!visibleTasks.length"
      title="No tasks found"
      description="Try changing filters or create a new task."
      icon="✓"
    />

    <TaskBoardView
      v-else
      :tasks="visibleTasks"
      @select="selectedTaskId = $event"
    />

    <TaskModal
      :open="showCreate"
      :saving="tasks.saving"
      @close="showCreate = false"
      @save="onSave"
    />

    <TaskDetailPanel
      :task-id="selectedTaskId"
      @close="selectedTaskId = null"
    />
  </div>
</template>