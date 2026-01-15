<template>
  <div 
    ref="cardRef"
    @click="$emit('select', itemId)"
    class="bg-white rounded-lg p-2.5 min-h-32 flex flex-col justify-between hover:shadow-sm cursor-pointer relative"
    :class="cardClass"
  >
    <!-- Menu Button -->
    <button 
      v-if="showMenu"
      @click.stop="$emit('menu-click', item.id)"
      class="absolute top-3 right-3 text-gray-300 hover:text-gray-600"
    >
      <i class="fa-solid fa-ellipsis-vertical"></i>
    </button>

    <!-- Card Menu Dropdown -->
    <div 
      v-if="openMenuId === item.id && showMenu"
      class="absolute right-3 top-8 z-50"
      v-click-outside="() => $emit('menu-close')"
    >
      <DropdownMenu v-if="menuItems && menuItems.length > 0" :items="menuItems" className="w-40" />
    </div>

    <!-- Top Section: Badges, Name, Location/Source -->
    <div>
      <!-- Badges -->
      <div class="flex gap-2 mb-0.5">
        <span 
          class="px-2 py-0.5 rounded text-xs font-medium border"
          :class="item.type === 'lead' 
            ? 'bg-blue-50 text-blue-700 border-blue-200' 
            : 'bg-purple-50 text-purple-700 border-purple-200'"
        >
          {{ item.type === 'lead' ? 'Lead' : 'Opportunity' }}
        </span>
        <span 
          v-if="item.displayStage || item.stage"
          class="px-2 py-0.5 rounded text-xs font-medium border"
          :class="stageColorClass"
        >
          {{ item.displayStage || item.stage }}
        </span>
        <span 
          v-if="item.priority === 'Hot'"
          class="px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200"
        >
          Hot
        </span>
      </div>

      <!-- Name -->
      <h3 class="font-bold text-gray-900 text-content-bold line-clamp-2 pt-0.5">{{ getName(item) }}</h3>

      <!-- Location and Source -->
      <div class="flex gap-3 text-xs mt-0.5 mb-1">
        <span class="flex items-center gap-1.5">
          <i class="fa-solid fa-location-dot text-xs"></i>
          <slot name="location" :item="item"></slot>
        </span>
        <span class="flex items-center gap-1.5">
          <i class="fa-solid fa-globe text-xs"></i>
          <slot name="source" :item="item">
            {{ item.source || item.customer?.source || 'Unknown' }}
          </slot>
        </span>
      </div>

      <!-- Vehicle Details -->
      <p v-if="getVehicleInfo" class="text-xs text-gray-600 pb-3">{{ getVehicleInfo(item) }}</p>
    </div>

    <!-- Optional Footer: Owner + Due Date (hidden by default, can be shown via slot) -->
    <div v-if="$slots.owner || $slots.dates" class="flex items-center justify-between pt-1 border-t border-gray-100">
      <div class="text-xs flex items-center gap-2">
        <slot name="owner" :item="item">
          <template v-if="item.assignee">
            <div 
              class="rounded-full bg-black text-white font-medium flex items-center justify-center text-[6px] shrink-0 w-3 h-3"
            >
              {{ getAssigneeInitials(item.assignee) }}
            </div>
            <span class="text-gray-600 font-medium">{{ item.assignee }}</span>
          </template>
          <span v-else>Unassigned</span>
        </slot>
      </div>
      <div class="text-xs font-medium">
        <slot name="dates" :item="item"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { DropdownMenu } from '@motork/component-library'
import { getStageColor } from '@/utils/stageMapper'

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
    default: 'bg-white border border-gray-200 hover:border-blue-300'
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
    // Apply selected class - blue for leads, purple for opportunities
    const selected = typeof props.selectedClass === 'function' 
      ? props.selectedClass(props.item) 
      : props.selectedClass
    return selected
  }
  // Apply unselected class with hover states
  return typeof props.unselectedClass === 'function' 
    ? props.unselectedClass(props.item) 
    : props.unselectedClass
})

const stageColorClass = computed(() => {
  const stage = props.item.displayStage || props.item.stage
  if (!stage) return 'bg-gray-100 text-gray-700'
  return getStageColor(stage, props.item.type || 'opportunity')
})

const getAssigneeInitials = (assigneeName) => {
  if (!assigneeName) return '?'
  const parts = assigneeName.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return assigneeName.substring(0, 2).toUpperCase()
}

const cardRef = ref(null)
</script>

