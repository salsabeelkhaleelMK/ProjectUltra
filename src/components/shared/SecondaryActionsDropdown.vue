<template>
  <div class="relative" ref="dropdownRef">
    <button 
      @click="toggleDropdown"
      class="w-auto bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm flex items-center justify-between gap-2 transition-colors whitespace-nowrap"
      :disabled="!actions || actions.length === 0"
    >
      <span>More actions</span>
      <i 
        class="fa-solid fa-chevron-down text-xs transition-transform duration-200 flex-shrink-0"
        :class="{ 'rotate-180': isOpen }"
      ></i>
    </button>

    <!-- Dropdown menu -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-96 overflow-y-auto min-w-full"
        style="z-index: 9999;"
      >
        <button
          v-for="action in actions"
          :key="action.key"
          @click="handleActionClick(action)"
          class="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-start gap-3 border-b border-gray-100 last:border-b-0 transition-colors whitespace-nowrap"
          :class="{ 'opacity-50 cursor-not-allowed': action.disabled }"
          :disabled="action.disabled"
        >
          <i 
            :class="action.icon" 
            class="text-gray-400 mt-0.5 w-4 flex-shrink-0"
          ></i>
          <div class="flex-1">
            <div class="font-medium text-slate-700">{{ action.label }}</div>
            <div v-if="action.description" class="text-xs text-gray-500 mt-0.5">
              {{ action.description }}
            </div>
          </div>
        </button>
        
        <div v-if="!actions || actions.length === 0" class="px-4 py-3 text-sm text-gray-500 text-center">
          No actions available
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  actions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['action-selected'])

const isOpen = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const handleActionClick = (action) => {
  if (action.disabled) return
  
  closeDropdown()
  emit('action-selected', action)
  
  // Call handler if provided
  if (action.handler && typeof action.handler === 'function') {
    action.handler()
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

