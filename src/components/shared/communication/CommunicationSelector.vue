<template>
  <div class="space-y-3">
    <!-- Channel Selection Buttons -->
    <div v-if="!selectedChannel" class="space-y-2">
      <h5 class="font-semibold text-heading text-fluid-sm mb-2">{{ title }}</h5>
      <div class="grid grid-cols-4 gap-2">
        <button 
          v-if="showEmail"
          @click="selectChannel('email')"
          class="bg-surface border-2 rounded-lg h-10 flex items-center justify-center gap-2 text-fluid-xs font-medium transition-all border-E5E7EB text-body hover:border-blue-300 hover:bg-blue-50/50"
        >
          <i class="fa-solid fa-envelope text-xs"></i>
          <span>Email</span>
        </button>
        
        <button 
          v-if="showSMS"
          @click="selectChannel('sms')"
          class="bg-surface border-2 rounded-lg h-10 flex items-center justify-center gap-2 text-fluid-xs font-medium transition-all border-E5E7EB text-body hover:border-primary-300 hover:bg-primary-50/50"
        >
          <i class="fa-solid fa-message text-xs"></i>
          <span>SMS</span>
        </button>
        
        <button 
          v-if="showWhatsApp"
          @click="selectChannel('whatsapp')"
          class="bg-surface border-2 rounded-lg h-10 flex items-center justify-center gap-2 text-fluid-xs font-medium transition-all border-E5E7EB text-body hover:border-green-300 hover:bg-green-50/50"
        >
          <i class="fa-brands fa-whatsapp text-xs"></i>
          <span>WhatsApp</span>
        </button>
        
        <button 
          v-if="showDontSend"
          @click="selectChannel('dont-send')"
          class="bg-surface border-2 rounded-lg h-10 flex items-center justify-center gap-2 text-fluid-xs font-medium transition-all border-E5E7EB text-body hover:border-gray-300 hover:bg-gray-50/50"
        >
          <i class="fa-solid fa-xmark text-xs"></i>
          <span>Don't send</span>
        </button>
      </div>
    </div>
    
    <!-- Selected Channel Form -->
    <div v-else-if="selectedChannel !== 'dont-send'">
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
import { ref } from 'vue'
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

const selectChannel = (channel) => {
  if (channel === 'dont-send') {
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
