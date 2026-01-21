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
      class="absolute top-2 right-2 pr-1 text-gray-300 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity z-10"
    >
      <i class="fa-solid fa-ellipsis-vertical"></i>
    </button>

    <!-- Card Menu Dropdown -->
    <div 
      v-if="openMenuId === item.id && showMenu"
      class="absolute right-2 top-7 z-50"
      v-click-outside="() => $emit('menu-close')"
    >
      <DropdownMenu v-if="menuItems && menuItems.length > 0" :items="menuItems" className="w-40 text-xs" />
    </div>

    <div class="flex flex-col min-w-0 pr-4">
      <h3 class="font-bold text-heading text-fluid-base truncate mb-0.5">{{ actionTitle }}</h3>
      <div class="flex items-center gap-2 overflow-hidden">
        <span class="text-sub text-fluid-sm truncate">{{ getName(item) }}</span>
      </div>
      
      <!-- Badges -->
      <div class="flex flex-wrap gap-2 mt-2">
        <span 
          class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border leading-none"
          :class="item.type === 'lead' 
            ? 'bg-blue-50 text-blue-700 border-blue-200' 
            : 'bg-purple-50 text-purple-700 border-purple-200'"
        >
          {{ item.type === 'lead' ? 'Lead' : 'Opportunity' }}
        </span>
        <span 
          v-if="item.displayStage || item.stage"
          class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border leading-none"
          :class="stageColorClass"
        >
          {{ item.displayStage || item.stage }}
        </span>
        <span 
          v-if="item.priority === 'Hot'"
          class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-red-50 text-red-700 border border-red-200 leading-none"
        >
          Hot
        </span>
      </div>
    </div>
    
    <div v-if="deadline" class="shrink-0 ml-auto self-start mt-1">
      <span 
        class="px-3 py-1 rounded-lg text-[11px] font-bold border whitespace-nowrap"
        :class="[deadline.status.bgClass, deadline.status.textClass, deadline.status.borderClass]"
      >
        {{ deadline.text }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { DropdownMenu } from '@motork/component-library'
import { formatDueDate, getDeadlineStatus } from '@/utils/formatters'
import { getStageColor } from '@/utils/stageMapper'
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

const stageColorClass = computed(() => {
  const stage = props.item.displayStage || props.item.stage
  if (!stage) return 'bg-gray-100 text-gray-700'
  return getStageColor(stage, props.item.type || 'opportunity')
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

const cardRef = ref(null)
</script>

