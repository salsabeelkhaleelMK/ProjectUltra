import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import * as leadsApi from '@/api/leads'
import { createOpportunityFromLead } from '@/api/opportunities'

export const useLeadsStore = defineStore('leads', () => {
  const leads = ref([])
  const currentLead = ref(null)
  const currentLeadActivities = ref([]) // Store activities in ref instead of computed
  const loading = ref(false)
  const error = ref(null)

  // Computed: Hot leads (priority === 'Hot')
  const hotLeads = computed(() => {
    return leads.value.filter(lead => lead.priority === 'Hot' && !lead.isDisqualified)
  })

  // Watch for currentLead changes and load activities
  watch(currentLead, async (lead) => {
    if (lead) {
      try {
        currentLeadActivities.value = await leadsApi.fetchLeadActivities(lead.id)
      } catch (err) {
        console.error('Failed to load lead activities:', err)
        currentLeadActivities.value = []
      }
    } else {
      currentLeadActivities.value = []
    }
  }, { immediate: true })

  const loadLeads = async (filters = {}) => {
    const result = await fetchLeads(filters)
    return result
  }

  const fetchLeads = async (filters = {}) => {
    loading.value = true
    error.value = null
    try {
      const result = await leadsApi.fetchLeads(filters)
      leads.value = result.data || result
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const loadLeadById = async (id) => {
    return await fetchLeadById(id)
  }

  const fetchLeadById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const loadedLead = await leadsApi.fetchLeadById(id)
      currentLead.value = loadedLead
      
      // Sync back to leads list to keep list and detail view in sync
      const index = leads.value.findIndex(l => l.id === parseInt(id))
      if (index !== -1) {
        leads.value[index] = loadedLead
      }
      
      // Activities will be loaded via watch on currentLead
      
      return currentLead.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createLead = async (leadData) => {
    loading.value = true
    error.value = null
    try {
      const newLead = await leadsApi.createLead(leadData)
      leads.value.push(newLead)
      return newLead
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const modifyLead = async (id, updates) => {
    return await updateLead(id, updates)
  }

  const updateLead = async (id, updates) => {
    loading.value = true
    error.value = null
    try {
      const updated = await leadsApi.updateLead(id, updates)
      const index = leads.value.findIndex(l => l.id === id)
      if (index !== -1) {
        leads.value[index] = updated
      }
      if (currentLead.value?.id === id) {
        currentLead.value = updated
      }
      return updated
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteLead = async (id) => {
    loading.value = true
    error.value = null
    try {
      await leadsApi.deleteLead(id)
      leads.value = leads.value.filter(l => l.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const addActivity = async (leadId, activity) => {
    loading.value = true
    error.value = null
    try {
      const newActivity = await leadsApi.addLeadActivity(leadId, activity)
      if (currentLead.value?.id === parseInt(leadId)) {
        // Reload activities via API wrapper
        currentLeadActivities.value = await leadsApi.fetchLeadActivities(leadId)
      }
      return newActivity
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateActivity = async (leadId, activityId, updates) => {
    loading.value = true
    error.value = null
    try {
      const updated = await leadsApi.updateLeadActivity(leadId, activityId, updates)
      if (currentLead.value?.id === parseInt(leadId)) {
        // Reload activities via API wrapper
        currentLeadActivities.value = await leadsApi.fetchLeadActivities(leadId)
      }
      return updated
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteActivity = async (leadId, activityId) => {
    loading.value = true
    error.value = null
    try {
      await leadsApi.deleteLeadActivity(leadId, activityId)
      if (currentLead.value?.id === parseInt(leadId)) {
        // Reload activities via API wrapper
        currentLeadActivities.value = await leadsApi.fetchLeadActivities(leadId)
      }
      return { success: true }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const scheduleFollowUp = async (leadId, appointmentData) => {
    loading.value = true
    error.value = null
    try {
      const event = await leadsApi.scheduleLeadFollowUp(leadId, appointmentData)
      await loadLeadById(leadId)
      return event
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const convertLeadToOpportunity = async (leadId) => {
    loading.value = true
    error.value = null
    try {
      const lead = await leadsApi.fetchLeadById(leadId)
      // Use API wrapper to fetch activities instead of direct mockActivities import
      const activities = await leadsApi.fetchLeadActivities(leadId)
      const opportunity = await createOpportunityFromLead(lead, activities)
      
      // Mark lead as converted (or remove it)
      await leadsApi.updateLead(leadId, { isDisqualified: true, disqualifyReason: 'Converted to opportunity' })
      
      // Remove from leads list
      leads.value = leads.value.filter(l => l.id !== leadId)
      
      return opportunity.id
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    leads,
    currentLead,
    loading,
    error,
    currentLeadActivities: computed(() => currentLeadActivities.value), // Return as computed for backward compatibility
    hotLeads,
    loadLeads,
    fetchLeads,
    loadLeadById,
    fetchLeadById,
    createLead,
    modifyLead,
    updateLead,
    deleteLead,
    addActivity,
    updateActivity,
    deleteActivity,
    scheduleFollowUp,
    convertLeadToOpportunity
  }
})
