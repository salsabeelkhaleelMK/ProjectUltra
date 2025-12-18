<template>
  <div class="bg-blue-50/50 border border-blue-100 rounded-lg p-4 relative transition-all duration-300">
    <div class="flex justify-between items-start mb-3">
      <div>
        <h4 class="font-bold text-slate-800 text-sm">Offer Feedback</h4>
        <p class="text-xs text-gray-500 mt-0.5">This opportunity has been in negotiation for {{ daysInNegotiation }} days without a contract. Consider creating a contract to finalize the deal.</p>
      </div>
    </div>
    <div class="flex gap-3 flex-wrap">
      <button
        @click="handleCreateContract"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
      >
        Create Contract
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
  }
})

const emit = defineEmits(['create-contract', 'close-lost', 'survey-completed', 'survey-refused', 'not-responding'])

const surveyQuestions = [
  {
    key: 'customerFeedback',
    label: 'Customer feedback on offer?',
    type: 'select',
    options: ['Positive', 'Neutral', 'Negative', 'No feedback yet']
  },
  {
    key: 'objections',
    label: 'Any objections?',
    type: 'text',
    placeholder: 'Describe any concerns or objections raised by customer...'
  },
  {
    key: 'nextSteps',
    label: 'What are the next steps?',
    type: 'select',
    options: ['Waiting for customer decision', 'Revising offer', 'Scheduling closing meeting', 'Addressing objections', 'Other']
  }
]

const daysInNegotiation = computed(() => {
  // Calculate days since opportunity entered negotiation stage
  // For now, use lastActivity or createdAt as fallback
  const date = props.opportunity.lastActivity || props.opportunity.createdAt
  if (!date) return 0
  const negotiationDate = new Date(date)
  const now = new Date()
  const diffTime = Math.abs(now - negotiationDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

const handleCreateContract = () => {
  emit('create-contract', props.opportunity)
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

