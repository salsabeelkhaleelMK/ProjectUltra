<template>
  <div
    v-if="lead"
    class="bg-white border border-gray-200 rounded-xl shadow-sm"
  >
    <!-- Header -->
    <div class="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-clipboard-check text-gray-400 text-xs"></i>
        <h3 class="font-bold text-slate-800 text-sm">Manage next steps</h3>
      </div>
      <span 
        class="text-xs px-3 py-1 rounded-full font-medium border"
        :class="stageColorClass"
      >
        {{ leadState.displayStage }}
      </span>
    </div>

    <!-- Deadline Warning Banner -->
    <div 
      v-if="leadState.showDeadlineBanner && !deadlineBannerDismissed && (deadlineStatus.type === 'overdue' || deadlineStatus.type === 'urgent')"
      class="mx-4 mt-4 px-4 py-3 rounded-lg border flex items-center justify-between"
      :class="[deadlineStatus.bgClass, deadlineStatus.borderClass]"
    >
      <div class="flex items-center gap-3">
        <div 
          class="w-9 h-9 rounded-lg flex items-center justify-center"
          :class="[deadlineStatus.bgClass, deadlineStatus.borderClass, 'border']"
        >
          <i 
            class="text-base"
            :class="[`fa-solid ${deadlineStatus.icon}`, deadlineStatus.textClass]"
          ></i>
        </div>
        <div class="flex-1">
          <div class="text-xs font-medium text-gray-600 mb-0.5">Next Action Due</div>
          <div 
            class="text-sm font-bold"
            :class="deadlineStatus.textClass"
          >
            {{ formatDeadlineFull(lead.nextActionDue) }}
            <span v-if="deadlineStatus.type !== 'overdue'" class="text-xs font-normal opacity-75">
              ({{ formatDueDate(lead.nextActionDue) }})
            </span>
          </div>
        </div>
        <div 
          v-if="deadlineStatus.type === 'overdue'"
          class="text-xs font-bold uppercase px-2.5 py-1 rounded-md"
          :class="[deadlineStatus.bgClass, deadlineStatus.textClass, deadlineStatus.borderClass, 'border']"
        >
          <i class="fa-solid fa-exclamation-circle mr-1"></i>
          Overdue
        </div>
        <div 
          v-else-if="deadlineStatus.type === 'urgent'"
          class="text-xs font-bold uppercase px-2.5 py-1 rounded-md"
          :class="[deadlineStatus.bgClass, deadlineStatus.textClass, deadlineStatus.borderClass, 'border']"
        >
          <i class="fa-solid fa-bolt mr-1"></i>
          Urgent
        </div>
      </div>
      <button
        @click="dismissBanner"
        class="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors ml-2 shrink-0"
        title="Dismiss"
      >
        <i class="fa-solid fa-xmark text-xs"></i>
      </button>
    </div>

    <div class="p-5 space-y-6">
      <!-- Active States -->
      <template v-if="!leadState.isClosedState">
        <!-- LQ Widget - The main call simulation task (preserved) -->
        <LQWidget
          v-if="leadState.showLQWidget" 
          :lead="lead"
          @postponed="handlePostponed"
          @validated="handleValidated"
          @qualified="handleQualified"
          @disqualified="handleDisqualified"
          @call-attempt-logged="handleCallAttemptLogged"
          @note-saved="handleNoteSaved"
          @open-purchase-method="handleOpenPurchaseMethod"
          @open-trade-in="handleOpenTradeIn"
          @appointment-scheduled="handleAppointmentScheduled"
        />
      </template>

      <!-- Closed States -->
      <div v-else class="bg-gray-50/50 border border-gray-100 rounded-lg p-4">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h4 class="font-bold text-slate-800 text-sm">Lead Closed</h4>
            <p class="text-xs text-gray-500 mt-0.5">
              Status: {{ leadState.displayStage }}
              <span v-if="lead.disqualifyReason"> - {{ lead.disqualifyReason }}</span>
            </p>
          </div>
        </div>
        <button
          @click="handleReopen"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          Reopen Lead <i class="fa-solid fa-rotate-left"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLeadsStore } from '@/stores/leads'
import { useUserStore } from '@/stores/user'
import { getStageColor } from '@/utils/stageMapper'
import { formatDate, formatTime, formatDueDate, formatDeadlineFull, getDeadlineStatus } from '@/utils/formatters'
import { useLeadStateMachine } from '@/composables/useLeadStateMachine'

// Components
import LQWidget from '@/components/leads/tasks/LQWidget.vue'

