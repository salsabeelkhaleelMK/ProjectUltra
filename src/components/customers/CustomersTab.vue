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
            <Inbox class="empty-state-icon w-8 h-8 shrink-0" />
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
              <Trash2 class="w-4 h-4 shrink-0 mr-2" />
              Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              @click="clearSelection"
            >
              <X class="w-4 h-4 shrink-0 mr-2" />
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
import { Inbox, Trash2, X } from 'lucide-vue-next'
import { DataTable } from '@motork/component-library/future/components'
import { Button } from '@motork/component-library/future/primitives'
import { useCustomersStore } from '@/stores/customers'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useCustomersTable } from '@/composables/useCustomersTable'
import { useTableRowSelection } from '@/composables/useTableRowSelection'

const customersStore = useCustomersStore()
const opportunitiesStore = useOpportunitiesStore()

const contactFilterType = ref('all') // 'all', 'contacts', 'accounts'

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
    stageKey: 'customers',
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
  if (row.stageKey === 'customers') {
    emit('row-click', row)
  }
}

const activeTab = ref('customers')
const { columns, filterDefinitions, tableMeta } = useCustomersTable(activeTab, handleRowClick)


// Bulk delete handler
const handleBulkDelete = () => {
  const selectedRows = getSelectedRows(rows.value)
  
  if (selectedRows.length === 0) return
  
  if (!confirm(`Are you sure you want to delete ${selectedRows.length} ${selectedRows.length === 1 ? 'customer' : 'customers'}?`)) {
    return
  }
  
  selectedRows.forEach(row => {
    const customerId = row.id.replace('customer-', '')
    customersStore.deleteCustomer(customerId)
  })
  
  clearSelection()
}

// Load data on mount
onMounted(async () => {
  await customersStore.fetchCustomers()
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

