<template>
  <div class="h-full flex flex-col lg:flex-row overflow-hidden bg-gray-50">
    <!-- Left Sidebar - Unified Task Cards (Full-screen overlay on mobile) -->
    <div 
      class="lg:relative lg:block"
      :class="showTaskListMobile ? 'fixed inset-0 z-[60] md:relative md:z-auto' : 'hidden lg:block'"
    >
      <TasksList
        title="My Tasks"
        :items="filteredTasks"
        :selected-id="currentTask?.compositeId"
        :type-filter="typeFilter"
        :selected-class="(task) => task.type === 'lead' ? 'bg-white border-2 border-blue-500 shadow-md' : 'bg-white border-2 border-purple-500 shadow-md'"
        :unselected-class="getUnselectedClass"
        :open-menu-id="openCardMenu"
        :getName="(task) => task.customer.name"
        :getInitials="(task) => task.customer.initials"
        :getVehicleInfo="(task) => task.type === 'lead' ? `${task.requestedCar.brand} ${task.requestedCar.model}` : `${task.vehicle.brand} ${task.vehicle.model}`"
        :avatarClass="(task) => task.type === 'lead' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'"
        :show-mobile-close="true"
        @select="selectTask"
        @menu-click="toggleCardMenu"
        @menu-close="openCardMenu = null"
        @close="showTaskListMobile = false"
        :show-type-filter="shouldShowTypeFilter"
        @filter-change="typeFilter = $event"
      >
      <template #badges="{ item: task }">
        <!-- Type Badge -->
        <span 
          class="text-[10px] font-bold uppercase px-2 py-0.5 rounded border"
          :class="task.type === 'lead' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'"
        >
          {{ task.type === 'lead' ? 'Lead' : 'Opportunity' }}
        </span>
        
        <!-- Lead-specific badges -->
        <template v-if="task.type === 'lead'">
          <span class="bg-gray-100 text-gray-600 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-gray-200">{{ task.status }}</span>
          <span 
            v-if="task.priority === 'Hot'"
            class="bg-red-50 text-red-600 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-red-100 flex items-center gap-1"
          >
            <i class="fa-solid fa-fire text-[9px]"></i> Hot
          </span>
        </template>
        
        <!-- Opportunity-specific badges -->
        <template v-else>
          <span 
            class="text-[10px] font-bold uppercase px-2 py-0.5 rounded border"
            :class="getStageBadgeClass(task.stage)"
          >
            {{ task.stage }}
          </span>
        </template>
      </template>
      
      <template #meta="{ item: task }">
        <template v-if="task.type === 'lead'">
          <div 
            class="flex items-center gap-1.5" 
            :class="formatDueDate(task.nextActionDue) === 'OVERDUE' ? 'text-red-500' : task.priority === 'Hot' ? 'text-orange-500' : 'text-gray-400'"
          >
            <i 
              class="text-[10px]"
              :class="formatDueDate(task.nextActionDue) === 'OVERDUE' ? 'fa-solid fa-exclamation-triangle' : 'fa-solid fa-clock'"
            ></i>
            <span class="text-[10px] font-bold uppercase tracking-wide">
              {{ formatDueDate(task.nextActionDue) === 'OVERDUE' ? 'OVERDUE' : `Due in ${formatDueDate(task.nextActionDue)}` }}
            </span>
          </div>
        </template>
        <template v-else>
          <div class="text-right">
            <div class="text-sm font-bold text-gray-900">€{{ formatCurrency(task.value) }}</div>
            <div class="mt-1.5">
              <div class="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  class="h-full rounded-full"
                  :class="task.probability >= 70 ? 'bg-green-500' : task.probability >= 40 ? 'bg-blue-500' : 'bg-orange-500'"
                  :style="{ width: `${task.probability}%` }"
                ></div>
              </div>
              <div class="text-[10px] text-gray-500 mt-0.5">{{ task.probability }}% PROB</div>
            </div>
          </div>
        </template>
      </template>
      
      <template #menu="{ item: task }">
        <button 
          @click.stop="reassignTask(task)"
          class="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-gray-50 flex items-center gap-2"
        >
          <i class="fa-solid fa-share text-gray-400"></i> Reassign
        </button>
        <button 
          v-if="task.priority !== 'Hot'"
          @click.stop="markAsHot(task)"
          class="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-gray-50 flex items-center gap-2"
        >
          <i class="fa-solid fa-fire text-orange-500"></i> Mark as hot
        </button>
        <button 
          v-else
          @click.stop="unmarkAsHot(task)"
          class="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-gray-50 flex items-center gap-2"
        >
          <i class="fa-regular fa-snowflake text-gray-400"></i> Unmark as hot
        </button>
      </template>
    </TasksList>
    </div>
    
    <!-- Main Content - Task Details -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Mobile Floating Action Buttons -->
      <div v-if="currentTask" class="lg:hidden xl:hidden fixed bottom-6 right-4 flex flex-col gap-3 z-30">
        <!-- Activity Summary Button -->
        <button
          @click="showActivityMobile = !showActivityMobile"
          class="w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-purple-700 transition-all hover:scale-110"
          title="Activity"
        >
          <i class="fa-solid fa-clock-rotate-left text-lg"></i>
        </button>
        
        <!-- Task List Button -->
        <button
          @click="showTaskListMobile = !showTaskListMobile"
          class="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all hover:scale-110"
          title="Tasks"
        >
          <i class="fa-solid fa-list text-lg"></i>
        </button>
      </div>
      
      <div v-if="!currentTask" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <i class="fa-solid fa-tasks text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">Select a task to view details</p>
        </div>
      </div>
      
      <TaskShell
        v-else
        :task="currentTask"
        :type="currentTask.type"
        :management-widget="managementWidget"
        :store-adapter="storeAdapter"
        :add-new-config="addNewConfig"
      >
        <template #pinned-extra="{ task }">
          <!-- Requested Vehicle Widget - Always show on overview tab -->
          <RequestedVehicleWidget
            v-if="task.type === 'lead' && task.requestedCar"
            :brand="task.requestedCar.brand"
            :model="task.requestedCar.model"
            :year="task.requestedCar.year"
            :image="task.requestedCar.image || ''"
            :price="task.requestedCar.price || null"
            :request-message="task.requestedCar.requestMessage || ''"
            :request-type="task.requestedCar.requestType || ''"
            :source="task.source || ''"
            :dealership="task.requestedCar.dealership || ''"
            :registration="task.requestedCar.registration || ''"
            :kilometers="task.requestedCar.kilometers || null"
            :fuel-type="task.requestedCar.fuelType || ''"
            :gear-type="task.requestedCar.gearType || ''"
            :vin="task.requestedCar.vin || ''"
            :stock-days="task.requestedCar.stockDays !== undefined ? task.requestedCar.stockDays : null"
            :channel="task.requestedCar.channel || 'Email'"
            :ad-campaign="task.requestedCar.adCampaign || ''"
            :expected-purchase-date="task.requestedCar.expectedPurchaseDate || ''"
            :fiscal-entity="task.requestedCar.fiscalEntity || ''"
            :source-details="task.requestedCar.sourceDetails || ''"
            :ad-medium="task.requestedCar.adMedium || ''"
            :ad-source="task.requestedCar.adSource || ''"
            label="Requested Car"
          />
          
          <RequestedVehicleWidget
            v-if="task.type === 'opportunity' && task.vehicle"
            :brand="task.vehicle.brand"
            :model="task.vehicle.model"
            :year="task.vehicle.year"
            :image="task.vehicle.image || ''"
            :price="task.vehicle.price || null"
            :request-message="task.vehicle.requestMessage || ''"
            :request-type="task.vehicle.requestType || ''"
            :source="task.source || ''"
            :dealership="task.vehicle.dealership || ''"
            :registration="task.vehicle.registration || ''"
            :kilometers="task.vehicle.kilometers || null"
            :fuel-type="task.vehicle.fuelType || ''"
            :gear-type="task.vehicle.gearType || ''"
            :vin="task.vehicle.vin || ''"
            :stock-days="task.vehicle.stockDays !== undefined ? task.vehicle.stockDays : null"
            :channel="task.vehicle.channel || 'Email'"
            :ad-campaign="task.vehicle.adCampaign || ''"
            :expected-purchase-date="task.vehicle.expectedPurchaseDate || ''"
            :fiscal-entity="task.vehicle.fiscalEntity || ''"
            :source-details="task.vehicle.sourceDetails || ''"
            :ad-medium="task.vehicle.adMedium || ''"
            :ad-source="task.vehicle.adSource || ''"
            label="Vehicle"
          />
        </template>
      </TaskShell>
    </div>
    
    <!-- Right Sidebar - Activity Timeline (Full-screen overlay on mobile) -->
    <div 
      v-if="showActivityMobile && currentTask"
      class="xl:hidden fixed inset-0 z-[60] bg-white"
    >
      <ActivitySummarySidebar
        :title="'Activity summary'"
        :activities="currentActivities"
        :collapsed="false"
        :show-collapse="false"
        :show="true"
        :mobile-fullscreen="true"
        @close="showActivityMobile = false"
        class="flex w-full h-full"
      />
    </div>
    
    <!-- Desktop Activity Sidebar -->
    <ActivitySummarySidebar
      :title="'Activity summary'"
      :activities="currentActivities"
      :collapsed="false"
      :show-collapse="false"
      :show="!!currentTask"
      class="hidden xl:flex"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLeadsStore } from '@/stores/leads'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useUserStore } from '@/stores/user'
