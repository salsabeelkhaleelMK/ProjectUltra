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
        placeholder="Type your SMS message here..."
        maxlength="160"
      ></textarea>
      <p class="text-fluid-xs text-sub mt-1">{{ message.length }}/160 characters</p>
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
        label="Send SMS"
        variant="primary"
        size="small"
        @click="handleSend"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Button } from '@motork/component-library/future/primitives'

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

// Template content mapping (shorter for SMS)
const templateContent = {
  'Follow-up': 'Hi! Following up on our conversation. Still interested? Let me know if you have questions.',
  'Meeting Confirmation': 'Confirming our meeting on [DATE] at [TIME]. Looking forward to it!',
  'Quote Proposal': 'Your quote is ready! I\'ll send you the details. Questions? Just ask.',
  'Unable to Reach': 'Tried to reach you. When\'s a good time to call back?'
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
    type: 'sms',
    template: selectedTemplate.value,
    message: message.value
  })
}
</script>
