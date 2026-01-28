<template>
  <div>
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-4 px-1">
      <div class="flex items-center gap-2">
        <Briefcase class="w-4 h-4 shrink-0 text-foreground" />
        <h2 class="text-sm font-semibold text-foreground leading-5">Opportunities</h2>
        <Badge
          :text="String(opportunities.length)"
          size="small"
          theme="blue"
        />
      </div>
      <button
        @click="$emit('add-opportunity')"
        class="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
      >
        <Plus class="w-3 h-3 shrink-0" />
        <span>Add Opportunity</span>
      </button>
    </div>
    
    <!-- Feed Items -->
    <div v-if="opportunities.length > 0" class="space-y-4 mb-6 px-1">
      <div
        v-for="opp in opportunities"
        :key="opp.id"
        class="bg-white border border-border rounded-xl p-4 shadow-nsc-card flex gap-4 animate-fade-in feed-item cursor-pointer transition-shadow"
        @click="handleOpportunityClick(opp)"
      >
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border bg-purple-100 text-purple-600 border-purple-200"
        >
          <Briefcase class="w-4 h-4 shrink-0" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-bold text-foreground">Opp #{{ opp.id }}</span>
            <Badge
              :text="opp.displayStage || opp.stage"
              size="small"
              :theme="getStageTheme(opp.displayStage || opp.stage)"
            />
            <div class="ml-auto relative">
              <button 
                @click.stop="handleOpportunityClick(opp)"
                class="text-gray-400 hover:text-muted-foreground transition-colors p-1"
                title="Open in new tab"
              >
                <ExternalLink class="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
          <div class="text-sm text-muted-foreground">
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mb-2">
              <span v-if="opp.assignee" class="flex items-center gap-1">
                <User class="w-3 h-3 shrink-0" />
                {{ opp.assignee }}
              </span>
              <span v-if="opp.value" class="flex items-center gap-1">
                <Tag class="w-3 h-3 shrink-0" />
                € {{ formatCurrency(opp.value) }}
              </span>
              <span v-if="opp.vehicle" class="flex items-center gap-1">
                <Car class="w-3 h-3 shrink-0" />
                {{ opp.vehicle.brand }} {{ opp.vehicle.model }}
              </span>
            </div>

            <!-- Nested Tasks for Opportunity -->
            <div v-if="getOpportunityTasks(opp).length > 0" class="mt-2 space-y-1.5 border-t border-gray-100 pt-2">
              <div 
                v-for="task in getOpportunityTasks(opp)" 
                :key="task.id"
                class="flex items-center justify-between p-2 bg-muted/50 border border-border rounded-md"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <Badge
                    :text="task.type"
                    size="small"
                    :theme="getTaskTheme(task.type)"
                  />
                  <span class="text-xs text-muted-foreground font-medium truncate">{{ task.description }}</span>
                </div>
                <ChevronRight class="w-3 h-3 shrink-0 text-muted-foreground opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="text-center py-8 text-muted-foreground mb-6">
      <Inbox class="w-6 h-6 shrink-0 mb-2 opacity-30" />
      <p class="text-xs">No opportunities associated with this customer</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Briefcase, Plus, ExternalLink, User, Tag, Car, ChevronRight, Inbox } from 'lucide-vue-next'
import { Badge } from '@motork/component-library/future/primitives'
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

const getTaskTheme = (type) => {
  const themes = {
    'OOFB': 'blue',
    'UFB': 'gray',
    'NFU': 'red',
    'OFB': 'blue',
    'CFB': 'green',
    'DFB': 'blue',
    'NS': 'red'
  }
  return themes[type] || 'gray'
}

const getStageTheme = (stage) => {
  if (stage === 'Qualified' || stage === 'In Negotiation') return 'blue'
  if (stage === 'Closed Won') return 'green'
  if (stage === 'Closed Lost') return 'red'
  return 'gray'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const handleOpportunityClick = (opp) => {
  const url = router.resolve({ path: `/tasks/${opp.id}`, query: { type: 'opportunity' } })
  window.open(url.href, '_blank')
}
</script>
