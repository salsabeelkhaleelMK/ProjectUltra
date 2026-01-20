<template>
  <div class="space-y-3">
    <!-- Call Options (moved to top) -->
    <div class="space-y-2">
      <label class="block text-fluid-xs font-medium text-body uppercase tracking-wider">Choose Call Method</label>
      
      <button
        @click="handleCallOption('outbound')"
        class="w-full px-4 py-3 text-left border border-black/5 rounded-lg hover:bg-surfaceSecondary transition-all flex items-center gap-3 group"
      >
        <div class="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center group-hover:bg-brand-blue/20 transition-colors">
          <i class="fa-solid fa-phone text-brand-blue"></i>
        </div>
        <div class="flex-1">
          <p class="font-bold text-fluid-sm text-heading uppercase tracking-tight">Call with Outbound</p>
          <p class="text-xs text-sub uppercase">Use external calling system</p>
        </div>
        <i class="fa-solid fa-chevron-right text-xs text-sub opacity-0 group-hover:opacity-100 transition-opacity"></i>
      </button>
      
      <button
        @click="handleCallOption('pbx')"
        class="w-full px-4 py-3 text-left border border-black/5 rounded-lg hover:bg-surfaceSecondary transition-all flex items-center gap-3 group"
      >
        <div class="w-10 h-10 rounded-lg bg-brand-slate/10 flex items-center justify-center group-hover:bg-brand-slate/20 transition-colors">
          <i class="fa-solid fa-phone-volume text-brand-slate"></i>
        </div>
        <div class="flex-1">
          <p class="font-bold text-fluid-sm text-heading uppercase tracking-tight">Call with PBX</p>
          <p class="text-xs text-sub uppercase">Use internal phone system</p>
        </div>
        <i class="fa-solid fa-chevron-right text-xs text-sub opacity-0 group-hover:opacity-100 transition-opacity"></i>
      </button>
      
      <button
        @click="handleCallOption('copy')"
        class="w-full px-4 py-3 text-left border border-black/5 rounded-lg hover:bg-surfaceSecondary transition-all flex items-center gap-3 group"
      >
        <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
          <i class="fa-solid fa-copy text-gray-600"></i>
        </div>
        <div class="flex-1">
          <p class="font-bold text-fluid-sm text-heading uppercase tracking-tight">Copy Number</p>
          <p class="text-xs text-sub uppercase">{{ phoneNumber }}</p>
        </div>
        <i class="fa-solid fa-chevron-right text-xs text-sub opacity-0 group-hover:opacity-100 transition-opacity"></i>
      </button>
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
    
    <!-- Action Buttons -->
    <div class="flex justify-end gap-2 pt-3 border-t border-E5E7EB">
      <Button
        label="Cancel"
        variant="outline"
        size="small"
        @click="$emit('cancel')"
      />
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

const handleCallOption = (option) => {
  // If copy option, copy to clipboard
  if (option === 'copy') {
    navigator.clipboard.writeText(props.phoneNumber)
    // TODO: Show toast notification
  }
  
  emit('call', {
    type: 'call',
    option: option, // 'outbound', 'pbx', or 'copy'
    phoneNumber: props.phoneNumber,
    notes: notes.value
  })
}
</script>
