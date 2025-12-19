<template>
  <div class="bg-yellow-50/50 border border-yellow-100 rounded-lg p-4 relative transition-all duration-300">
    <div class="flex justify-between items-start mb-3">
      <div>
        <h4 class="font-bold text-slate-800 text-sm">{{ noShowTitle }}</h4>
        <p class="text-xs text-gray-500 mt-0.5">Appointment was scheduled for {{ appointmentDate }} but customer did not show up. {{ noShowMessage }}</p>
      </div>
    </div>
    <div class="flex gap-3 flex-wrap">
      <button
        @click="handleReschedule"
        class="bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
      >
        <i class="fa-solid fa-calendar-plus"></i> Book Another Appointment
      </button>
      <button
        @click="handleContactCustomer"
        class="bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
      >
        <i class="fa-solid fa-phone"></i> Contact Customer
      </button>
    </div>
    
    <!-- Survey Widget -->
    <SurveyWidget
      :questions="surveyQuestions"
      @survey-completed="handleSurveyCompleted"
      @survey-refused="handleSurveyRefused"
      @not-responding="handleNotResponding"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SurveyWidget from '@/components/tasks/widgets/SurveyWidget.vue'

const props = defineProps({
  opportunity: {
    type: Object,
    required: true
  },
  scheduledAppointment: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['contact-customer', 'reschedule', 'survey-completed', 'survey-refused', 'not-responding', 'auto-close-lost'])

const noShowCount = computed(() => {
  return props.scheduledAppointment?.noShowCount || 0
})

const noShowTitle = computed(() => {
  const count = noShowCount.value
  if (count === 0) return 'No-Show Follow-up'
  if (count >= 3) return `No-Show #${count} - Final Warning`
  return `No-Show #${count} Follow-up`
})

const noShowMessage = computed(() => {
  const count = noShowCount.value
  if (count >= 3) {
    return 'This is the third no-show. The opportunity will be automatically closed as lost if another appointment is not successfully completed.'
  }
  if (count >= 2) {
    return 'This is the second no-show. Please make every effort to reach the customer and reschedule.'
  }
  return 'Follow up with customer to understand the situation and book another appointment.'
})

const surveyQuestions = [
  {
    key: 'contactStatus',
    label: 'Were you able to reach the customer?',
    type: 'radio',
    options: ['Yes', 'No', 'Left message']
  },
  {
    key: 'noShowReason',
    label: 'Reason for no-show?',
    type: 'select',
    options: ['Emergency', 'Forgot', 'Changed mind', 'No response', 'Schedule conflict', 'Other']
  },
  {
    key: 'nextAction',
    label: 'Next action?',
    type: 'select',
    options: ['Reschedule appointment', 'Customer will call back', 'Continue follow-up', 'Other']
  },
  {
    key: 'notes',
    label: 'Additional notes',
    type: 'text',
    placeholder: 'Document the conversation and any relevant details...'
  }
]

const appointmentDate = computed(() => {
  if (!props.scheduledAppointment?.start) return 'unknown date'
  const date = new Date(props.scheduledAppointment.start)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const handleContactCustomer = () => {
  emit('contact-customer', props.opportunity)
}

const handleReschedule = () => {
  // Check if this is NS3 or higher - trigger auto-close after reschedule
  if (noShowCount.value >= 3) {
    emit('auto-close-lost', { 
      opportunity: props.opportunity, 
      reason: `Automatically closed after ${noShowCount.value} no-shows` 
    })
  } else {
    emit('reschedule', props.opportunity)
  }
}

const handleSurveyCompleted = (responses) => {
  emit('survey-completed', { opportunity: props.opportunity, responses })
}

const handleSurveyRefused = () => {
  emit('survey-refused', { opportunity: props.opportunity })
}

const handleNotResponding = () => {
  emit('not-responding', { opportunity: props.opportunity })
}
</script>

