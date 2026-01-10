<template>
  <div class="bg-red-50/50 border border-red-100 rounded-lg p-4 relative transition-all duration-300">
    <div class="flex justify-between items-start mb-3">
      <div>
        <h4 class="font-bold text-slate-800 text-sm">Unsold Feedback</h4>
        <p class="text-xs text-gray-500 mt-0.5">This opportunity has been open for {{ daysOpen }} days without any offer. This is a follow-up to ensure progress. Consider creating an offer or closing the opportunity.</p>
      </div>
    </div>
    <div class="flex gap-3 flex-wrap">
      <button
        @click="handleCreateContract"
        class="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
      >
        Create Offer
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
import SurveyWidget from '@/components/customer/SurveyWidget.vue'

const props = defineProps({
  opportunity: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['create-offer', 'survey-completed', 'survey-refused', 'not-responding'])

const surveyQuestions = [
  {
    key: 'lostInterest',
    label: 'Has customer lost interest?',
    type: 'radio',
    options: ['Yes', 'Maybe', 'No', 'Unknown']
  },
  {
    key: 'blockers',
    label: 'What are the blockers?',
    type: 'select',
    options: ['Pricing', 'Availability', 'Financing', 'No response', 'Changed mind', 'Found competitor', 'Other']
  },
  {
    key: 'notes',
    label: 'Additional feedback',
    type: 'text',
    placeholder: 'Describe the situation and any relevant details...'
  }
]

const daysOpen = computed(() => {
  // Calculate days since opportunity was created
  if (!props.opportunity.createdAt) return 0
  const created = new Date(props.opportunity.createdAt)
  const now = new Date()
  const diffTime = Math.abs(now - created)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

const handleCreateContract = () => {
  emit('create-offer', props.opportunity)
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

