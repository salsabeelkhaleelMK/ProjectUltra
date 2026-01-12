<template>
  <div class="page-container flex-1 flex flex-col overflow-hidden min-w-0">
    <!-- Header -->
    <PageHeader title="Tasks" subtitle="Manage your leads and opportunities">
      <template #actions>
        <!-- View Toggle -->
        <ViewToggle
          :view="viewMode"
          :options="[
            { value: 'card', icon: 'fa-solid fa-list', label: 'Cards' },
            { value: 'table', icon: 'fa-solid fa-table', label: 'Table' }
          ]"
          @update:view="$emit('view-change', $event)"
        />
      </template>
    </PageHeader>
    
    <!-- Content -->
    <div class="flex-1 overflow-y-auto p-4 md:p-8">
      <!-- Table Container -->
      <div class="table-wrapper w-full">
        <DataTable 
          :data="filteredTasks" 
          :columns="columns"
          :meta="tableMeta"
          @row-click="handleRowClick"
          :columnFiltersOptions="{
            filterDefs: filterDefinitions
          }"
          v-model:pagination="pagination"
          v-model:globalFilter="globalFilter"
          v-model:sorting="sorting"
          v-model:columnFilters="columnFilters"
          :paginationOptions="{
            rowCount: filteredTasks.length
          }"
          :globalFilterOptions="{
            debounce: 300,
            placeholder: 'Q Search or ask a question'
          }"
        >
          <template #empty-state>
            <div class="empty-state">
              <i class="fa-solid fa-tasks empty-state-icon"></i>
              <p class="empty-state-text">No tasks found</p>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h, watch, nextTick } from 'vue'
import PageHeader from '@/components/layout/PageHeader.vue'
import ViewToggle from '@/components/shared/ViewToggle.vue'
import { DataTable } from '@motork/component-library/future/components'
import { formatCurrency, formatDeadlineFull, getDeadlineStatus } from '@/utils/formatters'

const props = defineProps({
  tasks: { type: Array, required: true },
  currentTaskId: { type: String, default: null },
  highlightId: { type: String, default: null },
  typeFilter: { type: String, default: 'all' },
  sortOption: { type: String, default: 'recent-first' },
  showTypeFilter: { type: Boolean, default: true },
  showMobileClose: { type: Boolean, default: false },
  openMenuId: { type: [Number, String], default: null },
  searchPlaceholder: { type: String, default: 'Search tasks...' },
  getVehicleType: { type: Function, required: true },
  getVehicleTypeBadgeClass: { type: Function, required: true },
  getOwnerInfo: { type: Function, required: true },
  getStageBadgeClass: { type: Function, required: true },
  viewMode: {
    type: String,
    default: 'table'
  }
})

const emit = defineEmits(['select', 'menu-click', 'menu-close', 'filter-change', 'sort-change', 'reassign', 'close', 'view-change'])

const searchQuery = ref('')

// DataTable state management
const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

const globalFilter = ref('')
const sorting = ref([])
const columnFilters = ref([])
const columnVisibility = ref({})

