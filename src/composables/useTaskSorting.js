import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useUsersStore } from '@/stores/users'
import { useSettingsStore } from '@/stores/settings'
import { calculateLeadUrgency } from '@/composables/useLeadUrgency'

/**
 * Composable for task sorting logic
 * Handles sorting tasks by urgency, assignment, date, etc.
 */
export function useTaskSorting() {
  const userStore = useUserStore()
  const usersStore = useUsersStore()
  const settingsStore = useSettingsStore()

  /**
   * Sort tasks based on sort option
   * @param {Array} tasks - Tasks to sort
   * @param {string} sortOption - Sort option: 'none', 'urgent-first', 'assigned-to-me', 'assigned-to-my-team'
   * @returns {Array} Sorted tasks
   */
  const sortTasks = (tasks, sortOption) => {
    if (sortOption === 'none') {
      // Default: sort by lastActivity or createdAt (most recent first)
      return [...tasks].sort((a, b) => {
        const dateA = new Date(a.lastActivity || a.createdAt || 0)
        const dateB = new Date(b.lastActivity || b.createdAt || 0)
        return dateB - dateA
      })
    }

    if (sortOption === 'urgent-first') {
      const urgencyEnabled = settingsStore.getSetting('urgencyEnabled') !== false
      
      if (urgencyEnabled) {
        // Calculate urgency scores for leads
        const tasksWithUrgency = tasks.map(task => {
          if (task.type === 'lead' && !task.urgencyScore) {
            const urgencyResult = calculateLeadUrgency(task)
            return {
              ...task,
              urgencyScore: urgencyResult.score,
              urgencyLevel: urgencyResult.level
            }
          }
          return task
        })

        // Sort: leads by urgency score DESC, then by createdAt DESC (tiebreaker)
        return [...tasksWithUrgency].sort((a, b) => {
          // If both are leads, sort by urgency score
          if (a.type === 'lead' && b.type === 'lead') {
            const scoreA = a.urgencyScore || 0
            const scoreB = b.urgencyScore || 0
            if (scoreA !== scoreB) {
              return scoreB - scoreA // Higher score first
            }
            // Tiebreaker: most recent first
            const dateA = new Date(a.createdAt || 0)
            const dateB = new Date(b.createdAt || 0)
            return dateB - dateA
          }
          // If one is lead and one is opportunity, leads come first when urgency sorting
          if (a.type === 'lead' && b.type === 'opportunity') return -1
          if (a.type === 'opportunity' && b.type === 'lead') return 1
          // Both opportunities: use priority then date
          if (a.priority === 'Hot' && b.priority !== 'Hot') return -1
          if (a.priority !== 'Hot' && b.priority === 'Hot') return 1
          const dateA = new Date(a.lastActivity || a.createdAt || 0)
          const dateB = new Date(b.lastActivity || b.createdAt || 0)
          return dateB - dateA
        })
      } else {
        // Fallback to priority-based sorting if urgency disabled
        return [...tasks].sort((a, b) => {
          // Hot priority first
          if (a.priority === 'Hot' && b.priority !== 'Hot') return -1
          if (a.priority !== 'Hot' && b.priority === 'Hot') return 1
          // Then by date (most recent first)
          const dateA = new Date(a.lastActivity || a.createdAt || 0)
          const dateB = new Date(b.lastActivity || b.createdAt || 0)
          return dateB - dateA
        })
      }
    }

    if (sortOption === 'assigned-to-me') {
      // Filter to only tasks assigned to current user
      const currentUserName = userStore.currentUser.name
      const filtered = tasks.filter(task => task.assignee === currentUserName)
      // Then sort by date
      return [...filtered].sort((a, b) => {
        const dateA = new Date(a.lastActivity || a.createdAt || 0)
        const dateB = new Date(b.lastActivity || b.createdAt || 0)
        return dateB - dateA
      })
    }

    if (sortOption === 'assigned-to-my-team') {
      // Filter to tasks assigned to user's team
      const currentUser = userStore.currentUser
      // Get team members based on role
      let teamMemberNames = []
      if (currentUser.role === 'manager') {
        // Managers see all users
        teamMemberNames = usersStore.users.map(u => u.name)
      } else if (currentUser.role === 'salesman') {
        // Salesmen see Sales team (other salesmen)
        teamMemberNames = usersStore.users.filter(u => u.role === 'salesman').map(u => u.name)
      } else if (currentUser.role === 'operator') {
        // Operators see BDC team (other operators)
        teamMemberNames = usersStore.users.filter(u => u.role === 'operator').map(u => u.name)
      }
      const filtered = tasks.filter(task => teamMemberNames.includes(task.assignee))
      // Then sort by date
      return [...filtered].sort((a, b) => {
        const dateA = new Date(a.lastActivity || a.createdAt || 0)
        const dateB = new Date(b.lastActivity || b.createdAt || 0)
        return dateB - dateA
      })
    }

    return tasks
  }

  return {
    sortTasks
  }
}


