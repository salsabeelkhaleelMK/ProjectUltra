<template>
  <div class="bg-teal-50/50 border border-teal-100 rounded-lg p-4 relative transition-all duration-300">
    <div class="flex justify-between items-start mb-3">
      <div>
        <h4 class="font-bold text-slate-800 text-sm">Delivery Feedback</h4>
        <p class="text-xs text-gray-500 mt-0.5">Vehicle was delivered {{ daysSinceDelivery }} days ago. Ask the customer if they're satisfied with the vehicle.</p>
      </div>
    </div>
    <button
      @click="handleDeliveryFeedback"
      class="bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
    >
      Delivery Feedback
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  opportunity: {
    type: Object,
    required: true
  },
  activities: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['delivery-feedback'])

const daysSinceDelivery = computed(() => {
  // Find delivery activity
  const deliveryActivity = props.activities.find(activity => 
    activity.type === 'delivery' || 
    activity.action?.toLowerCase().includes('delivered')
  )
  
  if (!deliveryActivity || !deliveryActivity.timestamp) return 0
  
  const deliveryDate = new Date(deliveryActivity.timestamp)
  const now = new Date()
  const diffTime = Math.abs(now - deliveryDate)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const handleDeliveryFeedback = () => {
  emit('delivery-feedback', props.opportunity)
}
</script>

