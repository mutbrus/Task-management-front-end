export const unwrap = (response) => {
  const payload = response?.data ?? response

  if (payload?.status && payload.status !== 'success') {
    throw new Error(payload.message || 'Request failed')
  }

  return payload?.data ?? payload
}

export const statusIdToName = (id) =>
  ({
    1: 'Todo',
    2: 'In Progress',
    3: 'Review',
    4: 'Done',
    5: 'Blocked'
  }[Number(id)] || 'Todo')

export const statusNameToId = (name) =>
  ({
    Todo: 1,
    'To Do': 1,
    'In Progress': 2,
    Review: 3,
    Done: 4,
    Completed: 4,
    Blocked: 5
  }[name] || 1)

const pickId = (item) => {
  if (!item) return null
  if (typeof item !== 'object') return item
  return item.user_id ?? item.userId ?? item.id ?? item.hash ?? item.user_hash ?? item.assignee_user_id ?? null
}

export const normalizeAssigneeIds = (value) => {
  if (!value) return []
  const raw = Array.isArray(value) ? value : [value]
  return raw.map(pickId).filter((id) => id !== null && id !== undefined && id !== '')
}

const firstAssignee = (assignees) => Array.isArray(assignees) ? assignees.find(Boolean) : null

const getAssigneeName = (assignees) => {
  const first = firstAssignee(assignees)
  if (!first || typeof first !== 'object') return ''
  return first.full_name ?? first.name ?? first.user_name ?? first.email ?? ''
}

const getAssigneeEmail = (assignees) => {
  const first = firstAssignee(assignees)
  if (!first || typeof first !== 'object') return ''
  return first.email ?? ''
}

export const mapUser = (u = {}) => ({
  id: u.user_id ?? u.userId ?? u.id ?? u.hash,
  userId: u.user_id ?? u.userId ?? u.id,
  hash: u.hash ?? u.user_hash,
  name: u.full_name ?? u.name ?? u.email ?? 'User',
  fullName: u.full_name ?? u.name ?? '',
  email: u.email ?? '',
  role: u.user_role ?? u.role ?? 'Member',
  avatar: (u.full_name ?? u.name ?? u.email ?? 'U').trim().slice(0, 2).toUpperCase()
})

export const mapProject = (p = {}) => ({
  id: p.project_id ?? p.id,
  hash: p.pj_hash ?? p.hash,
  name: p.pj_name ?? p.name ?? 'Untitled project',
  description: p.description ?? '',
  ownerId: p.owner_id,
  status: p.status ?? 'In Progress',
  progress: p.progress ?? 0,
  members: p.members ?? (p.owner_id ? [p.owner_id] : []),
  color: p.color ?? 'bg-brand-500',
  createdAt: p.created_at,
  updatedAt: p.updated_at
})

export const mapTask = (t = {}) => {
  const rawAssignees = t.assignees ?? t.assignee_user_id ?? t.assignee_id ?? t.assignee ?? []
  const assignees = normalizeAssigneeIds(rawAssignees)
  const statusId = t.status_id ?? t.statusId ?? statusNameToId(t.status)

  return {
    id: t.task_id ?? t.id,
    hash: t.task_hash ?? t.hash,
    projectId: t.project_id ?? t.projectId,
    title: t.title ?? 'Untitled task',
    description: t.description ?? '',
    dueDate: (t.due_date ?? t.dueDate ?? '')?.slice?.(0, 10) || '',
    status: t.status ?? statusIdToName(statusId),
    statusId,
    priority: t.priority ?? 'Medium',
    assignee: assignees[0] ?? '',
    assignees,
    assigneeName: t.assignee_name ?? t.full_name ?? t.user_name ?? getAssigneeName(t.assignees) ?? '',
    assigneeEmail: t.assignee_email ?? t.email ?? getAssigneeEmail(t.assignees) ?? '',
    rawAssignees: Array.isArray(t.assignees) ? t.assignees : [],
    subtasks: t.subtasks ?? [],
    comments: t.comments ?? [],
    attachments: t.attachments ?? [],
    activity: t.activity ?? []
  }
}

export const taskPayload = (t = {}) => {
  const assignees = normalizeAssigneeIds(t.assignee ?? t.assignee_user_id ?? t.assignee_id ?? t.assignees)

  return {
    title: t.title,
    description: t.description ?? '',
    due_date: t.dueDate || t.due_date || null,
    priority: t.priority ?? 'Medium',
    status_id: t.status_id ?? t.statusId ?? statusNameToId(t.status),
    parent_task_id: t.parent_task_id ?? t.parentTaskId ?? null,
    assignee_user_id: assignees
  }
}

export const projectPayload = (p = {}) => ({
  pj_name: p.name ?? p.pj_name,
  description: p.description ?? ''
})
