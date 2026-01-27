<template>
  <div class="space-y-4">
    <!-- Title and Description Card -->
    <div class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
      <h4 class="font-bold text-foreground text-sm mb-1">3rd No-Show Follow-up Task</h4>
      <p class="text-sm text-muted-foreground">
        Appointment was scheduled for {{ appointmentDate }} but customer did not show up. {{ noShowMessage }}
      </p>
    </div>

    <!-- Close as Lost Form Section -->
    <div class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
      <h5 class="font-semibold text-foreground text-sm mb-4">Close Opportunity as Lost</h5>
      
      <CloseAsLostForm
        ref="closeFormRef"
        :show-multiple-no-shows="true"
        :preselected-reason="'Multiple no shows'"
        close-button-label="Close as Lost"
        @close="handleCloseAsLost"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import CloseAsLostForm from '@/components/shared/CloseAsLostForm.vue'

const props = defineProps({
  opportunity: {
    type: Object,
    required: true
  },
  scheduledAppointment: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close-as-lost', 'cancel'])

const closeFormRef = ref(null)

const noShowMessage = computed(() => {
  return 'This is the third no-show. The opportunity will be automatically closed as lost if another appointment is not successfully completed.'
})

const appointmentDate = computed(() => {
  if (!props.scheduledAppointment?.start) return 'unknown date'
  const date = new Date(props.scheduledAppointment.start)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// Validation - expose to parent
const canSubmit = computed(() => {
  return closeFormRef.value?.canSubmit || false
})

// Submit method - called by parent
function submit() {
  closeFormRef.value?.submit()
}

// Handle close as lost for NS3
function handleCloseAsLost(reason) {
  emit('close-as-lost', {
    opportunity: props.opportunity,
    reason: reason
  })
}

// Expose for parent component
defineExpose({
  canSubmit,
  submit
})
</script>
