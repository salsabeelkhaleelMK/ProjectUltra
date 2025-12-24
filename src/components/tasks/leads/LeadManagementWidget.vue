<template>
  <div
    v-if="lead"
    class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
  >
    <div class="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-clipboard-check text-gray-400 text-xs"></i>
        <h3 class="font-bold text-slate-800 text-sm">Manage Next Steps</h3>
      </div>
    </div>

    <div class="p-5 space-y-6">
      <!-- LQ Widget - The main task -->
      <LQWidget 
        :lead="lead"
        :activities="currentLeadActivities"
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

      <!-- Postpone Task Widget (Below LQ Widget) -->
      <div class="bg-white border border-gray-200 rounded-lg p-4 relative transition-all duration-300">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h4 class="font-bold text-slate-800 text-sm">Postpone Task</h4>
            <p class="text-xs text-gray-500 mt-0.5">
              Reschedule the lead qualification task to a later date.
            </p>
          </div>
        </div>
        <button
          @click="showPostpone = !showPostpone"
          class="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
        >
          <i class="fa-regular fa-clock text-xs"></i>
          Postpone Task
        </button>
        
        <div v-if="showPostpone" class="pt-4 space-y-4 border-t border-gray-200 mt-4">
          <!-- Next Step Selection -->
          <div>
            <h5 class="text-xs font-semibold text-gray-600 mb-3">Next Step</h5>
            <div class="space-y-2">
              <!-- Qualify without appointment -->
              <label class="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                :class="{ 'border-blue-500 bg-blue-50': postponeOption === 'qualify-without' }"
              >
                <input 
                  type="radio" 
                  v-model="postponeOption"
                  value="qualify-without"
                  class="mt-0.5 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div class="flex-1">
                  <div class="text-sm font-semibold text-slate-800">Qualify without appointment</div>
                  <div class="text-xs text-gray-500 mt-0.5">Proceed directly to opportunity stage</div>
                </div>
              </label>
              
              <!-- Schedule Appointment -->
              <label class="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                :class="{ 'border-blue-500 bg-blue-50': postponeOption === 'schedule-appointment' }"
              >
                <input 
                  type="radio" 
                  v-model="postponeOption"
                  value="schedule-appointment"
                  class="mt-0.5 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div class="flex-1">
                  <div class="text-sm font-semibold text-slate-800">Schedule Appointment</div>
                  <div class="text-xs text-gray-500 mt-0.5">Book a meeting or test drive</div>
                </div>
              </label>
            </div>
          </div>
          
          <!-- Reschedule Widget (for qualify without appointment) -->
          <div v-if="postponeOption === 'qualify-without'">
            <RescheduleWidget
              :show="true"
              @confirm="handlePostponeConfirm"
            />
          </div>
          
          <!-- Schedule Appointment Widget (for schedule appointment) -->
          <div v-if="postponeOption === 'schedule-appointment'">
            <ScheduleAppointmentWidget
              :show="true"
              @confirm="handleScheduleAppointmentFromPostpone"
              @cancel="postponeOption = null"
            />
          </div>
          
          <!-- Qualify Button (shown after scheduling or when qualify-without is selected) -->
          <div v-if="postponeOption && (postponeOption === 'qualify-without' || appointmentScheduled)" class="pt-3 border-t border-gray-200">
            <button
              @click="handleQualifyFromPostpone"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors shadow-sm"
            >
              Qualify
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLeadsStore } from '@/stores/leads'
import { useUserStore } from '@/stores/user'
import LQWidget from '@/components/tasks/leads/tasks/LQWidget.vue'
import RescheduleWidget from '@/components/tasks/widgets/RescheduleWidget.vue'
import ScheduleAppointmentWidget from '@/components/tasks/widgets/ScheduleAppointmentWidget.vue'
import { createCalendarEvent } from '@/api/calendar'
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
const showPostpone = ref(false)
const postponeOption = ref(null)
const appointmentScheduled = ref(false)
const scheduledAppointmentData = ref(null)
const currentLeadActivities = computed(() => leadsStore.currentLeadActivities || [])

