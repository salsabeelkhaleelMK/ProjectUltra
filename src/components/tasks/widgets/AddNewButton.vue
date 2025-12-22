<template>
  <div 
    v-if="show" 
    class="relative flex items-center"
    :class="inline ? 'justify-end mb-0 py-0' : 'py-1 mb-4'"
  >
    <div v-if="!inline" class="flex-grow border-t border-gray-200"></div>
    <div class="relative" :class="inline ? 'mx-0' : 'mx-4'">
      <button 
        @click.stop="showMenu = !showMenu"
        :class="buttonClass"
      >
        <i class="fa-solid fa-plus text-[10px] md:text-xs"></i> 
        <span class="text-xs md:text-sm">Add new</span>
      </button>
      
      <!-- Dropdown Menu -->
      <div 
        v-if="showMenu"
        class="absolute top-full right-0 md:left-1/2 md:-translate-x-1/2 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-100/50 z-10 overflow-hidden flex flex-col p-1"
        v-click-outside="() => showMenu = false"
      >
        <!-- Vehicle Actions (at the top, only for opportunities) -->
        <template v-if="hasVehicleActions">
          <button 
            v-if="filteredActions.includes('addVehicle')"
            @click="handleAction('addVehicle')" 
            class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
          >
            Add Vehicle
          </button>
          <button 
            v-if="filteredActions.includes('configureVehicle')"
            @click="handleAction('configureVehicle')" 
            class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
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
            class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
          >
            Note
          </button>
          <button 
            v-if="filteredActions.includes('purchase-method')"
            @click="handleAction('purchase-method')" 
            class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
          >
            Purchase Method
          </button>
          <button 
            v-if="filteredActions.includes('tradein')"
            @click="handleAction('tradein')" 
            class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
          >
            Trade-in
          </button>
          <button 
            v-if="filteredActions.includes('requestedCar')"
            @click="handleAction('requestedCar')" 
            class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
          >
            Requested car
          </button>
          <button 
            v-if="filteredActions.includes('attachment')"
            @click="handleAction('attachment')" 
            class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
          >
            Attachment
          </button>
        </template>
        
        <!-- Communication Actions -->
        <template v-if="hasCommunicationActions">
          <div class="border-t border-gray-100 my-1"></div>
          <button 
            v-if="filteredActions.includes('email')"
            @click="handleAction('email')" 
            class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <i class="fa-regular fa-envelope text-xs text-gray-400"></i> Send Email
          </button>
          <button 
            v-if="filteredActions.includes('whatsapp')"
            @click="handleAction('whatsapp')" 
            class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <i class="fa-brands fa-whatsapp text-xs text-gray-400"></i> Send WhatsApp
          </button>
          <button 
            v-if="filteredActions.includes('sms')"
            @click="handleAction('sms')" 
            class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium flex items-center gap-2"
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
    default: () => ['note', 'purchase-method', 'tradein', 'attachment', 'email', 'whatsapp', 'sms']
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

const buttonClass = computed(() => {
  if (props.inline) {
    // Overview usage: blue button with rounded corners, responsive padding
    return 'bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 md:px-4 py-2 md:py-2 text-xs md:text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 md:gap-2 z-20 relative whitespace-nowrap'
  }
  // Default usage (other tabs): original gray rounded pill with separators
  return 'bg-gray-50 hover:bg-white border border-gray-200 text-slate-700 font-medium px-4 py-1.5 rounded-full text-sm shadow-sm transition-all flex items-center gap-2 z-20 relative'
})

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

const hasCommunicationActions = computed(() => {
  return filteredActions.value.some(action => ['email', 'whatsapp', 'sms'].includes(action))
})

const hasVehicleActions = computed(() => {
  return filteredActions.value.some(action => ['addVehicle', 'configureVehicle'].includes(action))
})

const hasCommonActions = computed(() => {
  return filteredActions.value.some(action => ['note', 'purchase-method', 'tradein', 'attachment', 'requestedCar'].includes(action))
})

const handleAction = (action) => {
  showMenu.value = false
  emit('action', action)
}
</script>

