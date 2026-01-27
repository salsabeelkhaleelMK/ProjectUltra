<template>
  <div class="rounded-lg flex flex-col bg-muted">
    <div class="pt-1 px-1">
      <div class="bg-white rounded-lg shadow-nsc-card overflow-visible">
        <div class="p-6">
          <div class="mb-3">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h4 class="font-bold text-foreground text-sm">Post-Delivery Customer Satisfaction Survey</h4>
                <p class="text-sm text-muted-foreground mt-0.5">
                  Collect feedback from the customer about their delivery experience
                </p>
              </div>
              <button
                @click="$emit('postpone', 'dfb')"
                class="bg-white border border-D1D5DB text-brand-dark font-medium px-4 py-2 rounded-btn text-xs flex items-center gap-2 transition-colors hover:bg-muted ml-4"
              >
                <i class="fa-solid fa-clock"></i>
                <span>Postpone</span>
              </button>
            </div>
          </div>
          <div class="flex flex-wrap gap-3 items-center">
            <Toggle
              variant="outline"
              :model-value="showSurvey"
              @update:model-value="showSurvey = $event"
              class="outcome-toggle-item"
            >
              <i class="fa-solid fa-clipboard-list"></i>
              <span>Complete Survey</span>
            </Toggle>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="showSurvey" class="px-4 py-4 space-y-4">
      <PostDeliverySurvey
        ref="surveyRef"
        :opportunity="opportunity"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
      <div class="flex justify-end gap-2 pt-3">
        <Button
          variant="secondary"
          @click="handleCancel"
        >
          Cancel
        </Button>
        <Button
          variant="default"
          :disabled="!canSubmit"
          @click="handleConfirm"
        >
          Submit Survey
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Button, Toggle } from '@motork/component-library/future/primitives'
import PostDeliverySurvey from '@/components/tasks/opportunity/PostDeliverySurvey.vue'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useUserStore } from '@/stores/user'

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

const emit = defineEmits(['close', 'survey-submitted', 'survey-cancelled', 'postpone'])

const opportunitiesStore = useOpportunitiesStore()
const userStore = useUserStore()

const showSurvey = ref(false)
const surveyRef = ref(null)

const canSubmit = computed(() => {
  return surveyRef.value?.isValid || false
})

const handleSubmit = async (surveyData) => {
  try {
    const opp = props.opportunity
    const { responses, triggerActions } = surveyData
    
    // Save survey as activity
    await opportunitiesStore.addActivity(opp.id, {
      type: 'post-delivery-survey',
      user: userStore.currentUser?.name || 'You',
      action: 'completed post-delivery customer satisfaction survey',
      content: 'Post-Delivery Customer Satisfaction Survey completed',
      data: {
        responses,
        triggerActions,
        timestamp: surveyData.timestamp
      },
      timestamp: surveyData.timestamp
    })
    
    // Process trigger actions and send emails
    const triggerActivityPromises = []
    
    if (triggerActions.negativeSatisfaction) {
      triggerActivityPromises.push(
        opportunitiesStore.addActivity(opp.id, {
          type: 'survey-trigger',
          user: userStore.currentUser?.name || 'You',
          action: 'triggered email notification',
          content: 'Email sent to Sales Manager + Branch Manager (Negative satisfaction)',
          data: {
            trigger: 'negative-satisfaction',
            recipients: ['Sales Manager', 'Branch Manager'],
            surveyResponse: responses.q1
          },
          timestamp: new Date().toISOString()
        })
      )
    }
    
    if (triggerActions.issuesReported) {
      triggerActivityPromises.push(
        opportunitiesStore.addActivity(opp.id, {
          type: 'survey-trigger',
          user: userStore.currentUser?.name || 'You',
          action: 'triggered email notification',
          content: 'Email sent to Service Department (Issues reported)',
          data: {
            trigger: 'issues-reported',
            recipients: ['Service Department'],
            issueDescription: responses.q3
          },
          timestamp: new Date().toISOString()
        })
      )
    }
    
    if (triggerActions.deliveryDelay) {
      triggerActivityPromises.push(
        opportunitiesStore.addActivity(opp.id, {
          type: 'survey-trigger',
          user: userStore.currentUser?.name || 'You',
          action: 'triggered email notification',
          content: 'Email sent to Delivery Coordinator (Major delivery delay)',
          data: {
            trigger: 'delivery-delay',
            recipients: ['Delivery Coordinator'],
            surveyResponse: responses.q4
          },
          timestamp: new Date().toISOString()
        })
      )
    }
    
    if (triggerActions.highNPS) {
      triggerActivityPromises.push(
        opportunitiesStore.addActivity(opp.id, {
          type: 'survey-trigger',
          user: userStore.currentUser?.name || 'You',
          action: 'triggered email notification',
          content: 'Email sent to Marketing (High NPS - Definitely Yes)',
          data: {
            trigger: 'high-nps',
            recipients: ['Marketing'],
            surveyResponse: responses.q7
          },
          timestamp: new Date().toISOString()
        })
      )
    }
    
    // Wait for all trigger activities to be created
    await Promise.all(triggerActivityPromises)
    
    // Close the survey section
    showSurvey.value = false
    
    // Emit event for parent component
    emit('survey-submitted', { opportunity: opp, surveyData })
  } catch (error) {
    console.error('Failed to submit survey:', error)
  }
}

const handleConfirm = () => {
  if (surveyRef.value) {
    surveyRef.value.submit()
  }
}

const handleCancel = () => {
  showSurvey.value = false
  emit('survey-cancelled', { opportunity: props.opportunity })
}
</script>
