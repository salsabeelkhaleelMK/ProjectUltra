/**
 * Frontend State Machine Mock Implementation
 * 
 * This is a mock implementation of the state machine that runs on the frontend.
 * When the backend API is integrated, this will be replaced by API calls.
 * 
 * This file contains:
 * - Transition handlers (backend rules)
 * - Validation logic (backend rules)
 * 
 * UI rules (what widgets/actions to show) remain in composables.
 */

import { LEAD_STAGES } from '@/utils/stageMapper'

/**
 * Lead Transition Handlers
 * 
 * These handlers define what updates to make when transitioning between lead states.
 * This logic will eventually be handled by the backend API.
 */
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

/**
 * Get transition handler for a specific transition
 * 
 * @param {string} fromStage - Current stage
 * @param {string} toStage - Target stage
 * @returns {Function|null} Transition handler function or null
 */
export function getLeadTransitionHandler(fromStage, toStage) {
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

/**
 * Validate if a transition is allowed
 * 
 * @param {Object} lead - Lead object
 * @param {string} fromStage - Current stage
 * @param {string} toStage - Target stage
 * @returns {Object} { allowed: boolean, reason?: string }
 */
export function validateLeadTransition(lead, fromStage, toStage) {
  // Add validation logic here
  // This will eventually be handled by the backend
  
  return { allowed: true }
}

