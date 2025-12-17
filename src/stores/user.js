import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockUsers } from '@/api/mockData'

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref(mockUsers[0]) // Default: Michael Thomas (salesman)
  const isAuthenticated = ref(true)
  
  // Getters
  const userRole = () => currentUser.value.role
  const isSalesman = () => currentUser.value.role === 'salesman'
  const isOperator = () => currentUser.value.role === 'operator'
  
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
    setUser,
    switchRole,
    logout
  }
})
