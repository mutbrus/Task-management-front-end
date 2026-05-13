<script setup>
import { computed, ref } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useUsersStore } from '@/stores/users'
import { useUiStore } from '@/stores/ui'
import {
  statusColor,
  priorityColor,
  STATUSES,
  relativeDate
} from '@/utils/format'
import Avatar from '@/components/ui/Avatar.vue'

const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select'])

const taskStore = useTasksStore()
const users = useUsersStore()
const ui = useUiStore()

const dragId = ref(null)
const moving = ref(false)

const columns = computed(() => {
  return STATUSES.map((status) => ({
    status,
    tasks: props.tasks.filter((task) => task.status === status)
  }))
})

const getAssigneeId = (task) => {
  if (!task) return ''

  if (task.assignee) return task.assignee
  if (task.assignee_user_id) return task.assignee_user_id
  if (task.assignee_id) return task.assignee_id

  if (Array.isArray(task.assignees) && task.assignees.length > 0) {
    const first = task.assignees[0]
    if (typeof first === 'object') return first.user_id || first.id || first.hash || ''
    return first
  }

  return ''
}

const userName = (task) => {
  if (!task) return 'Unassigned'

  if (task.assigneeName) return task.assigneeName
  if (task.assignee_name) return task.assignee_name
  if (task.full_name) return task.full_name

  if (Array.isArray(task.rawAssignees) && task.rawAssignees.length > 0) {
    const first = task.rawAssignees[0]
    if (typeof first === 'object') return first.name || first.full_name || first.email || 'Unassigned'
  }

  if (Array.isArray(task.assignees) && task.assignees.length > 0) {
    const first = task.assignees[0]
    if (typeof first === 'object') return first.name || first.full_name || first.email || 'Unassigned'
  }

  const assigneeId = getAssigneeId(task)
  if (!assigneeId) return 'Unassigned'

  const user = users.byId?.(assigneeId) || users.items.find((item) => {
    return (
      String(item.id) === String(assigneeId) ||
      String(item.user_id) === String(assigneeId) ||
      String(item.userId) === String(assigneeId) ||
      String(item.hash) === String(assigneeId)
    )
  })

  return user?.name || user?.full_name || user?.email || `User #${assigneeId}`
}

const onDragStart = (task, event) => {
  dragId.value = task.id
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', String(task.id))
}

const onDrop = async (newStatus) => {
  if (!dragId.value || moving.value) return

  const task = props.tasks.find((item) => String(item.id) === String(dragId.value))

  if (!task || task.status === newStatus) {
    dragId.value = null
    return
  }

  moving.value = true

  try {
    await taskStore.updateStatus(task, newStatus)
    ui.toast(`Moved to ${newStatus}`)
  } catch (error) {
    console.error('Move task failed:', error)
    ui.toast(error.message || 'Failed to move task', 'error')
  } finally {
    moving.value = false
    dragId.value = null
  }
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
    <div
      v-for="column in columns"
      :key="column.status"
      class="rounded-3xl border border-slate-200/80 bg-white/80 dark:border-slate-800 dark:bg-slate-900/80 shadow-soft overflow-hidden"
      @dragover.prevent
      @drop="onDrop(column.status)"
    >
      <div
        class="px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-white to-violet-50/70 dark:from-slate-900 dark:to-violet-950/20"
      >
        <div class="flex items-center gap-2">
          <span :class="['badge', statusColor(column.status)]">
            {{ column.status }}
          </span>

          <span class="text-xs font-bold text-slate-400">
            {{ column.tasks.length }}
          </span>
        </div>

        <div class="h-2 w-2 rounded-full bg-violet-400"></div>
      </div>

      <TransitionGroup
        name="task-card"
        tag="div"
        class="p-3 space-y-3 min-h-[260px]"
      >
        <article
          v-for="task in column.tasks"
          :key="task.id"
          draggable="true"
          class="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 cursor-grab active:cursor-grabbing hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-900/10 transition"
          @dragstart="onDragStart(task, $event)"
          @click="emit('select', task.id)"
        >
          <div class="flex items-start justify-between gap-2">
            <h3 class="text-sm font-black text-slate-800 dark:text-slate-100 leading-snug">
              {{ task.title }}
            </h3>

            <span :class="['badge shrink-0', priorityColor(task.priority)]">
              {{ task.priority }}
            </span>
          </div>

          <p
            v-if="task.description"
            class="mt-2 text-xs text-slate-500 line-clamp-2"
          >
            {{ task.description }}
          </p>

          <div class="mt-4 flex items-center justify-between gap-3">
            <div class="flex items-center gap-2 min-w-0">
              <Avatar :name="userName(task)" size="xs" />

              <span class="text-xs text-slate-500 truncate">
                {{ userName(task) }}
              </span>
            </div>

            <span class="text-[11px] font-semibold text-slate-400 shrink-0">
              {{ relativeDate(task.dueDate) || 'No date' }}
            </span>
          </div>
        </article>
      </TransitionGroup>
    </div>
  </div>
</template>
