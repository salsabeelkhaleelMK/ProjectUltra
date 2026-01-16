import { watch, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'

/**
 * Composable for managing dark mode theme
 * Applies/removes data-theme="dark" attribute on document.documentElement
 * based on settings store darkMode preference
 */
export function useTheme() {
  const settingsStore = useSettingsStore()

  /**
   * Apply or remove dark theme based on darkMode setting
   */
  const applyTheme = () => {
    const isDark = settingsStore.getSetting('darkMode')
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }

  // Watch for changes in darkMode setting
  watch(
    () => settingsStore.getSetting('darkMode'),
    () => {
      applyTheme()
    }
  )

  // Initialize theme immediately if DOM is ready, otherwise on mount
  if (typeof document !== 'undefined') {
    applyTheme()
  }
  
  onMounted(() => {
    applyTheme()
  })

  return {
    isDark: () => settingsStore.getSetting('darkMode'),
    toggleTheme: () => {
      const currentValue = settingsStore.getSetting('darkMode')
      settingsStore.setSetting('darkMode', !currentValue)
    }
  }
}

