<template>
  <div class="border-b border-black/5 bg-white px-6 h-16 min-h-16 shrink-0">
    <div class="flex items-center justify-between gap-4 w-full h-full">
      <div class="flex flex-col gap-0.5 min-w-0">
        <h2 class="text-fluid-lg font-medium text-greys-900">
          {{ getTaskTitle(task) }}
        </h2>
        <p v-if="task" class="text-fluid-sm text-greys-500 truncate">
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
          <ChevronLeft :size="16" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          @click="$emit('next')" 
          :disabled="!hasNext"
        >
          <ChevronRight :size="16" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Button } from '@motork/component-library/future/primitives'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  task: { 
    type: Object, 
    default: null 
  },
  filteredTasks: { 
    type: Array, 
    default: () => [] 
  }
})

defineEmits(['previous', 'next'])

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
  if (!task) return ''
  
  // Different titles based on task type and stage
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
  
  // Source
  if (task.source) {
    parts.push(task.source)
  }
  
  // Customer name
  if (task.customer?.name) {
    parts.push(task.customer.name)
  } else if (task.customerName) {
    parts.push(task.customerName)
  }
  
  return parts.join(' • ')
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
