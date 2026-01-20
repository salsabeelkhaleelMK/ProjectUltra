<template>
  <div class="space-y-3">
    <!-- Template Selection -->
    <div>
      <label class="block text-fluid-xs font-medium text-body mb-1">Template</label>
      <select 
        v-model="selectedTemplate" 
        @change="onTemplateChange"
        class="input"
      >
        <option value="">Select a template...</option>
        <option value="Follow-up">Follow-up</option>
        <option value="Meeting Confirmation">Meeting Confirmation</option>
        <option value="Quote Proposal">Quote Proposal</option>
        <option value="Unable to Reach">Unable to Reach</option>
      </select>
    </div>

    <!-- Message -->
    <div>
      <label class="block text-fluid-xs font-medium text-body mb-1">Message</label>
      <textarea 
        v-model="message"
        class="input" 
        rows="4" 
        placeholder="Type your WhatsApp message here..."
      ></textarea>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex justify-end gap-2">
      <Button
        label="Cancel"
        variant="outline"
        size="small"
        @click="$emit('cancel')"
      />
      <Button
        label="Send WhatsApp"
        variant="primary"
        size="small"
        @click="handleSend"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Button } from '@motork/component-library'

const props = defineProps({
  initialTemplate: {
    type: String,
    default: ''
  },
  initialMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['send', 'cancel'])

const selectedTemplate = ref(props.initialTemplate)
const message = ref(props.initialMessage)

// Template content mapping
const templateContent = {
  'Follow-up': 'Hi! I wanted to follow up on our previous conversation. Are you still interested in moving forward? Let me know if you have any questions.',
  'Meeting Confirmation': 'This is a confirmation for our meeting scheduled on [DATE] at [TIME]. Looking forward to speaking with you!',
  'Quote Proposal': 'Thank you for your interest! I\'ve prepared a quote based on your requirements. Please find the details attached. Let me know if you have any questions.',
  'Unable to Reach': 'I tried reaching you but wasn\'t able to connect. Please let me know a good time to call you back, or feel free to reach out at your convenience.'
}

// Populate message when template is selected
const onTemplateChange = () => {
  if (selectedTemplate.value && templateContent[selectedTemplate.value]) {
    message.value = templateContent[selectedTemplate.value]
  }
}

const handleSend = () => {
  if (!message.value.trim()) return
  
  emit('send', {
    type: 'whatsapp',
    template: selectedTemplate.value,
    message: message.value
  })
}
</script>
