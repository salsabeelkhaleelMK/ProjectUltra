/**
 * Helper utilities for form initialization and management
 * 
 * Provides functions to initialize form fields with default values
 */

/**
 * Initialize a date field in a form with today's date if it's not already set
 * @param {Object} form - Form reactive object
 * @param {string} field - Field name to initialize
 * @param {string|null} defaultValue - Optional default value (defaults to today's date)
 * @returns {void}
 */
export function initDateField(form, field, defaultValue = null) {
  if (!form.value[field]) {
    const today = new Date()
    form.value[field] = defaultValue || today.toISOString().split('T')[0]
  }
}

/**
 * Get today's date as a string (YYYY-MM-DD format)
 * @returns {string} Today's date in ISO date format
 */
export function getTodayDateString() {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

/**
 * Initialize multiple date fields at once
 * @param {Object} form - Form reactive object
 * @param {Array<string>} fields - Array of field names to initialize
 * @param {string|null} defaultValue - Optional default value for all fields
 * @returns {void}
 */
export function initDateFields(form, fields, defaultValue = null) {
  fields.forEach(field => {
    initDateField(form, field, defaultValue)
  })
}
