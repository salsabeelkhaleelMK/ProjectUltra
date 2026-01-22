<template>
  <div class="border-b border-black/5 bg-white px-6 h-16 min-h-16 shrink-0">
    <div class="flex items-center justify-between gap-4 w-full h-full">
      <div class="flex flex-col min-w-0">
        <!-- Task Title & Badges Row -->
        <div class="flex items-center gap-2 min-w-0">
          <h2 v-if="task" class="text-fluid-lg font-medium text-greys-900 truncate">
            {{ getTaskTitle(task) }}
          </h2>
          <h2 v-else class="text-fluid-lg font-medium text-greys-900">
            No task selected
          </h2>

          <!-- Compact Badges -->
          <div v-if="task" class="flex items-center gap-1.5 shrink-0">
            <span 
              class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border border-transparent"
              :class="getStageColor(task)"
            >
              {{ getDisplayStage(task) }}
            </span>
            <span class="px-1.5 py-0.5 rounded bg-greys-100 text-greys-600 text-[10px] font-bold uppercase border border-E5E7EB">
              {{ task.source || 'N/A' }}
            </span>
          </div>
        </div>
        
        <!-- Task Subtitle -->
        <p v-if="task" class="text-[11px] text-greys-500 truncate leading-none mt-0.5">
          {{ getTaskSubtitle(task) }}
        </p>
        <p v-else class="text-fluid-sm text-greys-500">
          Select a task to view details
        </p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <!-- Use MotorK Button component -->
        <Button 
          variant="secondary" 
          size="icon" 
          @click="$emit('previous')" 
          :disabled="!hasPrevious"
        >
          <ChevronLeft :size="16" class="text-greys-700" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          @click="$emit('next')" 
          :disabled="!hasNext"
        >
          <ChevronRight :size="16" class="text-greys-700" />
        </Button>
        
        <!-- Close button (only shown in drawer view) -->
        <Button 
          v-if="isDrawerView"
          variant="secondary" 
          size="icon" 
          @click="$emit('close')"
          class="ml-1"
        >
          <X :size="16" class="text-greys-700" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Button } from '@motork/component-library/future/primitives'
import { ChevronLeft, ChevronRight, X } from 'lucide-vue-next'

const props = defineProps({
  task: { 
    type: Object, 
    default: null 
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

defineEmits(['previous', 'next', 'close'])

const hasPrevious = computed(() => {
  if (!props.task || !props.filteredTasks.length) return false
  const index = props.filteredTasks.findIndex(t => {
    // Handle both composite IDs and regular IDs
    const taskId = props.task.compositeId || props.task.id
    const compareId = t.compositeId || t.id
    return compareId === taskId
  })
  return index > 0
})

const hasNext = computed(() => {
  if (!props.task || !props.filteredTasks.length) return false
  const index = props.filteredTasks.findIndex(t => {
    const taskId = props.task.compositeId || props.task.id
    const compareId = t.compositeId || t.id
    return compareId === taskId
  })
  return index >= 0 && index < props.filteredTasks.length - 1
})

const getTaskTitle = (task) => {
  if (!task) return 'No task selected'
  
  // Different titles based on task type
  if (task.type === 'lead') {
    return 'Lead Qualification Task'
  } else if (task.type === 'opportunity') {
    return 'Opportunity Management Task'
  }
  
  return 'Task Details'
}

const getTaskSubtitle = (task) => {
  if (!task) return ''
  
  const parts = []
  
  // Vehicle info
  if (task.vehicle || task.requestedCar) {
    const vehicle = task.vehicle || task.requestedCar
    if (vehicle.brand && vehicle.model) {
      parts.push(`${vehicle.brand} ${vehicle.model} (${vehicle.year || 'N/A'})`)
    } else if (vehicle.model) {
      parts.push(`${vehicle.model} (${vehicle.year || 'N/A'})`)
    }
  }
  
  // Customer name
  if (task.customer?.name) {
    parts.push(task.customer.name)
  } else if (task.customerName) {
    parts.push(task.customerName)
  }
  
  return parts.join(' • ')
}

const getDisplayStage = (task) => {
  if (!task) return ''
  return task.stage || task.currentStage || 'New'
}

const getStageColor = (task) => {
  const stage = getDisplayStage(task).toLowerCase()
  if (stage.includes('new')) return 'bg-blue-50 text-blue-600 border-blue-200'
  if (stage.includes('qualif')) return 'bg-green-50 text-green-600 border-green-200'
  if (stage.includes('negotiat')) return 'bg-purple-50 text-purple-600 border-purple-200'
  if (stage.includes('close')) return 'bg-greys-100 text-greys-600 border-greys-300'
  return 'bg-blue-50 text-blue-600 border-blue-200'
}
</script>

<style scoped>
/* Fluid typography for responsive text sizes */
.text-fluid-lg {
  font-size: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  line-height: 1.4;
}

.text-fluid-sm {
  font-size: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  line-height: 1.5;
}
</style>
