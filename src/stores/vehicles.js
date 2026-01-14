import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchVehicles as fetchVehiclesApi, fetchVehicleById as fetchVehicleByIdApi, createVehicle, updateVehicle, deleteVehicle } from '@/api/vehicles'

export const useVehiclesStore = defineStore('vehicles', () => {
  // State
  const vehicles = ref([])
  const currentVehicle = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    status: null,
    brand: null,
    search: ''
  })
  
  // Getters
  const totalVehicles = computed(() => vehicles.value.length)
  const availableVehicles = computed(() => 
    vehicles.value.filter(v => v.status === 'Available')
  )
  const totalInventoryValue = computed(() => 
    vehicles.value.reduce((sum, v) => sum + v.price, 0)
  )
  
  // Actions
  const fetchVehicles = async () => {
    loading.value = true
    error.value = null
    try {
      const result = await fetchVehiclesApi(filters.value)
      vehicles.value = result.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  const fetchVehicleById = async (id) => {
    loading.value = true
    error.value = null
    try {
      currentVehicle.value = await fetchVehicleByIdApi(id)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  const addVehicle = async (vehicleData) => {
    loading.value = true
    error.value = null
    try {
      const newVehicle = await createVehicle(vehicleData)
      vehicles.value.unshift(newVehicle)
      return newVehicle
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const modifyVehicle = async (id, updates) => {
    loading.value = true
    error.value = null
    try {
      const updatedVehicle = await updateVehicle(id, updates)
      const index = vehicles.value.findIndex(v => v.id === id)
      if (index !== -1) {
        vehicles.value[index] = updatedVehicle
      }
      return updatedVehicle
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const removeVehicle = async (id) => {
    loading.value = true
    error.value = null
    try {
      await deleteVehicle(id)
      vehicles.value = vehicles.value.filter(v => v.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
    fetchVehicles()
  }
  
  return {
    vehicles,
    currentVehicle,
    loading,
    error,
    filters,
    totalVehicles,
    availableVehicles,
    totalInventoryValue,
    fetchVehicles,
    fetchVehicleById,
    addVehicle,
    modifyVehicle,
    removeVehicle,
    setFilters
  }
})






