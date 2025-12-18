<template>
  <div class="h-full flex flex-col lg:flex-row overflow-hidden bg-gray-50">
    <!-- Left Sidebar - Unified Task Cards -->
    <EntityListSidebar
      title="Tasks"
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
      @select="selectTask"
      @menu-click="toggleCardMenu"
      @menu-close="openCardMenu = null"
      :show-type-filter="true"
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
          <div class="flex items-center gap-1.5" :class="task.priority === 'Hot' ? 'text-red-500' : 'text-gray-400'">
            <i v-if="task.priority === 'Hot'" class="fa-solid fa-clock text-[10px]"></i>
            <span class="text-[10px] font-bold uppercase tracking-wide">
              Due in {{ task.nextActionDue }}
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
    </EntityListSidebar>
    
    <!-- Main Content - Task Details -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <div v-if="!currentTask" class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <i class="fa-solid fa-tasks text-6xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">Select a task to view details</p>
        </div>
      </div>
      
      <TaskDetailContent
        v-else
        :task="currentTask"
      />
    </div>
    
    <!-- Right Sidebar - Activity Timeline -->
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
import EntityListSidebar from '@/components/shared/EntityListSidebar.vue'
import ActivitySummarySidebar from '@/components/shared/ActivitySummarySidebar.vue'
import TaskDetailContent from '@/components/tasks/TaskDetailContent.vue'

const route = useRoute()
const router = useRouter()
const leadsStore = useLeadsStore()
const opportunitiesStore = useOpportunitiesStore()

const typeFilter = ref('all') // 'all', 'lead', 'opportunity'
const openCardMenu = ref(null)

// Combine leads and opportunities with type property and composite key
const allTasks = computed(() => {
  const leads = leadsStore.leads.map(lead => ({ ...lead, type: 'lead', compositeId: `lead-${lead.id}` }))
  const opportunities = opportunitiesStore.opportunities.map(opp => ({ ...opp, type: 'opportunity', compositeId: `opportunity-${opp.id}` }))
  
  // Sort by lastActivity or createdAt (most recent first)
  return [...leads, ...opportunities].sort((a, b) => {
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
  router.push({ path: `/tasks/${id}`, query: { type } })
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const toggleCardMenu = (taskId) => {
  openCardMenu.value = openCardMenu.value === taskId ? null : taskId
}

const reassignTask = (task) => {
  openCardMenu.value = null
  console.log('Reassign task', task.id, task.type)
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
    'In Negotiation': 'bg-orange-100 text-orange-700 border-orange-200',
    'Opportunity in negotiation': 'bg-orange-100 text-orange-700 border-orange-200',
    'Closed': 'bg-gray-100 text-gray-700 border-gray-200',
    'Closed opportunity': 'bg-gray-100 text-gray-700 border-gray-200',
    'Won': 'bg-green-100 text-green-700 border-green-200',
    'Lost': 'bg-red-100 text-red-700 border-red-200'
  }
  return classes[stage] || 'bg-gray-100 text-gray-700 border-gray-200'
}
</script>

