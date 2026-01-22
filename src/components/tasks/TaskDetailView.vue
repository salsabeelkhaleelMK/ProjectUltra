<template>
  <div class="relative flex-1 flex flex-col min-w-0 overflow-hidden">
    <div v-if="task" class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <!-- Task Header -->
      <TaskDetailHeader
        :task="task"
        :filtered-tasks="filteredTasks"
        :is-drawer-view="isDrawerView"
        @previous="handlePrevious"
        @next="handleNext"
        @close="$emit('close')"
      />

      <!-- Center + Right Panels Row -->
      <div class="flex flex-1 overflow-hidden">
        <!-- Center Panel: Task Management Widget Only -->
        <div class="flex-1 flex flex-col overflow-hidden bg-white min-w-0">
          <div class="flex-1 overflow-y-auto">
            <div class="p-2">
              <TaskManagementCard
                :task="task"
                :type="task.type"
                :management-widget="managementWidget"
                :activities="allActivities"
                v-bind="$attrs"
              />
            </div>
          </div>
        </div>

        <!-- Right Sidebar with Tabs -->
        <div
          class="right-sidebar flex flex-col overflow-hidden shrink-0 border-l border-black/5"
          style="background-color: #F8F8F8"
        >
          <!-- Sidebar Tabs -->
          <div class="flex border-b border-black/5 bg-white">
            <button
              @click="sidebarTab = 'request'"
              class="flex-1 px-4 py-3 text-sm font-medium transition-colors relative"
              :class="sidebarTab === 'request' ? 'text-blue-600' : 'text-greys-600 hover:text-greys-900'"
            >
              Request
              <span
                v-if="sidebarTab === 'request'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              ></span>
            </button>
            <button
              @click="sidebarTab = 'activity'"
              class="flex-1 px-4 py-3 text-sm font-medium transition-colors relative"
              :class="sidebarTab === 'activity' ? 'text-blue-600' : 'text-greys-600 hover:text-greys-900'"
            >
              Activity
              <span
                v-if="sidebarTab === 'activity'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              ></span>
            </button>
          </div>
          
          <!-- Sidebar Content -->
          <div class="flex-1 overflow-y-auto">
            <!-- Request Tab -->
            <div v-if="sidebarTab === 'request'" class="space-y-2 p-2">
              <TaskContactCard
                :task="task"
                :task-type="task.type"
                :customer-id="task.customerId || task.customer?.id"
                @action="handleContactAction"
              />
              <VehicleRequestCard
                v-if="task.requestedCar || task.vehicle"
                :vehicle="task.requestedCar || task.vehicle"
                :request-message="task.requestMessage || task.requestedCar?.requestMessage"
                :source="task.source"
                :image-url="getCarImageUrl(task.requestedCar || task.vehicle)"
                @open-ad="handleOpenAd"
                @more-actions="handleMoreActions"
              />
            </div>
            
            <!-- Activity Tab -->
            <div v-if="sidebarTab === 'activity'" class="p-2">
              <TaskActivityCard
                :activities="allActivities"
                :expanded-summaries="expandedSummaries"
                @activity-click="handleActivityClick"
                @toggle-summary-expanded="toggleSummaryExpanded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex-1 flex items-center justify-center bg-surface">
      <div class="text-center max-w-sm p-8">
        <div class="w-16 h-16 mx-auto mb-4 rounded-card bg-surfaceSecondary flex items-center justify-center">
          <i class="fa-solid fa-tasks text-2xl text-sub"></i>
        </div>
        <h3 class="text-fluid-lg font-bold text-heading mb-2">No task selected</h3>
        <p class="text-fluid-sm text-sub">Select a task from the list to view its details and manage activities</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TaskDetailHeader from './TaskDetailHeader.vue'
import TaskManagementCard from './TaskManagementCard.vue'
import TaskContactCard from './TaskContactCard.vue'
import VehicleRequestCard from './VehicleRequestCard.vue'
import TaskActivityCard from './TaskActivityCard.vue'

const props = defineProps({
  task: { 
    type: Object, 
    default: null 
  },
  managementWidget: { 
    type: Object, 
    required: true 
  },
  storeAdapter: { 
    type: Object, 
    required: true 
  },
  addNewConfig: { 
    type: Object, 
    required: true 
  },
  filteredTasks: { 
    type: Array, 
    default: () => [] 
  },
  isDrawerView: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['task-navigate', 'close'])

// Sidebar tab state
const sidebarTab = ref('request')

// Expanded summaries state for activity details
const expandedSummaries = ref({})

// Activities
const allActivities = computed(() => {
  return props.storeAdapter.currentActivities?.value || []
})

// Navigation handlers
const handlePrevious = () => {
  emit('task-navigate', 'previous')
}

const handleNext = () => {
  emit('task-navigate', 'next')
}

// Activity interaction
const handleActivityClick = (activity) => {
  // Switch to activity tab if not already there
  if (sidebarTab.value !== 'activity') {
    sidebarTab.value = 'activity'
  }
  // Could open a modal here for detailed view
  console.log('Activity clicked:', activity)
}

const toggleSummaryExpanded = (activityId) => {
  expandedSummaries.value[activityId] = !expandedSummaries.value[activityId]
}

// Action handlers
const getCarImageUrl = (vehicle) => {
  if (!vehicle) return ''
  return vehicle.image || vehicle.imageUrl || ''
}

const handleOpenAd = () => {
  console.log('Open ad clicked')
}

const handleMoreActions = () => {
  console.log('More actions clicked')
}

const handleContactAction = (action) => {
  console.log('Contact action:', action)
}
</script>

<style scoped>
/* Right sidebar responsive widths */
.right-sidebar {
  width: 360px;
  min-width: 360px;
}

@media (min-width: 1440px) {
  .right-sidebar {
    width: 400px;
    min-width: 400px;
  }
}

@media (min-width: 1600px) {
  .right-sidebar {
    width: 480px;
    min-width: 480px;
  }
}
</style>
