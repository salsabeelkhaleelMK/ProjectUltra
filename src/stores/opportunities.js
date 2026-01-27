import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import * as opportunitiesApi from '@/api/opportunities'
import { useSettingsStore } from '@/stores/settings'

export const useOpportunitiesStore = defineStore('opportunities', () => {
  const opportunities = ref([])
  const currentOpportunity = ref(null)
  const currentOpportunityActivities = ref([]) // Store activities in ref instead of computed
  const loading = ref(false)
  const error = ref(null)

  // Computed: Hot opportunities (priority === 'Hot')
  const hotOpportunities = computed(() => {
    return opportunities.value.filter(opp => opp.priority === 'Hot' && opp.stage !== 'Closed Lost')
  })

  // Watch for currentOpportunity changes and load activities
  watch(currentOpportunity, async (opportunity, oldOpportunity) => {
    if (opportunity) {
      // Only clear activities if we're switching to a different opportunity
      if (!oldOpportunity || oldOpportunity.id !== opportunity.id) {
        try {
          currentOpportunityActivities.value = await opportunitiesApi.fetchOpportunityActivities(opportunity.id)
        } catch (err) {
          console.error('Failed to load opportunity activities:', err)
          currentOpportunityActivities.value = []
        }
      }
    } else {
      currentOpportunityActivities.value = []
    }
  }, { immediate: true })

  const fetchOpportunities = async (filters = {}) => {
    loading.value = true
    error.value = null
    try {
      const result = await opportunitiesApi.fetchOpportunities(filters)
      const opps = result.data || result
      
      // Check and auto-transition negotiation substatus for each opportunity
      const { checkNegotiationSubstatusTransition } = await import('@/utils/stageMapper/opportunityStages')
      for (const opp of opps) {
        const newSubstatus = checkNegotiationSubstatusTransition(opp)
        if (newSubstatus !== opp.negotiationSubstatus) {
          // Auto-transition detected - update silently
          opp.negotiationSubstatus = newSubstatus
          // Update in database (async, don't wait)
          opportunitiesApi.updateOpportunity(opp.id, { negotiationSubstatus: newSubstatus }).catch(err => {
            console.error('Failed to auto-update negotiation substatus:', err)
          })
        }
      }
      
      opportunities.value = opps
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchOpportunityById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const loadedOpportunity = await opportunitiesApi.fetchOpportunityById(id)
      
      // Check and auto-transition negotiation substatus
      const { checkNegotiationSubstatusTransition } = await import('@/utils/stageMapper/opportunityStages')
      const newSubstatus = checkNegotiationSubstatusTransition(loadedOpportunity)
      if (newSubstatus !== loadedOpportunity.negotiationSubstatus) {
        // Auto-transition detected - update silently
        loadedOpportunity.negotiationSubstatus = newSubstatus
        // Update in database (async, don't wait)
        opportunitiesApi.updateOpportunity(id, { negotiationSubstatus: newSubstatus }).catch(err => {
          console.error('Failed to auto-update negotiation substatus:', err)
        })
      }
      
      currentOpportunity.value = loadedOpportunity
      
      // Sync back to opportunities list to keep list and detail view in sync
      const index = opportunities.value.findIndex(o => o.id === parseInt(id))
      if (index !== -1) {
        opportunities.value[index] = loadedOpportunity
      }
      
      // Activities will be loaded via watch on currentOpportunity
      
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
          // Fetch activities via API wrapper instead of direct mockActivities import
          const allActivities = await opportunitiesApi.fetchOpportunityActivities(id)
          
          // Find and mark NFU/OFB activities as completed
          const nfuOfbActivities = allActivities.filter(activity => 
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
        // Reload activities via API wrapper
        currentOpportunityActivities.value = await opportunitiesApi.fetchOpportunityActivities(opportunityId)
      }
      return newActivity
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Add offer to opportunity
  const addOffer = async (opportunityId, offerData) => {
    loading.value = true
    error.value = null
    try {
      const newOffer = {
        id: `offer-${Date.now()}`,
        createdAt: new Date().toISOString(),
        vehicleBrand: offerData.vehicleBrand || '',
        vehicleModel: offerData.vehicleModel || '',
        vehicleYear: offerData.vehicleYear || '',
        price: offerData.price || 0,
        status: 'active',
        data: offerData.data || {}
      }
      
      const result = await opportunitiesApi.addOffer(opportunityId, newOffer)
      
      // Update local state
      const opp = opportunities.value.find(o => o.id === opportunityId)
      if (opp) {
        if (!opp.offers) opp.offers = []
        opp.offers.push(result)
        
        // Set stage and negotiationSubstatus if first offer
        if (opp.offers.length === 1) {
          opp.stage = 'In Negotiation'
          opp.negotiationSubstatus = 'Offer Sent'
        }
      }
      
      if (currentOpportunity.value?.id === opportunityId) {
        if (!currentOpportunity.value.offers) currentOpportunity.value.offers = []
        currentOpportunity.value.offers.push(result)
        
        // Set stage and negotiationSubstatus if first offer
        if (currentOpportunity.value.offers.length === 1) {
          currentOpportunity.value.stage = 'In Negotiation'
          currentOpportunity.value.negotiationSubstatus = 'Offer Sent'
        }
      }
      
      // Add activity for offer creation
      await addActivity(opportunityId, {
        type: 'offer',
        user: 'You',
        action: 'created an offer',
        content: `Offer created: ${newOffer.vehicleBrand} ${newOffer.vehicleModel} (${newOffer.vehicleYear}) - € ${newOffer.price.toLocaleString()}`,
        data: { offerId: newOffer.id },
        timestamp: new Date().toISOString()
      })
      
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Mark offer as accepted
  const markOfferAccepted = async (opportunityId, offerId) => {
    loading.value = true
    error.value = null
    try {
      await opportunitiesApi.markOfferAccepted(opportunityId, offerId)
      
      // Update local state
      const opp = opportunities.value.find(o => o.id === opportunityId)
      if (opp && opp.offers) {
        const offer = opp.offers.find(o => o.id === offerId)
        if (offer) {
          offer.status = 'accepted'
        }
        opp.negotiationSubstatus = 'Offer Accepted'
        opp.stage = 'In Negotiation'
      }
      
      if (currentOpportunity.value?.id === opportunityId && currentOpportunity.value.offers) {
        const offer = currentOpportunity.value.offers.find(o => o.id === offerId)
        if (offer) {
          offer.status = 'accepted'
        }
        currentOpportunity.value.negotiationSubstatus = 'Offer Accepted'
        currentOpportunity.value.stage = 'In Negotiation'
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete/archive offer
  const deleteOffer = async (opportunityId, offerId) => {
    loading.value = true
    error.value = null
    try {
      await opportunitiesApi.deleteOffer(opportunityId, offerId)
      
      // Update local state
      const opp = opportunities.value.find(o => o.id === opportunityId)
      if (opp && opp.offers) {
        const offer = opp.offers.find(o => o.id === offerId)
        if (offer) {
          offer.status = 'archived'
        }
      }
      
      if (currentOpportunity.value?.id === opportunityId && currentOpportunity.value.offers) {
        const offer = currentOpportunity.value.offers.find(o => o.id === offerId)
        if (offer) {
          offer.status = 'archived'
        }
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update negotiation substatus
  const updateNegotiationSubstatus = async (opportunityId, substatus) => {
    loading.value = true
    error.value = null
    try {
      await opportunitiesApi.updateOpportunity(opportunityId, { negotiationSubstatus: substatus })
      
      // Update local state
      const opp = opportunities.value.find(o => o.id === opportunityId)
      if (opp) {
        opp.negotiationSubstatus = substatus
      }
      
      if (currentOpportunity.value?.id === opportunityId) {
        currentOpportunity.value.negotiationSubstatus = substatus
      }
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
        // Reload activities via API wrapper
        currentOpportunityActivities.value = await opportunitiesApi.fetchOpportunityActivities(opportunityId)
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
        // Reload activities via API wrapper
        currentOpportunityActivities.value = await opportunitiesApi.fetchOpportunityActivities(opportunityId)
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
    currentOpportunityActivities: computed(() => currentOpportunityActivities.value), // Return as computed for backward compatibility
    hotOpportunities,
    fetchOpportunities,
    fetchOpportunityById,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    addActivity,
    updateActivity,
    deleteActivity,
    addVehicle,
    createOffer,
    addOffer,
    markOfferAccepted,
    deleteOffer,
    updateNegotiationSubstatus
  }
})
