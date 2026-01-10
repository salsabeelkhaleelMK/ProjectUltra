<template>
  <div class="h-full flex flex-col lg:flex-row overflow-hidden bg-gray-50">
    <!-- Left Sidebar - Unified Task Cards (Full-screen overlay on mobile) - Only show in card view -->
    <div 
      v-if="viewMode === 'card'"
      class="lg:relative lg:block"
      :class="showTaskListMobile ? 'fixed inset-0 z-[60] md:relative md:z-auto' : 'hidden lg:block'"
    >
        <EntityListSidebar
          title="Tasks"
          :items="filteredTasks"
          :selected-id="currentTask?.compositeId"
          :type-filter="typeFilter"
          :view-mode="viewMode"
          :selected-class="(task) => task.type === 'lead' ? 'bg-white border-2 border-blue-500 shadow-md' : 'bg-white border-2 border-purple-500 shadow-md'"
          :unselected-class="getUnselectedClass"
          :open-menu-id="openCardMenu"
          :getName="(task) => {
            // Ensure customer exists and has name
            const customer = task.customer
            if (customer && customer.name) {
              return customer.name
            }
            // Generate from name if initials exist but name doesn't (shouldn't happen, but defensive)
            if (customer && !customer.name && customer.email) {
              return customer.email.split('@')[0] || 'Unknown'
            }
            return 'Unknown'
          }"
          :getInitials="(task) => {
            // Ensure customer exists
            const customer = task.customer
            if (customer && customer.initials) {
              return customer.initials
            }
            // Generate from name if available
            if (customer && customer.name) {
              const initials = customer.name.split(' ').map(n => n[0]).filter(Boolean).join('').toUpperCase().slice(0, 2)
              return initials || '?'
            }
            return '?'
          }"
          :getVehicleInfo="(task) => {
            if (task.type === 'lead') {
              return task.requestedCar ? `${task.requestedCar.brand} ${task.requestedCar.model}` : 'No vehicle specified'
            }
            return task.vehicle ? `${task.vehicle.brand} ${task.vehicle.model}` : 'No vehicle specified'
          }"
          :avatarClass="(task) => task.type === 'lead' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'"
          :show-mobile-close="true"
          @select="selectTask"
          @menu-click="toggleCardMenu"
          @menu-close="openCardMenu = null"
          @close="showTaskListMobile = false"
          :show-type-filter="shouldShowTypeFilter"
          @filter-change="typeFilter = $event"
          @sort-change="handleSortChange"
          @view-change="handleViewChange"
        >
          <template #badges="{ item: task }">
            <!-- Type Badge -->
            <span 
              class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase"
              :class="task.type === 'lead' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'"
            >
              {{ task.type === 'lead' ? 'Lead' : 'Opportunity' }}
            </span>
            
            <!-- Hot Badge (for leads) -->
            <span 
              v-if="task.priority === 'Hot'"
              class="px-1.5 py-0.5 bg-red-50 text-red-600 rounded text-[9px] font-bold uppercase"
            >
              HOT
            </span>
          </template>
          
          <template #location="{ item: task }">
            {{ getLocationDisplay(task) }}
          </template>
          
          <template #vehicle-status="{ item: task }">
            {{ getVehicleStatusDisplay(task) }}
          </template>
          
          <template #owner="{ item: task }">
            <span v-if="task.assignee">Assignee: {{ task.assignee }}</span>
            <span v-else>Assignee: Unassigned</span>
          </template>
          
          <template #dates="{ item: task }">
            <template v-if="task.type === 'lead' && task.nextActionDue">
              <span>Due: {{ getDateDisplay(task.nextActionDue) }}</span>
            </template>
            <template v-else-if="task.type === 'opportunity' && task.nextActionDue">
              <span>Due: {{ getDateDisplay(task.nextActionDue) }}</span>
            </template>
            <template v-else>
              <span>Due: No deadline</span>
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
        </EntityListSidebar>
    </div>
    
    <!-- Table View - Takes remaining space, detail panel shown alongside when task selected -->
    <div v-if="viewMode === 'table'" class="flex-1 flex flex-col lg:flex-row overflow-hidden min-w-0">
      <TasksTableView
        :tasks="filteredTasks"
        :current-task-id="currentTask?.compositeId"
        :highlight-id="highlightId"
        :type-filter="typeFilter"
        :sort-option="sortOption"
        :show-type-filter="shouldShowTypeFilter"
        :show-mobile-close="true"
        :open-menu-id="openCardMenu"
        :get-vehicle-type="getVehicleType"
        :get-vehicle-type-badge-class="getVehicleTypeBadgeClass"
        :get-owner-info="getOwnerInfo"
        :get-stage-badge-class="getStageBadgeClass"
        :view-mode="viewMode"
        @select="selectTask"
        @menu-click="toggleCardMenu"
        @menu-close="openCardMenu = null"
        @filter-change="typeFilter = $event"
        @sort-change="handleSortChange"
        @reassign="reassignTask"
        @close="showTaskListMobile = false"
        @view-change="handleViewChange"
        :class="currentTask ? 'lg:w-1/2' : 'w-full'"
      />
      
      <!-- Task Detail Panel for Table View -->
      <div v-if="currentTask" class="flex-1 flex flex-col overflow-hidden border-l border-gray-200 lg:w-1/2">
        <TaskShell
          :task="currentTask"
          :type="currentTask.type"
          :management-widget="managementWidget"
          :store-adapter="storeAdapter"
          :add-new-config="addNewConfig"
        >
          <template #pinned-extra="{ task }">
            <!-- Additional widgets can be added here if needed -->
          </template>
        </TaskShell>
      </div>
    </div>
    
    <!-- Main Content - Task Details (Card View Only) -->
    <div v-if="viewMode === 'card' && currentTask" class="flex-1 flex flex-col overflow-hidden">

      <!-- Mobile View Toggle + Action Buttons -->
      <div class="lg:hidden fixed bottom-6 right-4 flex flex-col gap-3 z-30">
        <!-- View Toggle Button (mobile) -->
        <button
          @click="handleViewChange(viewMode === 'card' ? 'table' : 'card')"
          class="w-14 h-14 bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition-all hover:scale-110"
          :title="viewMode === 'card' ? 'Switch to Table' : 'Switch to Cards'"
        >
          <i :class="viewMode === 'card' ? 'fa-solid fa-table text-lg' : 'fa-solid fa-list text-lg'"></i>
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
      
      <div v-if="!currentTask && viewMode === 'card'" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <i class="fa-solid fa-tasks text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">Select a task to view details</p>
        </div>
      </div>
      
      <TaskShell
        v-else-if="currentTask && viewMode === 'card'"
        :task="currentTask"
        :type="currentTask.type"
        :management-widget="managementWidget"
        :store-adapter="storeAdapter"
        :add-new-config="addNewConfig"
      >
        <template #pinned-extra="{ task }">
          <!-- Additional widgets can be added here if needed -->
        </template>
      </TaskShell>
    </div>
    
    <!-- Reassign Modal -->
    <ReassignUserModal
      :show="showReassignModal"
      @close="showReassignModal = false"
      @confirm="handleReassignConfirm"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLeadsStore } from '@/stores/leads'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useUserStore } from '@/stores/user'
