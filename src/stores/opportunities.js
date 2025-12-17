import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchOpportunities, fetchOpportunityById, createOpportunity, updateOpportunity, deleteOpportunity, fetchOpportunityActivities } from '@/api/opportunities'

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
    setFilters
  }
})