const handlePostponeConfirm = async (data) => {
  // Store the postpone data for later use in qualify
  scheduledAppointmentData.value = data
  // Don't close the form, wait for qualify button
}

const handleScheduleAppointmentFromPostpone = async (appointmentData) => {
  try {
    const appointmentDateTime = `${appointmentData.date}T${appointmentData.time}:00`
    const endTime = new Date(appointmentDateTime)
    endTime.setHours(endTime.getHours() + 1)
    
    // Create appointment activity
    const appointmentActivity = {
      type: 'appointment',
      user: userStore.currentUser?.name || 'You',
      action: 'scheduled an appointment',
      content: `Appointment scheduled: ${appointmentData.type} on ${appointmentData.date} at ${appointmentData.time}`,
      data: {
        type: appointmentData.type,
        assignee: appointmentData.assignee,
        assigneeId: appointmentData.assigneeId,
        date: appointmentData.date,
        time: appointmentData.time,
        datetime: appointmentDateTime,
        status: 'scheduled'
      },
      timestamp: new Date().toISOString()
    }
    
    await leadsStore.addActivity(props.lead.id, appointmentActivity)
    
    // Create calendar event
    const calendarEvent = {
      title: `${appointmentData.type} - ${props.lead.customer.name}`,
      start: appointmentDateTime,
      end: endTime.toISOString(),
      type: appointmentData.type.toLowerCase().replace(' ', '-'),
      customer: props.lead.customer.name,
      vehicle: `${props.lead.requestedCar.brand} ${props.lead.requestedCar.model}`,
      assignee: appointmentData.assignee,
      assigneeId: appointmentData.assigneeId,
      dealership: props.lead.requestedCar.dealership || 'Main',
      team: 'Sales (New)',
      status: 'confirmed',
      leadId: props.lead.id
    }
    
    await createCalendarEvent(calendarEvent)
    
    // Update lead with scheduled appointment
    await leadsStore.modifyLead(props.lead.id, {
      scheduledAppointment: {
        id: Date.now(),
        start: appointmentDateTime,
        end: endTime.toISOString(),
        title: appointmentData.type,
        type: appointmentData.type
      }
    })
    
    scheduledAppointmentData.value = appointmentData
    appointmentScheduled.value = true
    await leadsStore.loadLeadById(props.lead.id)
  } catch (err) {
    console.error('Failed to schedule appointment:', err)
  }
}

const handleQualifyFromPostpone = async () => {
  try {
    // If qualify without appointment
    if (postponeOption.value === 'qualify-without' && scheduledAppointmentData.value) {
      await handlePostponed(scheduledAppointmentData.value)
    }
    
    // Convert lead to opportunity
    const opportunityId = await leadsStore.convertLeadToOpportunity(props.lead.id, {
      assigneeId: userStore.currentUser?.id || 1,
      preferences: {}
    })
    
    // Check user permissions and navigate accordingly
    if (userStore.canAccessOpportunities()) {
      router.push({ path: `/tasks/${opportunityId}`, query: { type: 'opportunity' } })
    } else {
      router.push('/tasks/1')
    }
  } catch (err) {
    console.error('Failed to qualify lead:', err)
  }
}

const handleOpenPurchaseMethod = () => {
  emit('open-purchase-method')
}

const handleOpenTradeIn = () => {
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
        assignee: appointmentData.assignee,
        assigneeId: appointmentData.assigneeId,
        date: appointmentData.date,
        time: appointmentData.time,
        datetime: appointmentDateTime,
        location: appointmentData.location || '',
        notes: appointmentData.notes || '',
        status: 'scheduled'
      },
      timestamp: new Date().toISOString()
    })

    // Add event to calendar
    await createCalendarEvent({
      title: `${appointmentData.type} - ${props.lead.customer.name}`,
      start: appointmentDateTime,
      end: endTime.toISOString(),
      type: appointmentData.type,
      customer: props.lead.customer.name,
      vehicle: `${props.lead.requestedCar.brand} ${props.lead.requestedCar.model}`,
      assignee: appointmentData.assignee,
      assigneeId: appointmentData.assigneeId,
      dealership: props.lead.requestedCar.dealership || 'Main',
      team: 'Sales (New)',
      status: 'confirmed',
      location: appointmentData.location || '',
      notes: appointmentData.notes || '',
      leadId: props.lead.id
    })
    
    // Reload lead to get updated data
    await leadsStore.loadLeadById(props.lead.id)
  } catch (err) {
    console.error('Failed to schedule appointment:', err)
  }
}

