<template>
  <div class="page-container relative flex flex-col overflow-hidden h-full">
    <!-- Header -->
    <PageHeader title="Customers" class="shrink-0">
      <template #actions>
        <!-- Add New Button -->
        <button
          @click="router.push('/add-new')"
          class="group flex items-center gap-2 rounded-xl border border-border px-3 py-1.5 bg-surface text-sm font-medium text-muted-foreground hover:border-red-100 hover:bg-red-50 hover:text-brand-red transition-all"
        >
          <Plus class="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-brand-red" />
          <span class="hidden sm:inline">Add new</span>
        </button>
      </template>
    </PageHeader>
    
    <!-- Filters + Table -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
        <!-- Stage Tabs -->
        <div class="mb-2 -mt-2">
          <Tabs v-model="activeTab">
            <TabsList class="flex shrink-0 border-b border-border bg-white rounded-none w-full relative h-full">
              <TabsTrigger
                v-for="tab in stageTabs"
                :key="tab.key"
                :value="tab.key"
                class="flex items-center gap-2 text-sm font-medium transition-all relative flex-1 justify-center bg-transparent outline-none h-full shrink-0"
                :class="activeTab === tab.key 
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-muted-foreground'"
              >
                <span class="whitespace-nowrap">{{ tab.label }}</span>
                <Badge
                  :text="String(tab.count)"
                  size="small"
                  :theme="getBadgeTheme(tab.key, activeTab === tab.key)"
                />
                <span 
                  v-if="activeTab === tab.key"
                  class="absolute bottom-0 left-0 right-0 h-[2px] bg-primary z-10"
                ></span>
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
                      <Loader2 class="w-8 h-8 shrink-0 text-muted-foreground mb-2 animate-spin" />
                      <p class="text-meta">Loading...</p>
                    </div>
                  </div>
                </template>
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>
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
import { Plus, Loader2 } from 'lucide-vue-next'
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
  return 'customers'
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
const drawerTaskCompositeId = ref(null) // 'lead-1' or 'opportunity-1' - used to resolve live task from store

// Use task filters composable for drawer navigation
const { allTasks } = useTaskFilters(ref(false))

// Filtered tasks for drawer navigation
const filteredTasks = computed(() => {
  return allTasks.value
})

const drawerTask = computed(() => {
  if (!drawerTaskCompositeId.value) return null
  return allTasks.value.find(t => t.compositeId === drawerTaskCompositeId.value) || null
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
  'customers': defineAsyncComponent(() => import('@/components/customers/CustomersTab.vue')),
  'open-leads': defineAsyncComponent(() => import('@/components/customers/OpenLeadsTab.vue')),
  'open-opportunities': defineAsyncComponent(() => import('@/components/customers/OpenOpportunitiesTab.vue')),
  'in-negotiation': defineAsyncComponent(() => import('@/components/customers/InNegotiationTab.vue')),
  'won': defineAsyncComponent(() => import('@/components/customers/WonTab.vue')),
  'lost': defineAsyncComponent(() => import('@/components/customers/LostTab.vue'))
}

const stageTabs = computed(() => {
  const allTabs = [
    { 
      key: 'customers', 
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
    // Operators see "Customers" and "Open Leads" tabs
    return allTabs.filter(tab => tab.key === 'customers' || tab.key === 'open-leads')
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
    'customers': 'gray', // Purple not available, use gray
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
    drawerTaskCompositeId.value = null
    showDrawer.value = true
  } else if (row.id.startsWith('lead-')) {
    const idMatch = row.id.match(/-(\d+)$/)
    const leadId = idMatch ? parseInt(idMatch[1]) : parseInt(row.id.replace('lead-', ''))
    const task = allTasks.value.find(t => t.type === 'lead' && t.id === leadId)
    if (task) {
      drawerTaskCompositeId.value = task.compositeId
      drawerEntity.value = { type: 'task', id: leadId }
      showDrawer.value = true
      leadsStore.fetchLeadById(leadId)
    }
  } else if (row.id.startsWith('opp-')) {
    const idMatch = row.id.match(/-(\d+)$/)
    const oppId = idMatch ? parseInt(idMatch[1]) : parseInt(row.id.replace('opp-', ''))
    const task = allTasks.value.find(t => t.type === 'opportunity' && t.id === oppId)
    if (task) {
      drawerTaskCompositeId.value = task.compositeId
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
  drawerTaskCompositeId.value = null
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

<style scoped>
/* Tab styling to match Customer.vue */
:deep([role="tablist"]) {
  border: none !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
  padding: 0 !important;
  margin: 0 !important;
  gap: 0 !important;
  height: auto !important;
  min-height: 48px !important;
}

:deep([role="tab"]) {
  background: transparent !important;
  border: none !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  border-bottom: none !important;
  margin: 0 !important;
  padding: 6px 16px 12px 16px !important;
  position: relative !important;
  box-shadow: none !important;
  height: 100% !important;
  min-height: 48px !important;
}

:deep([role="tab"]:not(:last-child)) {
  border-right: none !important;
}

:deep([role="tab"]::before),
:deep([role="tab"]::after) {
  display: none !important;
  box-shadow: none !important;
}

:deep([role="tab"] *) {
  box-shadow: none !important;
}

:deep([role="tab"][data-state="active"]) {
  color: var(--color-text-foreground) !important;
  box-shadow: none !important;
}

:deep([role="tab"][data-state="inactive"]) {
  color: var(--color-text-muted-foreground) !important;
  box-shadow: none !important;
}
</style>

