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
              { value: 'card', icon: 'fa-solid fa-list', label: 'Cards' },
              { value: 'table', icon: 'fa-solid fa-table', label: 'Table' }
            ]"
            @update:view="$emit('view-change', $event)"
          />
        </div>
      </div>
    </div>
    
    <!-- Filters -->
    <div v-if="showTypeFilter" class="px-5 py-3 bg-white border-b border-gray-100">
      <TaskFilters
        :type-filter="typeFilter"
        :sort-option="currentSort"
        :show-type-filter="showTypeFilter"
        @filter-change="$emit('filter-change', $event)"
        @sort-change="selectSort"
      />
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
        class="rounded-lg px-4 py-3 cursor-pointer transition-all relative group"
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
        
        <!-- Card Content -->
        <div class="space-y-3">
          <!-- Customer Section -->
          <div class="space-y-2">
            <!-- Top Row: Avatar + Name + Amount + Dropdown -->
            <div class="flex items-start gap-3">
              <!-- Avatar -->
              <div 
                class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                :class="avatarClass(item)"
              >
                {{ getInitials(item) }}
              </div>
              
              <!-- Name and Amount -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2 mb-0.5">
                  <div class="font-bold text-gray-900 text-sm leading-tight truncate">{{ getName(item) }}</div>
                  <div class="text-right shrink-0">
                    <slot name="meta" :item="item"></slot>
                  </div>
                </div>
                
                <!-- Vehicle Info with Type Badge -->
                <div class="flex items-center gap-2 mt-1">
                  <div class="text-gray-600 text-xs truncate flex-1 min-w-0">{{ getVehicleInfo(item) }}</div>
                  <slot name="vehicle-type" :item="item"></slot>
                </div>
              </div>
              
              <!-- Dropdown Button (Always Visible) -->
              <button 
                v-if="showMenu"
                @click.stop="$emit('menu-click', item.id)"
                class="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors shrink-0"
              >
                <i class="fa-solid fa-ellipsis-vertical text-sm"></i>
              </button>
            </div>
          </div>
          
          <!-- Separator -->
          <div class="border-t border-gray-100"></div>
          
          <!-- Task Info Section -->
          <div class="space-y-2">
            <!-- Owner and Due Date Row -->
            <div class="flex items-center justify-between gap-3">
              <slot name="owner" :item="item"></slot>
              <slot name="dates" :item="item"></slot>
            </div>
            
            <!-- Badges Row -->
            <div class="flex items-center gap-1.5 flex-wrap">
              <slot name="badges" :item="item"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import TaskFilters from './TaskFilters.vue'
import ViewToggle from '@/components/shared/ViewToggle.vue'

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

