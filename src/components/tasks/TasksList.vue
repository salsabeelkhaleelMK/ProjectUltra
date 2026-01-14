<template>
  <div 
    class="bg-white border-r border-gray-200 flex flex-col shrink-0 w-full lg:w-80 h-full"
  >
    <!-- Header: Title + View Toggle -->
    <header class="page-header shrink-0">
      <div class="page-header-main">
        <div class="page-header-content">
          <div>
            <h1 class="page-header-title">{{ title }}</h1>
          </div>
          
          <!-- View Toggle -->
          <div class="flex items-center gap-3">
            <ViewToggle
              v-if="viewMode"
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
    </header>
    
    
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
      <TaskCard
        v-for="item in filteredItems" 
        :key="item.compositeId || `${item.type || 'task'}-${item.id}`"
        :ref="el => { if (isSelected(item) && el) selectedItemRef = el.$el || el }"
        :item="item"
        :selected="isSelected(item)"
        :selected-class="selectedClass"
        :unselected-class="unselectedClass"
        :show-menu="showMenu"
        :open-menu-id="openMenuId"
        :getName="getName"
        :getVehicleInfo="getVehicleInfo"
        @select="$emit('select', $event)"
        @menu-click="$emit('menu-click', $event)"
        @menu-close="$emit('menu-close')"
      >
        <template #location="{ item }">
          <slot name="location" :item="item"></slot>
        </template>
        <template #source="{ item }">
          <slot name="source" :item="item"></slot>
        </template>
        <template #vehicle-status="{ item }">
          <slot name="vehicle-status" :item="item"></slot>
        </template>
        <template #owner="{ item }">
          <slot name="owner" :item="item"></slot>
        </template>
        <template #dates="{ item }">
          <slot name="dates" :item="item"></slot>
        </template>
        <template #menu="{ item }">
          <slot name="menu" :item="item"></slot>
        </template>
      </TaskCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import ViewToggle from '@/components/shared/ViewToggle.vue'
import TaskFilters from './TaskFilters.vue'
import TaskCard from './TaskCard.vue'

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
      const element = selectedItemRef.value.$el || selectedItemRef.value
      // Check if element still exists and is in the DOM
      if (element && element.parentNode) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      }
    } catch (error) {
      // Silently handle DOM access errors
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
        const element = selectedItemRef.value.$el || selectedItemRef.value
        // Check if element still exists and is in the DOM
        if (element && element.parentNode) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          })
        }
      } catch (error) {
        // Silently handle DOM access errors
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

