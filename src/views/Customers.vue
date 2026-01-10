<template>
  <div class="page-container">
    <!-- Header -->
    <PageHeader title="Customers" subtitle="Manage contacts, accounts, leads and opportunities" />
    
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
          <span class="text-sm font-medium text-foreground whitespace-nowrap">{{ tab.label }}</span>
          <span 
            class="px-2.5 py-1 text-sm font-semibold rounded-full min-w-[32px] text-center"
            :class="activeTab === tab.key ? tab.badgeColor : 'bg-muted text-muted-foreground'"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>
      <!-- Add New button -->
      <div class="mb-6 flex justify-end">
        <button 
          v-if="activeTab === 'contacts' || activeTab === 'open-leads' || activeTab === 'open-opportunities'"
          @click="showAddModal = true"
          class="btn-primary-lg"
        >
          <i class="fa-solid fa-plus"></i> Add new
        </button>
      </div>

      <!-- Table -->
      <div class="table-wrapper w-full">
        <DataTable 
          :data="filteredRows" 
          :columns="columns"
          :meta="tableMeta"
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
import { useUserStore } from '@/stores/user'
import { useLeadsStore } from '@/stores/leads'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useContactsStore } from '@/stores/contacts'
import { formatDueDate, formatDeadlineFull, getDeadlineStatus } from '@/utils/formatters'
import * as customersApi from '@/api/customers'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const leadsStore = useLeadsStore()
const opportunitiesStore = useOpportunitiesStore()
const contactsStore = useContactsStore()

// Customers data
const customers = ref([])
const loadingCustomers = ref(false)

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
    contacts: customers.value.length,
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