import { useUsersStore } from '@/stores/users'
import EntityListSidebar from '@/components/tasks/TasksList.vue'
import TasksTableView from '@/components/tasks/TasksTableView.vue'
import TaskShell from '@/components/customer/CustomerShell.vue'
import { useTaskShell } from '@/composables/useTaskShell'
import { formatCurrency, formatDeadlineFull, getDeadlineStatus } from '@/utils/formatters'
import ReassignUserModal from '@/components/modals/ReassignUserModal.vue'

const route = useRoute()
const router = useRouter()
const leadsStore = useLeadsStore()
const opportunitiesStore = useOpportunitiesStore()
const userStore = useUserStore()
const usersStore = useUsersStore()

// View mode state with localStorage persistence (default to table)
const viewMode = ref(localStorage.getItem('tasksViewMode') || 'table')

// Get highlight ID from query string
const highlightId = computed(() => {
  return route.query.highlight || null
})

// Watch for changes and persist
watch(viewMode, (newMode) => {
  localStorage.setItem('tasksViewMode', newMode)
})

// Handle view mode changes with navigation logic
const handleViewChange = (newViewMode) => {
  const previousMode = viewMode.value
  
  // Capture current task before navigation (since route change will clear it)
  const taskToHighlight = currentTask.value
  
  viewMode.value = newViewMode
  
  // If switching to table view while a task is selected, navigate to /tasks with highlight query
  if (newViewMode === 'table' && taskToHighlight) {
    router.push({ 
      path: '/tasks', 
      query: { highlight: taskToHighlight.compositeId } 
    })
  }
  // If switching to card view and we have a highlight query, navigate to that task
  else if (newViewMode === 'card' && highlightId.value) {
    const [type, id] = highlightId.value.split('-')
    router.push({ 
      path: `/tasks/${id}`, 
      query: { type } 
    })
  }
  // If switching to card view without highlight and no current task, just go to /tasks (no selection)
  else if (newViewMode === 'card' && !highlightId.value && !currentTask.value) {
    router.push({ path: '/tasks' })
  }
}

