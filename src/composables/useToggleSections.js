/**
 * Composable for managing toggle state of multiple sections
 * 
 * Provides functionality to manage mutually exclusive section visibility
 * with automatic closing of other sections when one is opened.
 */
import { ref, reactive } from 'vue'

/**
 * Create toggle state management for multiple sections
 * @param {Array<string>} sectionNames - Array of section names to manage
 * @param {Object} options - Configuration options
 * @param {boolean} options.mutuallyExclusive - If true, opening one section closes others (default: true)
 * @returns {Object} Object containing state and toggle function
 */
export function useToggleSections(sectionNames, options = {}) {
  const { mutuallyExclusive = true } = options
  
  // Create reactive state for all sections
  const state = reactive({})
  sectionNames.forEach(name => {
    state[name] = ref(false)
  })
  
  /**
   * Toggle a section on/off
   * @param {string} sectionName - Name of the section to toggle
   * @param {boolean|null} value - Optional explicit value (true/false), or null to toggle
   */
  function toggle(sectionName, value = null) {
    if (!sectionNames.includes(sectionName)) {
      console.warn(`Section "${sectionName}" not found in section list`)
      return
    }
    
    // Determine new value
    const newValue = value !== null ? value : !state[sectionName].value
    
    // If mutually exclusive and opening a section, close others
    if (mutuallyExclusive && newValue) {
      sectionNames.forEach(name => {
        if (name !== sectionName) {
          state[name].value = false
        }
      })
    }
    
    state[sectionName].value = newValue
  }
  
  /**
   * Close all sections
   */
  function closeAll() {
    sectionNames.forEach(name => {
      state[name].value = false
    })
  }
  
  /**
   * Open a specific section and close all others
   * @param {string} sectionName - Name of the section to open
   */
  function openOnly(sectionName) {
    closeAll()
    toggle(sectionName, true)
  }
  
  return {
    state,
    toggle,
    closeAll,
    openOnly
  }
}
