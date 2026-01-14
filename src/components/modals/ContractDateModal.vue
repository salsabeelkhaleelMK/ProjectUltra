<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Set Contract Signing Date</DialogTitle>
          <DialogDescription>Record when the contract was signed to track delivery timeline</DialogDescription>
        </DialogHeader>

        <div class="space-y-4">
      <!-- Contract Date -->
      <div>
        <label class="block label-upper mb-2">Contract Date</label>
        <input 
          type="date"
          v-model="contractDate"
          :max="maxDate"
          class="input"
        />
      </div>
      
      <!-- Contract Time -->
      <div>
        <label class="block label-upper mb-2">Time (Optional)</label>
        <input 
          type="time"
          v-model="contractTime"
          class="input"
        />
      </div>
      
      <!-- Notes -->
      <div>
        <label class="block label-upper mb-2">Notes (Optional)</label>
        <textarea 
          v-model="notes"
          rows="3"
          placeholder="Add any relevant notes about the contract signing..."
          class="input resize-none"
        ></textarea>
      </div>
    </div>

        <DialogFooter class="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
          <Button
            label="Cancel"
            variant="outline"
            size="small"
            class="rounded-sm w-full sm:w-auto"
            @click="handleCancel"
          />
          <Button 
            label="Set Contract Date"
            variant="primary"
            size="small"
            class="rounded-sm w-full sm:w-auto !bg-green-600 !hover:bg-green-700 !border-green-600"
            :disabled="!contractDate"
            @click="handleConfirm"
          />
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { Button } from '@motork/component-library'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle
} from '@motork/component-library/future/primitives'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const contractDate = ref('')
const contractTime = ref('')
const notes = ref('')

// Max date is today
const maxDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Reset form when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    // Default to today
    const today = new Date()
    contractDate.value = today.toISOString().split('T')[0]
    contractTime.value = today.toTimeString().slice(0, 5)
    notes.value = ''
  }
})

const handleConfirm = () => {
  if (!contractDate.value) return
  
  // Combine date and time
  const datetime = contractTime.value 
    ? `${contractDate.value}T${contractTime.value}:00`
    : `${contractDate.value}T12:00:00`
  
  emit('confirm', {
    contractDate: datetime,
    notes: notes.value
  })
}

const handleCancel = () => {
  emit('cancel')
}

const handleOpenChange = (isOpen) => {
  if (!isOpen) {
    handleCancel()
  }
}
</script>
