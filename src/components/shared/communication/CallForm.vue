<template>
  <div class="space-y-3">
    <!-- Call Options (moved to top) -->
    <div class="space-y-2">
      <label class="block text-xs font-medium text-muted-foreground uppercase tracking-wider">Choose Call Method</label>
      
      <button
        @click="handleCallOption('outbound')"
        class="w-full px-4 py-3 text-left border border-border rounded-lg hover:bg-muted transition-all flex items-center gap-3 group"
      >
        <div class="w-10 h-10 rounded-lg bg-brand-blue/10 flex items-center justify-center group-hover:bg-brand-blue/20 transition-colors">
          <Phone class="w-4 h-4 shrink-0 text-brand-blue" />
        </div>
        <div class="flex-1">
          <p class="font-bold text-sm text-foreground uppercase tracking-tight">Call with Outbound</p>
          <p class="text-xs text-muted-foreground uppercase">Use external calling system</p>
        </div>
        <ChevronRight class="w-3 h-3 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
      
      <button
        @click="handleCallOption('pbx')"
        class="w-full px-4 py-3 text-left border border-border rounded-lg hover:bg-muted transition-all flex items-center gap-3 group"
      >
        <div class="w-10 h-10 rounded-lg bg-brand-slate/10 flex items-center justify-center group-hover:bg-brand-slate/20 transition-colors">
          <Phone class="w-4 h-4 shrink-0 text-brand-slate" />
        </div>
        <div class="flex-1">
          <p class="font-bold text-sm text-foreground uppercase tracking-tight">Call with PBX</p>
          <p class="text-xs text-muted-foreground uppercase">Use internal phone system</p>
        </div>
        <ChevronRight class="w-3 h-3 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
      
      <button
        @click="handleCallOption('copy')"
        class="w-full px-4 py-3 text-left border border-border rounded-lg hover:bg-muted transition-all flex items-center gap-3 group"
      >
        <div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
          <Copy class="w-4 h-4 shrink-0 text-muted-foreground" />
        </div>
        <div class="flex-1">
          <p class="font-bold text-sm text-foreground uppercase tracking-tight">Copy Number</p>
          <p class="text-xs text-muted-foreground uppercase">{{ phoneNumber }}</p>
        </div>
        <ChevronRight class="w-3 h-3 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>

    <!-- Call Notes -->
    <div>
      <label class="block text-xs font-medium text-muted-foreground mb-1">Call Notes</label>
      <textarea 
        v-model="notes"
        class="input" 
        rows="4" 
        placeholder="Add notes about the call..."
      ></textarea>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex justify-end gap-2 pt-3 border-t border-border">
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
import { Phone, ChevronRight, Copy } from 'lucide-vue-next'
import { ref } from 'vue'
import { Button } from '@motork/component-library/future/primitives'

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
