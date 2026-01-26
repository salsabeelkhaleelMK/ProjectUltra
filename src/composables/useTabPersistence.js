import { ref, watch } from 'vue'

/**
 * Composable for persisting tab selection in localStorage
 * 
 * @param {string} storageKey - Key to use in localStorage
 * @param {string} defaultTab - Default tab value if none stored
 * @returns {Object} Object containing activeTab ref and persistence logic
 */
export function useTabPersistence(storageKey, defaultTab = 'manual') {
  // Initialize from localStorage or use default
  const getStoredTab = () => {
    try {
      const stored = localStorage.getItem(storageKey)
      return stored || defaultTab
    } catch (error) {
      console.error('Failed to read tab from localStorage:', error)
      return defaultTab
    }
  }

  const activeTab = ref(getStoredTab())

  // Persist to localStorage on change
  watch(activeTab, (newTab) => {
    try {
      localStorage.setItem(storageKey, newTab)
    } catch (error) {
      console.error('Failed to save tab to localStorage:', error)
    }
  })

  return {
    activeTab
  }
}
