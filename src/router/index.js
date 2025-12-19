import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import { useUserStore } from '@/stores/user'

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
        path: 'tasks/:id?',
        name: 'task-detail',
        component: () => import('@/views/Tasks.vue')
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
        component: () => import('@/views/Marketing.vue'),
        beforeEnter: (to, from, next) => {
          const userStore = useUserStore()
          if (userStore.canAccessMarketing()) {
            next()
          } else {
            next('/access-denied')
          }
        }
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('@/views/Reports.vue'),
        beforeEnter: (to, from, next) => {
          const userStore = useUserStore()
          if (userStore.canAccessReports()) {
            next()
          } else {
            next('/access-denied')
          }
        }
      },
      {
        path: 'access-denied',
        name: 'access-denied',
        component: () => import('@/views/AccessDenied.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
