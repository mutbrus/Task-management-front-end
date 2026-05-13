import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      { path: '', redirect: '/auth/login' },
      { path: 'login', name: 'login', component: () => import('@/pages/auth/Login.vue') },
      { path: 'register', name: 'register', component: () => import('@/pages/auth/Register.vue') },
      { path: 'forgot', name: 'forgot', component: () => import('@/pages/auth/Forgot.vue') },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'dashboard', meta: { title: 'Home' }, component: () => import('@/pages/dashboard/Dashboard.vue') },
      { path: 'projects', name: 'projects', meta: { title: 'Projects' }, component: () => import('@/pages/projects/Projects.vue') },
      { path: 'projects/:id', name: 'project-detail', meta: { title: 'Project' }, component: () => import('@/pages/projects/ProjectDetail.vue') },
      { path: 'tasks', name: 'tasks', meta: { title: 'My Tasks' }, component: () => import('@/pages/tasks/Tasks.vue') },
      { path: 'board', name: 'board', meta: { title: 'Board' }, component: () => import('@/pages/tasks/Board.vue') },
      { path: 'calendar', name: 'calendar', meta: { title: 'Calendar' }, component: () => import('@/pages/tasks/Calendar.vue') },
      { path: 'members', name: 'members', meta: { title: 'Assigned to me' }, component: () => import('@/pages/members/Members.vue') },
      { path: 'notifications', name: 'notifications', meta: { title: 'Notifications' }, component: () => import('@/pages/dashboard/Notifications.vue') },
      { path: 'settings', name: 'settings', meta: { title: 'Settings' }, component: () => import('@/pages/settings/Settings.vue') },
    ],
  },
  { path: '/:pathMatch(.*)*', component: () => import('@/pages/NotFound.vue') },
]

const router = createRouter({ history: createWebHistory(), routes, scrollBehavior: () => ({ top: 0 }) })

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return { name: 'login', query: { redirect: to.fullPath } }
  if ((to.name === 'login' || to.name === 'register') && auth.isAuthenticated) return { name: 'dashboard' }
})

export default router
