<template>
  <div v-if="offers.length > 0">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-file-invoice-dollar text-sub text-xs"></i>
        <h3 class="font-semibold text-heading text-sm">Offers ({{ offers.length }})</h3>
      </div>
    </div>
    <div class="relative">
      <div class="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide scroll-smooth snap-x snap-mandatory" style="scrollbar-width: thin;">
        <div
          v-for="offer in offers"
          :key="offer.id"
          class="flex-none w-36 snap-start bg-white border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow relative"
          :class="getOfferBorderClass(offer)"
        >
          <!-- Status Badge -->
          <div
            class="absolute top-1 right-1 z-10 text-white text-xs font-bold px-1.5 py-0.5 rounded shadow-sm"
            :class="getStatusBadgeClass(offer.status)"
          >
            {{ getStatusLabel(offer.status) }}
          </div>
          
          <!-- Vehicle Image -->
          <div class="w-full h-16 bg-surfaceSecondary flex items-center justify-center overflow-hidden">
            <img 
              v-if="offer.data?.image" 
              :src="offer.data.image" 
              alt="Vehicle" 
              class="w-full h-full object-cover"
            >
            <i v-else class="fa-solid fa-car text-base text-sub"></i>
          </div>
          
          <!-- Offer Details -->
          <div class="p-2 space-y-1.5">
            <!-- Vehicle Info -->
            <div>
              <h4 class="font-bold text-heading text-xs leading-tight line-clamp-2 mb-0.5">
                {{ offer.vehicleBrand }} {{ offer.vehicleModel }} ({{ offer.vehicleYear }})
              </h4>
              <p class="text-sm font-bold text-heading">€ {{ formatCurrency(offer.price) }}</p>
              <p class="text-xs text-sub">
                {{ formatDate(offer.createdAt) }}
              </p>
            </div>
            
            <!-- Action: Mark as accepted only -->
            <div v-if="offer.status === 'active'" class="pt-1">
              <Button
                variant="primary"
                size="small"
                @click.stop="$emit('offer-accepted', offer)"
                class="w-full text-xs h-7"
              >
                <i class="fa-solid fa-check text-xs mr-1"></i>
                Mark as accepted
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Empty State -->
  <div v-else class="text-center py-6 px-3 bg-surfaceSecondary border border-E5E7EB rounded-lg">
    <i class="fa-solid fa-file-invoice text-2xl text-sub mb-2"></i>
    <p class="text-xs font-medium text-body">No offers created yet</p>
    <p class="text-xs text-sub mt-0.5">Create an offer to start negotiations</p>
  </div>
</template>

<script setup>
import { Button } from '@motork/component-library/future/primitives'

const props = defineProps({
  offers: {
    type: Array,
    default: () => []
  },
  opportunityId: {
    type: [Number, String],
    required: true
  }
})

const emit = defineEmits(['offer-accepted'])

const formatCurrency = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('en-US').format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getStatusLabel = (status) => {
  const labels = {
    'active': 'Active',
    'accepted': 'Accepted',
    'archived': 'Archived'
  }
  return labels[status] || 'Active'
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'active': 'bg-blue-600',
    'accepted': 'bg-green-600',
    'archived': 'bg-gray-600'
  }
  return classes[status] || 'bg-gray-600'
}

const getOfferBorderClass = (offer) => {
  if (offer.status === 'accepted') {
    return 'border-green-500 border-2'
  }
  return 'border-E5E7EB'
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
