<template>
  <div 
    @click="$emit('select')"
    class="border border-E5E7EB rounded-lg p-3 hover:border-blue-500 hover:shadow cursor-pointer transition-all bg-surface"
    :class="{ 'border-blue-500 shadow': selected }"
  >
    <!-- Vehicle Image -->
    <div class="w-full h-28 bg-surfaceSecondary rounded overflow-hidden mb-2">
      <img 
        v-if="vehicle.image" 
        :src="vehicle.image" 
        :alt="`${vehicle.brand} ${vehicle.model}`"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <i class="fa-solid fa-car text-sub opacity-50 text-2xl"></i>
      </div>
    </div>
    
    <!-- Vehicle Info -->
    <div>
      <!-- Badge and Price Row -->
      <div class="flex items-center justify-between mb-1.5">
        <Badge
          :text="badge"
          size="small"
          :theme="badgeTheme"
        />
        <span class="text-sm font-bold text-heading">€{{ formatPrice(vehicle.price) }}</span>
      </div>
      
      <!-- Brand and Model -->
      <h4 class="font-bold text-xs text-heading mb-0.5 line-clamp-1">
        {{ vehicle.brand }} {{ vehicle.model }}
      </h4>
      
      <!-- Year -->
      <p class="text-xs text-sub mb-1.5">{{ vehicle.year }}</p>
      
      <!-- Stock Status -->
      <div v-if="stockDays !== null && stockDays !== undefined" class="text-xs text-green-600 font-medium mb-2">
        <i class="fa-solid fa-check-circle mr-0.5"></i>
        In stock ({{ stockDays }} days)
      </div>
      <div v-else class="text-xs text-orange-600 font-medium mb-2">
        <i class="fa-solid fa-clock mr-0.5"></i>
        Out of stock
      </div>
      
      <!-- Select Button -->
      <button 
        @click.stop="$emit('select')"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded text-xs transition-colors"
      >
        Select
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Badge } from '@motork/component-library'

const props = defineProps({
  vehicle: {
    type: Object,
    required: true
  },
  badge: {
    type: String,
    required: true // 'Requested', 'Recommended', 'In Stock', 'Custom'
  },
  stockDays: {
    type: Number,
    default: null
  },
  selected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['select'])

const badgeTheme = computed(() => {
  const themeMap = {
    'Requested': 'blue',
    'Recommended': 'gray', // Purple not available, use gray
    'In Stock': 'green',
    'Custom': 'yellow' // Orange not available, use yellow
  }
  return themeMap[props.badge] || 'gray'
})

const formatPrice = (price) => {
  if (!price) return '0'
  return price.toLocaleString('en-US')
}
</script>

