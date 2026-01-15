<template>
  <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6 animate-fade-in relative">
    <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45"></div>
    <h5 class="heading-sub mb-3">{{ type === 'email' ? 'Send Email' : type === 'whatsapp' ? 'Send WhatsApp' : type === 'sms' ? 'Send SMS' : 'Send Message' }}</h5>
    
    <div class="mb-3">
      <label class="block text-xs font-medium text-gray-700 mb-1">Template</label>
      <select v-model="selectedTemplate" class="input">
        <option value="">Select a template...</option>
        <option>Follow-up</option>
        <option>Meeting Confirmation</option>
        <option>Quote Proposal</option>
        <option>Unable to Reach</option>
      </select>
    </div>

    <textarea 
      v-model="message"
      class="input mb-3" 
      rows="4" 
      placeholder="Type your message here..."
    ></textarea>
    
    <div class="flex justify-end gap-2">
      <Button
        variant="outline"
        size="small"
        @click="$emit('cancel')"
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        size="small"
        @click="handleSave"
      >
        Send
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Button } from '@motork/component-library'

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
  }
})

const emit = defineEmits(['save', 'cancel'])

const message = ref('')
const selectedTemplate = ref('')

const handleSave = () => {
  if (!message.value.trim() && !selectedTemplate.value) return
  
  emit('save', {
    type: 'communication',
    action: `sent via ${props.type}`,
    content: message.value || `Sent template: ${selectedTemplate.value}`,
    communicationType: props.type
  })
}
</script>

