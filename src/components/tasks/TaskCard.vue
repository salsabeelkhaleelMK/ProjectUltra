<template>
  <div 
    ref="cardRef"
    @click="$emit('select', itemId)"
    class="bg-white rounded-xl p-4 flex items-center justify-between hover:shadow-mk-dashboard-card cursor-pointer relative transition-all border group"
    :class="cardClass"
  >
    <!-- Menu Button -->
    <button 
      v-if="showMenu"
      @click.stop="$emit('menu-click', item.id)"
      class="absolute top-2 right-2 pr-1 text-gray-300 hover:text-gray-600 z-10"
    >
      <i class="fa-solid fa-ellipsis-vertical"></i>
    </button>

    <!-- Card Menu Dropdown -->
    <div 
      v-if="openMenuId === item.id && showMenu"
      class="absolute right-2 top-7 z-50 w-40 bg-white border border-black/10 rounded-lg shadow-lg py-1"
      v-click-outside="() => $emit('menu-close')"
      @click.stop
    >
      <button
        v-for="menuItem in menuItems"
        :key="menuItem.key"
        @click="menuItem.onClick"
        class="w-full px-3 py-2 text-left text-xs text-heading hover:bg-surfaceSecondary flex items-center gap-2"
      >
        {{ menuItem.label }}
      </button>
    </div>

    <div class="flex flex-col min-w-0 flex-1 pr-4">
      <div class="flex items-center gap-1 mb-0.5">
        <h3 v-if="actionTitle" class="font-bold text-heading text-fluid-base truncate">{{ actionTitle }}</h3>
        <span 
          v-if="deadline"
          class="flex items-center gap-1 text-[10px] font-bold uppercase leading-none shrink-0"
          :class="deadline.status.textClass"
        >
          <span 
            class="w-1.5 h-1.5 rounded-full"
            :class="deadlineDotClass"
          ></span>
          {{ deadline.text }}
        </span>
      </div>
      <div class="flex items-center gap-2 overflow-hidden">
        <span class="text-sub text-fluid-sm truncate">{{ getName(item) }}</span>
      </div>
      
      <!-- Badges -->
      <div class="flex flex-wrap items-center gap-2 mt-2">
        <span 
          class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border leading-none"
          :class="item.type === 'lead' 
            ? 'bg-blue-50 text-blue-700 border-blue-200' 
            : 'bg-purple-50 text-purple-700 border-purple-200'"
        >
          {{ item.type === 'lead' ? 'Lead' : 'Opportunity' }}
        </span>
        
        <!-- Single status badge -->
        <span 
          v-if="getDisplayStage(item)"
          class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border leading-none"
          :class="stageColorClass"
        >
          {{ getDisplayStage(item) }}
        </span>
        
        <span 
          v-if="item.priority === 'Hot'"
          class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-red-50 text-red-700 border border-red-200 leading-none"
        >
          Hot
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatDueDate, getDeadlineStatus } from '@/utils/formatters'
import { getStageColor, getDisplayStage as getCalculatedDisplayStageFromMapper } from '@/utils/stageMapper'
import { getTaskActionTitle } from '@/utils/taskActionTitle'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  selected: {
    type: Boolean,
    default: false
  },
  selectedClass: {
    type: [String, Function],
    default: 'bg-white border-2 border-blue-500 shadow-md'
  },
  unselectedClass: {
    type: [String, Function],
    default: 'bg-white border border-gray-200 hover:border-gray-300'
  },
  showMenu: {
    type: Boolean,
    default: true
  },
  openMenuId: {
    type: [Number, String],
    default: null
  },
  getName: {
    type: Function,
    required: true
  },
  getVehicleInfo: {
    type: Function,
    default: null
  },
  menuItems: {
    type: Array,
    default: null
  }
})

const emit = defineEmits(['select', 'menu-click', 'menu-close'])

const itemId = computed(() => {
  return props.item.compositeId || `${props.item.type || 'task'}-${props.item.id}` || props.item.id
})

const isSelected = computed(() => props.selected)

const cardClass = computed(() => {
  if (isSelected.value) {
    const selected = typeof props.selectedClass === 'function' 
      ? props.selectedClass(props.item) 
      : props.selectedClass
    return selected
  }
  return typeof props.unselectedClass === 'function' 
    ? props.unselectedClass(props.item) 
    : props.unselectedClass
})

const getBaseStage = (item) => {
  if (!item) return ''
  return item.stage || item.currentStage || 'New'
}

const getCalculatedDisplayStage = (item) => {
  if (!item || item.type !== 'opportunity') return null
  try {
    return getCalculatedDisplayStageFromMapper(item, 'opportunity')
  } catch (e) {
    return item.displayStage || item.stage || null
  }
}

const getDisplayStage = (item) => {
  if (!item) return ''
  
  // For opportunities, extract substatus if available for better readability
  if (item.type === 'opportunity') {
    const displayStage = getCalculatedDisplayStage(item) || item.stage || item.currentStage || 'New'
    const baseStage = getBaseStage(item)
    
    // If display stage contains substatus (e.g., "In Negotiation - Contract Pending"),
    // show just the substatus part (e.g., "Contract Pending") for better readability
    const substatus = getSubstatus(item)
    if (substatus && substatus !== displayStage) {
      return substatus
    }
    
    return displayStage
  }
  
  return item.stage || item.currentStage || item.displayStage || 'New'
}

const hasTwoStatuses = (item) => {
  if (!item || item.type !== 'opportunity') return false
  const baseStage = getBaseStage(item)
  const displayStage = getCalculatedDisplayStage(item)
  
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

const getSubstatus = (item) => {
  if (!item || item.type !== 'opportunity') return ''
  const baseStage = getBaseStage(item)
  const displayStage = getCalculatedDisplayStage(item)
  
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

const getStageColorForStage = (stage, entityType = 'opportunity') => {
  if (!stage) return 'bg-gray-50 text-gray-700 border-gray-200'
  try {
    const baseColor = getStageColor(stage, entityType)
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

const stageColorClass = computed(() => {
  const item = props.item
  if (!item) return 'bg-gray-50 text-gray-700 border-gray-200'
  
  // For opportunities, use the stage mapper color
  if (item.type === 'opportunity') {
    const displayStage = getCalculatedDisplayStage(item) || getBaseStage(item)
    return getStageColorForStage(displayStage, 'opportunity')
  }
  
  // Fallback for leads or other types
  const stage = getDisplayStage(item).toLowerCase()
  if (stage.includes('new')) return 'bg-blue-50 text-blue-600 border-blue-200'
  if (stage.includes('qualif')) return 'bg-green-50 text-green-600 border-green-200'
  if (stage.includes('negotiat')) return 'bg-purple-50 text-purple-600 border-purple-200'
  if (stage.includes('close')) return 'bg-surfaceSecondary text-body border-black/5'
  return 'bg-blue-50 text-blue-600 border-blue-200'
})

const actionTitle = computed(() => getTaskActionTitle(props.item))

const deadline = computed(() => {
  const date = props.item.nextActionDue || props.item.dueDate
  if (!date) return null
  
  const status = getDeadlineStatus(date)
  
  return {
    text: formatDueDate(date),
    status
  }
})

const deadlineDotClass = computed(() => {
  if (!deadline.value) return ''
  // Convert text color class to background color class (e.g., text-red-700 -> bg-red-700)
  return deadline.value.status.textClass.replace('text-', 'bg-')
})

const cardRef = ref(null)
</script>

