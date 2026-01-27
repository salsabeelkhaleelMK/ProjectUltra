<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-md max-h-[calc(100vh-4rem)] flex flex-col">
        <DialogHeader class="flex-shrink-0">
          <DialogTitle>Extend Expected Close Date</DialogTitle>
        </DialogHeader>

        <div class="flex-1 overflow-y-auto px-6 py-4 w-full space-y-4">
          <div>
            <Label class="block text-sm font-medium text-foreground mb-2">Current Expected Close Date</Label>
            <Input
              type="text"
              :value="currentDateDisplay"
              disabled
              class="w-full"
            />
          </div>

          <div>
            <Label class="block text-sm font-medium text-foreground mb-2">New Expected Close Date <span class="text-red-600">*</span></Label>
            <Input
              type="date"
              v-model="newDate"
              :min="minDate"
              class="w-full"
            />
          </div>

          <div>
            <Label class="block text-sm font-medium text-foreground mb-2">Reason (Optional)</Label>
            <Textarea
              v-model="reason"
              rows="3"
              placeholder="Why are you extending the expected close date?"
              class="w-full"
            />
          </div>
        </div>

        <DialogFooter class="flex-shrink-0 flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
          <Button
            variant="outline"
            size="small"
            class="rounded-sm w-full sm:w-auto"
            @click="handleCancel"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            size="small"
            class="rounded-sm w-full sm:w-auto"
            :disabled="!canSubmit"
            @click="handleConfirm"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Button, Input, Label, Textarea } from '@motork/component-library/future/primitives'
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
    default: false
  },
  opportunity: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'confirm'])

const newDate = ref('')
const reason = ref('')

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const currentDateDisplay = computed(() => {
  if (!props.opportunity.expectedCloseDate) return 'Not set'
  return new Date(props.opportunity.expectedCloseDate).toLocaleDateString()
})

const canSubmit = computed(() => {
  return !!newDate.value
})

watch(() => props.show, (isOpen) => {
  if (isOpen) {
    // Initialize with current date or tomorrow
    const currentDate = props.opportunity.expectedCloseDate
      ? new Date(props.opportunity.expectedCloseDate)
      : new Date()
    // If current date is in the past, use tomorrow
    if (currentDate < new Date()) {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      newDate.value = tomorrow.toISOString().split('T')[0]
    } else {
      newDate.value = currentDate.toISOString().split('T')[0]
    }
    reason.value = ''
  }
})

const handleOpenChange = (isOpen) => {
  if (!isOpen) {
    emit('close')
  }
}

const handleCancel = () => {
  emit('close')
}

const handleConfirm = () => {
  if (!canSubmit.value) return
  
  emit('confirm', {
    expectedCloseDate: newDate.value,
    reason: reason.value
  })
  
  emit('close')
}
</script>
