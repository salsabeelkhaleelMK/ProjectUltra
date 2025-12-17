import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        redirect: '/tasks/1'
      },
      {
        path: 'contacts',
        name: 'contacts',
        component: () => import('@/views/Contacts.vue')
      },
      {
        path: 'tasks/:id',
        name: 'task-detail',
        component: () => import('@/views/TaskDetail.vue')
      },
      {
        path: 'leads',
        redirect: '/tasks/1?type=lead'
      },
      {
        path: 'leads/:id',
        redirect: to => `/tasks/${to.params.id}?type=lead`
      },
      {
        path: 'opportunities',
        redirect: '/tasks/1?type=opportunity'
      },
      {
        path: 'opportunities/:id',
        redirect: to => `/tasks/${to.params.id}?type=opportunity`
      },
      {
        path: 'vehicles',
        name: 'vehicles',
        component: () => import('@/views/Vehicles.vue')
      },
      {
        path: 'pipeline',
        name: 'pipeline',
        component: () => import('@/views/Pipeline.vue')
      },
      {
        path: 'calendar',
        name: 'calendar',
        component: () => import('@/views/Calendar.vue')
      },
      {
        path: 'marketing',
        name: 'marketing',
        component: () => import('@/views/Marketing.vue')
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('@/views/Reports.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
