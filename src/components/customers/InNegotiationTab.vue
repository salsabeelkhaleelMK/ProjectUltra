<template>
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
    :paginationOptions="{
      rowCount: rows.length
    }"
    :globalFilterOptions="{
      debounce: 300
    }"
    class="h-full"
  >
    <template #empty-state>
      <div class="empty-state">
        <i class="fa-solid fa-inbox empty-state-icon"></i>
        <p class="empty-state-text">No records found</p>
      </div>
    </template>
  </DataTable>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { DataTable } from '@motork/component-library/future/components'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { formatDueDate, formatDeadlineFull, getDeadlineStatus } from '@/utils/formatters'
import { useCustomersTable } from '@/composables/useCustomersTable'

const opportunitiesStore = useOpportunitiesStore()

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
    .filter(opp => 
      opp.stage === 'In Negotiation' || opp.stage === 'In negotiation'
    )
    .map((opp) => {
      const lastAppointment = opp.scheduledAppointment?.start || null
      return {
        id: `opp-${opp.id}`,
        stageKey: 'in-negotiation',
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
        status: opp.stage,
        statusClass: 'bg-orange-100 text-orange-700',
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

const activeTab = ref('in-negotiation')
const { columns, filterDefinitions, tableMeta } = useCustomersTable(activeTab, handleRowClick)

// Load data on mount
onMounted(async () => {
  await opportunitiesStore.fetchOpportunities()
})
</script>

<style scoped>
/* DataTable styling overrides to match reference design */
:deep(thead),
:deep(thead th),
:deep(thead tr),
:deep(thead tr th) {
  background-color: transparent !important;
  background: transparent !important;
  border-color: rgba(0, 0, 0, 0.05) !important;
}

:deep(div[data-slot='frame-panel'].relative.bg-clip-padding) {
  background-color: rgba(245, 245, 245, 1) !important;
  border-top-left-radius: 10px !important;
  border-top-right-radius: 10px !important;
}

:deep(footer.flex.items-center.justify-between) {
  background-color: rgba(245, 245, 245, 1) !important;
  border-bottom-left-radius: 10px !important;
  border-bottom-right-radius: 10px !important;
}

:deep([data-radix-avatar-fallback]),
:deep(.avatar-fallback),
:deep(span[class*='AvatarFallback']) {
  background-color: #d4d4d4 !important;
}

/* Table border overrides - make borders very subtle */
:deep(table),
:deep(tbody),
:deep(tbody tr),
:deep(tbody td),
:deep(thead),
:deep(thead th) {
  border-color: rgba(0, 0, 0, 0.05) !important;
}

:deep(tbody tr) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
}

:deep(tbody tr:last-child) {
  border-bottom: none !important;
}

/* Remove any dark borders from table container */
:deep([data-slot="table-container"]),
:deep(.table-wrapper) {
  border: none !important;
}

/* Frame panel - should have gray background */
:deep([data-slot="frame-panel"]) {
  background-color: rgba(245, 245, 245, 1) !important;
  padding: 1rem !important;
}

/* Pagination dropdown - transparent in footer */
:deep(footer select),
:deep(footer button[role="combobox"]) {
  background-color: transparent !important;
  border: none !important;
}

/* Search input - white background like reference */
:deep(input[type="search"]),
:deep(input[placeholder*="Search"]),
:deep([data-slot="table-search"] input) {
  background-color: white !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
}

/* Filter button - white background like reference */
:deep(button[aria-label*="filter"]),
:deep(button[aria-label*="Filter"]),
:deep([data-slot="table-filter"] button) {
  background-color: white !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
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

