import { computed } from 'vue'

/**
 * Composable for TasksTableView filter definitions
 * Provides filter definitions for DataTable component
 * 
 * @param {Object} params - Parameters object
 * @param {import('vue').Ref<string>} params.typeFilter - Type filter ('all', 'lead', 'opportunity')
 * @param {import('vue').Ref<boolean>} params.showTypeFilter - Whether to show type filter
 * @param {Array} params.tasks - Tasks array for dynamic filter options
 * @returns {Object} Object containing filterDefinitions
 */
export function useTasksTableFilters({ typeFilter, showTypeFilter, tasks }) {
  const filterDefinitions = computed(() => {
    const defs = []
    
    // Type filter (only if showTypeFilter is true)
    if (showTypeFilter.value) {
      defs.push({
        key: 'type',
        label: 'Type',
        type: 'select',
        operators: [
          { value: 'eq', label: 'is' }
        ],
        options: [
          { value: 'lead', label: 'Lead' },
          { value: 'opportunity', label: 'Opportunity' }
        ],
        aiHint: 'Lead or Opportunity type',
        pinned: true
      })
    }
    
    // Status/Stage filter
    defs.push({
      key: 'status',
      label: 'Status',
      type: 'multiselect',
      operators: [
        { value: 'in', label: 'is any of' },
        { value: 'notIn', label: 'is none of' }
      ],
      options: [
        { value: 'Valid', label: 'Valid' },
        { value: 'Not valid', label: 'Not valid' },
        { value: 'Qualified', label: 'Qualified' },
        { value: 'In Negotiation', label: 'In Negotiation' },
        { value: 'Won', label: 'Won' },
        { value: 'Lost', label: 'Lost' },
        { value: 'Not interested', label: 'Not interested' },
        { value: 'Open', label: 'Open' },
        { value: 'Open Lead', label: 'Open Lead' }
      ],
      aiHint: 'Lead status or opportunity stage',
      pinned: true
    })
    
    // Priority filter
    defs.push({
      key: 'priority',
      label: 'Priority',
      type: 'select',
      operators: [
        { value: 'eq', label: 'is' }
      ],
      options: [
        { value: 'Hot', label: 'High' },
        { value: 'Normal', label: 'Normal' }
      ],
      aiHint: 'Task priority level'
    })
    
    // Urgency level filter (only for leads)
    if (typeFilter.value === 'lead') {
      defs.push({
        key: 'urgencyLevel',
        label: 'Urgency',
        type: 'select',
        operators: [
          { value: 'eq', label: 'is' }
        ],
        options: [
          { value: 'HOT', label: '🔥 Hot' },
          { value: 'WARM', label: '🟡 Warm' },
          { value: 'STANDARD', label: '🟢 Standard' },
          { value: 'COLD', label: '⚪ Cold' }
        ],
        aiHint: 'Lead urgency level based on scoring',
        pinned: true
      })
    }
    
    // Source filter
    defs.push({
      key: 'source',
      label: 'Source',
      type: 'multiselect',
      operators: [
        { value: 'in', label: 'is any of' },
        { value: 'notIn', label: 'is none of' }
      ],
      options: [
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Website', label: 'Website' },
        { value: 'Referral', label: 'Referral' },
        { value: 'Walk-in', label: 'Walk-in' }
      ],
      aiHint: 'Lead or opportunity source',
      pinned: true
    })
    
    // Assignee filter
    const uniqueAssignees = [...new Set(tasks.value.map(t => t.assignee).filter(Boolean))]
    if (uniqueAssignees.length > 0) {
      defs.push({
        key: 'assignee',
        label: 'Assignee',
        type: 'select',
        operators: [
          { value: 'eq', label: 'is' }
        ],
        options: uniqueAssignees.map(name => ({ value: name, label: name })),
        aiHint: 'Person assigned to the task',
        pinned: true
      })
    }
    
    // Requested car filter (for leads)
    const uniqueBrands = [...new Set(
      tasks.value
        .map(t => {
          const car = t.type === 'lead' ? t.requestedCar : t.vehicle
          return car?.brand
        })
        .filter(Boolean)
    )]
    if (uniqueBrands.length > 0) {
      defs.push({
        key: 'requestedCarBrand',
        label: 'Requested car',
        type: 'multiselect',
        operators: [
          { value: 'in', label: 'is any of' },
          { value: 'notIn', label: 'is none of' }
        ],
        options: uniqueBrands.map(brand => ({ value: brand, label: brand })),
        aiHint: 'Car brand requested by customer'
      })
    }
    
    // Creation date filter
    defs.push({
      key: 'createdAt',
      label: 'Creation date',
      type: 'daterange',
      operators: [
        { value: 'between', label: 'is between' },
        { value: 'gte', label: 'is after' },
        { value: 'lte', label: 'is before' }
      ],
      aiHint: 'Date when the task was created'
    })
    
    return defs
  })

  return {
    filterDefinitions
  }
}