// Helper function to display date with conditional logic (relative if today, absolute if future)
const getDateDisplay = (isoTimestamp) => {
  if (!isoTimestamp) return 'No deadline'
  
  const deadlineStatus = getDeadlineStatus(isoTimestamp)
  
  // If overdue, show "OVERDUE"
  if (deadlineStatus.type === 'overdue') {
    return 'OVERDUE'
  }
  
  // If today or urgent (within 2 hours), show relative time
  if (deadlineStatus.type === 'today' || deadlineStatus.type === 'urgent') {
    return deadlineStatus.relativeTime
  }
  
  // For future dates (normal), show absolute date/time
  return formatDeadlineFull(isoTimestamp)
}

// Helper function to get vehicle type from mockData
const getVehicleType = (task) => {
  const vehicle = task.type === 'lead' ? task.requestedCar : task.vehicle
  if (!vehicle || !vehicle.type) return null
  
  // Map the type from mockData to display format
  const typeMap = {
    'New': { type: 'new', label: 'New' },
    'New 0km': { type: '0km', label: 'New 0km' },
    'Used': { type: 'used', label: 'Used' },
    'Demo': { type: 'demo', label: 'Demo' }
  }
  
  return typeMap[vehicle.type] || { type: vehicle.type.toLowerCase(), label: vehicle.type }
}

// Helper function to get vehicle type badge class
const getVehicleTypeBadgeClass = (vehicleType) => {
  if (!vehicleType) return ''
  
  const classes = {
    'new': 'bg-green-50 text-green-700',
    '0km': 'bg-blue-50 text-blue-700',
    'used': 'bg-orange-50 text-orange-700',
    'demo': 'bg-purple-50 text-purple-700'
  }
  
  return classes[vehicleType.type] || 'bg-gray-50 text-gray-700'
}

// Helper function to get owner info (name and initials)
const getOwnerInfo = (task) => {
  if (!task || !task.assignee) {
    return { name: 'Unassigned', initials: '?' }
  }
  
  // Get initials from assigneeInitials if available, otherwise generate
  const initials = task.assigneeInitials || task.assignee.split(' ').map(n => n[0]).join('')
  
  return {
    name: task.assignee,
    initials: initials
  }
}

// Helper function to extract city from customer address
const getCustomerCity = (task) => {
  if (!task || !task.customer || !task.customer.address) {
    return null
  }
  
  const address = task.customer.address
  // Address format: "Street, PostalCode City" or "Street, City"
  // Extract city (last part after comma)
  const parts = address.split(',')
  if (parts.length > 1) {
    const cityPart = parts[parts.length - 1].trim()
    // Remove postal code if present (numbers at start)
    const city = cityPart.replace(/^\d+\s*/, '').trim()
    return city || null
  }
  return null
}

// Helper function to get location display (city • source)
const getLocationDisplay = (task) => {
  const city = getCustomerCity(task)
  const source = task.source || 'Unknown'
  
  if (city) {
    return `${city} • ${source}`
  }
  return source
}

// Helper function to format vehicle status (type / kilometers)
const getVehicleStatusDisplay = (task) => {
  const vehicle = task.type === 'lead' ? task.requestedCar : task.vehicle
  if (!vehicle) {
    return 'No vehicle'
  }
  
  const vehicleType = getVehicleType(task)
  const typeLabel = vehicleType ? vehicleType.label : (vehicle.type || 'Unknown')
  
  // Format kilometers
  let kmDisplay = ''
  if (vehicle.kilometers !== undefined && vehicle.kilometers !== null) {
    if (vehicle.kilometers >= 1000) {
      kmDisplay = `${(vehicle.kilometers / 1000).toFixed(0)}k`
    } else {
      kmDisplay = `${vehicle.kilometers}`
    }
  }
  
  if (kmDisplay) {
    return `${typeLabel} / ${kmDisplay}`
  }
  return typeLabel
}

