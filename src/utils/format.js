export const initials = (name='') => name.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase()
export const formatDate = (iso) => {
  if(!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})
}
export const relativeDate = (iso) => {
  if(!iso) return ''
  const d = new Date(iso); const now = new Date()
  const diff = Math.round((d - now)/(1000*60*60*24))
  if(diff===0) return 'Today'
  if(diff===1) return 'Tomorrow'
  if(diff===-1) return 'Yesterday'
  if(diff>0) return `In ${diff}d`
  return `${Math.abs(diff)}d ago`
}
export const priorityColor = (p) => ({
  High: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  Low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
}[p] || 'bg-slate-100 text-slate-700')
export const statusColor = (s) => ({
  Todo: 'bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200',
  'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  Review: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300',
  Done: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
}[s] || 'bg-slate-100 text-slate-700')
export const STATUSES = ['Todo','In Progress','Review','Done']
export const PRIORITIES = ['Low','Medium','High']
