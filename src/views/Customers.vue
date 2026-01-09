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
      <!-- Filters row in gray background above table -->
      <div class="mb-6 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <!-- Left: search + basic filters -->
          <div class="flex flex-wrap items-center gap-2 md:gap-3">
            <div class="w-full sm:w-auto sm:min-w-[260px] sm:max-w-md">
              <div class="relative">
                <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  v-model="searchQuery"
                  @input="handleSearch"
                  type="text" 
                  placeholder="Search or ask a question" 
                  class="input-with-icon"
                >
              </div>
            </div>
            
            <select v-model="filters.status" @change="applyFilters" class="input text-sm w-auto shrink-0">
              <option value="">Status</option>
              <option value="Valid">Valid</option>
              <option value="Not valid">Not valid</option>
              <option value="Qualified">Qualified</option>
              <option value="Not interested">Not interested</option>
            </select>
            
            <select v-model="filters.priority" @change="applyFilters" class="input text-sm w-auto shrink-0">
              <option value="">Priority</option>
              <option value="Hot">Hot</option>
              <option value="Normal">Normal</option>
            </select>
            
            <select v-model="filters.source" @change="applyFilters" class="input text-sm w-auto shrink-0">
              <option value="">Source</option>
              <option value="Marketing">Marketing</option>
            </select>
            
            <button class="btn-secondary text-sm">
              <i class="fa-solid fa-plus mr-1"></i> More filters
            </button>
            
            <button @click="clearFilters" class="btn-secondary text-sm">
              Clear
            </button>
            
            <button class="btn-secondary text-sm">
              Save
            </button>
            
            <!-- Contacts/Accounts Filter (only show for contacts tab) -->
            <button
              v-if="activeTab === 'contacts'"
              @click="contactFilterType = contactFilterType === 'all' ? 'contacts' : contactFilterType === 'contacts' ? 'accounts' : 'all'"
              class="btn-secondary text-sm flex items-center gap-2 transition-colors"
            >
              <i class="fa-solid fa-filter"></i>
              {{ contactFilterType === 'all' ? 'All' : contactFilterType === 'contacts' ? 'Contacts Only' : 'Accounts Only' }}
            </button>
            
            <!-- Disqualified Filter (only show for leads tab) -->
            <button
              v-if="activeTab === 'open-leads'"
              @click="showDisqualified = !showDisqualified"
              class="btn-secondary text-sm flex items-center gap-2 transition-colors"
              :class="showDisqualified ? 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100' : ''"
            >
              <i class="fa-solid fa-ban"></i>
              {{ showDisqualified ? 'Hide Disqualified' : 'Show Disqualified' }}
            </button>
          </div>

          <!-- Right: Add New button aligned to the far right -->
          <div class="flex justify-end">
            <button 
              v-if="activeTab === 'contacts' || activeTab === 'open-leads' || activeTab === 'open-opportunities'"
              @click="showAddModal = true"
              class="btn-primary-lg"
            >
              <i class="fa-solid fa-plus"></i> Add new
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div v-if="filteredRows.length === 0" class="empty-state">
        <i class="fa-solid fa-inbox empty-state-icon"></i>
        <p class="empty-state-text">No records found</p>
      </div>

      <div v-else class="card overflow-hidden">
        <div class="overflow-x-auto -mx-4 md:mx-0">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-3 md:px-6 py-3 text-left">
                  <input type="checkbox" class="rounded">
                </th>
                <th class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">{{ activeTab === 'contacts' ? 'Contact' : 'Customer' }}</th>
                <th v-if="activeTab === 'contacts'" class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Company</th>
                <th v-if="activeTab === 'contacts'" class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Email</th>
                <th v-if="activeTab === 'contacts'" class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Phone</th>
                <th v-if="activeTab !== 'contacts'" class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Next action due</th>
                <th v-if="activeTab !== 'contacts'" class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Requested car</th>
                <th v-if="activeTab !== 'contacts'" class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Car status</th>
                <th class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Source</th>
                <th v-if="activeTab === 'contacts'" class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap hidden xl:table-cell">Tags</th>
                <th v-if="activeTab !== 'contacts'" class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Assignee</th>
                <th v-if="activeTab !== 'contacts'" class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Status</th>
                <th class="px-3 md:px-6 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr 
                v-for="row in filteredRows" 
                :key="row.id"
                :data-row-id="row.id"
                class="hover:bg-gray-50 cursor-pointer transition-colors"
                @click="handleRowClick(row)"
              >
                <td class="px-3 md:px-6 py-3 whitespace-nowrap" @click.stop>
                  <input type="checkbox" class="rounded">
                </td>
                <td class="px-3 md:px-6 py-3 whitespace-nowrap">
                  <div class="flex items-center gap-2 md:gap-3">
                    <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      :class="activeTab === 'contacts' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'">
                      {{ row.initials }}
                    </div>
                    <div class="min-w-0">
                      <div class="text-content-bold truncate" :class="activeTab === 'contacts' ? 'max-w-[120px] md:max-w-none' : ''">{{ row.customer }}</div>
                      <div v-if="activeTab !== 'contacts'" class="text-meta truncate hidden sm:block">{{ row.email }}</div>
                    </div>
                  </div>
                </td>
                <td v-if="activeTab === 'contacts'" class="px-3 md:px-6 py-3 text-content text-gray-600 whitespace-nowrap">
                  <span class="truncate block max-w-[100px]">{{ row.company || '-' }}</span>
                </td>
                <td v-if="activeTab === 'contacts'" class="px-3 md:px-6 py-3 whitespace-nowrap">
                  <div class="text-content text-gray-600 truncate max-w-[150px]">{{ row.email }}</div>
                </td>
                <td v-if="activeTab === 'contacts'" class="px-3 md:px-6 py-3 text-content text-gray-600 whitespace-nowrap">
                  {{ row.phone }}
                </td>
                <td v-if="activeTab !== 'contacts'" class="px-3 md:px-6 py-3 whitespace-nowrap">
                  <div class="text-content">
                    <div 
                      class="font-medium mb-0.5"
                      :class="row.deadlineStatus?.textClass || 'text-gray-600'"
                    >
                      {{ row.nextActionFull }}
                    </div>
                    <div 
                      class="text-xs flex items-center gap-1"
                      :class="row.deadlineStatus?.textClass || 'text-gray-500'"
                    >
                      <i 
                        v-if="row.deadlineStatus?.icon"
                        :class="`fa-solid ${row.deadlineStatus.icon} text-[10px]`"
                      ></i>
                      <span>{{ row.nextAction }}</span>
                    </div>
                  </div>
                </td>
                <td v-if="activeTab !== 'contacts'" class="px-3 md:px-6 py-3 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <i class="fa-brands fa-volkswagen text-gray-400 text-sm"></i>
                    <span class="text-content font-medium truncate max-w-[120px]">{{ row.car }}</span>
                  </div>
                </td>
                <td v-if="activeTab !== 'contacts'" class="px-3 md:px-6 py-3 whitespace-nowrap">
                  <span class="badge-ui font-semibold" :class="row.carStatusClass">
                    {{ row.carStatus }}
                  </span>
                </td>
                <td class="px-3 md:px-6 py-3 whitespace-nowrap">
                  <span class="badge-ui bg-gray-100 text-gray-700 font-semibold">{{ row.source }}</span>
                </td>
                <td v-if="activeTab === 'contacts'" class="px-3 md:px-6 py-3 whitespace-nowrap hidden xl:table-cell">
                  <div class="flex flex-wrap gap-1">
                    <span 
                      v-for="tag in row.tags" 
                      :key="tag"
                      class="badge-ui bg-blue-50 text-blue-700 font-semibold"
                    >
                      {{ tag }}
                    </span>
                    <span v-if="!row.tags || row.tags.length === 0" class="text-xs text-gray-400">-</span>
                  </div>
                </td>
                <td v-if="activeTab !== 'contacts'" class="px-3 md:px-6 py-3 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 shrink-0">
                      {{ row.assigneeInitials }}
                    </div>
                    <span class="text-content text-gray-600 truncate max-w-[80px] hidden md:inline">{{ row.assignee }}</span>
                  </div>
                </td>
                <td v-if="activeTab !== 'contacts'" class="px-3 md:px-6 py-3 whitespace-nowrap">
                  <span class="badge-ui font-semibold" :class="row.statusClass">
                    {{ row.status }}
                  </span>
                </td>
                <td class="px-3 md:px-6 py-3 whitespace-nowrap" @click.stop>
                  <button class="text-gray-400 hover:text-gray-600">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="px-4 md:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div class="text-sm text-gray-600 flex items-center">
            Rows per page: 
            <select class="ml-2 input text-sm w-auto">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
          <div class="flex items-center gap-1 md:gap-2 flex-wrap">
            <button class="btn-secondary text-sm whitespace-nowrap">Previous</button>
            <button class="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium">1</button>
            <button class="btn-secondary text-sm">2</button>
            <button class="btn-secondary text-sm hidden sm:inline-block">3</button>
            <span class="px-2 text-sm text-gray-500 hidden sm:inline">...</span>
            <button class="btn-secondary text-sm whitespace-nowrap">Next</button>
          </div>
        </div>
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
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'
import AddCustomerModal from '@/components/modals/AddCustomerModal.vue'
import { useUserStore } from '@/stores/user'
import { useLeadsStore } from '@/stores/leads'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useContactsStore } from '@/stores/contacts'
import { formatDueDate, formatDeadlineFull, getDeadlineStatus } from '@/utils/formatters'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const leadsStore = useLeadsStore()
const opportunitiesStore = useOpportunitiesStore()
const contactsStore = useContactsStore()

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
  const contacts = contactsStore.contacts
  
  return {
    contacts: contacts.length,
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
  // Contacts rows
  let filteredContacts = contactsStore.contacts
  if (contactFilterType.value === 'contacts') {
    filteredContacts = contactsStore.contacts.filter(c => !c.company || c.company === '')
  } else if (contactFilterType.value === 'accounts') {
    filteredContacts = contactsStore.contacts.filter(c => c.company && c.company !== '')
  }
  
  const contactRows = filteredContacts.map((contact) => ({
    id: `contact-${contact.id}`,
    stageKey: 'contacts',
    customer: contact.name,
    email: contact.email,
    phone: contact.phone,
    company: contact.company || '-',
    initials: contact.initials || contact.name.slice(0,2).toUpperCase(),
    source: contact.source || 'Marketing',
    tags: contact.tags || [],
    type: contact.company && contact.company !== '' ? 'account' : 'contact'
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
    customer: lead.customer.name,
    email: lead.customer.email,
    initials: lead.customer.initials || lead.customer.name.slice(0,2).toUpperCase(),
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
      customer: opp.customer.name,
      email: opp.customer.email,
      initials: opp.customer.initials || opp.customer.name.slice(0,2).toUpperCase(),
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
  
  return [...contactRows, ...leadRows, ...oppRows]
})

const filteredRows = computed(() => {
  let result = rows.value.filter(r => r.stageKey === activeTab.value)
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(r => {
      if (r.stageKey === 'contacts') {
        return r.customer.toLowerCase().includes(query) ||
          r.email?.toLowerCase().includes(query) ||
          r.company?.toLowerCase().includes(query) ||
          r.phone?.toLowerCase().includes(query)
      } else {
        return r.customer.toLowerCase().includes(query) ||
          r.email?.toLowerCase().includes(query) ||
          r.car?.toLowerCase().includes(query)
      }
    })
  }
  
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
  
  return result
})

const setTab = (key) => {
  activeTab.value = key
}

const handleSearch = () => {
  // Search is handled in computed property
}

const applyFilters = () => {
  // Filters are handled in computed property
}

const clearFilters = () => {
  filters.value = {
    status: '',
    priority: '',
    source: ''
  }
  searchQuery.value = ''
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
  await contactsStore.loadContacts()
  await leadsStore.loadLeads()
  await opportunitiesStore.loadOpportunities()
})

const handleRowClick = (row) => {
  // Handle contacts - navigate to contact view on /customer/:id page
  if (row.stageKey === 'contacts') {
    const contactId = row.id.split('-')[1]
    router.push({ path: `/customer/${contactId}`, query: { type: 'contact' } })
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
</script>
