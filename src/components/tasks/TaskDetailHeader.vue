<template>
  <div class="border-b border-border bg-white px-6 h-16 min-h-16 shrink-0">
    <div class="flex items-center justify-between gap-4 w-full h-full">
      <div class="flex flex-col min-w-0">
        <!-- Task Title & Badges Row -->
        <div class="flex items-center gap-2 min-w-0">
          <h2 v-if="task && taskTitle" class="text-lg font-medium text-foreground truncate">
            {{ taskTitle }}
          </h2>
          <h2 v-else-if="task" class="text-lg font-medium text-foreground truncate">
            {{ task.type === 'lead' ? 'Lead Qualification Task' : 'Opportunity Management Task' }}
          </h2>
          <h2 v-else class="text-lg font-medium text-foreground">
            No task selected
          </h2>

          <!-- Compact Badges -->
          <div v-if="task" class="shrink-0">
            <TaskBadges :task="task" />
          </div>
        </div>
        
        <!-- Task Subtitle -->
        <p v-if="task" class="text-sm text-muted-foreground truncate leading-normal mt-0.5">
          {{ getTaskSubtitle(task) }}
        </p>
        <p v-else class="text-sm text-muted-foreground">
          Select a task to view details
        </p>
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <!-- Due Date / Expected Close Date -->
        <div v-if="showDueDate" class="flex items-center gap-2">
          <div class="flex items-center gap-1.5 px-2 py-1 rounded-btn text-xs font-medium bg-muted text-muted-foreground">
            <i class="fa-solid fa-calendar-day text-xs"></i>
            <span>{{ dueDateLabel }}: {{ formattedDueDate }}</span>
          </div>
        </div>
        
        <!-- Expected Close Date badge for opportunities (with postpone dropdown) -->
        <div
          v-if="showExpectedCloseDate"
          class="relative"
        >
          <button
            type="button"
            class="flex items-center gap-1.5 px-2 py-1 rounded-btn text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            :class="{ 'cursor-default': isTaskClosed }"
            :aria-expanded="showExpectedCloseMenu && !isTaskClosed"
            aria-haspopup="true"
            aria-label="Expected close date"
            @click.stop="!isTaskClosed && (showExpectedCloseMenu = !showExpectedCloseMenu)"
          >
            <i class="fa-solid fa-calendar-day text-xs"></i>
            <span>Expected Close: {{ formattedExpectedCloseDate }}</span>
            <ChevronDown
              v-if="!isTaskClosed"
              :size="12"
              stroke-width="2"
              class="shrink-0 transition-transform ml-1 text-muted-foreground"
              :class="{ 'rotate-180': showExpectedCloseMenu }"
            />
          </button>
          <div
            v-if="showExpectedCloseMenu && !isTaskClosed && expectedCloseMenuItems.length > 0"
            v-click-outside="() => (showExpectedCloseMenu = false)"
            class="absolute right-0 top-full mt-2 z-50 w-56 bg-white border border-border rounded-lg shadow-nsc-card py-1"
            @click.stop
          >
            <button
              v-for="item in expectedCloseMenuItems"
              :key="item.key"
              type="button"
              class="w-full px-3 py-2 text-left text-xs text-foreground hover:bg-muted flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="!!item.disabled"
              @click="item.onClick()"
            >
              {{ item.label }}
            </button>
          </div>
        </div>
        
        <!-- Use MotorK Button component -->
        <Button 
          variant="secondary" 
          size="icon" 
          @click="$emit('previous')" 
          :disabled="!hasPrevious"
        >
          <ChevronLeft :size="16" class="text-muted-foreground" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          @click="$emit('next')" 
          :disabled="!hasNext"
        >
          <ChevronRight :size="16" class="text-muted-foreground" />
        </Button>
        
        <!-- Close button (only shown in drawer view) -->
        <Button 
          v-if="isDrawerView"
          variant="secondary" 
          size="icon" 
          @click="$emit('close')"
          class="ml-1"
        >
          <X :size="16" class="text-muted-foreground" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Button } from '@motork/component-library/future/primitives'
import { ChevronLeft, ChevronRight, X, ChevronDown } from 'lucide-vue-next'
import TaskBadges from './shared/TaskBadges.vue'
import { getTaskActionTitle } from '@/utils/taskActionTitle'
import { formatDueDate } from '@/utils/formatters'

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

const emit = defineEmits(['previous', 'next', 'close', 'postpone-expected-close'])

const showExpectedCloseMenu = ref(false)

// Due date for leads
const showDueDate = computed(() => {
  return props.task?.type === 'lead' && props.task?.nextActionDue && !isTaskClosed.value
})

const dueDateLabel = computed(() => {
  return 'Due Date'
})

const formattedDueDate = computed(() => {
  if (!props.task?.nextActionDue) return ''
  return formatDueDate(props.task.nextActionDue)
})

// Expected close date for opportunities
const showExpectedCloseDate = computed(() => {
  return props.task?.type === 'opportunity' && props.task?.expectedCloseDate
})

const formattedExpectedCloseDate = computed(() => {
  if (!props.task?.expectedCloseDate) return ''
  return formatDueDate(props.task.expectedCloseDate)
})

const isTaskClosed = computed(() => {
  return props.task?.stage === 'Closed Won' || props.task?.stage === 'Closed Lost' || props.task?.isClosed
})

const expectedCloseMenuItems = computed(() => {
  if (props.task?.type !== 'opportunity') return []
  return [
    { 
      key: 'postpone', 
      label: 'Postpone', 
      onClick: () => {
        showExpectedCloseMenu.value = false
        emit('postpone-expected-close')
      }
    }
  ]
})

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

const taskTitle = computed(() => {
  if (!props.task) return null
  return getTaskActionTitle(props.task)
})

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

</script>

<style scoped>
/* Fluid typography for responsive text sizes */
.text-lg {
  font-size: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  line-height: 1.4;
}

.text-sm {
  font-size: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  line-height: 1.5;
}
</style>
