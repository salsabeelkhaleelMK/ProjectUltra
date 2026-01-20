<template>
  <div class="page-container flex-1 flex flex-col overflow-hidden min-w-0">
    <!-- Header: Title + View Toggle + Show Closed -->
    <header class="page-header shrink-0">
      <div class="page-header-main">
        <div class="page-header-content">
          <div class="page-header-title-container">
            <h1 class="page-header-title">Tasks</h1>
          </div>
          
          <!-- Right Actions: View Toggle + Show Closed -->
          <div class="page-header-actions">
            <!-- View Toggle -->
            <div class="bg-white border border-black/5 p-0.5 rounded-lg inline-flex gap-0.5">
              <button
                @click="$emit('view-change', 'table')"
                :class="[
                  'h-7 px-2.5 rounded-md transition-all flex items-center justify-center',
                  viewMode === 'table' 
                    ? 'bg-brand-gray text-heading shadow-sm' 
                    : 'text-sub hover:text-heading'
                ]"
                title="Table View"
              >
                <Table :size="14" />
              </button>
              <button
                @click="$emit('view-change', 'card')"
                :class="[
                  'h-7 px-2.5 rounded-md transition-all flex items-center justify-center',
                  viewMode === 'card' 
                    ? 'bg-brand-gray text-heading shadow-sm' 
                    : 'text-sub hover:text-heading'
                ]"
                title="Card View"
              >
                <LayoutGrid :size="14" />
              </button>
            </div>
            
            <!-- Show Closed Toggle -->
            <button
              @click="$emit('toggle-closed', !showClosed)"
              class="group flex items-center gap-2 rounded-2xl border border-E5E7EB px-3 py-1.5 bg-surface text-fluid-sm font-medium text-body hover:border-red-100 hover:bg-red-50 hover:text-brand-red transition-all"
            >
              <i class="fa-solid fa-eye-slash text-sub group-hover:text-brand-red"></i>
              <span class="hidden sm:inline">Show Closed</span>
            </button>
          </div>
        </div>
      </div>
    </header>
    
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
          <template #toolbar>
            <div class="flex justify-end">
              <button 
                class="group flex items-center gap-2 rounded-2xl border border-E5E7EB px-4 py-2 text-sm font-medium text-body hover:border-purple-100 hover:bg-purple-50 hover:text-purple-600 transition-all"
              >
                <i class="fa-solid fa-arrow-left text-sub group-hover:text-purple-500"></i>
                <span class="hidden sm:inline">Switch back to old design</span>
              </button>
            </div>
          </template>
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
import { ref, computed, h } from 'vue'
import { Table, LayoutGrid } from 'lucide-vue-next'
import { DataTable } from '@motork/component-library/future/components'
import { formatCurrency, formatDeadlineFull, getDeadlineStatus } from '@/utils/formatters'
import { calculateLeadUrgency, getUrgencyIcon, getUrgencyColorClass } from '@/composables/useLeadUrgency'
import { useSettingsStore } from '@/stores/settings'
import { useTasksTableFilters } from '@/composables/useTasksTableFilters'

const props = defineProps({
  tasks: { type: Array, required: true },
  currentTaskId: { type: String, default: null },
  highlightId: { type: String, default: null },
  typeFilter: { type: String, default: 'all' },
  sortOption: { type: String, default: 'recent-first' },
  showTypeFilter: { type: Boolean, default: true },
  showClosed: { type: Boolean, default: false },
  showMobileClose: { type: Boolean, default: false },
  openMenuId: { type: [Number, String], default: null },
  searchPlaceholder: { type: String, default: 'Search tasks...' },
  viewMode: { type: String, default: 'table' },
  getVehicleType: { type: Function, required: true },
  getVehicleTypeBadgeClass: { type: Function, required: true },
  getOwnerInfo: { type: Function, required: true },
  getStageBadgeClass: { type: Function, required: true }
})

const emit = defineEmits(['select', 'menu-click', 'menu-close', 'filter-change', 'sort-change', 'toggle-closed', 'reassign', 'close', 'view-change'])

const settingsStore = useSettingsStore()
const searchQuery = ref('')

