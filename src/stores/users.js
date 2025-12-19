import { defineStore } from 'pinia'
import { computed } from 'vue'
import { mockUsers } from '@/api/mockData'

export const useUsersStore = defineStore('users', () => {
  // Getters
  const allUsers = computed(() => mockUsers)
  
  const salespeople = computed(() => 
    mockUsers.filter(user => user.role === 'salesman')
  )
  
  const operators = computed(() => 
    mockUsers.filter(user => user.role === 'operator')
  )
  
  const managers = computed(() => 
    mockUsers.filter(user => user.role === 'manager')
  )
  
  // Get user by ID
  const getUserById = (id) => {
    return mockUsers.find(user => user.id === id)
  }
  
  // Get user by name
  const getUserByName = (name) => {
    return mockUsers.find(user => user.name === name)
  }
  
  // Get assignable users (all users for reassignment)
  const assignableUsers = computed(() => mockUsers)
  
  return {
    allUsers,
    salespeople,
    operators,
    managers,
    assignableUsers,
    getUserById,
    getUserByName
  }
})

