<template>
  <div class="bg-surface border border-E5E7EB rounded-xl p-4 shadow-sm mb-6 animate-fade-in relative">
    <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-surface border-t border-l border-E5E7EB rotate-45"></div>
    
    <!-- Email Form -->
    <EmailForm
      v-if="type === 'email'"
      @send="handleSend"
      @cancel="$emit('cancel')"
    />
    
    <!-- SMS Form -->
    <SMSForm
      v-else-if="type === 'sms'"
      @send="handleSend"
      @cancel="$emit('cancel')"
    />
    
    <!-- WhatsApp Form -->
    <WhatsAppForm
      v-else-if="type === 'whatsapp'"
      @send="handleSend"
      @cancel="$emit('cancel')"
    />
    
    <!-- Call Form -->
    <CallForm
      v-else-if="type === 'call'"
      :phone-number="phoneNumber"
      @call="handleCall"
      @cancel="$emit('cancel')"
    />
  </div>
</template>

<script setup>
import EmailForm from '@/components/shared/communication/EmailForm.vue'
import SMSForm from '@/components/shared/communication/SMSForm.vue'
import WhatsAppForm from '@/components/shared/communication/WhatsAppForm.vue'
import CallForm from '@/components/shared/communication/CallForm.vue'

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  taskType: {
    type: String,
    default: 'lead'
  },
  taskId: {
    type: Number,
    required: true
  },
  phoneNumber: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['save', 'cancel'])

const handleSend = (data) => {
  emit('save', {
    type: 'communication',
    action: `sent via ${data.type}`,
    content: data.message,
    communicationType: data.type,
    template: data.template,
    subject: data.subject // For emails
  })
}

const handleCall = (data) => {
  // Handle different call options
  switch(data.option) {
    case 'outbound':
      console.log('Initiating outbound call...')
      // TODO: Implement outbound call logic
      break
    case 'pbx':
      console.log('Initiating PBX call...')
      // TODO: Implement PBX call logic
      break
    case 'copy':
      navigator.clipboard.writeText(data.phoneNumber)
      console.log('Number copied to clipboard')
      break
  }
  
  emit('save', {
    type: 'communication',
    action: `called via ${data.option}`,
    content: data.notes || 'Call attempt logged',
    communicationType: 'call',
    callOption: data.option
  })
}
</script>

