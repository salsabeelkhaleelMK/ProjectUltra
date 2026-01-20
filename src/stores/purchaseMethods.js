import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as purchaseMethodsApi from '@/api/purchaseMethods'

export const usePurchaseMethodsStore = defineStore('purchaseMethods', () => {
  // State
  const purchaseMethods = ref([])
  const currentPurchaseMethod = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  // Getters
  const purchaseMethodsByType = computed(() => {
    return (type) => purchaseMethods.value.filter(pm => pm.type === type)
  })
  
  const purchaseMethodsByLead = computed(() => {
    return (leadId) => purchaseMethods.value.filter(pm => pm.leadId === parseInt(leadId))
  })
  
  const purchaseMethodsByOpportunity = computed(() => {
    return (opportunityId) => purchaseMethods.value.filter(pm => pm.opportunityId === parseInt(opportunityId))
  })
  
  // Actions
  const fetchPurchaseMethods = async (filters = {}) => {
    loading.value = true
    error.value = null
    try {
      const result = await purchaseMethodsApi.fetchPurchaseMethods(filters)
      purchaseMethods.value = result
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const fetchPurchaseMethodById = async (id) => {
    loading.value = true
    error.value = null
    try {
      currentPurchaseMethod.value = await purchaseMethodsApi.fetchPurchaseMethodById(id)
      return currentPurchaseMethod.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const createPurchaseMethod = async (purchaseMethodData) => {
    loading.value = true
    error.value = null
    try {
      const newPurchaseMethod = await purchaseMethodsApi.createPurchaseMethod(purchaseMethodData)
      purchaseMethods.value.push(newPurchaseMethod)
      return newPurchaseMethod
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const updatePurchaseMethod = async (id, updates) => {
    loading.value = true
    error.value = null
    try {
      const updated = await purchaseMethodsApi.updatePurchaseMethod(id, updates)
      const index = purchaseMethods.value.findIndex(pm => pm.id === id)
      if (index !== -1) {
        purchaseMethods.value[index] = updated
      }
      if (currentPurchaseMethod.value?.id === id) {
        currentPurchaseMethod.value = updated
      }
      return updated
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const deletePurchaseMethod = async (id) => {
    loading.value = true
    error.value = null
    try {
      await purchaseMethodsApi.deletePurchaseMethod(id)
      purchaseMethods.value = purchaseMethods.value.filter(pm => pm.id !== id)
      if (currentPurchaseMethod.value?.id === id) {
        currentPurchaseMethod.value = null
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return {
    // State
    purchaseMethods,
    currentPurchaseMethod,
    loading,
    error,
    // Getters
    purchaseMethodsByType,
    purchaseMethodsByLead,
    purchaseMethodsByOpportunity,
    // Actions
    fetchPurchaseMethods,
    fetchPurchaseMethodById,
    createPurchaseMethod,
    updatePurchaseMethod,
    deletePurchaseMethod
  }
})
