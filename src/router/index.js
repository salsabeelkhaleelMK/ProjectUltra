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
      // {
      //   path: 'home',
      //   name: 'home-dashboard',
      //   component: () => import('@/views/Home.vue')
      // },
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
        path: 'customer/:id',
        name: 'customer-view',
        component: () => import('@/views/Customer.vue'),
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
      // {
      //   path: 'calendar',
      //   name: 'calendar',
      //   component: () => import('@/views/Calendar.vue')
      // },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('@/views/Reports.vue')
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/Settings.vue'),
        beforeEnter: (to, from, next) => {
          const userStore = useUserStore()
          if (userStore.canAccessSettings()) {
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
