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
          <h1 class="text-lg md:text-xl font-bold text-gray-900 truncate">{{ name }}</h1>
          <div class="flex flex-wrap items-center gap-2 mt-1">
            <slot name="tags"></slot>
          </div>
        </div>
      </div>
      
      <!-- Contact actions + Expander Arrow -->
      <div class="flex items-center gap-1 ml-2">
        <button 
          class="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
          title="Call"
        >
          <i class="fa-solid fa-phone text-xs"></i>
        </button>
        <button 
          class="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
          title="Email"
        >
          <i class="fa-regular fa-envelope text-xs"></i>
        </button>
        <button 
          class="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
          title="WhatsApp"
        >
          <i class="fa-brands fa-whatsapp text-xs"></i>
        </button>
        <button 
          class="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-slate-500 hover:bg-gray-200 transition-colors"
          title="SMS"
        >
          <i class="fa-regular fa-comment-dots text-xs"></i>
        </button>
        <button 
          @click="showContactInfo = !showContactInfo" 
          class="w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shrink-0"
        >
          <i class="fa-solid fa-chevron-down text-sm transition-transform duration-200" :class="{ 'rotate-180': showContactInfo }"></i>
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
  }
})

const emit = defineEmits(['action'])

const showContactInfo = ref(false)
const copiedField = ref(null)

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

const handleAction = (action) => {
  emit('action', action, {
    email: props.email,
    phone: props.phone
  })
}
</script>
