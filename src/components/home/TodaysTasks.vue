<template>
  <div class="space-y-3">
    <div v-if="tasks.length === 0" class="text-center py-8 text-gray-500">
      <i class="fa-solid fa-tasks text-4xl mb-2 text-gray-300"></i>
      <p class="text-sm">No tasks due today</p>
    </div>
    
    <div
      v-for="task in tasks"
      :key="`${task.type}-${task.id}`"
      @click="handleClick(task)"
      class="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span 
              v-if="task.priority === 'Hot'"
              class="text-xs font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 flex items-center gap-1"
            >
              <i class="fa-solid fa-fire text-[9px]"></i> HOT
            </span>
            <span 
              v-else
              class="text-xs font-medium px-2 py-0.5 rounded bg-gray-50 text-gray-700 border border-gray-200"
            >
              Normal
            </span>
            
            <span 
              v-if="task.dueTime"
              class="text-xs font-bold px-2 py-0.5 rounded"
              :class="getTimeBadgeClass(task.dueDate)"
            >
              {{ task.dueTime }}
            </span>
            
            <span 
              v-if="task.isOverdue"
              class="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200"
            >
              OVERDUE
            </span>
          </div>
          
          <h4 class="font-semibold text-slate-800 text-sm mb-1">
            {{ task.customer?.name || 'Unknown Customer' }}
          </h4>
          
          <p class="text-xs text-gray-600 mb-2">
            {{ task.taskType }}
            <span v-if="task.requestedCar || task.vehicle">
              - {{ task.requestedCar ? `${task.requestedCar.brand} ${task.requestedCar.model}` : `${task.vehicle.brand} ${task.vehicle.model}` }}
            </span>
          </p>
          
          <div class="flex items-center gap-2 text-xs text-gray-500">
            <span 
              class="px-2 py-0.5 rounded border text-[10px] font-bold uppercase"
              :class="task.type === 'lead' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'"
            >
              {{ task.type === 'lead' ? 'Lead' : 'Opportunity' }}
            </span>
            <span v-if="task.stage || task.displayStage" class="text-gray-500">
              {{ task.displayStage || task.stage }}
            </span>
          </div>
        </div>
        
        <button
          @click.stop="handleClick(task)"
          class="text-gray-400 hover:text-blue-600 transition-colors"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  }
})

const router = useRouter()

const getTimeBadgeClass = (dueDate) => {
  if (!dueDate) return 'bg-gray-100 text-gray-700 border-gray-200'
  
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




