<template>
  <div class="table-wrapper w-full">
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
    >
      <template #empty-state>
        <div class="empty-state">
          <i class="fa-solid fa-inbox empty-state-icon"></i>
          <p class="empty-state-text">No records found</p>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { DataTable } from '@motork/component-library/future/components'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { formatDueDate, formatDeadlineFull, getDeadlineStatus } from '@/utils/formatters'
import { useCustomersTable } from '@/composables/useCustomersTable'

const router = useRouter()
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
      opp.stage !== 'Closed Won' && 
      opp.stage !== 'Closed Lost' &&
      opp.stage !== 'In Negotiation' &&
      opp.stage !== 'In negotiation'
    )
    .map((opp) => {
      const lastAppointment = opp.scheduledAppointment?.start || null
      return {
        id: `opp-${opp.id}`,
        stageKey: 'open-opportunities',
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
        statusClass: 'bg-purple-100 text-purple-700',
        priority: opp.priority || 'Normal'
      }
    })
})

const handleRowClick = (row) => {
  if (row.id.startsWith('opp-')) {
    const idMatch = row.id.match(/-(\d+)$/)
    const oppId = idMatch ? idMatch[1] : row.id.replace('opp-', '')
    router.push({ path: `/tasks/${oppId}`, query: { type: 'opportunity' } })
  }
}

const activeTab = ref('open-opportunities')
const { columns, filterDefinitions, tableMeta } = useCustomersTable(activeTab, handleRowClick)

// Load data on mount
onMounted(async () => {
  await opportunitiesStore.fetchOpportunities()
})
</script>


