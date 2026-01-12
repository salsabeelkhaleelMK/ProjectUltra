<template>
  <ModalShell
    :show="show"
    title="Create Offer"
    subtitle="Create a purchase offer for the customer"
    size="2xl"
    @close="$emit('close')"
    @cancel="$emit('close')"
  >
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

    <template #actions>
      <Button
        :label="item ? 'Update Offer' : 'Create Offer'"
        variant="primary"
        size="small"
        class="rounded-sm"
        :disabled="!isValid"
        @click="triggerSave"
      />
    </template>
  </ModalShell>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Button } from '@motork/component-library'
import ModalShell from '@/components/shared/ModalShell.vue'
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

const handleSave = (data) => {
  emit('save', data)
  emit('close')
}
</script>

