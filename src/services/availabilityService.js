/**
 * Availability Service
 * Manages appointment availability for users and teams
 * Currently uses mock data - will be replaced with API calls in the future
 */

/**
 * Generate mock availability for a given date range
 * @param {string} assigneeId - Format: "user-{id}" or "team-{id}"
 * @param {string} date - ISO date string (YYYY-MM-DD)
 * @returns {Array<string>} Array of available time slots
 */
export const getAvailabilityForAssignee = (assigneeId, date) => {
  if (!assigneeId || !date) return []
  
  const dayOfWeek = new Date(date).getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
  
  // No availability on weekends
  if (isWeekend) return []
  
  // Parse assignee type and id
  const [type, id] = assigneeId.split('-')
  const numericId = parseInt(id)
  
  // Mock availability patterns based on assignee
  if (type === 'team') {
    return getTeamAvailability(numericId, date)
  } else if (type === 'user') {
    return getUserAvailability(numericId, date, dayOfWeek)
  }
  
  return []
}

/**
 * Get availability for a specific user
 */
const getUserAvailability = (userId, date, dayOfWeek) => {
  // Different users have different availability patterns
  const patterns = {
    1: { // User 1 - Morning person
      1: ['09:00', '09:30', '10:00', '10:30', '11:00'], // Monday
      2: ['09:00', '10:00', '11:00', '14:00', '15:00'], // Tuesday
      3: ['09:00', '09:30', '10:30', '11:00'], // Wednesday
      4: ['09:00', '10:00', '11:00', '14:00', '16:00'], // Thursday
      5: ['09:00', '10:00', '11:00'] // Friday
    },
    2: { // User 2 - Afternoon person
      1: ['14:00', '14:30', '15:00', '15:30', '16:00'],
      2: ['13:00', '14:00', '15:00', '16:00', '17:00'],
      3: ['14:00', '15:00', '16:00', '17:00'],
      4: ['13:00', '14:30', '15:00', '16:00'],
      5: ['14:00', '15:00', '16:00']
    },
    3: { // User 3 - Balanced
      1: ['09:00', '10:30', '14:00', '15:30'],
      2: ['09:30', '11:00', '14:00', '16:00'],
      3: ['10:00', '11:30', '14:30', '16:00'],
      4: ['09:00', '11:00', '14:00', '15:00'],
      5: ['10:00', '11:00', '14:00', '15:00']
    },
    4: { // User 4 - Full day
      1: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
      2: ['09:00', '10:30', '11:30', '14:00', '15:00', '16:30'],
      3: ['09:30', '10:00', '11:00', '14:00', '15:30', '16:00'],
      4: ['09:00', '10:00', '11:30', '13:30', '15:00', '16:00'],
      5: ['09:00', '10:00', '11:00', '14:00', '15:00']
    }
  }
  
  // Get pattern for this user, or use default
  const userPattern = patterns[userId] || patterns[1]
  
  // Return slots for this day of week
  return userPattern[dayOfWeek] || []
}

/**
 * Get combined availability for a team
 */
const getTeamAvailability = (teamId, date) => {
  // For teams, we show combined availability from all team members
  const dayOfWeek = new Date(date).getDay()
  
  // Mock: Teams have broader availability as they pool resources
  const allSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
  ]
  
  // Different teams might have different availability
  if (teamId === 1) {
    // Team 1: Audi Sales - very busy, limited slots
    return dayOfWeek === 1 || dayOfWeek === 4 
      ? ['09:00', '11:00', '14:00', '16:00']
      : ['10:00', '14:00', '15:00']
  } else if (teamId === 2) {
    // Team 2: More availability
    return allSlots.filter((_, index) => index % 2 === 0) // Every other slot
  }
  
  // Default team availability
  return allSlots
}

/**
 * Get availability for multiple assignees on a date
 * Useful for "show me who's available" feature
 * @param {Array<string>} assigneeIds - Array of assignee IDs
 * @param {string} date - ISO date string
 * @returns {Object} Map of assigneeId to available slots
 */
export const getMultipleAvailability = (assigneeIds, date) => {
  const result = {}
  
  assigneeIds.forEach(assigneeId => {
    result[assigneeId] = getAvailabilityForAssignee(assigneeId, date)
  })
  
  return result
}

/**
 * Get availability status for an assignee on a date
 * @param {string} assigneeId
 * @param {string} date
 * @returns {string} 'none' | 'limited' | 'good'
 */
export const getAvailabilityStatus = (assigneeId, date) => {
  const slots = getAvailabilityForAssignee(assigneeId, date)
  
  if (slots.length === 0) return 'none'
  if (slots.length <= 3) return 'limited'
  return 'good'
}

/**
 * Find alternative assignees with availability on a date
 * @param {string} currentAssigneeId - The currently selected assignee
 * @param {string} date - ISO date string
 * @param {Array} allAssignees - Array of all possible assignees
 * @returns {Array} Assignees with availability, sorted by slot count
 */
export const findAlternativeAssignees = (currentAssigneeId, date, allAssignees) => {
  const alternatives = []
  
  allAssignees.forEach(assignee => {
    const assigneeId = `${assignee.type}-${assignee.id}`
    
    // Skip current assignee
    if (assigneeId === currentAssigneeId) return
    
    const slots = getAvailabilityForAssignee(assigneeId, date)
    
    if (slots.length > 0) {
      alternatives.push({
        ...assignee,
        assigneeId,
        availableSlots: slots,
        slotCount: slots.length
      })
    }
  })
  
  // Sort by slot count (most availability first)
  return alternatives.sort((a, b) => b.slotCount - a.slotCount)
}
