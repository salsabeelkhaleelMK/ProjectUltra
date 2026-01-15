<template>
  <BaseTaskWidget
    :title="'Contract Feedback'"
    :description="`Contract was signed ${daysSinceContract} days ago. Follow up on delivery status and collect customer feedback.`"
    :color-scheme="{ background: 'bg-green-50/50', border: 'border-green-100' }"
  >
    <template #actions>
      <Button
        variant="primary"
        size="small"
        @click="handlePrepareDelivery"
        class="flex items-center gap-2 bg-green-600 hover:bg-green-700"
      >
        Prepare for Delivery
      </Button>
      <Button
        variant="outline"
        size="small"
        @click="handlePreDeliveryChecklist"
        class="flex items-center gap-2"
      >
        Pre-Delivery Checklist
      </Button>
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
import { Button } from '@motork/component-library'
import BaseTaskWidget from '@/components/tasks/shared/BaseTaskWidget.vue'
import SurveyWidget from '@/components/customer/SurveyWidget.vue'

const props = defineProps({
  opportunity: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['prepare-delivery', 'pre-delivery-checklist', 'survey-completed', 'survey-refused', 'not-responding'])

const surveyQuestions = [
  {
    key: 'deliveryTimeline',
    label: 'Delivery timeline confirmation?',
    type: 'select',
    options: ['On schedule', 'Delayed', 'Ahead of schedule', 'To be determined']
  },
  {
    key: 'concerns',
    label: 'Any concerns?',
    type: 'text',
    placeholder: 'Document any concerns or special requests from customer...'
  },
  {
    key: 'readiness',
    label: 'Vehicle readiness status?',
    type: 'select',
    options: ['Ready', 'In preparation', 'Waiting for parts', 'Other']
  }
]

const daysSinceContract = computed(() => {
  if (!props.opportunity?.contractDate) return 0
  const contract = new Date(props.opportunity.contractDate)
  const now = new Date()
  const diffTime = Math.abs(now - contract)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const handlePrepareDelivery = () => {
  emit('prepare-delivery', props.opportunity)
}

const handlePreDeliveryChecklist = () => {
  emit('pre-delivery-checklist', props.opportunity)
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

