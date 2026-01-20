<template>
  <div class="bg-surface border border-E5E7EB rounded-lg p-4">
    <h5 class="text-fluid-sm font-semibold text-heading mb-3">Call Customer</h5>
    
    <div class="space-y-3">
      <!-- Phone Number Display -->
      <div>
        <label class="block text-fluid-xs font-medium text-body mb-1">Phone Number</label>
        <div class="flex items-center gap-2">
          <input 
            :value="phoneNumber"
            type="text"
            class="input flex-1"
            readonly
          />
          <button
            @click="copyNumber"
            class="flex items-center justify-center rounded hover:bg-surfaceSecondary text-sub hover:text-body transition-colors w-10 h-10 border border-E5E7EB"
            title="Copy phone number"
          >
            <i class="fa-regular fa-copy text-sm"></i>
          </button>
        </div>
      </div>

      <!-- Call Notes -->
      <div>
        <label class="block text-fluid-xs font-medium text-body mb-1">Call Notes</label>
        <textarea 
          v-model="notes"
          class="input" 
          rows="4" 
          placeholder="Add notes about the call..."
        ></textarea>
      </div>
      
      <!-- Call Options -->
      <div class="space-y-2">
        <label class="block text-fluid-xs font-medium text-body">How would you like to call?</label>
        
        <button
          @click="handleCallOption('outbound')"
          class="w-full px-4 py-3 text-left border border-E5E7EB rounded-lg hover:bg-surfaceSecondary transition-colors flex items-center gap-3"
        >
          <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <i class="fa-solid fa-phone text-blue-600"></i>
          </div>
          <div class="flex-1">
            <p class="font-medium text-fluid-sm text-heading">Call with Outbound</p>
            <p class="text-fluid-xs text-sub">Use external calling system</p>
          </div>
        </button>
        
        <button
          @click="handleCallOption('pbx')"
          class="w-full px-4 py-3 text-left border border-E5E7EB rounded-lg hover:bg-surfaceSecondary transition-colors flex items-center gap-3"
        >
          <div class="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
            <i class="fa-solid fa-phone-volume text-purple-600"></i>
          </div>
          <div class="flex-1">
            <p class="font-medium text-fluid-sm text-heading">Call with PBX</p>
            <p class="text-fluid-xs text-sub">Use internal phone system</p>
          </div>
        </button>
        
        <button
          @click="handleCallOption('copy')"
          class="w-full px-4 py-3 text-left border border-E5E7EB rounded-lg hover:bg-surfaceSecondary transition-colors flex items-center gap-3"
        >
          <div class="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
            <i class="fa-solid fa-copy text-gray-600"></i>
          </div>
          <div class="flex-1">
            <p class="font-medium text-fluid-sm text-heading">Copy Number</p>
            <p class="text-fluid-xs text-sub">Copy to dial manually</p>
          </div>
        </button>
      </div>
      
      <!-- Action Buttons -->
      <div class="flex justify-end gap-2 pt-3 border-t border-E5E7EB">
        <Button
          variant="outline"
          size="small"
          @click="$emit('cancel')"
        >
          Cancel
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Button } from '@motork/component-library'

const props = defineProps({
  phoneNumber: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['call', 'cancel'])

const notes = ref('')

const copyNumber = () => {
  navigator.clipboard.writeText(props.phoneNumber)
  // TODO: Show toast notification
}

const handleCallOption = (option) => {
  emit('call', {
    type: 'call',
    option: option, // 'outbound', 'pbx', or 'copy'
    phoneNumber: props.phoneNumber,
    notes: notes.value
  })
}
</script>
