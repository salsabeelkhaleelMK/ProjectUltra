<template>
  <div class="rounded-[12px] flex flex-col mb-6" style="background-color: var(--base-muted, #f5f5f5)">
    <!-- Title Section -->
    <div class="px-4 py-4 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-clock-rotate-left text-heading"></i>
        <h2 class="text-fluid-sm font-medium text-heading leading-5">Recent Activities</h2>
      </div>
    </div>
    
    <!-- Card Content -->
    <div class="bg-white rounded-lg p-2 shadow-sm flex flex-col" style="box-shadow: var(--nsc-card-shadow);">
      <div class="divide-y divide-gray-100">
        <!-- Next Appointment -->
        <div v-if="nextAppointment" class="flex items-center justify-between gap-3 p-3 hover:bg-surfaceSecondary transition-colors rounded-md group">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-8 h-8 rounded bg-brand-blue/10 flex items-center justify-center shrink-0">
              <i class="fa-solid fa-calendar-check text-brand-blue text-sm"></i>
            </div>
            <div class="min-w-0">
              <div class="text-xs font-semibold text-heading uppercase tracking-wider mb-0.5">Next Appointment</div>
              <div class="text-sm text-body truncate">{{ formatAppointmentDate(nextAppointment.start) }}</div>
              <div class="text-[10px] text-sub truncate">{{ nextAppointment.title || 'Appointment' }}</div>
            </div>
          </div>
          <button
            @click="viewAppointmentDetails"
            class="w-8 h-8 flex items-center justify-center bg-surface border border-black/5 rounded hover:bg-white hover:border-brand-blue/30 text-sub hover:text-brand-blue transition-all shrink-0"
            title="View Details"
          >
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </div>
        
        <!-- Last Communication -->
        <div v-if="lastCommunication" class="flex items-center justify-between gap-3 p-3 hover:bg-surfaceSecondary transition-colors rounded-md group">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-8 h-8 rounded bg-brand-slate/10 flex items-center justify-center shrink-0">
              <i :class="getCommunicationIcon(lastCommunication.type)" class="text-brand-slate text-sm"></i>
            </div>
            <div class="min-w-0">
              <div class="text-xs font-semibold text-heading uppercase tracking-wider mb-0.5">Last Communication</div>
              <div class="text-sm text-body truncate">{{ getCommunicationPreview(lastCommunication) }}</div>
              <div class="text-[10px] text-sub truncate">{{ formatDate(lastCommunication.timestamp) }}</div>
            </div>
          </div>
          <button
            @click="viewCommunicationDetails"
            class="w-8 h-8 flex items-center justify-center bg-surface border border-black/5 rounded hover:bg-white hover:border-brand-slate/30 text-sub hover:text-brand-slate transition-all shrink-0"
            title="View Details"
          >
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </div>
        
        <!-- Active Lead Next Action -->
        <div v-if="activeLead" class="flex items-center justify-between gap-3 p-3 hover:bg-surfaceSecondary transition-colors rounded-md group">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-8 h-8 rounded bg-brand-dark/10 flex items-center justify-center shrink-0">
              <i class="fa-solid fa-user-clock text-brand-dark text-sm"></i>
            </div>
            <div class="min-w-0">
              <div class="text-xs font-semibold text-heading uppercase tracking-wider mb-0.5">Active Lead Request</div>
              <div class="text-sm text-body truncate">{{ activeLeadNextAction?.label || 'No action defined' }}</div>
              <div class="text-[10px] text-sub truncate">{{ activeLead.requestedCar?.brand }} {{ activeLead.requestedCar?.model }}</div>
            </div>
          </div>
          <button
            @click="viewLeadDetails"
            class="w-8 h-8 flex items-center justify-center bg-surface border border-black/5 rounded hover:bg-white hover:border-brand-dark/30 text-sub hover:text-brand-dark transition-all shrink-0"
            title="View Details"
          >
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </div>
        
        <!-- Active Opportunity Next Action -->
        <div v-if="activeOpportunity" class="flex items-center justify-between gap-3 p-3 hover:bg-surfaceSecondary transition-colors rounded-md group">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-8 h-8 rounded bg-brand-blue/10 flex items-center justify-center shrink-0">
              <i class="fa-solid fa-handshake text-brand-blue text-sm"></i>
            </div>
            <div class="min-w-0">
              <div class="text-xs font-semibold text-heading uppercase tracking-wider mb-0.5">Active Opportunity</div>
              <div class="text-sm text-body truncate">{{ activeOpportunityNextAction?.label || 'No action defined' }}</div>
              <div class="text-[10px] text-sub truncate">{{ activeOpportunity.vehicle?.brand }} {{ activeOpportunity.vehicle?.model }} - {{ activeOpportunity.stage }}</div>
            </div>
          </div>
          <button
            @click="viewOpportunityDetails"
            class="w-8 h-8 flex items-center justify-center bg-surface border border-black/5 rounded hover:bg-white hover:border-brand-blue/30 text-sub hover:text-brand-blue transition-all shrink-0"
            title="View Details"
          >
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="!nextAppointment && !lastCommunication && !activeLead && !activeOpportunity" class="text-center py-6 text-sub">
        <i class="fa-solid fa-inbox text-2xl mb-2 opacity-30"></i>
        <p class="text-xs">No recent activities available</p>
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
