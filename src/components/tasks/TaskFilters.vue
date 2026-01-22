<template>
  <div class="flex flex-col gap-2">
    <!-- Filter Dropdown and Chips Row -->
    <div class="flex items-center gap-2 flex-wrap">
      <!-- Filter Dropdown (Icon only, matching old sort style) -->
      <div class="relative" ref="filterContainer">
        <button
          @click.stop="toggleFilterMenu"
          class="relative w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-900"
        >
          <i class="fa-solid fa-arrow-down-wide-short text-sm"></i>
          <span 
            v-if="activeFilters.length > 0 || (sortOption && sortOption !== 'recent-first')"
            class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white bg-black"
          ></span>
        </button>
        
        <transition name="dropdown">
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
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surfaceSecondary text-xs font-medium text-heading border border-E5E7EB"
        >
          <span>{{ getFilterLabel(filterKey) }}</span>
          <button
            @click="removeFilter(filterKey)"
            class="flex items-center justify-center w-4 h-4 rounded-full hover:bg-gray-200 transition-colors text-sub hover:text-heading"
            aria-label="Remove filter"
          >
            <i class="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { DropdownMenu } from '@motork/component-library'

const props = defineProps({
  activeFilters: { type: Array, default: () => [] },
  sortOption: { type: String, default: 'recent-first' },
  showClosed: { type: Boolean, default: false }
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

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Extended styling for Motork DropdownMenu */
:deep(.filter-dropdown-wrapper *) {
  font-size: 0.875rem !important; /* text-sm - smaller text for all items */
}

/* Target all dropdown menu items */
:deep(.filter-dropdown-wrapper button),
:deep(.filter-dropdown-wrapper [role="menuitem"]),
:deep(.filter-dropdown-wrapper a),
:deep(.filter-dropdown-wrapper [class*="item"]) {
  font-size: 0.875rem !important; /* text-sm */
  position: relative;
  padding-left: 2.5rem !important; /* Space for dot */
}

/* Selected item styling using className */
:deep(.filter-dropdown-wrapper .filter-item-selected),
:deep(.filter-dropdown-wrapper .sort-item-selected),
:deep(.filter-dropdown-wrapper button.filter-item-selected),
:deep(.filter-dropdown-wrapper button.sort-item-selected),
:deep(.filter-dropdown-wrapper [class*="item"].filter-item-selected),
:deep(.filter-dropdown-wrapper [class*="item"].sort-item-selected) {
  background-color: var(--color-bg-surface-secondary) !important; /* Light grey background */
}

/* Highlight dot for selected item */
:deep(.filter-dropdown-wrapper .filter-item-selected::before),
:deep(.filter-dropdown-wrapper .sort-item-selected::before),
:deep(.filter-dropdown-wrapper button.filter-item-selected::before),
:deep(.filter-dropdown-wrapper button.sort-item-selected::before),
:deep(.filter-dropdown-wrapper [class*="item"].filter-item-selected::before),
:deep(.filter-dropdown-wrapper [class*="item"].sort-item-selected::before) {
  content: '';
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background-color: var(--brand-dark); /* Black dot instead of red */
}
</style>
