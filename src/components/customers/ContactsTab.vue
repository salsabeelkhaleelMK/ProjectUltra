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



