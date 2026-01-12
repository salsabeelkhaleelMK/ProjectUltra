<template>
  <ModalShell
    :show="show"
    title="Close as Lost"
    subtitle="Document why this opportunity didn't close"
    @cancel="handleCancel"
  >
    <div class="space-y-4">
      <!-- Reason Dropdown -->
      <div>
        <label class="block label-upper mb-2">Reason</label>
        <select 
          v-model="selectedReason"
          class="input"
        >
          <option value="">Select a reason...</option>
          <option value="Not interested">Not interested</option>
          <option value="Budget constraints">Budget constraints</option>
          <option value="Found better price">Found better price at competitor</option>
          <option value="No response">Customer not responding</option>
          <option value="Wrong timing">Timing not right</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <!-- Notes -->
      <div>
        <label class="block label-upper mb-2">Additional Notes</label>
        <textarea 
          v-model="notes"
          rows="4"
          placeholder="Add any relevant details about why this opportunity was lost..."
          class="input resize-none"
        ></textarea>
      </div>
    </div>

    <template #actions>
      <Button 
        label="Close as Lost"
        variant="primary"
        size="small"
        class="rounded-sm !bg-red-600 !hover:bg-red-700 !border-red-600"
        :disabled="!selectedReason"
        @click="handleConfirm"
      />
    </template>
  </ModalShell>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Button } from '@motork/component-library'
import ModalShell from '@/components/shared/ModalShell.vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const selectedReason = ref('')
const notes = ref('')

// Reset form when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    selectedReason.value = ''
    notes.value = ''
  }
})

const handleConfirm = () => {
  if (!selectedReason.value) return
  emit('confirm', {
    reason: selectedReason.value,
    notes: notes.value
  })
}

const handleCancel = () => {
  emit('cancel')
}
</script>
