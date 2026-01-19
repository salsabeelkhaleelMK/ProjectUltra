<template>
  <div class="bg-surface border border rounded-card p-6 mb-6">
    <h3 class="text-h3-card text-heading mb-4">Recent Activities</h3>
    
    <div class="space-y-4">
      <!-- Next Appointment -->
      <div v-if="nextAppointment" class="flex items-start justify-between gap-4 p-4 bg-surfaceSecondary rounded-lg border border-E5E7EB">
        <div class="flex items-start gap-3 flex-1 min-w-0">
          <div class="w-10 h-10 rounded bg-brand-blue/10 flex items-center justify-center shrink-0">
            <i class="fa-solid fa-calendar-check text-brand-blue text-lg"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-heading mb-1">Next Appointment</div>
            <div class="text-sm text-body">{{ formatAppointmentDate(nextAppointment.start) }}</div>
            <div class="text-xs text-sub mt-1">{{ nextAppointment.title || 'Appointment' }}</div>
          </div>
        </div>
        <button
          @click="viewAppointmentDetails"
          class="px-4 py-2 bg-brand-red text-white rounded-btn hover:brightness-90 transition-all shrink-0 text-sm font-medium"
        >
          View Details
        </button>
      </div>
      
      <!-- Last Communication -->
      <div v-if="lastCommunication" class="flex items-start justify-between gap-4 p-4 bg-surfaceSecondary rounded-lg border border-E5E7EB">
        <div class="flex items-start gap-3 flex-1 min-w-0">
          <div class="w-10 h-10 rounded bg-brand-slate/10 flex items-center justify-center shrink-0">
            <i :class="getCommunicationIcon(lastCommunication.type)" class="text-brand-slate text-lg"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-heading mb-1">Last Communication</div>
            <div class="text-sm text-body line-clamp-2">{{ getCommunicationPreview(lastCommunication) }}</div>
            <div class="text-xs text-sub mt-1">{{ formatDate(lastCommunication.timestamp) }}</div>
          </div>
        </div>
        <button
          @click="viewCommunicationDetails"
          class="px-4 py-2 bg-brand-red text-white rounded-btn hover:brightness-90 transition-all shrink-0 text-sm font-medium"
        >
          View Details
        </button>
      </div>
      
      <!-- Active Lead Next Action -->
      <div v-if="activeLead" class="flex items-start justify-between gap-4 p-4 bg-surfaceSecondary rounded-lg border border-E5E7EB">
        <div class="flex items-start gap-3 flex-1 min-w-0">
          <div class="w-10 h-10 rounded bg-brand-red/10 flex items-center justify-center shrink-0">
            <i class="fa-solid fa-user-clock text-brand-red text-lg"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-heading mb-1">Active Lead Request</div>
            <div class="text-sm text-body">{{ activeLeadNextAction?.label || 'No action defined' }}</div>
            <div class="text-xs text-sub mt-1">{{ activeLead.requestedCar?.brand }} {{ activeLead.requestedCar?.model }}</div>
          </div>
        </div>
        <button
          @click="viewLeadDetails"
          class="px-4 py-2 bg-brand-red text-white rounded-btn hover:brightness-90 transition-all shrink-0 text-sm font-medium"
        >
          View Details
        </button>
      </div>
      
      <!-- Active Opportunity Next Action -->
      <div v-if="activeOpportunity" class="flex items-start justify-between gap-4 p-4 bg-surfaceSecondary rounded-lg border border-E5E7EB">
        <div class="flex items-start gap-3 flex-1 min-w-0">
          <div class="w-10 h-10 rounded bg-brand-blue/10 flex items-center justify-center shrink-0">
            <i class="fa-solid fa-handshake text-brand-blue text-lg"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-heading mb-1">Active Opportunity</div>
            <div class="text-sm text-body">{{ activeOpportunityNextAction?.label || 'No action defined' }}</div>
            <div class="text-xs text-sub mt-1">{{ activeOpportunity.vehicle?.brand }} {{ activeOpportunity.vehicle?.model }} - {{ activeOpportunity.stage }}</div>
          </div>
        </div>
        <button
          @click="viewOpportunityDetails"
          class="px-4 py-2 bg-brand-red text-white rounded-btn hover:brightness-90 transition-all shrink-0 text-sm font-medium"
        >
          View Details
        </button>
      </div>
      
      <!-- Empty State -->
      <div v-if="!nextAppointment && !lastCommunication && !activeLead && !activeOpportunity" class="text-center py-8 text-sub">
        <i class="fa-solid fa-inbox text-3xl mb-2 opacity-50"></i>
        <p class="text-sm">No recent activities available</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getLeadPrimaryAction } from '@/utils/leadRules'
import { getPrimaryAction } from '@/utils/opportunityRules'

