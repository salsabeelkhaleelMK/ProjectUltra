<template>
  <div class="mb-8">
    <div class="bg-white">
      <DataTable 
        :data="rows" 
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
        v-model:rowSelection="rowSelection"
        :paginationOptions="{
          rowCount: rows.length
        }"
        :globalFilterOptions="{
          debounce: 300,
          show: true
        }"
        class="h-full"
      >
        <template #empty-state>
          <div class="empty-state">
            <i class="fa-solid fa-inbox empty-state-icon"></i>
            <p class="empty-state-text">No records found</p>
          </div>
        </template>
        <template #batch-action-bar>
          <div v-if="hasSelection" class="flex items-center gap-2">
            <div class="flex items-center gap-2 mr-1">
              <div class="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-blue-600 text-white text-xs font-medium">
                {{ selectedCount }}
              </div>
              <span class="text-white text-fluid-sm font-medium whitespace-nowrap">Items selected</span>
            </div>
            <div class="h-4 w-px bg-greys-700"></div>
            <Button
              variant="ghost"
              size="sm"
              @click="handleBulkDelete"
            >
              <i class="fa-solid fa-trash mr-2"></i>
              Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              @click="clearSelection"
            >
              <i class="fa-solid fa-x mr-2"></i>
              Close
            </Button>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { DataTable } from '@motork/component-library/future/components'
import { Button } from '@motork/component-library/future/primitives'
import { useLeadsStore } from '@/stores/leads'
import { formatDueDate, formatDeadlineFull, getDeadlineStatus } from '@/utils/formatters'
import { useCustomersTable } from '@/composables/useCustomersTable'
import { useTableRowSelection } from '@/composables/useTableRowSelection'

const leadsStore = useLeadsStore()

const showDisqualified = ref(false)

// Row selection
const { rowSelection, selectedCount, hasSelection, getSelectedRows, clearSelection } = useTableRowSelection((row) => row.id)

// DataTable state management
const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

const globalFilter = ref('')
const sorting = ref([])
const columnFilters = ref([])

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const getStatusClass = (status) => {
  const statusMap = {
    'Valid': 'bg-green-100 text-green-700',
    'Not valid': 'bg-red-100 text-red-700',
    'Qualified': 'bg-surfaceSecondary text-body',
    'Not interested': 'bg-red-100 text-red-700',
    'Open': 'bg-blue-100 text-blue-700'
  }
  return statusMap[status] || 'bg-surfaceSecondary text-body'
}

const rows = computed(() => {
  let filteredLeads = leadsStore.leads
  if (showDisqualified.value) {
    filteredLeads = leadsStore.leads.filter(lead => lead.isDisqualified === true)
  } else {
    filteredLeads = leadsStore.leads.filter(lead => !lead.isDisqualified)
  }
  
  return filteredLeads.map((lead) => ({
    id: `lead-${lead.id}`,
    stageKey: 'open-leads',
    customer: lead.customer?.name || 'Unknown',
    email: lead.customer?.email || '',
    initials: lead.customer?.initials || lead.customer?.name?.slice(0,2).toUpperCase() || '?',
    nextAction: formatDueDate(lead.nextActionDue) || 'No due date',
    nextActionFull: formatDeadlineFull(lead.nextActionDue),
    deadlineStatus: getDeadlineStatus(lead.nextActionDue),
    car: `${lead.requestedCar?.brand || ''} ${lead.requestedCar?.model || ''}`.trim() || 'N/A',
    carStatus: lead.requestedCar?.stockDays !== undefined && lead.requestedCar?.stockDays !== null ? 'In Stock' : 'Out of Stock',
    carStatusClass: lead.requestedCar?.stockDays !== undefined && lead.requestedCar?.stockDays !== null ? 'bg-green-100 text-green-700' : 'bg-surfaceSecondary text-body',
    requestType: lead.requestedCar?.requestType || 'Quotation',
    source: lead.source || 'Marketing',
    assignee: lead.assignee,
    assigneeInitials: lead.assignee ? lead.assignee.slice(0,2).toUpperCase() : 'NA',
    createdAt: formatDate(lead.createdAt),
    lastActivity: formatDate(lead.lastActivity),
    status: lead.status,
    statusClass: getStatusClass(lead.status),
    priority: lead.priority || 'Normal'
  }))
})

const emit = defineEmits(['row-click'])

const handleRowClick = (row) => {
  if (row.id.startsWith('lead-')) {
    emit('row-click', row)
  }
}

const activeTab = ref('open-leads')
const { columns, filterDefinitions, tableMeta } = useCustomersTable(activeTab, handleRowClick)


// Bulk delete handler
const handleBulkDelete = () => {
  const selectedRows = getSelectedRows(rows.value)
  
  if (selectedRows.length === 0) return
  
  if (!confirm(`Are you sure you want to delete ${selectedRows.length} ${selectedRows.length === 1 ? 'lead' : 'leads'}?`)) {
    return
  }
  
  selectedRows.forEach(row => {
    const leadId = row.id.replace('lead-', '')
    leadsStore.deleteLead(leadId)
  })
  
  clearSelection()
}

// Load data on mount
onMounted(async () => {
  await leadsStore.fetchLeads()
})
</script>

<style scoped>
/* Component-specific styles only - global table styles are in main.css */

/* Avatar fallback - use greys-300 color */
:deep([data-radix-avatar-fallback]),
:deep(.avatar-fallback),
:deep(span[class*='AvatarFallback']) {
  background-color: #d4d4d4 !important;
}

/* Table border overrides - make borders very subtle (border-black/5) */
:deep(tbody tr) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}

:deep(tbody tr:last-child) {
  border-bottom: none !important;
}

/* Enable horizontal and vertical scrolling */
:deep([data-slot="table-container"]) {
  overflow-x: auto !important;
  overflow-y: auto !important;
  max-height: 600px !important;
}

:deep(table) {
  min-width: 100% !important;
}
</style>

