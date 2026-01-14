/**
 * Lead Business Rules Engine
 * 
 * Pure functions for evaluating conditions and determining which actions/widgets to show.
 * All functions are testable and have no side effects.
 */

import { LEAD_STATE_CONFIG } from '@/composables/useLeadStateMachine'
import { LEAD_STAGES, getDisplayStage } from '@/utils/stageMapper'

/**
 * Get primary action for a lead
 * @param {Object} context - Context object with lead data
 * @returns {Object|null} Primary action config
 */
export function getLeadPrimaryAction(context) {
  const lead = context.lead
  if (!lead) return null
  
  // Calculate display stage from source data
  const displayStage = getDisplayStage(lead, 'lead')
  
  // If no displayStage calculated, fallback to NEW
  if (!displayStage) {
    return LEAD_STATE_CONFIG[LEAD_STAGES.NEW]?.primaryAction || null
  }
  
  const config = LEAD_STATE_CONFIG[displayStage]
  
  // If config not found, fallback to NEW stage config
  if (!config) {
    return LEAD_STATE_CONFIG[LEAD_STAGES.NEW]?.primaryAction || null
  }
  
  if (!config.primaryAction) {
    return LEAD_STATE_CONFIG[LEAD_STAGES.NEW]?.primaryAction || null
  }
  
  const action = config.primaryAction
  if (typeof action === 'function') {
    return action({ lead, displayStage })
  }
  return action
}

/**
 * Get available secondary actions for a lead
 * @param {Object} context - Context object with lead data
 * @returns {Array} Array of secondary action configs
 */
export function getAvailableLeadSecondaryActions(context) {
  const lead = context.lead
  if (!lead) return []
  
  const displayStage = getDisplayStage(lead, 'lead')
  const config = LEAD_STATE_CONFIG[displayStage]
  
  if (!config) return []
  
  return config.secondaryActions || []
}

/**
 * Check if lead is in a closed state
 * @param {Object} context - Context object with lead data
 * @returns {boolean}
 */
export function isLeadClosed(context) {
  const lead = context.lead
  if (!lead) return false
  
  // CRITICAL: Only return true if lead is explicitly disqualified
  // Normalize to boolean: only true is true, everything else is false
  const isDisqualified = Boolean(lead.isDisqualified === true)
  
  // If not disqualified, definitely not closed
  if (!isDisqualified) {
    return false
  }
  
  // Lead IS disqualified - verify stage is actually closed
  const displayStage = getDisplayStage(lead, 'lead')
  
  const isClosed = displayStage === LEAD_STAGES.CLOSED_INVALID || 
                   displayStage === LEAD_STAGES.CLOSED_NOT_INTERESTED || 
                   displayStage === LEAD_STAGES.CLOSED_DUPLICATE
  
  return isClosed
}

/**
 * Check if LQ widget should be shown
 * @param {Object} context - Context object with lead data
 * @returns {boolean}
 */
export function shouldShowLQWidget(context) {
  const lead = context.lead
  if (!lead) return false
  
  // Never show for closed leads
  if (isLeadClosed(context)) return false
  
  const displayStage = getDisplayStage(lead, 'lead')
  const config = LEAD_STATE_CONFIG[displayStage]
  
  if (!config) return false
  
  if (typeof config.showLQWidget === 'function') {
    return config.showLQWidget(lead)
  }
  
  return config.showLQWidget ?? false
}

/**
 * Check if deadline banner should be shown
 * @param {Object} context - Context object with lead data
 * @returns {boolean}
 */
export function shouldShowDeadlineBanner(context) {
  const lead = context.lead
  if (!lead) return false
  
  // Never show for closed leads
  if (isLeadClosed(context)) return false
  
  const displayStage = getDisplayStage(lead, 'lead')
  const config = LEAD_STATE_CONFIG[displayStage]
  
  if (!config) return false
  
  return config.showDeadlineBanner && lead.nextActionDue
}

/**
 * Check if lead can be postponed
 * @param {Object} context - Context object with lead data
 * @returns {boolean}
 */
export function canPostponeLead(context) {
  const lead = context.lead
  if (!lead) return false
  
  const displayStage = getDisplayStage(lead, 'lead')
  const config = LEAD_STATE_CONFIG[displayStage]
  
  if (!config) return false
  
  return config.canPostpone ?? false
}

/**
 * Get LQ widget mode
 * @param {Object} context - Context object with lead data
 * @returns {string}
 */
export function getLQWidgetMode(context) {
  const lead = context.lead
  if (!lead) return 'qualification'
  
  const displayStage = getDisplayStage(lead, 'lead')
  const config = LEAD_STATE_CONFIG[displayStage]
  
  if (!config) return 'qualification'
  
  return config.lqWidgetMode || 'qualification'
}

