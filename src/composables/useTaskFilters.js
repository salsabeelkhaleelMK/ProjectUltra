import { computed } from 'vue'
import { useLeadsStore } from '@/stores/leads'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useUserStore } from '@/stores/user'
import { useSettingsStore } from '@/stores/settings'
import { getDisplayStage } from '@/utils/stageMapper'
import { calculateLeadUrgency } from '@/composables/useLeadUrgency'

/**
 * Composable for task filtering logic
 * Handles combining leads and opportunities, role-based filtering, and type filtering
 * @param {Ref<boolean>} showClosed - Ref to showClosed state
 */
export function useTaskFilters(showClosed) {
  const leadsStore = useLeadsStore()
  const opportunitiesStore = useOpportunitiesStore()
  const userStore = useUserStore()

  // Combine leads and opportunities with type property and composite key
  // Filter based on user role
  const allTasks = computed(() => {
    // Filter out disqualified leads (unless showClosed is enabled)
    const visibleLeads = showClosed.value 
      ? leadsStore.leads 
      : leadsStore.leads.filter(lead => !lead.isDisqualified)
    
    const leads = visibleLeads.map(lead => {
      // Calculate displayStage for lead
      const displayStage = getDisplayStage(lead, 'lead')
      
      // Ensure customer object is preserved
      const task = { 
        ...lead, 
        type: 'lead', 
        compositeId: `lead-${lead.id}`,
        displayStage
      }
      // Explicitly ensure customer is present
      if (!task.customer && lead.customer) {
        task.customer = lead.customer
      }
      return task
    })
    
    const opportunities = opportunitiesStore.opportunities.map(opp => {
      // Ensure customer object is preserved
      const task = { ...opp, type: 'opportunity', compositeId: `opportunity-${opp.id}` }
      // Explicitly ensure customer is present
      if (!task.customer && opp.customer) {
        task.customer = opp.customer
      }
      return task
    })
    
    // Filter by role
    let tasks = []
    if (userStore.isOperator()) {
      // Operators only see leads
      tasks = leads
    } else if (userStore.isSalesman()) {
      // Salesmen only see opportunities
      tasks = opportunities
    } else {
      // Managers see everything
      tasks = [...leads, ...opportunities]
    }
    
    return tasks
  })

  // Filter tasks by type
  const filterByType = (tasks, typeFilter) => {
    if (typeFilter === 'all') return tasks
    return tasks.filter(task => task.type === typeFilter)
  }

  // Check if user has both leads and opportunities (only show filter if they have both types)
  const shouldShowTypeFilter = computed(() => {
    const hasLeads = allTasks.value.some(task => task.type === 'lead')
    const hasOpportunities = allTasks.value.some(task => task.type === 'opportunity')
    return hasLeads && hasOpportunities
  })

  return {
    allTasks,
    filterByType,
    shouldShowTypeFilter
  }
}

