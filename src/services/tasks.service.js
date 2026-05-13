import http, { USE_MOCK, delay } from './http'
import { mockTasks } from '@/utils/mockData'
import { unwrap, mapTask, taskPayload, statusNameToId } from './apiAdapter'
import { projectsService } from './projects.service'

let tasks = [...mockTasks]
let taskCache = []

const sameId = (a, b) => String(a) === String(b)
const getProjectIdFromTask = (task) => task?.projectId || task?.project_id

const replaceCachedTask = (task) => {
  taskCache = [
    task,
    ...taskCache.filter((item) => !sameId(item.id, task.id))
  ]
  return task
}

export const tasksService = {
  async list(params = {}) {
    if (USE_MOCK) {
      await delay()
      let result = [...tasks]
      if (params.projectId) {
        result = result.filter((task) => sameId(task.projectId, params.projectId))
      }
      return result.map(mapTask)
    }

    if (params.projectId) {
      const response = await http.get(`/projects/${params.projectId}/task`, {
        params: { size: 100, ...params }
      })

      const data = unwrap(response)
      const rows = data?.tasks || data?.data || data || []
      const mapped = rows.map(mapTask)

      taskCache = [
        ...taskCache.filter((task) => !sameId(task.projectId, params.projectId)),
        ...mapped
      ]

      return mapped
    }

    const projects = await projectsService.list()
    const lists = await Promise.all(
      projects.map((project) => this.list({ projectId: project.id }).catch(() => []))
    )

    taskCache = lists.flat()
    return taskCache
  },

  async get(id) {
    if (USE_MOCK) {
      await delay()
      return tasks.find((task) => sameId(task.id, id))
    }

    const cached = taskCache.find((task) => sameId(task.id, id))
    if (cached) return cached

    await this.list()
    return taskCache.find((task) => sameId(task.id, id))
  },

  async create(data) {
    if (USE_MOCK) {
      await delay()
      const task = mapTask({
        id: 't' + Date.now(),
        subtasks: [],
        comments: [],
        attachments: [],
        activity: [{ at: new Date().toISOString().slice(0, 10), text: 'Task created' }],
        ...data
      })
      tasks = [task, ...tasks.filter((item) => !sameId(item.id, task.id))]
      return task
    }

    const projectId = data.projectId || data.project_id
    if (!projectId) throw new Error('Missing projectId for task create')

    const created = mapTask(
      unwrap(
        await http.post(`/projects/${projectId}/task`, {
          ...taskPayload(data),
          project_id: projectId
        })
      )
    )

    return replaceCachedTask(created)
  },

  async update(id, data) {
    if (USE_MOCK) {
      await delay()
      tasks = tasks.map((task) => sameId(task.id, id) ? mapTask({ ...task, ...data }) : task)
      return tasks.find((task) => sameId(task.id, id))
    }

    const current = taskCache.find((task) => sameId(task.id, id))
    const projectId = data.projectId || data.project_id || current?.projectId

    if (!projectId) throw new Error('Missing projectId for task update')

    const updated = mapTask(
      unwrap(
        await http.put(`/projects/${projectId}/task/${id}`, taskPayload({ ...current, ...data }))
      )
    )

    return replaceCachedTask(updated)
  },

  async updateStatus(task, newStatus) {
    if (!task) throw new Error('Task is required')

    const projectId = getProjectIdFromTask(task)
    if (!projectId) throw new Error('Missing projectId for status update')

    const statusId = statusNameToId(newStatus)

    if (USE_MOCK) {
      await delay()
      tasks = tasks.map((item) =>
        sameId(item.id, task.id)
          ? mapTask({ ...item, status: newStatus, statusId, status_id: statusId })
          : item
      )
      return tasks.find((item) => sameId(item.id, task.id))
    }

    const updated = mapTask(
      unwrap(
        await http.patch(`/projects/${projectId}/task/${task.id}/status`, {
          status_id: statusId
        })
      )
    )

    return replaceCachedTask(updated)
  },

  async remove(id) {
    if (USE_MOCK) {
      await delay()
      tasks = tasks.filter((task) => !sameId(task.id, id))
      return { ok: true }
    }

    const current = taskCache.find((task) => sameId(task.id, id))
    if (!current?.projectId) throw new Error('Missing projectId for task delete')

    await http.delete(`/projects/${current.projectId}/task/${id}`)
    taskCache = taskCache.filter((task) => !sameId(task.id, id))

    return { ok: true }
  }
}