const props = defineProps({
  lead: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['open-purchase-method', 'open-trade-in'])

const router = useRouter()
const leadsStore = useLeadsStore()
const userStore = useUserStore()

// Deadline banner state
const dismissedBanners = ref(new Set())
const deadlineBannerDismissed = computed(() => dismissedBanners.value.has(props.lead.id))

const dismissBanner = () => {
  dismissedBanners.value.add(props.lead.id)
}

const deadlineStatus = computed(() => {
  return getDeadlineStatus(props.lead.nextActionDue)
})

// Use lead state machine
const leadState = useLeadStateMachine(() => props.lead)

const stageColorClass = computed(() => {
  return getStageColor(leadState.displayStage.value, 'lead')
})

// Event Handlers (preserved from original)
async function handlePostponed(data) {
  if (!leadState.canPostpone.value) {
    console.warn('Cannot postpone in current state')
    return
  }
  
  try {
    const dueDateTime = new Date(`${data.date}T${data.time}:00`)
    const isoTimestamp = dueDateTime.toISOString()
    
    const updates = {
      nextActionDue: isoTimestamp
    }
    
    // Add reassignment if provided
    if (data.assigneeId || data.teamId) {
      updates.assignee = data.assignee || null
      updates.assigneeId = data.assigneeId || null
      updates.assigneeType = data.assigneeType || 'user'
      updates.teamId = data.teamId || null
      updates.team = data.team || null
    }
    
    await leadsStore.modifyLead(props.lead.id, updates)
    
    // Create appointment if requested
    if (data.createAppointment) {
      const endTime = new Date(dueDateTime)
      endTime.setHours(endTime.getHours() + 1)
      
      await leadsStore.modifyLead(props.lead.id, {
        scheduledAppointment: {
          id: Date.now(),
          title: `Follow-up Call - ${props.lead.customer.name}`,
          start: isoTimestamp,
          end: endTime.toISOString(),
          type: 'Call',
          assignee: data.assignee || props.lead.assignee,
          assigneeId: data.assigneeId || props.lead.assigneeId,
          assigneeType: data.assigneeType || props.lead.assigneeType || 'user',
          teamId: data.teamId || props.lead.teamId,
          team: data.team || props.lead.team,
          status: 'scheduled'
        }
      })
      
      await leadsStore.addActivity(props.lead.id, {
        type: 'appointment',
        user: userStore.currentUser?.name || 'You',
        action: 'scheduled follow-up call',
        content: `Follow-up call scheduled for ${formatDate(dueDateTime)} at ${formatTime(dueDateTime)}`,
        data: {
          type: 'Call',
          date: data.date,
          time: data.time,
          assignee: data.assignee || props.lead.assignee
        }
      })
    }
    
    await leadsStore.addActivity(props.lead.id, {
      type: 'note',
      user: 'You',
      action: 'postponed lead qualification task',
      content: `Task postponed to ${formatDate(dueDateTime)} at ${formatTime(dueDateTime)}${data.assignee ? ` and reassigned to ${data.assignee}` : ''}`
    })
    
    await leadsStore.loadLeadById(props.lead.id)
  } catch (err) {
    console.error('Failed to postpone lead task:', err)
  }
}

async function handleValidated(data) {
  try {
    await leadsStore.modifyLead(props.lead.id, {
      stage: 'Validated'
    })
    
    await leadsStore.addActivity(props.lead.id, {
      type: 'note',
      user: 'You',
      action: 'validated lead',
      content: 'Lead has been validated and is ready for follow-up'
    })
    
    if (data.scheduleFollowUp && data.appointmentData) {
      const appointmentDateTime = new Date(`${data.appointmentData.date}T${data.appointmentData.time}:00`)
      
      await leadsStore.scheduleFollowUp(props.lead.id, {
        dateTime: appointmentDateTime.toISOString(),
        assignee: data.appointmentData.assignee || props.lead.assignee,
        assigneeId: data.appointmentData.assigneeId || null,
        assigneeType: data.appointmentData.assigneeType || 'user',
        teamId: data.appointmentData.teamId || null,
        team: data.appointmentData.team || null
      })
      
      await leadsStore.addActivity(props.lead.id, {
        type: 'appointment',
        user: 'You',
        action: 'scheduled follow-up call',
        content: `Follow-up call scheduled for ${formatDate(appointmentDateTime)} at ${formatTime(appointmentDateTime)}`
      })
    }
    
    await leadsStore.loadLeadById(props.lead.id)
  } catch (err) {
    console.error('Failed to validate lead:', err)
  }
}

async function handleQualified() {
  try {
    const opportunityId = await leadsStore.convertLeadToOpportunity(props.lead.id)
    
    if (userStore.canAccessOpportunities()) {
      router.push({ path: `/tasks/${opportunityId}`, query: { type: 'opportunity' } })
    } else {
      router.push('/tasks/1')
    }
  } catch (err) {
    console.error('Failed to qualify lead:', err)
  }
}

async function handleCallAttemptLogged(attempt) {
  try {
    const currentAttempts = props.lead.contactAttempts || []
    
    await leadsStore.modifyLead(props.lead.id, {
      contactAttempts: [...currentAttempts, attempt],
      lastContactAttempt: attempt.timestamp,
      totalContactAttempts: currentAttempts.length + 1
    })
    
    await leadsStore.addActivity(props.lead.id, {
      type: 'call',
      user: 'You',
      action: `logged call attempt - ${attempt.outcome}`,
      content: attempt.notes || `Call attempt via ${attempt.channel}`,
      data: {
        outcome: attempt.outcome,
        channel: attempt.channel,
        duration: attempt.duration
      }
    })
    
    await leadsStore.loadLeadById(props.lead.id)
  } catch (err) {
    console.error('Failed to log call attempt:', err)
  }
}

async function handleNoteSaved(noteData) {
  try {
    await leadsStore.addActivity(props.lead.id, {
      type: 'note',
      user: 'You',
      action: 'added a note',
      content: noteData.content || noteData.text || '',
      data: noteData
    })
    
    await leadsStore.loadLeadById(props.lead.id)
  } catch (err) {
    console.error('Failed to save note:', err)
  }
}

function handleOpenPurchaseMethod() {
  emit('open-purchase-method')
}

function handleOpenTradeIn() {
  emit('open-trade-in')
}

async function handleAppointmentScheduled(appointmentData) {
  try {
    const appointmentDateTime = `${appointmentData.date}T${appointmentData.time}:00`
    const endTime = new Date(appointmentDateTime)
    endTime.setHours(endTime.getHours() + 1)
    
    await leadsStore.modifyLead(props.lead.id, {
      scheduledAppointment: {
        id: Date.now(),
        title: `${appointmentData.type} - ${props.lead.customer.name}`,
        start: appointmentDateTime,
        end: endTime.toISOString(),
        type: appointmentData.type,
        assignee: appointmentData.assignee,
        assigneeId: appointmentData.assigneeId,
        status: 'scheduled',
        location: appointmentData.location || '',
        notes: appointmentData.notes || ''
      }
    })
    
    await leadsStore.addActivity(props.lead.id, {
      type: 'appointment',
      user: userStore.currentUser?.name || 'You',
      action: 'scheduled an appointment',
      content: `${appointmentData.type} scheduled for ${appointmentData.date} at ${appointmentData.time}`,
      data: {
        type: appointmentData.type,
        date: appointmentData.date,
        time: appointmentData.time,
        assignee: appointmentData.assignee
      }
    })
    
    await leadsStore.loadLeadById(props.lead.id)
  } catch (err) {
    console.error('Failed to schedule appointment:', err)
  }
}

async function handleDisqualified(data) {
  // Use state machine to determine if disqualification is allowed
  if (leadState.isClosedState.value && !data.force) {
    console.warn('Lead already closed')
    return
  }
  
  try {
    const isDuplicate = data.reason === 'Duplicate'
    
    await leadsStore.modifyLead(props.lead.id, {
      isDisqualified: true,
      disqualifyReason: data.reason,
      isDuplicate: isDuplicate,
      stage: isDuplicate ? 'Closed Failed' : 'Not Valid',
      status: 'Disqualified'
    })
    
    await leadsStore.addActivity(props.lead.id, {
      type: 'note',
      user: 'You',
      action: 'disqualified lead',
      content: `Lead disqualified - Category: ${data.category}, Reason: ${data.reason}`
    })
    
    router.push('/tasks')
  } catch (err) {
    console.error('Failed to disqualify lead:', err)
  }
}

async function handleReopen() {
  try {
    await leadsStore.modifyLead(props.lead.id, {
      isDisqualified: false,
      disqualifyReason: null,
      stage: 'Open Lead',
      status: 'Open'
    })
    
    await leadsStore.addActivity(props.lead.id, {
      type: 'note',
      user: 'You',
      action: 'reopened lead',
      content: 'Lead has been reopened for qualification'
    })
    
    await leadsStore.loadLeadById(props.lead.id)
  } catch (err) {
    console.error('Failed to reopen lead:', err)
  }
}

function viewOpportunity() {
  if (props.lead.opportunityId) {
    router.push({ path: `/tasks/${props.lead.opportunityId}`, query: { type: 'opportunity' } })
  }
}
</script>
