/**
 * Stage Mapper Service
 * 
 * Maps between API statuses (backend) and display stages (frontend UX)
 * Maintains backward compatibility with legacy API while providing granular stage tracking
 */

import { useSettingsStore } from '@/stores/settings'

// ========================================
// STAGE DEFINITIONS
// ========================================

export const OPPORTUNITY_STAGES = {
  QUALIFIED: 'Qualified',
  AWAITING_APPOINTMENT: 'Awaiting Appointment',
  TO_BE_CALLED_BACK: 'To be Called Back',
  IN_NEGOTIATION: 'In Negotiation',
  OFFER_SENT: 'Offer Sent',
  AWAITING_RESPONSE: 'Awaiting Response',
  CONTRACT_PENDING: 'Contract Pending',
  CLOSED_WON: 'Closed Won',
  CLOSED_LOST: 'Closed Lost',
  ABANDONED: 'Abandoned'
}

// Delivery Substatus - used within Closed Won stage
export const DELIVERY_SUBSTATUS = {
  NONE: null,
  AWAITING_DELIVERY: 'Awaiting Delivery',
  DELIVERED: 'Delivered'
}

export const LEAD_STAGES = {
  NEW: 'New',
  TO_BE_CALLED_BACK: 'To be called back',
  VALID: 'Valid',
  CLOSED_INVALID: 'Closed - Invalid',
  CLOSED_NOT_INTERESTED: 'Closed - Not Interested',
  CLOSED_DUPLICATE: 'Closed - Duplicate'
}

export const API_STATUSES = {
  OPEN: 'Open',
  QUALIFIED: 'Qualified',
  IN_NEGOTIATION: 'In Negotiation',
  CLOSED_WON: 'Closed Won',
  CLOSED_LOST: 'Closed Lost',
  REGISTRATION: 'Registration',
  OPEN_LEAD: 'Open Lead',
  VALIDATED: 'Validated',
  CLOSED_FAILED: 'Closed Failed',
  NOT_VALID: 'Not Valid',
  NOT_INTERESTED: 'Not Interested'
}

// ========================================
// MAIN FUNCTIONS
// ========================================

/**
 * Calculate display stage from API status and metadata
 * @param {Object} entity - Lead or opportunity object
 * @param {string} type - 'lead' or 'opportunity'
 * @returns {string} Display stage
 */
export function getDisplayStage(entity, type = 'opportunity') {
  if (!entity) return null
  
  if (type === 'opportunity') {
    return calculateOpportunityDisplayStage(entity)
  } else if (type === 'lead') {
    return calculateLeadDisplayStage(entity)
  }
  
  return entity.stage || entity.apiStatus
}

/**
 * Map display stage back to API status
 * @param {string} displayStage 
 * @param {string} entityType 
 * @returns {string} API status
 */
export function getApiStatus(displayStage, entityType = 'opportunity') {
  if (entityType === 'opportunity') {
    return mapOpportunityStageToApiStatus(displayStage)
  } else if (entityType === 'lead') {
    return mapLeadStageToApiStatus(displayStage)
  }
  
  return displayStage
}

/**
 * Create update payload for backend
 * @param {Object} entity 
 * @param {string} newDisplayStage 
 * @param {Object} metadata - Additional metadata to update
 * @returns {Object} Update payload
 */
export function createUpdatePayload(entity, newDisplayStage, metadata = {}) {
  const entityType = entity.customer ? 'opportunity' : 'lead'
  const newApiStatus = getApiStatus(newDisplayStage, entityType)
  
  return {
    stage: newApiStatus,
    displayStage: newDisplayStage,
    ...metadata,
    updatedAt: new Date().toISOString()
  }
}

/**
 * Validate if transition is allowed
 * @param {string} currentStage 
 * @param {string} targetStage 
 * @param {string} entityType 
 * @returns {boolean}
 */
export function canTransitionTo(currentStage, targetStage, entityType = 'opportunity') {
  const validTransitions = entityType === 'opportunity' 
    ? getOpportunityTransitions()
    : getLeadTransitions()
  
  return validTransitions[currentStage]?.includes(targetStage) ?? false
}

// ========================================
// OPPORTUNITY STAGE CALCULATION
// ========================================

