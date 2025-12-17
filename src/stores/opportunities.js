import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchOpportunities, fetchOpportunityById, createOpportunity, updateOpportunity, deleteOpportunity, fetchOpportunityActivities, addOpportunityActivity, updateOpportunityActivity, deleteOpportunityActivity } from '@/api/opportunities'

export const useOpportunitiesStore = defineStore('opportunities', () => {
  // State
  const opportunities = ref([])
  const currentOpportunity = ref(null)
  const currentOpportunityActivities = ref([])
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    stage: null,
    assignee: null,
    search: ''
  })
  
  // Getters
  const totalOpportunities = computed(() => opportunities.value.length)
  const opportunitiesByStage = computed(() => {
    const stages = {}
    opportunities.value.forEach(opp => {
      if (!stages[opp.stage]) {
        stages[opp.stage] = []
      }
      stages[opp.stage].push(opp)
    })
    return stages
  })
  const totalValue = computed(() => 
    opportunities.value.reduce((sum, opp) => sum + opp.value, 0)
  )
  
  // Actions
  async function loadOpportunities() {
    loading.value = true
    error.value = null
    try {
      const result = await fetchOpportunities(filters.value)
      opportunities.value = result.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  async function loadOpportunityById(id) {
    loading.value = true
    error.value = null
    try {
      currentOpportunity.value = await fetchOpportunityById(id)
      currentOpportunityActivities.value = await fetchOpportunityActivities(id)
      // Also update in the opportunities list if it exists
      const index = opportunities.value.findIndex(o => o.id === parseInt(id))
      if (index !== -1) {
        opportunities.value[index] = currentOpportunity.value
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  async function addOpportunity(opportunityData) {
    loading.value = true
    error.value = null
    try {
      const newOpportunity = await createOpportunity(opportunityData)
      opportunities.value.unshift(newOpportunity)
      return newOpportunity
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function modifyOpportunity(id, updates) {
    loading.value = true
    error.value = null
    try {
      const updatedOpportunity = await updateOpportunity(id, updates)
      const index = opportunities.value.findIndex(o => o.id === id)
      if (index !== -1) {
        opportunities.value[index] = updatedOpportunity
      }
      return updatedOpportunity
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function removeOpportunity(id) {
    loading.value = true
    error.value = null
    try {
      await deleteOpportunity(id)
      opportunities.value = opportunities.value.filter(o => o.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function addActivity(opportunityId, activity) {
    try {
      const newActivity = await addOpportunityActivity(opportunityId, activity)
      currentOpportunityActivities.value.unshift(newActivity)
      return newActivity
    } catch (err) {
      error.value = err.message
      throw err
    }
  }
  
  async function updateActivity(opportunityId, activityId, updates) {
    try {
      const updatedActivity = await updateOpportunityActivity(opportunityId, activityId, updates)
      const index = currentOpportunityActivities.value.findIndex(a => a.id === parseInt(activityId))
      if (index !== -1) {
        currentOpportunityActivities.value[index] = updatedActivity
      }
      return updatedActivity
    } catch (err) {
      error.value = err.message
      throw err
    }
  }
  
  async function deleteActivity(opportunityId, activityId) {
    try {
      await deleteOpportunityActivity(opportunityId, activityId)
      currentOpportunityActivities.value = currentOpportunityActivities.value.filter(a => a.id !== parseInt(activityId))
      return { success: true }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }
  
  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
    loadOpportunities()
  }
  
  return {
    opportunities,
    currentOpportunity,
    currentOpportunityActivities,
    loading,
    error,
    filters,
    totalOpportunities,
    opportunitiesByStage,
    totalValue,
    loadOpportunities,
    loadOpportunityById,
    addOpportunity,
    modifyOpportunity,
    removeOpportunity,
    addActivity,
    updateActivity,
    deleteActivity,
    setFilters
  }
})

