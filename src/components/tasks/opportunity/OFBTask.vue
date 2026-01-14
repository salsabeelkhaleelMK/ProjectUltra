<template>
  <BaseTaskWidget
    :title="'Offer Feedback'"
    :description="`This opportunity has been in negotiation for ${daysInNegotiation} days without a contract. Consider creating a contract to finalize the deal.`"
    :color-scheme="{ background: 'bg-blue-50/50', border: 'border-blue-100' }"
  >
    <template #actions>
      <button
        @click="handleCreateContract"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
      >
        Create Contract
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
  }
})

const emit = defineEmits(['create-contract', 'survey-completed', 'survey-refused', 'not-responding'])

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

