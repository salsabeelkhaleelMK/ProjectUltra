<template>
  <div class="flex items-center gap-2">
    <!-- Type Filter Buttons -->
    <div v-if="showTypeFilter" class="flex gap-2">
      <button
        @click="$emit('filter-change', 'all')"
        class="text-xs font-medium px-3 py-1.5 rounded-md border transition-colors"
        :class="typeFilter === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'"
      >
        All
      </button>
      <button
        @click="$emit('filter-change', 'lead')"
        class="text-xs font-medium px-3 py-1.5 rounded-md border transition-colors"
        :class="typeFilter === 'lead' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'"
      >
        Leads
      </button>
      <button
        @click="$emit('filter-change', 'opportunity')"
        class="text-xs font-medium px-3 py-1.5 rounded-md border transition-colors"
        :class="typeFilter === 'opportunity' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'"
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
          class="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"
        ></span>
      </button>
      
      <transition name="dropdown">
        <div 
          v-if="showSortMenu"
          class="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden"
          v-click-outside="() => showSortMenu = false"
        >
          <button 
            @click="selectSort('recent-first')"
            class="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            :class="{ 'bg-blue-50 text-blue-700': sortOption === 'recent-first' }"
          >
            <i class="fa-solid fa-check text-xs w-3" :class="sortOption === 'recent-first' ? 'opacity-100' : 'opacity-0'"></i>
            <span>Most Recent First</span>
          </button>
          <button 
            v-if="typeFilter === 'lead'"
            @click="selectSort('urgent-first')"
            class="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            :class="{ 'bg-blue-50 text-blue-700': sortOption === 'urgent-first' }"
          >
            <i class="fa-solid fa-check text-xs w-3" :class="sortOption === 'urgent-first' ? 'opacity-100' : 'opacity-0'"></i>
            <span>Urgent first</span>
          </button>
          <button 
            @click="selectSort('assigned-to-me')"
            class="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            :class="{ 'bg-blue-50 text-blue-700': sortOption === 'assigned-to-me' }"
          >
            <i class="fa-solid fa-check text-xs w-3" :class="sortOption === 'assigned-to-me' ? 'opacity-100' : 'opacity-0'"></i>
            <span>Assigned to me</span>
          </button>
          <button 
            @click="selectSort('assigned-to-my-team')"
            class="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            :class="{ 'bg-blue-50 text-blue-700': sortOption === 'assigned-to-my-team' }"
          >
            <i class="fa-solid fa-check text-xs w-3" :class="sortOption === 'assigned-to-my-team' ? 'opacity-100' : 'opacity-0'"></i>
            <span>Assigned to my team</span>
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
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
</style>

