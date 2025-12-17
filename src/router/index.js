import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        redirect: '/leads/1'
      },
      {
        path: 'contacts',
        name: 'contacts',
        component: () => import('@/views/Contacts.vue')
      },
      {
        path: 'leads',
        name: 'leads',
        component: () => import('@/views/Leads.vue')
      },
      {
        path: 'leads/:id',
        name: 'lead-detail',
        component: () => import('@/views/LeadDetail.vue')
      },
      {
        path: 'opportunities',
        redirect: '/opportunities/1'
      },
      {
        path: 'opportunities/:id',
        name: 'opportunity-detail',
        component: () => import('@/views/OpportunityDetail.vue')
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
