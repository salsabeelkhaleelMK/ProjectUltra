<template>
  <div class="bg-purple-50/50 border border-purple-100 rounded-lg p-4 relative transition-all duration-300">
    <div class="flex justify-between items-start mb-3">
      <div>
        <h4 class="font-bold text-slate-800 text-sm">Opportunity Follow-up</h4>
        <p class="text-xs text-gray-500 mt-0.5">No contract date exists. Push to close or schedule a closing meeting to finalize the deal.</p>
      </div>
    </div>
    <div class="flex gap-3 flex-wrap">
      <button
        @click="handleScheduleClosing"
        class="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
      >
        Schedule Closing Meeting
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

