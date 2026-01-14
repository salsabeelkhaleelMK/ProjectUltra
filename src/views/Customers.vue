<template>
  <div class="page-container">
    <!-- Header -->
    <PageHeader title="Customers">
      <template #actions>
        <!-- Add New Button -->
        <button 
          @click="router.push('/add-new')"
          class="group flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
        >
          <i class="fa-solid fa-plus text-gray-400 group-hover:text-indigo-500"></i>
          <span class="hidden sm:inline">Add new</span>
        </button>
      </template>
    </PageHeader>
    
    <!-- Filters + Table -->
    <div class="p-4 md:p-8">
      <!-- Stage Tabs -->
      <div class="flex items-center gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button
          v-for="tab in stageTabs"
          :key="tab.key"
          @click="setTab(tab.key)"
          class="flex items-center justify-between gap-3 px-4 py-3 bg-white border border-border rounded-lg cursor-pointer hover:shadow-sm transition-all shrink-0 min-w-[160px] border-t-4"
          :class="activeTab === tab.key ? tab.borderColor : 'border-t-border'"
        >
          <span class="heading-tab whitespace-nowrap">{{ tab.label }}</span>
          <Badge
            :text="String(tab.count)"
            size="small"
            :theme="getBadgeTheme(tab.key, activeTab === tab.key)"
          />
        </button>
      </div>

      <!-- Table -->
      <div class="table-wrapper w-full">
        <DataTable 
          :data="filteredRows" 
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
            rowCount: filteredRows.length
          }"
          :globalFilterOptions="{
            debounce: 300
          }"
        >
          <template #toolbar>
            <div class="flex justify-end">
              <button 
                class="group flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-2 text-xs font-medium text-gray-600 hover:border-purple-100 hover:bg-purple-50 hover:text-purple-600 transition-all"
              >
                <i class="fa-solid fa-arrow-left text-gray-400 group-hover:text-purple-500"></i>
                <span class="hidden sm:inline">Switch back to old design</span>
              </button>
            </div>
          </template>
          <template #empty-state>
            <div class="empty-state">
              <i class="fa-solid fa-inbox empty-state-icon"></i>
              <p class="empty-state-text">No records found</p>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
    
    <!-- Add Customer Modal -->
    <AddCustomerModal
      :show="showAddModal"
      :active-tab="activeTab"
      :initial-data="newItem"
      @close="showAddModal = false"
      @save="handleAdd"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, h, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'
import AddCustomerModal from '@/components/modals/AddCustomerModal.vue'
import { DataTable } from '@motork/component-library/future/components'
import { Button, Badge } from '@motork/component-library'
import { useUserStore } from '@/stores/user'
import { useLeadsStore } from '@/stores/leads'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useCustomersStore } from '@/stores/customers'
import { formatDueDate, formatDeadlineFull, getDeadlineStatus } from '@/utils/formatters'
import { useCustomersTable } from '@/composables/useCustomersTable'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const leadsStore = useLeadsStore()
const opportunitiesStore = useOpportunitiesStore()
const customersStore = useCustomersStore()

// Compute stats from stores
const stats = computed(() => {
  const activeLeads = leadsStore.leads.filter(lead => !lead.isDisqualified)
  const openOpportunities = opportunitiesStore.opportunities.filter(opp => 
    opp.stage !== 'Closed Won' && opp.stage !== 'Closed Lost'
  )
  const inNegotiation = opportunitiesStore.opportunities.filter(opp => 
    opp.stage === 'In Negotiation' || opp.stage === 'In negotiation'
  )
  const won = opportunitiesStore.opportunities.filter(opp => 
    opp.stage === 'Closed Won'
  )
  const lost = opportunitiesStore.opportunities.filter(opp => 
    opp.stage === 'Closed Lost'
  )
  return {
    contacts: customersStore.totalCustomers,
    openLeads: activeLeads.length,
    openOpportunities: openOpportunities.length - inNegotiation.length, // Exclude in-negotiation from open
    inNegotiation: inNegotiation.length,
    won: won.length,
    lost: lost.length
  }
})

// Set default tab based on user role
const getDefaultTab = () => {
  if (userStore.isOperator()) {
    return 'open-leads'
  } else if (userStore.isManager() || userStore.isSalesman()) {
    return 'in-negotiation'
  }
  return 'contacts'
}

const activeTab = ref(getDefaultTab())
const searchQuery = ref('')
const showAddModal = ref(false)
const showDisqualified = ref(false)
const contactFilterType = ref('all') // 'all', 'contacts', 'accounts'
const filters = ref({
  status: '',
  priority: '',
  source: ''
})

// DataTable state management
const pagination = ref({
  pageIndex: 0,
  pageSize: 10
})

const globalFilter = ref('')
const sorting = ref([])
const columnFilters = ref([])
const columnVisibility = ref({})

