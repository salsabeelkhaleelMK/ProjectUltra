<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Trade-In</DialogTitle>
          <DialogDescription>
            Add trade-in vehicle information
          </DialogDescription>
        </DialogHeader>

        <TradeInWidget 
          hide-header
          @save="handleSave" 
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
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle
} from '@motork/component-library/future/primitives'
import TradeInWidget from '@/components/customer/activities/TradeInWidget.vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const handleSave = (data) => {
  emit('save', {
    type: 'tradein',
    data
  })
  emit('close')
}

const handleOpenChange = (isOpen) => {
  if (!isOpen) {
    emit('close')
  }
}
</script>
