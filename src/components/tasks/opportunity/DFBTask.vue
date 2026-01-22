<template>
  <BaseTaskWidget
    :title="'Delivery Feedback'"
    :description="`Vehicle was delivered ${daysSinceDelivery} days ago. Ask the customer if they're satisfied with the vehicle.`"
    :color-scheme="{ background: 'bg-teal-50/50', border: 'border-teal-100' }"
  >
    <template #actions>
      <button
        @click="handleDeliveryFeedback"
        class="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded-btn text-fluid-xs flex items-center gap-2 transition-colors"
      >
        Delivery Feedback
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
  activities: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['delivery-feedback', 'survey-completed', 'survey-refused', 'not-responding'])

const surveyQuestions = [
  {
    key: 'satisfaction',
    label: 'Satisfaction with vehicle?',
    type: 'radio',
    options: ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied']
  },
  {
    key: 'deliveryExperience',
    label: 'Delivery experience rating',
    type: 'select',
    options: ['Excellent', 'Good', 'Average', 'Poor', 'Very poor']
  },
  {
    key: 'issues',
    label: 'Any issues or concerns?',
    type: 'text',
    placeholder: 'Document any issues or positive feedback from customer...'
  }
]

const daysSinceDelivery = computed(() => {
  // Find delivery activity
  const deliveryActivity = props.activities.find(activity => 
    activity.type === 'delivery' || 
    activity.action?.toLowerCase().includes('delivered')
  )
  
  if (!deliveryActivity || !deliveryActivity.timestamp) return 0
  
  const deliveryDate = new Date(deliveryActivity.timestamp)
  const now = new Date()
  const diffTime = Math.abs(now - deliveryDate)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const handleDeliveryFeedback = () => {
  emit('delivery-feedback', props.opportunity)
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

