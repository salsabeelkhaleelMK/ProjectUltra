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
import { useLeadsStore } from '@/stores/leads'
import { formatDueDate, formatDeadlineFull, getDeadlineStatus } from '@/utils/formatters'
import { useCustomersTable } from '@/composables/useCustomersTable'

const router = useRouter()
const leadsStore = useLeadsStore()

const showDisqualified = ref(false)

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
    'Qualified': 'bg-gray-100 text-gray-700',
    'Not interested': 'bg-red-100 text-red-700',
    'Open': 'bg-blue-100 text-blue-700'
  }
  return statusMap[status] || 'bg-gray-100 text-gray-700'
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
    carStatusClass: lead.requestedCar?.stockDays !== undefined && lead.requestedCar?.stockDays !== null ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700',
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

const handleRowClick = (row) => {
  if (row.id.startsWith('lead-')) {
    const idMatch = row.id.match(/-(\d+)$/)
    const leadId = idMatch ? idMatch[1] : row.id.replace('lead-', '')
    router.push({ path: `/tasks/${leadId}`, query: { type: 'lead' } })
  }
}

const activeTab = ref('open-leads')
const { columns, filterDefinitions, tableMeta } = useCustomersTable(activeTab, handleRowClick)

// Load data on mount
onMounted(async () => {
  await leadsStore.fetchLeads()
})
</script>