const newItem = ref({
  customerName: '',
  email: '',
  phone: '',
  company: '',
  vehicle: '',
  value: '',
  reason: ''
})

const stageTabs = computed(() => {
  const allTabs = [
    { 
      key: 'contacts', 
      label: 'Customers', 
      count: stats.value.contacts,
      borderColor: 'border-t-purple-600',
      badgeColor: 'bg-purple-600 text-white'
    },
    { 
      key: 'open-leads', 
      label: 'Open Leads', 
      count: stats.value.openLeads,
      borderColor: 'border-t-blue-600',
      badgeColor: 'bg-blue-600 text-white'
    },
    { 
      key: 'open-opportunities', 
      label: 'Open opportunities', 
      count: stats.value.openOpportunities,
      borderColor: 'border-t-orange-500',
      badgeColor: 'bg-orange-500 text-white'
    },
    { 
      key: 'in-negotiation', 
      label: 'In negotiation', 
      count: stats.value.inNegotiation,
      borderColor: 'border-t-blue-500',
      badgeColor: 'bg-blue-500 text-white'
    },
    { 
      key: 'won', 
      label: 'Won', 
      count: stats.value.won,
      borderColor: 'border-t-green-500',
      badgeColor: 'bg-green-500 text-white'
    },
    { 
      key: 'lost', 
      label: 'Lost', 
      count: stats.value.lost,
      borderColor: 'border-t-red-500',
      badgeColor: 'bg-red-500 text-white'
    }
  ]
  
  // Filter tabs based on user role
  if (userStore.isOperator()) {
    // Operators see "Contacts & Accounts" and "Open Leads" tabs
    return allTabs.filter(tab => tab.key === 'contacts' || tab.key === 'open-leads')
  } else if (userStore.isSalesman()) {
    // Salesmen see all tabs EXCEPT "Open Leads"
    return allTabs.filter(tab => tab.key !== 'open-leads')
  } else {
    // Managers see all tabs
    return allTabs
  }
})

const getAddButtonLabel = () => {
  const labels = {
    'open-leads': 'Create a new lead',
    'open-opportunities': 'Create a new opportunity',
    'in-negotiation': 'Create a new opportunity',
    'won': 'Add won deal',
    'lost': 'Add lost deal'
  }
  return labels[activeTab.value] || 'Add new'
}


const handleAdd = () => {
  // For now we only reset the form and close the modal.
  // When a real backend/API exists, this handler should create
  // a new customer item and refresh the table data.
  newItem.value = {
    customerName: '',
    email: '',
    phone: '',
    company: '',
    vehicle: '',
    value: '',
    reason: ''
  }
  showAddModal.value = false
}

