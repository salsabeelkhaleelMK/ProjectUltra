<template>
  <div class="rounded-card flex flex-col mb-6" style="background-color: var(--base-muted, #f5f5f5)">
    <!-- Title Section -->
    <div class="px-4 py-4 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-user-circle text-heading"></i>
        <h2 class="text-fluid-sm font-medium text-heading leading-5">Leads</h2>
        <span class="ml-1 px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-xs font-bold rounded-full">
          {{ leads.length }}
        </span>
      </div>
      <button
        @click="$emit('add-lead')"
        class="text-fluid-xs text-brand-blue hover:text-brand-blue/80 font-medium flex items-center gap-1 transition-colors"
      >
        <i class="fa-solid fa-plus text-xs"></i>
        <span>Add Lead</span>
      </button>
    </div>
    
    <!-- Card Content -->
    <div class="bg-white rounded-card p-2 shadow-sm flex flex-col" style="box-shadow: var(--nsc-card-shadow);">
      <div v-if="leads.length > 0" class="divide-y divide-gray-100">
        <div
          v-for="lead in leads"
          :key="lead.id"
          class="flex flex-col p-3 hover:bg-surfaceSecondary transition-colors rounded-md group cursor-pointer"
          @click="handleLeadClick(lead)"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-heading uppercase tracking-wider">Lead #{{ lead.id }}</span>
                <span 
                  class="text-xs px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter border"
                  :class="getStageBadgeClass(lead.stage)"
                >
                  {{ lead.stage }}
                </span>
              </div>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-sub">
                <span v-if="lead.assignee" class="flex items-center gap-1">
                  <i class="fa-solid fa-user text-xs"></i>
                  {{ lead.assignee }}
                </span>
                <span v-if="lead.requestedCar" class="flex items-center gap-1">
                  <i class="fa-solid fa-car text-xs"></i>
                  {{ lead.requestedCar.brand }} {{ lead.requestedCar.model }}
                </span>
              </div>
            </div>
            <div class="w-8 h-8 flex items-center justify-center bg-surface border border-black/5 rounded hover:bg-white hover:border-brand-blue/30 text-sub hover:text-brand-blue transition-all shrink-0">
              <i class="fa-solid fa-external-link text-xs"></i>
            </div>
          </div>

          <!-- Nested Tasks for Lead -->
          <div v-if="getLeadTasks(lead).length > 0" class="mt-2 space-y-1.5 border-t border-gray-50 pt-2">
            <div 
              v-for="task in getLeadTasks(lead)" 
              :key="task.id"
              class="flex items-center justify-between p-2 bg-surfaceSecondary/50 border border-black/5 rounded-md"
            >
              <div class="flex items-center gap-2 min-w-0">
                <span 
                  class="text-xs px-1.5 py-0.5 rounded font-black uppercase tracking-widest border"
                  :class="getTaskTypeBadgeClass(task.type)"
                >
                  {{ task.type }}
                </span>
                <span class="text-xs text-body font-medium truncate">{{ task.description }}</span>
              </div>
              <i class="fa-solid fa-chevron-right text-xs text-sub opacity-50"></i>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-8 text-sub">
        <i class="fa-solid fa-inbox text-2xl mb-2 opacity-30"></i>
        <p class="text-xs">No leads associated with this customer</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  leads: {
    type: Array,
    default: () => []
  },
  allTasks: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['add-lead'])

const router = useRouter()

// Helper to calculate days since a date
const calculateDaysSince = (dateString) => {
  if (!dateString) return 0
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Detect active tasks for a lead
const getLeadTasks = (lead) => {
  const tasks = []
  
  // 1. Add manual tasks from allTasks prop
  if (props.allTasks && props.allTasks.length > 0) {
    const manualTasks = props.allTasks.filter(t => t.leadId === lead.id)
    manualTasks.forEach(task => {
      tasks.push({
        id: task.id,
        type: task.title || 'Task',
        description: task.description || task.title
      })
    })
  }

  // 2. Add detected LQ tasks
  if (lead.stage === 'Open Lead') {
    const daysSince = calculateDaysSince(lead.createdAt)
    if (daysSince >= 0) {
      tasks.push({
        id: `lead-${lead.id}-lq`,
        type: 'LQ',
        description: 'Call to Verify Contact Details'
      })
    }
  }
  
  return tasks
}

const getTaskTypeBadgeClass = (type) => {
  const classes = {
    'LQ': 'bg-orange-50 text-orange-600 border-orange-100'
  }
  return classes[type] || 'bg-surface text-body border-gray-100'
}

const getStageBadgeClass = (stage) => {
  const classes = {
    'Open Lead': 'bg-orange-50 text-orange-600 border-orange-100',
    'Validated': 'bg-blue-50 text-blue-600 border-blue-100',
    'Contacted': 'bg-blue-50 text-blue-600 border-blue-100'
  }
  return classes[stage] || 'bg-surfaceSecondary text-body border-gray-100'
}

const handleLeadClick = (lead) => {
  const url = router.resolve({ path: `/tasks/${lead.id}`, query: { type: 'lead' } })
  window.open(url.href, '_blank')
}
</script>
