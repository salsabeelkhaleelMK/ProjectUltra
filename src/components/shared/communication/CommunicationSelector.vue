<template>
  <div class="space-y-3">
    <!-- Channel Selection Buttons (Always Visible) -->
    <div class="space-y-2">
      <h5 v-if="title" class="font-semibold text-heading text-fluid-sm mb-2">{{ title }}</h5>
      <div class="grid grid-cols-4 gap-2">
        <button 
          v-if="showEmail"
          @click="selectChannel('email')"
          :class="chipClass('email')"
        >
          <i class="fa-solid fa-envelope text-xs"></i>
          <span>Email</span>
        </button>
        
        <button 
          v-if="showSMS"
          @click="selectChannel('sms')"
          :class="chipClass('sms')"
        >
          <i class="fa-solid fa-message text-xs"></i>
          <span>SMS</span>
        </button>
        
        <button 
          v-if="showWhatsApp"
          @click="selectChannel('whatsapp')"
          :class="chipClass('whatsapp')"
        >
          <i class="fa-brands fa-whatsapp text-xs"></i>
          <span>WhatsApp</span>
        </button>
        
        <button 
          v-if="showDontSend"
          @click="selectChannel('dont-send')"
          :class="chipClass('dont-send')"
        >
          <i class="fa-solid fa-xmark text-xs"></i>
          <span>Don't send</span>
        </button>
      </div>
    </div>
    
    <!-- Selected Channel Form (shows below chips) -->
    <div v-if="selectedChannel && selectedChannel !== 'dont-send'">
      <EmailForm
        v-if="selectedChannel === 'email'"
        :initial-template="initialTemplate"
        :initial-message="initialMessage"
        @send="handleSend"
        @cancel="handleCancel"
      />
      
      <SMSForm
        v-else-if="selectedChannel === 'sms'"
        :initial-template="initialTemplate"
        :initial-message="initialMessage"
        @send="handleSend"
        @cancel="handleCancel"
      />
      
      <WhatsAppForm
        v-else-if="selectedChannel === 'whatsapp'"
        :initial-template="initialTemplate"
        :initial-message="initialMessage"
        @send="handleSend"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import EmailForm from './EmailForm.vue'
import SMSForm from './SMSForm.vue'
import WhatsAppForm from './WhatsAppForm.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Send follow-up message'
  },
  showEmail: {
    type: Boolean,
    default: true
  },
  showSMS: {
    type: Boolean,
    default: true
  },
  showWhatsApp: {
    type: Boolean,
    default: true
  },
  showDontSend: {
    type: Boolean,
    default: false
  },
  initialTemplate: {
    type: String,
    default: ''
  },
  initialMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['send', 'cancel', 'dont-send'])

const selectedChannel = ref(null)

// Chip styling based on selected state
const chipClass = computed(() => (channel) => {
  const baseClasses = 'bg-surface border-2 rounded-lg h-10 flex items-center justify-center gap-2 text-fluid-xs font-medium transition-all'
  const selected = 'border-brand-dark bg-surfaceSecondary text-brand-dark'
  const unselected = 'border-E5E7EB text-body hover:border-brand-dark/30 hover:bg-surfaceSecondary/50'
  
  return `${baseClasses} ${selectedChannel.value === channel ? selected : unselected}`
})

const selectChannel = (channel) => {
  if (channel === 'dont-send') {
    selectedChannel.value = 'dont-send' // Set to 'dont-send' so button shows as selected
    emit('dont-send')
  } else {
    selectedChannel.value = channel
  }
}

const handleSend = (data) => {
  emit('send', data)
  selectedChannel.value = null
}

const handleCancel = () => {
  selectedChannel.value = null
  emit('cancel')
}
</script>
