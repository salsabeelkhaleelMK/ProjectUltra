<template>
  <div class="space-y-4">
    <!-- Title and Description Card -->
    <div class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
      <h4 class="font-bold text-foreground text-sm mb-1">Create Offer</h4>
      <p class="text-sm text-muted-foreground">
        Customer showed up for the appointment. Create an offer to proceed with the opportunity.
      </p>
    </div>

    <!-- Offer Form Section -->
    <div class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
      <OfferWidget
        :item="null"
        :task-type="'opportunity'"
        :task-id="opportunity.id"
        :selected-vehicle="selectedVehicle"
        :customer="opportunity.customer"
        :hide-header="true"
        :hide-actions="true"
        ref="offerWidgetRef"
        @save="handleOfferSave"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import OfferWidget from '@/components/customer/activities/OfferWidget.vue'

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

const emit = defineEmits(['offer-created', 'cancel'])

const offerWidgetRef = ref(null)

// Selected vehicle - prefer requested car, then vehicle, then null
const selectedVehicle = computed(() => {
  return props.opportunity.requestedCar || props.opportunity.vehicle || null
})

// Validation - expose to parent
const canSubmit = computed(() => {
  return offerWidgetRef.value?.isValid || false
})

// Submit method - called by parent
function submit() {
  offerWidgetRef.value?.submit()
}

// Handle offer save from widget
function handleOfferSave(offerData) {
  emit('offer-created', {
    opportunity: props.opportunity,
    offerData: offerData
  })
}

// Expose for parent component
defineExpose({
  canSubmit,
  submit
})
</script>
