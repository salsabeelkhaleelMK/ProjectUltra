<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-lg max-h-[calc(100vh-4rem)] flex flex-col">
        <DialogHeader class="flex-shrink-0">
          <DialogTitle>Disqualify Lead</DialogTitle>
        </DialogHeader>

        <div class="flex-1 overflow-y-auto px-6 py-4 w-full space-y-6">
      <!-- Category Radio Buttons -->
      <div class="space-y-2">
        <Label class="block text-sm font-semibold text-foreground">Category</Label>
        <div class="flex gap-6">
          <Label class="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              v-model="category"
              value="Not Valid"
              class="w-4 h-4 text-brand-primary focus:ring-brand-primary border-gray-300"
            >
            <span class="text-sm text-muted-foreground">Not Valid</span>
          </Label>
          <Label class="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              v-model="category"
              value="Not Interested"
              class="w-4 h-4 text-brand-primary focus:ring-brand-primary border-gray-300"
            >
            <span class="text-sm text-muted-foreground">Not Interested</span>
          </Label>
        </div>
      </div>
      
      <!-- Failure Reason Dropdown -->
      <div class="space-y-2">
        <Label class="block text-sm font-semibold text-foreground">Failure Reason</Label>
        <Select v-model="failureReason">
          <SelectTrigger class="w-full h-10">
            <SelectValue placeholder="Select a reason..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Data cleanup">Data cleanup</SelectItem>
            <SelectItem value="Unreachable">Unreachable</SelectItem>
            <SelectItem value="Purchase postponed">Purchase postponed</SelectItem>
            <SelectItem value="Vehicle sold">Vehicle sold</SelectItem>
            <SelectItem value="Out of budget">Out of budget</SelectItem>
            <SelectItem value="Financing rejected">Financing rejected</SelectItem>
            <SelectItem value="Duplicate">Duplicate</SelectItem>
            <SelectItem value="Bought elsewhere">Bought elsewhere</SelectItem>
          </SelectContent>
        </Select>
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
            label="Confirm Disqualification"
            variant="primary"
            size="small"
            class="rounded-sm w-full sm:w-auto !bg-red-600 !hover:bg-red-700 !border-red-600"
            :disabled="!category || !failureReason"
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
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const category = ref('Not Interested')
const failureReason = ref('')

// Reset form when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    category.value = 'Not Interested'
    failureReason.value = ''
  }
})

const handleConfirm = () => {
  emit('confirm', {
    category: category.value,
    reason: failureReason.value
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
