<template>
  <div class="space-y-6">
    <!-- Template Selection -->
    <div class="space-y-2">
      <Label class="block text-sm font-semibold text-foreground">Template</Label>
      <Select v-model="selectedTemplate" @update:model-value="onTemplateChange">
        <SelectTrigger class="w-full h-10">
          <SelectValue placeholder="Select a template..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Follow-up">Follow-up</SelectItem>
          <SelectItem value="Meeting Confirmation">Meeting Confirmation</SelectItem>
          <SelectItem value="Quote Proposal">Quote Proposal</SelectItem>
          <SelectItem value="Unable to Reach">Unable to Reach</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <!-- Message -->
    <div class="space-y-2">
      <Label class="block text-sm font-semibold text-foreground">Message</Label>
      <Textarea 
        v-model="message"
        rows="5"
        placeholder="Type your SMS message here..."
        maxlength="160"
        class="w-full min-h-[120px] resize-none"
      />
      <p class="text-xs text-muted-foreground mt-1">{{ message.length }}/160 characters</p>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex justify-end gap-3">
      <Button
        label="Cancel"
        variant="outline"
        size="small"
        class="rounded-sm"
        @click="$emit('cancel')"
      />
      <Button
        label="Send SMS"
        variant="primary"
        size="small"
        class="rounded-sm !bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
        @click="handleSend"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  Button, 
  Textarea,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@motork/component-library/future/primitives'

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
