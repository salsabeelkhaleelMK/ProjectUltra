<template>
  <div class="space-y-6">
    <!-- Send follow-up message -->
    <div>
      <h3 class="font-semibold text-slate-800 mb-3">Send follow-up message</h3>
      <div class="grid grid-cols-4 gap-3">
        <button 
          v-for="channel in followupChannels"
          :key="channel.value"
          @click="followupChannel = channel.value"
          class="px-4 py-2.5 rounded-lg text-sm font-medium transition-all border-2"
          :class="followupChannel === channel.value
            ? 'bg-blue-50 border-blue-500 text-blue-700'
            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'"
        >
          {{ channel.label }}
        </button>
      </div>
    </div>
    
    <!-- Template selection (if channel selected) -->
    <div v-if="followupChannel && followupChannel !== 'dont-send'">
      <h4 class="font-semibold text-slate-800 mb-2">Template</h4>
      <select 
        v-model="selectedTemplate" 
        class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
      >
        <option value="followup-1">Follow-up 1</option>
        <option value="followup-2">Follow-up 2</option>
        <option value="custom">Custom message</option>
      </select>
      
      <div class="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h5 class="text-xs font-semibold text-gray-600 mb-2 uppercase">Message preview</h5>
        <p class="text-sm text-slate-700">{{ messagePreview }}</p>
      </div>
    </div>
    
    <!-- Next call attempt -->
    <div>
      <h3 class="font-semibold text-slate-800 mb-3">Next call attempt</h3>
      <div class="grid grid-cols-3 gap-3">
        <button 
          @click="rescheduleTime = 'tomorrow-9am'"
          class="px-4 py-2.5 rounded-lg text-sm font-medium transition-all border-2"
          :class="rescheduleTime === 'tomorrow-9am'
            ? 'bg-blue-50 border-blue-500 text-blue-700'
            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'"
        >
          Tomorrow 9:00 AM
        </button>
        <button 
          @click="rescheduleTime = 'monday'"
          class="px-4 py-2.5 rounded-lg text-sm font-medium transition-all border-2"
          :class="rescheduleTime === 'monday'
            ? 'bg-blue-50 border-blue-500 text-blue-700'
            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'"
        >
          Monday
        </button>
        <button 
          @click="rescheduleTime = 'custom'"
          class="px-4 py-2.5 rounded-lg text-sm font-medium transition-all border-2"
          :class="rescheduleTime === 'custom'
            ? 'bg-blue-50 border-blue-500 text-blue-700'
            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'"
        >
          Select time
        </button>
      </div>
      
      <!-- Custom time picker -->
      <div v-if="rescheduleTime === 'custom'" class="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1.5">Date</label>
          <input 
            type="date" 
            v-model="customDate"
            class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
          >
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1.5">Time</label>
          <input 
            type="time" 
            v-model="customTime"
            class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
          >
        </div>
      </div>
    </div>
    
    <!-- Actions -->
    <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
      <button 
        @click="$emit('cancel')"
        class="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors"
      >
        Cancel
      </button>
      <button 
        @click="handleSendAndReschedule"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm"
      >
        Send and reschedule <i class="fa-solid fa-check"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  lead: {
    type: Object,
    required: true
  },
  callNotes: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const followupChannels = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'sms', label: 'SMS' },
  { value: 'email', label: 'Email' },
  { value: 'dont-send', label: "Don't send" }
]

const followupChannel = ref('whatsapp')
const selectedTemplate = ref('followup-1')
const rescheduleTime = ref('custom')
const customDate = ref('')
const customTime = ref('09:00')

const messageTemplates = {
  'followup-1': `Hi ${props.lead.customer.name.split(' ')[0]}! I tried calling you earlier but couldn't reach you. When would be a good time to discuss the ${props.lead.requestedCar.brand} ${props.lead.requestedCar.model}?`,
  'followup-2': `Hello ${props.lead.customer.name.split(' ')[0]}, this is regarding your inquiry about the ${props.lead.requestedCar.brand} ${props.lead.requestedCar.model}. Please let me know when you're available for a call.`,
  'custom': ''
}

const messagePreview = computed(() => {
  if (selectedTemplate.value === 'custom') {
    return 'Type your custom message...'
  }
  return messageTemplates[selectedTemplate.value]
})

const calculateNextCallDate = () => {
  if (rescheduleTime.value === 'tomorrow-9am') {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 0, 0, 0)
    return tomorrow.toISOString()
  } else if (rescheduleTime.value === 'monday') {
    const monday = new Date()
    const daysUntilMonday = (8 - monday.getDay()) % 7 || 7
    monday.setDate(monday.getDate() + daysUntilMonday)
    monday.setHours(9, 0, 0, 0)
    return monday.toISOString()
  } else if (rescheduleTime.value === 'custom' && customDate.value && customTime.value) {
    const dateTime = new Date(`${customDate.value}T${customTime.value}:00`)
    return dateTime.toISOString()
  }
  // Default: tomorrow 9am
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(9, 0, 0, 0)
  return tomorrow.toISOString()
}

const handleSendAndReschedule = () => {
  emit('confirm', {
    followupChannel: followupChannel.value,
    message: selectedTemplate.value === 'custom' ? messagePreview.value : messageTemplates[selectedTemplate.value],
    nextCallDate: calculateNextCallDate(),
    rescheduleType: rescheduleTime.value
  })
}
</script>
