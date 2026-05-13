<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTasksStore } from '@/stores/tasks'
import { useUsersStore } from '@/stores/users'
import { useUiStore } from '@/stores/ui'
import {
  statusColor,
  priorityColor,
  relativeDate,
  STATUSES,
  PRIORITIES
} from '@/utils/format'

import Avatar from '@/components/ui/Avatar.vue'
import Spinner from '@/components/ui/Spinner.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import TaskModal from '@/components/modals/TaskModal.vue'
import TaskDetailPanel from '@/components/task/TaskDetailPanel.vue'
import ConfirmModal from '@/components/modals/ConfirmModal.vue'
import TaskBoardView from '@/components/task/TaskBoardView.vue'
import TaskCalendarView from '@/components/task/TaskCalendarView.vue'

const router = useRouter()
const tasks = useTasksStore()
const users = useUsersStore()
const ui = useUiStore()

const showCreate = ref(false)
const editing = ref(null)
const deleting = ref(null)
const selectedTaskId = ref(null)

onMounted(async () => {
  ui.setTaskViewMode('list')

  await users.fetch()
  await tasks.fetch()
})

const getAssigneeId = (task) => {
  if (!task) return ''

  if (task.assignee) return task.assignee
  if (task.assignee_user_id) return task.assignee_user_id
  if (task.assignee_id) return task.assignee_id

  if (Array.isArray(task.assignees) && task.assignees.length > 0) {
    const first = task.assignees[0]

    if (typeof first === 'object') {
      return (
        first.user_id ??
        first.id ??
        first.hash ??
        first.user_hash ??
        ''
      )
    }

    return first
  }

  return ''
}

const userName = (task) => {
  if (!task) return 'Unassigned'

  if (task.assigneeName) return task.assigneeName
  if (task.assignee_name) return task.assignee_name
  if (task.full_name) return task.full_name

  if (task.assignee && typeof task.assignee === 'object') {
    return (
      task.assignee.name ||
      task.assignee.full_name ||
      task.assignee.email ||
      'Unassigned'
    )
  }

  if (Array.isArray(task.rawAssignees) && task.rawAssignees.length > 0) {
    const first = task.rawAssignees[0]

    if (typeof first === 'object') {
      return (
        first.name ||
        first.full_name ||
        first.email ||
        'Unassigned'
      )
    }
  }

  if (Array.isArray(task.assignees) && task.assignees.length > 0) {
    const first = task.assignees[0]

    if (typeof first === 'object') {
      return (
        first.name ||
        first.full_name ||
        first.email ||
        'Unassigned'
      )
    }
  }

  const assigneeId = getAssigneeId(task)

  if (!assigneeId) return 'Unassigned'

  const user = users.byId(assigneeId)

  return user?.name || user?.full_name || user?.email || `User #${assigneeId}`
}

const filteredTasks = computed(() => {
  const q = (ui.globalSearch || '').toLowerCase()

  if (!q) return tasks.filtered

  return tasks.filtered.filter((task) => {
    return (
      (task.title || '').toLowerCase().includes(q) ||
      (task.description || '').toLowerCase().includes(q) ||
      userName(task).toLowerCase().includes(q)
    )
  })
})

const onSave = async (data) => {
  if (editing.value) {
    await tasks.update(editing.value.id, data)
    ui.toast('Task updated')
  } else {
    await tasks.create(data)
    ui.toast('Task created')
  }

  showCreate.value = false
  editing.value = null

  await users.fetch()
  await tasks.fetch()
}

const onDelete = async () => {
  if (!deleting.value) return

  await tasks.remove(deleting.value.id)
  ui.toast('Task deleted', 'info')
  deleting.value = null

  await tasks.fetch()
}

const switchMode = (mode) => {
  ui.setTaskViewMode(mode)

  if (mode === 'list') router.push('/tasks')
  if (mode === 'board') router.push('/board')
  if (mode === 'calendar') router.push('/calendar')
}
</script>

