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
import { useOpportunitiesStore } from '@/stores/opportunities'
import { formatDueDate, formatDeadlineFull, getDeadlineStatus } from '@/utils/formatters'
import { useCustomersTable } from '@/composables/useCustomersTable'
import { getDisplayStage } from '@/utils/stageMapper'
import { useTableRowSelection } from '@/composables/useTableRowSelection'

const opportunitiesStore = useOpportunitiesStore()

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

const rows = computed(() => {
  return opportunitiesStore.opportunities
    .filter(opp => opp.stage === 'Closed Won')
    .map((opp) => {
      const lastAppointment = opp.scheduledAppointment?.start || null
      return {
        id: `opp-${opp.id}`,
        stageKey: 'won',
        customer: opp.customer?.name || 'Unknown',
        email: opp.customer?.email || '',
        initials: opp.customer?.initials || opp.customer?.name?.slice(0,2).toUpperCase() || '?',
        nextAction: formatDueDate(opp.expectedCloseDate) || 'No due date',
        nextActionFull: formatDeadlineFull(opp.expectedCloseDate),
        deadlineStatus: getDeadlineStatus(opp.expectedCloseDate),
        car: `${opp.vehicle?.brand || ''} ${opp.vehicle?.model || ''}`.trim() || 'N/A',
        carStatus: opp.vehicle?.stockDays !== undefined && opp.vehicle?.stockDays !== null ? 'In Stock' : 'Out of Stock',
        carStatusClass: opp.vehicle?.stockDays !== undefined && opp.vehicle?.stockDays !== null ? 'bg-green-100 text-green-700' : 'bg-surfaceSecondary text-body',
        requestType: opp.requestType || 'Opportunity',
        source: opp.source || 'Marketing',
        assignee: opp.assignee,
        assigneeInitials: opp.assignee ? opp.assignee.slice(0,2).toUpperCase() : 'NA',
        createdAt: formatDate(opp.createdAt),
        lastAppointment: lastAppointment ? formatDate(lastAppointment) : 'N/A',
        status: getDisplayStage(opp, 'opportunity'),
        statusClass: 'bg-green-100 text-green-700',
        priority: opp.priority || 'Normal'
      }
    })
})

const emit = defineEmits(['row-click'])

const handleRowClick = (row) => {
  if (row.id.startsWith('opp-')) {
    emit('row-click', row)
  }
}

const activeTab = ref('won')
const { columns, filterDefinitions, tableMeta } = useCustomersTable(activeTab, handleRowClick)


// Bulk delete handler
const handleBulkDelete = () => {
  const selectedRows = getSelectedRows(rows.value)
  
  if (selectedRows.length === 0) return
  
  if (!confirm(`Are you sure you want to delete ${selectedRows.length} ${selectedRows.length === 1 ? 'opportunity' : 'opportunities'}?`)) {
    return
  }
  
  selectedRows.forEach(row => {
    const oppId = row.id.replace('opp-', '')
    opportunitiesStore.deleteOpportunity(oppId)
  })
  
  clearSelection()
}

// Load data on mount
onMounted(async () => {
  await opportunitiesStore.fetchOpportunities()
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

