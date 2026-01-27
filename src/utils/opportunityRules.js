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
    
    // Check if OOFB was postponed
    const postponedDate = context.opportunity.postponedTasks?.oofb
    if (postponedDate) {
      const daysSincePostpone = calculateDaysSince(postponedDate)
      const postponePeriod = settingsStore.getSetting('postponeTaskDays') || 7
      // Don't show task if still within postpone period
      if (daysSincePostpone < postponePeriod) return false
      // If postpone period has passed, recalculate from postpone date
      const daysFromPostpone = calculateDaysSince(postponedDate)
      return daysFromPostpone >= minDays && daysFromPostpone < maxDays + 1 && !context.hasOffers
    }
    
    // Normal condition check
    const days = calculateDaysSince(context.opportunity.createdAt)
    return days >= minDays && days < maxDays + 1 && !context.hasOffers
  },
  
  'qualified-no-offers-14-plus-days': (context) => {
    const settingsStore = useSettingsStore()
    const threshold = settingsStore.getSetting('ufbDays')
    
    // Check if UFB was postponed
    const postponedDate = context.opportunity.postponedTasks?.ufb
    if (postponedDate) {
      const daysSincePostpone = calculateDaysSince(postponedDate)
      const postponePeriod = settingsStore.getSetting('postponeTaskDays') || 7
      // Don't show task if still within postpone period
      if (daysSincePostpone < postponePeriod) return false
      // If postpone period has passed, recalculate from postpone date
      const daysFromPostpone = calculateDaysSince(postponedDate)
      return daysFromPostpone >= threshold && !context.hasOffers
    }
    
    // Normal condition check
    const days = calculateDaysSince(context.opportunity.createdAt)
    return days >= threshold && !context.hasOffers
  },

  // Negotiation substatus conditions
  'negotiation-offer-sent-substatus': (context) => {
    return context.opportunity?.negotiationSubstatus === 'Offer Sent'
  },
  
  'negotiation-offer-feedback-substatus': (context) => {
    return context.opportunity?.negotiationSubstatus === 'Offer Feedback'
  },
  
  'negotiation-offer-accepted-substatus': (context) => {
    return context.opportunity?.negotiationSubstatus === 'Offer Accepted'
  },
  
  'negotiation-awaiting-response-substatus': (context) => {
    return context.opportunity?.negotiationSubstatus === 'Offer Under Review' || 
           context.opportunity?.negotiationSubstatus === 'Awaiting Response' // backward compatibility
  },
  
  'negotiation-offer-under-review-substatus': (context) => {
    return context.opportunity?.negotiationSubstatus === 'Offer Under Review' || 
           context.opportunity?.negotiationSubstatus === 'Awaiting Response' // backward compatibility
  },
  
  'negotiation-offer-sent-3-days': (context) => {
    // Check if we need to auto-transition from Offer Sent to Offer Feedback
    if (context.opportunity?.negotiationSubstatus !== 'Offer Sent') return false
    if (!context.opportunity?.offers || context.opportunity.offers.length === 0) return false
    
    // Find most recent offer
    const mostRecentOffer = context.opportunity.offers
      .filter(o => o.status === 'active')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
    
    if (!mostRecentOffer) return false
    
    const days = calculateDaysSince(mostRecentOffer.createdAt)
    return days >= 3
  },

  // Negotiation stage conditions
  'negotiation-5-plus-days-no-contract-has-offers': (context) => {
    // OFB only triggers from "Offer Under Review" status (not from Offer Sent or Offer Accepted)
    const substatus = context.opportunity?.negotiationSubstatus
    if (substatus !== 'Offer Under Review' && substatus !== 'Awaiting Response') {
      return false
    }
    
    // For 'In Negotiation' stage, only show if offers exist
    if (context.stage === 'In Negotiation' && !context.hasOffers) {
      return false
    }
    
    const settingsStore = useSettingsStore()
    const threshold = settingsStore.getSetting('ofbDays')
    
    // Check if OFB was postponed
    const postponedDate = context.opportunity.postponedTasks?.ofb
    if (postponedDate) {
      const daysSincePostpone = calculateDaysSince(postponedDate)
      const postponePeriod = settingsStore.getSetting('postponeTaskDays') || 7
      // Don't show task if still within postpone period
      if (daysSincePostpone < postponePeriod) return false
      // If postpone period has passed, recalculate from postpone date
      const daysFromPostpone = calculateDaysSince(postponedDate)
      return daysFromPostpone >= threshold && !context.opportunity.contractDate && context.hasOffers
    }
    
    // Normal condition check
    const days = calculateDaysSince(context.opportunity.lastActivity || context.opportunity.createdAt)
    return days >= threshold && !context.opportunity.contractDate && context.hasOffers
  },
  
  'negotiation-offer-feedback-5-plus-days-no-appointment': (context) => {
    // NFU only appears in 'Offer Feedback' substatus
    if (context.opportunity?.negotiationSubstatus !== 'Offer Feedback') {
      return false
    }
    
    // Must have offers
    if (!context.hasOffers) {
      return false
    }
    
    const settingsStore = useSettingsStore()
    const threshold = settingsStore.getSetting('nfuDays')
    
    // Check if NFU was postponed
    const postponedDate = context.opportunity.postponedTasks?.nfu
    if (postponedDate) {
      const daysSincePostpone = calculateDaysSince(postponedDate)
      const postponePeriod = settingsStore.getSetting('postponeTaskDays') || 7
      // Don't show task if still within postpone period
      if (daysSincePostpone < postponePeriod) return false
      // If postpone period has passed, recalculate from postpone date
      const daysFromPostpone = calculateDaysSince(postponedDate)
      const hasFutureAppointment = context.scheduledAppointment && 
        new Date(context.scheduledAppointment.start) > new Date()
      return daysFromPostpone >= threshold && !context.opportunity.contractDate && !hasFutureAppointment
    }
    
    // Normal condition check
    const days = calculateDaysSince(context.opportunity.lastActivity || context.opportunity.createdAt)
    const hasFutureAppointment = context.scheduledAppointment && 
      new Date(context.scheduledAppointment.start) > new Date()
    
    return days >= threshold && !context.opportunity.contractDate && !hasFutureAppointment
  },
  
  // Legacy condition (kept for backwards compatibility)
  'negotiation-5-plus-days-no-contract-no-future-appointment-has-offers': (context) => {
    // Redirect to new condition
    return OpportunityConditions['negotiation-offer-feedback-5-plus-days-no-appointment'](context)
  },

  // Contract/Delivery conditions
  'contract-7-plus-days-no-delivery': (context) => {
    if (!context.opportunity.contractDate) return false
    
    const settingsStore = useSettingsStore()
    const threshold = settingsStore.getSetting('cfbDays')
    
    // Check if CFB was postponed
    const postponedDate = context.opportunity.postponedTasks?.cfb
    if (postponedDate) {
      const daysSincePostpone = calculateDaysSince(postponedDate)
      const postponePeriod = settingsStore.getSetting('postponeTaskDays') || 7
      // Don't show task if still within postpone period
      if (daysSincePostpone < postponePeriod) return false
      // If postpone period has passed, recalculate from postpone date
      const daysFromPostpone = calculateDaysSince(postponedDate)
      const hasDelivery = context.activities?.some(a => 
        a.type === 'delivery' || a.action?.toLowerCase().includes('delivered')
      )
      return daysFromPostpone >= threshold && !hasDelivery
    }
    
    // Normal condition check
    const days = calculateDaysSince(context.opportunity.contractDate)
    const hasDelivery = context.activities?.some(a => 
      a.type === 'delivery' || a.action?.toLowerCase().includes('delivered')
    )
    
    return days >= threshold && !hasDelivery
  },
  
  'delivery-feedback-required': (context) => {
    // Must be delivered
    if (context.deliverySubstatus !== 'Delivered') return false
    
    // Check actual delivery date (not scheduled deliveryDate)
    const actualDeliveryDate = context.opportunity.actualDeliveryDate || 
      context.activities?.find(a => a.data?.actualDeliveryDate)?.data?.actualDeliveryDate
    
    if (!actualDeliveryDate) return false
    
    const settingsStore = useSettingsStore()
    const threshold = settingsStore.getSetting('dfbDays') || 3
    
    // Check if DFB was postponed
    const postponedDate = context.opportunity.postponedTasks?.dfb
    if (postponedDate) {
      const daysSincePostpone = calculateDaysSince(postponedDate)
      const postponePeriod = settingsStore.getSetting('postponeTaskDays') || 7
      // Don't show task if still within postpone period
      if (daysSincePostpone < postponePeriod) return false
      // If postpone period has passed, recalculate from postpone date
      const daysFromPostpone = calculateDaysSince(postponedDate)
      return daysFromPostpone >= threshold
    }
    
    // Normal condition check
    const days = calculateDaysSince(actualDeliveryDate)
    
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
  
  // Skip task widgets if opportunity was just reopened from Closed Won
  if (context.opportunity.skipTaskReTrigger) {
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
    'DFB': 'Post-Delivery Customer Satisfaction Survey',
    'NS': 'NS',
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

/**
 * Validation functions for opportunity operations
 */
export const OpportunityValidations = {
  /**
   * Check if offer can be marked as accepted
   * @param {Object} opportunity - Opportunity object
   * @returns {Object} { valid: boolean, error: string|null }
   */
  canMarkOfferAccepted: (opportunity) => {
    if (!opportunity) {
      return { valid: false, error: 'Opportunity not found' }
    }
    
    // Must have at least one offer
    if (!opportunity.offers || opportunity.offers.length === 0) {
      return { valid: false, error: 'Cannot mark offer as accepted: No offers exist for this opportunity.' }
    }
    
    // Must have at least one active offer
    const activeOffers = opportunity.offers.filter(o => o.status === 'active')
    if (activeOffers.length === 0) {
      return { valid: false, error: 'Cannot mark offer as accepted: No active offers found.' }
    }
    
    return { valid: true, error: null }
  },
  
  /**
   * Check if contract can be created
   * @param {Object} opportunity - Opportunity object
   * @param {boolean} isFastDeal - Whether this is a fast deal (contract from Offer Sent directly)
   * @returns {Object} { valid: boolean, error: string|null }
   */
  canCreateContract: (opportunity, isFastDeal = false) => {
    if (!opportunity) {
      return { valid: false, error: 'Opportunity not found' }
    }
    
    // Fast deal path: can create contract from Offer Sent status
    if (isFastDeal) {
      if (opportunity.negotiationSubstatus === 'Offer Sent' || opportunity.negotiationSubstatus === null) {
        return { valid: true, error: null }
      }
    }
    
    // Normal path: must be in "Offer Accepted" status
    if (opportunity.negotiationSubstatus !== 'Offer Accepted') {
      return { 
        valid: false, 
        error: 'Cannot create contract: Offer must be in "Offer Accepted" status. Please mark the offer as accepted first.' 
      }
    }
    
    return { valid: true, error: null }
  },
  
  /**
   * Check if OFB task should trigger (only from Offer Under Review)
   * @param {Object} opportunity - Opportunity object
   * @returns {boolean}
   */
  canTriggerOFB: (opportunity) => {
    if (!opportunity) return false
    
    const substatus = opportunity.negotiationSubstatus
    return substatus === 'Offer Under Review' || substatus === 'Awaiting Response'
  }
}

// Export helper for external use
export { calculateDaysSince }

