<template>
  <div class="page-container">
    <!-- Header -->
    <PageHeader title="Pipeline" subtitle="Manage your opportunities and deals" />
    
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
              v-if="activeTab === 'open-leads' || activeTab === 'open-opportunities'"
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
                <th class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Customer</th>
                <th class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Next action due</th>
                <th class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Requested car</th>
                <th class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Car status</th>
                <th class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Source</th>
                <th class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Assignee</th>
                <th class="px-3 md:px-6 py-3 text-left label-upper whitespace-nowrap">Status</th>
                <th class="px-3 md:px-6 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr 
                v-for="row in filteredRows" 
                :key="row.id"
                class="hover:bg-gray-50 cursor-pointer transition-colors"
                @click="handleRowClick(row)"
              >
                <td class="px-3 md:px-6 py-3 whitespace-nowrap" @click.stop>
                  <input type="checkbox" class="rounded">
                </td>
                <td class="px-3 md:px-6 py-3 whitespace-nowrap">
                  <div class="flex items-center gap-2 md:gap-3">
                    <div class="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0">
                      {{ row.initials }}
                    </div>
                    <div class="min-w-0">
                      <div class="text-content-bold truncate">{{ row.customer }}</div>
                      <div class="text-meta truncate hidden sm:block">{{ row.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-3 md:px-6 py-3 whitespace-nowrap">
                  <span 
                    class="text-content font-medium"
                    :class="row.priority === 'Hot' ? 'text-red-600' : 'text-gray-600'"
                  >
                    {{ row.nextAction }}
                  </span>
                </td>
                <td class="px-3 md:px-6 py-3 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <i class="fa-brands fa-volkswagen text-gray-400 text-sm"></i>
                    <span class="text-content font-medium truncate max-w-[120px]">{{ row.car }}</span>
                  </div>
                </td>
                <td class="px-3 md:px-6 py-3 whitespace-nowrap">
                  <span class="badge-ui font-semibold" :class="row.carStatusClass">
                    {{ row.carStatus }}
                  </span>
                </td>
                <td class="px-3 md:px-6 py-3 text-content text-gray-600 whitespace-nowrap">{{ row.source }}</td>
                <td class="px-3 md:px-6 py-3 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 shrink-0">
                      {{ row.assigneeInitials }}
                    </div>
                    <span class="text-content text-gray-600 truncate max-w-[80px] hidden md:inline">{{ row.assignee }}</span>
                  </div>
                </td>
                <td class="px-3 md:px-6 py-3 whitespace-nowrap">
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
    
    <!-- Add Modal -->
    <teleport to="body">
      <div 
        v-if="showAddModal" 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        @click.self="showAddModal = false"
      >
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 my-4 max-h-[90vh] overflow-y-auto animate-fade-in">
          <div class="p-5 border-b border-gray-100 bg-gray-50/50">
            <h3 class="modal-title">{{ getModalTitle() }}</h3>
            <p class="modal-subtitle">Fill in the details below</p>
          </div>
          
          <div class="p-5 space-y-4">
            <!-- Form fields based on active tab -->
            <div v-if="activeTab === 'open-leads'">
              <label class="block label-upper mb-2">Customer Name</label>
              <input 
                v-model="newItem.customerName"
                type="text" 
                placeholder="Enter customer name..." 
                class="input"
              >
              
              <label class="block label-upper mb-2 mt-4">Email</label>
              <input 
                v-model="newItem.email"
                type="email" 
                placeholder="customer@example.com" 
                class="input"
              >
              
              <label class="block label-upper mb-2 mt-4">Requested Vehicle</label>
              <input 
                v-model="newItem.vehicle"
                type="text" 
                placeholder="e.g., Volkswagen ID.4" 
                class="input"
              >
            </div>
            
            <div v-else-if="activeTab === 'open-opportunities' || activeTab === 'in-negotiation'">
              <label class="block label-upper mb-2">Customer Name</label>
              <input 
                v-model="newItem.customerName"
                type="text" 
                placeholder="Enter customer name..." 
                class="input"
              >
              
              <label class="block label-upper mb-2 mt-4">Vehicle</label>
              <input 
                v-model="newItem.vehicle"
                type="text" 
                placeholder="e.g., Porsche Taycan" 
                class="input"
              >
              
              <label class="block label-upper mb-2 mt-4">Opportunity Value</label>
              <input 
                v-model="newItem.value"
                type="number" 
                placeholder="0" 
                class="input"
              >
              
              <label class="block label-upper mb-2 mt-4">Probability (%)</label>
              <input 
                v-model="newItem.probability"
                type="number" 
                min="0"
                max="100"
                placeholder="75" 
                class="input"
              >
            </div>
            
            <div v-else>
              <label class="block label-upper mb-2">Customer Name</label>
              <input 
                v-model="newItem.customerName"
                type="text" 
                placeholder="Enter customer name..." 
                class="input"
              >
              
              <label class="block label-upper mb-2 mt-4">Vehicle</label>
              <input 
                v-model="newItem.vehicle"
                type="text" 
                placeholder="Vehicle model" 
                class="input"
              >
              
              <label class="block label-upper mb-2 mt-4">Reason</label>
              <textarea 
                v-model="newItem.reason"
                rows="3"
                placeholder="Reason for {{ activeTab === 'won' ? 'win' : 'loss' }}..." 
                class="input resize-none"
              ></textarea>
            </div>
          </div>
          
          <div class="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
            <button 
              @click="showAddModal = false"
              class="btn-secondary text-sm"
            >
              Cancel
            </button>
            <button 
              @click="handleAdd"
              class="btn-primary"
            >
              Create {{ getItemType() }}
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { pipelineStats, mockLeads, mockOpportunities } from '@/api/mockData'
import PageHeader from '@/components/layout/PageHeader.vue'
import { useUserStore } from '@/stores/user'
import { formatDueDate } from '@/utils/formatters'

const router = useRouter()
const userStore = useUserStore()

const stats = ref(pipelineStats)
const activeTab = ref('open-leads')
const searchQuery = ref('')
const showAddModal = ref(false)
const showDisqualified = ref(false)
const filters = ref({
  status: '',
  priority: '',
  source: ''
})

const newItem = ref({
  customerName: '',
  email: '',
  vehicle: '',
  value: '',
  probability: '',
  reason: ''
})

const stageTabs = computed(() => {
  const allTabs = [
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
    // Operators only see "Open Leads" tab
    return allTabs.filter(tab => tab.key === 'open-leads')
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

const getModalTitle = () => {
  const titles = {
    'open-leads': 'Create New Lead',
    'open-opportunities': 'Create New Opportunity',
    'in-negotiation': 'Create New Opportunity',
    'won': 'Add Won Deal',
    'lost': 'Add Lost Deal'
  }
  return titles[activeTab.value] || 'Add New'
}

const getItemType = () => {
  const types = {
    'open-leads': 'Lead',
    'open-opportunities': 'Opportunity',
    'in-negotiation': 'Opportunity',
    'won': 'Deal',
    'lost': 'Deal'
  }
  return types[activeTab.value] || 'Item'
}

const handleAdd = () => {
  // For now we only reset the form and close the modal.
  // When a real backend/API exists, this handler should create
  // a new pipeline item and refresh the table data.
  newItem.value = {
    customerName: '',
    email: '',
    vehicle: '',
    value: '',
    probability: '',
    reason: ''
  }
  showAddModal.value = false
}

const rows = computed(() => {
  // Filter leads based on disqualified toggle
  let filteredLeads = mockLeads
  if (showDisqualified.value) {
    filteredLeads = mockLeads.filter(lead => lead.isDisqualified === true)
  } else {
    filteredLeads = mockLeads.filter(lead => !lead.isDisqualified)
  }
  
  const leadRows = filteredLeads.map((lead) => ({
    id: `lead-${lead.id}`,
    stageKey: 'open-leads',
    customer: lead.customer.name,
    email: lead.customer.email,
    initials: lead.customer.initials || lead.customer.name.slice(0,2).toUpperCase(),
    nextAction: formatDueDate(lead.nextActionDue) || 'No due date',
    car: `${lead.requestedCar.brand} ${lead.requestedCar.model}`,
    carStatus: lead.carStatus || 'New',
    carStatusClass: lead.carStatus === 'New' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700',
    requestType: lead.requestType || 'Quotation',
    source: lead.source || 'Marketing',
    assignee: lead.assignee,
    assigneeInitials: lead.assigneeInitials || (lead.assignee ? lead.assignee.slice(0,2).toUpperCase() : 'NA'),
    createdAt: formatDate(lead.createdAt),
    lastActivity: formatDate(lead.lastActivity),
    status: lead.status,
    statusClass: getStatusClass(lead.status),
    priority: lead.priority
  }))
  
  const oppRows = mockOpportunities.map((opp) => {
    let stageKey = 'open-opportunities'
    if (opp.stage === 'In Negotiation' || opp.stage === 'In negotiation') {
      stageKey = 'in-negotiation'
    } else if (opp.stage === 'Closed') {
      stageKey = 'won'
    }
    return {
      id: `opp-${opp.id}`,
      stageKey,
      customer: opp.customer.name,
      email: opp.customer.email,
      initials: opp.customer.initials || opp.customer.name.slice(0,2).toUpperCase(),
      nextAction: '1h 12m',
      car: `${opp.vehicle.brand} ${opp.vehicle.model}`,
      carStatus: 'New',
      carStatusClass: 'bg-green-100 text-green-700',
      requestType: 'Opportunity',
      source: 'Marketing',
      assignee: opp.assignee,
      assigneeInitials: opp.assignee ? opp.assignee.slice(0,2).toUpperCase() : 'NA',
      createdAt: formatDate(opp.createdAt),
      lastActivity: formatDate(opp.lastActivity),
      status: opp.stage,
      statusClass: stageKey === 'in-negotiation' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700',
      priority: 'Normal'
    }
  })
  
  // Add some mock "Won" and "Lost" records
  const wonRows = [
    {
      id: 'won-1',
      stageKey: 'won',
      customer: 'John Doe',
      email: 'john.doe@example.com',
      initials: 'JD',
      nextAction: '-',
      car: 'Audi A6',
      carStatus: 'New',
      carStatusClass: 'bg-green-100 text-green-700',
      requestType: 'Quotation',
      source: 'Marketing',
      assignee: 'Michael Thomas',
      assigneeInitials: 'MT',
      createdAt: '15/03/2025',
      lastActivity: '15/03/2025',
      status: 'Won',
      statusClass: 'bg-green-100 text-green-700',
      priority: 'Normal'
    }
  ]
  
  const lostRows = [
    {
      id: 'lost-1',
      stageKey: 'lost',
      customer: 'Jane Smith',
      email: 'jane.smith@example.com',
      initials: 'JS',
      nextAction: '-',
      car: 'BMW X5',
      carStatus: 'New',
      carStatusClass: 'bg-green-100 text-green-700',
      requestType: 'Test Drive',
      source: 'Marketing',
      assignee: 'Sarah Jenkins',
      assigneeInitials: 'SJ',
      createdAt: '10/03/2025',
      lastActivity: '10/03/2025',
      status: 'Lost',
      statusClass: 'bg-red-100 text-red-700',
      priority: 'Normal'
    }
  ]
  
  return [...leadRows, ...oppRows, ...wonRows, ...lostRows]
})

const filteredRows = computed(() => {
  let result = rows.value.filter(r => r.stageKey === activeTab.value)
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(r => 
      r.customer.toLowerCase().includes(query) ||
      r.email.toLowerCase().includes(query) ||
      r.car.toLowerCase().includes(query)
    )
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

const handleRowClick = (row) => {
  // Extract numeric ID from row.id (format: 'lead-1', 'opp-1', etc.)
  const idMatch = row.id.match(/-(\d+)$/)
  
  if (activeTab.value === 'open-leads' && row.id.startsWith('lead-')) {
    // Navigate to tasks page with lead type
    const leadId = idMatch ? idMatch[1] : row.id.replace('lead-', '')
    router.push({ path: `/tasks/${leadId}`, query: { type: 'lead' } })
  } else if (row.id.startsWith('opp-')) {
    // Navigate to tasks page with opportunity type
    const oppId = idMatch ? idMatch[1] : row.id.replace('opp-', '')
    router.push({ path: `/tasks/${oppId}`, query: { type: 'opportunity' } })
  } else if (row.stageKey === 'won' || row.stageKey === 'lost') {
    // For won/lost rows, navigate to first opportunity as fallback
    // In a real app, these would have proper opportunity IDs
    if (mockOpportunities.length > 0) {
      router.push({ path: `/tasks/${mockOpportunities[0].id}`, query: { type: 'opportunity' } })
    }
  }
}
</script>
