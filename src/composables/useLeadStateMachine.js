/**
 * Lead State Machine Configuration
 * 
 * Pure configuration defining what actions and widgets exist for each lead stage.
 * Centralizes all branching logic and conditional actions based on lead statuses.
 */

import { computed } from 'vue'
import { LEAD_STAGES } from '@/utils/stageMapper'
import { useSettingsStore } from '@/stores/settings'

export const LEAD_STATE_CONFIG = {
  [LEAD_STAGES.NEW]: {
    primaryAction: {
      key: 'call-to-verify',
      title: 'Call to Verify Contact Details',
      description: 'Begin lead qualification by verifying customer contact information',
      label: 'Call to Verify',
      icon: 'fa-solid fa-phone',
      buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
      colorScheme: { background: 'bg-blue-50/50', border: 'border-blue-100' }
    },
    secondaryActions: [
      {
        key: 'disqualify',
        label: 'Disqualify Lead',
        icon: 'fa-solid fa-xmark',
        description: 'Mark lead as invalid or not interested'
      }
    ],
    taskWidgets: [
      { type: 'LQ', condition: 'always' } // LQWidget always shown for New leads
    ],
    showLQWidget: true,
    showDeadlineBanner: true,
    canPostpone: true,
    canReassign: true
  },

  [LEAD_STAGES.TO_BE_CALLED_BACK]: {
    primaryAction: {
      key: 'call-prospect',
      title: 'Call Prospect',
      description: 'Customer requested a callback. Make the call at scheduled time',
      label: 'Call Prospect',
      icon: 'fa-solid fa-phone',
      buttonClass: 'bg-purple-600 hover:bg-purple-700 text-white',
      colorScheme: { background: 'bg-purple-50/50', border: 'border-purple-100' }
    },
    secondaryActions: [
      {
        key: 'postpone',
        label: 'Postpone Task',
        icon: 'fa-solid fa-clock',
        description: 'Reschedule the callback'
      },
      {
        key: 'disqualify',
        label: 'Disqualify Lead',
        icon: 'fa-solid fa-xmark'
      }
    ],
    taskWidgets: [
      { type: 'LQ', condition: 'has-callback-date' }
    ],
    showLQWidget: (lead) => !!(lead.callbackDate || lead.callbackScheduled),
    showDeadlineBanner: true,
    canPostpone: true,
    canReassign: true
  },

  [LEAD_STAGES.VALID]: {
    primaryAction: {
      key: 'complete-conversion',
      title: 'Lead Validated',
      description: 'Lead is validated. Complete conversion details to create opportunity',
      label: 'Complete Conversion',
      icon: 'fa-solid fa-check-circle',
      buttonClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      colorScheme: { background: 'bg-emerald-50/50', border: 'border-emerald-100' }
    },
    secondaryActions: [
      {
        key: 'schedule-follow-up',
        label: 'Schedule Follow-up',
        icon: 'fa-solid fa-calendar-plus',
        conditional: 'no-appointment'
      },
      {
        key: 'disqualify',
        label: 'Disqualify Lead',
        icon: 'fa-solid fa-xmark'
      }
    ],
    taskWidgets: [
      { type: 'LQ', condition: 'always' } // Show LQWidget for conversion
    ],
    showLQWidget: true,
    showDeadlineBanner: true,
    canPostpone: false,
    canReassign: true,
    // LQWidget should show "interested" outcome flow
    lqWidgetMode: 'conversion'
  },

  [LEAD_STAGES.CLOSED_INVALID]: {
    primaryAction: {
      key: 'reopen',
      title: 'Lead Closed - Invalid',
      description: 'This lead has been marked as invalid. Reopen it to continue qualification',
      label: 'Reopen Lead',
      icon: 'fa-solid fa-rotate-left',
      buttonClass: 'bg-gray-600 hover:bg-gray-700 text-white',
      colorScheme: { background: 'bg-gray-50/50', border: 'border-gray-100' }
    },
    secondaryActions: [],
    taskWidgets: [],
    showLQWidget: false,
    showDeadlineBanner: false,
    canPostpone: false,
    canReassign: false
  },

  [LEAD_STAGES.CLOSED_NOT_INTERESTED]: {
    primaryAction: {
      key: 'reopen',
      title: 'Lead Closed - Not Interested',
      description: 'This lead has been marked as not interested. Reopen it to continue qualification',
      label: 'Reopen Lead',
      icon: 'fa-solid fa-rotate-left',
      buttonClass: 'bg-gray-600 hover:bg-gray-700 text-white',
      colorScheme: { background: 'bg-gray-50/50', border: 'border-gray-100' }
    },
    secondaryActions: [],
    taskWidgets: [],
    showLQWidget: false,
    showDeadlineBanner: false,
    canPostpone: false,
    canReassign: false
  },

  [LEAD_STAGES.CLOSED_DUPLICATE]: {
    primaryAction: {
      key: 'reopen',
      title: 'Lead Closed - Duplicate',
      description: 'This lead has been marked as duplicate. Reopen it to continue qualification',
      label: 'Reopen Lead',
      icon: 'fa-solid fa-rotate-left',
      buttonClass: 'bg-gray-600 hover:bg-gray-700 text-white',
      colorScheme: { background: 'bg-gray-50/50', border: 'border-gray-100' }
    },
    secondaryActions: [],
    taskWidgets: [],
    showLQWidget: false,
    showDeadlineBanner: false,
    canPostpone: false,
    canReassign: false
  }
}

