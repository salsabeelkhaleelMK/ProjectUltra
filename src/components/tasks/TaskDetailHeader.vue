<template>
  <div class="border-b border-black/5 bg-white px-6 h-16 min-h-16 shrink-0">
    <div class="flex items-center justify-between gap-4 w-full h-full">
      <div class="flex flex-col min-w-0">
        <!-- Task Title & Badges Row -->
        <div class="flex items-center gap-2 min-w-0">
          <h2 v-if="task" class="text-fluid-lg font-medium text-heading truncate">
            {{ getTaskTitle(task) }}
          </h2>
          <h2 v-else class="text-fluid-lg font-medium text-heading">
            No task selected
          </h2>

          <!-- Compact Badges -->
          <div v-if="task" class="flex items-center gap-1.5 shrink-0">
            <!-- Type Badge (Lead/Opportunity) -->
            <span 
              class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border leading-none"
              :class="task.type === 'lead' 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-purple-50 text-purple-700 border-purple-200'"
            >
              {{ task.type === 'lead' ? 'Lead' : 'Opportunity' }}
            </span>
            
            <!-- Single status badge -->
            <span 
              class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border leading-none"
              :class="getStageColor(task)"
            >
              {{ getDisplayStage(task) }}
            </span>
            
            <!-- Hot Priority Badge -->
            <span 
              v-if="task.priority === 'Hot'"
              class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-red-50 text-red-700 border border-red-200 leading-none"
            >
              Hot
            </span>
          </div>
        </div>
        
        <!-- Task Subtitle -->
        <p v-if="task" class="text-sm text-sub truncate leading-normal mt-0.5">
          {{ getTaskSubtitle(task) }}
        </p>
        <p v-else class="text-fluid-sm text-sub">
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
          <ChevronLeft :size="16" class="text-body" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          @click="$emit('next')" 
          :disabled="!hasNext"
        >
          <ChevronRight :size="16" class="text-body" />
        </Button>
        
        <!-- Close button (only shown in drawer view) -->
        <Button 
          v-if="isDrawerView"
          variant="secondary" 
          size="icon" 
          @click="$emit('close')"
          class="ml-1"
        >
          <X :size="16" class="text-body" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Button } from '@motork/component-library/future/primitives'
import { ChevronLeft, ChevronRight, X } from 'lucide-vue-next'
import { getDisplayStage as getCalculatedDisplayStageFromMapper, getStageColor as getStageColorFromMapper } from '@/utils/stageMapper'

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
  
  // Source (next to vehicle if present)
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

const getDisplayStage = (task) => {
  if (!task) return ''
  
  // For opportunities, extract substatus if available for better readability
  if (task.type === 'opportunity') {
    const displayStage = getCalculatedDisplayStage(task) || task.stage || task.currentStage || 'New'
    const baseStage = getBaseStage(task)
    
    // If display stage contains substatus (e.g., "In Negotiation - Contract Pending"),
    // show just the substatus part (e.g., "Contract Pending") for better readability
    const substatus = getSubstatus(task)
    if (substatus && substatus !== displayStage) {
      return substatus
    }
    
    return displayStage
  }
  
  return task.stage || task.currentStage || task.displayStage || 'New'
}

const getBaseStage = (task) => {
  if (!task) return ''
  return task.stage || task.currentStage || 'New'
}

const getCalculatedDisplayStage = (task) => {
  if (!task || task.type !== 'opportunity') return null
  try {
    return getCalculatedDisplayStageFromMapper(task, 'opportunity')
  } catch (e) {
    return task.displayStage || task.stage || null
  }
}

