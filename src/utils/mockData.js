export const mockUsers = [
  { id: 'u1', name: 'Alex Morgan', email: 'alex@taskflow.app', avatar: 'AM', role: 'Admin' },
  { id: 'u2', name: 'Sara Chen', email: 'sara@taskflow.app', avatar: 'SC', role: 'Member' },
  { id: 'u3', name: 'Jordan Lee', email: 'jordan@taskflow.app', avatar: 'JL', role: 'Member' },
  { id: 'u4', name: 'Priya Patel', email: 'priya@taskflow.app', avatar: 'PP', role: 'Member' },
  { id: 'u5', name: 'Diego Ramos', email: 'diego@taskflow.app', avatar: 'DR', role: 'Viewer' },
]

export const mockProjects = [
  { id: 'p1', name: 'Website Redesign', description: 'Marketing site refresh with new brand.', color: 'bg-brand-500', status: 'In Progress', progress: 62, members: ['u1','u2','u3'], createdAt: '2025-03-12' },
  { id: 'p2', name: 'Mobile App v2', description: 'iOS & Android revamp.', color: 'bg-emerald-500', status: 'Planning', progress: 18, members: ['u1','u4'], createdAt: '2025-03-20' },
  { id: 'p3', name: 'Q2 Marketing Campaign', description: 'Spring product launch campaign.', color: 'bg-amber-500', status: 'In Progress', progress: 45, members: ['u2','u3','u5'], createdAt: '2025-04-01' },
  { id: 'p4', name: 'Internal Dashboard', description: 'Analytics dashboard for ops.', color: 'bg-purple-500', status: 'Done', progress: 100, members: ['u1','u3'], createdAt: '2025-02-08' },
]

const today = new Date()
const day = (offset) => new Date(today.getFullYear(), today.getMonth(), today.getDate()+offset).toISOString().slice(0,10)

export const mockTasks = [
  { id: 't1', projectId: 'p1', title: 'Design new landing hero', description: 'Explore 3 hero directions and present.', status: 'In Progress', priority: 'High', assignee: 'u2', dueDate: day(2), subtasks: [{id:'s1',title:'Mood board',done:true},{id:'s2',title:'Wireframes',done:true},{id:'s3',title:'Hi-fi mockups',done:false}], comments: [{id:'c1',user:'u1',text:'Looking great so far!',at:day(-1)}], attachments: [{name:'hero-v1.fig',size:'2.4 MB'}], activity: [{at:day(-2),text:'Sara created this task'}] },
  { id: 't2', projectId: 'p1', title: 'Migrate blog to new CMS', description: '', status: 'Todo', priority: 'Medium', assignee: 'u3', dueDate: day(7), subtasks: [], comments: [], attachments: [], activity: [] },
  { id: 't3', projectId: 'p1', title: 'SEO audit', description: 'Run a full audit and prioritize fixes.', status: 'Review', priority: 'Medium', assignee: 'u1', dueDate: day(1), subtasks: [], comments: [], attachments: [], activity: [] },
  { id: 't4', projectId: 'p1', title: 'Launch checklist', description: '', status: 'Done', priority: 'Low', assignee: 'u2', dueDate: day(-3), subtasks: [], comments: [], attachments: [], activity: [] },
  { id: 't5', projectId: 'p2', title: 'Define MVP scope', description: '', status: 'In Progress', priority: 'High', assignee: 'u4', dueDate: day(5), subtasks: [], comments: [], attachments: [], activity: [] },
  { id: 't6', projectId: 'p2', title: 'Auth flow research', description: '', status: 'Todo', priority: 'Medium', assignee: 'u1', dueDate: day(10), subtasks: [], comments: [], attachments: [], activity: [] },
  { id: 't7', projectId: 'p3', title: 'Email sequence drafts', description: '', status: 'Review', priority: 'High', assignee: 'u5', dueDate: day(3), subtasks: [], comments: [], attachments: [], activity: [] },
  { id: 't8', projectId: 'p3', title: 'Landing page copy', description: '', status: 'In Progress', priority: 'Medium', assignee: 'u3', dueDate: day(4), subtasks: [], comments: [], attachments: [], activity: [] },
  { id: 't9', projectId: 'p3', title: 'Influencer shortlist', description: '', status: 'Todo', priority: 'Low', assignee: 'u2', dueDate: day(8), subtasks: [], comments: [], attachments: [], activity: [] },
  { id: 't10', projectId: 'p4', title: 'Ship v1.0', description: '', status: 'Done', priority: 'High', assignee: 'u1', dueDate: day(-10), subtasks: [], comments: [], attachments: [], activity: [] },
]

export const mockNotifications = [
  { id: 'n1', type: 'task', text: 'Sara assigned you "Design new landing hero"', read: false, at: day(0) },
  { id: 'n2', type: 'project', text: 'You were invited to "Mobile App v2"', read: false, at: day(-1) },
  { id: 'n3', type: 'task', text: 'Jordan commented on "SEO audit"', read: true, at: day(-2) },
  { id: 'n4', type: 'task', text: 'Task "Launch checklist" was marked Done', read: true, at: day(-3) },
]
