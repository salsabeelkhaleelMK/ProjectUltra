<template>
  <div class="rounded-card flex flex-col" style="background-color: var(--base-muted, #f5f5f5)">
    <!-- Title Section -->
    <div class="px-4 py-4 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-list text-heading"></i>
        <h2 class="text-fluid-sm font-medium text-heading leading-5">Other Tasks for This Customer</h2>
        <span v-if="relatedTasks.length > 0" class="ml-1 px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-xs font-bold rounded-full">
          {{ relatedTasks.length }}
        </span>
      </div>
    </div>
    
    <!-- Card Content -->
    <div class="bg-white rounded-lg p-4 shadow-sm flex flex-col" style="box-shadow: var(--nsc-card-shadow);">
      <div v-if="loading" class="text-center py-8 text-sub">
        <i class="fa-solid fa-spinner fa-spin text-2xl mb-2"></i>
        <p class="text-xs">Loading related tasks...</p>
      </div>
      
      <div v-else-if="relatedTasks.length > 0" class="space-y-3">
        <div
          v-for="task in relatedTasks"
          :key="`${task.type}-${task.id}`"
          class="flex flex-col p-3 border border-E5E7EB rounded-lg hover:bg-surfaceSecondary transition-colors cursor-pointer group"
          @click="handleTaskClick(task)"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <!-- Type and Status Chips -->
              <div class="flex items-center gap-2 mb-2 flex-wrap">
                <span 
                  class="px-2 py-1 rounded text-xs font-medium border"
                  :class="task.type === 'lead' 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-purple-50 text-purple-700 border-purple-200'"
                >
                  {{ task.type === 'lead' ? 'Lead' : 'Opportunity' }}
                </span>
                <span 
                  class="px-2 py-1 rounded text-xs font-medium border"
                  :class="getStageColor(task.displayStage || task.stage, task.type)"
                >
                  {{ task.displayStage || task.stage }}
                </span>
              </div>
              
              <!-- Details Grid -->
              <div class="space-y-1.5">
                <!-- Creation Date -->
                <div v-if="task.createdAt" class="flex items-center gap-2 text-xs text-sub">
                  <i class="fa-solid fa-calendar text-xs w-4"></i>
                  <span>{{ formatDate(task.createdAt) }}</span>
                </div>
                
                <!-- Assignee -->
                <div v-if="task.assignee" class="flex items-center gap-2 text-xs text-sub">
                  <i class="fa-solid fa-user text-xs w-4"></i>
                  <span>{{ task.assignee }}</span>
                </div>
                
                <!-- Car Requested -->
                <div v-if="getCarName(task)" class="flex items-center gap-2 text-xs text-sub">
                  <i class="fa-solid fa-car text-xs w-4"></i>
                  <span>{{ getCarName(task) }}</span>
                </div>
                
                <!-- Value (only for opportunities) -->
                <div v-if="task.type === 'opportunity' && task.value" class="flex items-center gap-2 text-xs">
                  <i class="fa-solid fa-tag text-xs w-4 text-sub"></i>
                  <span class="font-semibold text-heading">€ {{ formatCurrency(task.value) }}</span>
                </div>
              </div>
            </div>
            
            <!-- External Link Icon -->
            <div class="w-8 h-8 flex items-center justify-center bg-surface border border-black/5 rounded hover:bg-white hover:border-brand-blue/30 text-sub hover:text-brand-blue transition-all shrink-0">
              <i class="fa-solid fa-external-link text-xs"></i>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-8 text-sub">
        <i class="fa-solid fa-inbox text-2xl mb-2 opacity-30"></i>
        <p class="text-xs">No other tasks for this customer</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLeadsStore } from '@/stores/leads'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { getStageColor } from '@/utils/stageMapper'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  entityType: {
    type: String,
    required: true // 'lead' or 'opportunity'
  }
})

const router = useRouter()
const leadsStore = useLeadsStore()
const opportunitiesStore = useOpportunitiesStore()

const loading = ref(false)
const allLeads = ref([])
const allOpportunities = ref([])

// Get customer ID from task
const customerId = computed(() => {
  return props.task.customerId || props.task.customer?.id || null
})

// Fetch all leads and opportunities
const fetchAllTasks = async () => {
  if (!customerId.value) {
    return
  }
  
  loading.value = true
  try {
    await Promise.all([
      leadsStore.fetchLeads(),
      opportunitiesStore.fetchOpportunities()
    ])
    allLeads.value = leadsStore.leads || []
    allOpportunities.value = opportunitiesStore.opportunities || []
  } catch (error) {
    console.error('Error fetching related tasks:', error)
  } finally {
    loading.value = false
  }
}

// Filter related tasks by customer ID and exclude current task
const relatedTasks = computed(() => {
  if (!customerId.value) {
    return []
  }
  
  const tasks = []
  
  // Add leads
  allLeads.value.forEach(lead => {
    if (lead.customerId === customerId.value && 
        !(lead.id === props.task.id && props.entityType === 'lead')) {
      tasks.push({
        ...lead,
        type: 'lead'
      })
    }
  })
  
  // Add opportunities
  allOpportunities.value.forEach(opp => {
    if (opp.customerId === customerId.value && 
        !(opp.id === props.task.id && props.entityType === 'opportunity')) {
      tasks.push({
        ...opp,
        type: 'opportunity'
      })
    }
  })
  
  // Sort by creation date (newest first)
  return tasks.sort((a, b) => {
    const dateA = new Date(a.createdAt || 0)
    const dateB = new Date(b.createdAt || 0)
    return dateB - dateA
  })
})


// Get car name from task
const getCarName = (task) => {
  const car = task.requestedCar || task.vehicle
  if (!car) return null
  if (car.brand && car.model) {
    return `${car.brand} ${car.model}`
  }
  return null
}

// Format currency
const formatCurrency = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('en-US').format(value)
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Handle task click
const handleTaskClick = (task) => {
  router.push({ 
    path: `/tasks/${task.id}`, 
    query: { type: task.type } 
  })
}

// Watch for task changes
watch(() => props.task.id, () => {
  fetchAllTasks()
}, { immediate: true })

// Fetch on mount
onMounted(() => {
  fetchAllTasks()
})
</script>
