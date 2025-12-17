<template>
  <div class="bg-orange-50/50 border border-orange-100 rounded-lg p-4 relative transition-all duration-300">
    <div class="flex justify-between items-start mb-3">
      <div>
        <h4 class="font-bold text-slate-800 text-sm">Open Opportunity Feedback</h4>
        <p class="text-xs text-gray-500 mt-0.5">This opportunity has been open for {{ daysOpen }} days without any offer. Consider creating an offer to move forward.</p>
      </div>
    </div>
    <div class="flex gap-3 flex-wrap">
      <button
        @click="handleCreateOffer"
        class="bg-orange-600 hover:bg-orange-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
      >
        Create Offer
      </button>
      <button
        @click="handleReview"
        class="bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
      >
        Review Opportunity
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

const emit = defineEmits(['create-offer', 'review'])

const daysOpen = computed(() => {
  if (!props.opportunity.createdAt) return 0
  const created = new Date(props.opportunity.createdAt)
  const now = new Date()
  const diffTime = Math.abs(now - created)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

const handleCreateOffer = () => {
  emit('create-offer', props.opportunity)
}

const handleReview = () => {
  emit('review', props.opportunity)
}
</script>

