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
        
        <!-- View Toggle -->
        <div v-if="viewMode" class="flex">
          <ViewToggle
            :view="viewMode"
            :options="[
              { value: 'card', icon: 'fa-solid fa-table', label: 'Cards' },
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
    
    <div ref="scrollContainer" class="flex-1 overflow-y-auto px-5 space-y-3 pt-4 pb-6 scrollbar-hide bg-gray-50/50">
      <div 
        v-for="item in filteredItems" 
        :key="item.compositeId || `${item.type || 'task'}-${item.id}`"
        :ref="el => { if (isSelected(item)) selectedItemRef = el }"
        @click="$emit('select', item.compositeId || `${item.type || 'task'}-${item.id}` || item.id)"
        class="bg-white border border-gray-100 rounded shadow-sm overflow-hidden cursor-pointer relative group transition-all hover:shadow-md"
        :class="[
          isSelected(item) ? (typeof selectedClass === 'function' ? selectedClass(item) : selectedClass) : (typeof unselectedClass === 'function' ? unselectedClass(item) : unselectedClass)
        ]"
      >
        <!-- Side Accent Bar -->
        <div 
          class="absolute top-0 bottom-0 left-0 w-1"
          :class="item.type === 'lead' ? 'bg-blue-500' : 'bg-purple-500'"
        ></div>

        <!-- Card Menu -->
        <div 
          v-if="openMenuId === item.id && showMenu"
          class="absolute right-3 top-10 w-40 bg-white border border-gray-200 rounded-sm shadow-xl z-50 overflow-hidden animate-fade-in"
          v-click-outside="() => $emit('menu-close')"
        >
          <slot name="menu" :item="item"></slot>
        </div>
        
        <div class="p-3 pl-3">
          <!-- Header: Avatar + Name + Type Badge -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div 
                class="w-8 h-8 rounded bg-gray-50 text-gray-600 font-bold flex items-center justify-center text-xs border border-gray-200 shrink-0"
                :class="avatarClass(item)"
              >
                {{ getInitials(item) }}
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-sm text-gray-900 truncate">{{ getName(item) }}</span>
                  <div 
                    v-if="item.priority === 'Hot'"
                    class="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"
                  ></div>
                </div>
                <div class="text-[10px] text-gray-400 truncate">
                  <slot name="location" :item="item"></slot>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span 
                class="text-[9px] font-bold px-1.5 py-0.5 rounded text-gray-500 bg-gray-50 uppercase"
              >
                {{ item.type === 'lead' ? 'Lead' : 'Opportunity' }}
              </span>
              <button 
                v-if="showMenu"
                @click.stop="$emit('menu-click', item.id)"
                class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-sm transition-all"
              >
                <i class="fa-solid fa-ellipsis-vertical text-sm"></i>
              </button>
            </div>
          </div>

          <!-- Details: Vehicle & Status Grid -->
          <div class="grid grid-cols-2 gap-2 bg-gray-50 rounded p-2 mb-2">
            <div class="min-w-0">
              <div class="text-[9px] text-gray-400 uppercase">Vehicle</div>
              <div class="text-xs font-medium text-gray-700 truncate">{{ getVehicleInfo(item) }}</div>
            </div>
            <div class="min-w-0">
              <div class="text-[9px] text-gray-400 uppercase">Status</div>
              <div class="text-xs text-gray-500 truncate">
                <slot name="vehicle-status" :item="item"></slot>
              </div>
            </div>
          </div>

          <!-- Footer: Owner + Due Date -->
          <div class="flex items-center justify-between">
            <div class="text-[10px] text-gray-400">
              Owned by <span class="text-gray-600 font-medium">
                <slot name="owner" :item="item"></slot>
              </span>
            </div>
            <div class="text-[10px] text-gray-400 font-medium">
              <slot name="dates" :item="item"></slot>
            </div>
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