const hasTwoStatuses = (task) => {
  if (!task || task.type !== 'opportunity') return false
  const baseStage = getBaseStage(task)
  const displayStage = getCalculatedDisplayStage(task)
  
  // Show two statuses when display stage contains the base stage with a substatus
  // (e.g., "In Negotiation - Contract Pending" should show as "In Negotiation" + "Contract Pending")
  if (displayStage && baseStage && displayStage !== baseStage) {
    // Check if display stage starts with base stage followed by " - " (case-insensitive)
    const baseStageLower = baseStage.toLowerCase().trim()
    const displayStageLower = displayStage.toLowerCase().trim()
    
    // If display stage starts with base stage followed by " - ", show two badges
    // This handles cases like "In Negotiation - Contract Pending" or "In Negotiation - Offer Feedback"
    if (displayStageLower.startsWith(baseStageLower + ' - ')) {
      return true
    }
    
    // For other cases where they differ, also show two badges
    return true
  }
  
  return false
}

const getSubstatus = (task) => {
  if (!task || task.type !== 'opportunity') return ''
  const baseStage = getBaseStage(task)
  const displayStage = getCalculatedDisplayStage(task)
  
  if (!displayStage || !baseStage) return displayStage || ''
  
  // Extract substatus from display stage (everything after " - ")
  const baseStageLower = baseStage.toLowerCase().trim()
  const displayStageLower = displayStage.toLowerCase().trim()
  
  if (displayStageLower.startsWith(baseStageLower + ' - ')) {
    // Extract the part after " - "
    const prefix = baseStage + ' - '
    if (displayStage.startsWith(prefix)) {
      return displayStage.substring(prefix.length)
    }
  }
  
  // Fallback: return full display stage if no substatus pattern found
  return displayStage
}

const getStageColor = (task) => {
  if (!task) return 'bg-gray-50 text-gray-700 border-gray-200'
  
  // For opportunities, use the stage mapper color
  if (task.type === 'opportunity') {
    const displayStage = getCalculatedDisplayStage(task) || getBaseStage(task)
    return getStageColorForStage(displayStage, 'opportunity')
  }
  
  // Fallback for leads or other types
  const stage = getDisplayStage(task).toLowerCase()
  if (stage.includes('new')) return 'bg-blue-50 text-blue-600 border-blue-200'
  if (stage.includes('qualif')) return 'bg-green-50 text-green-600 border-green-200'
  if (stage.includes('negotiat')) return 'bg-purple-50 text-purple-600 border-purple-200'
  if (stage.includes('close')) return 'bg-surfaceSecondary text-body border-black/5'
  return 'bg-blue-50 text-blue-600 border-blue-200'
}

const getStageColorForStage = (stage, entityType = 'opportunity') => {
  if (!stage) return 'bg-gray-50 text-gray-700 border-gray-200'
  try {
    const baseColor = getStageColorFromMapper(stage, entityType)
    // Add border color that matches the theme
    // Map background colors to border colors
    if (baseColor.includes('blue')) return baseColor + ' border-blue-200'
    if (baseColor.includes('purple')) return baseColor + ' border-purple-200'
    if (baseColor.includes('yellow')) return baseColor + ' border-yellow-200'
    if (baseColor.includes('pink')) return baseColor + ' border-pink-200'
    if (baseColor.includes('indigo')) return baseColor + ' border-indigo-200'
    if (baseColor.includes('emerald')) return baseColor + ' border-emerald-200'
    if (baseColor.includes('green')) return baseColor + ' border-green-200'
    if (baseColor.includes('red')) return baseColor + ' border-red-200'
    if (baseColor.includes('gray')) return baseColor + ' border-gray-200'
    return baseColor + ' border-gray-200'
  } catch (e) {
    // Fallback colors
    const stageLower = stage.toLowerCase()
    if (stageLower.includes('new')) return 'bg-blue-50 text-blue-600 border-blue-200'
    if (stageLower.includes('qualif')) return 'bg-green-50 text-green-600 border-green-200'
    if (stageLower.includes('negotiat')) return 'bg-purple-50 text-purple-600 border-purple-200'
    if (stageLower.includes('close')) return 'bg-surfaceSecondary text-body border-black/5'
    return 'bg-gray-50 text-gray-700 border-gray-200'
  }
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
