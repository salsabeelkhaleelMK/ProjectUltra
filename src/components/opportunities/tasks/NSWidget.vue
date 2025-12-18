<template>
  <div class="bg-yellow-50/50 border border-yellow-100 rounded-lg p-4 relative transition-all duration-300">
    <div class="flex justify-between items-start mb-3">
      <div>
        <h4 class="font-bold text-slate-800 text-sm">No-Show Follow-up</h4>
        <p class="text-xs text-gray-500 mt-0.5">Appointment was scheduled for {{ appointmentDate }} but customer did not show up. Follow up with customer to understand the situation.</p>
      </div>
    </div>
    <div class="flex gap-3 flex-wrap">
      <button
        @click="handleContactCustomer"
        class="bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
      >
        Contact Customer
      </button>
      <button
        @click="handleReschedule"
        class="bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
      >
        Reschedule
      </button>
      <button
        @click="handleCloseLost"
        class="bg-white hover:bg-red-50 border border-gray-200 text-slate-700 hover:text-red-600 hover:border-red-200 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
      >
        Close as Lost
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
import SurveyWidget from '@/components/shared/SurveyWidget.vue'

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

const emit = defineEmits(['contact-customer', 'reschedule', 'close-lost', 'survey-completed', 'survey-refused', 'not-responding'])

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
    options: ['Reschedule appointment', 'Customer will call back', 'Continue follow-up', 'Close as lost', 'Other']
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
  emit('reschedule', props.opportunity)
}

const handleCloseLost = () => {
  emit('close-lost', props.opportunity)
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

