<template>
  <div class="relative" v-click-outside="closeDropdown">
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
        class="absolute top-full right-0 mt-2 min-w-full z-[9999]"
      >
        <DropdownMenu :items="menuItems" className="min-w-full" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { DropdownMenu } from '@motork/component-library'

const props = defineProps({
  actions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['action-selected'])

const isOpen = ref(false)

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

const menuItems = computed(() => {
  return (props.actions || []).map(action => ({
    key: action.key,
    label: action.label,
    disabled: !!action.disabled,
    onClick: () => handleActionClick(action)
  }))
})
</script>

