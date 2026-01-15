<template>
  <div class="h-full flex flex-col lg:flex-row overflow-hidden bg-brand-gray">
    <!-- Unified Mobile Header - Shows when task is selected (both views) -->
    <MobileDetailHeader
      :show="!!currentTask"
      back-label="Back to task list"
      @back="handleBackToTaskList"
    />

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
          :initial-search-query="cardSearchQuery"
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
              if (!task.requestedCar) return 'No vehicle specified'
              const car = task.requestedCar
              const parts = [`${car.brand} ${car.model}`]
              if (car.kilometers !== undefined && car.kilometers !== null) {
                parts.push(`${car.kilometers} km`)
              }
              if (car.status) {
                parts.push(car.status)
              }
              return parts.join(' • ')
            }
            // For opportunities: prefer vehicle over requestedCar
            const vehicle = task.vehicle || task.requestedCar
            if (!vehicle) return 'No vehicle specified'
            const parts = [`${vehicle.brand} ${vehicle.model}`]
            if (vehicle.kilometers !== undefined && vehicle.kilometers !== null) {
              parts.push(`${vehicle.kilometers} km`)
            }
            if (vehicle.status) {
              parts.push(vehicle.status)
            }
            return parts.join(' • ')
          }"
          :avatarClass="(task) => task.type === 'lead' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'"
          :get-menu-items="getTaskMenuItems"
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
          
          <template #owner="{ item: task }">
            <template v-if="task.assignee">
              <div class="flex items-center gap-2">
                <div 
                  class="w-3 h-3 rounded-full bg-black text-white font-medium flex items-center justify-center text-[6px] shrink-0"
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
          
        </EntityListSidebar>
      </div>
      
      <!-- Task Detail Panel for Card View (right side on desktop, full screen on mobile) -->
      <TaskDetailView
        v-if="currentTask"
        :task="currentTask"
        :management-widget="managementWidget"
        :store-adapter="storeAdapter"
        :add-new-config="addNewConfig"
      />
      
      <!-- Empty State for Card View (right side on desktop, hidden on mobile) -->
      <div v-if="!currentTask" class="hidden lg:flex flex-1 flex-col overflow-hidden lg:border-l border-gray-200">
        <div class="flex-1 flex items-center justify-center p-8">
          <div class="text-center max-w-sm">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
              <i class="fa-solid fa-tasks text-2xl text-gray-400"></i>
            </div>
            <h3 class="text-content-bold mb-2">No task selected</h3>
            <p class="text-meta">Select a task from the list to view its details and manage activities</p>
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
      <TaskDetailView
        v-if="currentTask"
        :task="currentTask"
        :management-widget="managementWidget"
        :store-adapter="storeAdapter"
        :add-new-config="addNewConfig"
      />
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
import TaskDetailView from '@/components/tasks/TaskDetailView.vue'
import MobileDetailHeader from '@/components/shared/layout/MobileDetailHeader.vue'
import { useTaskShell } from '@/composables/useTaskShell'
import { useTaskHelpers } from '@/composables/useTaskHelpers'
import { useTaskFilters } from '@/composables/useTaskFilters'
import { useTaskSorting } from '@/composables/useTaskSorting'
import { formatCurrency } from '@/utils/formatters'
import { getStageBadgeClass } from '@/utils/formatters'
import ReassignUserModal from '@/components/modals/ReassignUserModal.vue'
import { getTransitionHandler } from '@/composables/useLeadStateMachine'
import { LEAD_STAGES } from '@/utils/stageMapper'
import { getUrgencyIcon, getUrgencyColorClass } from '@/composables/useLeadUrgency'
import { useSettingsStore } from '@/stores/settings'

const route = useRoute()
const router = useRouter()
const leadsStore = useLeadsStore()
const opportunitiesStore = useOpportunitiesStore()
const userStore = useUserStore()
const usersStore = useUsersStore()
const settingsStore = useSettingsStore()

// Use task helpers composable
const {
  getDateDisplay,
  getVehicleType,
  getVehicleTypeBadgeClass,
  getOwnerInfo,
  getCustomerCity,
  getLocationDisplay,
  getAssigneeInitials,
  getVehicleStatusDisplay,
  getTaskStatusDisplay,
  getUnselectedClass: getUnselectedClassHelper
} = useTaskHelpers()

// View mode state with localStorage persistence (default to table)
const viewMode = ref(localStorage.getItem('tasksViewMode') || 'table')

// Card view search query (for when switching from table view)
const cardSearchQuery = ref('')

// Get highlight ID from query string
const highlightId = computed(() => {
  return route.query.highlight || null
})