const handlePostponed = async (data) => {
  try {
    // Combine date and time into ISO timestamp
    const dueDateTime = new Date(`${data.date}T${data.time}:00`)
    const isoTimestamp = dueDateTime.toISOString()
    
    // Update lead with new due date
    await leadsStore.modifyLead(props.lead.id, {
      nextActionDue: isoTimestamp
    })
    
    // If createAppointment flag is set, create appointment and calendar event
    if (data.createAppointment) {
      const endTime = new Date(dueDateTime)
      endTime.setHours(endTime.getHours() + 1) // Default 1 hour duration
      
      // Create appointment activity
      const appointmentActivity = {
        type: 'appointment',
        user: userStore.currentUser?.name || 'You',
        action: 'scheduled callback appointment',
        content: `Callback scheduled for ${formatDate(dueDateTime)} at ${formatTime(dueDateTime)}`,
        data: {
          type: 'Callback',
          assignee: props.lead.assignee || userStore.currentUser?.name,
          assigneeId: props.lead.assigneeId || userStore.currentUser?.id || 1,
          date: data.date,
          time: data.time,
          datetime: isoTimestamp,
          status: 'scheduled'
        },
        timestamp: new Date().toISOString()
      }
      
      await leadsStore.addActivity(props.lead.id, appointmentActivity)
      
      // Create calendar event
      const { createCalendarEvent } = await import('@/api/calendar')
      const calendarEvent = {
        title: `Callback - ${props.lead.customer.name}`,
        start: isoTimestamp,
        end: endTime.toISOString(),
        type: 'callback',
        customer: props.lead.customer.name,
        vehicle: `${props.lead.requestedCar.brand} ${props.lead.requestedCar.model}`,
        assignee: props.lead.assignee || userStore.currentUser?.name,
        assigneeId: props.lead.assigneeId || userStore.currentUser?.id || 1,
        dealership: props.lead.requestedCar.dealership || 'Main',
        team: 'Sales (New)',
        status: 'confirmed',
        leadId: props.lead.id
      }
      
      await createCalendarEvent(calendarEvent)
      
      // Update lead with scheduled appointment
      await leadsStore.modifyLead(props.lead.id, {
        scheduledAppointment: {
          id: Date.now(),
          start: isoTimestamp,
          end: endTime.toISOString(),
          title: 'Callback',
          type: 'Callback'
        }
      })
    } else {
      // Add activity log for regular postpone
      await leadsStore.addActivity(props.lead.id, {
        type: 'note',
        user: 'You',
        action: 'postponed lead qualification task',
        content: `Task postponed to ${formatDate(dueDateTime)} at ${formatTime(dueDateTime)}`
      })
    }
    
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
        assigneeId: data.appointmentData.assigneeId || 1
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

const handleQualified = async (data) => {
  try {
    // Update lead with assignment info if provided
    if (data?.assignment) {
      await leadsStore.modifyLead(props.lead.id, {
        assignee: data.assignment.assigneeId,
        // Store preferences in lead for reference
        customerPreferences: data.preferences
      })
    }
    
    // Convert lead to opportunity
    const opportunityId = await leadsStore.convertLeadToOpportunity(props.lead.id, {
      assigneeId: data?.assignment?.assigneeId,
      preferences: data?.preferences
    })
    
    // Schedule appointment if requested
    if (data?.scheduleAppointment) {
      // This will be handled by the opportunity management widget
      // For now, just navigate to the opportunity
    }
    
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
