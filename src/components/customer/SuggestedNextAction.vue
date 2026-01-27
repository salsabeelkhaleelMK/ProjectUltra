<template>
  <div
    v-if="suggestedActions.length > 0"
    class="rounded-lg flex flex-col mb-6 bg-muted"
  >
    <!-- Title Section -->
    <div class="px-4 py-4 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-lightbulb text-foreground"></i>
        <h2 class="text-sm font-semibold text-foreground leading-5">Suggested Next Action</h2>
      </div>
    </div>

    <!-- Card Content -->
    <div class="bg-white rounded-lg p-2 shadow-nsc-card flex flex-col">
      <div class="divide-y divide-gray-100">
        <!-- Action Description Section -->
        <div class="p-3">
          <p class="text-sm text-muted-foreground leading-relaxed break-words">
            <template v-for="(action, index) in suggestedActions" :key="action.id">
              <template v-if="index > 0">
                <span class="text-muted-foreground"> or </span>
              </template>
              <span class="font-medium text-foreground">{{ action.title }}</span>
              <span class="text-xs text-muted-foreground ml-1">
                ({{ action.type === 'lead' ? 'Lead' : 'Opp' }} #{{ action.entityId }})
              </span>
            </template>
          </p>
        </div>
        
        <!-- Action Buttons Section -->
        <div class="p-3">
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              v-if="suggestedActions.length > 0"
              @click="handleAction(suggestedActions[0])"
              class="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-btn font-medium text-sm transition-all w-full sm:w-auto sm:shrink-0"
            >
              <i :class="suggestedActions[0].icon" class="text-sm"></i>
              <span>{{ suggestedActions[0].label }}</span>
            </button>
            <button
              v-if="suggestedActions.length > 1"
              @click="handleAction(suggestedActions[1])"
              class="flex items-center justify-center gap-2 px-4 py-2 bg-surface border border-border hover:bg-muted text-foreground rounded-btn font-medium text-sm transition-colors w-full sm:w-auto sm:shrink-0"
            >
              <i :class="suggestedActions[1].icon" class="text-sm"></i>
              <span>{{ suggestedActions[1].label }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getPrimaryAction } from '@/utils/opportunityRules'
import { getLeadPrimaryAction } from '@/utils/leadRules'
import { getDisplayStage } from '@/utils/stageMapper'

const props = defineProps({
  leads: {
    type: Array,
    default: () => []
  },
  opportunities: {
    type: Array,
    default: () => []
  },
  activities: {
    type: Array,
    default: () => []
  }
})

const router = useRouter()

// Find active lead (most recent or highest priority, not closed)
const activeLead = computed(() => {
  if (!props.leads || props.leads.length === 0) {
    return null
  }
  
  // Filter out closed/disqualified leads
  const activeLeads = props.leads.filter(lead => {
    if (lead.isDisqualified) return false
    const displayStage = getDisplayStage(lead, 'lead')
    return displayStage !== 'Closed - Invalid' && 
           displayStage !== 'Closed - Not Interested' && 
           displayStage !== 'Closed - Duplicate'
  })
  
  if (activeLeads.length === 0) {
    return null
  }
  
  // Sort by priority (Hot > Medium > Low) then by most recent
  const priorityOrder = { 'Hot': 3, 'Medium': 2, 'Low': 1 }
  activeLeads.sort((a, b) => {
    const aPriority = priorityOrder[a.priority] || 0
    const bPriority = priorityOrder[b.priority] || 0
    if (aPriority !== bPriority) {
      return bPriority - aPriority
    }
    // If same priority, sort by most recent
    const aDate = new Date(a.updatedAt || a.createdAt || 0)
    const bDate = new Date(b.updatedAt || b.createdAt || 0)
    return bDate - aDate
  })
  
  return activeLeads[0]
})

// Find active opportunity (most recent or highest priority, not closed)
const activeOpportunity = computed(() => {
  if (!props.opportunities || props.opportunities.length === 0) {
    return null
  }
  
  // Filter out closed opportunities
  const activeOpps = props.opportunities.filter(opp => {
    const stage = opp.displayStage || opp.stage
    return stage !== 'Closed Won' && stage !== 'Closed Lost' && stage !== 'Abandoned'
  })
  
  if (activeOpps.length === 0) {
    return null
  }
  
  // Sort by priority (Hot > Medium > Low) then by most recent
  const priorityOrder = { 'Hot': 3, 'Medium': 2, 'Low': 1 }
  activeOpps.sort((a, b) => {
    const aPriority = priorityOrder[a.priority] || 0
    const bPriority = priorityOrder[b.priority] || 0
    if (aPriority !== bPriority) {
      return bPriority - aPriority
    }
    // If same priority, sort by most recent
    const aDate = new Date(a.updatedAt || a.createdAt || 0)
    const bDate = new Date(b.updatedAt || b.createdAt || 0)
    return bDate - aDate
  })
  
  return activeOpps[0]
})

// Get primary action for lead
const leadAction = computed(() => {
  if (!activeLead.value) {
    return null
  }
  
  const lead = activeLead.value
  const context = {
    lead: lead,
    displayStage: getDisplayStage(lead, 'lead')
  }
  
  const action = getLeadPrimaryAction(context)
  if (!action) return null
  
  return {
    ...action,
    type: 'lead',
    entityId: lead.id,
    entity: lead
  }
})

// Get primary action for opportunity
const opportunityAction = computed(() => {
  if (!activeOpportunity.value) {
    return null
  }
  
  const opp = activeOpportunity.value
  const oppActivities = props.activities.filter(a => a.opportunityId === opp.id)
  
  // Build context for getPrimaryAction
  const context = {
    opportunity: opp,
    scheduledAppointment: opp.scheduledAppointment || null,
    activities: oppActivities,
    hasOffers: oppActivities.some(a => a.type === 'offer') || false,
    stage: opp.displayStage || opp.stage,
    deliverySubstatus: opp.deliverySubstatus || null,
    formatDateTime: (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }
  
  const action = getPrimaryAction(context.stage, context)
  if (!action) return null
  
  return {
    ...action,
    type: 'opportunity',
    entityId: opp.id,
    entity: opp
  }
})

// Combine both actions into suggested actions array
const suggestedActions = computed(() => {
  const actions = []
  
  if (leadAction.value) {
    actions.push({
      ...leadAction.value,
      id: `lead-${leadAction.value.entityId}`
    })
  }
  
  if (opportunityAction.value) {
    actions.push({
      ...opportunityAction.value,
      id: `opp-${opportunityAction.value.entityId}`
    })
  }
  
  // Sort by priority (Hot > Medium > Low) - leads first if same priority
  const priorityOrder = { 'Hot': 3, 'Medium': 2, 'Low': 1 }
  actions.sort((a, b) => {
    const aEntity = a.entity
    const bEntity = b.entity
    const aPriority = priorityOrder[aEntity?.priority] || 0
    const bPriority = priorityOrder[bEntity?.priority] || 0
    if (aPriority !== bPriority) {
      return bPriority - aPriority
    }
    // If same priority, leads come first
    if (a.type === 'lead' && b.type === 'opportunity') return -1
    if (a.type === 'opportunity' && b.type === 'lead') return 1
    return 0
  })
  
  return actions
})

const handleAction = (action) => {
  if (action.type === 'lead') {
    router.push({ path: `/tasks/${action.entityId}`, query: { type: 'lead' } })
  } else if (action.type === 'opportunity') {
    router.push({ path: `/tasks/${action.entityId}`, query: { type: 'opportunity' } })
  }
}
</script>
