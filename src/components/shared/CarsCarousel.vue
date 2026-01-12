<template>
  <div v-if="cars.length > 0" class="mb-8">
    <div class="flex items-center gap-2 mb-4">
      <i class="fa-solid fa-thumbtack text-gray-400 text-xs"></i>
      <h3 class="font-bold text-gray-800 text-sm">Cars</h3>
    </div>
    <div class="relative">
      <div class="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory" style="scrollbar-width: thin;">
        <div
          v-for="(car, index) in cars"
          :key="car.id"
          class="flex-none w-64 snap-start bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer relative"
          @click="handleCarClick(car)"
        >
          <!-- Type Badge -->
          <div
            class="absolute top-2 right-2 z-10 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm"
            :class="getTypeBadgeClass(car.type)"
          >
            {{ getTypeLabel(car.type) }}
          </div>
          
          <div class="w-full h-36 bg-gray-200 flex items-center justify-center overflow-hidden">
            <img 
              v-if="car.image" 
              :src="car.image" 
              alt="Car" 
              class="w-full h-full object-cover"
            >
            <i v-else class="fa-solid fa-car text-4xl text-gray-400"></i>
          </div>
          <div class="p-4">
            <h4 class="font-bold text-gray-800 text-sm mb-1">{{ car.brand }} {{ car.model }} ({{ car.year }})</h4>
            <p v-if="car.price" class="text-xs text-gray-500 mb-2">€ {{ formatCurrency(car.price) }}</p>
            <div 
              v-if="car.stockDays !== null && car.stockDays !== undefined"
              class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-green-50 border border-green-100 text-green-700 text-[10px] font-semibold rounded-md mb-2"
            >
              <div class="w-1 h-1 bg-green-500 rounded-full"></div> In stock ({{ car.stockDays }} days)
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Coming Soon Modal -->
    <ComingSoonModal
      :show="showModal"
      title="Car Details"
      @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ComingSoonModal from '@/components/modals/ComingSoonModal.vue'

const props = defineProps({
  cars: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['car-click'])

const showModal = ref(false)

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const getTypeLabel = (type) => {
  const labels = {
    'requested': 'Requested',
    'offered': 'Offered',
    'drove': 'Drove',
    'purchased': 'Purchased'
  }
  return labels[type] || 'Car'
}

const getTypeBadgeClass = (type) => {
  const classes = {
    'requested': 'bg-blue-600',
    'offered': 'bg-purple-600',
    'drove': 'bg-green-600',
    'purchased': 'bg-teal-600'
  }
  return classes[type] || 'bg-gray-600'
}

const handleCarClick = (car) => {
  emit('car-click', car)
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


