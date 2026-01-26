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
import { useCustomersStore } from '@/stores/customers'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useCustomersTable } from '@/composables/useCustomersTable'

const customersStore = useCustomersStore()
const opportunitiesStore = useOpportunitiesStore()

const contactFilterType = ref('all') // 'all', 'contacts', 'accounts'

// DataTable state management
const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

const globalFilter = ref('')
const sorting = ref([])
const columnFilters = ref([])

// Helper to extract location from address
const getLocation = (address) => {
  if (!address) return 'N/A'
  const parts = address.split(',')
  if (parts.length > 1) {
    const cityPart = parts[parts.length - 1].trim()
    const city = cityPart.replace(/^\d+\s*/, '').trim()
    return city || address
  }
  return address
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const rows = computed(() => {
  let filteredCustomers = customersStore.customers
  if (contactFilterType.value === 'contacts') {
    filteredCustomers = customersStore.contacts
  } else if (contactFilterType.value === 'accounts') {
    filteredCustomers = customersStore.accounts
  }
  
  return filteredCustomers.map((customer) => ({
    id: `customer-${customer.id}`,
    stageKey: 'contacts',
    customer: customer.name,
    accountType: customer.company && customer.company !== '' ? 'Account' : 'Contact',
    telephone: customer.phone,
    location: getLocation(customer.address),
    createdAt: formatDate(customer.createdAt),
    name: customer.name,
    accountOwner: customer.source || 'N/A',
    updatedAt: formatDate(customer.lastContact || customer.createdAt),
    lastActivity: formatDate(customer.lastContact),
    openOpportunities: opportunitiesStore.opportunities.filter(opp => 
      opp.customerId === customer.id && 
      opp.stage !== 'Closed Won' && 
      opp.stage !== 'Closed Lost'
    ).length,
    wonOpportunities: opportunitiesStore.opportunities.filter(opp => 
      opp.customerId === customer.id && 
      opp.stage === 'Closed Won'
    ).length,
    initials: customer.initials || customer.name.slice(0,2).toUpperCase(),
    type: customer.company && customer.company !== '' ? 'account' : 'contact',
    customerId: customer.id
  }))
})

const emit = defineEmits(['row-click'])

const handleRowClick = (row) => {
  if (row.stageKey === 'contacts') {
    emit('row-click', row)
  }
}

const activeTab = ref('contacts')
const { columns, filterDefinitions, tableMeta } = useCustomersTable(activeTab, handleRowClick)

// Load data on mount
onMounted(async () => {
  await customersStore.fetchCustomers()
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

