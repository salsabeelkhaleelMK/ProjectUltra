<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Close as Lost</DialogTitle>
          <DialogDescription>Document why this opportunity didn't close</DialogDescription>
        </DialogHeader>

        <div class="space-y-4">
      <!-- Reason Dropdown -->
      <div>
        <label class="block label-upper mb-2">Reason</label>
        <select 
          v-model="selectedReason"
          class="input"
        >
          <option value="">Select a reason...</option>
          <option value="Not interested">Not interested</option>
          <option value="Budget constraints">Budget constraints</option>
          <option value="Found better price">Found better price at competitor</option>
          <option value="No response">Customer not responding</option>
          <option value="Wrong timing">Timing not right</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <!-- Notes -->
      <div>
        <label class="block label-upper mb-2">Additional Notes</label>
        <textarea 
          v-model="notes"
          rows="4"
          placeholder="Add any relevant details about why this opportunity was lost..."
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
            label="Close as Lost"
            variant="primary"
            size="small"
            class="rounded-sm w-full sm:w-auto !bg-red-600 !hover:bg-red-700 !border-red-600"
            :disabled="!selectedReason"
            @click="handleConfirm"
          />
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
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

const selectedReason = ref('')
const notes = ref('')

// Reset form when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    selectedReason.value = ''
    notes.value = ''
  }
})

const handleConfirm = () => {
  if (!selectedReason.value) return
  emit('confirm', {
    reason: selectedReason.value,
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
