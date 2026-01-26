import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'project-ultra-integrations'

/**
 * Get integrations from localStorage
 */
function getStoredIntegrations() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to read integrations from localStorage:', error)
    return []
  }
}

/**
 * Save integrations to localStorage
 */
function saveIntegrations(integrations) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(integrations))
  } catch (error) {
    console.error('Failed to save integrations to localStorage:', error)
  }
}

export const useIntegrationsStore = defineStore('integrations', () => {
  // Initialize with default integrations
  const defaultIntegrations = [
    {
      id: 'api',
      name: 'API Integration',
      type: 'api',
      enabled: false,
      connected: false,
      entityType: null, // 'contacts' | 'leads' | 'opportunities'
      config: {
        apiKey: '',
        endpoint: '',
        webhookUrl: ''
      },
      lastSync: null,
      syncHistory: []
    },
    {
      id: 'email',
      name: 'Email Parsing',
      type: 'email',
      enabled: false,
      connected: false,
      entityType: null,
      config: {
        emailAddress: '',
        imapServer: '',
        imapPort: '',
        username: '',
        password: ''
      },
      lastSync: null,
      syncHistory: []
    },
    {
      id: 'portal',
      name: 'Portal Integration',
      type: 'portal',
      enabled: false,
      connected: false,
      entityType: null,
      config: {
        portalUrl: '',
        apiKey: '',
        username: ''
      },
      lastSync: null,
      syncHistory: []
    },
    {
      id: 'zapier',
      name: 'Zapier',
      type: 'zapier',
      enabled: false,
      connected: false,
      entityType: null,
      config: {
        webhookUrl: ''
      },
      lastSync: null,
      syncHistory: []
    },
    {
      id: 'meta',
      name: 'Meta (Facebook/Instagram)',
      type: 'meta',
      enabled: false,
      connected: false,
      entityType: null,
      config: {
        appId: '',
        appSecret: '',
        accessToken: ''
      },
      lastSync: null,
      syncHistory: []
    },
    {
      id: 'woice',
      name: 'WOICE',
      type: 'woice',
      enabled: false,
      connected: false,
      entityType: null,
      config: {
        apiKey: '',
        endpoint: ''
      },
      lastSync: null,
      syncHistory: []
    },
    {
      id: 'webhook',
      name: 'Custom Webhook',
      type: 'webhook',
      enabled: false,
      connected: false,
      entityType: null,
      config: {
        webhookUrl: '',
        secret: ''
      },
      lastSync: null,
      syncHistory: []
    }
  ]

  // Load from localStorage or use defaults
  const storedIntegrations = getStoredIntegrations()
  const integrations = ref(
    storedIntegrations.length > 0 
      ? storedIntegrations 
      : defaultIntegrations
  )

  // Save to localStorage whenever integrations change
  watch(integrations, (newIntegrations) => {
    saveIntegrations(newIntegrations)
  }, { deep: true })

  /**
   * Get integration by ID
   */
  const getIntegration = (id) => {
    return integrations.value.find(int => int.id === id)
  }

  /**
   * Toggle integration enabled state
   * Requires entityType to be set before enabling
   */
  const toggleIntegration = (id) => {
    const integration = getIntegration(id)
    if (!integration) return

    // If enabling, require entityType to be set
    if (!integration.enabled && !integration.entityType) {
      throw new Error('Entity type must be configured before enabling integration')
    }

    integration.enabled = !integration.enabled
    
    // If disabling, also disconnect
    if (!integration.enabled) {
      integration.connected = false
    }
  }

  /**
   * Update integration configuration
   */
  const updateConfig = (id, config) => {
    const integration = getIntegration(id)
    if (!integration) return

    integration.config = { ...integration.config, ...config }
  }

  /**
   * Set entity type for integration
   */
  const setEntityType = (id, entityType) => {
    const integration = getIntegration(id)
    if (!integration) return

    // Validate entity type
    if (!['contacts', 'leads', 'opportunities'].includes(entityType)) {
      throw new Error('Invalid entity type. Must be contacts, leads, or opportunities')
    }

    integration.entityType = entityType
  }

  /**
   * Test connection for integration
   */
  const testConnection = async (id) => {
    const integration = getIntegration(id)
    if (!integration) return false

    // Mock connection test - in real app, this would call an API
    return new Promise((resolve) => {
      setTimeout(() => {
        integration.connected = true
        resolve(true)
      }, 1000)
    })
  }

  /**
   * Record sync history entry
   */
  const addSyncHistory = (id, syncData) => {
    const integration = getIntegration(id)
    if (!integration) return

    const historyEntry = {
      timestamp: new Date().toISOString(),
      entityType: integration.entityType,
      recordsImported: syncData.recordsImported || 0,
      errors: syncData.errors || [],
      conflicts: syncData.conflicts || []
    }

    integration.syncHistory.unshift(historyEntry)
    integration.lastSync = historyEntry.timestamp

    // Keep only last 50 sync history entries
    if (integration.syncHistory.length > 50) {
      integration.syncHistory = integration.syncHistory.slice(0, 50)
    }
  }

  return {
    integrations,
    getIntegration,
    toggleIntegration,
    updateConfig,
    setEntityType,
    testConnection,
    addSyncHistory
  }
})
