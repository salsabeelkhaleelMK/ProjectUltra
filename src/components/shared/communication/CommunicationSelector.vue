<template>
  <div class="space-y-3">
    <!-- Channel Selection Buttons (Always Visible) -->
    <div class="space-y-2">
      <h5 v-if="title" class="font-semibold text-heading text-fluid-sm mb-2">{{ title }}</h5>
      <div class="grid grid-cols-4 gap-2">
        <button
          v-if="showEmail"
          @click="selectChannel('email')"
          class="flex items-center justify-center gap-2 px-3 py-1.5 text-fluid-xs font-medium rounded-lg border transition-all"
          :class="selectedChannel === 'email' ? 'border-green-600 bg-surfaceSecondary text-heading' : 'border-D1D5DB bg-white text-body hover:border-brand-dark/30'"
        >
          <i class="fa-solid fa-envelope text-xs"></i>
          <span>Email</span>
        </button>
        
        <button
          v-if="showSMS"
          @click="selectChannel('sms')"
          class="flex items-center justify-center gap-2 px-3 py-1.5 text-fluid-xs font-medium rounded-lg border transition-all"
          :class="selectedChannel === 'sms' ? 'border-green-600 bg-surfaceSecondary text-heading' : 'border-D1D5DB bg-white text-body hover:border-brand-dark/30'"
        >
          <i class="fa-solid fa-message text-xs"></i>
          <span>SMS</span>
        </button>
        
        <button
          v-if="showWhatsApp"
          @click="selectChannel('whatsapp')"
          class="flex items-center justify-center gap-2 px-3 py-1.5 text-fluid-xs font-medium rounded-lg border transition-all"
          :class="selectedChannel === 'whatsapp' ? 'border-green-600 bg-surfaceSecondary text-heading' : 'border-D1D5DB bg-white text-body hover:border-brand-dark/30'"
        >
          <i class="fa-brands fa-whatsapp text-xs"></i>
          <span>WhatsApp</span>
        </button>
        
        <button
          v-if="showDontSend"
          @click="selectChannel('dont-send')"
          class="flex items-center justify-center gap-2 px-3 py-1.5 text-fluid-xs font-medium rounded-lg border transition-all"
          :class="selectedChannel === 'dont-send' ? 'border-green-600 bg-surfaceSecondary text-heading' : 'border-D1D5DB bg-white text-body hover:border-brand-dark/30'"
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
  },
  defaultChannel: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['send', 'cancel', 'dont-send'])

const selectedChannel = ref(props.defaultChannel || null)

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
