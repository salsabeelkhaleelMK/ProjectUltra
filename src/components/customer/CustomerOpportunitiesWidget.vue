<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
    <div class="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-briefcase text-gray-400 text-xs"></i>
        <h3 class="font-bold text-gray-900 text-sm">Opportunities</h3>
        <span v-if="opportunities.length > 0" class="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
          {{ opportunities.length }}
        </span>
      </div>
      <button 
        @click.stop="$emit('add-opportunity')"
        class="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 transition-colors"
      >
        <i class="fa-solid fa-plus-circle"></i>
        Add Opportunity
      </button>
    </div>
    
    <div v-if="opportunities.length === 0" class="p-6 text-center text-gray-400">
      <i class="fa-solid fa-inbox text-2xl mb-2"></i>
      <p class="text-sm">No opportunities associated with this customer</p>
    </div>
    
    <div v-else class="p-4 space-y-3">
      <div
        v-for="opp in opportunities"
        :key="opp.id"
        class="flex flex-col p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg cursor-pointer transition-colors"
        @click="handleOpportunityClick(opp)"
      >
        <div class="flex items-center justify-between mb-2">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold text-gray-900 text-sm">Opportunity #{{ opp.id }}</span>
              <span 
                class="text-xs px-2 py-0.5 rounded-full font-medium"
                :class="getStageBadgeClass(opp.stage)"
              >
                {{ opp.displayStage || opp.stage }}
              </span>
            </div>
            <div class="flex items-center gap-3 text-xs text-gray-500">
              <span v-if="opp.assignee">{{ opp.assignee }}</span>
              <span v-if="opp.value">€ {{ formatCurrency(opp.value) }}</span>
              <span v-if="opp.vehicle">{{ opp.vehicle.brand }} {{ opp.vehicle.model }}</span>
            </div>
          </div>
          <i class="fa-solid fa-external-link text-gray-400 text-xs ml-2"></i>
        </div>

        <!-- Nested Tasks for Opportunity -->
        <div v-if="getOpportunityTasks(opp).length > 0" class="mt-2 space-y-2 border-t border-gray-200 pt-2">
          <div 
            v-for="task in getOpportunityTasks(opp)" 
            :key="task.id"
            class="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-md shadow-sm"
          >
            <div class="flex items-center gap-2">
              <span 
                class="text-xs px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider"
                :class="getTaskTypeBadgeClass(task.type)"
              >
                {{ task.type }}
              </span>
              <span class="text-xs text-gray-700 font-medium">{{ task.description }}</span>
            </div>
            <i class="fa-solid fa-chevron-right text-xs text-gray-300"></i>
          </div>
        </div>
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
    'OOFB': 'bg-blue-100 text-blue-700 border border-blue-200',
    'UFB': 'bg-purple-100 text-purple-700 border border-purple-200',
    'NFU': 'bg-red-100 text-red-700 border border-red-200',
    'OFB': 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    'CFB': 'bg-green-100 text-green-700 border border-green-200',
    'DFB': 'bg-teal-100 text-teal-700 border border-teal-200',
    'NS': 'bg-pink-100 text-pink-700 border border-pink-200'
  }
  return classes[type] || 'bg-gray-100 text-gray-700 border border-gray-200'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const getStageBadgeClass = (stage) => {
  const classes = {
    'Qualified': 'bg-purple-100 text-purple-700 border border-purple-200',
    'In Negotiation': 'bg-blue-100 text-blue-700 border border-blue-200',
    'Closed Won': 'bg-green-100 text-green-700 border border-green-200',
    'Closed Lost': 'bg-red-100 text-red-700 border border-red-200'
  }
  return classes[stage] || 'bg-gray-100 text-gray-700 border border-gray-200'
}

const handleOpportunityClick = (opp) => {
  const url = router.resolve({ path: `/tasks/${opp.id}`, query: { type: 'opportunity' } })
  window.open(url.href, '_blank')
}
</script>

