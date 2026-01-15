<template>
  <div class="flex items-center gap-2">
    <!-- Type Filter Buttons -->
    <div v-if="showTypeFilter" class="flex gap-2">
      <button
        @click="$emit('filter-change', 'all')"
        class="text-xs font-medium px-3 py-1.5 rounded-md border transition-colors"
        :class="typeFilter === 'all' ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'"
      >
        All
      </button>
      <button
        @click="$emit('filter-change', 'lead')"
        class="text-xs font-medium px-3 py-1.5 rounded-md border transition-colors"
        :class="typeFilter === 'lead' ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'"
      >
        Leads
      </button>
      <button
        @click="$emit('filter-change', 'opportunity')"
        class="text-xs font-medium px-3 py-1.5 rounded-md border transition-colors"
        :class="typeFilter === 'opportunity' ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'"
      >
        Opportunities
      </button>
    </div>
    
    <!-- Sort Dropdown (Icon only) -->
    <div class="relative ml-auto" ref="sortContainer">
      <button
        @click.stop="toggleSortMenu"
        class="relative w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-900"
      >
        <i class="fa-solid fa-arrow-down-wide-short text-sm"></i>
        <span 
          v-if="sortOption && sortOption !== 'recent-first'"
          class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
          style="background-color: var(--brand-red);"
        ></span>
      </button>
      
      <transition name="dropdown">
        <div 
          v-if="showSortMenu"
          class="absolute right-0 mt-2 z-50 sort-dropdown-wrapper"
          v-click-outside="() => showSortMenu = false"
        >
          <DropdownMenu :items="sortMenuItems" className="w-56" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { DropdownMenu } from '@motork/component-library'

const props = defineProps({
  typeFilter: { type: String, default: 'all' },
  sortOption: { type: String, default: 'recent-first' },
  showTypeFilter: { type: Boolean, default: true },
  showClosed: { type: Boolean, default: false }
})

const emit = defineEmits(['filter-change', 'sort-change', 'toggle-closed'])

const showSortMenu = ref(false)

const toggleSortMenu = () => {
  showSortMenu.value = !showSortMenu.value
}

const selectSort = (option) => {
  showSortMenu.value = false
  emit('sort-change', option)
}

const sortMenuItems = computed(() => {
  const base = [
    { key: 'recent-first', label: 'Most Recent First', onClick: () => selectSort('recent-first') },
    ...(props.typeFilter === 'lead'
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
:deep(.sort-dropdown-wrapper *) {
  font-size: 0.875rem !important; /* text-sm - smaller text for all items */
}

/* Target all dropdown menu items */
:deep(.sort-dropdown-wrapper button),
:deep(.sort-dropdown-wrapper [role="menuitem"]),
:deep(.sort-dropdown-wrapper a),
:deep(.sort-dropdown-wrapper [class*="item"]) {
  font-size: 0.875rem !important; /* text-sm */
  position: relative;
  padding-left: 2.5rem !important; /* Space for dot */
}

/* Selected item styling using className */
:deep(.sort-dropdown-wrapper .sort-item-selected),
:deep(.sort-dropdown-wrapper button.sort-item-selected),
:deep(.sort-dropdown-wrapper [class*="item"].sort-item-selected) {
  background-color: rgba(248, 0, 50, 0.1) !important; /* Light red background */
}

/* Highlight dot for selected item */
:deep(.sort-dropdown-wrapper .sort-item-selected::before),
:deep(.sort-dropdown-wrapper button.sort-item-selected::before),
:deep(.sort-dropdown-wrapper [class*="item"].sort-item-selected::before) {
  content: '';
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background-color: var(--brand-red);
}
</style>
