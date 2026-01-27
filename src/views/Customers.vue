<template>
  <div class="page-container relative">
    <!-- Header -->
    <PageHeader title="Customers">
      <template #actions>
        <!-- Add New Button -->
        <Button
          @click="router.push('/add-new')"
          variant="secondary"
          size="md"
          class="flex items-center gap-2"
        >
          <i class="fa-solid fa-plus text-sm"></i>
          <span class="hidden sm:inline">Add new</span>
        </Button>
      </template>
    </PageHeader>
    
    <!-- Filters + Table -->
    <div class="p-4 md:p-8">
      <!-- Stage Tabs -->
      <Tabs v-model="activeTab">
        <TabsList class="w-full justify-start border-b border-border bg-transparent mb-6 overflow-x-auto">
          <TabsTrigger
            v-for="tab in stageTabs"
            :key="tab.key"
            :value="tab.key"
            class="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-brand-dark data-[state=active]:text-brand-darkDarker rounded-none pb-3 px-4 shrink-0"
          >
            <span class="text-sm font-medium whitespace-nowrap">{{ tab.label }}</span>
            <Badge
              :text="String(tab.count)"
              size="small"
              :theme="getBadgeTheme(tab.key, activeTab === tab.key)"
            />
          </TabsTrigger>
        </TabsList>

        <!-- Tab Content for each stage -->
        <TabsContent
          v-for="tab in stageTabs"
          :key="`content-${tab.key}`"
          :value="tab.key"
        >
          <Suspense>
            <component 
              :is="tabComponents[tab.key]" 
              @row-click="handleRowClick"
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
        </TabsContent>
      </Tabs>
    </div>
    
    <!-- Drawer Container -->
    <DrawerContainer :show="showDrawer" @close="closeDrawer">
      <!-- Customer Detail View -->
      <CustomerProfile
        v-if="drawerEntity && drawerEntity.type === 'customer'"
        :customer-id="drawerEntity.id"
        :customer-type="'contact'"
        :show-close-button="true"
        :close-on-convert="true"
        @close="closeDrawer"
      />
      
      <!-- Task Detail View -->
      <TaskDetailView
        v-else-if="drawerEntity && drawerEntity.type === 'task' && drawerTask && drawerManagementWidget && drawerStoreAdapter"
        :task="drawerTask"
        :management-widget="drawerManagementWidget"
        :store-adapter="drawerStoreAdapter"
        :add-new-config="drawerAddNewConfig"
        :filtered-tasks="filteredTasks"
        :is-drawer-view="true"
        @task-navigate="handleDrawerTaskNavigate"
        @close="closeDrawer"
      />
    </DrawerContainer>
    
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
import { ref, computed, defineAsyncComponent, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/layout/PageHeader.vue'
import AddCustomerModal from '@/components/modals/AddCustomerModal.vue'
import TaskDetailView from '@/components/tasks/TaskDetailView.vue'
import DrawerContainer from '@/components/shared/DrawerContainer.vue'
import CustomerProfile from '@/components/customer/CustomerProfile.vue'
import { Badge, Button, Tabs, TabsList, TabsTrigger, TabsContent } from '@motork/component-library/future/primitives'
import { useUserStore } from '@/stores/user'
import { useLeadsStore } from '@/stores/leads'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useCustomersStore } from '@/stores/customers'
import { useTaskShell } from '@/composables/useTaskShell'
import { useTaskFilters } from '@/composables/useTaskFilters'

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

