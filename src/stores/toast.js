import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Global toast store (MotorK Toast compatible).
 * Toast component expects items shaped like:
 * { type: 'success' | 'error' | 'warning' | 'info', description: string }
 */
export const useToastStore = defineStore('toast', () => {
  const notifications = ref([])
  const defaultDelayMs = ref(3000)

  /**
   * Push a toast and auto-remove it after delay.
   * @param {'success'|'error'|'warning'|'info'} type
   * @param {string} description
   * @param {number=} delayMs
   */
  function pushToast(type, description, delayMs) {
    const toast = { type, description }
    notifications.value.push(toast)

    const ms = typeof delayMs === 'number' ? delayMs : defaultDelayMs.value
    // Remove the exact toast object after it should have disappeared.
    window.setTimeout(() => {
      const idx = notifications.value.indexOf(toast)
      if (idx !== -1) notifications.value.splice(idx, 1)
    }, ms + 100)
  }

  function clearToasts() {
    notifications.value = []
  }

  return {
    notifications,
    defaultDelayMs,
    pushToast,
    clearToasts
  }
})




