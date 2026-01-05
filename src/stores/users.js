import { defineStore } from 'pinia'
import { computed } from 'vue'
import { mockUsers, calendarTeams } from '@/api/mockData'

export const useUsersStore = defineStore('users', () => {
  // Users list
  const users = computed(() => mockUsers)
  
  // Teams list
  const teams = computed(() => calendarTeams)
  
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
