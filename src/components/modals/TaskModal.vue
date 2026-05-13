<script setup>
import { ref, watch } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import { useUsersStore } from '@/stores/users'
import { useProjectsStore } from '@/stores/projects'
import { STATUSES, PRIORITIES } from '@/utils/format'

const props = defineProps({
  open: Boolean,
  task: Object,
  defaultProjectId: [String, Number],
  saving: Boolean
})

const emit = defineEmits(['close', 'save'])

const users = useUsersStore()
const projects = useProjectsStore()

const form = ref({
  title: '',
  description: '',
  status: 'Todo',
  priority: 'Medium',
  assignee: '',
  dueDate: '',
  projectId: ''
})

const getTaskAssignee = (task) => {
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

watch(
  () => props.open,
  async (isOpen) => {
    if (!isOpen) return

    if (!users.items.length) {
      await users.fetch()
    }

    if (!projects.items.length) {
      await projects.fetch()
    }

    if (props.task) {
      form.value = {
        title: props.task.title ?? '',
        description: props.task.description ?? '',
        status: props.task.status ?? 'Todo',
        priority: props.task.priority ?? 'Medium',
        assignee: getTaskAssignee(props.task),
        dueDate: props.task.dueDate ?? '',
        projectId: props.task.projectId || props.defaultProjectId || ''
      }
    } else {
      form.value = {
        title: '',
        description: '',
        status: 'Todo',
        priority: 'Medium',
        assignee: '',
        dueDate: '',
        projectId: props.defaultProjectId || projects.items[0]?.id || ''
      }
    }
  }
)

const submit = () => {
  if (!form.value.title || props.saving) return

  emit('save', {
    ...form.value,
    assignees: form.value.assignee ? [form.value.assignee] : []
  })
}
</script>

<template>
  <Modal
    :open="open"
    :title="task ? 'Edit task' : 'Create task'"
    size="lg"
    @close="emit('close')"
  >
    <div class="space-y-4">
      <div>
        <label class="label">Title</label>
        <input
          v-model="form.title"
          class="input"
          placeholder="What needs to be done?"
        />
      </div>

      <div>
        <label class="label">Description</label>
        <textarea
          v-model="form.description"
          rows="3"
          class="input"
          placeholder="Add more detail..."
        ></textarea>
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <div>
          <label class="label">Project</label>
          <select v-model="form.projectId" class="input">
            <option
              v-for="project in projects.items"
              :key="project.id"
              :value="project.id"
            >
              {{ project.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="label">Assignee</label>
          <select v-model="form.assignee" class="input">
            <option value="">Unassigned</option>

            <option
              v-for="user in users.items"
              :key="user.id"
              :value="user.id"
            >
              {{ user.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="label">Status</label>
          <select v-model="form.status" class="input">
            <option
              v-for="status in STATUSES"
              :key="status"
              :value="status"
            >
              {{ status }}
            </option>
          </select>
        </div>

        <div>
          <label class="label">Priority</label>
          <select v-model="form.priority" class="input">
            <option
              v-for="priority in PRIORITIES"
              :key="priority"
              :value="priority"
            >
              {{ priority }}
            </option>
          </select>
        </div>

        <div class="sm:col-span-2">
          <label class="label">Due date</label>
          <input
            v-model="form.dueDate"
            type="date"
            class="input"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <button class="btn-secondary" @click="emit('close')">
        Cancel
      </button>

      <button
        class="btn-primary"
        :disabled="!form.title || saving"
        @click="submit"
      >
        {{ saving ? 'Saving...' : task ? 'Save changes' : 'Create task' }}
      </button>
    </template>
  </Modal>
</template>