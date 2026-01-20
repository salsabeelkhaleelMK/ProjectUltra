import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as usersApi from '@/api/users'

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref(null)
  const isAuthenticated = ref(false)
  
  // Initialize with default user
  const initializeUser = async () => {
    const users = await usersApi.fetchUsers()
    currentUser.value = users[0] // Default: First user (Salsabeel Khaleel - manager)
    isAuthenticated.value = true
  }
  
  // Auto-initialize on store creation
  initializeUser()
  
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
  
  async function switchRole(role) {
    const user = await usersApi.fetchUserByRole(role)
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
