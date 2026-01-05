import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockUsers } from '@/api/mockData'

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref(mockUsers[0]) // Default: Salsabeel Khaleel (manager)
  const isAuthenticated = ref(true)
  
  // Getters
  const userRole = () => currentUser.value.role
  const isSalesman = () => currentUser.value.role === 'salesman'
  const isOperator = () => currentUser.value.role === 'operator'
  const isManager = () => currentUser.value.role === 'manager'
  
  // Permission getters
  const canAccessLeads = () => {
    const role = currentUser.value.role
    return role === 'operator' || role === 'manager'
  }
  
  const canAccessOpportunities = () => {
    const role = currentUser.value.role
    return role === 'salesman' || role === 'manager'
  }
  
  const canAccessReports = () => currentUser.value.role === 'manager'
  const canAccessSettings = () => currentUser.value.role === 'manager'
  
  // Actions
  function setUser(user) {
    currentUser.value = user
  }
  
  function switchRole(role) {
    const user = mockUsers.find(u => u.role === role)
    if (user) {
      currentUser.value = user
    }
  }
  
  function logout() {
    isAuthenticated.value = false
    currentUser.value = null
  }
  
  return {
    currentUser,
    isAuthenticated,
    userRole,
    isSalesman,
    isOperator,
    isManager,
    canAccessLeads,
    canAccessOpportunities,
    canAccessReports,
    canAccessSettings,
    setUser,
    switchRole,
    logout
  }
})
