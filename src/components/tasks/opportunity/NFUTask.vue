<template>
  <BaseTaskWidget
    :title="'Opportunity Follow-up'"
    :description="'No contract date exists. Push to close or schedule a closing meeting to finalize the deal.'"
    :color-scheme="{ background: 'bg-purple-50/50', border: 'border-purple-100' }"
  >
    <template #actions>
      <button
        @click="handleScheduleClosing"
        class="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-btn text-fluid-xs flex items-center gap-2 transition-colors"
      >
        Schedule Closing Meeting
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
import BaseTaskWidget from '@/components/tasks/shared/BaseTaskWidget.vue'
import SurveyWidget from '@/components/customer/SurveyWidget.vue'

const props = defineProps({
  opportunity: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['schedule-closing', 'survey-completed', 'survey-refused', 'not-responding'])

const surveyQuestions = [
  {
    key: 'appointmentStatus',
    label: 'Why no appointment scheduled?',
    type: 'select',
    options: ['Customer delaying', 'Awaiting vehicle availability', 'Logistics issues', 'Customer not responding', 'Other']
  },
  {
    key: 'customerStatus',
    label: 'Customer status?',
    type: 'radio',
    options: ['Still interested', 'Considering', 'Lost interest', 'Unknown']
  },
  {
    key: 'notes',
    label: 'Additional information',
    type: 'text',
    placeholder: 'Any relevant details about the follow-up...'
  }
]


const handleScheduleClosing = () => {
  emit('schedule-closing', props.opportunity)
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