<template>
  <div class="space-y-5">
    <section
      class="rounded-[2rem] overflow-hidden bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-700 text-white shadow-xl shadow-violet-900/20"
    >
      <div class="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-end gap-5">
        <div class="flex-1">
          <div class="text-xs font-black uppercase tracking-[0.22em] text-violet-100">
            ClickUp-style workspace
          </div>

          <h1 class="mt-2 text-3xl sm:text-4xl font-black">
            My Tasks
          </h1>

          <p class="mt-2 text-violet-100 max-w-2xl">
            Create, filter, edit, delete, and track tasks from one polished productivity view.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            v-for="mode in ['list', 'board', 'calendar']"
            :key="mode"
            @click="switchMode(mode)"
            :class="[
              'rounded-2xl px-4 py-2 text-sm font-black capitalize transition',
              ui.taskViewMode === mode
                ? 'bg-white text-violet-700 shadow-lg'
                : 'bg-white/10 text-white hover:bg-white/20'
            ]"
          >
            {{ mode }}
          </button>

          <button
            class="rounded-2xl bg-white px-4 py-2 text-sm font-black text-violet-700 shadow-lg hover:bg-violet-50"
            @click="showCreate = true"
          >
            + New Task
          </button>
        </div>
      </div>
    </section>

    <div class="card p-4 grid sm:grid-cols-2 xl:grid-cols-5 gap-3">
      <input
        v-model="tasks.search"
        class="input xl:col-span-2"
        placeholder="Search current tasks..."
      />

      <select v-model="tasks.filterStatus" class="input">
        <option>All</option>
        <option v-for="status in STATUSES" :key="status">
          {{ status }}
        </option>
      </select>

      <select v-model="tasks.filterPriority" class="input">
        <option>All</option>
        <option v-for="priority in PRIORITIES" :key="priority">
          {{ priority }}
        </option>
      </select>

      <select v-model="tasks.sortBy" class="input">
        <option value="dueDate">Sort: Due date</option>
        <option value="priority">Sort: Priority</option>
        <option value="title">Sort: Title</option>
      </select>
    </div>

    <Spinner v-if="tasks.loading" />

    <EmptyState
      v-else-if="!filteredTasks.length"
      title="No tasks found"
      description="Try changing filters or create a new task."
      icon="✓"
    />

    <TaskBoardView
      v-else-if="ui.taskViewMode === 'board'"
      :tasks="filteredTasks"
      @select="selectedTaskId = $event"
    />

    <TaskCalendarView
      v-else-if="ui.taskViewMode === 'calendar'"
      :tasks="filteredTasks"
      @select="selectedTaskId = $event"
    />

    <div v-else class="card overflow-hidden">
      <div class="overflow-x-auto scrollbar-thin">
        <table class="w-full text-sm min-w-[860px]">
          <thead class="text-left text-xs uppercase text-slate-500 bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th class="px-4 py-3">Task name</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Priority</th>
              <th class="px-4 py-3">Assignee</th>
              <th class="px-4 py-3">Due date</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <TransitionGroup name="task-row" tag="tbody">
            <tr
              v-for="task in filteredTasks"
              :key="task.id"
              class="border-t border-slate-100 dark:border-slate-800/50 hover:bg-violet-50/50 dark:hover:bg-violet-950/20"
            >
              <td
                class="px-4 py-3 font-black cursor-pointer"
                @click="selectedTaskId = task.id"
              >
                <div>{{ task.title }}</div>

                <div
                  v-if="task.description"
                  class="text-xs font-normal text-slate-500 line-clamp-1"
                >
                  {{ task.description }}
                </div>
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
                  <Avatar :name="userName(task)" size="xs" />
                  <span>{{ userName(task) }}</span>
                </div>
              </td>

              <td class="px-4 py-3 text-slate-500">
                {{ relativeDate(task.dueDate) || 'No date' }}
              </td>

              <td class="px-4 py-3 text-right">
                <button
                  class="btn-ghost !p-1.5"
                  title="Edit"
                  @click="editing = task"
                >
                  <svg
                    class="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </svg>
                </button>

                <button
                  class="btn-ghost !p-1.5 text-red-600"
                  title="Delete"
                  @click="deleting = task"
                >
                  <svg
                    class="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
                  </svg>
                </button>
              </td>
            </tr>
          </TransitionGroup>
        </table>
      </div>
    </div>

    <button
      class="fixed bottom-6 right-6 z-20 h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white text-2xl shadow-2xl shadow-violet-900/30 hover:scale-105 transition"
      @click="showCreate = true"
    >
      +
    </button>

    <TaskModal
      :open="showCreate || !!editing"
      :task="editing"
      :saving="tasks.saving"
      @close="showCreate = false; editing = null"
      @save="onSave"
    />

    <ConfirmModal
      :open="!!deleting"
      :message="`Delete task '${deleting?.title}'?`"
      @close="deleting = null"
      @confirm="onDelete"
    />

    <TaskDetailPanel
      :task-id="selectedTaskId"
      @close="selectedTaskId = null"
    />
  </div>
</template>