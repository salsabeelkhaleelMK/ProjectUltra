<template>
  <div class="rounded-card flex flex-col mb-6" style="background-color: var(--base-muted, #f5f5f5)">
    <!-- Title Section -->
    <div class="px-4 py-4 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-briefcase text-heading"></i>
        <h2 class="text-fluid-sm font-medium text-heading leading-5">Opportunities</h2>
        <span class="ml-1 px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-xs font-bold rounded-full">
          {{ opportunities.length }}
        </span>
      </div>
      <button
        @click="$emit('add-opportunity')"
        class="text-fluid-xs text-brand-blue hover:text-brand-blue/80 font-medium flex items-center gap-1 transition-colors"
      >
        <i class="fa-solid fa-plus text-xs"></i>
        <span>Add Opportunity</span>
      </button>
    </div>
    
    <!-- Card Content -->
    <div class="bg-white rounded-lg p-2 shadow-sm flex flex-col" style="box-shadow: var(--nsc-card-shadow);">
      <div v-if="opportunities.length > 0" class="divide-y divide-gray-100">
        <div
          v-for="opp in opportunities"
          :key="opp.id"
          class="flex flex-col p-3 hover:bg-surfaceSecondary transition-colors rounded-md group cursor-pointer"
          @click="handleOpportunityClick(opp)"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-semibold text-heading uppercase tracking-wider">Opp #{{ opp.id }}</span>
                <span 
                  class="text-xs px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter border"
                  :class="getStageBadgeClass(opp.stage)"
                >
                  {{ opp.displayStage || opp.stage }}
                </span>
              </div>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-sub">
                <span v-if="opp.assignee" class="flex items-center gap-1">
                  <i class="fa-solid fa-user text-xs"></i>
                  {{ opp.assignee }}
                </span>
                <span v-if="opp.value" class="flex items-center gap-1">
                  <i class="fa-solid fa-tag text-xs"></i>
                  € {{ formatCurrency(opp.value) }}
                </span>
                <span v-if="opp.vehicle" class="flex items-center gap-1">
                  <i class="fa-solid fa-car text-xs"></i>
                  {{ opp.vehicle.brand }} {{ opp.vehicle.model }}
                </span>
              </div>
            </div>
            <div class="w-8 h-8 flex items-center justify-center bg-surface border border-black/5 rounded hover:bg-white hover:border-brand-blue/30 text-sub hover:text-brand-blue transition-all shrink-0">
              <i class="fa-solid fa-external-link text-xs"></i>
            </div>
          </div>

          <!-- Nested Tasks for Opportunity -->
          <div v-if="getOpportunityTasks(opp).length > 0" class="mt-2 space-y-1.5 border-t border-gray-50 pt-2">
            <div 
              v-for="task in getOpportunityTasks(opp)" 
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
        <p class="text-xs">No opportunities associated with this customer</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { getActiveTaskWidget } from '@/utils/opportunityRules'

const props = defineProps({
  opportunities: {
    type: Array,
    default: () => []
  },
  allTasks: {
    type: Array,
    default: () => []
  },
  activities: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['add-opportunity'])

const router = useRouter()

// Detect active tasks for an opportunity
const getOpportunityTasks = (opportunity) => {
  const tasks = []
  
  // 1. Add manual tasks from allTasks prop
  if (props.allTasks && props.allTasks.length > 0) {
    const manualTasks = props.allTasks.filter(t => t.opportunityId === opportunity.id)
    manualTasks.forEach(task => {
      tasks.push({
        id: task.id,
        type: task.title || 'Task',
        description: task.description || task.title
      })
    })
  }

  // 2. Add detected task widgets using opportunity rules
  const oppActivities = props.activities.filter(a => a.opportunityId === opportunity.id)
  const context = {
    opportunity,
    scheduledAppointment: opportunity.scheduledAppointment || null,
    activities: oppActivities,
    hasOffers: oppActivities.some(a => a.type === 'offer') || false,
    stage: opportunity.displayStage || opportunity.stage,
    deliverySubstatus: opportunity.deliverySubstatus || null
  }
  
  const activeWidget = getActiveTaskWidget(context.stage, context)
  
  if (activeWidget) {
    const widgetLabels = {
      'OOFB': 'Open Opportunity Feedback',
      'UFB': 'Unsold Feedback',
      'NFU': 'No Follow-Up',
      'OFB': 'Offer Feedback',
      'CFB': 'Contract Feedback',
      'DFB': 'Delivery Feedback',
      'NS': 'No-Show Follow-up'
    }
    
    tasks.push({
      id: `opp-${opportunity.id}-${activeWidget}`,
      type: activeWidget,
      description: widgetLabels[activeWidget] || activeWidget
    })
  }
  
  return tasks
}

const getTaskTypeBadgeClass = (type) => {
  const classes = {
    'OOFB': 'bg-blue-50 text-blue-600 border-blue-100',
    'UFB': 'bg-purple-50 text-purple-600 border-purple-100',
    'NFU': 'bg-red-50 text-red-600 border-red-100',
    'OFB': 'bg-yellow-50 text-yellow-600 border-yellow-100',
    'CFB': 'bg-green-50 text-green-600 border-green-100',
    'DFB': 'bg-teal-50 text-teal-600 border-teal-100',
    'NS': 'bg-pink-50 text-pink-600 border-pink-100'
  }
  return classes[type] || 'bg-surface text-body border-gray-100'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const getStageBadgeClass = (stage) => {
  const classes = {
    'Qualified': 'bg-purple-50 text-purple-600 border-purple-100',
    'In Negotiation': 'bg-blue-50 text-blue-600 border-blue-100',
    'Closed Won': 'bg-green-50 text-green-600 border-green-100',
    'Closed Lost': 'bg-red-50 text-red-600 border-red-100'
  }
  return classes[stage] || 'bg-surfaceSecondary text-body border-gray-100'
}

const handleOpportunityClick = (opp) => {
  const url = router.resolve({ path: `/tasks/${opp.id}`, query: { type: 'opportunity' } })
  window.open(url.href, '_blank')
}
</script>
