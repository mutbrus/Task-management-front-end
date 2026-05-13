import http, { USE_MOCK, delay } from './http'
import { mockProjects } from '@/utils/mockData'
import { unwrap, mapProject, projectPayload, mapUser } from './apiAdapter'

let projects = [...mockProjects]
let projectCache = []

const loadMembers = async (project) => {
  try {
    const data = unwrap(await http.get(`/projects/${project.id}/members`))
    const rows = Array.isArray(data) ? data : (data?.data || data?.members || [])
    project.members = rows.map(m => m.user_id ?? m.id ?? m.hash)
  } catch {}
  return project
}

export const projectsService = {
  async list() {
    if(USE_MOCK){ await delay(); return [...projects] }
    const data = unwrap(await http.get('/projects/project', { params: { size: 100 } }))
    const rows = data?.data || data?.projects || data || []
    projectCache = await Promise.all(rows.map(p => loadMembers(mapProject(p))))
    return projectCache
  },
  async get(id) {
    if(USE_MOCK){ await delay(); return projects.find(p=>p.id===id) }
    const cached = projectCache.find(p => String(p.id) === String(id))
    if (cached) return cached
    await this.list()
    return projectCache.find(p => String(p.id) === String(id))
  },
async create(data) {
  if (USE_MOCK) {
    await delay()
    const p = {
      id: 'p' + Date.now(),
      progress: 0,
      members: ['u1'],
      status: 'Planning',
      color: 'bg-brand-500',
      createdAt: new Date().toISOString().slice(0, 10),
      ...data
    }
    projects.unshift(p)
    return p
  }

const created = mapProject(unwrap(await http.post('/projects/project', projectPayload(data))))

projectCache = [
  created,
  ...projectCache.filter(p => String(p.id) !== String(created.id))
]

return created
},
  async update(id, data) {
    if (USE_MOCK) {
      await delay()
      projects = projects.map(p => p.id === id ? { ...p, ...data } : p)
      return projects.find(p => p.id === id)
    }

    const current = projectCache.find(p => String(p.id) === String(id)) || await this.get(id)

    const updated = mapProject(
      unwrap(await http.put(`/projects/project/update/${current.id}`, projectPayload(data)))
    )

    projectCache = projectCache.map(p =>
      String(p.id) === String(id) ? updated : p
    )

    return updated
  },

  async remove(id) {
    if (USE_MOCK) {
      await delay()
      projects = projects.filter(p => p.id !== id)
      return { ok: true }
    }

    const current = projectCache.find(p => String(p.id) === String(id)) || await this.get(id)

    await http.delete(`/projects/project/delete/${current.id}`)

    projectCache = projectCache.filter(p => String(p.id) !== String(id))

    return { ok: true }
  },

  async addMember(id, userId, role='member') {
    if(USE_MOCK){ await delay(); const p=projects.find(x=>x.id===id); if(p && !p.members.includes(userId)) p.members.push(userId); return p }
    await http.post(`/projects/${id}/members`, { userId, role })
    await this.list()
    return projectCache.find(p => String(p.id) === String(id))
  },
}
