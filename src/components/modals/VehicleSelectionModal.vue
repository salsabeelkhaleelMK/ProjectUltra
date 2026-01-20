<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Select Vehicle</DialogTitle>
        </DialogHeader>

        <div class="space-y-6">
      <!-- Section 1: Recommended Vehicles (includes requested if available) -->
      <div v-if="allRecommendedVehicles.length">
        <h3 class="text-sm font-bold text-heading mb-3 flex items-center gap-2">
          <i class="fa-solid fa-sparkles text-purple-600"></i>
          Recommended Vehicles
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
          <VehicleCard
            v-for="vehicle in allRecommendedVehicles"
            :key="vehicle.id"
            :vehicle="vehicle"
            :badge="vehicle.isRequested ? 'Requested' : 'Recommended'"
            :stock-days="vehicle.stockDays"
            :selected="selectedVehicleId === vehicle.id"
            @select="handleSelectVehicle(vehicle, vehicle.isRequested ? 'requested' : 'recommended')"
          />
        </div>
      </div>
      
      <!-- Section 2: Browse Stock -->
      <div>
        <h3 class="text-sm font-bold text-heading mb-3 flex items-center gap-2">
          <i class="fa-solid fa-warehouse text-green-600"></i>
          Browse Stock
        </h3>
        
        <!-- Search Input -->
        <div class="mb-4">
          <div class="relative">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-sub text-sm"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by brand, model, year..."
              class="w-full bg-surface border border-E5E7EB rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
        
        <!-- Stock Vehicles Grid -->
        <div v-if="filteredStock.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
          <VehicleCard
            v-for="vehicle in filteredStock"
            :key="vehicle.id"
            :vehicle="vehicle"
            badge="In Stock"
            :stock-days="vehicle.stockDays"
            :selected="selectedVehicleId === vehicle.id"
            @select="handleSelectVehicle(vehicle, 'stock')"
          />
        </div>
        <div v-else class="text-center py-8 text-sub">
          <i class="fa-solid fa-search text-4xl text-gray-300 mb-3"></i>
          <p class="text-sm font-medium">No vehicles found matching your search</p>
          <p class="text-xs mt-1 text-sub">Try different keywords or clear the search</p>
        </div>
      </div>
      
      <!-- Section 3: Configure Custom -->
      <div>
        <h3 class="text-sm font-bold text-heading mb-3 flex items-center gap-2">
          <i class="fa-solid fa-wrench text-orange-600"></i>
          Configure Custom Vehicle
        </h3>
        <div class="border border-E5E7EB rounded-lg p-4 bg-surfaceSecondary">
          <p class="text-xs text-body mb-3">
            Build a custom configuration with specific options and features
          </p>
          <button
            @click="showConfigureForm = !showConfigureForm"
            class="bg-orange-600 hover:bg-orange-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <i class="fa-solid fa-cog mr-2"></i>
            {{ showConfigureForm ? 'Hide Configuration' : 'Build Custom Configuration' }}
          </button>
          
          <!-- Custom Configuration Form -->
          <div v-if="showConfigureForm" class="mt-4 space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label class="block text-xs font-medium text-body mb-1">Brand</label>
                <input
                  v-model="customVehicle.brand"
                  type="text"
                  class="input"
                  placeholder="e.g., Audi"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-body mb-1">Model</label>
                <input
                  v-model="customVehicle.model"
                  type="text"
                  class="input"
                  placeholder="e.g., e-tron GT"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-body mb-1">Year</label>
                <input
                  v-model="customVehicle.year"
                  type="number"
                  class="input"
                  placeholder="2024"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-body mb-1">Price (€)</label>
                <input
                  v-model="customVehicle.price"
                  type="number"
                  class="input"
                  placeholder="98000"
                />
              </div>
            </div>
            <div class="flex justify-end">
              <button
                @click="handleSelectCustom"
                :disabled="!isCustomVehicleValid"
                class="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
              >
                <i class="fa-solid fa-check mr-2"></i>
                Use Custom Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
        <DialogFooter class="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
          <Button
            label="Cancel"
            variant="outline"
            size="small"
            class="rounded-sm w-full sm:w-auto"
            @click="$emit('close')"
          />
          <Button
            v-if="selectedVehicle"
            label="Confirm Selection"
            variant="primary"
            size="small"
            class="rounded-sm w-full sm:w-auto !bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
            @click="handleConfirm"
          />
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Button } from '@motork/component-library'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle
} from '@motork/component-library/future/primitives'
import VehicleCard from '@/components/shared/vehicles/VehicleCard.vue'
import { fetchVehicles } from '@/api/vehicles'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  requestedVehicle: {
    type: Object,
    default: null
  },
  opportunityId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close', 'vehicle-selected'])

