<template>
  <div class="bg-blue-50/50 border border-blue-100 rounded-lg p-4 relative transition-all duration-300">
    <div class="flex justify-between items-start mb-3">
      <div>
        <h4 class="font-bold text-slate-800 text-sm">Offer Feedback</h4>
        <p class="text-xs text-gray-500 mt-0.5">This opportunity has been in negotiation for {{ daysInNegotiation }} days without a contract. Consider creating a contract to finalize the deal.</p>
      </div>
    </div>
    <div class="flex gap-3 flex-wrap">
      <button
        @click="handleCreateContract"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
      >
        Create Contract
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

const emit = defineEmits(['create-contract'])

const daysInNegotiation = computed(() => {
  // Calculate days since opportunity entered negotiation stage
  // For now, use lastActivity or createdAt as fallback
  const date = props.opportunity.lastActivity || props.opportunity.createdAt
  if (!date) return 0
  const negotiationDate = new Date(date)
  const now = new Date()
  const diffTime = Math.abs(now - negotiationDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

const handleCreateContract = () => {
  emit('create-contract', props.opportunity)
}
</script>

