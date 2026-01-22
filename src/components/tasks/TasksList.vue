<template>
  <div 
    class="tasks-list-container border-r border-black/5 flex flex-col shrink-0 w-full lg:w-80 h-full"
  >
    <!-- Header: Title + View Toggle -->
    <header class="page-header shrink-0">
      <div class="page-header-main">
        <div class="page-header-content">
          <div class="page-header-title-container">
            <h1 class="page-header-title">{{ title }}</h1>
          </div>
          
          <!-- View Toggle -->
          <div class="page-header-actions">
            <div class="bg-white border border-black/5 p-0.5 rounded-btn inline-flex gap-0.5">
              <button
                @click="$emit('view-change', 'table')"
                :class="[
                  'h-7 px-2.5 rounded-md transition-all flex items-center justify-center',
                  viewMode === 'table' 
                    ? 'bg-brand-gray text-heading shadow-sm' 
                    : 'text-sub hover:text-heading'
                ]"
                title="Table View"
              >
                <Table :size="14" />
              </button>
              <button
                @click="$emit('view-change', 'card')"
                :class="[
                  'h-7 px-2.5 rounded-md transition-all flex items-center justify-center',
                  viewMode === 'card' 
                    ? 'bg-brand-gray text-heading shadow-sm' 
                    : 'text-sub hover:text-heading'
                ]"
                title="Card View"
              >
                <LayoutGrid :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
    
    
    <!-- Search Bar with Filter Button -->
    <div class="px-5 py-3">
      <div class="flex items-center gap-2">
        <div class="relative flex-1">
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-sub text-fluid-sm"></i>
          <input 
            v-model="searchQuery"
            type="text" 
            :placeholder="searchPlaceholder" 
            class="w-full bg-white border border-black/5 rounded-btn pl-9 pr-3 py-2 text-fluid-sm"
          />
        </div>
        <TaskFilters
          :active-filters="activeFilters"
          :sort-option="currentSort"
          :button-only="true"
          @filter-change="$emit('filter-change', $event)"
          @sort-change="selectSort"
        />
      </div>
      
      <!-- Filter Chips -->
      <div v-if="activeFilters.length > 0" class="mt-2">
        <TaskFilters
          :active-filters="activeFilters"
          :sort-option="currentSort"
          :chips-only="true"
          @filter-change="$emit('filter-change', $event)"
          @sort-change="selectSort"
        />
      </div>
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
import { Table, LayoutGrid } from 'lucide-vue-next'
import TaskCard from '@/components/tasks/TaskCard.vue'
import TaskFilters from '@/components/tasks/TaskFilters.vue'

const props = defineProps({
  title: { type: String, default: 'Tasks' },
  items: { type: Array, default: () => [] },
  selectedId: { type: [String, Number], default: null },
  activeFilters: { type: Array, default: () => [] },
  initialSearchQuery: { type: String, default: '' },
  selectedClass: { type: [String, Function], default: '' },
  unselectedClass: { type: [String, Function], default: '' },
  openMenuId: { type: [String, Number], default: null },
  getName: { type: Function, default: (item) => item.name || 'Unknown' },
  getVehicleInfo: { type: Function, default: () => 'No vehicle specified' },
  getMenuItems: { type: Function, default: null },
  showMenu: { type: Boolean, default: true },
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

<style scoped>
.tasks-list-container {
  background-color: var(--brand-gray) !important;
}
</style>