// Set default tab - always show customers tab regardless of user type
const getDefaultTab = () => {
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

// Drawer state
const showDrawer = ref(false)
const drawerEntity = ref(null) // { type: 'customer' | 'task', id: number }
const drawerTask = ref(null)

// Use task filters composable for drawer navigation
const { allTasks } = useTaskFilters(ref(false))

// Filtered tasks for drawer navigation
const filteredTasks = computed(() => {
  return allTasks.value
})

// Computed ref for drawer task (for useTaskShell)
const drawerTaskRef = computed(() => drawerTask.value)

// Get task shell props for drawer task
const drawerTaskShellPropsRaw = useTaskShell(drawerTaskRef)

// Unwrap the computed refs for use in template
const drawerManagementWidget = computed(() => drawerTaskShellPropsRaw.managementWidget.value)
const drawerStoreAdapter = computed(() => drawerTaskShellPropsRaw.storeAdapter.value)
const drawerAddNewConfig = computed(() => drawerTaskShellPropsRaw.addNewConfig.value)

// Watch for drawer task changes to load activities
watch(drawerTask, (task) => {
  if (task) {
    if (task.type === 'lead') {
      leadsStore.fetchLeadById(task.id)
    } else {
      opportunitiesStore.fetchOpportunityById(task.id)
    }
  }
}, { immediate: true })

// Lazy load tab components
const tabComponents = {
  'contacts': defineAsyncComponent(() => import('@/components/customers/ContactsTab.vue')),
  'open-leads': defineAsyncComponent(() => import('@/components/customers/OpenLeadsTab.vue')),
  'open-opportunities': defineAsyncComponent(() => import('@/components/customers/OpenOpportunitiesTab.vue')),
  'in-negotiation': defineAsyncComponent(() => import('@/components/customers/InNegotiationTab.vue')),
  'won': defineAsyncComponent(() => import('@/components/customers/WonTab.vue')),
  'lost': defineAsyncComponent(() => import('@/components/customers/LostTab.vue'))
}

const stageTabs = computed(() => {
  const allTabs = [
    { 
      key: 'contacts', 
      label: 'Customers', 
      count: stats.value.contacts
    },
    { 
      key: 'open-leads', 
      label: 'Open leads', 
      count: stats.value.openLeads
    },
    { 
      key: 'open-opportunities', 
      label: 'Open opportunities', 
      count: stats.value.openOpportunities
    },
    { 
      key: 'in-negotiation', 
      label: 'In negotiation', 
      count: stats.value.inNegotiation
    },
    { 
      key: 'won', 
      label: 'Won', 
      count: stats.value.won
    },
    { 
      key: 'lost', 
      label: 'Lost', 
      count: stats.value.lost
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

// Handle row click from tab components
const handleRowClick = (row) => {
  // Determine entity type from row ID
  if (row.id.startsWith('customer-')) {
    // Customer/Contact - use customerId from row if available, otherwise parse from id
    const customerId = row.customerId || parseInt(row.id.replace('customer-', ''))
    drawerEntity.value = { type: 'customer', id: customerId }
    drawerTask.value = null
    showDrawer.value = true
  } else if (row.id.startsWith('lead-')) {
    // Lead task
    const idMatch = row.id.match(/-(\d+)$/)
    const leadId = idMatch ? parseInt(idMatch[1]) : parseInt(row.id.replace('lead-', ''))
    const task = allTasks.value.find(t => t.type === 'lead' && t.id === leadId)
    if (task) {
      drawerTask.value = task
      drawerEntity.value = { type: 'task', id: leadId }
      showDrawer.value = true
      leadsStore.fetchLeadById(leadId)
    }
  } else if (row.id.startsWith('opp-')) {
    // Opportunity task
    const idMatch = row.id.match(/-(\d+)$/)
    const oppId = idMatch ? parseInt(idMatch[1]) : parseInt(row.id.replace('opp-', ''))
    const task = allTasks.value.find(t => t.type === 'opportunity' && t.id === oppId)
    if (task) {
      drawerTask.value = task
      drawerEntity.value = { type: 'task', id: oppId }
      showDrawer.value = true
      opportunitiesStore.fetchOpportunityById(oppId)
    }
  }
}

// Close drawer
const closeDrawer = () => {
  showDrawer.value = false
  drawerEntity.value = null
  drawerTask.value = null
}

// Handle drawer task navigation
const handleDrawerTaskNavigate = (direction) => {
  if (!drawerTask.value) return
  
  const index = filteredTasks.value.findIndex(t => {
    const currentCompositeId = drawerTask.value.compositeId || `${drawerTask.value.type}-${drawerTask.value.id}`
    const taskCompositeId = t.compositeId || `${t.type}-${t.id}`
    return taskCompositeId === currentCompositeId
  })
  
  if (index === -1) return
  
  if (direction === 'previous' && index > 0) {
    const prevTask = filteredTasks.value[index - 1]
    handleRowClick({ id: `${prevTask.type}-${prevTask.id}` })
  } else if (direction === 'next' && index < filteredTasks.value.length - 1) {
    const nextTask = filteredTasks.value[index + 1]
    handleRowClick({ id: `${nextTask.type}-${nextTask.id}` })
  }
}

// Load initial stats on mount (for tab counts)
// Individual tabs will load their own data when mounted
onMounted(async () => {
  await leadsStore.fetchLeads()
  await opportunitiesStore.fetchOpportunities()
})
</script>

