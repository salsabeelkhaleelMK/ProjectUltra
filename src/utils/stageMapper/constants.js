/**
 * Stage Constants
 * 
 * Centralized stage definitions for leads and opportunities
 */

export const OPPORTUNITY_STAGES = {
  QUALIFIED: 'Qualified',
  AWAITING_APPOINTMENT: 'Awaiting Appointment',
  TO_BE_CALLED_BACK: 'To be Called Back',
  IN_NEGOTIATION: 'In Negotiation',
  NEEDS_FOLLOW_UP: 'Needs Follow-up',
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


