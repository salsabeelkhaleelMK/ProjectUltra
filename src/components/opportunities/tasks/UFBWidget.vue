<template>
  <div class="bg-red-50/50 border border-red-100 rounded-lg p-4 relative transition-all duration-300">
    <div class="flex justify-between items-start mb-3">
      <div>
        <h4 class="font-bold text-slate-800 text-sm">Unsold Feedback</h4>
        <p class="text-xs text-gray-500 mt-0.5">This opportunity has been in negotiation for {{ daysInNegotiation }} days without a contract. The previous follow-up didn't result in progress. Consider creating a contract or closing the opportunity.</p>
      </div>
    </div>
    <div class="flex gap-3 flex-wrap">
      <button
        @click="handleCreateContract"
        class="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
      >
        Create Contract
      </button>
      <button
        @click="handleMarkUnsold"
        class="bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
      >
        Mark as Unsold
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

const emit = defineEmits(['create-contract', 'mark-unsold'])

const daysInNegotiation = computed(() => {
  // Calculate days since opportunity entered negotiation stage
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

const handleMarkUnsold = () => {
  emit('mark-unsold', props.opportunity)
}
</script>

