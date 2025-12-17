<template>
  <div class="bg-white rounded-xl p-5 mb-6 animate-fade-in relative">
    <div class="flex justify-between items-center mb-4">
      <h5 class="text-sm font-bold text-slate-800">{{ item ? 'Edit Offer' : 'Add Offer' }}</h5>
      <button @click="$emit('cancel')" class="text-gray-400 hover:text-gray-600"><i class="fa-solid fa-xmark"></i></button>
    </div>
    
    <!-- Select from requested car or recommended cars -->
    <div v-if="!item" class="mb-4">
      <label class="block text-xs font-medium text-slate-700 mb-2">Select a vehicle</label>
      <div class="max-h-64 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-2">
        <!-- Requested Car -->
        <div
          v-if="requestedCar"
          @click="selectCar(requestedCar)"
          class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-colors"
          :class="{ 'border-blue-400 bg-blue-50': selectedCar?.id === requestedCar.id }"
        >
          <div class="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
            <img 
              v-if="requestedCar.image" 
              :src="requestedCar.image" 
              alt="Car" 
              class="w-full h-full object-cover"
            >
            <i v-else class="fa-solid fa-car text-gray-400 w-full h-full flex items-center justify-center"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="font-bold text-sm text-gray-800 truncate">{{ requestedCar.brand }} {{ requestedCar.model }} ({{ requestedCar.year }})</h4>
              <span 
                class="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold shrink-0"
                :class="selectedCar?.id === requestedCar.id && selectedCarType === 'requested' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-blue-100 text-blue-700 border border-blue-200'"
              >
                Requested
              </span>
            </div>
            <p class="text-xs text-gray-500">€ {{ formatCurrency(requestedCar.price) }}</p>
            <div v-if="requestedCar.stockDays !== null && requestedCar.stockDays !== undefined" class="text-[10px] text-green-600 mt-0.5">
              In stock ({{ requestedCar.stockDays }} days)
            </div>
            <div v-else class="text-[10px] text-orange-600 mt-0.5">
              Out of stock
            </div>
          </div>
          <i class="fa-solid fa-chevron-right text-gray-400"></i>
        </div>
        
        <!-- Recommended Cars -->
        <div
          v-for="car in recommendedCars"
          :key="car.id"
          @click="selectCar(car)"
          class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-colors"
          :class="{ 'border-blue-400 bg-blue-50': selectedCar?.id === car.id }"
        >
          <div class="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
            <img 
              v-if="car.image" 
              :src="car.image" 
              alt="Car" 
              class="w-full h-full object-cover"
            >
            <i v-else class="fa-solid fa-car text-gray-400 w-full h-full flex items-center justify-center"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="font-bold text-sm text-gray-800 truncate">{{ car.brand }} {{ car.model }} ({{ car.year }})</h4>
              <span 
                class="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold shrink-0"
                :class="selectedCar?.id === car.id && selectedCarType === 'recommended' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-purple-100 text-purple-700 border border-purple-200'"
              >
                Recommended
              </span>
            </div>
            <p class="text-xs text-gray-500">€ {{ formatCurrency(car.price) }}</p>
            <div v-if="car.stockDays !== null && car.stockDays !== undefined" class="text-[10px] text-green-600 mt-0.5">
              In stock ({{ car.stockDays }} days)
            </div>
          </div>
          <i class="fa-solid fa-chevron-right text-gray-400"></i>
        </div>
        
        <div v-if="!requestedCar && recommendedCars.length === 0" class="text-center py-4 text-gray-400 text-sm">
          No vehicles available
        </div>
      </div>
    </div>
    
    <!-- Or create new offer manually -->
    <div class="mb-4">
      <div v-if="requestedCar || recommendedCars.length > 0" class="flex items-center gap-2 mb-2">
        <div class="flex-grow border-t border-gray-200"></div>
        <span class="text-xs text-gray-400 uppercase font-semibold">Or create manually</span>
        <div class="flex-grow border-t border-gray-200"></div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Brand</label>
          <input type="text" v-model="offerData.brand" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Model</label>
          <input type="text" v-model="offerData.model" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Year</label>
          <input type="number" v-model="offerData.year" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Price (€)</label>
          <input type="number" v-model="offerData.price" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
        </div>
      </div>
      <div class="mt-4">
        <label class="block text-xs font-medium text-slate-700 mb-1">Image URL (optional)</label>
        <input type="text" v-model="offerData.image" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700" placeholder="https://...">
      </div>
    </div>
    
    <div class="flex justify-end gap-2 mt-6 border-t border-gray-100 pt-4">
      <button @click="$emit('cancel')" class="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
      <button @click="handleSave" :disabled="!canSave" class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors shadow-sm shadow-blue-200">Save</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { mockVehicles } from '@/api/mockData'

const props = defineProps({
  item: {
    type: Object,
    default: null
  },
  taskType: {
    type: String,
    default: 'opportunity'
  },
  taskId: {
    type: Number,
    required: true
  },
  requestedCar: {
    type: Object,
    default: null
  },
  recommendedCars: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['save', 'cancel'])

const selectedCar = ref(null)
const selectedCarType = ref(null) // 'requested' or 'recommended'
const offerData = ref({
  brand: '',
  model: '',
  year: '',
  price: '',
  image: ''
})

onMounted(() => {
  if (props.item && props.item.data) {
    offerData.value = {
      brand: props.item.data.brand || '',
      model: props.item.data.model || '',
      year: props.item.data.year || '',
      price: props.item.data.price || '',
      image: props.item.data.image || ''
    }
  }
})

const selectCar = (car) => {
  selectedCar.value = car
  // Determine if it's the requested car or a recommended car
  // Compare by id if available, otherwise by brand, model, and year
  if (props.requestedCar) {
    const isRequested = (car.id && props.requestedCar.id && car.id === props.requestedCar.id) ||
      (car.brand === props.requestedCar.brand && 
       car.model === props.requestedCar.model && 
       car.year === props.requestedCar.year)
    selectedCarType.value = isRequested ? 'requested' : 'recommended'
  } else {
    selectedCarType.value = 'recommended'
  }
  offerData.value = {
    brand: car.brand || '',
    model: car.model || '',
    year: car.year || new Date().getFullYear(),
    price: car.price || '',
    image: car.image || ''
  }
}

const canSave = computed(() => {
  return selectedCar.value || (offerData.value.brand && offerData.value.model && offerData.value.price)
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const handleSave = () => {
  const data = selectedCar.value || offerData.value
  
  emit('save', {
    id: props.item?.id || Date.now(),
    type: 'offer',
    action: props.item ? 'updated an offer' : 'added an offer',
    data: {
      brand: data.brand,
      model: data.model,
      year: data.year || new Date().getFullYear(),
      price: data.price,
      image: data.image || '',
      isMainOffer: false
    },
    timestamp: props.item?.timestamp || new Date().toISOString(),
    isEdit: !!props.item
  })
}
</script>

