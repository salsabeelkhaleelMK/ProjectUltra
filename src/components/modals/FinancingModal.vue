<template>
  <ModalShell
    :show="show"
    title="Add Financing"
    subtitle="Record financing details for this customer"
    size="lg"
    @close="$emit('close')"
    @cancel="$emit('close')"
  >
    <FinancingWidget
      :item="item"
      :task-type="taskType"
      :task-id="taskId"
      :hide-actions="true"
      ref="widgetRef"
      @save="handleSave"
      @cancel="$emit('close')"
    />

    <template #actions>
      <Button
        label="Save Financing"
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
import FinancingWidget from '@/components/customer/activities/FinancingWidget.vue'

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
    default: 'lead'
  },
  taskId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const widgetRef = ref(null)

// Check if form is valid (widget exposes isValid)
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

