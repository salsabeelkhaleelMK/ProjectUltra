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
        name: 'home',
        redirect: '/tasks'
      },
      {
        path: 'home',
        name: 'home-dashboard',
        component: () => import('@/views/Home.vue')
      },
      {
        path: 'action-items',
        name: 'action-items',
        component: () => import('@/views/ActionItems.vue'),
        beforeEnter: (to, from, next) => {
          const userStore = useUserStore()
          // Allow all roles to see action items page (different questions per role)
          if (userStore.isSalesman() || userStore.isManager() || userStore.isOperator()) {
            next()
          } else {
            next('/tasks')
          }
        }
      },
      {
        path: 'add-new',
        name: 'add-new',
        component: () => import('@/views/AddNew.vue')
      },
      {
        path: 'tasks/:id?',
        name: 'task-detail',
        component: () => import('@/views/Tasks.vue')
      },
      {
        path: 'lead/:id',
        name: 'lead-view',
        component: () => import('@/views/Lead.vue'),
        props: true
      },
      {
        path: 'vehicles',
        name: 'vehicles',
        component: () => import('@/views/Vehicles.vue')
      },
      {
        path: 'customers',
        name: 'customers',
        component: () => import('@/views/Customers.vue')
      },
      {
        path: 'calendar',
        name: 'calendar',
        component: () => import('@/views/Calendar.vue')
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
