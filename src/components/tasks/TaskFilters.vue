<template>
  <div v-if="!buttonOnly && !chipsOnly" class="flex flex-col gap-2">
    <!-- Filter Dropdown and Chips Row -->
    <div class="flex items-center gap-1.5 flex-wrap">
      <!-- Filter Dropdown (Icon only) -->
      <div class="relative" ref="filterContainer" v-click-outside="closeFilterMenu">
        <button
          @click="toggleFilterMenu"
          class="filter-dropdown-button"
        >
          <i class="fa-solid fa-arrow-down-wide-short text-sm"></i>
          <span 
            v-if="activeFilters.length > 0 || sortOption"
            class="filter-indicator"
          ></span>
        </button>
        
        <transition name="dropdown-fade">
          <div 
            v-if="showFilterMenu"
            class="absolute left-0 mt-2 z-50 w-56 bg-white border border-black/10 rounded-lg shadow-lg py-1"
            @click.stop
          >
            <!-- Filter Options -->
            <button
              v-for="option in filterOptions"
              :key="option.key"
              @click="toggleFilter(option.key)"
              class="w-full px-4 py-2 text-left text-sm text-heading hover:bg-surfaceSecondary flex items-center gap-2 relative"
              :class="{ 'bg-surfaceSecondary filter-item-selected': activeFilters.includes(option.key) }"
            >
              <span>{{ option.label }}</span>
            </button>
            
            <div class="border-t border-black/10 my-1"></div>
            
            <!-- Sort Options -->
            <button
              v-for="sortItem in sortMenuItems"
              :key="sortItem.key"
              @click="selectSort(sortItem.key)"
              class="w-full px-4 py-2 text-left text-sm text-heading hover:bg-surfaceSecondary flex items-center gap-2 relative"
              :class="{ 'bg-surfaceSecondary sort-item-selected': sortItem.key === sortOption }"
            >
              <span>{{ sortItem.label }}</span>
            </button>
          </div>
        </transition>
      </div>
      
      <!-- Filter and Sort Chips -->
      <div v-if="activeFilters.length > 0 || showSortChip" class="flex items-center gap-1.5 flex-wrap">
        <!-- Filter Chips -->
        <div
          v-for="filterKey in activeFilters"
          :key="filterKey"
          class="task-filter-badge"
        >
          <span>{{ getFilterLabel(filterKey) }}</span>
          <button
            @click="removeFilter(filterKey)"
            class="task-filter-badge-remove"
            aria-label="Remove filter"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <!-- Sort Chip -->
        <div
          v-if="showSortChip"
          class="task-filter-badge"
        >
          <span>{{ sortLabel }}</span>
          <button
            @click="removeSort"
            class="task-filter-badge-remove"
            aria-label="Remove sort"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Button Only Mode -->
  <div v-else-if="buttonOnly" class="relative" ref="filterContainer" v-click-outside="closeFilterMenu">
    <button
      @click="toggleFilterMenu"
      class="filter-dropdown-button"
    >
      <i class="fa-solid fa-arrow-down-wide-short text-sm"></i>
      <span 
        v-if="activeFilters.length > 0 || sortOption"
        class="filter-indicator"
      ></span>
    </button>
    
    <transition name="dropdown-fade">
      <div 
        v-if="showFilterMenu"
        class="absolute right-0 mt-2 z-50 w-56 bg-white border border-black/10 rounded-lg shadow-lg py-1"
        @click.stop
      >
        <!-- Filter Options -->
        <button
          v-for="option in filterOptions"
          :key="option.key"
          @click="toggleFilter(option.key)"
          class="w-full px-4 py-2 text-left text-sm text-heading hover:bg-surfaceSecondary flex items-center gap-2 relative"
          :class="{ 'bg-surfaceSecondary filter-item-selected': activeFilters.includes(option.key) }"
        >
          <span>{{ option.label }}</span>
        </button>
        
        <div class="border-t border-black/10 my-1"></div>
        
        <!-- Sort Options -->
        <button
          v-for="sortItem in sortMenuItems"
          :key="sortItem.key"
          @click="selectSort(sortItem.key)"
          class="w-full px-4 py-2 text-left text-sm text-heading hover:bg-surfaceSecondary flex items-center gap-2 relative"
          :class="{ 'bg-surfaceSecondary sort-item-selected': sortItem.key === sortOption }"
        >
          <span>{{ sortItem.label }}</span>
        </button>
      </div>
    </transition>
  </div>
  
  <!-- Chips Only Mode -->
  <div v-else-if="chipsOnly && (activeFilters.length > 0 || showSortChip)" class="flex items-center gap-1.5 flex-wrap">
    <!-- Filter Chips -->
    <div
      v-for="filterKey in activeFilters"
      :key="filterKey"
      class="task-filter-badge"
    >
      <span>{{ getFilterLabel(filterKey) }}</span>
      <button
        @click="removeFilter(filterKey)"
        class="task-filter-badge-remove"
        aria-label="Remove filter"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    
    <!-- Sort Chip -->
    <div
      v-if="showSortChip"
      class="task-filter-badge"
    >
      <span>{{ sortLabel }}</span>
      <button
        @click="removeSort"
        class="task-filter-badge-remove"
        aria-label="Remove sort"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  activeFilters: { type: Array, default: () => [] },
  sortOption: { type: String, default: '' },
  showClosed: { type: Boolean, default: false },
  buttonOnly: { type: Boolean, default: false },
  chipsOnly: { type: Boolean, default: false }
})

