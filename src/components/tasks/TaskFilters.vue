<template>
  <div v-if="!buttonOnly && !chipsOnly" class="flex flex-col gap-2">
    <!-- Filter Dropdown and Chips Row -->
    <div class="flex items-center gap-2 flex-wrap">
      <!-- Filter Dropdown (Icon only) -->
      <div class="relative" ref="filterContainer">
        <Button
          @click.stop="toggleFilterMenu"
          variant="outline"
          size="small"
          class="relative flex items-center justify-center w-8 h-8 p-0"
        >
          <i class="fa-solid fa-arrow-down-wide-short text-sm"></i>
          <Badge
            v-if="activeFilters.length > 0 || (sortOption && sortOption !== 'recent-first')"
            :text="String(activeFilters.length + (sortOption && sortOption !== 'recent-first' ? 1 : 0))"
            size="small"
            theme="blue"
            class="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center text-xs leading-none"
          />
        </Button>
        
        <transition name="dropdown-fade">
          <div 
            v-if="showFilterMenu"
            class="absolute left-0 mt-2 z-50 filter-dropdown-wrapper"
            v-click-outside="() => showFilterMenu = false"
          >
            <DropdownMenu :items="combinedMenuItems" className="w-56" />
          </div>
        </transition>
      </div>
      
      <!-- Filter Chips -->
      <div v-if="activeFilters.length > 0" class="flex items-center gap-2 flex-wrap">
        <div
          v-for="filterKey in activeFilters"
          :key="filterKey"
          class="inline-flex items-center gap-1.5"
        >
          <Badge
            :text="getFilterLabel(filterKey)"
            theme="gray"
            size="small"
          />
          <button
            @click.stop="removeFilter(filterKey)"
            class="ml-1 hover:opacity-70 transition-opacity p-0.5"
            aria-label="Remove filter"
          >
            <i class="fa-solid fa-xmark text-xs text-sub"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Button Only Mode -->
  <div v-else-if="buttonOnly" class="relative" ref="filterContainer">
    <Button
      @click.stop="toggleFilterMenu"
      variant="outline"
      size="small"
      class="relative flex items-center justify-center w-8 h-8 p-0"
    >
      <i class="fa-solid fa-arrow-down-wide-short text-sm"></i>
      <Badge
        v-if="activeFilters.length > 0 || (sortOption && sortOption !== 'recent-first')"
        :text="String(activeFilters.length + (sortOption && sortOption !== 'recent-first' ? 1 : 0))"
        size="small"
        theme="blue"
        class="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center text-xs leading-none"
      />
    </Button>
    
    <transition name="dropdown-fade">
      <div 
        v-if="showFilterMenu"
        class="absolute right-0 mt-2 z-50 filter-dropdown-wrapper"
        v-click-outside="() => showFilterMenu = false"
      >
        <DropdownMenu :items="combinedMenuItems" className="w-56" />
      </div>
    </transition>
  </div>
  
  <!-- Chips Only Mode -->
  <div v-else-if="chipsOnly && activeFilters.length > 0" class="flex items-center gap-2 flex-wrap">
    <div
      v-for="filterKey in activeFilters"
      :key="filterKey"
      class="inline-flex items-center gap-1.5"
    >
      <Badge
        :text="getFilterLabel(filterKey)"
        theme="gray"
        size="small"
      />
      <button
        @click.stop="removeFilter(filterKey)"
        class="ml-1 hover:opacity-70 transition-opacity p-0.5"
        aria-label="Remove filter"
      >
        <i class="fa-solid fa-xmark text-xs text-sub"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { DropdownMenu, Button, Badge } from '@motork/component-library/future/primitives'

const props = defineProps({
  activeFilters: { type: Array, default: () => [] },
  sortOption: { type: String, default: 'recent-first' },
  showClosed: { type: Boolean, default: false },
  buttonOnly: { type: Boolean, default: false },
  chipsOnly: { type: Boolean, default: false }
})

const emit = defineEmits(['filter-change', 'sort-change', 'toggle-closed'])

const showFilterMenu = ref(false)

const toggleFilterMenu = () => {
  showFilterMenu.value = !showFilterMenu.value
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

// Build filter menu items
const filterMenuItems = computed(() => {
  return filterOptions.map(option => ({
    key: option.key,
    label: option.label,
    onClick: () => toggleFilter(option.key),
    className: props.activeFilters.includes(option.key) ? 'filter-item-selected' : ''
  }))
})

const selectSort = (option) => {
  showFilterMenu.value = false
  emit('sort-change', option)
}

// Build sort menu items
const sortMenuItems = computed(() => {
  const hasLeads = props.activeFilters.includes('lead')
  const base = [
    { key: 'recent-first', label: 'Most Recent First', onClick: () => selectSort('recent-first') },
    ...(hasLeads
      ? [{ key: 'urgent-first', label: 'Urgent first', onClick: () => selectSort('urgent-first') }]
      : []),
    { key: 'assigned-to-me', label: 'Assigned to me', onClick: () => selectSort('assigned-to-me') },
    { key: 'assigned-to-my-team', label: 'Assigned to my team', onClick: () => selectSort('assigned-to-my-team') }
  ]
  return base.map(item => ({
    ...item,
    className: item.key === props.sortOption ? 'sort-item-selected' : ''
  }))
})

// Combine filter and sort menu items
const combinedMenuItems = computed(() => {
  const filters = filterMenuItems.value
  const sorts = sortMenuItems.value
  
  // Combine filters and sort options (filters first, then sort options)
  return [
    ...filters,
    ...sorts
  ]
})
</script>