import TasksList from '@/components/tasks/TasksList.vue'
import ActivitySummarySidebar from '@/components/tasks/widgets/ActivitySummarySidebar.vue'
import TaskShell from '@/components/tasks/TaskShell.vue'
import RequestedVehicleWidget from '@/components/tasks/widgets/RequestedVehicleWidget.vue'
import LeadManagementWidget from '@/components/tasks/leads/LeadManagementWidget.vue'
import OpportunityManagementWidget from '@/components/tasks/opportunities/OpportunityManagementWidget.vue'
import { formatDueDate, formatCurrency } from '@/utils/formatters'

const route = useRoute()
const router = useRouter()
const leadsStore = useLeadsStore()
const opportunitiesStore = useOpportunitiesStore()
const userStore = useUserStore()

const typeFilter = ref('all') // 'all', 'lead', 'opportunity'
const openCardMenu = ref(null)
const showTaskListMobile = ref(false)
const showActivityMobile = ref(false)

// Combine leads and opportunities with type property and composite key
// Filter based on user role
const allTasks = computed(() => {
  // Filter out disqualified leads
  const activeLeads = leadsStore.leads.filter(lead => !lead.isDisqualified)
  const leads = activeLeads.map(lead => ({ ...lead, type: 'lead', compositeId: `lead-${lead.id}` }))
  const opportunities = opportunitiesStore.opportunities.map(opp => ({ ...opp, type: 'opportunity', compositeId: `opportunity-${opp.id}` }))
  
  // Filter by role
  let tasks = []
  if (userStore.isOperator()) {
    // Operators only see leads
    tasks = leads
  } else if (userStore.isSalesman()) {
    // Salesmen only see opportunities
    tasks = opportunities
  } else {
    // Managers see everything
    tasks = [...leads, ...opportunities]
  }
  
  // Sort by lastActivity or createdAt (most recent first)
  return tasks.sort((a, b) => {
    const dateA = new Date(a.lastActivity || a.createdAt || 0)
    const dateB = new Date(b.lastActivity || b.createdAt || 0)
    return dateB - dateA
  })
})

