<template>
  <div class="bg-gray-50/50 border border-gray-100 rounded-lg p-4 relative transition-all duration-300">
    <div class="flex justify-between items-start mb-3">
      <div>
        <h4 class="font-bold text-slate-800 text-sm">Lead Qualification Task</h4>
        <p class="text-xs text-gray-500 mt-0.5">
          {{ taskDescription }}
        </p>
      </div>
      <div 
        class="flex items-center gap-2 px-2 py-1 rounded text-xs font-semibold"
        :class="statusBadge.class"
      >
        {{ statusBadge.text }}
      </div>
    </div>

    <!-- Display scheduled follow-up if exists -->
    <div v-if="hasScheduledFollowUp" class="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div class="flex items-center gap-2 mb-1">
        <i class="fa-solid fa-phone text-blue-600 text-xs"></i>
        <span class="text-xs font-semibold text-blue-900">Scheduled Follow-up Call</span>
      </div>
      <p class="text-xs text-blue-700">
        {{ formatDate(lead.scheduledAppointment.start) }} at {{ formatTime(lead.scheduledAppointment.start) }}
      </p>
    </div>

    <!-- Actions Row -->
    <div class="flex gap-3 flex-wrap">
      <button 
        @click="handlePostpone"
        class="bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
      >
        Postpone <i class="fa-regular fa-clock text-xs"></i>
      </button>
      
      <button 
        @click="handleDisqualify"
        class="bg-white hover:bg-red-50 border border-gray-200 text-slate-700 hover:text-red-600 hover:border-red-200 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
      >
        Disqualify <i class="fa-solid fa-ban text-xs"></i>
      </button>
      
      <button 
        v-if="lead.stage === 'Open Lead'"
        @click="handleValidate"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-blue-200"
      >
        Validate <i class="fa-solid fa-check text-xs"></i>
      </button>
      
      <button 
        @click="handleQualify"
        class="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-green-200"
      >
        Qualify <i class="fa-solid fa-arrow-right text-xs"></i>
      </button>
    </div>

    <!-- Postpone Widget -->
    <RescheduleWidget 
      :show="showPostpone"
      @close="showPostpone = false"
      @confirm="handlePostponeConfirm"
    />

    <!-- Validate Modal -->
    <div v-if="showValidateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">Validate Lead</h3>
          <button @click="showValidateModal = false" class="text-gray-400 hover:text-gray-600">
            <i class="fa-solid fa-times"></i>
          </button>
        </div>

        <p class="text-sm text-gray-600 mb-4">
          Lead will be marked as "Validated". Would you like to schedule a follow-up call?
        </p>

        <div class="flex justify-end gap-3">
          <button 
            @click="handleValidateOnly"
            class="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors"
          >
            Just Validate
          </button>
          <button 
            @click="handleValidateAndSchedule"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors"
          >
            Schedule Follow-up
          </button>
        </div>
      </div>
    </div>

    <!-- Schedule Appointment Widget -->
    <ScheduleAppointmentWidget
      v-if="showScheduleWidget"
      :show="showScheduleWidget"
      @confirm="handleScheduleConfirm"
      @cancel="handleScheduleCancel"
    />

    <!-- Disqualify Modal -->
    <DisqualifyModal
      :show="showDisqualifyModal"
      @confirm="handleDisqualifyConfirm"
      @cancel="showDisqualifyModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import RescheduleWidget from '@/components/tasks/widgets/RescheduleWidget.vue'
import ScheduleAppointmentWidget from '@/components/tasks/leads/ScheduleAppointmentWidget.vue'
import DisqualifyModal from '@/components/tasks/modals/DisqualifyModal.vue'
import { formatDate, formatTime } from '@/utils/formatters'

const props = defineProps({
  lead: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['postponed', 'validated', 'qualified', 'disqualified'])

const showPostpone = ref(false)
const showValidateModal = ref(false)
const showScheduleWidget = ref(false)
const showDisqualifyModal = ref(false)

const taskDescription = computed(() => {
  if (props.lead.stage === 'Open Lead') {
    return 'Contact and qualify this lead'
  } else if (props.lead.stage === 'Validated') {
    return 'Follow up with validated lead'
  }
  return 'Complete lead qualification'
})

const isOverdue = computed(() => {
  if (!props.lead.nextActionDue) return false
  const dueDate = new Date(props.lead.nextActionDue)
  const now = new Date()
  return dueDate < now
})

const hasScheduledFollowUp = computed(() => {
  return !!props.lead.scheduledAppointment
})

const statusBadge = computed(() => {
  if (hasScheduledFollowUp.value) {
    return { text: 'Follow-up Scheduled', class: 'bg-blue-100 text-blue-700' }
  }
  if (isOverdue.value) {
    return { text: 'Overdue', class: 'bg-red-100 text-red-700' }
  }
  return { text: 'Pending', class: 'bg-orange-100 text-orange-700' }
})

const handlePostpone = () => {
  showPostpone.value = true
}

const handlePostponeConfirm = (data) => {
  emit('postponed', data)
  showPostpone.value = false
}

const handleValidate = () => {
  showValidateModal.value = true
}

const handleValidateOnly = () => {
  emit('validated', { scheduleFollowUp: false })
  showValidateModal.value = false
}

const handleValidateAndSchedule = () => {
  showValidateModal.value = false
  showScheduleWidget.value = true
}

const handleScheduleConfirm = (appointmentData) => {
  emit('validated', { scheduleFollowUp: true, appointmentData })
  showScheduleWidget.value = false
}

const handleScheduleCancel = () => {
  showScheduleWidget.value = false
  // Just validate without scheduling
  emit('validated', { scheduleFollowUp: false })
}

const handleQualify = () => {
  emit('qualified')
}

const handleDisqualify = () => {
  showDisqualifyModal.value = true
}

const handleDisqualifyConfirm = (data) => {
  emit('disqualified', data)
  showDisqualifyModal.value = false
}
</script>

