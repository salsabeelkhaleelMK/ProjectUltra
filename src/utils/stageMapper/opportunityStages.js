/**
 * Opportunity Stage Mapping Logic
 * 
 * Handles opportunity stage calculation, mapping, and transitions
 */

import { API_STATUSES, OPPORTUNITY_STAGES, DELIVERY_SUBSTATUS } from './constants.js'

// Helper functions
function calculateDaysSince(dateString) {
  if (!dateString) return 0
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

function getLastOffer(activities) {
  if (!activities || activities.length === 0) return null
  
  const offers = activities
    .filter(a => a.type === 'offer')
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  
  return offers[0] || null
}

function hasDelivery(opportunity, activities) {
  if (opportunity.deliveryDate) return true
  
  return activities.some(a => 
    a.type === 'delivery' || 
    a.action?.toLowerCase().includes('delivered')
  )
}

function hasContract(opportunity, activities) {
  if (opportunity.contractDate && opportunity.contractSigned) return true
  
  return activities.some(a => 
    a.type === 'contract' || 
    a.action?.toLowerCase().includes('contract signed')
  )
}

function hasScheduledAppointment(opportunity, activities) {
  if (opportunity.scheduledAppointment) return true
  
  return activities.some(a => 
    a.type === 'appointment' && 
    a.status === 'confirmed'
  )
}

/**
 * Calculate display stage for an opportunity
 */
export function calculateOpportunityDisplayStage(opportunity) {
  const apiStatus = opportunity.stage || opportunity.apiStatus
  const activities = opportunity.activities || []
  
  // Terminal stages pass through
  if (apiStatus === API_STATUSES.CLOSED_LOST) {
    return OPPORTUNITY_STAGES.CLOSED_LOST
  }
  
  // Closed Won - always return Closed Won (substatus calculated separately)
  if (apiStatus === API_STATUSES.CLOSED_WON || apiStatus === 'Closed' || apiStatus === API_STATUSES.REGISTRATION) {
    return OPPORTUNITY_STAGES.CLOSED_WON
  }
  
  // Check for abandoned status (before other stages)
  // Note: Abandoned is typically handled via task widget condition, but we check here if explicitly set
  if (apiStatus === 'Abandoned') {
    return OPPORTUNITY_STAGES.ABANDONED
  }
  
  // In Negotiation and substates
  if (apiStatus === API_STATUSES.IN_NEGOTIATION) {
    // Contract pending
    if (opportunity.contractDate && !hasContract(opportunity, activities)) {
      return OPPORTUNITY_STAGES.CONTRACT_PENDING
    }
    
    // Check if offer has been pending for 3+ days
    const lastOffer = getLastOffer(activities)
    if (lastOffer) {
      const daysSinceOffer = calculateDaysSince(lastOffer.timestamp)
      
      // Auto-transition to Needs Follow-up after 3 days
      if (daysSinceOffer >= 3) {
        return OPPORTUNITY_STAGES.NEEDS_FOLLOW_UP
      }
    }
    
    return OPPORTUNITY_STAGES.IN_NEGOTIATION
  }
  
  // Backward compatibility: old "Offer Sent" data
  if (apiStatus === 'Offer Sent') {
    const lastOffer = getLastOffer(activities)
    if (lastOffer) {
      const daysSinceOffer = calculateDaysSince(lastOffer.timestamp)
      if (daysSinceOffer >= 3) {
        return OPPORTUNITY_STAGES.NEEDS_FOLLOW_UP
      }
    }
    return OPPORTUNITY_STAGES.IN_NEGOTIATION
  }
  
  // Backward compatibility: old "Awaiting Response" data
  if (apiStatus === 'Awaiting Response') {
    return OPPORTUNITY_STAGES.NEEDS_FOLLOW_UP
  }
  
  // Qualified and early stages
  if (apiStatus === API_STATUSES.QUALIFIED || apiStatus === API_STATUSES.OPEN) {
    // Callback scheduled
    if (opportunity.callbackDate) {
      return OPPORTUNITY_STAGES.TO_BE_CALLED_BACK
    }
    
    // Appointment scheduled - but validate it exists
    const hasAppointment = opportunity.scheduledAppointment || hasScheduledAppointment(opportunity, activities)
    if (hasAppointment) {
      // Ensure appointment has valid data if it's an object
      if (opportunity.scheduledAppointment && (!opportunity.scheduledAppointment.start && !opportunity.scheduledAppointment.id)) {
        // Invalid appointment data, fall back to Qualified
        return OPPORTUNITY_STAGES.QUALIFIED
      }
      return OPPORTUNITY_STAGES.AWAITING_APPOINTMENT
    }
    
    return OPPORTUNITY_STAGES.QUALIFIED
  }
  
  // Fallback
  return apiStatus
}

/**
 * Calculate delivery substatus for Closed Won opportunities
 */
function calculateDeliverySubstatus(opportunity, activities) {
  // Check if vehicle has been delivered
  if (hasDelivery(opportunity, activities)) {
    return DELIVERY_SUBSTATUS.DELIVERED
  }
  
  // Check if delivery date is scheduled
  if (opportunity.deliveryDate) {
    return DELIVERY_SUBSTATUS.AWAITING_DELIVERY
  }
  
  // No delivery tracking yet
  return DELIVERY_SUBSTATUS.NONE
}

/**
 * Calculate delivery substatus for an opportunity (helper function)
 * Note: getDeliverySubstatus is exported from index.js to avoid circular dependencies
 */
export function calculateDeliverySubstatusForOpportunity(opportunity, activities) {
  return calculateDeliverySubstatus(opportunity, activities)
}

/**
 * Map opportunity display stage back to API status
 */
export function mapOpportunityStageToApiStatus(displayStage) {
  const mapping = {
    [OPPORTUNITY_STAGES.QUALIFIED]: API_STATUSES.QUALIFIED,
    [OPPORTUNITY_STAGES.AWAITING_APPOINTMENT]: API_STATUSES.QUALIFIED,
    [OPPORTUNITY_STAGES.TO_BE_CALLED_BACK]: API_STATUSES.QUALIFIED,
    [OPPORTUNITY_STAGES.IN_NEGOTIATION]: API_STATUSES.IN_NEGOTIATION,
    [OPPORTUNITY_STAGES.NEEDS_FOLLOW_UP]: API_STATUSES.IN_NEGOTIATION,
    [OPPORTUNITY_STAGES.CONTRACT_PENDING]: API_STATUSES.IN_NEGOTIATION,
    [OPPORTUNITY_STAGES.CLOSED_WON]: API_STATUSES.CLOSED_WON,
    [OPPORTUNITY_STAGES.CLOSED_LOST]: API_STATUSES.CLOSED_LOST,
    [OPPORTUNITY_STAGES.ABANDONED]: API_STATUSES.QUALIFIED // Abandoned maps back to Qualified for API
  }
  
  return mapping[displayStage] || API_STATUSES.QUALIFIED
}

/**
 * Get valid transitions for opportunities
 */
export function getOpportunityTransitions() {
  return {
    [OPPORTUNITY_STAGES.QUALIFIED]: [
      OPPORTUNITY_STAGES.AWAITING_APPOINTMENT,
      OPPORTUNITY_STAGES.TO_BE_CALLED_BACK,
      OPPORTUNITY_STAGES.IN_NEGOTIATION,
      OPPORTUNITY_STAGES.CLOSED_LOST,
      OPPORTUNITY_STAGES.ABANDONED
    ],
    [OPPORTUNITY_STAGES.AWAITING_APPOINTMENT]: [
      OPPORTUNITY_STAGES.IN_NEGOTIATION,
      OPPORTUNITY_STAGES.TO_BE_CALLED_BACK,
      OPPORTUNITY_STAGES.CLOSED_LOST,
      OPPORTUNITY_STAGES.ABANDONED
    ],
    [OPPORTUNITY_STAGES.TO_BE_CALLED_BACK]: [
      OPPORTUNITY_STAGES.AWAITING_APPOINTMENT,
      OPPORTUNITY_STAGES.IN_NEGOTIATION,
      OPPORTUNITY_STAGES.CLOSED_LOST,
      OPPORTUNITY_STAGES.ABANDONED
    ],
    [OPPORTUNITY_STAGES.IN_NEGOTIATION]: [
      OPPORTUNITY_STAGES.NEEDS_FOLLOW_UP,
      OPPORTUNITY_STAGES.CONTRACT_PENDING,
      OPPORTUNITY_STAGES.CLOSED_LOST,
      OPPORTUNITY_STAGES.ABANDONED
    ],
    [OPPORTUNITY_STAGES.NEEDS_FOLLOW_UP]: [
      OPPORTUNITY_STAGES.CONTRACT_PENDING,
      OPPORTUNITY_STAGES.IN_NEGOTIATION,
      OPPORTUNITY_STAGES.CLOSED_LOST,
      OPPORTUNITY_STAGES.ABANDONED
    ],
    [OPPORTUNITY_STAGES.CONTRACT_PENDING]: [
      OPPORTUNITY_STAGES.CLOSED_WON,
      OPPORTUNITY_STAGES.CLOSED_LOST
    ],
    [OPPORTUNITY_STAGES.CLOSED_WON]: [
      OPPORTUNITY_STAGES.QUALIFIED  // Reopen
    ],
    [OPPORTUNITY_STAGES.CLOSED_LOST]: [
      OPPORTUNITY_STAGES.QUALIFIED  // Reopen
    ],
    [OPPORTUNITY_STAGES.ABANDONED]: [
      OPPORTUNITY_STAGES.QUALIFIED,  // Reopen
      OPPORTUNITY_STAGES.CLOSED_LOST
    ]
  }
}

