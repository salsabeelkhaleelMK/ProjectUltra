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
      <!-- Timeline: Last Activity + Next Step (LQTask) -->
      <div 
        v-if="shouldShowLastActivitySummary && lastActivity && !leadState.isClosed.value && leadState.showLQWidget.value"
        class="relative"
      >
        <!-- Vertical Timeline Line (extends through both activity and LQTask) -->
        <div class="absolute left-5 top-0 bottom-0 w-0.5 bg-border z-0"></div>
        
        <!-- Last Activity -->
        <div class="flex gap-4 relative mb-6 pb-6">
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 relative bg-surface"
            :class="getActivityIconClass(lastActivity.type)"
          >
            <i :class="getActivityIcon(lastActivity.type)" class="text-fluid-sm"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 mb-1">
              <div class="flex-1 min-w-0">
                <div class="text-fluid-sm text-slate-700 leading-snug">
                  <span class="font-bold">{{ lastActivity.user }}</span> {{ lastActivity.action }}
                </div>
              </div>
              <button
                @click="handleViewHistory"
                class="text-fluid-xs font-medium text-brand-red hover:text-brand-redDark hover:underline transition-colors shrink-0 flex items-center gap-1"
                title="View full activity history"
              >
                <span>View history</span>
                <i class="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </div>
            <div v-if="lastActivity.content" class="mt-2 bg-orange-50/50 border border-orange-100 p-3 rounded-lg text-fluid-sm text-body">
              {{ lastActivity.content }}
            </div>
            <div class="text-fluid-xs text-sub mt-1">{{ formatActivityTime(lastActivity.timestamp) }}</div>
          </div>
        </div>
        
        <!-- Next Step: LQTask on Timeline -->
        <div class="flex gap-4 relative">
          <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 relative bg-surface border-2 border-brand-red">
            <i class="fa-solid fa-arrow-right text-brand-red text-fluid-sm"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-fluid-xs font-semibold text-sub uppercase mb-3">Next Step</p>
            <!-- LQTask as Next Step -->
            <LQTask
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
          </div>
        </div>
      </div>

      <!-- Primary action = LQTask (when no activity summary to show) -->
      <LQTask
        v-else-if="!leadState.isClosed.value && leadState.showLQWidget.value" 
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
        class="bg-gray-50/50 border border-gray-100 rounded-card p-4"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <h4 class="font-bold text-gray-900 text-fluid-sm">Lead Closed</h4>
            <p class="text-fluid-xs text-gray-500 mt-0.5">
              Status: {{ leadState.displayStage.value }}
              <span v-if="lead.disqualifyReason"> - {{ lead.disqualifyReason }}</span>
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="small"
          @click="handleReopen"
          class="flex items-center gap-2"
        >
          <span>Reopen Lead</span>
          <i class="fa-solid fa-rotate-left"></i>
        </Button>
      </div>
    </template>
  </TaskManagementWidget>
</template>

<script setup>
import { toRef, computed } from 'vue'
import { Button } from '@motork/component-library'
import { useLeadsStore } from '@/stores/leads'
import { useLeadActions } from '@/composables/useLeadActions'
import { useLeadManagementHandlers } from '@/composables/useLeadManagementHandlers'
import { LEAD_STAGES, getDisplayStage } from '@/utils/stageMapper'

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

const emit = defineEmits(['open-purchase-method', 'open-trade-in', 'view-history'])

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

// Check if should show last activity summary
// Show for: callback scheduled OR valid but needs next attempt (not new leads with nothing happened)
const shouldShowLastActivitySummary = computed(() => {
  const currentLead = getCurrentLead()
  if (!currentLead) return false
  
  // Don't show for closed leads
  if (leadState.isClosed.value) return false
  
  const displayStage = getDisplayStage(currentLead, 'lead')
  
  // Show for leads with callback scheduled
  const hasCallback = !!(currentLead.callbackDate || currentLead.callbackScheduled)
  
  // Show for valid leads that need next attempt (has contact attempts or scheduled appointment, but not maxed out)
  const isValid = displayStage === LEAD_STAGES.VALID
  const hasContactAttempts = (currentLead.contactAttempts || []).length > 0
  const hasScheduledAppointment = !!currentLead.scheduledAppointment
  const hasNextActionDue = !!currentLead.nextActionDue
  // Only use activities if they match the current lead (prevent using stale activities from different lead)
  const activitiesMatch = leadsStore.currentLead?.id === props.lead?.id
  const hasActivities = activitiesMatch && (leadsStore.currentLeadActivities || []).length > 0
  
  // Valid but needs next attempt: has contact attempts/appointment/nextAction AND has activities (something happened before)
  const validNeedsNextAttempt = isValid && hasActivities && (hasContactAttempts || hasScheduledAppointment || hasNextActionDue)
  
  // Don't show for new leads with nothing happened (no activities)
  const isNewLead = displayStage === LEAD_STAGES.NEW
  if (isNewLead && !hasActivities) return false
  
  return hasCallback || validNeedsNextAttempt
})

// Get last activity (most recent)
const lastActivity = computed(() => {
  // Only use activities if they match the current lead (prevent using stale activities from different lead)
  const activitiesMatch = leadsStore.currentLead?.id === props.lead?.id
  if (!activitiesMatch) return null
  
  const activities = leadsStore.currentLeadActivities || []
  if (activities.length === 0) return null
  
  // Sort by timestamp descending and get the first one
  const sorted = [...activities].sort((a, b) => {
    const timeA = new Date(a.timestamp || 0).getTime()
    const timeB = new Date(b.timestamp || 0).getTime()
    return timeB - timeA
  })
  
  return sorted[0] || null
})

// Activity icon helpers
const getActivityIcon = (type) => {
  const icons = {
    'call': 'fa-solid fa-phone text-blue-600',
    'email': 'fa-solid fa-envelope text-green-600',
    'note': 'fa-solid fa-sticky-note text-yellow-600',
    'meeting': 'fa-solid fa-calendar text-purple-600',
    'task': 'fa-solid fa-check-circle text-indigo-600',
    'attachment': 'fa-solid fa-paperclip text-body',
    'status': 'fa-solid fa-tag text-orange-600',
    'default': 'fa-solid fa-circle text-sub'
  }
  return icons[type] || icons.default
}

const getActivityIconClass = (type) => {
  const classes = {
    'call': 'bg-blue-100 text-blue-600',
    'email': 'bg-green-100 text-green-600',
    'note': 'bg-yellow-100 text-yellow-600',
    'meeting': 'bg-purple-100 text-purple-600',
    'task': 'bg-indigo-100 text-indigo-600',
    'attachment': 'bg-surfaceSecondary text-body',
    'status': 'bg-orange-100 text-orange-600',
    'default': 'bg-surfaceSecondary text-sub'
  }
  return classes[type] || classes.default
}

// Format activity time
const formatActivityTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

// Handle view history click - switch to Request tab
const handleViewHistory = () => {
  emit('view-history')
}

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

