<template>
  <div class="bg-green-50/50 border border-green-100 rounded-lg p-4 relative transition-all duration-300">
    <div class="flex justify-between items-start mb-3">
      <div>
        <h4 class="font-bold text-slate-800 text-sm">Contract Feedback</h4>
        <p class="text-xs text-gray-500 mt-0.5">Contract was signed {{ daysSinceContract }} days ago. Follow up on delivery status and collect customer feedback.</p>
      </div>
    </div>
    <div class="flex gap-3 flex-wrap">
      <button
        @click="handlePrepareDelivery"
        class="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
      >
        Prepare for Delivery
      </button>
      <button
        @click="handlePreDeliveryChecklist"
        class="bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
      >
        Pre-Delivery Checklist
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  opportunity: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['prepare-delivery', 'pre-delivery-checklist'])

const daysSinceContract = computed(() => {
  if (!props.opportunity?.contractDate) return 0
  const contract = new Date(props.opportunity.contractDate)
  const now = new Date()
  const diffTime = Math.abs(now - contract)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const handlePrepareDelivery = () => {
  emit('prepare-delivery', props.opportunity)
}

const handlePreDeliveryChecklist = () => {
  emit('pre-delivery-checklist', props.opportunity)
}
</script>

