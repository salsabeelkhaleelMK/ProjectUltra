<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-lg max-h-[calc(100vh-4rem)] flex flex-col">
        <DialogHeader class="flex-shrink-0">
          <DialogTitle>Close as Lost</DialogTitle>
        </DialogHeader>

        <div class="flex-1 overflow-y-auto px-6 py-4 w-full space-y-6">
      <!-- Reason Dropdown -->
      <div class="space-y-2">
        <Label class="block text-sm font-semibold text-heading">Reason</Label>
        <Select v-model="selectedReason">
          <SelectTrigger class="w-full h-10">
            <SelectValue placeholder="Select a reason..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Multiple no shows">Multiple no shows</SelectItem>
            <SelectItem value="Not interested">Not interested</SelectItem>
            <SelectItem value="Budget constraints">Budget constraints</SelectItem>
            <SelectItem value="Found better price">Found better price at competitor</SelectItem>
            <SelectItem value="No response">Customer not responding</SelectItem>
            <SelectItem value="Wrong timing">Timing not right</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <!-- Notes -->
      <div class="space-y-2">
        <Label class="block text-sm font-semibold text-heading">Additional Notes</Label>
        <Textarea 
          v-model="notes"
          rows="5"
          placeholder="Add any relevant details about why this opportunity was lost..."
          class="w-full min-h-[120px] resize-none"
        />
      </div>
        </div>

        <DialogFooter class="flex-shrink-0 flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
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
import { 
  Button,
  Label,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@motork/component-library/future/primitives'
import {
  Dialog,
  DialogContent,
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
  },
  preselectedReason: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const selectedReason = ref('')
const notes = ref('')

// Reset form when modal opens, or set preselected reason
watch(() => props.show, (newVal) => {
  if (newVal) {
    if (props.preselectedReason) {
      selectedReason.value = props.preselectedReason
    } else {
      selectedReason.value = ''
    }
    notes.value = ''
  }
})

// Watch for preselectedReason changes
watch(() => props.preselectedReason, (newReason) => {
  if (newReason && props.show) {
    selectedReason.value = newReason
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
