<template>
  <div class="grid grid-cols-3 gap-4">
    <!-- Stage Card -->
    <div 
      class="px-3 py-2 overflow-hidden flex items-center justify-between gap-2 rounded-card bg-white shadow-nsc-card"
    >
      <p class="text-xs text-greys-500 leading-4 shrink-0">Stage</p>
      <p class="text-xs xl:text-sm font-medium text-greys-900 leading-5 truncate min-w-0 text-right flex-1">
        {{ displayStage }}
      </p>
    </div>
    
    <!-- Source Card -->
    <div 
      class="px-3 py-2 overflow-hidden flex items-center justify-between gap-2 rounded-card bg-white shadow-nsc-card"
    >
      <p class="text-xs text-greys-500 leading-4 shrink-0">Source</p>
      <p class="text-xs xl:text-sm font-medium text-greys-900 leading-5 truncate min-w-0 text-right flex-1">
        {{ task.source || 'N/A' }}
      </p>
    </div>
    
    <!-- Owner Card -->
    <div 
      class="px-3 py-2 overflow-hidden flex items-center justify-between gap-2 rounded-card bg-white shadow-nsc-card"
    >
      <p class="text-xs text-greys-500 leading-4 shrink-0">Owner</p>
      <div class="flex items-center gap-2 min-w-0 flex-1 justify-end">
        <!-- Use MotorK Avatar component -->
        <Avatar v-if="ownerName" class="h-5 w-5 shrink-0">
          <AvatarFallback class="bg-orange-500 text-white text-xs">
            {{ getOwnerInitials(ownerName) }}
          </AvatarFallback>
        </Avatar>
        <p class="text-xs xl:text-sm font-medium text-greys-900 leading-5 truncate min-w-0">
          {{ ownerName || 'Unassigned' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Avatar, AvatarFallback } from '@motork/component-library/future/primitives'

const props = defineProps({
  task: { 
    type: Object, 
    required: true 
  },
  type: { 
    type: String, 
    required: true 
  }
})

// Compute display values
const displayStage = computed(() => {
  if (props.task.displayStage) {
    return props.task.displayStage
  }
  
  // Format stage name (e.g., "new_lead" -> "New Lead")
  if (props.task.stage) {
    return props.task.stage
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  
  return 'N/A'
})

const ownerName = computed(() => {
  // Try different possible owner fields
  return props.task.assignee || props.task.owner || props.task.assignedTo || ''
})

const getOwnerInitials = (name) => {
  if (!name) return 'U'
  
  const names = name.trim().split(' ')
  
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase()
  }
  
  return name.substring(0, 2).toUpperCase()
}
</script>

<style scoped>
/* Ensure text colors match greys scale */
.text-greys-500 {
  color: #6B7280;
}

.text-greys-900 {
  color: #111827;
}
</style>
