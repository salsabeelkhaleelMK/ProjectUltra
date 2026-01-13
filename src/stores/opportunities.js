import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as opportunitiesApi from '@/api/opportunities'
import { mockActivities } from '@/api/mockData'
import { useSettingsStore } from '@/stores/settings'

export const useOpportunitiesStore = defineStore('opportunities', () => {
  const opportunities = ref([])
  const currentOpportunity = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Computed: Current opportunity activities
  const currentOpportunityActivities = computed(() => {
    if (!currentOpportunity.value) return []
    return mockActivities.filter(activity => activity.opportunityId === currentOpportunity.value.id)
  })

  // Computed: Hot opportunities (priority === 'Hot')
  const hotOpportunities = computed(() => {
    return opportunities.value.filter(opp => opp.priority === 'Hot' && opp.stage !== 'Closed Lost')
  })

  const loadOpportunities = async (filters = {}) => {
    const result = await fetchOpportunities(filters)
    return result
  }

  const fetchOpportunities = async (filters = {}) => {
    loading.value = true
    error.value = null
    try {
      const result = await opportunitiesApi.fetchOpportunities(filters)
      opportunities.value = result.data || result
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const loadOpportunityById = async (id) => {
    return await fetchOpportunityById(id)
  }

  const fetchOpportunityById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const loadedOpportunity = await opportunitiesApi.fetchOpportunityById(id)
      currentOpportunity.value = loadedOpportunity
      
      // Sync back to opportunities list to keep list and detail view in sync
      const index = opportunities.value.findIndex(o => o.id === parseInt(id))
      if (index !== -1) {
        opportunities.value[index] = loadedOpportunity
      }
      
      return currentOpportunity.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createOpportunity = async (opportunityData) => {
    loading.value = true
    error.value = null
    try {
      const newOpportunity = await opportunitiesApi.createOpportunity(opportunityData)
      opportunities.value.push(newOpportunity)
      return newOpportunity
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const modifyOpportunity = async (id, updates) => {
    return await updateOpportunity(id, updates)
  }

  const updateOpportunity = async (id, updates) => {
    loading.value = true
    error.value = null
    try {
      // Check if opportunity is being closed and auto-close is enabled
      const settingsStore = useSettingsStore()
      const autoCloseEnabled = settingsStore.getSetting('autoCloseWidgetsOnClose')
      const currentOpp = currentOpportunity.value?.id === id ? currentOpportunity.value : opportunities.value.find(o => o.id === id)
      
      // Check if stage is changing to Closed Won or Closed Lost
      if (autoCloseEnabled && updates.stage && (updates.stage === 'Closed Won' || updates.stage === 'Closed Lost')) {
        const currentStage = currentOpp?.stage
        // Only auto-close if transitioning from an active stage
        if (currentStage && currentStage !== 'Closed Won' && currentStage !== 'Closed Lost') {
          // Find and mark NFU/OFB activities as completed
          const nfuOfbActivities = mockActivities.filter(activity => 
            activity.opportunityId === parseInt(id) && 
            (activity.type === 'nfu-task' || activity.type === 'ofb-task' || 
             activity.action?.includes('NFU') || activity.action?.includes('OFB'))
          )
          
          // Mark activities as completed
          for (const activity of nfuOfbActivities) {
            if (!activity.completed) {
              await updateActivity(id, activity.id, { 
                completed: true,
                completedAt: new Date().toISOString(),
                completionReason: `Opportunity closed as ${updates.stage}`
              })
            }
          }
        }
      }
      
      const updated = await opportunitiesApi.updateOpportunity(id, updates)
      const index = opportunities.value.findIndex(o => o.id === id)
      if (index !== -1) {
        opportunities.value[index] = updated
      }
      if (currentOpportunity.value?.id === id) {
        currentOpportunity.value = updated
      }
      return updated
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteOpportunity = async (id) => {
    loading.value = true
    error.value = null
    try {
      await opportunitiesApi.deleteOpportunity(id)
      opportunities.value = opportunities.value.filter(o => o.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const addActivity = async (opportunityId, activity) => {
    loading.value = true
    error.value = null
    try {
      const newActivity = await opportunitiesApi.addOpportunityActivity(opportunityId, activity)
      if (currentOpportunity.value?.id === parseInt(opportunityId)) {
        // Trigger reactivity by reloading
        await loadOpportunityById(opportunityId)
      }
      return newActivity
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateActivity = async (opportunityId, activityId, updates) => {
    loading.value = true
    error.value = null
    try {
      const updated = await opportunitiesApi.updateOpportunityActivity(opportunityId, activityId, updates)
      if (currentOpportunity.value?.id === parseInt(opportunityId)) {
        await loadOpportunityById(opportunityId)
      }
      return updated
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const addVehicle = async (opportunityId, vehicleData) => {
    loading.value = true
    error.value = null
    try {
      const updated = await opportunitiesApi.addVehicleToOpportunity(opportunityId, vehicleData)
      const index = opportunities.value.findIndex(o => o.id === parseInt(opportunityId))
      if (index !== -1) {
        opportunities.value[index] = updated
      }
      if (currentOpportunity.value?.id === parseInt(opportunityId)) {
        currentOpportunity.value = updated
      }
      return updated
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createOffer = async (opportunityId, offerData) => {
    loading.value = true
    error.value = null
    try {
      const result = await opportunitiesApi.createOfferForOpportunity(opportunityId, offerData)
      const index = opportunities.value.findIndex(o => o.id === parseInt(opportunityId))
      if (index !== -1) {
        opportunities.value[index] = result.opportunity
      }
      if (currentOpportunity.value?.id === parseInt(opportunityId)) {
        currentOpportunity.value = result.opportunity
      }
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteActivity = async (opportunityId, activityId) => {
    loading.value = true
    error.value = null
    try {
      await opportunitiesApi.deleteOpportunityActivity(opportunityId, activityId)
      if (currentOpportunity.value?.id === parseInt(opportunityId)) {
        await loadOpportunityById(opportunityId)
      }
      return { success: true }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    opportunities,
    currentOpportunity,
    loading,
    error,
    currentOpportunityActivities,
    hotOpportunities,
    loadOpportunities,
    fetchOpportunities,
    loadOpportunityById,
    fetchOpportunityById,
    createOpportunity,
    modifyOpportunity,
    updateOpportunity,
    deleteOpportunity,
    addActivity,
    updateActivity,
    deleteActivity,
    addVehicle,
    createOffer
  }
})
