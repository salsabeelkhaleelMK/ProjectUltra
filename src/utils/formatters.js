/**
 * Format a due date timestamp for display
 * @param {string} isoTimestamp - ISO timestamp string
 * @returns {string} Formatted string: "OVERDUE", "2h 30m", or "Dec 22"
 */
export function formatDueDate(isoTimestamp) {
  if (!isoTimestamp) return ''
  
  const dueDate = new Date(isoTimestamp)
  const now = new Date()
  
  // Check if overdue
  if (dueDate < now) {
    return 'OVERDUE'
  }
  
  // Check if it's today
  const isToday = dueDate.toDateString() === now.toDateString()
  
  if (isToday) {
    // Calculate remaining time
    const remaining = dueDate - now
    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }
  
  // Not today - return formatted date
  return dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/**
 * Format a date for display
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Formatted date like "Dec 19, 2025"
 */
export function formatDate(date) {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/**
 * Format time for display
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Formatted time like "02:30 PM"
 */
export function formatTime(date) {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Format currency value
 * @param {number} value - Number to format
 * @returns {string} Formatted with thousand separators
 */
export function formatCurrency(value) {
  return value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0'
}