// Filter definitions for AI-powered filtering
const filterDefinitions = computed(() => {
  const defs = []
  
  // Type filter (only if showTypeFilter is true)
  if (props.showTypeFilter) {
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
      aiHint: 'Lead or Opportunity type'
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
    aiHint: 'Lead status or opportunity stage'
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
    aiHint: 'Lead or opportunity source'
  })
  
  // Assignee filter
  const uniqueAssignees = [...new Set(props.tasks.map(t => t.assignee).filter(Boolean))]
  if (uniqueAssignees.length > 0) {
    defs.push({
      key: 'assignee',
      label: 'Assignee',
      type: 'select',
      operators: [
        { value: 'eq', label: 'is' }
      ],
      options: uniqueAssignees.map(name => ({ value: name, label: name })),
      aiHint: 'Person assigned to the task'
    })
  }
  
  // Requested car filter (for leads)
  const uniqueBrands = [...new Set(
    props.tasks
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

// Sync searchQuery with globalFilter for DataTable
const filteredTasks = computed(() => {
  // DataTable handles filtering via globalFilter, so we can return all tasks
  // The searchQuery is kept for backward compatibility but DataTable uses globalFilter
  return props.tasks
})

const isSelected = (task) => {
  // Check both currentTaskId (when task detail is shown) and highlightId (when switching from card to table)
  return task.compositeId === props.currentTaskId || task.compositeId === props.highlightId
}

const getVehicleInfo = (task) => {
  if (task.type === 'lead') {
    return task.requestedCar ? `${task.requestedCar.brand} ${task.requestedCar.model}` : 'No vehicle specified'
  }
  return task.vehicle ? `${task.vehicle.brand} ${task.vehicle.model}` : 'No vehicle specified'
}

const getDateDisplay = (date) => {
  if (!date) return 'Not set'
  
  const now = new Date()
  const dueDate = new Date(date)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const due = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())
  
  const diffTime = due - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`
  
  return formatDeadlineFull(date)
}

// Helper function to get car status
const getCarStatus = (task) => {
  const vehicle = task.type === 'lead' ? task.requestedCar : task.vehicle
  if (!vehicle) return { status: 'N/A', class: 'bg-gray-100 text-gray-700' }
  const isInStock = vehicle.stockDays !== undefined && vehicle.stockDays !== null
  return {
    status: isInStock ? 'In Stock' : 'Out of Stock',
    class: isInStock ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
  }
}

// Helper function to get request type
const getRequestType = (task) => {
  if (task.type === 'lead') {
    return task.requestedCar?.requestType || task.requestType || 'N/A'
  }
  return task.requestType || 'Opportunity'
}

// DataTable columns configuration
const columns = computed(() => [
  {
    accessorKey: 'type',
    header: 'Task type',
    meta: {
      title: 'Task type',
      onOpen: (row) => handleRowClick(row.original)
    },
    cell: ({ row }) => {
      const task = row.original
      const typeClass = task.type === 'lead' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
      return h('span', {
        class: `inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${typeClass}`
      }, task.type === 'lead' ? 'Lead' : 'Opportunity')
    }
  },
  {
    accessorKey: 'customer',
    header: 'Customer',
    meta: {
      title: 'Customer'
    },
    cell: ({ row }) => {
      const task = row.original
      return h('div', { class: 'flex items-center gap-2 md:gap-3' }, [
        h('div', {
          class: `w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${task.type === 'lead' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`
        }, task.customer.initials),
        h('div', { class: 'min-w-0' }, [
          h('div', { class: 'text-sm font-semibold text-gray-900 truncate max-w-[120px] md:max-w-none' }, task.customer.name),
          h('div', { class: 'text-xs text-gray-500 truncate hidden sm:block' }, task.customer.email)
        ])
      ])
    }
  },
  {
    accessorKey: 'car',
    header: 'Car',
    meta: {
      title: 'Car'
    },
    cell: ({ row }) => {
      const task = row.original
      const vehicleInfo = getVehicleInfo(task)
      if (vehicleInfo === 'No vehicle specified') {
        return h('span', { class: 'text-sm text-gray-400' }, 'N/A')
      }
      return h('div', { class: 'flex items-center gap-2' }, [
        h('i', { class: 'fa-brands fa-volkswagen text-gray-400 text-sm' }),
        h('span', { class: 'text-sm font-medium text-gray-900 truncate max-w-[120px]' }, vehicleInfo)
      ])
    }
  },
  {
    accessorKey: 'carStatus',
    header: 'Car status',
    meta: {
      title: 'Car status'
    },
    cell: ({ row }) => {
      const task = row.original
      const carStatus = getCarStatus(task)
      return h('span', {
        class: `inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${carStatus.class}`
      }, carStatus.status)
    }
  },
  {
    accessorKey: 'requestType',
    header: 'Request type',
    meta: {
      title: 'Request type'
    },
    cell: ({ row }) => {
      const task = row.original
      const requestType = getRequestType(task)
      return h('span', { class: 'text-sm text-gray-600' }, requestType)
    }
  },
  {
    accessorKey: 'source',
    header: 'Source',
    meta: {
      title: 'Source'
    },
    cell: ({ row }) => {
      const task = row.original
      return h('span', {
        class: 'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700'
      }, task.source || 'N/A')
    }
  },
  {
    accessorKey: 'assignee',
    header: 'Assignee',
    meta: {
      title: 'Assignee'
    },
    cell: ({ row }) => {
      const task = row.original
      const owner = props.getOwnerInfo(task)
      return h('div', { class: 'flex items-center gap-2' }, [
        h('div', {
          class: 'w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 shrink-0'
        }, owner.initials),
        h('span', { class: 'text-sm text-gray-600 truncate max-w-[80px]' }, owner.name)
      ])
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    meta: {
      title: 'Status'
    },
    cell: ({ row }) => {
      const task = row.original
      const stageStatus = task.type === 'lead' ? task.status : (task.displayStage || task.stage)
      const stageClass = props.getStageBadgeClass(stageStatus)
      return h('span', {
        class: `inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${stageClass}`
      }, stageStatus)
    }
  },
  {
    id: 'actions',
    header: '',
    meta: {
      title: 'Actions'
    },
    cell: ({ row }) => {
      const task = row.original
      return h('button', {
        class: 'text-gray-400 hover:text-gray-600',
        onClick: (e) => {
          e.stopPropagation()
          emit('menu-click', task.id)
        }
      }, [
        h('i', { class: 'fa-solid fa-ellipsis-vertical' })
      ])
    }
  }
])

const handleRowClick = (record) => {
  emit('select', record.compositeId)
}

// Table meta with row click handler and highlighting
const tableMeta = computed(() => ({
  class: {
    tr: (row) => {
      const baseClasses = 'cursor-pointer hover:bg-gray-50 transition-colors'
      const task = row.original
      if (isSelected(task)) {
        // Highlight selected/highlighted row with a subtle background and border
        return `${baseClasses} bg-blue-50 border-l-4 border-l-blue-500`
      }
      return baseClasses
    }
  }
}))

// Scroll highlighted row into view when table loads or highlightId changes
watch(() => [props.highlightId, props.tasks], async ([newHighlightId]) => {
  if (newHighlightId && props.tasks.length > 0) {
    await nextTick()
    // Wait for DataTable to render, then find and scroll to the highlighted row
    setTimeout(() => {
      try {
        const tableWrapper = document.querySelector('.table-wrapper')
        if (!tableWrapper) return
        
        // Find the task in the data
        const highlightedTask = props.tasks.find(t => t.compositeId === newHighlightId)
        if (!highlightedTask) return
        
        // Try to find the row by searching for customer name or other unique identifier
        // DataTable likely renders rows with the customer name, so we can search for that
        const customerName = highlightedTask.customer?.name
        if (customerName) {
          // Find all table rows
          const rows = tableWrapper.querySelectorAll('tbody tr, [role="row"]')
          for (const row of rows) {
            // Check if row exists and is still in the DOM before accessing properties
            if (row && row.parentNode && row.textContent?.includes(customerName)) {
              row.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
              break
            }
          }
        }
      } catch (error) {
        // Silently handle DOM access errors (element might have been removed)
        console.debug('Could not scroll to highlighted row:', error)
      }
    }, 500)
  }
}, { immediate: true })
</script>