// Helper function to get task status for display (leads: status, opportunities: stage)
const getTaskStatusDisplay = (task) => {
  if (task.type === 'lead') {
    return task.status || 'Unknown'
  } else {
    return task.stage || 'Unknown'
  }
}

const typeFilter = ref('all') // 'all', 'lead', 'opportunity'
const sortOption = ref('none') // 'none', 'urgent-first', 'assigned-to-me', 'assigned-to-my-team'
const openCardMenu = ref(null)
const showTaskListMobile = ref(false)
const showReassignModal = ref(false)
const taskToReassign = ref(null)

// Combine leads and opportunities with type property and composite key
// Filter based on user role
const allTasks = computed(() => {
  // Filter out disqualified leads
  const activeLeads = leadsStore.leads.filter(lead => !lead.isDisqualified)
  const leads = activeLeads.map(lead => {
    // Ensure customer object is preserved
    const task = { ...lead, type: 'lead', compositeId: `lead-${lead.id}` }
    // Explicitly ensure customer is present (spread should handle this, but being defensive)
    if (!task.customer && lead.customer) {
      task.customer = lead.customer
    }
    return task
  })
  const opportunities = opportunitiesStore.opportunities.map(opp => {
    // Ensure customer object is preserved
    const task = { ...opp, type: 'opportunity', compositeId: `opportunity-${opp.id}` }
    // Explicitly ensure customer is present (spread should handle this, but being defensive)
    if (!task.customer && opp.customer) {
      task.customer = opp.customer
    }
    return task
  })
  
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
  
  return tasks
})

// Filter and sort tasks
const filteredTasks = computed(() => {
  let tasks = allTasks.value
  
  // Apply type filter
  if (typeFilter.value !== 'all') {
    tasks = tasks.filter(task => task.type === typeFilter.value)
  }
  
  // Apply sort
  if (sortOption.value === 'urgent-first') {
    // Sort by priority (Hot first), then by date
    tasks = [...tasks].sort((a, b) => {
      // Hot priority first
      if (a.priority === 'Hot' && b.priority !== 'Hot') return -1
      if (a.priority !== 'Hot' && b.priority === 'Hot') return 1
      // Then by date (most recent first)
      const dateA = new Date(a.lastActivity || a.createdAt || 0)
      const dateB = new Date(b.lastActivity || b.createdAt || 0)
      return dateB - dateA
    })
  } else if (sortOption.value === 'assigned-to-me') {
    // Filter to only tasks assigned to current user
    const currentUserName = userStore.currentUser.name
    tasks = tasks.filter(task => task.assignee === currentUserName)
    // Then sort by date
    tasks = [...tasks].sort((a, b) => {
      const dateA = new Date(a.lastActivity || a.createdAt || 0)
      const dateB = new Date(b.lastActivity || b.createdAt || 0)
      return dateB - dateA
    })
  } else if (sortOption.value === 'assigned-to-my-team') {
    // Filter to tasks assigned to user's team
    const currentUser = userStore.currentUser
    // Get team members based on role
    // Salesmen see Sales team, Operators see BDC team, Managers see all
    let teamMemberNames = []
    if (currentUser.role === 'manager') {
      // Managers see all users
      teamMemberNames = usersStore.users.map(u => u.name)
    } else if (currentUser.role === 'salesman') {
      // Salesmen see Sales team (other salesmen)
      teamMemberNames = usersStore.users.filter(u => u.role === 'salesman').map(u => u.name)
    } else if (currentUser.role === 'operator') {
      // Operators see BDC team (other operators)
      teamMemberNames = usersStore.users.filter(u => u.role === 'operator').map(u => u.name)
    }
    tasks = tasks.filter(task => teamMemberNames.includes(task.assignee))
    // Then sort by date
    tasks = [...tasks].sort((a, b) => {
      const dateA = new Date(a.lastActivity || a.createdAt || 0)
      const dateB = new Date(b.lastActivity || b.createdAt || 0)
      return dateB - dateA
    })
  } else {
    // Default: sort by lastActivity or createdAt (most recent first)
    tasks = [...tasks].sort((a, b) => {
      const dateA = new Date(a.lastActivity || a.createdAt || 0)
      const dateB = new Date(b.lastActivity || b.createdAt || 0)
      return dateB - dateA
    })
  }
  
  return tasks
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
  
  // Always use compositeId for matching to avoid conflicts between leads and opportunities with same ID
  if (routeType) {
    const compositeId = `${routeType}-${taskId}`
    return allTasks.value.find(t => t.compositeId === compositeId) || null
  }
  
  // If no type specified, try to find by compositeId in filtered list first
  const filtered = typeFilter.value !== 'all' 
    ? allTasks.value.filter(t => t.type === typeFilter.value)
    : allTasks.value
  
  // Try both lead and opportunity compositeIds
  const leadCompositeId = `lead-${taskId}`
  const oppCompositeId = `opportunity-${taskId}`
  
  const task = filtered.find(t => t.compositeId === leadCompositeId || t.compositeId === oppCompositeId)
  if (task) return task
  
  // Fallback: check all tasks by compositeId
  return allTasks.value.find(t => t.compositeId === leadCompositeId || t.compositeId === oppCompositeId) || null
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

// Use composable to get TaskShell props (same as Lead.vue)
const taskShellProps = useTaskShell(currentTask)
const managementWidget = taskShellProps.managementWidget
const storeAdapter = taskShellProps.storeAdapter
const addNewConfig = taskShellProps.addNewConfig

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
  }
})

