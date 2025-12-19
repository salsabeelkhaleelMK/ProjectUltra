// Utility for managing dismissed action items in localStorage

const STORAGE_KEY = 'actionable-questions-dismissals'

/**
 * Get all dismissals from localStorage
 */
function getAllDismissals() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    return []
  }
}

/**
 * Save a dismissal to localStorage
 * @param {string} questionId - The question ID to dismiss
 * @param {number} userId - The user ID who dismissed it
 */
export function saveDismissal(questionId, userId) {
  const dismissals = getAllDismissals()
  
  // Check if already dismissed
  const exists = dismissals.some(
    d => d.questionId === questionId && d.userId === userId
  )
  
  if (!exists) {
    dismissals.push({
      id: `dismissed-${questionId}-user-${userId}`,
      questionId,
      userId,
      dismissedAt: new Date().toISOString()
    })
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dismissals))
  }
}

/**
 * Check if a question is dismissed for a user
 * @param {string} questionId - The question ID to check
 * @param {number} userId - The user ID
 * @returns {boolean}
 */
export function isDismissed(questionId, userId) {
  const dismissals = getAllDismissals()
  return dismissals.some(
    d => d.questionId === questionId && d.userId === userId
  )
}

/**
 * Clear a dismissal
 * @param {string} questionId - The question ID
 * @param {number} userId - The user ID
 */
export function clearDismissal(questionId, userId) {
  let dismissals = getAllDismissals()
  dismissals = dismissals.filter(
    d => !(d.questionId === questionId && d.userId === userId)
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dismissals))
}

/**
 * Get all dismissals for a specific user
 * @param {number} userId - The user ID
 * @returns {Array}
 */
export function getDismissals(userId) {
  const dismissals = getAllDismissals()
  return dismissals.filter(d => d.userId === userId)
}

/**
 * Clear all dismissals (useful for testing)
 */
export function clearAllDismissals() {
  localStorage.removeItem(STORAGE_KEY)
}

