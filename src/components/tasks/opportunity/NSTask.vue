<template>
  <BaseTaskWidget
    :title="noShowTitle"
    :description="`Appointment was scheduled for ${appointmentDate} but customer did not show up. ${noShowMessage}`"
    :color-scheme="{ background: 'bg-yellow-50/50', border: 'border-yellow-100' }"
  >
    <template #actions>
      <button
        @click="handleReschedule"
        class="bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-4 py-2 rounded-btn text-fluid-xs flex items-center gap-2 transition-colors"
      >
        <i class="fa-solid fa-calendar-plus"></i> Book Another Appointment
      </button>
      <button
        @click="handleContactCustomer"
        class="bg-white border border-D1D5DB text-brand-dark font-medium px-4 py-2 rounded-btn text-fluid-xs flex items-center gap-2 transition-colors hover:bg-surfaceSecondary"
      >
        <i class="fa-solid fa-phone"></i> Contact Customer
      </button>
    </template>
    
    <template #survey>
      <SurveyWidget
        :questions="surveyQuestions"
        @survey-completed="handleSurveyCompleted"
        @survey-refused="handleSurveyRefused"
        @not-responding="handleNotResponding"
      />
    </template>
  </BaseTaskWidget>
</template>

<script setup>
import { computed } from 'vue'
import BaseTaskWidget from '@/components/tasks/shared/BaseTaskWidget.vue'
import SurveyWidget from '@/components/customer/SurveyWidget.vue'

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

const emit = defineEmits(['contact-customer', 'reschedule', 'survey-completed', 'survey-refused', 'not-responding', 'auto-close-lost', 'set-callback'])

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
  const count = noShowCount.value
  
  // NS3 or higher - trigger auto-close
  if (count >= 3) {
    emit('auto-close-lost', { 
      opportunity: props.opportunity, 
      reason: `Automatically closed after ${count} no-shows` 
    })
  } 
  // NS1 or NS2 - set callback (transition to "To be Called Back")
  else if (count === 1 || count === 2) {
    // Set callback for 2 days from now
    const callbackDate = new Date()
    callbackDate.setDate(callbackDate.getDate() + 2)
    
    emit('set-callback', { 
      opportunity: props.opportunity, 
      callbackDate: callbackDate.toISOString() 
    })
  }
  // Default - just reschedule
  else {
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

