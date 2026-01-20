<template>
  <div 
    class="overflow-hidden p-4"
    style="
      border-radius: var(--border-radius-rounded-lg, 10px);
      background: var(--base-card, #FFF);
      box-shadow: 0 0 0 1px rgba(14, 63, 126, 0.04), 0 1px 1px -0.5px rgba(42, 51, 69, 0.04), 
                  0 3px 3px -1.5px rgba(42, 51, 70, 0.04), 0 6px 6px -3px rgba(42, 51, 70, 0.04), 
                  0 12px 12px -6px rgba(14, 63, 126, 0.04), 0 24px 24px -12px rgba(14, 63, 126, 0.04);
    "
  >
    <h3 class="text-base font-medium mb-4 text-greys-900 -mx-4 -mt-4 px-4 pt-4 rounded-t-lg">Requested Car</h3>
    
    <!-- Vehicle Image -->
    <div 
      v-if="imageUrl" 
      class="w-full h-40 rounded-lg overflow-hidden mb-4 bg-gray-100"
    >
      <img 
        :src="imageUrl" 
        :alt="`${vehicle.brand} ${vehicle.model}`"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />
    </div>
    <div 
      v-else
      class="w-full h-40 rounded-lg overflow-hidden mb-4 bg-gray-100 flex items-center justify-center"
    >
      <Car :size="48" class="text-gray-400" />
    </div>
    
    <!-- Vehicle Details -->
    <div class="space-y-2 mb-4">
      <div class="flex justify-between items-start gap-2">
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium text-greys-900 truncate">
            {{ vehicleName }}
          </p>
          <p v-if="vehicle.year" class="text-xs text-greys-500">
            {{ vehicle.year }}
          </p>
        </div>
        <p v-if="vehicle.price" class="text-sm font-semibold text-greys-900 shrink-0">
          €{{ formatPrice(vehicle.price) }}
        </p>
      </div>
      
      <!-- Additional vehicle details -->
      <div v-if="vehicle.mileage || vehicle.fuelType" class="flex gap-3 text-xs text-greys-500">
        <span v-if="vehicle.mileage">{{ formatMileage(vehicle.mileage) }} km</span>
        <span v-if="vehicle.fuelType">{{ vehicle.fuelType }}</span>
      </div>
    </div>
    
    <!-- Source Badge -->
    <div v-if="source" class="mb-4">
      <Badge variant="secondary" class="text-xs">
        {{ source }}
      </Badge>
    </div>
    
    <!-- Request Message -->
    <div 
      v-if="requestMessage" 
      class="rounded-lg p-3 mb-4"
      style="background-color: var(--base-muted, #f5f5f5);"
    >
      <p class="text-xs text-greys-500 mb-1">Request message</p>
      <p class="text-sm text-greys-900">{{ requestMessage }}</p>
    </div>
    
    <!-- Action Buttons -->
    <div class="flex gap-2 pt-4 border-t border-black/5">
      <Button 
        variant="secondary" 
        size="sm" 
        class="flex-1"
        @click="$emit('open-ad')"
      >
        <ExternalLink :size="16" />
        <span>Open Ad</span>
      </Button>
      <Button 
        variant="secondary" 
        size="icon-sm"
        @click="$emit('more-actions')"
      >
        <MoreVertical :size="16" />
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Button, Badge } from '@motork/component-library/future/primitives'
import { Car, ExternalLink, MoreVertical } from 'lucide-vue-next'

const props = defineProps({
  vehicle: {
    type: Object,
    required: true
  },
  requestMessage: {
    type: String,
    default: ''
  },
  source: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  }
})

defineEmits(['open-ad', 'more-actions'])

const imageError = ref(false)

const vehicleName = computed(() => {
  const parts = []
  
  if (props.vehicle.brand) {
    parts.push(props.vehicle.brand)
  }
  
  if (props.vehicle.model) {
    parts.push(props.vehicle.model)
  }
  
  if (props.vehicle.variant) {
    parts.push(props.vehicle.variant)
  }
  
  return parts.join(' ') || 'Vehicle Details'
})

const formatPrice = (price) => {
  if (!price) return '0'
  
  // Convert to number if string
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  
  // Format with thousands separator
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numPrice)
}

const formatMileage = (mileage) => {
  if (!mileage) return '0'
  
  // Convert to number if string
  const numMileage = typeof mileage === 'string' ? parseFloat(mileage) : mileage
  
  // Format with thousands separator
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numMileage)
}

const handleImageError = () => {
  imageError.value = true
}
</script>

<style scoped>
.text-greys-500 {
  color: #6B7280;
}

.text-greys-900 {
  color: #111827;
}
</style>
