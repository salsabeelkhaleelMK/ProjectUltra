<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-2xl max-h-[calc(100vh-4rem)] flex flex-col p-0">
        <DialogHeader class="flex-shrink-0 p-6 pb-4 border-b border">
          <DialogTitle>Create offer</DialogTitle>
          <p class="text-sm text-muted-foreground mt-1">
            Add a new offer to this opportunity. Select a vehicle and fill in the details.
          </p>
        </DialogHeader>

        <div class="flex-1 overflow-y-auto px-6 py-4">
          <OfferWidget
            v-if="opportunity"
            ref="offerWidgetRef"
            :task-id="opportunity.id"
            task-type="opportunity"
            :customer="opportunity.customer"
            :selected-vehicle="opportunity.selectedVehicle || opportunity.vehicle || opportunity.requestedCar"
            hide-header
            hide-actions
            @save="handleSave"
            @cancel="handleCancel"
          />
        </div>

        <DialogFooter class="flex-shrink-0 flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3 p-6 pt-4 border-t border">
          <Button
            label="Cancel"
            variant="outline"
            size="small"
            class="rounded-sm w-full sm:w-auto"
            @click="handleCancel"
          />
          <Button
            label="Create offer"
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
import { Button } from '@motork/component-library/future/primitives'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle
} from '@motork/component-library/future/primitives'
import OfferWidget from '@/components/customer/activities/OfferWidget.vue'

const props = defineProps({
  show: { type: Boolean, required: true },
  opportunity: { type: Object, default: null }
})

const emit = defineEmits(['confirm', 'cancel'])

const offerWidgetRef = ref(null)

const canSubmit = computed(() => offerWidgetRef.value?.isValid ?? false)

watch(() => props.show, (isOpen) => {
  if (!isOpen) offerWidgetRef.value = null
})

function handleConfirm() {
  if (!canSubmit.value || !offerWidgetRef.value) return
  offerWidgetRef.value.submit()
}

function handleSave(payload) {
  emit('confirm', payload)
}

function handleCancel() {
  emit('cancel')
}

function handleOpenChange(isOpen) {
  if (!isOpen) handleCancel()
}
</script>
