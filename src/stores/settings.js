import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'projectultra_settings'

// Default settings values
const DEFAULT_SETTINGS = {
  // Opportunity Task Widget Thresholds
  oofbMinDays: 7,
  oofbMaxDays: 13,
  ufbDays: 14,
  ofbDays: 5,
  nfuDays: 5,
  cfbDays: 7,
  dfbDays: 3,
  offerSentToAwaitingResponseDays: 3,
  
  // Opportunity Abandonment
  abandonedOpportunityDays: 30,
  abandonedEligibleStages: [
    'Qualified',
    'Awaiting Appointment',
    'To be Called Back',
    'In Negotiation',
    'Offer Sent',
    'Awaiting Response'
  ],
  
  // Lead Thresholds
  maxContactAttempts: 5,
  excludeNotValidFromConversion: true,
  
  // Task Widgets
  autoCloseWidgetsOnClose: true
}

// Load settings from localStorage
function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Merge with defaults to handle new settings added in future
      return { ...DEFAULT_SETTINGS, ...parsed }
    }
  } catch (error) {
    console.error('Failed to load settings from localStorage:', error)
  }
  return { ...DEFAULT_SETTINGS }
}

// Save settings to localStorage
function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error)
  }
}

export const useSettingsStore = defineStore('settings', () => {
  // Initialize settings from localStorage or defaults
  const settings = ref(loadSettings())

  // Save settings whenever they change
  function updateSettings(newSettings) {
    settings.value = { ...settings.value, ...newSettings }
    saveSettings(settings.value)
  }

  // Reset to default settings
  function resetToDefaults() {
    settings.value = { ...DEFAULT_SETTINGS }
    saveSettings(settings.value)
  }

  // Get a specific setting value
  function getSetting(key) {
    return settings.value[key]
  }

  // Update a specific setting
  function setSetting(key, value) {
    settings.value[key] = value
    saveSettings(settings.value)
  }

  return {
    settings: computed(() => settings.value),
    updateSettings,
    resetToDefaults,
    getSetting,
    setSetting
  }
})

