<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-lg max-h-[calc(100vh-4rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send SMS</DialogTitle>
        </DialogHeader>

        <SMSForm 
          @send="handleSend" 
          @cancel="$emit('close')"
        />
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup>
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle
} from '@motork/component-library/future/primitives'
import SMSForm from '@/components/shared/communication/SMSForm.vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const handleSend = (data) => {
  emit('save', data)
  emit('close')
}

const handleOpenChange = (isOpen) => {
  if (!isOpen) {
    emit('close')
  }
}
</script>