// Filter definitions for AI-powered filtering
const filterDefinitions = computed(() => {
  // Different filters based on active tab
  if (activeTab.value === 'contacts') {
    return [
      {
        key: 'source',
        label: 'Source',
        type: 'select',
        operators: [
          { value: 'eq', label: 'is' },
          { value: 'ne', label: 'is not' }
        ],
        options: [
          { value: 'Marketing', label: 'Marketing' },
          { value: 'Referral', label: 'Referral' },
          { value: 'Direct', label: 'Direct' }
        ]
      },
      {
        key: 'company',
        label: 'Has Company',
        type: 'boolean',
        operators: [
          { value: 'exists', label: 'exists' },
          { value: 'notExists', label: 'does not exist' }
        ]
      }
    ]
  } else {
    // For leads and opportunities
    return [
      {
        key: 'status',
        label: 'Status',
        type: 'multiselect',
        operators: [
          { value: 'in', label: 'is any of' },
          { value: 'notIn', label: 'is none of' }
        ],
        options: [
          { value: 'Valid', label: 'Valid' },
          { value: 'Not valid', label: 'Not valid' },
          { value: 'Qualified', label: 'Qualified' },
          { value: 'Not interested', label: 'Not interested' }
        ]
      },
      {
        key: 'priority',
        label: 'Priority',
        type: 'select',
        operators: [
          { value: 'eq', label: 'is' },
          { value: 'ne', label: 'is not' }
        ],
        options: [
          { value: 'Hot', label: 'Hot' },
          { value: 'Normal', label: 'Normal' }
        ]
      },
      {
        key: 'source',
        label: 'Source',
        type: 'select',
        operators: [
          { value: 'eq', label: 'is' },
          { value: 'ne', label: 'is not' }
        ],
        options: [
          { value: 'Marketing', label: 'Marketing' },
          { value: 'Referral', label: 'Referral' },
          { value: 'Direct', label: 'Direct' }
        ]
      }
    ]
  }
})

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
      label: 'Contacts & Accounts', 
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
  // Customers rows (replacing contacts)
  let filteredCustomers = customers.value
  if (contactFilterType.value === 'contacts') {
    filteredCustomers = customers.value.filter(c => !c.company || c.company === '')
  } else if (contactFilterType.value === 'accounts') {
    filteredCustomers = customers.value.filter(c => c.company && c.company !== '')
  }
  
  const customerRows = filteredCustomers.map((customer) => ({
    id: `customer-${customer.id}`,
    stageKey: 'contacts',
    customer: customer.name,
    email: customer.email,
    phone: customer.phone,
    company: customer.company || '-',
    initials: customer.initials || customer.name.slice(0,2).toUpperCase(),
    source: customer.source || 'Marketing',
    tags: customer.tags || [],
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
    return {
      id: `opp-${opp.id}`,
      stageKey,
      customer: opp.customer?.name || 'Unknown',
      email: opp.customer?.email || '',
      initials: opp.customer?.initials || opp.customer?.name?.slice(0,2).toUpperCase() || '?',
      nextAction: formatDueDate(opp.expectedCloseDate) || 'No due date',
      car: `${opp.vehicle?.brand || ''} ${opp.vehicle?.model || ''}`.trim() || 'N/A',
      carStatus: opp.vehicle?.stockDays !== undefined && opp.vehicle?.stockDays !== null ? 'In Stock' : 'Out of Stock',
      carStatusClass: opp.vehicle?.stockDays !== undefined && opp.vehicle?.stockDays !== null ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700',
      requestType: 'Opportunity',
      source: opp.source || 'Marketing',
      assignee: opp.assignee,
      assigneeInitials: opp.assignee ? opp.assignee.slice(0,2).toUpperCase() : 'NA',
      createdAt: formatDate(opp.createdAt),
      lastActivity: formatDate(opp.lastActivity),
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

// Load data on mount
onMounted(async () => {
  loadingCustomers.value = true
  try {
    const customersResult = await customersApi.fetchCustomers()
    customers.value = customersResult.data || []
  } catch (err) {
    console.error('Error loading customers:', err)
  } finally {
    loadingCustomers.value = false
  }
  await contactsStore.loadContacts()
  await leadsStore.loadLeads()
  await opportunitiesStore.loadOpportunities()
})

const handleRowClick = (row) => {
  // Handle customers - navigate to customer profile on /customer/:id page
  if (row.stageKey === 'contacts') {
    const customerId = row.customerId || row.id.split('-')[1]
    router.push({ path: `/customer/${customerId}`, query: { type: 'contact' } })
    return
  }
  
  // Extract numeric ID from row.id (format: 'lead-1', 'opp-1', etc.)
  const idMatch = row.id.match(/-(\d+)$/)
  
  if (activeTab.value === 'open-leads' && row.id.startsWith('lead-')) {
    // Navigate to standalone customer view
    const leadId = idMatch ? idMatch[1] : row.id.replace('lead-', '')
    router.push({ path: `/customer/${leadId}`, query: { stage: 'lead' } })
  } else if (row.id.startsWith('opp-')) {
    // Navigate to standalone customer view with opportunity type
    const oppId = idMatch ? idMatch[1] : row.id.replace('opp-', '')
    router.push({ path: `/customer/${oppId}`, query: { stage: 'opportunity' } })
  } else if (row.stageKey === 'won' || row.stageKey === 'lost') {
    // For won/lost rows, navigate to the opportunity
    const oppId = idMatch ? idMatch[1] : row.id.replace('opp-', '')
    router.push({ path: `/customer/${oppId}`, query: { stage: 'opportunity' } })
  }
}

// Table meta with row click handler
const tableMeta = computed(() => ({
  class: {
    tr: 'cursor-pointer hover:bg-gray-50 transition-colors'
  }
}))

// DataTable columns configuration - dynamic based on activeTab
const columns = computed(() => {
  if (activeTab.value === 'contacts') {
    // Contacts columns
    return [
      {
        accessorKey: 'customer',
        header: 'Contact',
        meta: { 
          title: 'Contact',
          onOpen: (row) => handleRowClick(row.original)
        },
        cell: ({ row }) => {
          const rowData = row.original
          return h('div', { class: 'flex items-center gap-2 md:gap-3' }, [
            h('div', {
              class: 'w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-blue-100 text-blue-600'
            }, rowData.initials),
            h('div', { class: 'min-w-0' }, [
              h('div', { class: 'text-sm font-semibold text-gray-900 truncate max-w-[120px] md:max-w-none' }, rowData.customer)
            ])
          ])
        }
      },
      {
        accessorKey: 'company',
        header: 'Company',
        meta: { title: 'Company' },
        cell: ({ row }) => {
          return h('span', { class: 'text-sm text-gray-600 truncate block max-w-[100px]' }, row.original.company || '-')
        }
      },
      {
        accessorKey: 'email',
        header: 'Email',
        meta: { title: 'Email' },
        cell: ({ row }) => {
          return h('div', { class: 'text-sm text-gray-600 truncate max-w-[150px]' }, row.original.email)
        }
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
        meta: { title: 'Phone' },
        cell: ({ row }) => {
          return h('span', { class: 'text-sm text-gray-600' }, row.original.phone)
        }
      },
      {
        accessorKey: 'source',
        header: 'Source',
        meta: { title: 'Source' },
        cell: ({ row }) => {
          return h('span', {
            class: 'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700'
          }, row.original.source)
        }
      },
      {
        accessorKey: 'tags',
        header: 'Tags',
        meta: { title: 'Tags' },
        cell: ({ row }) => {
          const tags = row.original.tags
          if (tags && tags.length > 0) {
            return h('div', { class: 'flex flex-wrap gap-1' }, tags.map(tag =>
              h('span', {
                class: 'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700'
              }, tag)
            ))
          }
          return h('span', { class: 'text-xs text-gray-400' }, '-')
        }
      },
      {
        id: 'actions',
        header: '',
        meta: { title: 'Actions' },
        cell: () => {
          return h('button', {
            class: 'text-gray-400 hover:text-gray-600'
          }, [
            h('i', { class: 'fa-solid fa-ellipsis-vertical' })
          ])
        }
      }
    ]
  } else {
    // Customers (leads/opportunities) columns
    return [
      {
        accessorKey: 'customer',
        header: 'Customer',
        meta: { 
          title: 'Customer',
          onOpen: (row) => handleRowClick(row.original)
        },
        cell: ({ row }) => {
          const rowData = row.original
          return h('div', { class: 'flex items-center gap-2 md:gap-3' }, [
            h('div', {
              class: 'w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-orange-100 text-orange-600'
            }, rowData.initials),
            h('div', { class: 'min-w-0' }, [
              h('div', { class: 'text-sm font-semibold text-gray-900 truncate' }, rowData.customer),
              h('div', { class: 'text-xs text-gray-500 truncate hidden sm:block' }, rowData.email)
            ])
          ])
        }
      },
      {
        accessorKey: 'nextAction',
        header: 'Next action due',
        meta: { title: 'Next action due' },
        cell: ({ row }) => {
          const rowData = row.original
          if (!rowData.nextActionFull) return '-'
          return h('div', { class: 'text-sm' }, [
            h('div', {
              class: `font-medium mb-0.5 ${rowData.deadlineStatus?.textClass || 'text-gray-600'}`
            }, rowData.nextActionFull),
            h('div', {
              class: `text-xs flex items-center gap-1 ${rowData.deadlineStatus?.textClass || 'text-gray-500'}`
            }, [
              rowData.deadlineStatus?.icon ? h('i', { class: `fa-solid ${rowData.deadlineStatus.icon} text-[10px]` }) : null,
              h('span', rowData.nextAction)
            ])
          ])
        }
      },
      {
        accessorKey: 'car',
        header: 'Requested car',
        meta: { title: 'Requested car' },
        cell: ({ row }) => {
          return h('div', { class: 'flex items-center gap-2' }, [
            h('i', { class: 'fa-brands fa-volkswagen text-gray-400 text-sm' }),
            h('span', { class: 'text-sm font-medium text-gray-900 truncate max-w-[120px]' }, row.original.car)
          ])
        }
      },
      {
        accessorKey: 'carStatus',
        header: 'Car status',
        meta: { title: 'Car status' },
        cell: ({ row }) => {
          return h('span', {
            class: `inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${row.original.carStatusClass}`
          }, row.original.carStatus)
        }
      },
      {
        accessorKey: 'source',
        header: 'Source',
        meta: { title: 'Source' },
        cell: ({ row }) => {
          return h('span', {
            class: 'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700'
          }, row.original.source)
        }
      },
      {
        accessorKey: 'assignee',
        header: 'Assignee',
        meta: { title: 'Assignee' },
        cell: ({ row }) => {
          return h('div', { class: 'flex items-center gap-2' }, [
            h('div', {
              class: 'w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 shrink-0'
            }, row.original.assigneeInitials),
            h('span', { class: 'text-sm text-gray-600 truncate max-w-[80px] hidden md:inline' }, row.original.assignee)
          ])
        }
      },
      {
        accessorKey: 'status',
        header: 'Status',
        meta: { title: 'Status' },
        cell: ({ row }) => {
          return h('span', {
            class: `inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${row.original.statusClass}`
          }, row.original.status)
        }
      },
      {
        id: 'actions',
        header: '',
        meta: { title: 'Actions' },
        cell: () => {
          return h('button', {
            class: 'text-gray-400 hover:text-gray-600'
          }, [
            h('i', { class: 'fa-solid fa-ellipsis-vertical' })
          ])
        }
      }
    ]
  }
})
</script>
