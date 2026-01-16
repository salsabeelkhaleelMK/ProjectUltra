<template>
  <div class="bg-surface border border p-6 mb-6">
    <div class="flex items-start gap-3 mb-4">
      <div class="flex-shrink-0 mt-1">
        <i class="fa-solid fa-lightbulb text-2xl text-amber-500"></i>
      </div>
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-heading mb-2">Customer Insights</h3>
        <p v-if="summary" class="text-sm text-body leading-relaxed whitespace-pre-line">
          {{ summary }}
        </p>
        <p v-else class="text-meta italic">
          No customer insights available yet. Insights will appear as we learn more about this customer's preferences and behavior.
        </p>
      </div>
    </div>
    
    <!-- Quick Preferences Tags -->
    <div v-if="preferences && preferences.length > 0" class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
      <span 
        v-for="(pref, index) in preferences" 
        :key="index"
        class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
      >
        <i :class="pref.icon" class="text-xs"></i>
        {{ pref.label }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  summary: {
    type: String,
    default: null
  },
  preferences: {
    type: Array,
    default: () => []
  },
  customerData: {
    type: Object,
    default: null
  }
})

// Generate preferences from customer data if available
const preferences = computed(() => {
  if (props.preferences && props.preferences.length > 0) {
    return props.preferences
  }
  
  // Auto-generate preferences from customer data if available
  const prefs = []
  const data = props.customerData
  
  if (!data) return prefs
  
  // Vehicle preference
  if (data.preferredVehicleType) {
    prefs.push({
      icon: 'fa-solid fa-car',
      label: `Prefers ${data.preferredVehicleType}s`
    })
  }
  
  // Communication channel
  if (data.preferredChannel) {
    const channelIcons = {
      'whatsapp': 'fa-brands fa-whatsapp',
      'phone': 'fa-solid fa-phone',
      'email': 'fa-solid fa-envelope',
      'sms': 'fa-solid fa-message'
    }
    prefs.push({
      icon: channelIcons[data.preferredChannel.toLowerCase()] || 'fa-solid fa-comment',
      label: `Prefers ${data.preferredChannel}`
    })
  }
  
  // Contact time
  if (data.preferredContactTime) {
    prefs.push({
      icon: 'fa-solid fa-clock',
      label: data.preferredContactTime
    })
  }
  
  // Budget
  if (data.budgetRange) {
    prefs.push({
      icon: 'fa-solid fa-dollar-sign',
      label: data.budgetRange
    })
  }
  
  return prefs
})
</script>

