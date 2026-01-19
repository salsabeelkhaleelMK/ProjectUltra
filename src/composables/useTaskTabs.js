/**
 * Composable for mapping activity types to task tabs
 * Used to determine which tab an activity should appear in
 */

/**
 * Map of activity types to their corresponding tab names
 */
const ACTIVITY_TYPE_TO_TAB_MAP = {
  // Note activities
  note: 'data',
  
  // Communication activities
  communication: 'communication',
  email: 'communication',
  call: 'communication',
  sms: 'communication',
  whatsapp: 'communication',
  
  // Attachment activities
  attachment: 'attachment',
  document: 'attachment',
  file: 'attachment',
  
  // Trade-in activities
  tradein: 'tradein',
  'trade-in': 'tradein',
  
  // Financing activities
  financing: 'financing',
  
  // Offer/Purchase activities
  offer: 'offers',
  purchase: 'offers',
  
  // Appointment activities
  appointment: 'appointments',
  
  // Survey activities
  survey: 'surveys',
  
  // Default: overview
  default: 'overview'
}

/**
 * Get the tab name for a given activity type
 * @param {string} activityType - The type of activity
 * @returns {string} The tab name where this activity should appear
 */
export function getTabForItemTypeDefault(activityType) {
  if (!activityType) return ACTIVITY_TYPE_TO_TAB_MAP.default
  
  const normalizedType = activityType.toLowerCase().trim()
  return ACTIVITY_TYPE_TO_TAB_MAP[normalizedType] || ACTIVITY_TYPE_TO_TAB_MAP.default
}

/**
 * Composable for managing task tabs
 * @returns {Object} Tab utilities
 */
export function useTaskTabs() {
  return {
    getTabForItemType: getTabForItemTypeDefault,
    ACTIVITY_TYPE_TO_TAB_MAP
  }
}
