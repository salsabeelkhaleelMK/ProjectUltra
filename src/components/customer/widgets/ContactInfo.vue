<template>
  <div class="w-full">
    <!-- Row 1: Header with customer info, actions, and expander arrow -->
    <div class="flex items-center justify-between gap-3 md:gap-4">
      <div class="flex items-center gap-3 md:gap-4 flex-1">
        <!-- Customer Avatar -->
        <div 
          class="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 border-white shadow-sm shrink-0"
          :class="avatarColorClass"
        >
          {{ initials }}
        </div>
        
        <!-- Name & Tags -->
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <h1 class="heading-main truncate">{{ name }}</h1>
            <slot name="name-action"></slot>
          </div>
          <div class="flex flex-wrap items-center gap-2 mt-1">
            <slot name="tags"></slot>
          </div>
        </div>
      </div>
      
      <!-- Quick Action Button and Expander Arrow -->
      <div class="flex items-center gap-1 ml-2">
        <div class="relative">
          <button 
            @click.stop="showQuickActionMenu = !showQuickActionMenu"
            class="w-9 h-9 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg shrink-0 transition-colors"
          >
            <i class="fa-solid fa-plus text-sm"></i>
          </button>
          
          <!-- Quick Action Dropdown Menu -->
          <div 
            v-if="showQuickActionMenu"
            class="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-100/50 z-50 overflow-hidden flex flex-col p-1"
            v-click-outside="() => showQuickActionMenu = false"
          >
            <button 
              @click="handleAction('note')" 
              class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
            >
              Note
            </button>
            <button 
              @click="handleAction('financing')" 
              class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
            >
              Financing
            </button>
            <button 
              @click="handleAction('tradein')" 
              class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
            >
              Trade-in
            </button>
            <button 
              @click="handleAction('purchase')" 
              class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
            >
              Purchase
            </button>
            <button 
              @click="handleAction('attachment')" 
              class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
            >
              Attachment
            </button>
            <div class="border-t border-gray-100 my-1"></div>
            <button 
              @click="handleAction('whatsapp')" 
              class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <i class="fa-brands fa-whatsapp text-xs text-gray-400"></i> WhatsApp msg
            </button>
            <button 
              @click="handleAction('email')" 
              class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <i class="fa-regular fa-envelope text-xs text-gray-400"></i> Email
            </button>
            <button 
              @click="handleAction('sms')" 
              class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <i class="fa-solid fa-comment-dots text-xs text-gray-400"></i> SMS
            </button>
            <button 
              @click="handleAction('call')" 
              class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <i class="fa-solid fa-phone text-xs text-gray-400"></i> Call
            </button>
            <div v-if="taskType === 'opportunity'" class="border-t border-gray-100 my-1"></div>
            <button 
              v-if="taskType === 'opportunity'"
              @click="handleAction('appointment')" 
              class="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
            >
              Appointment
            </button>
          </div>
        </div>
        
        <button 
          @click="showContactInfo = !showContactInfo" 
          class="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shrink-0"
        >
          <i class="fa-solid fa-chevron-up text-sm transition-transform duration-200" :class="{ 'rotate-180': showContactInfo }"></i>
        </button>
      </div>
    </div>
    
    <!-- Row 2: Expanded Contact Details -->
    <div 
      v-if="showContactInfo" 
      class="mt-4 pt-4 border-t-2 border-dashed border-gray-300 animate-fade-in relative"
    >
      <div class="flex items-center gap-4">
        <!-- Contact Details -->
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
          <!-- Email -->
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded bg-gray-100 flex items-center justify-center shrink-0">
              <i class="fa-regular fa-envelope text-gray-500 text-[10px]"></i>
            </div>
            <span class="text-xs text-gray-900 font-medium">{{ email }}</span>
            <button 
              @click.stop="copyToClipboard(email, 'email')"
              class="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              title="Copy email"
            >
              <i class="fa-regular fa-copy text-[10px]"></i>
            </button>
          </div>
          
          <!-- Phone -->
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded bg-gray-100 flex items-center justify-center shrink-0">
              <i class="fa-solid fa-phone text-gray-500 text-[10px]"></i>
            </div>
            <span class="text-xs text-gray-900 font-medium">{{ phone }}</span>
            <button 
              @click.stop="copyToClipboard(phone, 'phone')"
              class="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              title="Copy phone"
            >
              <i class="fa-regular fa-copy text-[10px]"></i>
            </button>
          </div>
          
          <!-- Third Field (Address/Date) -->
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded bg-gray-100 flex items-center justify-center shrink-0">
              <i class="fa-solid fa-map-marker-alt text-gray-500 text-[10px]" v-if="thirdFieldLabel.toLowerCase().includes('address')"></i>
              <i class="fa-regular fa-calendar text-gray-500 text-[10px]" v-else></i>
            </div>
            <span class="text-xs text-gray-900 font-medium">{{ thirdFieldValue }}</span>
          </div>
        </div>
      </div>
      
      <!-- Copied toast -->
      <div 
        v-if="copiedField"
        class="absolute -bottom-6 left-0 px-2 py-1 bg-gray-900 text-white text-[10px] rounded shadow-lg whitespace-nowrap"
      >
        {{ copiedField === 'email' ? 'Email' : 'Phone' }} copied!
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
  initials: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avatarColorClass: {
    type: String,
    default: 'bg-orange-100 text-orange-600'
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  thirdFieldValue: {
    type: String,
    required: true
  },
  emailLabel: {
    type: String,
    default: 'Email'
  },
  phoneLabel: {
    type: String,
    default: 'Phone'
  },
  thirdFieldLabel: {
    type: String,
    default: 'Expected Close'
  },
  taskType: {
    type: String,
    default: 'lead' // 'lead' | 'opportunity' | 'contact'
  }
})

const emit = defineEmits(['action'])

const showContactInfo = ref(false)
const showQuickActionMenu = ref(false)
const copiedField = ref(null)

const handleAction = (action) => {
  showQuickActionMenu.value = false
  emit('action', action)
}

const copyToClipboard = async (text, field) => {
  try {
    await navigator.clipboard.writeText(text)
    copiedField.value = field
    setTimeout(() => {
      copiedField.value = null
    }, 1500)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>