// DataTable state management
const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

const globalFilter = ref('')
const sorting = ref([])
const columnFilters = ref([
  { id: 'status', value: ['Valid', 'Qualified', 'Open Lead'], operator: 'in' },
  { id: 'type', value: 'lead', operator: 'eq' },
  { id: 'source', value: ['Marketing', 'Website'], operator: 'in' },
  { id: 'assignee', value: undefined },
  { id: 'urgencyLevel', value: undefined }
])
const columnVisibility = ref({})

// Use filter definitions composable
const { filterDefinitions } = useTasksTableFilters({
  typeFilter: computed(() => props.typeFilter),
  showTypeFilter: computed(() => props.showTypeFilter),
  tasks: computed(() => props.tasks)
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
  // For opportunities: prefer vehicle over requestedCar
  const vehicle = task.vehicle || task.requestedCar
  return vehicle ? `${vehicle.brand} ${vehicle.model}` : 'No vehicle specified'
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
  if (!vehicle) return { status: 'N/A', class: 'bg-surfaceSecondary text-body' }
  const isInStock = vehicle.stockDays !== undefined && vehicle.stockDays !== null
  return {
    status: isInStock ? 'In Stock' : 'Out of Stock',
    class: isInStock ? 'bg-green-100 text-green-700' : 'bg-surfaceSecondary text-body'
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
          h('div', { class: 'text-content font-semibold text-heading truncate max-w-[7.5rem] md:max-w-none' }, task.customer.name),
          h('div', { class: 'text-meta truncate hidden sm:block' }, task.customer.email)
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
        return h('span', { class: 'text-meta' }, 'N/A')
      }
      return h('div', { class: 'flex items-center gap-2' }, [
        h('i', { class: 'fa-brands fa-volkswagen text-sub text-sm' }),
        h('span', { class: 'text-content font-medium text-heading truncate max-w-[7.5rem]' }, vehicleInfo)
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
      return h('span', { class: 'text-meta' }, requestType)
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
        class: 'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-surfaceSecondary text-body'
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
          class: 'w-6 h-6 rounded-full bg-surfaceSecondary flex items-center justify-center text-xs font-bold text-body shrink-0'
        }, owner.initials),
        h('span', { class: 'text-meta truncate max-w-20' }, owner.name)
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
  // Urgency level column (only show for leads when urgency is enabled)
  ...(props.typeFilter === 'lead' && settingsStore.getSetting('urgencyEnabled') !== false ? [{
    id: 'urgencyLevel',
    accessorKey: 'urgencyLevel',
    header: 'Urgency',
    meta: {
      title: 'Urgency'
    },
    cell: ({ row }) => {
      const task = row.original
      if (task.type !== 'lead') {
        return h('span', { class: 'text-meta' }, '—')
      }
      
      // Calculate urgency if not already calculated
      let urgencyLevel = task.urgencyLevel
      if (!urgencyLevel) {
        const urgencyResult = calculateLeadUrgency(task)
        urgencyLevel = urgencyResult.level
      }
      
      const colorClass = getUrgencyColorClass(urgencyLevel)
      const icon = getUrgencyIcon(urgencyLevel)
      
      return h('span', {
        class: `inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border ${colorClass}`
      }, [
        h('span', {}, icon),
        h('span', {}, urgencyLevel)
      ])
    }
  }] : []),
  {
    id: 'actions',
    header: '',
    meta: {
      title: 'Actions'
    },
    cell: ({ row }) => {
      const task = row.original
      return h('button', {
        class: 'text-sub hover:text-body',
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
  // Set search filter to task ID to highlight the clicked record
  globalFilter.value = String(record.id)
  
  emit('select', record.compositeId)
}

// Table meta with row click handler and highlighting
const tableMeta = computed(() => ({
  class: {
    tr: (row) => {
      const baseClasses = 'cursor-pointer hover:bg-surfaceSecondary transition-colors'
      const task = row.original
      if (isSelected(task)) {
        // Highlight selected/highlighted row with a subtle background and border
        return `${baseClasses} bg-blue-50 border-l-4 border-l-blue-500`
      }
      return baseClasses
    }
  }
}))

</script>


