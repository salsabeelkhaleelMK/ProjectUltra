/**
 * Opportunity Business Rules Engine
 * 
 * Pure functions for evaluating conditions and determining which actions/widgets to show.
 * All functions are testable and have no side effects.
 */

import { OPPORTUNITY_STATE_CONFIG, CLOSED_OPPORTUNITY_ACTIONS } from '@/composables/useOpportunityStateMachine'
import { useSettingsStore } from '@/stores/settings'

// Helper function to calculate days since a date
function calculateDaysSince(dateString) {
  if (!dateString) return 0
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Condition Evaluators
 * Each function takes a context object and returns boolean
 */
export const OpportunityConditions = {
  // Appointment conditions
  'no-appointment': (context) => !context.scheduledAppointment,
  
  'has-appointment': (context) => !!context.scheduledAppointment,
  
  'appointment-past-not-completed': (context) => {
    if (!context.scheduledAppointment) return false
    const appointmentDate = new Date(context.scheduledAppointment.start)
    const now = new Date()
    return appointmentDate < now && context.scheduledAppointment.status !== 'completed'
  },
  
  'has-future-appointment': (context) => {
    if (!context.scheduledAppointment) return false
    return new Date(context.scheduledAppointment.start) > new Date()
  },

  // Offer conditions
  'no-offers': (context) => !context.hasOffers,
  
  'has-offers': (context) => context.hasOffers,

  // Qualified stage conditions
  'qualified-no-offers-7-13-days': (context) => {
    const settingsStore = useSettingsStore()
    const minDays = settingsStore.getSetting('oofbMinDays')
    const maxDays = settingsStore.getSetting('oofbMaxDays')
    const days = calculateDaysSince(context.opportunity.createdAt)
    return days >= minDays && days < maxDays + 1 && !context.hasOffers
  },
  
  'qualified-no-offers-14-plus-days': (context) => {
    const settingsStore = useSettingsStore()
    const threshold = settingsStore.getSetting('ufbDays')
    const days = calculateDaysSince(context.opportunity.createdAt)
    return days >= threshold && !context.hasOffers
  },

  // Negotiation stage conditions
  'negotiation-5-plus-days-no-contract-has-offers': (context) => {
    // For 'In Negotiation' stage, only show if offers exist
    if (context.stage === 'In Negotiation' && !context.hasOffers) {
      return false
    }
    
    const settingsStore = useSettingsStore()
    const threshold = settingsStore.getSetting('ofbDays')
    const days = calculateDaysSince(context.opportunity.lastActivity || context.opportunity.createdAt)
    return days >= threshold && !context.opportunity.contractDate && context.hasOffers
  },
  
  'negotiation-5-plus-days-no-contract-no-future-appointment-has-offers': (context) => {
    // For 'In Negotiation' stage, only show if offers exist
    if (context.stage === 'In Negotiation' && !context.hasOffers) {
      return false
    }
    
    const settingsStore = useSettingsStore()
    const threshold = settingsStore.getSetting('nfuDays')
    const days = calculateDaysSince(context.opportunity.lastActivity || context.opportunity.createdAt)
    const hasFutureAppointment = context.scheduledAppointment && 
      new Date(context.scheduledAppointment.start) > new Date()
    
    return days >= threshold && !context.opportunity.contractDate && !hasFutureAppointment && context.hasOffers
  },

  // Contract/Delivery conditions
  'contract-7-plus-days-no-delivery': (context) => {
    if (!context.opportunity.contractDate) return false
    
    const settingsStore = useSettingsStore()
    const threshold = settingsStore.getSetting('cfbDays')
    const days = calculateDaysSince(context.opportunity.contractDate)
    const hasDelivery = context.activities?.some(a => 
      a.type === 'delivery' || a.action?.toLowerCase().includes('delivered')
    )
    
    return days >= threshold && !hasDelivery
  },
  
  'delivery-date-set': (context) => {
    // Trigger DFB immediately when delivery date is set
    return !!context.opportunity.deliveryDate
  },
  
  'delivery-3-plus-days': (context) => {
    const deliveryActivity = context.activities?.find(a => 
      a.type === 'delivery' || a.action?.toLowerCase().includes('delivered')
    )
    
    if (!deliveryActivity) return false
    
    const settingsStore = useSettingsStore()
    const threshold = settingsStore.getSetting('dfbDays')
    const days = calculateDaysSince(deliveryActivity.timestamp)
    return days >= threshold
  },

  // Delivery substatus conditions
  'is-awaiting-delivery': (context) => {
    return context.deliverySubstatus === 'Awaiting Delivery'
  },
  
  'is-delivered': (context) => {
    return context.deliverySubstatus === 'Delivered'
  },
  
  'has-no-delivery': (context) => {
    return !context.deliverySubstatus || context.deliverySubstatus === null
  },

  // Closed state conditions
  'is-closed': (context) => {
    const stage = context.stage
    return stage === 'Closed Won' || stage === 'Closed Lost'
  },
  
  'is-closed-with-task-widget': (context) => {
    return OpportunityConditions['is-closed'](context) && context.hasActiveTaskWidget
  },

  // Abandoned condition
  'opportunity-abandoned': (context) => {
    // Don't mark as abandoned if already closed
    if (OpportunityConditions['is-closed'](context)) {
      return false
    }

    const settingsStore = useSettingsStore()
    const threshold = settingsStore.getSetting('abandonedOpportunityDays')
    const eligibleStages = settingsStore.getSetting('abandonedEligibleStages')
    
    // Check if stage is eligible
    if (!eligibleStages.includes(context.stage)) {
      return false
    }
    
    // Calculate days since last activity
    const lastActivity = context.opportunity.lastActivity || context.opportunity.createdAt
    const days = calculateDaysSince(lastActivity)
    
    return days >= threshold
  }
}

/**
 * Get available secondary actions for a stage
 * Filters actions based on their conditional requirements
 */
export function getAvailableSecondaryActions(stage, context) {
  // Special case: closed opportunities with task widgets
  if (OpportunityConditions['is-closed-with-task-widget'](context)) {
    return [
      CLOSED_OPPORTUNITY_ACTIONS.reopen,
      CLOSED_OPPORTUNITY_ACTIONS.requalify,
      CLOSED_OPPORTUNITY_ACTIONS.closeLost
    ]
  }
  
  const stageConfig = OPPORTUNITY_STATE_CONFIG[stage]
  if (!stageConfig || !stageConfig.secondaryActions) {
    return []
  }
  
  return stageConfig.secondaryActions.filter(action => {
    // If no conditional, always include
    if (!action.conditional) return true
    
    // Evaluate the condition
    const conditionFn = OpportunityConditions[action.conditional]
    return conditionFn ? conditionFn(context) : true
  })
}

/**
 * Get the active task widget for current stage and context
 * Returns the first widget whose condition is met, or null
 */
export function getActiveTaskWidget(stage, context) {
  const stageConfig = OPPORTUNITY_STATE_CONFIG[stage]
  if (!stageConfig || !stageConfig.taskWidgets) {
    return null
  }
  
  // Check if opportunity is closed and auto-close is enabled
  const settingsStore = useSettingsStore()
  const autoCloseEnabled = settingsStore.getSetting('autoCloseWidgetsOnClose')
  const isClosed = OpportunityConditions['is-closed']({ stage })
  
  // Check each widget's condition in order
  for (const widget of stageConfig.taskWidgets) {
    // Auto-close NFU/OFB widgets when opportunity is closed (if enabled)
    if (autoCloseEnabled && isClosed && (widget.type === 'NFU' || widget.type === 'OFB')) {
      continue // Skip this widget
    }
    
    const conditionFn = OpportunityConditions[widget.condition]
    if (conditionFn && conditionFn(context)) {
      return widget.type
    }
  }
  
  return null
}

/**
 * Get primary action configuration for a stage
 * Returns the action config with dynamic values evaluated
 */
export function getPrimaryAction(stage, context) {
  const stageConfig = OPPORTUNITY_STATE_CONFIG[stage]
  if (!stageConfig || !stageConfig.primaryAction) {
    return null
  }
  
  let action = stageConfig.primaryAction
  
  // Handle case where primaryAction is a function (e.g., Closed Won stage)
  if (typeof action === 'function') {
    action = action(context)
    if (!action) {
      return null
    }
  }
  
  // Evaluate dynamic properties (functions)
  return {
    ...action,
    title: typeof action.title === 'function' ? action.title(context) : action.title,
    description: typeof action.description === 'function' ? action.description(context) : action.description,
    label: typeof action.label === 'function' ? action.label(context) : action.label
  }
}

/**
 * Get task widget title based on widget type
 */
export function getTaskWidgetTitle(widgetType) {
  const titles = {
    'OOFB': 'Overdue Offer Follow-up Task',
    'UFB': 'Urgent Follow-up Task',
    'NFU': 'No Future Updates Task',
    'OFB': 'Offer Follow-up Task',
    'CFB': 'Contract Follow-up Task',
    'DFB': 'Delivery Follow-up Task',
    'NS': 'No-Show Follow-up Task',
    'ABANDONED': 'Abandoned Opportunity Task'
  }
  
  return titles[widgetType] || 'Task'
}

/**
 * Check if opportunity is in a closed state
 */
export function isOpportunityClosed(stage) {
  return stage === 'Closed Won' || stage === 'Closed Lost'
}

// Export helper for external use
export { calculateDaysSince }

