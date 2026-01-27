import { ref, computed, h } from 'vue'
import { Checkbox } from '@motork/component-library/future/primitives'

/**
 * Composable for DataTable row selection functionality
 * Provides checkbox column, row selection state, and bulk action helpers
 * 
 * @param {Function} getRowId - Function to get unique ID for each row (default: (row) => row.id)
 * @returns {Object} Object containing selection column, state, and helpers
 */
export function useTableRowSelection(getRowId = (row) => row.id) {
  const rowSelection = ref({})

  // Create checkbox column for TanStack Table
  // This column will be inserted at the beginning of the columns array
  const createSelectionColumn = () => {
    return {
      id: 'select',
      header: ({ table }) => {
        const isAllSelected = table.getIsAllRowsSelected()
        const isSomeSelected = table.getIsSomeRowsSelected()
        
        return h('div', { class: 'flex items-center justify-center' }, [
          h(Checkbox, {
            checked: isAllSelected,
            indeterminate: isSomeSelected && !isAllSelected,
            onUpdate: (checked) => {
              if (checked) {
                table.toggleAllRowsSelected(true)
              } else {
                table.toggleAllRowsSelected(false)
              }
            },
            'aria-label': 'Select all rows'
          })
        ])
      },
      cell: ({ row }) => {
        return h('div', { class: 'flex items-center justify-center' }, [
          h(Checkbox, {
            checked: row.getIsSelected(),
            onUpdate: (checked) => {
              row.toggleSelected(checked)
            },
            onClick: (e) => {
              e.stopPropagation() // Prevent row click when clicking checkbox
            },
            'aria-label': `Select row ${getRowId(row.original)}`
          })
        ])
      },
      enableSorting: false,
      enableHiding: false,
      size: 50,
      meta: {
        title: 'Select'
      }
    }
  }

  // Get selected row IDs
  const selectedRowIds = computed(() => {
    return Object.keys(rowSelection.value).filter(key => rowSelection.value[key])
  })

  // Get count of selected rows
  const selectedCount = computed(() => {
    return selectedRowIds.value.length
  })

  // Check if any rows are selected
  const hasSelection = computed(() => {
    return selectedCount.value > 0
  })

  // Clear all selections
  const clearSelection = () => {
    rowSelection.value = {}
  }

  // Get selected rows from data array
  const getSelectedRows = (data) => {
    if (!data || !Array.isArray(data)) return []
    return data.filter(row => {
      const id = String(getRowId(row))
      return rowSelection.value[id] === true
    })
  }

  return {
    // State
    rowSelection,
    
    // Column definition
    createSelectionColumn,
    
    // Computed
    selectedRowIds,
    selectedCount,
    hasSelection,
    
    // Methods
    clearSelection,
    getSelectedRows
  }
}
