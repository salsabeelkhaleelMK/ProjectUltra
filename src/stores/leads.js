import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchLeads, fetchLeadById, createLead, updateLead, deleteLead, fetchLeadActivities, addLeadActivity } from '@/api/leads'

export const useLeadsStore = defineStore('leads', () => {
  // State
  const leads = ref([])
  const currentLead = ref(null)
  const currentLeadActivities = ref([])
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    status: null,
    priority: null,
    assignee: null,
    search: ''
  })
  
  // Getters
  const totalLeads = computed(() => leads.value.length)
  const hotLeads = computed(() => leads.value.filter(l => l.priority === 'Hot'))
  const openLeads = computed(() => leads.value.filter(l => l.status === 'Open'))
  
  // Actions
  async function loadLeads() {
    loading.value = true
    error.value = null
    try {
      const result = await fetchLeads(filters.value)
      leads.value = result.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  async function loadLeadById(id) {
    loading.value = true
    error.value = null
    try {
      currentLead.value = await fetchLeadById(id)
      currentLeadActivities.value = await fetchLeadActivities(id)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  async function addLead(leadData) {
    loading.value = true
    error.value = null
    try {
      const newLead = await createLead(leadData)
      leads.value.unshift(newLead)
      return newLead
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function modifyLead(id, updates) {
    loading.value = true
    error.value = null
    try {
      const updatedLead = await updateLead(id, updates)
      const index = leads.value.findIndex(l => l.id === id)
      if (index !== -1) {
        leads.value[index] = updatedLead
      }
      if (currentLead.value?.id === id) {
        currentLead.value = updatedLead
      }
      return updatedLead
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function removeLead(id) {
    loading.value = true
    error.value = null
    try {
      await deleteLead(id)
      leads.value = leads.value.filter(l => l.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function addActivity(leadId, activity) {
    try {
      const newActivity = await addLeadActivity(leadId, activity)
      currentLeadActivities.value.unshift(newActivity)
      return newActivity
    } catch (err) {
      error.value = err.message
      throw err
    }
  }
  
  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
    loadLeads()
  }
  
  function clearFilters() {
    filters.value = {
      status: null,
      priority: null,
      assignee: null,
      search: ''
    }
    loadLeads()
  }
  
  return {
    leads,
    currentLead,
    currentLeadActivities,
    loading,
    error,
    filters,
    totalLeads,
    hotLeads,
    openLeads,
    loadLeads,
    loadLeadById,
    addLead,
    modifyLead,
    removeLead,
    addActivity,
    setFilters,
    clearFilters
  }
})