// Watch for route changes
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadTaskById(newId)
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
  // When selecting a task, switch to card view to show the detail
  if (viewMode.value === 'table') {
    viewMode.value = 'card'
  }
  router.push({ path: `/tasks/${id}`, query: { type } })
  showTaskListMobile.value = false // Close mobile list after selection
}

const toggleCardMenu = (taskId) => {
  openCardMenu.value = openCardMenu.value === taskId ? null : taskId
}

const reassignTask = (task) => {
  taskToReassign.value = task
  showReassignModal.value = true
  openCardMenu.value = null
}

const handleSortChange = (sort) => {
  sortOption.value = sort
}

const handleReassignConfirm = async (assignee) => {
  if (!taskToReassign.value) return
  
  const task = taskToReassign.value
  const assigneeName = assignee.name
  
  if (task.type === 'lead') {
    await leadsStore.modifyLead(task.id, { 
      assignee: assigneeName,
      assigneeType: assignee.type,
      teamId: assignee.type === 'team' ? assignee.id : null
    })
  } else if (task.type === 'opportunity') {
    await opportunitiesStore.updateOpportunity(task.id, { 
      assignee: assigneeName,
      assigneeType: assignee.type,
      teamId: assignee.type === 'team' ? assignee.id : null
    })
  }
  
  showReassignModal.value = false
  taskToReassign.value = null
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
    // Opportunity stages
    'Open': 'bg-blue-50 text-blue-700',
    'Open Opportunities': 'bg-blue-50 text-blue-700',
    'Open opportunity': 'bg-blue-50 text-blue-700',
    'Qualified': 'bg-purple-50 text-purple-700',
    'In Negotiation': 'bg-orange-50 text-orange-700',
    'Opportunity in negotiation': 'bg-orange-50 text-orange-700',
    'Registration': 'bg-indigo-50 text-indigo-700',
    'Closed': 'bg-gray-100 text-gray-700',
    'Closed opportunity': 'bg-gray-100 text-gray-700',
    'Closed Lost': 'bg-red-50 text-red-700',
    'Won': 'bg-green-50 text-green-700',
    'Lost': 'bg-red-50 text-red-700',
    // Lead statuses
    'Valid': 'bg-green-50 text-green-700',
    'Not valid': 'bg-red-50 text-red-700',
    'To be validated': 'bg-yellow-50 text-yellow-700',
    'Not interested': 'bg-gray-100 text-gray-700'
  }
  return classes[stage] || 'bg-gray-100 text-gray-700'
}
</script>

<style scoped>
.view-fade-enter-active,
.view-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.view-fade-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.view-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
