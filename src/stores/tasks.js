import { defineStore } from 'pinia'
import { tasksService } from '@/services/tasks.service'
import { statusNameToId } from '@/services/apiAdapter'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    items: [],
    loading: false,
    saving: false,
    error: null,
    search: '',
    filterStatus: 'All',
    filterPriority: 'All',
    sortBy: 'dueDate'
  }),

  getters: {
    filtered(state) {
      let result = [...state.items]

      if (state.search) {
        const keyword = state.search.toLowerCase()
        result = result.filter((task) =>
          (task.title || '').toLowerCase().includes(keyword) ||
          (task.description || '').toLowerCase().includes(keyword)
        )
      }

      if (state.filterStatus !== 'All') {
        result = result.filter((task) => task.status === state.filterStatus)
      }

      if (state.filterPriority !== 'All') {
        result = result.filter((task) => task.priority === state.filterPriority)
      }

      const priorityOrder = { High: 0, Medium: 1, Low: 2 }

      result.sort((a, b) => {
        if (state.sortBy === 'priority') {
          return (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99)
        }

        if (state.sortBy === 'title') {
          return (a.title || '').localeCompare(b.title || '')
        }

        return new Date(a.dueDate || 0) - new Date(b.dueDate || 0)
      })

      return result
    },

    byStatus() {
      return (status) => this.filtered.filter((task) => task.status === status)
    }
  },

  actions: {
    async fetch(params = {}) {
      this.loading = true
      this.error = null

      try {
        const result = await tasksService.list(params)

        if (params?.projectId) {
          this.items = [
            ...this.items.filter((task) => String(task.projectId) !== String(params.projectId)),
            ...result
          ]
        } else {
          this.items = result
        }

        return result
      } catch (error) {
        console.error('Fetch tasks failed:', error)
        this.error = error.message || 'Failed to load tasks'
        return []
      } finally {
        this.loading = false
      }
    },

    async create(data) {
      if (this.saving) return null
      this.saving = true
      this.error = null

      try {
        const task = await tasksService.create(data)
        this.items = [task, ...this.items.filter((item) => String(item.id) !== String(task.id))]
        return task
      } catch (error) {
        console.error('Create task failed:', error)
        this.error = error.message || 'Failed to create task'
        throw error
      } finally {
        this.saving = false
      }
    },

    async update(id, data) {
      this.saving = true
      this.error = null

      try {
        const updatedTask = await tasksService.update(id, data)
        this.items = this.items.map((item) => String(item.id) === String(id) ? updatedTask : item)
        return updatedTask
      } catch (error) {
        console.error('Update task failed:', error)
        this.error = error.message || 'Failed to update task'
        throw error
      } finally {
        this.saving = false
      }
    },

    async updateStatus(taskOrId, newStatus) {
      const taskId = typeof taskOrId === 'object' ? taskOrId.id : taskOrId
      const currentTask = typeof taskOrId === 'object'
        ? taskOrId
        : this.items.find((item) => String(item.id) === String(taskId))

      if (!currentTask) throw new Error('Task not found in store')

      const oldTask = { ...currentTask }
      const statusId = statusNameToId(newStatus)

      // Optimistic UI update: move card immediately.
      this.items = this.items.map((item) =>
        String(item.id) === String(taskId)
          ? { ...item, status: newStatus, statusId }
          : item
      )

      try {
        const updatedTask = await tasksService.updateStatus(currentTask, newStatus)
        this.items = this.items.map((item) => String(item.id) === String(taskId) ? updatedTask : item)
        return updatedTask
      } catch (error) {
        this.items = this.items.map((item) => String(item.id) === String(taskId) ? oldTask : item)
        console.error('Update status failed:', error)
        this.error = error.message || 'Failed to update task status'
        throw error
      }
    },

    async remove(id) {
      this.error = null

      try {
        await tasksService.remove(id)
        this.items = this.items.filter((item) => String(item.id) !== String(id))
      } catch (error) {
        console.error('Delete task failed:', error)
        this.error = error.message || 'Failed to delete task'
        throw error
      }
    }
  }
})
