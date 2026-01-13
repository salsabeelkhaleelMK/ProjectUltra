<template>
  <div class="h-full flex flex-col lg:flex-row overflow-hidden" style="background-color: #f5f5f5;">
    <!-- Unified Mobile Header - Shows when task is selected (both views) -->
    <div v-if="currentTask" class="lg:hidden border-b border-gray-200 shrink-0" style="background-color: #f5f5f5;">
      <div class="px-4 py-3 flex items-center justify-between gap-3">
        <!-- Back Button -->
        <button
          @click="handleBackToTaskList"
          class="w-11 h-11 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
          aria-label="Back to task list"
        >
          <i class="fa-solid fa-arrow-left text-lg"></i>
        </button>
      </div>
    </div>

    <!-- Card View - Similar structure to table view -->
    <div v-if="viewMode === 'card'" class="flex-1 flex flex-col lg:flex-row overflow-hidden min-w-0">
      <!-- Card List (left side on desktop, full screen on mobile when no task selected) -->
      <div 
        class="flex flex-col overflow-hidden"
        :class="currentTask ? 'hidden lg:flex shrink-0' : 'w-full lg:w-auto lg:shrink-0'"
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
            // For opportunities: prefer vehicle over requestedCar (matching vehicleWidgetData logic)
            const vehicle = task.vehicle || task.requestedCar
            return vehicle ? `${vehicle.brand} ${vehicle.model}` : 'No vehicle specified'
          }"
          :avatarClass="(task) => task.type === 'lead' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'"
          :show-mobile-close="false"
          @select="selectTask"
          @menu-click="toggleCardMenu"
          @menu-close="openCardMenu = null"
          @close="handleBackToTaskList"
          :show-type-filter="shouldShowTypeFilter"
          @filter-change="typeFilter = $event"
          @sort-change="handleSortChange"
          @view-change="handleViewChange"
        >
          <template #badges="{ item: task }">
            <!-- Type Badge -->
            <Badge
              v-if="task && task.type"
              :text="task.type === 'lead' ? 'Lead' : 'Opportunity'"
              size="small"
              :theme="task.type === 'lead' ? 'blue' : 'gray'"
            />
            
            <!-- Urgency Badge (for leads when urgency is enabled) -->
            <Badge
              v-if="task && task.type === 'lead' && settingsStore.getSetting('urgencyEnabled') !== false && task.urgencyLevel"
              :text="`${getUrgencyIcon(task.urgencyLevel)} ${task.urgencyLevel}`"
              size="small"
              :class="getUrgencyColorClass(task.urgencyLevel)"
            />
            
            <!-- Hot Badge (for leads, fallback if urgency disabled) -->
            <Badge
              v-if="task && task.priority === 'Hot' && (settingsStore.getSetting('urgencyEnabled') === false || task.type !== 'lead')"
              text="HOT"
              size="small"
              theme="red"
            />
          </template>
          
          <template #location="{ item: task }">
            {{ getCustomerCity(task) || 'Unknown' }}
          </template>
          
          <template #source="{ item: task }">
            {{ task.source || task.customer?.source || 'Unknown' }}
          </template>
          
          <template #vehicle-status="{ item: task }">
            {{ getVehicleStatusDisplay(task) }}
          </template>
          
          <template #owner="{ item: task }">
            <template v-if="task.assignee">
              <div class="flex items-center gap-2">
                <div 
                  class="w-5 h-5 rounded-full bg-black text-white font-medium flex items-center justify-center text-xs shrink-0"
                >
                  {{ getAssigneeInitials(task.assignee) }}
                </div>
                <span class="text-gray-600 font-medium">{{ task.assignee }}</span>
              </div>
            </template>
            <span v-else>Unassigned</span>
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
            <!-- Reopen Lead (only for closed leads) -->
            <button 
              v-if="task.type === 'lead' && (task.isDisqualified || (task.stage && task.stage.startsWith('Closed')) || (task.displayStage && task.displayStage.startsWith('Closed')))"
              @click.stop="reopenLead(task)"
              class="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <i class="fa-solid fa-rotate-left text-blue-500"></i> Reopen Lead
            </button>
            <button 
              @click.stop="reassignTask(task)"
              class="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <i class="fa-solid fa-share text-gray-400"></i> Reassign
            </button>
            <button 
              v-if="task.priority !== 'Hot'"
              @click.stop="markAsHot(task)"
              class="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <i class="fa-solid fa-fire text-orange-500"></i> Mark as hot
            </button>
            <button 
              v-else
              @click.stop="unmarkAsHot(task)"
              class="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <i class="fa-regular fa-snowflake text-gray-400"></i> Unmark as hot
            </button>
          </template>
        </EntityListSidebar>
      </div>
      
      <!-- Task Detail Panel for Card View (right side on desktop, full screen on mobile) -->
      <div v-if="currentTask" class="flex-1 flex flex-col overflow-hidden lg:border-l border-gray-200">
        <TaskShell
          :task="currentTask"
          :type="currentTask.type"
          :management-widget="managementWidget"
          :store-adapter="storeAdapter"
          :add-new-config="addNewConfig"
        >
          <template #pinned-extra="{ task }">
            <VehicleWidget
              v-if="vehicleWidgetData"
              v-bind="vehicleWidgetData"
            />
          </template>
        </TaskShell>
      </div>
      
      <!-- Empty State for Card View (right side on desktop, hidden on mobile) -->
      <div v-if="!currentTask" class="hidden lg:flex flex-1 flex-col overflow-hidden lg:border-l border-gray-200">
        <div class="flex-1 flex items-center justify-center p-8">
          <div class="text-center max-w-sm">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
              <i class="fa-solid fa-tasks text-2xl text-gray-400"></i>
            </div>
            <h3 class="text-base font-semibold text-gray-900 mb-2">No task selected</h3>
            <p class="text-sm text-gray-500">Select a task from the list to view its details and manage activities</p>
          </div>
        </div>
      </div>
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
        :show-closed="showClosed"
        :show-mobile-close="false"
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
        @toggle-closed="showClosed = $event"
        @reassign="reassignTask"
          @close="handleBackToTaskList"
        @view-change="handleViewChange"
        :class="currentTask ? 'hidden lg:flex shrink-0' : 'flex-1 w-full'"
      />
      
      <!-- Task Detail Panel for Table View (right side on desktop, full screen on mobile) -->
      <div v-if="currentTask" class="flex-1 flex flex-col overflow-hidden lg:border-l border-gray-200">
        <TaskShell
          :task="currentTask"
          :type="currentTask.type"
          :management-widget="managementWidget"
          :store-adapter="storeAdapter"
          :add-new-config="addNewConfig"
        >
          <template #pinned-extra="{ task }">
            <!-- VehicleWidget - Shows requested car for leads/opportunities -->
            <VehicleWidget
              v-if="vehicleWidgetData"
              v-bind="vehicleWidgetData"
            />
          </template>
        </TaskShell>
      </div>
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
import { Badge } from '@motork/component-library'
import EntityListSidebar from '@/components/tasks/TasksList.vue'
import TasksTableView from '@/components/tasks/TasksTableView.vue'
import TaskShell from '@/components/customer/CustomerShell.vue'
import { useTaskShell } from '@/composables/useTaskShell'
import { formatCurrency, formatDeadlineFull, getDeadlineStatus } from '@/utils/formatters'
import ReassignUserModal from '@/components/modals/ReassignUserModal.vue'
import { getTransitionHandler } from '@/composables/useLeadStateMachine'
import { LEAD_STAGES, getDisplayStage } from '@/utils/stageMapper'
import { calculateLeadUrgency, getUrgencyIcon, getUrgencyColorClass } from '@/composables/useLeadUrgency'
import { useSettingsStore } from '@/stores/settings'
import VehicleWidget from '@/components/shared/vehicles/VehicleWidget.vue'

