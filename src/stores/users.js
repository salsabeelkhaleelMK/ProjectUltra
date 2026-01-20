import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as usersApi from '@/api/users'
import { calendarTeams } from '@/api/mockData' // TODO: Create teams API wrapper

export const useUsersStore = defineStore('users', () => {
  // State
  const users = ref([])
  const loading = ref(false)
  
  // Teams list (still using mockData until teams API is created)
  const teams = computed(() => calendarTeams)
  
  // Fetch users from API
  const fetchUsers = async () => {
    loading.value = true
    try {
      users.value = await usersApi.fetchUsers()
    } catch (error) {
      console.error('Failed to fetch users:', error)
      users.value = []
    } finally {
      loading.value = false
    }
  }
  
  // Auto-fetch users on store creation
  fetchUsers()
  
  // Get user by ID
  const getUserById = (id) => {
    return users.value.find(u => u.id === id)
  }
  
  // Get team by ID
  const getTeamById = (id) => {
    return teams.value.find(t => t.id === id)
  }
  
  // Assignable users (all users)
  const assignableUsers = computed(() => users.value)
  
  // Assignable teams (all teams)
  const assignableTeams = computed(() => teams.value)
  
  // Mixed assignees (users + teams) for dropdowns
  const mixedAssignees = computed(() => {
    const teamItems = teams.value.map(team => ({
      ...team,
      type: 'team',
      icon: 'fa-users',
      label: team.name
    }))
    
    const userItems = users.value.map(user => ({
      ...user,
      type: 'user',
      icon: 'fa-user',
      label: user.name
    }))
    
    return [...teamItems, ...userItems]
  })

  return {
    users,
    teams,
    getUserById,
    getTeamById,
    assignableUsers,
    assignableTeams,
    mixedAssignees
  }
})
