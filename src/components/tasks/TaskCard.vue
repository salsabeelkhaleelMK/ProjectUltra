<template>
  <div 
    ref="cardRef"
    class="task-card bg-white rounded-xl p-4 flex items-center justify-between cursor-pointer relative transition-all border group"
    :class="[cardClass, selectedBorderClass]"
    @click="$emit('select', itemId)"
  >
    <!-- Top Right: Due Date and Dropdown -->
    <div class="absolute top-4 right-4 flex items-center gap-2 z-10">
      <!-- Due Date / Expected Close Date -->
      <span 
        v-if="displayDate"
        class="text-xs font-bold uppercase leading-none shrink-0"
        :class="displayDate.status.textClass"
      >
        {{ displayDate.text }}
      </span>

      <!-- Menu Button -->
      <button 
        v-if="showMenu"
        @click.stop="$emit('menu-click', item.id)"
        class="text-gray-300 hover:text-gray-600"
      >
        <i class="fa-solid fa-ellipsis-vertical"></i>
      </button>
    </div>

    <!-- Card Menu Dropdown -->
    <div 
      v-if="openMenuId === item.id && showMenu"
      class="absolute right-4 top-10 z-50 w-40 bg-white border border-black/10 rounded-lg shadow-nsc-card py-1"
      v-click-outside="() => $emit('menu-close')"
      @click.stop
    >
      <button
        v-for="menuItem in menuItems"
        :key="menuItem.key"
        @click="menuItem.onClick"
        class="w-full px-3 py-2 text-left text-xs text-foreground hover:bg-muted flex items-center gap-2"
      >
        {{ menuItem.label }}
      </button>
    </div>

    <div class="flex flex-col min-w-0 flex-1 pr-4">
      <div class="flex items-center gap-1 mb-0.5">
        <h3 v-if="actionTitle" class="font-bold text-foreground text-base truncate">{{ actionTitle }}</h3>
      </div>
      <div class="flex items-center gap-2 overflow-hidden">
        <span class="text-muted-foreground text-sm truncate">{{ getName(item) }}</span>
      </div>
      
      <!-- Badges -->
      <div class="mt-2">
        <TaskBadges :task="item" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatDueDate, getDeadlineStatus } from '@/utils/formatters'
import { getTaskActionTitle } from '@/utils/taskActionTitle'
import TaskBadges from './shared/TaskBadges.vue'

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
    default: 'bg-white border-2 border-blue-500'
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

const selectedBorderClass = computed(() => {
  if (!isSelected.value) return ''
  return props.item?.type === 'opportunity' ? 'task-card-selected task-card-selected-opportunity' : 'task-card-selected'
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

const expectedCloseDate = computed(() => {
  if (props.item.type !== 'opportunity' || !props.item.expectedCloseDate) return null
  
  const date = props.item.expectedCloseDate
  const status = getDeadlineStatus(date)
  
  return {
    text: formatDueDate(date),
    status
  }
})

// Display expected close date for opportunities, or deadline for leads/opportunities without expected close date
const displayDate = computed(() => {
  if (props.item.type === 'opportunity' && expectedCloseDate.value) {
    return expectedCloseDate.value
  }
  return deadline.value
})

const deadlineDotClass = computed(() => {
  if (!deadline.value) return ''
  // Convert text color class to background color class (e.g., text-red-700 -> bg-red-700)
  return deadline.value.status.textClass.replace('text-', 'bg-')
})

const displayDateDotClass = computed(() => {
  if (!displayDate.value) return ''
  // Convert text color class to background color class (e.g., text-red-700 -> bg-red-700)
  return displayDate.value.status.textClass.replace('text-', 'bg-')
})

const cardRef = ref(null)
</script>

<style scoped>
.task-card:hover {
  box-shadow: var(--nsc-card-shadow);
}

.task-card.task-card-selected {
  border: 2px solid #0470e9 !important;
}

.task-card.task-card-selected.task-card-selected-opportunity {
  border-color: #7c3aed !important;
}
</style>
