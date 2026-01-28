<template>
  <div class="space-y-4">
    <div class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
      <h5 class="font-semibold text-foreground text-sm mb-4">Close Opportunity as Lost</h5>
      
      <div class="space-y-4">
        <!-- Reason Selection -->
        <CloseAsLostForm
          ref="closeAsLostFormRef"
          :preselected-reason="reason"
          @update:reason="(value) => { reason.value = value }"
        />
        
        <!-- Additional Notes -->
        <div>
          <Label class="block text-sm font-medium text-muted-foreground mb-2">Additional Notes (Optional)</Label>
          <Textarea 
            v-model="notes"
            rows="4"
            placeholder="Add any relevant details about why this opportunity was lost..."
            class="w-full"
          />
        </div>
      </div>
    </div>
    
    <!-- Close as Lost Buttons -->
    <div class="flex justify-end gap-2">
      <Button
        variant="secondary"
        @click="handleCancel"
      >
        Cancel
      </Button>
      <Button
        variant="default"
        :disabled="!canSubmit"
        @click="handleConfirm"
        class="!bg-red-600 !hover:bg-red-700 !text-white"
      >
        Close as Lost
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Button, Label, Textarea } from '@motork/component-library/future/primitives'
import CloseAsLostForm from '@/components/shared/CloseAsLostForm.vue'

const props = defineProps({
  preselectedReason: {
    type: String,
    default: ''
  },
  preselectedNotes: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['cancel', 'confirm'])

const closeAsLostFormRef = ref(null)
const reason = ref(props.preselectedReason || '')
const notes = ref(props.preselectedNotes || '')

watch(() => props.preselectedReason, (newVal) => {
  if (newVal) {
    reason.value = newVal
  }
})

watch(() => props.preselectedNotes, (newVal) => {
  if (newVal) {
    notes.value = newVal
  }
})

const canSubmit = computed(() => {
  return !!reason.value
})

function handleCancel() {
  reason.value = ''
  notes.value = ''
  emit('cancel')
}

function handleConfirm() {
  if (!canSubmit.value) return
  emit('confirm', {
    reason: reason.value,
    notes: notes.value
  })
}

// Expose method to reset form
function reset() {
  reason.value = ''
  notes.value = ''
}

// Expose refs and methods for parent component access
defineExpose({
  closeAsLostFormRef,
  reason,
  notes,
  canSubmit,
  reset
})
</script>