// Helper function to get state config for a lead
export function getLeadStateConfig(lead) {
  const displayStage = lead?.displayStage || lead?.stage || LEAD_STAGES.NEW
  return LEAD_STATE_CONFIG[displayStage] || LEAD_STATE_CONFIG[LEAD_STAGES.NEW]
}

// Helper functions for auto-disqualification
export function shouldAutoDisqualify(lead, contactAttempts, maxAttempts) {
  return contactAttempts + 1 >= maxAttempts
}

export function getAutoDisqualifyReason(lead) {
  return {
    category: 'Not Interested',
    reason: 'Unreachable'
  }
}

// Composable function
export function useLeadStateMachine(lead) {
  const settingsStore = useSettingsStore()
  
  const displayStage = computed(() => {
    return lead.value?.displayStage || lead.value?.stage || LEAD_STAGES.NEW
  })
  
  const stateConfig = computed(() => {
    return getLeadStateConfig(lead.value)
  })
  
  const isClosedState = computed(() => {
    return displayStage.value.startsWith('Closed')
  })
  
  const isDisqualified = computed(() => {
    return lead.value?.isDisqualified || isClosedState.value
  })
  
  const showLQWidget = computed(() => {
    const config = stateConfig.value
    if (typeof config.showLQWidget === 'function') {
      return config.showLQWidget(lead.value)
    }
    return config.showLQWidget ?? false
  })
  
  const showDeadlineBanner = computed(() => {
    return stateConfig.value.showDeadlineBanner && lead.value?.nextActionDue
  })
  
  const canPostpone = computed(() => {
    return stateConfig.value.canPostpone ?? false
  })
  
  const canReassign = computed(() => {
    return stateConfig.value.canReassign ?? false
  })
  
  const maxContactAttempts = computed(() => {
    return settingsStore.getSetting('maxContactAttempts')
  })
  
  const contactAttempts = computed(() => {
    return (lead.value?.contactAttempts || []).length || 0
  })
  
  const shouldShowAutoDisqualifyWarning = computed(() => {
    return contactAttempts.value + 1 >= maxContactAttempts.value
  })
  
  const primaryAction = computed(() => {
    const action = stateConfig.value.primaryAction
    if (typeof action === 'function') {
      return action({ lead: lead.value, displayStage: displayStage.value })
    }
    return action
  })
  
  const secondaryActions = computed(() => {
    return stateConfig.value.secondaryActions || []
  })
  
  const lqWidgetMode = computed(() => {
    return stateConfig.value.lqWidgetMode || 'qualification'
  })
  
  return {
    displayStage,
    stateConfig,
    isClosedState,
    isDisqualified,
    showLQWidget,
    showDeadlineBanner,
    canPostpone,
    canReassign,
    maxContactAttempts,
    contactAttempts,
    shouldShowAutoDisqualifyWarning,
    primaryAction,
    secondaryActions,
    lqWidgetMode
  }
}

