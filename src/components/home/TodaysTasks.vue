<template>
  <div class="space-y-3">
    <!-- Loading Skeleton -->
    <template v-if="loading">
      <div v-for="n in 3" :key="`skeleton-${n}`" class="bg-surface border border-E5E7EB rounded-lg p-4">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0 space-y-2">
            <div class="flex items-center gap-2">
              <div class="h-5 bg-surfaceTertiary rounded w-16 animate-pulse"></div>
              <div class="h-5 bg-surfaceTertiary rounded w-20 animate-pulse"></div>
            </div>
            <div class="h-4 bg-surfaceTertiary rounded w-32 animate-pulse"></div>
            <div class="h-3 bg-surfaceTertiary rounded w-24 animate-pulse"></div>
            <div class="flex items-center gap-2">
              <div class="h-4 bg-surfaceTertiary rounded w-16 animate-pulse"></div>
              <div class="h-3 bg-surfaceTertiary rounded w-20 animate-pulse"></div>
            </div>
          </div>
          <div class="h-4 w-4 bg-surfaceTertiary rounded animate-pulse"></div>
        </div>
      </div>
    </template>
    
    <!-- Actual Content -->
    <template v-else>
      <div v-if="tasks.length === 0" class="text-center py-8 text-sub">
        <i class="fa-solid fa-tasks text-4xl mb-2 text-gray-300"></i>
        <p class="text-fluid-sm">No tasks due today</p>
      </div>
      
      <div
        v-for="task in tasks"
        :key="`${task.type}-${task.id}`"
        @click="handleClick(task)"
        class="bg-surface border border-E5E7EB rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
      >
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span 
              v-if="task.priority === 'Hot'"
              class="text-fluid-xs font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 flex items-center gap-1"
            >
              <i class="fa-solid fa-fire text-fluid-xs"></i> HOT
            </span>
            <span 
              v-else
              class="text-fluid-xs font-medium px-2 py-0.5 rounded bg-surfaceSecondary text-body border border-E5E7EB"
            >
              Normal
            </span>
            
            <span 
              v-if="task.dueTime"
              class="text-fluid-xs font-bold px-2 py-0.5 rounded"
              :class="getTimeBadgeClass(task.dueDate)"
            >
              {{ task.dueTime }}
            </span>
            
            <span 
              v-if="task.isOverdue"
              class="text-fluid-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200"
            >
              OVERDUE
            </span>
          </div>
          
          <h4 class="text-fluid-sm font-semibold text-heading mb-1">
            {{ task.customer?.name || 'Unknown Customer' }}
          </h4>
          
          <p class="text-fluid-xs mb-2">
            {{ task.taskType }}
            <span v-if="task.requestedCar || task.vehicle">
              - {{ task.requestedCar ? `${task.requestedCar.brand} ${task.requestedCar.model}` : `${task.vehicle.brand} ${task.vehicle.model}` }}
            </span>
          </p>
          
          <div class="flex items-center gap-2 text-fluid-xs text-sub">
            <span 
              class="px-2 py-0.5 rounded border text-fluid-xs font-bold uppercase"
              :class="task.type === 'lead' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'"
            >
              {{ task.type === 'lead' ? 'Lead' : 'Opportunity' }}
            </span>
            <span v-if="task.stage || task.displayStage" class="text-sub">
              {{ task.displayStage || task.stage }}
            </span>
          </div>
        </div>
        
        <button
          @click.stop="handleClick(task)"
          class="text-sub hover:text-blue-600 transition-colors"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

const getTimeBadgeClass = (dueDate) => {
  if (!dueDate) return 'bg-surfaceSecondary text-body border'
  
  const now = new Date()
  const due = new Date(dueDate)
  const hoursUntil = (due - now) / (1000 * 60 * 60)
  
  if (hoursUntil < 0) {
    return 'bg-red-100 text-red-700 border-red-200'
  } else if (hoursUntil < 2) {
    return 'bg-orange-100 text-orange-700 border-orange-200'
  } else {
    return 'bg-blue-100 text-blue-700 border-blue-200'
  }
}

const handleClick = (task) => {
  router.push(`/tasks/${task.id}?type=${task.type}`)
}
</script>




