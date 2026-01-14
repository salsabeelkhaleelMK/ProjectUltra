<template>
  <TaskManagementWidget :task="lead">
    <template #deadline-banner>
      <DeadlineBanner
        :next-action-due="lead.nextActionDue"
        :is-closed="leadState.isClosed.value"
        :show-deadline-banner="leadState.showDeadlineBanner.value"
        :task-id="lead.id"
      />
    </template>

    <template #primary-action>
      <!-- Primary action = LQTask (the lead workflow), matching opportunities layout -->
      <LQTask
        v-if="!leadState.isClosed.value && leadState.showLQWidget.value" 
        :key="lead.id"
        :lead="lead"
        @postponed="handlePostponed"
        @validated="handleValidated"
        @qualified="handleQualified"
        @disqualified="handleDisqualified"
        @call-attempt-logged="handleCallAttemptLogged"
        @note-saved="handleNoteSaved"
        @open-purchase-method="handleOpenPurchaseMethod"
        @open-trade-in="handleOpenTradeIn"
        @appointment-scheduled="handleAppointmentScheduled"
      />

      <!-- Fallback: if LQTask is not shown for a stage, show the generic primary action -->
      <PrimaryActionWidget
        v-else-if="!leadState.isClosed.value && leadState.primaryAction.value"
        :action="leadState.primaryAction.value"
        :color-scheme="leadState.primaryAction.value.colorScheme"
        @action-clicked="leadState.primaryAction.value.handler"
      />
    </template>

    <template #task-widgets>
      <!-- No lead widgets here for now (LQTask lives in Primary Action) -->
    </template>

    <template #closed-state>
      <!-- Closed States -->
      <div 
        v-if="leadState.isClosed.value"
        class="bg-gray-50/50 border border-gray-100 rounded-lg p-4"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <h4 class="font-bold text-gray-900 text-sm">Lead Closed</h4>
            <p class="text-xs text-gray-500 mt-0.5">
              Status: {{ leadState.displayStage.value }}
              <span v-if="lead.disqualifyReason"> - {{ lead.disqualifyReason }}</span>
            </p>
          </div>
        </div>
        <button
          @click="handleReopen"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          Reopen Lead <i class="fa-solid fa-rotate-left"></i>
        </button>
      </div>
    </template>
  </TaskManagementWidget>
</template>

<script setup>
import { toRef } from 'vue'
import { useLeadsStore } from '@/stores/leads'
import { useLeadActions } from '@/composables/useLeadActions'
import { useLeadManagementHandlers } from '@/composables/useLeadManagementHandlers'

// Components
import TaskManagementWidget from '@/components/tasks/shared/TaskManagementWidget.vue'
import PrimaryActionWidget from '@/components/tasks/shared/PrimaryActionWidget.vue'
import DeadlineBanner from '@/components/tasks/shared/DeadlineBanner.vue'
import LQTask from '@/components/tasks/lead/LQTask.vue'

const props = defineProps({
  lead: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['open-purchase-method', 'open-trade-in'])

const leadsStore = useLeadsStore()

// Helper to get current lead (try store first, fallback to props)
const getCurrentLead = () => {
  const storeLead = leadsStore.currentLead
  return (storeLead && storeLead.id === props.lead?.id) ? storeLead : props.lead
}

// Action handlers (empty for now, primary action is handled by LQTask)
const actionHandlers = {
  'call-to-verify': () => { /* Handled by LQTask */ },
  'call-prospect': () => { /* Handled by LQTask */ },
  'complete-conversion': () => { /* Handled by LQTask */ },
  'reopen': () => { /* Handled by handleReopen */ }
}

// Use lead actions composable - matches opportunity pattern
const leadState = useLeadActions(toRef(props, 'lead'), actionHandlers)

// Use handlers composable
const {
  handlePostponed,
  handleValidated,
  handleQualified,
  handleCallAttemptLogged,
  handleNoteSaved,
  handleOpenPurchaseMethod,
  handleOpenTradeIn,
  handleAppointmentScheduled,
  handleDisqualified,
  handleReopen
} = useLeadManagementHandlers({
  getLead: getCurrentLead,
  leadState,
  emit
})
</script>

<style scoped>
</style>

