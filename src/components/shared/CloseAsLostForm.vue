<template>
  <div class="bg-white rounded-lg p-4 shadow-nsc-card">
    <div>
      <Label class="block text-sm font-medium text-muted-foreground mb-1.5">Reason</Label>
      <Select v-model="reason">
        <SelectTrigger class="w-full">
          <SelectValue placeholder="Select a reason..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-if="showMultipleNoShows" value="Multiple no shows">Multiple no shows</SelectItem>
          <SelectItem value="Data cleanup">Data cleanup</SelectItem>
          <SelectItem value="Unreachable">Unreachable</SelectItem>
          <SelectItem value="Purchase postponed">Purchase postponed</SelectItem>
          <SelectItem value="Vehicle sold">Vehicle sold</SelectItem>
          <SelectItem value="Out of budget">Out of budget</SelectItem>
          <SelectItem value="Financing rejected">Financing rejected</SelectItem>
          <SelectItem value="Duplicate">Duplicate</SelectItem>
          <SelectItem value="Bought elsewhere">Bought elsewhere</SelectItem>
          <SelectItem value="Not interested">Not interested</SelectItem>
          <SelectItem value="Budget constraints">Budget constraints</SelectItem>
          <SelectItem value="Found better price">Found better price at competitor</SelectItem>
          <SelectItem value="No response">Customer not responding</SelectItem>
          <SelectItem value="Wrong timing">Timing not right</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@motork/component-library/future/primitives'

const props = defineProps({
  showMultipleNoShows: {
    type: Boolean,
    default: false
  },
  preselectedReason: {
    type: String,
    default: ''
  },
  closeButtonLabel: {
    type: String,
    default: 'Close'
  }
})

const emit = defineEmits(['close', 'cancel', 'update:reason'])

const reason = ref(props.preselectedReason || '')

watch(() => props.preselectedReason, (newVal) => {
  if (newVal) {
    reason.value = newVal
  }
})

watch(reason, (v) => {
  emit('update:reason', v)
})

// Validation
const canSubmit = computed(() => !!reason.value)

// Submit method - called by parent
function submit() {
  if (!canSubmit.value) return
  emit('close', reason.value)
}

// Expose values for parent component access
defineExpose({
  reason,
  canSubmit,
  submit
})
</script>
