<script setup>
import { computed, ref } from 'vue'
import { priorityColor } from '@/utils/format'

const props = defineProps({ tasks: { type: Array, default: () => [] } })
const emit = defineEmits(['select'])
const cursor = ref(new Date())
const selectedDate = ref('')
const pad = n => String(n).padStart(2, '0')
const toISO = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
const monthTitle = computed(() => cursor.value.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }))
const monthDays = computed(() => {
  const y = cursor.value.getFullYear(); const m = cursor.value.getMonth()
  const first = new Date(y, m, 1); const start = new Date(first)
  start.setDate(first.getDate() - first.getDay())
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start); d.setDate(start.getDate() + i)
    const iso = toISO(d)
    return { iso, day: d.getDate(), currentMonth: d.getMonth() === m, today: iso === toISO(new Date()) }
  })
})
const tasksByDate = computed(() => props.tasks.reduce((acc, task) => {
  if (!task.dueDate) return acc
  ;(acc[task.dueDate] ||= []).push(task)
  return acc
}, {}))
const visibleTasks = computed(() => selectedDate.value ? (tasksByDate.value[selectedDate.value] || []) : props.tasks.filter(t => t.dueDate))
const moveMonth = (step) => { cursor.value = new Date(cursor.value.getFullYear(), cursor.value.getMonth() + step, 1) }
</script>

<template>
  <div class="grid xl:grid-cols-[1fr_320px] gap-5">
    <section class="card overflow-hidden">
      <div class="px-5 py-4 flex items-center justify-between bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white">
        <button class="h-9 w-9 rounded-xl hover:bg-white/15" @click="moveMonth(-1)">‹</button>
        <h2 class="font-black text-lg">{{ monthTitle }}</h2>
        <button class="h-9 w-9 rounded-xl hover:bg-white/15" @click="moveMonth(1)">›</button>
      </div>
      <div class="grid grid-cols-7 text-center text-xs font-bold text-slate-500 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
        <div v-for="d in ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']" :key="d" class="py-3">{{ d }}</div>
      </div>
      <div class="grid grid-cols-7">
        <button v-for="day in monthDays" :key="day.iso" @click="selectedDate = day.iso" :class="['min-h-28 text-left p-2 border-b border-r border-slate-100 dark:border-slate-800 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition', !day.currentMonth && 'opacity-40', selectedDate === day.iso && 'bg-violet-50 dark:bg-violet-950/30']">
          <span :class="['inline-grid h-7 w-7 place-items-center rounded-full text-xs font-black', day.today ? 'bg-violet-600 text-white' : 'text-slate-600 dark:text-slate-300']">{{ day.day }}</span>
          <div class="mt-1 space-y-1">
            <div v-for="task in (tasksByDate[day.iso] || []).slice(0,2)" :key="task.id" class="truncate rounded-lg bg-violet-100 px-2 py-1 text-[11px] font-semibold text-violet-700 dark:bg-violet-500/15 dark:text-violet-200">{{ task.title }}</div>
            <div v-if="(tasksByDate[day.iso] || []).length > 2" class="text-[11px] text-slate-400">+{{ tasksByDate[day.iso].length - 2 }} more</div>
          </div>
        </button>
      </div>
    </section>

    <aside class="card p-4 h-fit">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-black">{{ selectedDate || 'Scheduled tasks' }}</h3>
        <button v-if="selectedDate" class="text-xs font-bold text-violet-600" @click="selectedDate=''">Clear</button>
      </div>
      <div v-if="!visibleTasks.length" class="text-sm text-slate-500 py-8 text-center">No dated tasks found.</div>
      <div v-else class="space-y-2">
        <button v-for="task in visibleTasks" :key="task.id" @click="emit('select', task.id)" class="w-full text-left rounded-2xl border border-slate-200 dark:border-slate-800 p-3 hover:border-violet-300 hover:bg-violet-50/60 dark:hover:bg-violet-950/20 transition">
          <div class="font-bold text-sm">{{ task.title }}</div>
          <div class="mt-2 flex items-center justify-between"><span :class="['badge', priorityColor(task.priority)]">{{ task.priority }}</span><span class="text-xs text-slate-400">{{ task.dueDate }}</span></div>
        </button>
      </div>
    </aside>
  </div>
</template>
