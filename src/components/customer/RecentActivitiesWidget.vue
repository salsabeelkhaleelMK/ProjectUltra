<template>
  <Card class="h-full">
    <CardHeader>
      <div class="flex items-center gap-2">
        <Clock class="w-4 h-4 text-foreground" />
        <CardTitle class="text-sm font-semibold leading-5">Recent Activities</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <!-- Skeleton Loading State -->
      <template v-if="loading">
        <div class="space-y-3 animate-pulse">
          <div v-for="n in 3" :key="`skeleton-${n}`" class="flex items-center gap-3 p-3">
            <div class="w-8 h-8 bg-muted rounded-full"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3 bg-muted rounded w-1/4"></div>
              <div class="h-4 bg-muted rounded w-3/4"></div>
              <div class="h-3 bg-muted rounded w-1/2"></div>
            </div>
            <div class="w-8 h-8 bg-muted rounded"></div>
          </div>
        </div>
      </template>
      
      <!-- Content -->
      <template v-else>
        <div class="divide-y divide-border">
          <!-- Next Appointment -->
          <div v-if="nextAppointment" class="flex items-center justify-between gap-3 p-3 hover:bg-muted transition-colors rounded-md group">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                <CalendarCheck class="w-4 h-4 text-primary" />
              </div>
              <div class="min-w-0">
                <div class="text-xs font-semibold text-foreground uppercase tracking-wider mb-0.5">Next Appointment</div>
                <div class="text-sm text-muted-foreground truncate">{{ formatAppointmentDate(nextAppointment.start) }}</div>
                <div class="text-xs text-muted-foreground truncate">{{ nextAppointment.title || 'Appointment' }}</div>
              </div>
            </div>
            <Button
              @click="viewAppointmentDetails"
              variant="outline"
              size="icon"
              title="View Details"
            >
              <ArrowRight class="w-4 h-4" />
            </Button>
          </div>
        
          <!-- Last Communication -->
          <div v-if="lastCommunication" class="flex items-center justify-between gap-3 p-3 hover:bg-muted transition-colors rounded-md group">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0">
                <component :is="getCommunicationIcon(lastCommunication.type)" class="w-4 h-4 text-muted-foreground" />
              </div>
              <div class="min-w-0">
                <div class="text-xs font-semibold text-foreground uppercase tracking-wider mb-0.5">Last Communication</div>
                <div class="text-sm text-muted-foreground truncate">{{ getCommunicationPreview(lastCommunication) }}</div>
                <div class="text-xs text-muted-foreground truncate">{{ formatDate(lastCommunication.timestamp) }}</div>
              </div>
            </div>
            <Button
              @click="viewCommunicationDetails"
              variant="outline"
              size="icon"
              title="View Details"
            >
              <ArrowRight class="w-4 h-4" />
            </Button>
          </div>
        
          <!-- Active Lead Next Action -->
          <div v-if="activeLead" class="flex items-center justify-between gap-3 p-3 hover:bg-muted transition-colors rounded-md group">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                <User class="w-4 h-4 text-primary" />
              </div>
              <div class="min-w-0">
                <div class="text-xs font-semibold text-foreground uppercase tracking-wider mb-0.5">Active Lead Request</div>
                <div class="text-sm text-muted-foreground truncate">{{ activeLeadNextAction?.label || 'No action defined' }}</div>
                <div class="text-xs text-muted-foreground truncate">{{ activeLead.requestedCar?.brand }} {{ activeLead.requestedCar?.model }}</div>
              </div>
            </div>
            <Button
              @click="viewLeadDetails"
              variant="outline"
              size="icon"
              title="View Details"
            >
              <ArrowRight class="w-4 h-4" />
            </Button>
          </div>
          
          <!-- Active Opportunity Next Action -->
          <div v-if="activeOpportunity" class="flex items-center justify-between gap-3 p-3 hover:bg-muted transition-colors rounded-md group">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                <Handshake class="w-4 h-4 text-primary" />
              </div>
              <div class="min-w-0">
                <div class="text-xs font-semibold text-foreground uppercase tracking-wider mb-0.5">Active Opportunity</div>
                <div class="text-sm text-muted-foreground truncate">{{ activeOpportunityNextAction?.label || 'No action defined' }}</div>
                <div class="text-xs text-muted-foreground truncate">{{ activeOpportunity.vehicle?.brand }} {{ activeOpportunity.vehicle?.model }} - {{ activeOpportunity.stage }}</div>
              </div>
            </div>
            <Button
              @click="viewOpportunityDetails"
              variant="outline"
              size="icon"
              title="View Details"
            >
              <ArrowRight class="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="!nextAppointment && !lastCommunication && !activeLead && !activeOpportunity" class="text-center py-6 text-muted-foreground">
          <Inbox class="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p class="text-xs">No recent activities available</p>
        </div>
      </template>
    </CardContent>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardHeader, CardTitle, CardContent } from '@motork/component-library/future/primitives'
import { Button } from '@motork/component-library/future/primitives'
import { Clock, CalendarCheck, ArrowRight, Mail, MessageSquare, MessageCircle, Phone, User, Handshake, Inbox } from 'lucide-vue-next'
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
  },
  loading: {
    type: Boolean,
    default: false
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
  const iconMap = {
    email: Mail,
    sms: MessageSquare,
    whatsapp: MessageCircle,
    call: Phone
  }
  return iconMap[type] || MessageCircle
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
