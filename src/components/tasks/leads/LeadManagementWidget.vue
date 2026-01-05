<template>
  <div
    v-if="lead"
    class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
  >
    <div class="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-clipboard-check text-gray-400 text-xs"></i>
        <h3 class="font-bold text-slate-800 text-sm">Lead Management</h3>
      </div>
    </div>

    <div class="p-5 space-y-6">
      <!-- LQ Widget - The main task -->
      <LQWidget 
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
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useLeadsStore } from '@/stores/leads'
import { useUserStore } from '@/stores/user'
import LQWidget from '@/components/tasks/leads/tasks/LQWidget.vue'
import { formatDate, formatTime } from '@/utils/formatters'

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

const handlePostponed = async (data) => {
  try {
    // Combine date and time into ISO timestamp
    const dueDateTime = new Date(`${data.date}T${data.time}:00`)
    const isoTimestamp = dueDateTime.toISOString()
    
    // Update lead with new due date
    await leadsStore.modifyLead(props.lead.id, {
      nextActionDue: isoTimestamp
    })
    
    // Add activity log
    await leadsStore.addActivity(props.lead.id, {
      type: 'note',
      user: 'You',
      action: 'postponed lead qualification task',
      content: `Task postponed to ${formatDate(dueDateTime)} at ${formatTime(dueDateTime)}`
    })
    
    // Reload lead to show updated due date
    await leadsStore.loadLeadById(props.lead.id)
  } catch (err) {
    console.error('Failed to postpone lead task:', err)
  }
}

const handleValidated = async (data) => {
  try {
    // Change lead stage to Validated
    await leadsStore.modifyLead(props.lead.id, {
      stage: 'Validated'
    })
    
    // Add activity log
    await leadsStore.addActivity(props.lead.id, {
      type: 'note',
      user: 'You',
      action: 'validated lead',
      content: 'Lead has been validated and is ready for follow-up'
    })
    
    // If user wants to schedule follow-up, create appointment
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
      
      // Add appointment activity log
      await leadsStore.addActivity(props.lead.id, {
        type: 'appointment',
        user: 'You',
        action: 'scheduled follow-up call',
        content: `Follow-up call scheduled for ${formatDate(appointmentDateTime)} at ${formatTime(appointmentDateTime)}`
      })
    }
    
    // Reload lead to show updated state
    await leadsStore.loadLeadById(props.lead.id)
  } catch (err) {
    console.error('Failed to validate lead:', err)
  }
}

const handleQualified = async () => {
  try {
    // Convert lead to opportunity
    const opportunityId = await leadsStore.convertLeadToOpportunity(props.lead.id)
    
    // Check user permissions and navigate accordingly
    if (userStore.canAccessOpportunities()) {
      // Salesman or Manager - redirect to the new opportunity
      router.push({ path: `/tasks/${opportunityId}`, query: { type: 'opportunity' } })
    } else {
      // Operator - no access to opportunities, navigate to tasks list
      router.push('/tasks/1')
    }
  } catch (err) {
    console.error('Failed to qualify lead:', err)
  }
}

const handleCallAttemptLogged = async (attempt) => {
  try {
    // Get current contact attempts
    const currentAttempts = props.lead.contactAttempts || []
    
    // Add new attempt
    await leadsStore.modifyLead(props.lead.id, {
      contactAttempts: [...currentAttempts, attempt],
      lastContactAttempt: attempt.timestamp,
      totalContactAttempts: currentAttempts.length + 1
    })
    
    // Add activity log
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
    
    // Reload lead to show updated attempt count
    await leadsStore.loadLeadById(props.lead.id)
  } catch (err) {
    console.error('Failed to log call attempt:', err)
  }
}

const handleNoteSaved = async (noteData) => {
  try {
    await leadsStore.addActivity(props.lead.id, {
      type: 'note',
      user: 'You',
      action: 'added a note',
      content: noteData.content || noteData.text || '',
      data: noteData
    })
    
    // Reload lead to show updated activities
    await leadsStore.loadLeadById(props.lead.id)
  } catch (err) {
    console.error('Failed to save note:', err)
  }
}

const handleOpenPurchaseMethod = () => {
  // This is handled by the parent TaskShell component
  emit('open-purchase-method')
}

const handleOpenTradeIn = () => {
  // This is handled by the parent TaskShell component
  emit('open-trade-in')
}

const handleAppointmentScheduled = async (appointmentData) => {
  try {
    // Create appointment activity immediately
    const appointmentDateTime = `${appointmentData.date}T${appointmentData.time}:00`
    const endTime = new Date(appointmentDateTime)
    endTime.setHours(endTime.getHours() + 1)
    
    // Update lead with scheduled appointment
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
    
    // Add appointment activity to feed
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
    
    // Reload lead to show updated appointment
    await leadsStore.loadLeadById(props.lead.id)
  } catch (err) {
    console.error('Failed to schedule appointment:', err)
  }
}

const handleDisqualified = async (data) => {
  try {
    await leadsStore.modifyLead(props.lead.id, {
      isDisqualified: true,
      disqualifyReason: data.reason,
      status: 'Disqualified'
    })
    
    // Add activity log
    await leadsStore.addActivity(props.lead.id, {
      type: 'note',
      user: 'You',
      action: 'disqualified lead',
      content: `Lead disqualified - Category: ${data.category}, Reason: ${data.reason}`
    })
    
    // Navigate to tasks list (lead will be filtered out)
    router.push('/tasks')
  } catch (err) {
    console.error('Failed to disqualify lead:', err)
  }
}
</script>