// Filter tasks by type
const filteredTasks = computed(() => {
  if (typeFilter.value === 'all') return allTasks.value
  return allTasks.value.filter(task => task.type === typeFilter.value)
})

// Check if user has both leads and opportunities (only show filter if they have both types)
const shouldShowTypeFilter = computed(() => {
  const hasLeads = allTasks.value.some(task => task.type === 'lead')
  const hasOpportunities = allTasks.value.some(task => task.type === 'opportunity')
  return hasLeads && hasOpportunities
})

// Get current task based on route ID and query param type
const currentTask = computed(() => {
  const taskId = parseInt(route.params.id)
  const routeType = route.query.type // 'lead' or 'opportunity' from query param
  
  // If type is specified in query, use it; otherwise check both stores
  if (routeType) {
    return allTasks.value.find(t => t.id === taskId && t.type === routeType) || null
  }
  
  // Try to find in both, but prefer the one that matches the current filter
  const filtered = typeFilter.value !== 'all' 
    ? allTasks.value.filter(t => t.type === typeFilter.value)
    : allTasks.value
  
  const task = filtered.find(t => t.id === taskId)
  if (task) return task
  
  // Fallback: check all tasks
  return allTasks.value.find(t => t.id === taskId) || null
})

// Get current activities based on task type
const currentActivities = computed(() => {
  if (!currentTask.value) return []
  if (currentTask.value.type === 'lead') {
    return leadsStore.currentLeadActivities
  } else {
    return opportunitiesStore.currentOpportunityActivities
  }
})

// Management widget based on task type
const managementWidget = computed(() => {
  if (!currentTask.value) return null
  return currentTask.value.type === 'lead' 
    ? LeadManagementWidget 
    : OpportunityManagementWidget
})

// Store adapter for TaskShell
const storeAdapter = computed(() => {
  if (!currentTask.value) return null
  
  if (currentTask.value.type === 'lead') {
    return {
      currentActivities: computed(() => leadsStore.currentLeadActivities),
      addActivity: (taskId, activity) => leadsStore.addActivity(taskId, activity),
      updateActivity: (taskId, activityId, updates) => leadsStore.updateActivity(taskId, activityId, updates),
      deleteActivity: (taskId, activityId) => leadsStore.deleteActivity(taskId, activityId)
    }
  } else {
    return {
      currentActivities: computed(() => opportunitiesStore.currentOpportunityActivities),
      addActivity: (taskId, activity) => opportunitiesStore.addActivity(taskId, activity),
      updateActivity: (taskId, activityId, updates) => opportunitiesStore.updateActivity(taskId, activityId, updates),
      deleteActivity: (taskId, activityId) => opportunitiesStore.deleteActivity(taskId, activityId)
    }
  }
})

