import { defineStore } from 'pinia'
import { usersService } from '@/services/users.service'

const sameId = (a, b) => {
  if (a === null || a === undefined || b === null || b === undefined) {
    return false
  }

  return String(a) === String(b)
}

export const useUsersStore = defineStore('users', {
  state: () => ({
    items: [],
    loading: false
  }),

  getters: {
    byId: (state) => (id) => {
      return state.items.find((user) => {
        return (
          sameId(user.id, id) ||
          sameId(user.user_id, id) ||
          sameId(user.userId, id) ||
          sameId(user.hash, id) ||
          sameId(user.user_hash, id)
        )
      })
    }
  },

  actions: {
    async fetch() {
      this.loading = true

      try {
        this.items = await usersService.list()
      } finally {
        this.loading = false
      }
    },

    async invite(email) {
      const user = await usersService.invite(email)
      this.items.push(user)
      return user
    }
  }
})