const handleOpenChange = (isOpen) => {
  if (!isOpen) {
    emit('close')
  }
}

// State
const searchQuery = ref('')
const showConfigureForm = ref(false)
const selectedVehicle = ref(null)
const selectedVehicleId = ref(null)
const selectedVehicleType = ref(null)
const vehicles = ref([])

// Custom vehicle configuration
const customVehicle = ref({
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  price: 0,
  stockDays: null,
  image: ''
})

// Load vehicles on mount
onMounted(async () => {
  try {
    const result = await fetchVehicles({})
    vehicles.value = result.data || []
  } catch (err) {
    console.error('Failed to load vehicles:', err)
    vehicles.value = []
  }
})

// Check if requested vehicle is in stock
const hasRequestedInStock = computed(() => {
  return props.requestedVehicle && 
         props.requestedVehicle.stockDays !== null && 
         props.requestedVehicle.stockDays !== undefined
})

// Get all recommended vehicles (includes requested vehicle if in stock)
const allRecommendedVehicles = computed(() => {
  const recommended = []
  
  // Only add requested vehicle if it exists AND is in stock
  if (props.requestedVehicle && hasRequestedInStock.value) {
    recommended.push({
      ...props.requestedVehicle,
      isRequested: true
    })
  }
  
  // Add other recommended vehicles
  if (vehicles.value && vehicles.value.length > 0) {
    const alternatives = vehicles.value.filter(v => {
      // If no requested vehicle, show all
      if (!props.requestedVehicle) return true
      // Otherwise exclude the requested vehicle from alternatives
      return v.brand !== props.requestedVehicle.brand || v.model !== props.requestedVehicle.model
    })
    
    // Add first 3 alternatives if requested vehicle is shown, otherwise 4
    const limit = (props.requestedVehicle && hasRequestedInStock.value) ? 3 : 4
    recommended.push(...alternatives.slice(0, limit))
  }
  
  return recommended
})

// Filter stock vehicles based on search
const filteredStock = computed(() => {
  if (!vehicles.value || vehicles.value.length === 0) return []
  
  let filtered = [...vehicles.value]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(v => 
      v.brand.toLowerCase().includes(query) ||
      v.model.toLowerCase().includes(query) ||
      v.year.toString().includes(query)
    )
  }
  
  return filtered
})

// Validate custom vehicle
const isCustomVehicleValid = computed(() => {
  return customVehicle.value.brand &&
         customVehicle.value.model &&
         customVehicle.value.year &&
         customVehicle.value.price > 0
})

// Handle vehicle selection
const handleSelectVehicle = (vehicle, type) => {
  selectedVehicle.value = vehicle
  selectedVehicleId.value = vehicle.id || `custom-${Date.now()}`
  selectedVehicleType.value = type
}

// Handle custom vehicle selection
const handleSelectCustom = () => {
  if (!isCustomVehicleValid.value) return
  
  const vehicle = {
    ...customVehicle.value,
    id: `custom-${Date.now()}`,
    isCustom: true
  }
  
  handleSelectVehicle(vehicle, 'custom')
}

// Format price helper
const formatPrice = (price) => {
  if (!price) return '0'
  return price.toLocaleString('en-US')
}

// Confirm and emit selection
const handleConfirm = () => {
  if (selectedVehicle.value) {
    emit('vehicle-selected', {
      vehicle: selectedVehicle.value,
      type: selectedVehicleType.value
    })
    emit('close')
    
    // Reset state
    selectedVehicle.value = null
    selectedVehicleId.value = null
    selectedVehicleType.value = null
    searchQuery.value = ''
    showConfigureForm.value = false
    customVehicle.value = {
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      stockDays: null,
      image: ''
    }
  }
}
</script>

