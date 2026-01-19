<template>
  <div 
    class="bg-surface border-r border flex flex-col shrink-0 w-full lg:w-80 h-full"
  >
    <!-- Header: Title + View Toggle -->
    <header class="page-header shrink-0">
      <div class="page-header-main">
        <div class="page-header-content">
          <div>
            <h1 class="page-header-title">{{ title }}</h1>
          </div>
          
          <!-- View Toggle -->
          <div class="flex items-center gap-1 bg-surfaceSecondary rounded-lg p-1">
            <button
              @click="$emit('view-change', 'card')"
              :class="[
                'px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5',
                viewMode === 'card' 
                  ? 'bg-surface text-heading shadow-sm' 
                  : 'text-sub hover:text-body'
              ]"
              title="Card View"
            >
              <i class="fa-solid fa-columns text-xs"></i>
              <span>Card</span>
            </button>
            <button
              @click="$emit('view-change', 'table')"
              :class="[
                'px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5',
                viewMode === 'table' 
                  ? 'bg-surface text-heading shadow-sm' 
                  : 'text-sub hover:text-body'
              ]"
              title="Table View"
            >
              <i class="fa-solid fa-table text-xs"></i>
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>
    </header>
    
    
    <!-- Search Bar -->
    <div class="px-5 py-3">
      <div class="relative">
        <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-sub text-sm"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          :placeholder="searchPlaceholder" 
          class="w-full bg-surfaceSecondary border border rounded-lg pl-9 pr-3 py-2 text-sm"
        />
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
    
    <div ref="scrollContainer" class="flex-1 overflow-y-auto px-5 space-y-3 pt-4 pb-6 scrollbar-hide">
      <TaskCard
        v-for="item in filteredItems" 
        :key="item.compositeId || `${item.type || 'task'}-${item.id}`"
        :item="item"
        :selected="isSelected(item)"
        :selected-class="selectedClass"
        :unselected-class="unselectedClass"
        :show-menu="showMenu"
        :open-menu-id="openMenuId"
        :getName="getName"
        :getVehicleInfo="getVehicleInfo"
        :menu-items="getMenuItems ? getMenuItems(item) : null"
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
        <template #owner="{ item }">
          <slot name="owner" :item="item"></slot>
        </template>
        <template #dates="{ item }">
          <slot name="dates" :item="item"></slot>
        </template>
      </TaskCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import TaskCard from '@/components/tasks/TaskCard.vue'
import TaskFilters from '@/components/tasks/TaskFilters.vue'

const props = defineProps({
  title: { type: String, default: 'Tasks' },
  items: { type: Array, default: () => [] },
  selectedId: { type: [String, Number], default: null },
  typeFilter: { type: String, default: 'all' },
  initialSearchQuery: { type: String, default: '' },
  selectedClass: { type: [String, Function], default: '' },
  unselectedClass: { type: [String, Function], default: '' },
  openMenuId: { type: [String, Number], default: null },
  getName: { type: Function, default: (item) => item.name || 'Unknown' },
  getVehicleInfo: { type: Function, default: () => 'No vehicle specified' },
  getMenuItems: { type: Function, default: null },
  showMenu: { type: Boolean, default: true },
  showTypeFilter: { type: Boolean, default: true },
  searchPlaceholder: { type: String, default: 'Search tasks...' },
  viewMode: { type: String, default: 'card' }
})

const emit = defineEmits(['select', 'menu-click', 'menu-close', 'filter-change', 'sort-change', 'close', 'view-change'])

const searchQuery = ref(props.initialSearchQuery)
const scrollContainer = ref(null)
const currentSort = ref('recent-first')

// Watch for initialSearchQuery changes
watch(() => props.initialSearchQuery, (newVal) => {
  searchQuery.value = newVal
})

// Filter items based on search query
const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.items
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  return props.items.filter(item => {
    const name = props.getName(item).toLowerCase()
    const vehicleInfo = props.getVehicleInfo(item).toLowerCase()
    return name.includes(query) || vehicleInfo.includes(query)
  })
})

// Check if item is selected
const isSelected = (item) => {
  if (!props.selectedId) return false
  const itemId = item.compositeId || `${item.type || 'task'}-${item.id}`
  return itemId === props.selectedId
}

// Handle sort selection
const selectSort = (option) => {
  currentSort.value = option
  emit('sort-change', option)
}
</script>
