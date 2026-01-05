<template>
  <div 
    class="bg-white border-r border-gray-200 flex flex-col shrink-0 w-full lg:w-80 h-full"
  >
    <!-- Header: Title and Dropdown -->
    <div class="px-4 md:px-8 py-4 md:py-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <!-- Close button (mobile only) -->
          <button 
            v-if="showMobileClose"
            @click="$emit('close')"
            class="lg:hidden w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
          <h2 class="page-header-title">{{ title }}</h2>
        </div>
        <div class="flex items-center gap-2">
          <button class="text-xs font-medium bg-white hover:bg-gray-50 px-3 py-1.5 rounded-md border border-gray-200">
            Urgent first <i class="fa-solid fa-chevron-down text-[10px] ml-1"></i>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Type Filter Buttons -->
    <div v-if="showTypeFilter" class="px-5 py-3 bg-white">
      <div class="flex gap-2">
        <button
          @click="$emit('filter-change', 'all')"
          class="text-xs font-medium px-3 py-1.5 rounded-md border transition-colors"
          :class="typeFilter === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'"
        >
          All
        </button>
        <button
          @click="$emit('filter-change', 'lead')"
          class="text-xs font-medium px-3 py-1.5 rounded-md border transition-colors"
          :class="typeFilter === 'lead' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'"
        >
          Leads
        </button>
        <button
          @click="$emit('filter-change', 'opportunity')"
          class="text-xs font-medium px-3 py-1.5 rounded-md border transition-colors"
          :class="typeFilter === 'opportunity' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'"
        >
          Opportunities
        </button>
      </div>
    </div>
    
    <!-- Search Bar -->
    <div class="px-5 py-3">
      <div class="relative">
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-gray-400 text-sm"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          :placeholder="searchPlaceholder" 
          class="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm"
        >
      </div>
    </div>
    
    <div ref="scrollContainer" class="flex-1 overflow-y-auto px-4 space-y-4 pb-4 scrollbar-hide">
      <div 
        v-for="item in filteredItems" 
        :key="item.id"
        :ref="el => { if (isSelected(item)) selectedItemRef = el }"
        @click="$emit('select', item.compositeId || `${item.type || 'task'}-${item.id}` || item.id)"
        class="rounded-xl px-4 py-3.5 cursor-pointer transition-all relative group"
        :class="isSelected(item) ? (typeof selectedClass === 'function' ? selectedClass(item) : selectedClass) : (typeof unselectedClass === 'function' ? unselectedClass(item) : unselectedClass)"
      >
        <!-- Top right menu button -->
        <button 
          v-if="showMenu"
          @click.stop="$emit('menu-click', item.id)"
          class="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <i class="fa-solid fa-ellipsis-vertical text-xs"></i>
        </button>
        
        <!-- Card Menu -->
        <div 
          v-if="openMenuId === item.id && showMenu"
          class="absolute right-2 top-8 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
          v-click-outside="() => $emit('menu-close')"
        >
          <slot name="menu" :item="item"></slot>
        </div>
        
        <!-- Main content: Avatar, Name, Vehicle, Amount/Due -->
        <div class="flex items-start gap-3.5 pr-6">
          <!-- Avatar -->
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            :class="avatarClass(item)"
          >
            {{ getInitials(item) }}
          </div>
          
          <!-- Name and Vehicle -->
          <div class="flex-1 min-w-0">
            <div class="font-bold text-gray-800 text-sm leading-snug truncate">{{ getName(item) }}</div>
            <div class="text-gray-600 text-xs mt-1 truncate">{{ getVehicleInfo(item) }}</div>
          </div>
          
          <!-- Right side: Amount -->
          <div class="text-right shrink-0">
            <slot name="meta" :item="item"></slot>
            <slot name="footer" :item="item"></slot>
          </div>
        </div>
        
        <!-- Dates row (between customer info and badges) -->
        <div class="mt-2.5">
          <slot name="dates" :item="item"></slot>
        </div>
        
        <!-- Tags at bottom -->
        <div class="flex items-center gap-2 flex-wrap mt-3">
          <slot name="badges" :item="item"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  selectedId: {
    type: [Number, String],
    default: null
  },
  selectedClass: {
    type: [String, Function],
    default: 'bg-white border-2 border-blue-500 shadow-md'
  },
  unselectedClass: {
    type: String,
    default: 'bg-white border border-gray-200 hover:border-blue-300'
  },
  searchPlaceholder: {
    type: String,
    default: 'Search...'
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
  getInitials: {
    type: Function,
    required: true
  },
  getVehicleInfo: {
    type: Function,
    required: true
  },
  avatarClass: {
    type: Function,
    default: () => 'bg-orange-100 text-orange-600'
  },
  typeFilter: {
    type: String,
    default: 'all'
  },
  showTypeFilter: {
    type: Boolean,
    default: false
  },
  showMobileClose: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select', 'menu-click', 'menu-close', 'filter-change', 'close'])

const searchQuery = ref('')

const filteredItems = computed(() => {
  let items = props.items
  
  // Apply type filter if provided
  if (props.typeFilter && props.typeFilter !== 'all') {
    items = items.filter(item => item.type === props.typeFilter)
  }
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item => {
      const name = props.getName(item).toLowerCase()
      const vehicle = props.getVehicleInfo(item).toLowerCase()
      return name.includes(query) || vehicle.includes(query)
    })
  }
  
  return items
})

const isSelected = (item) => {
  const itemId = item.compositeId || `${item.type || 'task'}-${item.id}` || item.id
  return props.selectedId === itemId
}

// Refs for scroll functionality
const scrollContainer = ref(null)
const selectedItemRef = ref(null)

// Scroll to selected item when selectedId changes
watch(() => props.selectedId, async (newId) => {
  if (newId && selectedItemRef.value) {
    await nextTick()
    selectedItemRef.value.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    })
  }
}, { immediate: true })

// Also scroll when filteredItems change (initial load)
watch(filteredItems, async () => {
  if (props.selectedId && selectedItemRef.value) {
    await nextTick()
    // Small delay to ensure the DOM is fully rendered
    setTimeout(() => {
      if (selectedItemRef.value) {
        selectedItemRef.value.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      }
    }, 100)
  }
}, { immediate: true })
</script>

