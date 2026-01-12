<template>
  <ModalShell
    :show="show"
    title="Disqualify Lead"
    subtitle="Please select a reason for disqualification."
    @cancel="handleCancel"
  >
    <div class="space-y-6">
      <!-- Category Radio Buttons -->
      <div>
        <label class="block label-upper mb-3">Category</label>
        <div class="flex gap-6">
          <label class="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              v-model="category"
              value="Not Valid"
              class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
            >
            <span class="text-base text-gray-700">Not Valid</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              v-model="category"
              value="Not Interested"
              class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
            >
            <span class="text-base text-gray-700">Not Interested</span>
          </label>
        </div>
      </div>
      
      <!-- Failure Reason Dropdown -->
      <div>
        <label class="block label-upper mb-3">Failure Reason</label>
        <select 
          v-model="failureReason"
          class="w-full bg-white border-2 border-red-500 rounded-lg px-4 py-3 text-base text-gray-700 focus:outline-none focus:border-red-600 transition-colors"
        >
          <option value="">Select a reason...</option>
          <option value="Data cleanup">Data cleanup</option>
          <option value="Unreachable">Unreachable</option>
          <option value="Purchase postponed">Purchase postponed</option>
          <option value="Vehicle sold">Vehicle sold</option>
          <option value="Out of budget">Out of budget</option>
          <option value="Financing rejected">Financing rejected</option>
          <option value="Duplicate">Duplicate</option>
          <option value="Bought elsewhere">Bought elsewhere</option>
        </select>
      </div>
    </div>

    <template #actions>
      <Button
        label="Confirm Disqualification"
        variant="primary"
        size="small"
        class="rounded-sm !bg-red-600 !hover:bg-red-700 !border-red-600"
        :disabled="!category || !failureReason"
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

const category = ref('Not Interested')
const failureReason = ref('')

// Reset form when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    category.value = 'Not Interested'
    failureReason.value = ''
  }
})

const handleConfirm = () => {
  emit('confirm', {
    category: category.value,
    reason: failureReason.value
  })
}

const handleCancel = () => {
  emit('cancel')
}
</script>
