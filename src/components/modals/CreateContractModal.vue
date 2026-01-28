<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-lg max-h-[calc(100vh-4rem)] flex flex-col">
        <DialogHeader class="flex-shrink-0">
          <DialogTitle>Create contract</DialogTitle>
          <p class="text-sm text-muted-foreground mt-1">
            Create a new contract to track versions. Set the contract date and optional notes.
          </p>
        </DialogHeader>

        <div class="flex-1 overflow-y-auto px-6 py-4 w-full space-y-6">
          <div class="space-y-4">
            <div>
              <Label class="block text-sm font-medium text-muted-foreground mb-2">Contract Date <span class="text-red-600">*</span></Label>
              <Input
                v-model="contractDate"
                type="date"
                :max="maxContractDateComputed"
                class="w-full"
              />
            </div>
            <div>
              <Label class="block text-sm font-medium text-muted-foreground mb-2">Time (Optional)</Label>
              <Input
                v-model="contractTime"
                type="time"
                class="w-full"
              />
            </div>
            <div>
              <Label class="block text-sm font-medium text-muted-foreground mb-2">Notes (Optional)</Label>
              <Textarea
                v-model="notes"
                rows="4"
                placeholder="Add any relevant notes about the contract..."
                class="w-full"
              />
            </div>
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
            label="Create contract"
            variant="primary"
            size="small"
            class="rounded-sm w-full sm:w-auto"
            :disabled="!canSubmit"
            @click="handleConfirm"
          />
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import {
  Button,
  Input,
  Label,
  Textarea
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
  maxContractDate: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const contractDate = ref('')
const contractTime = ref('')
const notes = ref('')

const maxContractDateComputed = computed(() => {
  if (props.maxContractDate) return props.maxContractDate
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const canSubmit = computed(() => !!contractDate.value)

watch(() => props.show, (isOpen) => {
  if (isOpen) {
    const today = new Date()
    contractDate.value = today.toISOString().split('T')[0]
    contractTime.value = today.toTimeString().slice(0, 5)
    notes.value = ''
  }
})

function handleConfirm() {
  if (!canSubmit.value) return
  emit('confirm', {
    contractDate: contractDate.value,
    contractTime: contractTime.value,
    notes: notes.value
  })
}

function handleCancel() {
  emit('cancel')
}

function handleOpenChange(isOpen) {
  if (!isOpen) handleCancel()
}
</script>
