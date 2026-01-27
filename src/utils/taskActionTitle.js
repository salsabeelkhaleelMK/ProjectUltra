import { getDisplayStage, getDeliverySubstatus } from '@/utils/stageMapper'
import { LEAD_STATE_CONFIG } from '@/composables/useLeadStateMachine'
import { OPPORTUNITY_STATE_CONFIG } from '@/composables/useOpportunityStateMachine'

/**
 * Get the descriptive action title for a task card based on the next primary action
 * @param {Object} item - Lead or Opportunity item
 * @returns {string} Action title text
 */
export function getTaskActionTitle(item) {
  if (!item) return null
  
  // If item explicitly has a title (like a specific Task entity), use it
  if (item.title) return item.title

  const type = item.type || (item.customer ? 'opportunity' : 'lead')
  const displayStage = getDisplayStage(item, type)

  if (type === 'lead') {
    // If there's a scheduled appointment with a title, use it for better context
    if (item.scheduledAppointment && item.scheduledAppointment.title) {
      return item.scheduledAppointment.title
    }
    
    const config = LEAD_STATE_CONFIG[displayStage]
    if (!config || !config.primaryAction) {
      return null
    }
    
    const primaryAction = config.primaryAction
    const context = { lead: item, displayStage }
    const action = typeof primaryAction === 'function' 
      ? primaryAction(context) 
      : primaryAction
    
    if (!action) return null
    
    // Handle function-based label or title
    const label = typeof action.label === 'function' ? action.label(context) : action.label
    const title = typeof action.title === 'function' ? action.title(context) : action.title
    
    // Return the specific action label or title (no fallbacks)
    return label || title || null
  }

  if (type === 'opportunity') {
    // If there's a scheduled appointment with a title, use it for better context
    if (item.scheduledAppointment && item.scheduledAppointment.title) {
      return item.scheduledAppointment.title
    }
    
    const config = OPPORTUNITY_STATE_CONFIG[displayStage]
    if (!config || !config.primaryAction) {
      return null
    }
    
    const primaryAction = config.primaryAction
    const context = { 
      deliverySubstatus: item.deliverySubstatus || getDeliverySubstatus(item, item.activities || []),
      hasOffers: !!(item.offers && item.offers.length > 0) || !!(item.activities && item.activities.some(a => a.type === 'offer')),
      scheduledAppointment: item.scheduledAppointment,
      opportunity: item,
      // Minimal context for title generation
      formatDateTime: (date) => new Date(date).toLocaleDateString()
    }
    const action = typeof primaryAction === 'function'
      ? primaryAction(context)
      : primaryAction
    
    if (!action) return null
    
    // Handle function-based label or title
    const label = typeof action.label === 'function' ? action.label(context) : action.label
    const title = typeof action.title === 'function' ? action.title(context) : action.title
    
    // Return the specific action label or title (no fallbacks)
    return label || title || null
  }

  return null
}
