import { defineStore } from 'pinia'
import { projectsService } from '@/services/projects.service'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    items: [],
    loading: false,
    saving: false,
    error: null
  }),

  actions: {
    async fetch() {
      this.loading = true
      this.error = null

      try {
        this.items = await projectsService.list()
      } catch (e) {
        this.error = 'Failed to load projects'
      } finally {
        this.loading = false
      }
    },

    async create(data) {
      if (this.saving) return null

      this.saving = true

      try {
        const p = await projectsService.create(data)

        this.items = [
          p,
          ...this.items.filter(x => String(x.id) !== String(p.id))
        ]

        return p
      } finally {
        this.saving = false
      }
    },

    async update(id, data) {
      const p = await projectsService.update(id, data)

      this.items = this.items.map(x =>
        String(x.id) === String(id) ? p : x
      )

      return p
    },

    async remove(id) {
      await projectsService.remove(id)

      this.items = this.items.filter(x =>
        String(x.id) !== String(id)
      )
    },

    async addMember(id, uid) {
      const p = await projectsService.addMember(id, uid)

      this.items = this.items.map(x =>
        String(x.id) === String(id) ? p : x
      )

      return p
    }
  }
})