// Add new config for TaskShell
const addNewConfig = computed(() => {
  if (!currentTask.value) return { overviewActions: [], tabActions: [] }
  
  if (currentTask.value.type === 'lead') {
    return {
      overviewActions: ['financing', 'tradein', 'purchase'],
      tabActions: ['note', 'call', 'email', 'sms', 'whatsapp', 'attachment']
    }
  } else {
    return {
      overviewActions: ['financing', 'tradein', 'purchase'],
      tabActions: ['note', 'call', 'email', 'sms', 'whatsapp', 'attachment']
    }
  }
})

// Get unselected class based on task type
const getUnselectedClass = computed(() => {
  return (task) => {
    if (task.type === 'lead') {
      return 'bg-white border border-gray-200 hover:border-blue-300'
    } else {
      return 'bg-white border border-gray-200 hover:border-purple-300'
    }
  }
})

// Load data on mount
onMounted(() => {
  leadsStore.loadLeads()
  opportunitiesStore.loadOpportunities()
  
  const taskId = route.params.id
  if (taskId) {
    loadTaskById(taskId)
  } else {
    // Auto-select first task if no task is selected
    selectFirstTask()
  }
})

// Auto-select first task
const selectFirstTask = () => {
  const firstTask = filteredTasks.value[0]
  if (firstTask) {
    router.replace({ path: `/tasks/${firstTask.id}`, query: { type: firstTask.type } })
  }
}

// Watch for route changes
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadTaskById(newId)
  } else {
    // Auto-select first task if navigated to /tasks without an ID
    selectFirstTask()
  }
})

// Watch for task changes to load activities
watch(currentTask, (task) => {
  if (task) {
    if (task.type === 'lead') {
      leadsStore.loadLeadById(task.id)
    } else {
      opportunitiesStore.loadOpportunityById(task.id)
    }
  }
}, { immediate: true })

const loadTaskById = (id) => {
  const taskId = parseInt(id)
  const task = allTasks.value.find(t => t.id === taskId)
  
  if (task) {
    if (task.type === 'lead') {
      leadsStore.loadLeadById(taskId)
    } else {
      opportunitiesStore.loadOpportunityById(taskId)
    }
  }
}

const selectTask = (compositeId) => {
  // compositeId is in format "lead-1" or "opportunity-1"
  const [type, id] = compositeId.split('-')
  router.push({ path: `/tasks/${id}`, query: { type } })
  showTaskListMobile.value = false // Close mobile list after selection
}

const toggleCardMenu = (taskId) => {
  openCardMenu.value = openCardMenu.value === taskId ? null : taskId
}

const reassignTask = (task) => {
  // Placeholder: in a real implementation this would open a modal
  // to change the assignee. For now we only close the menu.
  openCardMenu.value = null
}

const markAsHot = async (task) => {
  openCardMenu.value = null
  if (task.type === 'lead') {
    await leadsStore.modifyLead(task.id, { priority: 'Hot' })
  } else if (task.type === 'opportunity') {
    await opportunitiesStore.modifyOpportunity(task.id, { priority: 'Hot' })
  }
}

const unmarkAsHot = async (task) => {
  openCardMenu.value = null
  if (task.type === 'lead') {
    await leadsStore.modifyLead(task.id, { priority: 'Normal' })
  } else if (task.type === 'opportunity') {
    await opportunitiesStore.modifyOpportunity(task.id, { priority: 'Normal' })
  }
}

const getStageBadgeClass = (stage) => {
  const classes = {
    'Open': 'bg-blue-100 text-blue-700 border-blue-200',
    'Open Opportunities': 'bg-blue-100 text-blue-700 border-blue-200',
    'Open opportunity': 'bg-blue-100 text-blue-700 border-blue-200',
    'Qualified': 'bg-purple-100 text-purple-700 border-purple-200',
    'In Negotiation': 'bg-orange-100 text-orange-700 border-orange-200',
    'Opportunity in negotiation': 'bg-orange-100 text-orange-700 border-orange-200',
    'Registration': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Closed': 'bg-gray-100 text-gray-700 border-gray-200',
    'Closed opportunity': 'bg-gray-100 text-gray-700 border-gray-200',
    'Closed Lost': 'bg-red-100 text-red-700 border-red-200',
    'Won': 'bg-green-100 text-green-700 border-green-200',
    'Lost': 'bg-red-100 text-red-700 border-red-200'
  }
  return classes[stage] || 'bg-gray-100 text-gray-700 border-gray-200'
}
</script>

