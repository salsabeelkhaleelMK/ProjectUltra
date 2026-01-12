<template>
  <ModalShell
    :show="show"
    title="Set Contract Signing Date"
    subtitle="Record when the contract was signed to track delivery timeline"
    @cancel="handleCancel"
  >
    <div class="space-y-4">
      <!-- Contract Date -->
      <div>
        <label class="block label-upper mb-2">Contract Date</label>
        <input 
          type="date"
          v-model="contractDate"
          :max="maxDate"
          class="input"
        />
      </div>
      
      <!-- Contract Time -->
      <div>
        <label class="block label-upper mb-2">Time (Optional)</label>
        <input 
          type="time"
          v-model="contractTime"
          class="input"
        />
      </div>
      
      <!-- Notes -->
      <div>
        <label class="block label-upper mb-2">Notes (Optional)</label>
        <textarea 
          v-model="notes"
          rows="3"
          placeholder="Add any relevant notes about the contract signing..."
          class="input resize-none"
        ></textarea>
      </div>
    </div>

    <template #actions>
      <Button 
        label="Set Contract Date"
        variant="primary"
        size="small"
        class="rounded-sm !bg-green-600 !hover:bg-green-700 !border-green-600"
        :disabled="!contractDate"
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

const contractDate = ref('')
const contractTime = ref('')
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
    contractDate.value = today.toISOString().split('T')[0]
    contractTime.value = today.toTimeString().slice(0, 5)
    notes.value = ''
  }
})

const handleConfirm = () => {
  if (!contractDate.value) return
  
  // Combine date and time
  const datetime = contractTime.value 
    ? `${contractDate.value}T${contractTime.value}:00`
    : `${contractDate.value}T12:00:00`
  
  emit('confirm', {
    contractDate: datetime,
    notes: notes.value
  })
}

const handleCancel = () => {
  emit('cancel')
}
</script>
