<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-2xl p-0">
        <DialogHeader class="p-6 pb-4 border-b border-gray-100">
          <DialogTitle>Create Offer</DialogTitle>
          <DialogDescription>Create a purchase offer for the customer</DialogDescription>
        </DialogHeader>

        <div class="p-6">
          <OfferWidget
            :item="item"
            :task-type="taskType"
            :task-id="taskId"
            :requested-car="requestedCar"
            :recommended-cars="recommendedCars"
            :hide-header="true"
            :hide-actions="true"
            ref="widgetRef"
            @save="handleSave"
            @cancel="$emit('close')"
          />
        </div>

        <DialogFooter class="p-6 pt-4 bg-gray-50 flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3 border-t border-gray-100">
          <Button
            label="Cancel"
            variant="outline"
            size="small"
            class="rounded-sm w-full sm:w-auto"
            @click="$emit('close')"
          />
          <Button
            :label="item ? 'Update Offer' : 'Create Offer'"
            variant="primary"
            size="small"
            class="rounded-sm w-full sm:w-auto"
            :disabled="!isValid"
            @click="triggerSave"
          />
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
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
import OfferWidget from '@/components/customer/activities/OfferWidget.vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  item: {
    type: Object,
    default: null
  },
  taskType: {
    type: String,
    default: 'opportunity'
  },
  taskId: {
    type: [String, Number],
    required: true
  },
  requestedCar: {
    type: Object,
    default: null
  },
  recommendedCars: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

const widgetRef = ref(null)

// Check if form is valid (widget exposes isValid/canSave)
const isValid = computed(() => {
  return widgetRef.value?.isValid || false
})

const triggerSave = () => {
  // Trigger the widget's submit method
  widgetRef.value?.submit()
}

const handleOpenChange = (isOpen) => {
  if (!isOpen) {
    emit('close')
  }
}

const handleSave = (data) => {
  emit('save', data)
  emit('close')
}
</script>

