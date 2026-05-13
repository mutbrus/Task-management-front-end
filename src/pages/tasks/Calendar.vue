<script setup>
import { computed, ref, onMounted } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useUsersStore } from '@/stores/users'
import { useUiStore } from '@/stores/ui'
import TaskCalendarView from '@/components/task/TaskCalendarView.vue'
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
  ui.setTaskViewMode('calendar')
  await users.fetch()
  await tasks.fetch()
})

const visibleTasks = computed(() => {
  const q = (ui.globalSearch || '').toLowerCase()

  if (!q) return tasks.filtered

  return tasks.filtered.filter((task) =>
    (task.title || '').toLowerCase().includes(q) ||
    (task.description || '').toLowerCase().includes(q)
  )
})

const onSave = async (data) => {
  await tasks.create(data)
  ui.toast('Task created')
  showCreate.value = false
  await tasks.fetch()
}
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-col sm:flex-row sm:items-center gap-3">
      <div class="flex-1">
        <h1 class="text-3xl font-black">Calendar</h1>
        <p class="text-sm text-slate-500">See tasks by due date in a simple monthly calendar.</p>
      </div>

      <button class="btn-primary !rounded-2xl" @click="showCreate = true">
        + New Task
      </button>
    </div>

    <Spinner v-if="tasks.loading" />

    <EmptyState
      v-else-if="!visibleTasks.length"
      title="No scheduled tasks"
      description="Create a task with a due date to see it in the calendar."
      icon="📅"
    />

    <TaskCalendarView
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