function calculateOpportunityDisplayStage(opportunity) {
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
    
    // Offer states
    const lastOffer = getLastOffer(activities)
    if (lastOffer) {
      const settingsStore = useSettingsStore()
      const threshold = settingsStore.getSetting('offerSentToAwaitingResponseDays')
      const daysSinceOffer = calculateDaysSince(lastOffer.timestamp)
      
      if (daysSinceOffer >= threshold) {
        return OPPORTUNITY_STAGES.AWAITING_RESPONSE
      }
      return OPPORTUNITY_STAGES.OFFER_SENT
    }
    
    return OPPORTUNITY_STAGES.IN_NEGOTIATION
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

// Calculate delivery substatus for Closed Won opportunities
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

// Public function to get delivery substatus
export function getDeliverySubstatus(opportunity, activities = []) {
  // Only calculate substatus for Closed Won opportunities
  const displayStage = getDisplayStage(opportunity, 'opportunity')
  if (displayStage !== OPPORTUNITY_STAGES.CLOSED_WON) {
    return null
  }
  
  return calculateDeliverySubstatus(opportunity, activities)
}

function mapOpportunityStageToApiStatus(displayStage) {
  const mapping = {
    [OPPORTUNITY_STAGES.QUALIFIED]: API_STATUSES.QUALIFIED,
    [OPPORTUNITY_STAGES.AWAITING_APPOINTMENT]: API_STATUSES.QUALIFIED,
    [OPPORTUNITY_STAGES.TO_BE_CALLED_BACK]: API_STATUSES.QUALIFIED,
    [OPPORTUNITY_STAGES.IN_NEGOTIATION]: API_STATUSES.IN_NEGOTIATION,
    [OPPORTUNITY_STAGES.OFFER_SENT]: API_STATUSES.IN_NEGOTIATION,
    [OPPORTUNITY_STAGES.AWAITING_RESPONSE]: API_STATUSES.IN_NEGOTIATION,
    [OPPORTUNITY_STAGES.CONTRACT_PENDING]: API_STATUSES.IN_NEGOTIATION,
    [OPPORTUNITY_STAGES.CLOSED_WON]: API_STATUSES.CLOSED_WON,
    [OPPORTUNITY_STAGES.CLOSED_LOST]: API_STATUSES.CLOSED_LOST,
    [OPPORTUNITY_STAGES.ABANDONED]: API_STATUSES.QUALIFIED // Abandoned maps back to Qualified for API
  }
  
  return mapping[displayStage] || API_STATUSES.QUALIFIED
}

function getOpportunityTransitions() {
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
      OPPORTUNITY_STAGES.OFFER_SENT,
      OPPORTUNITY_STAGES.CONTRACT_PENDING,
      OPPORTUNITY_STAGES.CLOSED_LOST,
      OPPORTUNITY_STAGES.ABANDONED
    ],
    [OPPORTUNITY_STAGES.OFFER_SENT]: [
      OPPORTUNITY_STAGES.AWAITING_RESPONSE,
      OPPORTUNITY_STAGES.IN_NEGOTIATION,
      OPPORTUNITY_STAGES.CONTRACT_PENDING,
      OPPORTUNITY_STAGES.CLOSED_LOST,
      OPPORTUNITY_STAGES.ABANDONED
    ],
    [OPPORTUNITY_STAGES.AWAITING_RESPONSE]: [
      OPPORTUNITY_STAGES.CONTRACT_PENDING,
      OPPORTUNITY_STAGES.OFFER_SENT,
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

// ========================================
// LEAD STAGE CALCULATION
// ========================================

function calculateLeadDisplayStage(lead) {
  const apiStatus = lead.stage || lead.apiStatus
  
  // Closed states
  if (apiStatus === API_STATUSES.CLOSED_FAILED || apiStatus === API_STATUSES.NOT_VALID) {
    return LEAD_STAGES.CLOSED_INVALID
  }
  if (apiStatus === API_STATUSES.NOT_INTERESTED) {
    return LEAD_STAGES.CLOSED_NOT_INTERESTED
  }
  if (lead.isDuplicate) {
    return LEAD_STAGES.CLOSED_DUPLICATE
  }
  
  // Active states
  if (apiStatus === API_STATUSES.VALIDATED || apiStatus === 'Qualified') {
    return LEAD_STAGES.VALID
  }
  
  if (lead.callbackDate || lead.callbackScheduled) {
    return LEAD_STAGES.TO_BE_CALLED_BACK
  }
  
  // Default: New lead
  return LEAD_STAGES.NEW
}

function mapLeadStageToApiStatus(displayStage) {
  const mapping = {
    [LEAD_STAGES.NEW]: API_STATUSES.OPEN_LEAD,
    [LEAD_STAGES.TO_BE_CALLED_BACK]: API_STATUSES.OPEN_LEAD,
    [LEAD_STAGES.VALID]: API_STATUSES.VALIDATED,
    [LEAD_STAGES.CLOSED_INVALID]: API_STATUSES.NOT_VALID,
    [LEAD_STAGES.CLOSED_NOT_INTERESTED]: API_STATUSES.NOT_INTERESTED,
    [LEAD_STAGES.CLOSED_DUPLICATE]: API_STATUSES.CLOSED_FAILED,
    // Old stages for backward compatibility
    [LEAD_STAGES.NEW_LEAD]: API_STATUSES.OPEN_LEAD,
    [LEAD_STAGES.FIRST_CONTACT_ATTEMPTED]: API_STATUSES.OPEN_LEAD,
    [LEAD_STAGES.CALLBACK_SCHEDULED]: API_STATUSES.OPEN_LEAD,
    [LEAD_STAGES.MULTIPLE_ATTEMPTS]: API_STATUSES.OPEN_LEAD,
    [LEAD_STAGES.CONTACTED]: API_STATUSES.OPEN_LEAD,
    [LEAD_STAGES.INTERESTED]: API_STATUSES.OPEN_LEAD,
    [LEAD_STAGES.QUALIFIED]: API_STATUSES.VALIDATED,
    [LEAD_STAGES.NOT_RESPONDING]: API_STATUSES.OPEN_LEAD,
    [LEAD_STAGES.DISQUALIFIED]: API_STATUSES.CLOSED_FAILED,
    [LEAD_STAGES.CONVERTED]: API_STATUSES.CLOSED_WON
  }
  
  return mapping[displayStage] || API_STATUSES.OPEN_LEAD
}

function getLeadTransitions() {
  return {
    [LEAD_STAGES.NEW]: [
      LEAD_STAGES.TO_BE_CALLED_BACK,
      LEAD_STAGES.VALID,
      LEAD_STAGES.CLOSED_INVALID,
      LEAD_STAGES.CLOSED_NOT_INTERESTED,
      LEAD_STAGES.CLOSED_DUPLICATE
    ],
    [LEAD_STAGES.TO_BE_CALLED_BACK]: [
      LEAD_STAGES.VALID,
      LEAD_STAGES.CLOSED_INVALID,
      LEAD_STAGES.CLOSED_NOT_INTERESTED
    ],
    [LEAD_STAGES.VALID]: [
      LEAD_STAGES.CLOSED_NOT_INTERESTED
    ],
    [LEAD_STAGES.CLOSED_INVALID]: [
      LEAD_STAGES.NEW
    ],
    [LEAD_STAGES.CLOSED_NOT_INTERESTED]: [
      LEAD_STAGES.NEW
    ],
    [LEAD_STAGES.CLOSED_DUPLICATE]: []
  }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

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

function hasSuccessfulContact(lead) {
  const attempts = lead.contactAttempts || []
  
  return attempts.some(attempt => 
    attempt.outcome === 'interested' ||
    attempt.outcome === 'reached-interested' ||
    attempt.outcome === 'reached-qualified' ||
    attempt.outcome === 'callback-requested'
  )
}

// ========================================
// STAGE COLOR MAPPING
// ========================================

export function getStageColor(displayStage, entityType = 'opportunity') {
  const opportunityColors = {
    [OPPORTUNITY_STAGES.QUALIFIED]: 'bg-blue-50 text-blue-700 border-blue-200',
    [OPPORTUNITY_STAGES.AWAITING_APPOINTMENT]: 'bg-purple-50 text-purple-700 border-purple-200',
    [OPPORTUNITY_STAGES.TO_BE_CALLED_BACK]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    [OPPORTUNITY_STAGES.IN_NEGOTIATION]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    [OPPORTUNITY_STAGES.OFFER_SENT]: 'bg-orange-50 text-orange-700 border-orange-200',
    [OPPORTUNITY_STAGES.AWAITING_RESPONSE]: 'bg-pink-50 text-pink-700 border-pink-200',
    [OPPORTUNITY_STAGES.CONTRACT_PENDING]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    [OPPORTUNITY_STAGES.CLOSED_WON]: 'bg-green-100 text-green-800 border-green-300',
    [OPPORTUNITY_STAGES.CLOSED_LOST]: 'bg-red-50 text-red-700 border-red-200',
    [OPPORTUNITY_STAGES.ABANDONED]: 'bg-gray-50 text-gray-700 border-gray-200'
  }
  
  const leadColors = {
    [LEAD_STAGES.NEW]: 'bg-slate-100 text-slate-700 border-slate-200',
    [LEAD_STAGES.TO_BE_CALLED_BACK]: 'bg-purple-100 text-purple-700 border-purple-200',
    [LEAD_STAGES.VALID]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    [LEAD_STAGES.CLOSED_INVALID]: 'bg-gray-100 text-gray-600 border-gray-200',
    [LEAD_STAGES.CLOSED_NOT_INTERESTED]: 'bg-red-100 text-red-700 border-red-200',
    [LEAD_STAGES.CLOSED_DUPLICATE]: 'bg-orange-100 text-orange-700 border-orange-200'
  }
  
  const colors = entityType === 'opportunity' ? opportunityColors : leadColors
  return colors[displayStage] || 'bg-gray-50 text-gray-700 border-gray-200'
}

// Get color classes for delivery substatus badges
export function getDeliverySubstatusColor(substatus) {
  const substatusColors = {
    [DELIVERY_SUBSTATUS.AWAITING_DELIVERY]: 'bg-teal-50 text-teal-700 border-teal-200',
    [DELIVERY_SUBSTATUS.DELIVERED]: 'bg-green-50 text-green-700 border-green-200'
  }
  
  return substatusColors[substatus] || 'bg-gray-50 text-gray-700 border-gray-200'
}

export default {
  getDisplayStage,
  getApiStatus,
  createUpdatePayload,
  canTransitionTo,
  getStageColor,
  OPPORTUNITY_STAGES,
  LEAD_STAGES,
  API_STATUSES
}