// Watch for changes and persist
watch(viewMode, (newMode) => {
  localStorage.setItem('tasksViewMode', newMode)
})

// Handle view mode changes with navigation logic
const handleViewChange = (newViewMode, searchQuery = '') => {
  const previousMode = viewMode.value
  
  // Capture current task before navigation (since route change will clear it)
  const taskToHighlight = currentTask.value
  
  viewMode.value = newViewMode
  
  // If switching to card view, set the search query if provided
  if (newViewMode === 'card' && searchQuery) {
    cardSearchQuery.value = searchQuery
  }
  
  // If switching to table view while a task is selected, navigate to /tasks with highlight query
  if (newViewMode === 'table' && taskToHighlight) {
    // Clear card search query when switching to table view
    cardSearchQuery.value = ''
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


const typeFilter = ref('all') // 'all', 'lead', 'opportunity'
const sortOption = ref('none') // 'none', 'urgent-first', 'assigned-to-me', 'assigned-to-my-team'
const showClosed = ref(false) // Toggle to show/hide closed (disqualified) leads
const openCardMenu = ref(null)
const showTaskListMobile = ref(false)
const showReassignModal = ref(false)
const taskToReassign = ref(null)

// Use task filters composable
const { allTasks, filterByType, shouldShowTypeFilter } = useTaskFilters(showClosed)

// Use task sorting composable
const { sortTasks } = useTaskSorting()

// Filter and sort tasks
const filteredTasks = computed(() => {
  // Apply type filter
  let tasks = filterByType(allTasks.value, typeFilter.value)
  
  // Apply sort
  tasks = sortTasks(tasks, sortOption.value)
  
  return tasks
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

// Use composable to get EntityDetailLayout props (same as Customer.vue)
const taskShellProps = useTaskShell(currentTask)
const managementWidget = taskShellProps.managementWidget
const storeAdapter = taskShellProps.storeAdapter
const addNewConfig = taskShellProps.addNewConfig

// Get unselected class based on task type (function from composable)
const getUnselectedClass = getUnselectedClassHelper

// Load data on mount
onMounted(() => {
  leadsStore.fetchLeads()
  opportunitiesStore.fetchOpportunities()
  
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
      leadsStore.fetchLeadById(task.id)
    } else {
      opportunitiesStore.fetchOpportunityById(task.id)
    }
  }
}, { immediate: true })


const loadTaskById = (id) => {
  const taskId = parseInt(id)
  const task = allTasks.value.find(t => t.id === taskId)
  
  if (task) {
    if (task.type === 'lead') {
      leadsStore.fetchLeadById(taskId)
    } else {
      opportunitiesStore.fetchOpportunityById(taskId)
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
    await leadsStore.updateLead(task.id, { 
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
    await leadsStore.updateLead(task.id, { priority: 'Hot' })
  } else if (task.type === 'opportunity') {
    await opportunitiesStore.updateOpportunity(task.id, { priority: 'Hot' })
  }
}

const unmarkAsHot = async (task) => {
  openCardMenu.value = null
  if (task.type === 'lead') {
    await leadsStore.updateLead(task.id, { priority: 'Normal' })
  } else if (task.type === 'opportunity') {
    await opportunitiesStore.updateOpportunity(task.id, { priority: 'Normal' })
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
      await leadsStore.updateLead(task.id, updates)
      
      // Log all activities
      for (const activity of activities) {
        await leadsStore.addActivity(task.id, activity)
      }
    } else {
      // Fallback to direct update if no handler found
      await leadsStore.updateLead(task.id, {
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
    await leadsStore.fetchLeadById(task.id)
  } catch (err) {
    console.error('Failed to reopen lead:', err)
  }
}

// Generate menu items for task cards
const getTaskMenuItems = (task) => {
  const items = []
  
  // Reopen Lead (only for closed leads)
  if (task.type === 'lead' && task.isDisqualified === true) {
    items.push({
      key: 'reopen',
      label: 'Reopen Lead',
      onClick: () => reopenLead(task)
    })
  }
  
  // Reassign
  items.push({
    key: 'reassign',
    label: 'Reassign',
    onClick: () => reassignTask(task)
  })
  
  // Mark as hot / Unmark as hot
  if (task.priority !== 'Hot') {
    items.push({
      key: 'mark-hot',
      label: 'Mark as hot',
      onClick: () => markAsHot(task)
    })
  } else {
    items.push({
      key: 'unmark-hot',
      label: 'Unmark as hot',
      onClick: () => unmarkAsHot(task)
    })
  }
  
  return items
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