const emit = defineEmits(['filter-change', 'sort-change', 'toggle-closed'])

const showFilterMenu = ref(false)

const toggleFilterMenu = () => {
  showFilterMenu.value = !showFilterMenu.value
}

const closeFilterMenu = () => {
  showFilterMenu.value = false
}

// Filter options configuration
const filterOptions = [
  { key: 'lead', label: 'Leads', type: 'type' },
  { key: 'opportunity', label: 'Opportunities', type: 'type' },
  { key: 'due-in-24h', label: 'Due in 24 hours', type: 'date' },
  { key: 'to-be-called', label: 'To be called again', type: 'status' },
  { key: 'leads-1h', label: 'Leads created 1 hour ago', type: 'date' },
  { key: 'assigned-to-me', label: 'Assigned to me', type: 'assignee' }
]

// Get filter label by key
const getFilterLabel = (filterKey) => {
  const option = filterOptions.find(opt => opt.key === filterKey)
  return option ? option.label : filterKey
}

// Toggle filter on/off
const toggleFilter = (filterKey) => {
  showFilterMenu.value = false
  const currentFilters = [...props.activeFilters]
  const index = currentFilters.indexOf(filterKey)
  
  if (index > -1) {
    // Remove filter
    currentFilters.splice(index, 1)
  } else {
    // Add filter
    currentFilters.push(filterKey)
  }
  
  emit('filter-change', currentFilters)
}

// Remove filter from chips
const removeFilter = (filterKey) => {
  const currentFilters = [...props.activeFilters]
  const index = currentFilters.indexOf(filterKey)
  if (index > -1) {
    currentFilters.splice(index, 1)
    emit('filter-change', currentFilters)
  }
}

const selectSort = (option) => {
  showFilterMenu.value = false
  emit('sort-change', option)
}

// Remove sort chip (reset to default)
const removeSort = () => {
  emit('sort-change', '')
}

// Build sort menu items
const sortMenuItems = computed(() => {
  const hasLeads = props.activeFilters.includes('lead')
  return [
    { key: 'recent-first', label: 'Most Recent First' },
    ...(hasLeads ? [{ key: 'urgent-first', label: 'Urgent first' }] : []),
    { key: 'assigned-to-me', label: 'Assigned to me' },
    { key: 'assigned-to-my-team', label: 'Assigned to my team' }
  ]
})

// Show sort chip for currently selected sort
const showSortChip = computed(() => {
  return props.sortOption && props.sortOption !== '' && props.sortOption !== 'none'
})

// Get current sort label
const sortLabel = computed(() => {
  const sortItem = sortMenuItems.value.find(item => item.key === props.sortOption)
  return sortItem ? sortItem.label : props.sortOption
})
</script>
