<template>
  <div 
    v-if="show" 
    class="relative flex items-center"
    :class="inline ? 'justify-end mb-0 py-0' : 'py-1 mb-4'"
  >
    <div v-if="!inline" class="flex-grow border-t border-gray-200"></div>
    <div class="relative" :class="inline ? 'mx-0' : 'mx-4'">
      <button 
        @click.stop="handleButtonClick"
        :class="buttonClass"
      >
        <i class="fa-solid fa-plus text-xs"></i>
        <span v-if="showButtonText" class="ml-1.5">{{ buttonText }}</span>
      </button>
      
      <!-- Dropdown Menu (only show if there are multiple actions or it's communication tab) -->
      <div 
        v-if="showMenu && shouldShowDropdown"
        class="absolute top-full right-0 md:left-1/2 md:-translate-x-1/2 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-100/50 z-10 overflow-hidden flex flex-col p-1"
        v-click-outside="() => showMenu = false"
      >
        <!-- Vehicle Actions (at the top, only for opportunities) -->
        <template v-if="hasVehicleActions">
          <button 
            v-if="filteredActions.includes('addVehicle')"
            @click="handleAction('addVehicle')" 
            class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
          >
            Add Vehicle
          </button>
          <button 
            v-if="filteredActions.includes('configureVehicle')"
            @click="handleAction('configureVehicle')" 
            class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
          >
            Configure Vehicle
          </button>
        </template>
        
        <!-- Common Actions -->
        <template v-if="hasCommonActions">
          <div v-if="hasVehicleActions" class="border-t border-gray-100 my-1"></div>
          <button 
            v-if="filteredActions.includes('note')"
            @click="handleAction('note')" 
            class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
          >
            Note
          </button>
          <button 
            v-if="filteredActions.includes('financing')"
            @click="handleAction('financing')" 
            class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
          >
            Financing
          </button>
          <button 
            v-if="filteredActions.includes('tradein')"
            @click="handleAction('tradein')" 
            class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
          >
            Trade-in
          </button>
          <button 
            v-if="filteredActions.includes('requestedCar')"
            @click="handleAction('requestedCar')" 
            class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
          >
            Requested car
          </button>
          <button 
            v-if="filteredActions.includes('purchase')"
            @click="handleAction('purchase')" 
            class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
          >
            Purchase
          </button>
          <button 
            v-if="filteredActions.includes('attachment')"
            @click="handleAction('attachment')" 
            class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
          >
            Attachment
          </button>
        </template>
        
        <!-- Communication Actions -->
        <template v-if="hasCommunicationActions">
          <div v-if="hasVehicleActions || hasCommonActions" class="border-t border-gray-100 my-1"></div>
          <button 
            v-if="filteredActions.includes('email')"
            @click="handleAction('email')" 
            class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <i class="fa-regular fa-envelope text-xs text-gray-400"></i> Send Email
          </button>
          <button 
            v-if="filteredActions.includes('whatsapp')"
            @click="handleAction('whatsapp')" 
            class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <i class="fa-brands fa-whatsapp text-xs text-gray-400"></i> Send WhatsApp
          </button>
          <button 
            v-if="filteredActions.includes('sms')"
            @click="handleAction('sms')" 
            class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <i class="fa-solid fa-comment-dots text-xs text-gray-400"></i> Send SMS
          </button>
        </template>
      </div>
    </div>
    <div v-if="!inline" class="flex-grow border-t border-gray-200"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  actions: {
    type: Array,
    default: () => ['note', 'financing', 'tradein', 'attachment', 'email', 'whatsapp', 'sms']
  },
  activeTab: {
    type: String,
    default: 'overview'
  },
  inline: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['action'])

const showMenu = ref(false)

// Map actions to their owning tab (if any)
// Actions without a mapping are considered \"overview-only\"
const actionToTab = {
  note: 'note',
  attachment: 'attachment',
  email: 'communication',
  whatsapp: 'communication',
  sms: 'communication'
}

// Filter actions based on active tab
const filteredActions = computed(() => {
  // Overview: only allow actions that are NOT owned by any specific tab
  if (!props.activeTab || props.activeTab === 'overview') {
    return props.actions.filter(action => !actionToTab[action])
  }
  
  // Non-overview tabs: only allow actions mapped to this tab
  const allowedActions = Object.entries(actionToTab)
    .filter(([, tab]) => tab === props.activeTab)
    .map(([action]) => action)

  return props.actions.filter(action => allowedActions.includes(action))
})

// Check if we should show button text (single action, not communication tab)
const showButtonText = computed(() => {
  // Don't show text for communication tab (has multiple options)
  if (props.activeTab === 'communication') {
    return false
  }
  // Show text if there's only one filtered action
  return filteredActions.value.length === 1
})

// Get button text based on the single action
const buttonText = computed(() => {
  if (!showButtonText.value || filteredActions.value.length !== 1) {
    return ''
  }
  
  const action = filteredActions.value[0]
  const textMap = {
    note: 'add note',
    attachment: 'add attachment'
  }
  return textMap[action] || ''
})

// Check if we should show dropdown (multiple actions or communication tab)
const shouldShowDropdown = computed(() => {
  // Always show dropdown for communication tab
  if (props.activeTab === 'communication') {
    return true
  }
  // Show dropdown if there are multiple actions
  return filteredActions.value.length > 1
})

const buttonClass = computed(() => {
  if (props.inline) {
    // Overview usage: blue button with rounded corners, icon only
    return 'bg-blue-600 hover:bg-blue-700 text-white font-medium w-9 h-9 rounded-lg shadow-sm transition-all flex items-center justify-center z-20 relative'
  }
  // Default usage (other tabs): original gray rounded pill with separators
  // If showing text, adjust padding
  const baseClass = 'bg-gray-50 hover:bg-white border border-gray-200 text-gray-700 font-medium rounded-full text-sm shadow-sm transition-all flex items-center justify-center z-20 relative'
  if (showButtonText.value) {
    return `${baseClass} px-4 h-9`
  }
  return `${baseClass} w-9 h-9`
})

const hasCommunicationActions = computed(() => {
  return filteredActions.value.some(action => ['email', 'whatsapp', 'sms'].includes(action))
})

const hasVehicleActions = computed(() => {
  return filteredActions.value.some(action => ['addVehicle', 'configureVehicle'].includes(action))
})

const hasCommonActions = computed(() => {
  return filteredActions.value.some(action => ['note', 'financing', 'tradein', 'attachment', 'requestedCar', 'purchase'].includes(action))
})

const handleAction = (action) => {
  showMenu.value = false
  emit('action', action)
}

const handleButtonClick = () => {
  // If there's only one action and it's not communication tab, directly trigger it
  if (showButtonText.value && filteredActions.value.length === 1) {
    handleAction(filteredActions.value[0])
  } else {
    // Otherwise, show dropdown
    showMenu.value = !showMenu.value
  }
}
</script>

