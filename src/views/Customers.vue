<template>
  <div class="page-container">
    <!-- Header -->
    <PageHeader title="Customers">
      <template #actions>
        <!-- Add New Button -->
        <button 
          @click="router.push('/add-new')"
          class="group flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:border-red-100 hover:bg-red-50 hover:text-brand-red transition-all"
        >
          <i class="fa-solid fa-plus text-gray-400 group-hover:text-brand-red"></i>
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
          class="flex items-center justify-between gap-3 px-4 py-3 bg-white border border-border rounded-lg cursor-pointer hover:shadow-sm transition-all shrink-0 min-w-40 border-t-4"
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

      <!-- Lazy Loaded Tab Content -->
      <Suspense>
        <component 
          :is="tabComponent" 
          :key="activeTab"
        />
        <template #fallback>
          <div class="flex items-center justify-center py-12">
            <div class="text-center">
              <i class="fa-solid fa-spinner fa-spin text-gray-400 text-2xl mb-2"></i>
              <p class="text-meta">Loading...</p>
            </div>
          </div>
        </template>
      </Suspense>
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
import { ref, computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'
import AddCustomerModal from '@/components/modals/AddCustomerModal.vue'
import { Badge } from '@motork/component-library'
import { useUserStore } from '@/stores/user'
import { useLeadsStore } from '@/stores/leads'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useCustomersStore } from '@/stores/customers'

const router = useRouter()
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
const showAddModal = ref(false)

const newItem = ref({
  customerName: '',
  email: '',
  phone: '',
  company: '',
  vehicle: '',
  value: '',
  reason: ''
})

// Lazy load tab components
const tabComponents = {
  'contacts': defineAsyncComponent(() => import('@/components/customers/ContactsTab.vue')),
  'open-leads': defineAsyncComponent(() => import('@/components/customers/OpenLeadsTab.vue')),
  'open-opportunities': defineAsyncComponent(() => import('@/components/customers/OpenOpportunitiesTab.vue')),
  'in-negotiation': defineAsyncComponent(() => import('@/components/customers/InNegotiationTab.vue')),
  'won': defineAsyncComponent(() => import('@/components/customers/WonTab.vue')),
  'lost': defineAsyncComponent(() => import('@/components/customers/LostTab.vue'))
}

const tabComponent = computed(() => {
  return tabComponents[activeTab.value] || tabComponents['contacts']
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

const setTab = (key) => {
  activeTab.value = key
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

// Load initial stats on mount (for tab counts)
// Individual tabs will load their own data when mounted
</script>