const rows = computed(() => {
  // Customers rows (unified contacts + accounts)
  let filteredCustomers = customersStore.customers
  if (contactFilterType.value === 'contacts') {
    filteredCustomers = customersStore.contacts
  } else if (contactFilterType.value === 'accounts') {
    filteredCustomers = customersStore.accounts
  }
  
  // Helper to extract location from address
  const getLocation = (address) => {
    if (!address) return 'N/A'
    // Extract city from address (last part after comma)
    const parts = address.split(',')
    if (parts.length > 1) {
      const cityPart = parts[parts.length - 1].trim()
      // Remove postal code if present
      const city = cityPart.replace(/^\d+\s*/, '').trim()
      return city || address
    }
    return address
  }

  const customerRows = filteredCustomers.map((customer) => ({
    id: `customer-${customer.id}`,
    stageKey: 'contacts',
    customer: customer.name,
    accountType: customer.company && customer.company !== '' ? 'Account' : 'Contact',
    telephone: customer.phone,
    location: getLocation(customer.address),
    createdAt: formatDate(customer.createdAt),
    // For accounts, additional fields
    name: customer.name,
    accountOwner: customer.source || 'N/A', // Using source as placeholder for account owner
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
  
  // Filter leads based on disqualified toggle
  let filteredLeads = leadsStore.leads
  if (showDisqualified.value) {
    filteredLeads = leadsStore.leads.filter(lead => lead.isDisqualified === true)
  } else {
    filteredLeads = leadsStore.leads.filter(lead => !lead.isDisqualified)
  }
  
  const leadRows = filteredLeads.map((lead) => ({
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
  
  const oppRows = opportunitiesStore.opportunities.map((opp) => {
    let stageKey = 'open-opportunities'
    if (opp.stage === 'In Negotiation' || opp.stage === 'In negotiation') {
      stageKey = 'in-negotiation'
    } else if (opp.stage === 'Closed Won') {
      stageKey = 'won'
    } else if (opp.stage === 'Closed Lost') {
      stageKey = 'lost'
    }
    // Use scheduledAppointment directly from opportunity object instead of fetching activities
    const lastAppointment = opp.scheduledAppointment?.start || null
    return {
      id: `opp-${opp.id}`,
      stageKey,
      customer: opp.customer?.name || 'Unknown',
      email: opp.customer?.email || '',
      initials: opp.customer?.initials || opp.customer?.name?.slice(0,2).toUpperCase() || '?',
      nextAction: formatDueDate(opp.expectedCloseDate) || 'No due date',
      nextActionFull: formatDeadlineFull(opp.expectedCloseDate),
      deadlineStatus: getDeadlineStatus(opp.expectedCloseDate),
      car: `${opp.vehicle?.brand || ''} ${opp.vehicle?.model || ''}`.trim() || 'N/A',
      carStatus: opp.vehicle?.stockDays !== undefined && opp.vehicle?.stockDays !== null ? 'In Stock' : 'Out of Stock',
      carStatusClass: opp.vehicle?.stockDays !== undefined && opp.vehicle?.stockDays !== null ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700',
      requestType: opp.requestType || 'Opportunity',
      source: opp.source || 'Marketing',
      assignee: opp.assignee,
      assigneeInitials: opp.assignee ? opp.assignee.slice(0,2).toUpperCase() : 'NA',
      createdAt: formatDate(opp.createdAt),
      lastAppointment: lastAppointment ? formatDate(lastAppointment) : 'N/A',
      status: opp.stage,
      statusClass: stageKey === 'in-negotiation' ? 'bg-orange-100 text-orange-700' : stageKey === 'won' ? 'bg-green-100 text-green-700' : stageKey === 'lost' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700',
      priority: opp.priority || 'Normal'
    }
  })
  
  return [...customerRows, ...leadRows, ...oppRows]
})

const filteredRows = computed(() => {
  let result = rows.value.filter(r => r.stageKey === activeTab.value)
  
  // Apply status filter
  if (filters.value.status) {
    result = result.filter(r => r.status === filters.value.status)
  }
  
  // Apply priority filter
  if (filters.value.priority) {
    result = result.filter(r => r.priority === filters.value.priority)
  }
  
  // Apply source filter
  if (filters.value.source) {
    result = result.filter(r => r.source === filters.value.source)
  }
  
  // Note: Search is now handled by DataTable's globalFilter
  return result
})

const setTab = (key) => {
  activeTab.value = key
}

const clearFilters = () => {
  filters.value = {
    status: '',
    priority: '',
    source: ''
  }
  columnFilters.value = []
  globalFilter.value = ''
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

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const d = new Date(dateString)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const getBadgeTheme = (tabKey, isActive) => {
  if (!isActive || !tabKey) return 'gray'
  const themeMap = {
    'contacts': 'gray', // Purple not available, use gray
    'open-leads': 'blue',
    'open-opportunities': 'blue', // Orange not available, use blue
    'in-negotiation': 'blue',
    'won': 'green',
    'lost': 'red'
  }
  const theme = themeMap[tabKey] || 'gray'
  // Ensure we always return a valid theme
  const validThemes = ['blue', 'green', 'red', 'gray']
  return validThemes.includes(theme) ? theme : 'gray'
}

// Load data on mount
onMounted(async () => {
  await customersStore.loadCustomers()
  await leadsStore.loadLeads()
  await opportunitiesStore.loadOpportunities()
})

const handleRowClick = (row) => {
  // Handle customers - navigate to customer profile on /customer/:id page
  if (row.stageKey === 'contacts') {
    const customerId = row.customerId || row.id.split('-')[1]
    router.push({ path: `/customer/${customerId}` })
    return
  }
  
  // Extract numeric ID from row.id (format: 'lead-1', 'opp-1', etc.)
  const idMatch = row.id.match(/-(\d+)$/)
  
  if (activeTab.value === 'open-leads' && row.id.startsWith('lead-')) {
    // Navigate to tasks view for lead
    const leadId = idMatch ? idMatch[1] : row.id.replace('lead-', '')
    router.push({ path: `/tasks/${leadId}`, query: { type: 'lead' } })
  } else if (row.id.startsWith('opp-')) {
    // Navigate to tasks view for opportunity
    const oppId = idMatch ? idMatch[1] : row.id.replace('opp-', '')
    router.push({ path: `/tasks/${oppId}`, query: { type: 'opportunity' } })
  } else if (row.stageKey === 'won' || row.stageKey === 'lost') {
    // For won/lost rows, navigate to the opportunity in tasks view
    const oppId = idMatch ? idMatch[1] : row.id.replace('opp-', '')
    router.push({ path: `/tasks/${oppId}`, query: { type: 'opportunity' } })
  }
}

// Use composable for table configuration
const { columns, filterDefinitions, tableMeta } = useCustomersTable(activeTab, handleRowClick)
</script>
