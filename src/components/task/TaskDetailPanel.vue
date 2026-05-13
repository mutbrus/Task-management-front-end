<script setup>
import { computed, ref, watch } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { useUsersStore } from '@/stores/users'
import { useUiStore } from '@/stores/ui'
import { commentsService } from '@/services/comments.service'
import { statusColor, priorityColor, formatDate, STATUSES, PRIORITIES } from '@/utils/format'
import Avatar from '@/components/ui/Avatar.vue'

const props = defineProps({ taskId: String })
const emit = defineEmits(['close'])
const tasks = useTasksStore(); const users = useUsersStore(); const ui = useUiStore()
const task = computed(() => tasks.items.find(t => t.id === props.taskId))
const newSubtask = ref(''); const newComment = ref(''); const tab = ref('comments')
const userName = (id) => users.items.find(u=>u.id===id)?.name || 'Unassigned'
const update = (patch) => tasks.update(task.value.id, patch)
const addSubtask = async () => { if(!newSubtask.value) return; const subs=[...task.value.subtasks,{id:'s'+Date.now(),title:newSubtask.value,done:false}]; await update({subtasks:subs}); newSubtask.value=''; ui.toast('Subtask added') }
const toggleSub = (s) => update({ subtasks: task.value.subtasks.map(x => x.id===s.id ? {...x,done:!x.done} : x) })
const addComment = async () => { if(!newComment.value) return; const c = await commentsService.add(task.value.id, newComment.value); await update({ comments: [...task.value.comments, c] }); newComment.value=''; ui.toast('Comment added') }
</script>
<template>
  <Transition enter-active-class="transition" enter-from-class="opacity-0" leave-active-class="transition" leave-to-class="opacity-0">
    <div v-if="task" class="fixed inset-0 z-40">
      <div class="absolute inset-0 bg-slate-900/40" @click="emit('close')"></div>
      <Transition enter-active-class="transition transform duration-300" enter-from-class="translate-x-full" leave-active-class="transition transform duration-300" leave-to-class="translate-x-full" appear>
        <aside class="absolute right-0 top-0 h-full w-full max-w-xl bg-white dark:bg-slate-950 shadow-2xl overflow-y-auto scrollbar-thin">
          <div class="sticky top-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between z-10">
            <div class="text-sm text-slate-500">Task details</div>
            <button class="btn-ghost !p-1.5" @click="emit('close')">
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="p-6 space-y-6">
            <input :value="task.title" @change="update({title:$event.target.value})" class="text-xl font-bold w-full bg-transparent border-0 focus:outline-none" />
            <textarea :value="task.description" @change="update({description:$event.target.value})" rows="3" placeholder="Add a description..." class="input"></textarea>

            <div class="grid grid-cols-2 gap-4 text-sm">
              <div><div class="label">Status</div>
                <select :value="task.status" @change="update({status:$event.target.value})" class="input"><option v-for="s in STATUSES" :key="s">{{ s }}</option></select>
              </div>
              <div><div class="label">Priority</div>
                <select :value="task.priority" @change="update({priority:$event.target.value})" class="input"><option v-for="p in PRIORITIES" :key="p">{{ p }}</option></select>
              </div>
              <div><div class="label">Assignee</div>
                <select :value="task.assignee" @change="update({assignee:$event.target.value})" class="input">
                  <option v-for="u in users.items" :key="u.id" :value="u.id">{{ u.name }}</option>
                </select>
              </div>
              <div><div class="label">Due date</div>
                <input type="date" :value="task.dueDate" @change="update({dueDate:$event.target.value})" class="input" />
              </div>
            </div>

            <div>
              <h3 class="font-semibold mb-2">Subtasks ({{ task.subtasks.filter(s=>s.done).length }}/{{ task.subtasks.length }})</h3>
              <div class="space-y-1.5">
                <label v-for="s in task.subtasks" :key="s.id" class="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <input type="checkbox" :checked="s.done" @change="toggleSub(s)" class="rounded border-slate-300" />
                  <span :class="['text-sm', s.done && 'line-through text-slate-400']">{{ s.title }}</span>
                </label>
              </div>
              <div class="flex gap-2 mt-2">
                <input v-model="newSubtask" @keyup.enter="addSubtask" class="input" placeholder="Add subtask..." />
                <button class="btn-secondary" @click="addSubtask">Add</button>
              </div>
            </div>

            <div>
              <div class="flex gap-2 border-b border-slate-200 dark:border-slate-800 mb-3">
                <button v-for="t in ['comments','attachments','activity']" :key="t" @click="tab=t" :class="['px-3 py-2 text-sm font-medium capitalize border-b-2 -mb-px', tab===t?'border-brand-500 text-brand-600':'border-transparent text-slate-500']">{{ t }}</button>
              </div>
              <div v-if="tab==='comments'" class="space-y-3">
                <div v-for="c in task.comments" :key="c.id" class="flex gap-3">
                  <Avatar :name="userName(c.user)" size="sm" />
                  <div class="flex-1"><div class="text-sm"><strong>{{ userName(c.user) }}</strong> <span class="text-xs text-slate-500 ml-1">{{ c.at }}</span></div><div class="text-sm text-slate-700 dark:text-slate-300 mt-0.5">{{ c.text }}</div></div>
                </div>
                <div v-if="!task.comments.length" class="text-sm text-slate-500 text-center py-4">No comments yet</div>
                <div class="flex gap-2 pt-2">
                  <input v-model="newComment" @keyup.enter="addComment" class="input" placeholder="Write a comment..." />
                  <button class="btn-primary" @click="addComment">Post</button>
                </div>
              </div>
              <div v-else-if="tab==='attachments'">
                <div v-if="!task.attachments.length" class="text-sm text-slate-500 text-center py-4">No attachments</div>
                <div v-for="a in task.attachments" :key="a.name" class="flex items-center gap-3 p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <div class="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 grid place-items-center">📎</div>
                  <div class="flex-1"><div class="text-sm font-medium">{{ a.name }}</div><div class="text-xs text-slate-500">{{ a.size }}</div></div>
                </div>
                <button class="btn-secondary mt-3 w-full">+ Upload file</button>
              </div>
              <div v-else>
                <div v-if="!task.activity.length" class="text-sm text-slate-500 text-center py-4">No activity yet</div>
                <div v-for="(a,i) in task.activity" :key="i" class="flex gap-3 py-2 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                  <div class="h-2 w-2 rounded-full bg-brand-500 mt-1.5"></div>
                  <div class="text-sm flex-1"><div>{{ a.text }}</div><div class="text-xs text-slate-500 mt-0.5">{{ a.at }}</div></div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </Transition>
    </div>
  </Transition>
</template>
