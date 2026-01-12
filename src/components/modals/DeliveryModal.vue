<template>
  <ModalShell
    :show="show"
    title="Mark as Delivered"
    subtitle="Record the vehicle delivery date and details"
    @cancel="handleCancel"
  >
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

    <template #actions>
      <Button 
        label="Mark as Delivered"
        variant="primary"
        size="small"
        class="rounded-sm !bg-green-600 !hover:bg-green-700 !border-green-600"
        :disabled="!deliveryDate || !deliveryLocation"
        @click="handleConfirm"
      />
    </template>
  </ModalShell>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { Button } from '@motork/component-library'
import ModalShell from '@/components/shared/ModalShell.vue'

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
</script>
