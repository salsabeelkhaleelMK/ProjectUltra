/**
 * Composable for managing Close as Lost form state
 * 
 * Provides reactive state and reset functionality for Close as Lost forms
 * across multiple components.
 */
import { ref } from 'vue'

/**
 * Composable for Close as Lost functionality
 * @param {string} initialReason - Initial reason value
 * @param {string} initialNotes - Initial notes value
 * @returns {Object} Object containing reason, notes, cardRef, and reset function
 */
export function useCloseAsLost(initialReason = '', initialNotes = '') {
  const reason = ref(initialReason)
  const notes = ref(initialNotes)
  const cardRef = ref(null)
  
  /**
   * Reset the form state
   */
  function reset() {
    reason.value = ''
    notes.value = ''
    cardRef.value?.reset()
  }
  
  return {
    reason,
    notes,
    cardRef,
    reset
  }
}
