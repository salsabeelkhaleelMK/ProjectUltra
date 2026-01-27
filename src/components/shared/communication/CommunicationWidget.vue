<template>
  <div v-if="!inline" class="space-y-4">
    <!-- Channel Selector Chips -->
    <div class="grid grid-cols-4 gap-2">
      <button 
        v-for="channel in channels"
        :key="channel.id"
        @click="selectedChannel = channel.id" 
        :class="chipClass(channel.id)"
      >
        <i :class="[channel.icon, 'text-sm']"></i>
        <span class="text-xs font-bold uppercase tracking-wider">{{ channel.label }}</span>
      </button>
    </div>
    
    <!-- Selected Form Container -->
    <div>
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
      
      <CallForm
        v-else-if="selectedChannel === 'call'"
        :phone-number="phoneNumber"
        @call="handleCall"
        @cancel="handleCancel"
      />
    </div>
  </div>

  <!-- Inline version without container -->
  <div v-else class="space-y-4">
    <!-- Channel Selector Chips -->
    <div class="grid grid-cols-4 gap-2">
      <button 
        v-for="channel in channels"
        :key="channel.id"
        @click="selectedChannel = channel.id" 
        :class="chipClass(channel.id)"
      >
        <i :class="[channel.icon, 'text-sm']"></i>
        <span class="text-xs font-bold uppercase tracking-wider">{{ channel.label }}</span>
      </button>
    </div>
    
    <!-- Selected Form Container -->
    <div v-if="selectedChannel">
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
      
      <CallForm
        v-else-if="selectedChannel === 'call'"
        :phone-number="phoneNumber"
        @call="handleCall"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import EmailForm from '@/components/shared/communication/EmailForm.vue'
import SMSForm from '@/components/shared/communication/SMSForm.vue'
import WhatsAppForm from '@/components/shared/communication/WhatsAppForm.vue'
import CallForm from '@/components/shared/communication/CallForm.vue'

const props = defineProps({
  type: {
    type: String,
    default: null
  },
  taskType: {
    type: String,
    default: 'lead'
  },
  taskId: {
    type: [Number, String],
    default: null
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  showArrow: {
    type: Boolean,
    default: true
  },
  inline: {
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

const emit = defineEmits(['save', 'cancel', 'send'])

const channels = [
  { id: 'call', label: 'Call', icon: 'fa-solid fa-phone' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'fa-brands fa-whatsapp' },
  { id: 'email', label: 'Email', icon: 'fa-solid fa-envelope' },
  { id: 'sms', label: 'SMS', icon: 'fa-solid fa-message' }
]

// Initialize selected channel from prop, null if not specified
const selectedChannel = ref(props.type)

// Watch for prop changes to update selected channel
watch(() => props.type, (newType) => {
  if (newType) {
    selectedChannel.value = newType
  } else {
    selectedChannel.value = null
  }
})

// Reset selection when task changes
watch(() => props.taskId, () => {
  selectedChannel.value = null
})

// Chip styling based on selected state
const chipClass = computed(() => (channel) => {
  const baseClasses = 'bg-surface border-2 rounded-lg h-12 flex flex-col items-center justify-center gap-1 transition-all'
  const selected = 'border-brand-dark bg-muted text-brand-dark shadow-nsc-card'
  const unselected = 'border-border text-muted-foreground hover:border-brand-dark/30 hover:bg-muted/30 hover:text-muted-foreground'
  
  return `${baseClasses} ${selectedChannel.value === channel ? selected : unselected}`
})

const handleSend = (data) => {
  // Emit both 'save' (for customer profile) and 'send' (for compatibility)
  emit('save', {
    type: 'communication',
    action: `sent via ${data.type}`,
    content: data.message,
    communicationType: data.type,
    template: data.template,
    subject: data.subject // For emails
  })
  
  // Also emit 'send' for compatibility with CommunicationSelector usage
  emit('send', data)
}

const handleCall = (data) => {
  emit('save', {
    type: 'communication',
    action: `called via ${data.option}`,
    content: data.notes || 'Call attempt logged',
    communicationType: 'call',
    callOption: data.option
  })
  
  // Also emit 'send' for compatibility
  emit('send', {
    type: 'call',
    option: data.option,
    phoneNumber: data.phoneNumber,
    notes: data.notes
  })
}

const handleCancel = () => {
  selectedChannel.value = null
  emit('cancel')
}
</script>
