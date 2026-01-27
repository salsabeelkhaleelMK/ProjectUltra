<template>
  <div class="space-y-4">
    <!-- Title and Description Card -->
    <div class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
      <h4 class="font-bold text-foreground text-sm mb-1">No Follow-Up Task</h4>
      <p class="text-sm text-muted-foreground">
        5+ days in negotiation with no future appointment scheduled. Schedule an appointment to move forward or close as lost.
      </p>
    </div>

    <!-- Action Selection Buttons -->
    <div class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
      <h5 class="font-semibold text-foreground text-sm mb-4">Choose Action</h5>
      <div class="flex flex-wrap gap-3">
        <Button
          variant="outline"
          @click="selectedAction = 'schedule'"
          class="flex-1"
          :class="selectedAction === 'schedule' ? 'border-purple-500 bg-purple-50 text-purple-700' : ''"
        >
          <i class="fa-solid fa-calendar-plus mr-2"></i>
          Schedule Appointment
        </Button>
        <Button
          variant="outline"
          @click="selectedAction = 'close-lost'"
          class="flex-1"
          :class="selectedAction === 'close-lost' ? 'border-red-500 bg-red-50 text-red-700' : ''"
        >
          <i class="fa-solid fa-xmark mr-2"></i>
          Close as Lost
        </Button>
      </div>
    </div>

    <!-- Schedule Appointment Form (placeholder - will be implemented) -->
    <div v-if="selectedAction === 'schedule'" class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
      <h5 class="font-semibold text-foreground text-sm mb-4">Schedule Appointment</h5>
      <p class="text-sm text-muted-foreground">
        This will reuse the full schedule appointment form from the Awaiting Appointment stage.
      </p>
      <!-- TODO: Add full schedule form here -->
    </div>

    <!-- Close as Lost Form -->
    <div v-if="selectedAction === 'close-lost'">
      <CloseAsLostForm
        ref="closeFormRef"
        :item="opportunity"
        item-type="opportunity"
        @close="handleCloseAsLost"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Button } from '@motork/component-library/future/primitives'
import CloseAsLostForm from '@/components/shared/CloseAsLostForm.vue'

const props = defineProps({
  opportunity: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['appointment-scheduled', 'close-as-lost', 'cancel'])

const selectedAction = ref(null)
const closeFormRef = ref(null)

// Validation - expose to parent
const canSubmit = computed(() => {
  if (selectedAction.value === 'schedule') {
    // TODO: Add schedule form validation
    return false
  }
  if (selectedAction.value === 'close-lost') {
    return closeFormRef.value?.canSubmit || false
  }
  return false
})

// Submit method - called by parent
async function submit() {
  if (selectedAction.value === 'schedule') {
    // TODO: Submit schedule form
    emit('appointment-scheduled', { opportunity: props.opportunity })
  } else if (selectedAction.value === 'close-lost') {
    closeFormRef.value?.submit()
  }
}

// Handle close as lost from form
function handleCloseAsLost(data) {
  emit('close-as-lost', {
    opportunity: props.opportunity,
    reason: data.reason
  })
}

// Expose for parent component
defineExpose({
  canSubmit,
  submit
})
</script>

