<template>
  <div class="overflow-hidden p-4 rounded-lg bg-white border border-black/5 shadow-sm">
    <h3 class="text-fluid-sm font-medium mb-3 text-heading">Requested Car</h3>

    <div class="flex gap-4">
      <div
        class="w-24 shrink-0 aspect-3/2 rounded-lg overflow-hidden bg-surfaceTertiary"
      >
        <img
          v-if="imageUrl && !imageError"
          :src="imageUrl"
          :alt="`${vehicle.brand} ${vehicle.model}`"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center"
        >
          <Car :size="32" class="text-sub" />
        </div>
      </div>

      <div class="min-w-0 flex-1 flex flex-col justify-center">
        <p class="text-fluid-sm font-semibold text-heading truncate">
          {{ vehicleNameWithYear }}
        </p>
        <div
          v-if="vehicle.price || source"
          class="flex items-center gap-2 mt-1 text-fluid-sm text-heading flex-wrap"
        >
          <span v-if="vehicle.price" class="font-semibold">
            €{{ formatPrice(vehicle.price) }}
          </span>
          <span
            v-if="vehicle.price && source"
            class="h-3 w-px bg-border shrink-0"
            aria-hidden="true"
          />
          <span v-if="source" class="text-sub truncate">{{ source }}</span>
        </div>
        <div
          v-if="vehicle.mileage || vehicle.fuelType"
          class="flex gap-3 mt-0.5 text-fluid-xs text-sub"
        >
          <span v-if="vehicle.mileage">{{ formatMileage(vehicle.mileage) }} km</span>
          <span v-if="vehicle.fuelType">{{ vehicle.fuelType }}</span>
        </div>
      </div>
    </div>

    <div
      v-if="requestMessage"
      class="rounded-lg p-3 mt-3 bg-base-muted"
    >
      <p class="text-fluid-xs text-sub mb-0.5">Request message</p>
      <p class="text-fluid-sm text-heading">{{ requestMessage }}</p>
    </div>

    <div class="flex gap-2 pt-3 mt-3 border-t border-black/5">
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
import { Button } from '@motork/component-library/future/primitives'
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
  if (props.vehicle.brand) parts.push(props.vehicle.brand)
  if (props.vehicle.model) parts.push(props.vehicle.model)
  if (props.vehicle.variant) parts.push(props.vehicle.variant)
  return parts.join(' ') || 'Vehicle Details'
})

const vehicleNameWithYear = computed(() => {
  const name = vehicleName.value
  return props.vehicle.year ? `${name} (${props.vehicle.year})` : name
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