const props = defineProps({
  nextAppointment: {
    type: Object,
    default: null
  },
  activities: {
    type: Array,
    default: () => []
  },
  leads: {
    type: Array,
    default: () => []
  },
  opportunities: {
    type: Array,
    default: () => []
  },
  customerId: {
    type: [Number, String],
    default: null
  }
})

const router = useRouter()

// Get last communication message
const lastCommunication = computed(() => {
  const communicationTypes = ['email', 'sms', 'whatsapp', 'call']
  const communications = props.activities
    .filter(activity => communicationTypes.includes(activity.type))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  
  return communications.length > 0 ? communications[0] : null
})

// Get active lead (not closed/disqualified)
const activeLead = computed(() => {
  const activeLeads = props.leads.filter(lead => {
    return !lead.isDisqualified && 
           lead.status !== 'Disqualified' && 
           !lead.stage?.includes('Closed')
  })
  return activeLeads.length > 0 ? activeLeads[0] : null
})

// Get active lead next action
const activeLeadNextAction = computed(() => {
  if (!activeLead.value) return null
  try {
    const action = getLeadPrimaryAction({
      lead: activeLead.value,
      displayStage: activeLead.value.stage
    })
    return action
  } catch (err) {
    console.error('Error getting lead next action:', err)
    return null
  }
})

// Get active opportunity (not closed)
const activeOpportunity = computed(() => {
  const activeOpps = props.opportunities.filter(opp => {
    return opp.stage !== 'Closed Won' && opp.stage !== 'Closed Lost'
  })
  return activeOpps.length > 0 ? activeOpps[0] : null
})

// Get active opportunity next action
const activeOpportunityNextAction = computed(() => {
  if (!activeOpportunity.value) return null
  try {
    const oppActivities = props.activities.filter(a => a.opportunityId === activeOpportunity.value.id) || []
    const action = getPrimaryAction(activeOpportunity.value.stage, {
      opportunity: activeOpportunity.value,
      scheduledAppointment: activeOpportunity.value.scheduledAppointment || null,
      activities: oppActivities,
      hasOffers: oppActivities.some(a => a.type === 'offer') || false,
      stage: activeOpportunity.value.stage,
      deliverySubstatus: activeOpportunity.value.deliverySubstatus || null,
      formatDateTime: (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    })
    return action
  } catch (err) {
    console.error('Error getting opportunity next action:', err)
    return null
  }
})

// Helper functions
const getCommunicationIcon = (type) => {
  const icons = {
    email: 'fa-solid fa-envelope',
    sms: 'fa-solid fa-message',
    whatsapp: 'fa-brands fa-whatsapp',
    call: 'fa-solid fa-phone'
  }
  return icons[type] || 'fa-solid fa-comment'
}

const getCommunicationPreview = (activity) => {
  if (activity.type === 'call') {
    return activity.content || `Call with ${activity.user || 'customer'}`
  }
  if (activity.type === 'email') {
    return activity.subject || activity.content || 'Email communication'
  }
  if (activity.type === 'sms' || activity.type === 'whatsapp') {
    return activity.content || `${activity.type.toUpperCase()} message`
  }
  return activity.content || 'Communication'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'Today'
  if (diffDays === 2) return 'Yesterday'
  if (diffDays <= 7) return `${diffDays - 1} days ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })
}

const formatAppointmentDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  
  if (isToday) {
    return `Today at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
  }
  
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const isTomorrow = date.toDateString() === tomorrow.toDateString()
  
  if (isTomorrow) {
    return `Tomorrow at ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
  }
  
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Navigation handlers
const viewAppointmentDetails = () => {
  if (props.nextAppointment?.opportunityId) {
    router.push({ path: `/tasks/${props.nextAppointment.opportunityId}`, query: { type: 'opportunity' } })
  } else if (props.nextAppointment?.leadId) {
    router.push({ path: `/tasks/${props.nextAppointment.leadId}`, query: { type: 'lead' } })
  } else {
    router.push({ path: '/calendar' })
  }
}

const viewCommunicationDetails = () => {
  if (lastCommunication.value?.opportunityId) {
    router.push({ path: `/tasks/${lastCommunication.value.opportunityId}`, query: { type: 'opportunity' } })
  } else if (lastCommunication.value?.leadId) {
    router.push({ path: `/tasks/${lastCommunication.value.leadId}`, query: { type: 'lead' } })
  }
}

const viewLeadDetails = () => {
  if (activeLead.value?.id) {
    router.push({ path: `/tasks/${activeLead.value.id}`, query: { type: 'lead' } })
  }
}

const viewOpportunityDetails = () => {
  if (activeOpportunity.value?.id) {
    router.push({ path: `/tasks/${activeOpportunity.value.id}`, query: { type: 'opportunity' } })
  }
}
</script>
