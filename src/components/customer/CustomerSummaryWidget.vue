<template>
  <div class="rounded-[12px] flex flex-col mb-6" style="background-color: var(--base-muted, #f5f5f5)">
    <!-- Title Section -->
    <div class="px-4 py-4 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-lightbulb text-heading"></i>
        <h2 class="text-fluid-sm font-medium text-heading leading-5">Customer Insights</h2>
      </div>
    </div>
    
    <!-- Card Content -->
    <div class="bg-white rounded-lg p-2 shadow-sm flex flex-col" style="box-shadow: var(--nsc-card-shadow);">
      <div class="divide-y divide-gray-100">
        <!-- Summary Section -->
        <div class="p-3">
          <p v-if="summary" class="text-sm text-body leading-relaxed whitespace-pre-line">
            {{ summary }}
          </p>
          <div v-else class="flex items-center gap-3 py-1 text-sub">
            <i class="fa-solid fa-circle-info text-sm opacity-20"></i>
            <p class="text-xs italic">No customer insights available yet. Insights will appear as we learn more about this customer's preferences and behavior.</p>
          </div>
        </div>
        
        <!-- Preferences Tags Section -->
        <div v-if="preferences && preferences.length > 0" class="p-3">
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(pref, index) in preferences" 
              :key="index"
              class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-surfaceSecondary text-heading text-[10px] font-semibold uppercase tracking-wider rounded border border-black/5"
            >
              <i :class="pref.icon" class="text-[10px] text-brand-blue"></i>
              {{ pref.label }}
            </span>
          </div>
        </div>
      </div>
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
