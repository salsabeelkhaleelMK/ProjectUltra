import { getDisplayStage, getDeliverySubstatus } from '@/utils/stageMapper'
import { LEAD_STATE_CONFIG } from '@/composables/useLeadStateMachine'
import { OPPORTUNITY_STATE_CONFIG } from '@/composables/useOpportunityStateMachine'

/**
 * Get the descriptive action title for a task card based on the next primary action
 * @param {Object} item - Lead or Opportunity item
 * @returns {string} Action title text
 */
export function getTaskActionTitle(item) {
  if (!item) return 'Action Required'
  
  // If item explicitly has a title (like a specific Task entity), use it
  if (item.title) return item.title

  const type = item.type || (item.customer ? 'opportunity' : 'lead')
  const displayStage = getDisplayStage(item, type)

  if (type === 'lead') {
    const config = LEAD_STATE_CONFIG[displayStage] || LEAD_STATE_CONFIG['New']
    const primaryAction = config.primaryAction
    
    if (primaryAction) {
      const action = typeof primaryAction === 'function' 
        ? primaryAction({ lead: item, displayStage }) 
        : primaryAction
      
      // Prefer label for short card titles, fallback to title
      return action.label || action.title || 'Follow up'
    }
  }

  if (type === 'opportunity') {
    const config = OPPORTUNITY_STATE_CONFIG[displayStage] || OPPORTUNITY_STATE_CONFIG['Qualified']
    const primaryAction = config.primaryAction
    
    if (primaryAction) {
      // Opportunity state machine functions expect a context object
      const action = typeof primaryAction === 'function'
        ? primaryAction({ 
            deliverySubstatus: item.deliverySubstatus || getDeliverySubstatus(item, item.activities || []),
            hasOffers: !!(item.offers && item.offers.length > 0) || !!(item.activities && item.activities.some(a => a.type === 'offer')),
            scheduledAppointment: item.scheduledAppointment,
            // Minimal context for title generation
            formatDateTime: (date) => new Date(date).toLocaleDateString()
          })
        : primaryAction
      
      return action.label || action.title || 'Update Opportunity'
    }
  }

  return 'Action Required'
}
