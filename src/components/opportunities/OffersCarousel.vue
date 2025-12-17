<template>
  <div v-if="offers.length > 0" class="mb-8">
    <h3 class="font-bold text-gray-800 text-sm mb-4">Offers</h3>
    <div class="relative">
      <div class="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide scroll-smooth">
        <div
          v-for="(offer, index) in offers"
          :key="offer.id"
          class="flex-none w-64 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          @click="handleOfferClick(offer)"
        >
          <!-- Main Offer Badge -->
          <div v-if="index === 0" class="bg-blue-600 text-white text-xs font-bold px-3 py-1 text-center">
            Main Offer
          </div>
          <div class="w-full h-36 bg-gray-200 flex items-center justify-center overflow-hidden">
            <img 
              v-if="offer.image" 
              :src="offer.image" 
              alt="Car" 
              class="w-full h-full object-cover"
            >
            <i v-else class="fa-solid fa-car text-4xl text-gray-400"></i>
          </div>
          <div class="p-4">
            <h4 class="font-bold text-gray-800 text-sm mb-1">{{ offer.brand }} {{ offer.model }} ({{ offer.year }})</h4>
            <p class="text-xs text-gray-500 mb-2">€ {{ formatCurrency(offer.price) }}</p>
            <div 
              v-if="offer.stockDays !== null && offer.stockDays !== undefined"
              class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-green-50 border border-green-100 text-green-700 text-[10px] font-semibold rounded-md mb-2"
            >
              <div class="w-1 h-1 bg-green-500 rounded-full"></div> In stock ({{ offer.stockDays }} days)
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Coming Soon Modal -->
    <ComingSoonModal
      :show="showModal"
      title="Offer Details"
      @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { mockVehicles } from '@/api/mockData'
import ComingSoonModal from '@/components/shared/ComingSoonModal.vue'

const offers = ref([])
const showModal = ref(false)

onMounted(() => {
  // Use mock vehicles as offers (can be replaced with actual offers data)
  offers.value = mockVehicles
    .filter(car => car.stockDays !== null && car.stockDays !== undefined)
    .slice(0, 5)
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const handleOfferClick = (offer) => {
  showModal.value = true
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