const route = useRoute()
const router = useRouter()
const leadsStore = useLeadsStore()
const opportunitiesStore = useOpportunitiesStore()
const userStore = useUserStore()
const usersStore = useUsersStore()
const settingsStore = useSettingsStore()

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

// Helper function to get assignee initials
const getAssigneeInitials = (assigneeName) => {
  if (!assigneeName) return '?'
  const parts = assigneeName.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return assigneeName.substring(0, 2).toUpperCase()
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
const showClosed = ref(false) // Toggle to show/hide closed (disqualified) leads
const openCardMenu = ref(null)
const showTaskListMobile = ref(false)
const showReassignModal = ref(false)
const taskToReassign = ref(null)

// Combine leads and opportunities with type property and composite key
// Filter based on user role
const allTasks = computed(() => {
  // Filter out disqualified leads (unless showClosed is enabled)
  const visibleLeads = showClosed.value 
    ? leadsStore.leads 
    : leadsStore.leads.filter(lead => !lead.isDisqualified)
  const leads = visibleLeads.map(lead => {
    // Calculate displayStage for lead
    const displayStage = getDisplayStage(lead, 'lead')
    
    // Ensure customer object is preserved
    const task = { 
      ...lead, 
      type: 'lead', 
      compositeId: `lead-${lead.id}`,
      displayStage  // Add calculated displayStage
    }
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
  
  // Calculate urgency scores for leads (if urgency is enabled) - needed for display
  const urgencyEnabled = settingsStore.getSetting('urgencyEnabled') !== false
  if (urgencyEnabled) {
    tasks = tasks.map(task => {
      if (task.type === 'lead' && !task.urgencyScore) {
        const urgencyResult = calculateLeadUrgency(task)
        return {
          ...task,
          urgencyScore: urgencyResult.score,
          urgencyLevel: urgencyResult.level
        }
      }
      return task
    })
  }
  
  // Apply sort
  if (sortOption.value === 'urgent-first') {
    // For leads: use urgency scoring if enabled
    
    if (urgencyEnabled) {
      // Urgency scores already calculated above, use them for sorting
      // Sort: leads by urgency score DESC, then by createdAt DESC (tiebreaker)
      // Opportunities keep existing priority-based sorting
      tasks = [...tasks].sort((a, b) => {
        // If both are leads, sort by urgency score
        if (a.type === 'lead' && b.type === 'lead') {
          const scoreA = a.urgencyScore || 0
          const scoreB = b.urgencyScore || 0
          if (scoreA !== scoreB) {
            return scoreB - scoreA // Higher score first
          }
          // Tiebreaker: most recent first
          const dateA = new Date(a.createdAt || 0)
          const dateB = new Date(b.createdAt || 0)
          return dateB - dateA
        }
        // If one is lead and one is opportunity, leads come first when urgency sorting
        if (a.type === 'lead' && b.type === 'opportunity') return -1
        if (a.type === 'opportunity' && b.type === 'lead') return 1
        // Both opportunities: use priority then date
        if (a.priority === 'Hot' && b.priority !== 'Hot') return -1
        if (a.priority !== 'Hot' && b.priority === 'Hot') return 1
        const dateA = new Date(a.lastActivity || a.createdAt || 0)
        const dateB = new Date(b.lastActivity || b.createdAt || 0)
        return dateB - dateA
      })
    } else {
      // Fallback to priority-based sorting if urgency disabled
      tasks = [...tasks].sort((a, b) => {
        // Hot priority first
        if (a.priority === 'Hot' && b.priority !== 'Hot') return -1
        if (a.priority !== 'Hot' && b.priority === 'Hot') return 1
        // Then by date (most recent first)
        const dateA = new Date(a.lastActivity || a.createdAt || 0)
        const dateB = new Date(b.lastActivity || b.createdAt || 0)
        return dateB - dateA
      })
    }
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
  // If no ID in route, return null (show list only)
  if (!route.params.id) {
    return null
  }
  
  const taskId = parseInt(route.params.id)
  // If taskId is NaN or invalid, return null
  if (isNaN(taskId)) {
    return null
  }
  
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

// Computed helper to get vehicle data for VehicleWidget
const vehicleWidgetData = computed(() => {
  if (!currentTask.value) return null
  
  let vehicle = null
  
  // For leads: only use requestedCar if it exists and has brand/model
  if (currentTask.value.type === 'lead') {
    const requestedCar = currentTask.value.requestedCar
    if (requestedCar && requestedCar.brand && requestedCar.model) {
      vehicle = requestedCar
    }
  }
  // For opportunities: prefer vehicle over requestedCar
  else if (currentTask.value.type === 'opportunity') {
    vehicle = currentTask.value.vehicle || currentTask.value.requestedCar
  }
  
  // Additional validation check
  if (!vehicle || !vehicle.brand || !vehicle.model) return null
  
  // Map vehicle and task data to VehicleWidget props
  return {
    show: true,
    label: 'Requested Car',
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    image: vehicle.image || '',
    price: vehicle.price || null,
    requestMessage: vehicle.requestMessage || '',
    requestType: currentTask.value.requestType || vehicle.requestType || '',
    source: currentTask.value.source || vehicle.source || '',
    dealership: vehicle.dealership || '',
    registration: vehicle.registration || '',
    kilometers: vehicle.kilometers !== undefined ? vehicle.kilometers : null,
    fuelType: vehicle.fuelType || '',
    gearType: vehicle.gearType || '',
    vin: vehicle.vin || '',
    stockDays: vehicle.stockDays !== undefined ? vehicle.stockDays : null,
    showOpenAd: true,
    showTechnicalSpecs: true,
    channel: 'Email', // Default, could be enhanced if task has channel field
    adCampaign: currentTask.value.sourceDetails || vehicle.adCampaign || '',
    expectedPurchaseDate: vehicle.expectedPurchaseDate || '',
    fiscalEntity: currentTask.value.fiscalEntity || '',
    sourceDetails: currentTask.value.sourceDetails || '',
    adMedium: vehicle.adMedium || '',
    adSource: vehicle.adSource || ''
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
  // When selecting a task in table view, stay in table view and show split view
  // The split view will show table on left and detail panel on right
  router.push({ path: `/tasks/${id}`, query: { type } })
}

const handleBackToTaskList = () => {
  // Navigate back to task list (no task selected)
  router.push({ path: '/tasks' })
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

const reopenLead = async (task) => {
  openCardMenu.value = null
  if (task.type !== 'lead') return
  
  try {
    const currentStage = task.displayStage || task.stage || LEAD_STAGES.NEW
    const targetStage = LEAD_STAGES.NEW // Reopen to New stage
    
    const transitionHandler = getTransitionHandler(currentStage, targetStage)
    
    if (transitionHandler) {
      const { updates, activities } = transitionHandler(task)
      
      // Apply updates
      await leadsStore.modifyLead(task.id, updates)
      
      // Log all activities
      for (const activity of activities) {
        await leadsStore.addActivity(task.id, activity)
      }
    } else {
      // Fallback to direct update if no handler found
      await leadsStore.modifyLead(task.id, {
        isDisqualified: false,
        disqualifyReason: null,
        disqualifyCategory: null,
        isDuplicate: false,
        stage: 'Open Lead',
        status: 'Open',
        nextActionDue: null,
        scheduledAppointment: null
      })
      
      await leadsStore.addActivity(task.id, {
        type: 'note',
        user: 'You',
        action: 'reopened lead',
        content: 'Lead has been reopened for qualification'
      })
    }
    
    // Reload the lead to refresh the UI
    await leadsStore.loadLeadById(task.id)
  } catch (err) {
    console.error('Failed to reopen lead:', err)
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
