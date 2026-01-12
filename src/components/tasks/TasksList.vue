<template>
  <div 
    class="bg-white border-r border-gray-200 flex flex-col shrink-0 w-full lg:w-80 h-full"
  >
    <!-- Header: Title + View Toggle -->
    <div class="px-4 md:px-8 py-4 md:py-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
      <div class="flex items-center justify-between gap-3">
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
        
        <!-- View Toggle (Desktop only) -->
        <div v-if="viewMode" class="hidden lg:flex">
          <ViewToggle
            :view="viewMode"
            :options="[
              { value: 'card', icon: 'fa-solid fa-grip', label: 'Cards' },
              { value: 'table', icon: 'fa-solid fa-list', label: 'Table' }
            ]"
            @update:view="$emit('view-change', $event)"
          />
        </div>
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
    
    <!-- Filters (Card View Only) -->
    <div v-if="showTypeFilter" class="px-5 pb-3">
      <TaskFilters
        :type-filter="typeFilter"
        :sort-option="currentSort"
        :show-type-filter="true"
        @filter-change="$emit('filter-change', $event)"
        @sort-change="selectSort"
      />
    </div>
    
    <div ref="scrollContainer" class="flex-1 overflow-y-auto px-4 space-y-4 pb-4 scrollbar-hide">
      <div 
        v-for="item in filteredItems" 
        :key="item.compositeId || `${item.type || 'task'}-${item.id}`"
        :ref="el => { if (isSelected(item)) selectedItemRef = el }"
        @click="$emit('select', item.compositeId || `${item.type || 'task'}-${item.id}` || item.id)"
        class="card card-hover min-h-[11rem] flex flex-col overflow-hidden cursor-pointer relative"
        :class="isSelected(item) ? (typeof selectedClass === 'function' ? selectedClass(item) : selectedClass) : (typeof unselectedClass === 'function' ? unselectedClass(item) : unselectedClass)"
      >
        <!-- Card Menu -->
        <div 
          v-if="openMenuId === item.id && showMenu"
          class="absolute right-2 top-10 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
          v-click-outside="() => $emit('menu-close')"
        >
          <slot name="menu" :item="item"></slot>
        </div>
        
        <!-- Top Bar: Badges + Dropdown -->
        <div class="flex items-center justify-between border-b border-gray-100 p-2 bg-gray-50">
          <div class="flex gap-2">
            <slot name="badges" :item="item"></slot>
          </div>
          <button 
            v-if="showMenu"
            @click.stop="$emit('menu-click', item.id)"
            class="text-gray-400 hover:text-gray-600 transition-colors pr-2"
          >
            <i class="fa-solid fa-ellipsis-vertical text-sm"></i>
          </button>
        </div>
        
        <!-- Main Content -->
        <div class="p-3 flex-1 flex flex-col justify-between">
          <!-- Avatar + Name + Location -->
          <div class="flex items-start gap-3 mb-3">
            <div 
              class="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-xs font-bold shrink-0"
              :class="avatarClass(item)"
            >
              {{ getInitials(item) }}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-bold text-gray-900 truncate">{{ getName(item) }}</h3>
              <p class="text-[10px] text-gray-500">
                <slot name="location" :item="item"></slot>
              </p>
            </div>
          </div>
          
          <!-- Car and Status Details -->
          <div class="space-y-1 mb-3">
            <div class="flex justify-between text-[10px]">
              <span class="text-gray-400">Car</span>
              <span class="font-medium text-gray-700 truncate ml-2">{{ getVehicleInfo(item) }}</span>
            </div>
            <div class="flex justify-between text-[10px]">
              <span class="text-gray-400">Status</span>
              <span class="font-medium text-gray-700">
                <slot name="vehicle-status" :item="item"></slot>
              </span>
            </div>
          </div>
          
          <!-- Footer: Assignee + Due Date -->
          <div class="border-t border-gray-100 pt-2 flex justify-between text-[9px] text-gray-400">
            <slot name="owner" :item="item"></slot>
            <slot name="dates" :item="item"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import ViewToggle from '@/components/shared/ViewToggle.vue'
import TaskFilters from './TaskFilters.vue'

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
    type: [String, Function],
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
  },
  viewMode: {
    type: String,
    default: 'card'
  }
})

const emit = defineEmits(['select', 'menu-click', 'menu-close', 'filter-change', 'sort-change', 'close', 'view-change'])

const searchQuery = ref('')
const currentSort = ref('none')

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

const selectSort = (sortOption) => {
  currentSort.value = sortOption
  emit('sort-change', sortOption)
}

// Refs for scroll functionality
const scrollContainer = ref(null)
const selectedItemRef = ref(null)

// Scroll to selected item when selectedId changes
watch(() => props.selectedId, async (newId) => {
  if (newId && selectedItemRef.value) {
    await nextTick()
    try {
      // Check if element still exists and is in the DOM
      if (selectedItemRef.value && selectedItemRef.value.parentNode) {
        selectedItemRef.value.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      }
    } catch (error) {
      // Silently handle DOM access errors
      console.debug('Could not scroll to selected item:', error)
    }
  }
}, { immediate: true })

// Also scroll when filteredItems change (initial load)
watch(filteredItems, async () => {
  if (props.selectedId && selectedItemRef.value) {
    await nextTick()
    // Small delay to ensure the DOM is fully rendered
    setTimeout(() => {
      try {
        // Check if element still exists and is in the DOM
        if (selectedItemRef.value && selectedItemRef.value.parentNode) {
          selectedItemRef.value.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          })
        }
      } catch (error) {
        // Silently handle DOM access errors
        console.debug('Could not scroll to selected item:', error)
      }
    }, 100)
  }
}, { immediate: true })
</script>

<style scoped>
/* Dropdown animations */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>

