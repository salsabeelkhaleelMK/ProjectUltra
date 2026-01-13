/**
 * Lead State Machine Configuration
 * 
 * Pure configuration defining what actions and widgets exist for each lead stage.
 * Centralizes all branching logic and conditional actions based on lead statuses.
 */

import { computed } from 'vue'
import { LEAD_STAGES, getDisplayStage } from '@/utils/stageMapper'
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
  // Always calculate displayStage from the lead object to ensure correct mapping
  const displayStage = getDisplayStage(lead, 'lead')
  return LEAD_STATE_CONFIG[displayStage] || LEAD_STATE_CONFIG[LEAD_STAGES.NEW]
}

// Transition handlers - define what happens when transitioning between states
export const LEAD_TRANSITION_HANDLERS = {
  // Transition to any closed state
  toClosed: (lead, targetStage, disqualifyData) => {
    const updates = {
      isDisqualified: true,
      disqualifyReason: disqualifyData?.reason || null,
      disqualifyCategory: disqualifyData?.category || null,
      scheduledAppointment: null, // Cancel any future appointments
      nextActionDue: null // Clear deadline
    }
    
    // Set stage based on disqualify reason
    if (disqualifyData?.reason === 'Duplicate') {
      updates.isDuplicate = true
      updates.stage = 'Closed Failed'
    } else if (disqualifyData?.category === 'Not Interested') {
      updates.stage = 'Not Interested'
    } else {
      updates.stage = 'Not Valid'
    }
    
    updates.status = 'Disqualified'
    
    // Generate activity logs
    const activities = [
      {
        type: 'note',
        user: 'You',
        action: 'disqualified lead',
        content: `Lead disqualified - Category: ${disqualifyData?.category || 'Unknown'}, Reason: ${disqualifyData?.reason || 'Unknown'}`
      }
    ]
    
    // Add appointment cancellation activity if there was one
    if (lead.scheduledAppointment) {
      activities.push({
        type: 'appointment',
        user: 'You',
        action: 'cancelled appointment',
        content: `Appointment cancelled due to lead disqualification`,
        data: {
          cancelledReason: 'Lead disqualified',
          originalAppointment: lead.scheduledAppointment
        }
      })
    }
    
    return {
      updates,
      activities
    }
  },
  
  // Transition from closed state back to open (reopen)
  reopen: (lead) => {
    return {
      updates: {
        isDisqualified: false,
        disqualifyReason: null,
        disqualifyCategory: null,
        isDuplicate: false,
        stage: 'Open Lead',
        status: 'Open',
        nextActionDue: null, // Clear any old due dates
        scheduledAppointment: null // Clear any old appointments
      },
      activities: [
        {
          type: 'note',
          user: 'You',
          action: 'reopened lead',
          content: 'Lead has been reopened for qualification'
        }
      ]
    }
  }
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

// Get transition handler for a specific transition
export function getTransitionHandler(fromStage, toStage) {
  // Transition to any closed state
  if (toStage.startsWith('Closed')) {
    return LEAD_TRANSITION_HANDLERS.toClosed
  }
  
  // Reopen transition
  if (fromStage.startsWith('Closed') && !toStage.startsWith('Closed')) {
    return LEAD_TRANSITION_HANDLERS.reopen
  }
  
  return null
}

// Composable function
export function useLeadStateMachine(lead) {
  const settingsStore = useSettingsStore()
  
  // Helper to get lead value - handles both refs and getter functions
  const getLeadValue = () => {
    if (typeof lead === 'function') {
      return lead()
    }
    return lead?.value || lead
  }
  
  const displayStage = computed(() => {
    const leadValue = getLeadValue()
    if (!leadValue) {
      return LEAD_STAGES.NEW
    }
    
    // Defensive: Ensure isDisqualified is explicitly set (default to false)
    // This prevents undefined/null from causing issues
    const leadWithDefaults = {
      ...leadValue,
      isDisqualified: leadValue.isDisqualified === true
    }
    
    // Always calculate displayStage from the lead object to ensure correct mapping
    const calculatedStage = getDisplayStage(leadWithDefaults, 'lead')
    // Fallback to NEW if calculation returns null/undefined or invalid value
    if (!calculatedStage || typeof calculatedStage !== 'string') {
      return LEAD_STAGES.NEW
    }
    
    // Double-check: If lead is not disqualified, calculated stage should never be closed
    if (leadWithDefaults.isDisqualified !== true && calculatedStage.startsWith('Closed')) {
      console.warn('Lead state machine error: Non-disqualified lead calculated as closed stage', {
        leadId: leadValue.id,
        isDisqualified: leadValue.isDisqualified,
        calculatedStage,
        stage: leadValue.stage,
        apiStatus: leadValue.apiStatus
      })
      return LEAD_STAGES.NEW
    }
    
    return calculatedStage
  })
  
  const stateConfig = computed(() => {
    return getLeadStateConfig(getLeadValue())
  })
  
  const isClosedState = computed(() => {
    const leadValue = getLeadValue()
    
    // CRITICAL: Only return true if lead is explicitly disqualified
    // This is the primary check - if not disqualified, can never be closed
    const isDisqualified = leadValue?.isDisqualified === true
    
    // Debug: Always log to see what's happening
    const stage = displayStage.value
    console.log('isClosedState computed:', {
      leadId: leadValue?.id,
      isDisqualified,
      leadIsDisqualified: leadValue?.isDisqualified,
      displayStage: stage,
      leadStage: leadValue?.stage,
      leadApiStatus: leadValue?.apiStatus
    })
    
    if (!isDisqualified) {
      // Lead is not disqualified, so it cannot be in a closed state
      console.log('isClosedState: returning false (not disqualified)')
      return false
    }
    
    // Lead IS disqualified - now check if stage is closed
    // Only return true if stage is explicitly a closed stage
    if (!stage || typeof stage !== 'string') {
      console.log('isClosedState: returning false (no stage)')
      return false
    }
    
    // Check if it's one of the closed stages
    const isClosed = stage === LEAD_STAGES.CLOSED_INVALID || 
                     stage === LEAD_STAGES.CLOSED_NOT_INTERESTED || 
                     stage === LEAD_STAGES.CLOSED_DUPLICATE ||
                     stage.startsWith('Closed')
    
    console.log('isClosedState: returning', isClosed, 'for disqualified lead')
    return isClosed
  })
  
  const isDisqualified = computed(() => {
    const leadValue = getLeadValue()
    // Only return true if explicitly set to true
    return leadValue?.isDisqualified === true
  })
  
  const showLQWidget = computed(() => {
    const config = stateConfig.value
    if (typeof config.showLQWidget === 'function') {
      return config.showLQWidget(getLeadValue())
    }
    return config.showLQWidget ?? false
  })
  
  const showDeadlineBanner = computed(() => {
    // Never show deadline banner for closed leads
    if (isClosedState.value) {
      return false
    }
    return stateConfig.value.showDeadlineBanner && getLeadValue()?.nextActionDue
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
    return (getLeadValue()?.contactAttempts || []).length || 0
  })
  
  const shouldShowAutoDisqualifyWarning = computed(() => {
    return contactAttempts.value + 1 >= maxContactAttempts.value
  })
  
  const primaryAction = computed(() => {
    const action = stateConfig.value.primaryAction
    if (typeof action === 'function') {
      return action({ lead: getLeadValue(), displayStage: displayStage.value })
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

