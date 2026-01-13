<template>
  <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6 animate-fade-in relative">
    <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45"></div>
    <h5 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{{ type === 'email' ? 'Send Email' : type === 'whatsapp' ? 'Send WhatsApp' : type === 'sms' ? 'Send SMS' : 'Send Message' }}</h5>
    
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
      <button @click="$emit('cancel')" class="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
      <button @click="handleSave" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors shadow-sm shadow-blue-200">Send</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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

