<template>
  <div class="relative">
    <button 
      @click.stop="toggleDropdown"
      class="w-auto bg-surface hover:bg-muted border border-border text-muted-foreground font-medium px-4 py-2 rounded-lg text-xs flex items-center justify-between gap-2 transition-colors whitespace-nowrap"
      :disabled="!actions || actions.length === 0"
    >
      <span>More actions</span>
      <i 
        class="fa-solid fa-chevron-down text-xs transition-transform duration-200 flex-shrink-0"
        :class="{ 'rotate-180': isOpen }"
      ></i>
    </button>

    <!-- Dropdown menu -->
    <div 
      v-if="isOpen && menuItems.length > 0"
      class="absolute top-full right-0 mt-2 z-50 dropdown-menu-small"
      v-click-outside="closeDropdown"
    >
      <DropdownMenu :items="menuItems" className="w-56" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { DropdownMenu } from '@motork/component-library/future/primitives'

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

<style>
/* Apply smaller text size to dropdown menu items - unscoped for higher specificity */
.dropdown-menu-small button,
.dropdown-menu-small a,
.dropdown-menu-small [role="menuitem"],
.dropdown-menu-small div[role="menuitem"],
.dropdown-menu-small span,
.dropdown-menu-small li button,
.dropdown-menu-small li a {
  font-size: var(--text-xs, 0.75rem) !important;
  line-height: 1.5 !important;
}

/* Target nested elements more aggressively */
.dropdown-menu-small * {
  font-size: var(--text-xs, 0.75rem) !important;
}
</style>

