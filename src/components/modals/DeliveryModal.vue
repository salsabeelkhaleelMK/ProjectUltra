<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Mark as Delivered</DialogTitle>
          <DialogDescription>Record the vehicle delivery date and details</DialogDescription>
        </DialogHeader>

        <div class="space-y-4">
      <!-- Delivery Date -->
      <div>
        <label class="block label-upper mb-2">Delivery Date</label>
        <input 
          type="date"
          v-model="deliveryDate"
          :max="maxDate"
          class="input"
        />
      </div>
      
      <!-- Delivery Time -->
      <div>
        <label class="block label-upper mb-2">Time (Optional)</label>
        <input 
          type="time"
          v-model="deliveryTime"
          class="input"
        />
      </div>
      
      <!-- Delivery Location -->
      <div>
        <label class="block label-upper mb-2">Delivery Location</label>
        <select 
          v-model="deliveryLocation"
          class="input"
        >
          <option value="">Select location...</option>
          <option value="Dealership">At Dealership</option>
          <option value="Customer Address">Customer Address</option>
          <option value="Other">Other Location</option>
        </select>
      </div>
      
      <!-- Notes -->
      <div>
        <label class="block label-upper mb-2">Delivery Notes</label>
        <textarea 
          v-model="notes"
          rows="3"
          placeholder="Add any relevant delivery details, customer feedback, etc..."
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
            label="Mark as Delivered"
            variant="primary"
            size="small"
            class="rounded-sm w-full sm:w-auto !bg-green-600 !hover:bg-green-700 !border-green-600"
            :disabled="!deliveryDate || !deliveryLocation"
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

const deliveryDate = ref('')
const deliveryTime = ref('')
const deliveryLocation = ref('')
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
    deliveryDate.value = today.toISOString().split('T')[0]
    deliveryTime.value = today.toTimeString().slice(0, 5)
    deliveryLocation.value = ''
    notes.value = ''
  }
})

const handleConfirm = () => {
  if (!deliveryDate.value || !deliveryLocation.value) return
  
  // Combine date and time
  const datetime = deliveryTime.value 
    ? `${deliveryDate.value}T${deliveryTime.value}:00`
    : `${deliveryDate.value}T12:00:00`
  
  emit('confirm', {
    deliveryDate: datetime,
    location: deliveryLocation.value,
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
