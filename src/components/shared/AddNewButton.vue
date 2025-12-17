<template>
  <div v-if="show" class="relative flex items-center py-2 mb-6">
    <div class="flex-grow border-t border-gray-200"></div>
    <div class="relative mx-4">
      <button 
        @click.stop="showMenu = !showMenu"
        class="bg-gray-50 hover:bg-white border border-gray-200 text-slate-700 font-medium px-4 py-1.5 rounded-full text-sm shadow-sm transition-all flex items-center gap-2 z-20 relative"
      >
        <i class="fa-solid fa-plus text-xs"></i> Add new
      </button>
      
      <!-- Dropdown Menu -->
      <div 
        v-if="showMenu"
        class="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-100/50 z-10 overflow-hidden flex flex-col p-1"
        v-click-outside="() => showMenu = false"
      >
        <!-- Vehicle Actions (at the top, only for opportunities) -->
        <template v-if="hasVehicleActions">
          <button 
            v-if="actions.includes('addVehicle')"
            @click="handleAction('addVehicle')" 
            class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
          >
            Add Vehicle
          </button>
          <button 
            v-if="actions.includes('configureVehicle')"
            @click="handleAction('configureVehicle')" 
            class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
          >
            Configure Vehicle
          </button>
        </template>
        
        <!-- Opportunity-specific Actions (Offer and Purchase, no icons) -->
        <template v-if="hasOpportunityActions">
          <div v-if="hasVehicleActions" class="border-t border-gray-100 my-1"></div>
          <button 
            v-if="actions.includes('offer')"
            @click="handleAction('offer')" 
            class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
          >
            Offer
          </button>
          <button 
            v-if="actions.includes('purchase')"
            @click="handleAction('purchase')" 
            class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
          >
            Purchase
          </button>
        </template>
        
        <!-- Common Actions -->
        <template v-if="hasCommonActions">
          <div v-if="hasOpportunityActions || hasVehicleActions" class="border-t border-gray-100 my-1"></div>
          <button 
            v-if="actions.includes('note')"
            @click="handleAction('note')" 
            class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
          >
            Note
          </button>
          <button 
            v-if="actions.includes('financing')"
            @click="handleAction('financing')" 
            class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
          >
            Financing
          </button>
          <button 
            v-if="actions.includes('tradein')"
            @click="handleAction('tradein')" 
            class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
          >
            Trade-in
          </button>
          <button 
            v-if="actions.includes('attachment')"
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
            v-if="actions.includes('email')"
            @click="handleAction('email')" 
            class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <i class="fa-regular fa-envelope text-xs text-gray-400"></i> Send Email
          </button>
          <button 
            v-if="actions.includes('whatsapp')"
            @click="handleAction('whatsapp')" 
            class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <i class="fa-brands fa-whatsapp text-xs text-gray-400"></i> Send WhatsApp
          </button>
          <button 
            v-if="actions.includes('sms')"
            @click="handleAction('sms')" 
            class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium flex items-center gap-2"
          >
            <i class="fa-solid fa-comment-dots text-xs text-gray-400"></i> Send SMS
          </button>
        </template>
      </div>
    </div>
    <div class="flex-grow border-t border-gray-200"></div>
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
  }
})

const emit = defineEmits(['action'])

const showMenu = ref(false)

const hasCommunicationActions = computed(() => {
  return props.actions.some(action => ['email', 'whatsapp', 'sms'].includes(action))
})

const hasOpportunityActions = computed(() => {
  return props.actions.some(action => ['offer', 'purchase'].includes(action))
})

const hasVehicleActions = computed(() => {
  return props.actions.some(action => ['addVehicle', 'configureVehicle'].includes(action))
})

const hasCommonActions = computed(() => {
  return props.actions.some(action => ['note', 'financing', 'tradein', 'attachment'].includes(action))
})

const handleAction = (action) => {
  showMenu.value = false
  emit('action', action)
}
</script>

