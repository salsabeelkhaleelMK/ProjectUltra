/**
 * State Machine Service
 * 
 * Abstraction layer for state machine transitions.
 * 
 * Current implementation: Uses frontend mock (frontendStateMachine.js)
 * Future implementation: Will call backend API (POST /leads/{id}/transition or PATCH /leads/{id})
 * 
 * This service separates:
 * - Backend rules (transitions/validations) - in this service
 * - Frontend UI rules (widget rendering) - in composables (useLeadStateMachine.js, etc.)
 */

import { getLeadTransitionHandler, validateLeadTransition } from './frontendStateMachine.js'
import * as leadsApi from '@/api/leads'
import * as opportunitiesApi from '@/api/opportunities'

/**
 * State Machine Service
 * 
 * Handles state transitions for leads and opportunities.
 * This is an abstraction layer that will eventually call the backend API.
 */
export class StateMachineService {
  /**
   * Transition a lead to a new stage
   * 
   * @param {number|string} leadId - Lead ID
   * @param {string} fromStage - Current stage
   * @param {string} toStage - Target stage
   * @param {Object} data - Additional data for the transition
   * @returns {Promise<Object>} Updated lead
   */
  async transitionLead(leadId, fromStage, toStage, data = {}) {
    // Validate transition
    const lead = await leadsApi.fetchLeadById(leadId)
    const validation = validateLeadTransition(lead, fromStage, toStage)
    
    if (!validation.allowed) {
      throw new Error(validation.reason || 'Transition not allowed')
    }
    
    // Get transition handler (mock implementation)
    const handler = getLeadTransitionHandler(fromStage, toStage)
    
    if (handler) {
      const { updates, activities } = handler(lead, toStage, data)
      
      // Apply updates
      const updatedLead = await leadsApi.updateLead(leadId, updates)
      
      // Log activities
      for (const activity of activities) {
        await leadsApi.addLeadActivity(leadId, activity)
      }
      
      return updatedLead
    } else {
      // Fallback to direct update if no handler found
      // This should rarely happen, but provides a safety net
      throw new Error(`No transition handler found for ${fromStage} -> ${toStage}`)
    }
  }
  
  /**
   * Validate if a lead transition is allowed
   * 
   * @param {number|string} leadId - Lead ID
   * @param {string} fromStage - Current stage
   * @param {string} toStage - Target stage
   * @returns {Promise<Object>} { allowed: boolean, reason?: string }
   */
  async validateLeadTransition(leadId, fromStage, toStage) {
    const lead = await leadsApi.fetchLeadById(leadId)
    return validateLeadTransition(lead, fromStage, toStage)
  }
  
  /**
   * Transition an opportunity to a new stage
   * 
   * TODO: Implement opportunity transitions
   * 
   * @param {number|string} opportunityId - Opportunity ID
   * @param {string} fromStage - Current stage
   * @param {string} toStage - Target stage
   * @param {Object} data - Additional data for the transition
   * @returns {Promise<Object>} Updated opportunity
   */
  async transitionOpportunity(opportunityId, fromStage, toStage, data = {}) {
    // TODO: Implement opportunity transitions
    throw new Error('Opportunity transitions not yet implemented')
  }
}

// Export singleton instance
export const stateMachineService = new StateMachineService()


