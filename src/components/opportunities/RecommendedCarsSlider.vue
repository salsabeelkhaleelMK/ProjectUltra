<template>
  <div v-if="recommendedCars.length > 0" class="mb-8">
    <h3 class="font-bold text-gray-800 text-sm mb-4">Recommended Cars</h3>
    <div class="relative">
      <div class="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide scroll-smooth">
        <div
          v-for="car in recommendedCars"
          :key="car.id"
          class="flex-none w-64 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
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
            <p class="text-xs text-gray-500 mb-2">€ {{ formatCurrency(car.price) }}</p>
            <div 
              v-if="car.stockDays !== null && car.stockDays !== undefined"
              class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-green-50 border border-green-100 text-green-700 text-[10px] font-semibold rounded-md mb-2"
            >
              <div class="w-1 h-1 bg-green-500 rounded-full"></div> In stock ({{ car.stockDays }} days)
            </div>
            <button
              @click="$emit('add-to-opportunity', car)"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm shadow-sm transition-colors mt-2"
            >
              Add to opportunity
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { mockVehicles } from '@/api/mockData'

const emit = defineEmits(['add-to-opportunity'])

const recommendedCars = ref([])

onMounted(() => {
  // Filter for in-stock vehicles and take a few as recommendations
  recommendedCars.value = mockVehicles
    .filter(car => car.stockDays !== null && car.stockDays !== undefined)
    .slice(0, 5)
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
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

