<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Vehicle</DialogTitle>
        </DialogHeader>

        <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Vehicle Type -->
      <div>
        <label class="block label-upper mb-2">Vehicle Type *</label>
        <select v-model="formData.type" class="input" required>
          <option value="">Select vehicle type...</option>
          <option value="owned">Owned</option>
          <option value="requested">Requested</option>
          <option value="purchased">Purchased</option>
          <option value="offered">Offered</option>
          <option value="drove">Drove</option>
        </select>
      </div>

      <!-- Brand -->
      <div>
        <label class="block label-upper mb-2">Brand *</label>
        <input 
          v-model="formData.brand"
          type="text" 
          required
          placeholder="e.g., BMW, Mercedes-Benz, Audi" 
          class="input"
        />
      </div>
      
      <!-- Model -->
      <div>
        <label class="block label-upper mb-2">Model *</label>
        <input 
          v-model="formData.model"
          type="text" 
          required
          placeholder="e.g., 3 Series, C-Class, A4" 
          class="input"
        />
      </div>
      
      <!-- Year -->
      <div>
        <label class="block label-upper mb-2">Year *</label>
        <input 
          v-model.number="formData.year"
          type="number" 
          required
          min="1900"
          :max="new Date().getFullYear() + 1"
          placeholder="e.g., 2024" 
          class="input"
        />
      </div>
      
      <!-- Price (Optional) -->
      <div>
        <label class="block label-upper mb-2">Price (Optional)</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sub">€</span>
          <input 
            v-model.number="formData.price"
            type="number" 
            min="0"
            step="1000"
            placeholder="45000" 
            class="input pl-8"
          />
        </div>
      </div>
      
      <!-- Request Type (only for requested type) -->
      <div v-if="formData.type === 'requested'">
        <label class="block label-upper mb-2">Request Type</label>
        <select v-model="formData.requestType" class="input">
          <option value="Quotation">Quotation</option>
          <option value="Test Drive">Test Drive</option>
          <option value="Generic Sales">Generic Sales</option>
        </select>
      </div>
      
      <!-- Request Message (optional, for requested type) -->
      <div v-if="formData.type === 'requested'">
        <label class="block label-upper mb-2">Request Message (Optional)</label>
        <textarea 
          v-model="formData.requestMessage"
          rows="4"
          placeholder="Customer's message or notes about the vehicle request..."
          class="input resize-none"
        ></textarea>
      </div>
      
      <!-- Image URL (Optional) -->
      <div>
        <label class="block label-upper mb-2">Image URL (Optional)</label>
        <input 
          v-model="formData.image"
          type="url" 
          placeholder="https://example.com/car-image.jpg" 
          class="input"
        />
        <p class="text-xs text-sub mt-1">Enter a URL to an image of the vehicle</p>
      </div>
      
      <!-- Additional Details (Collapsed by default) -->
      <div class="border-t border pt-4">
        <button 
          type="button"
          @click="showAdvanced = !showAdvanced"
          class="flex items-center gap-2 text-sm font-medium text-body hover:text-heading transition-colors"
        >
          <i class="fa-solid" :class="showAdvanced ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
          Advanced Details (Optional)
        </button>
        
        <div v-if="showAdvanced" class="mt-4 space-y-4">
          <!-- Dealership -->
          <div>
            <label class="block label-upper mb-2">Dealership</label>
            <input 
              v-model="formData.dealership"
              type="text" 
              placeholder="e.g., Milano, Berlin" 
              class="input"
            />
          </div>
          
          <!-- Fuel Type -->
          <div>
            <label class="block label-upper mb-2">Fuel Type</label>
            <select v-model="formData.fuelType" class="input">
              <option value="">Select fuel type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Plug-in Hybrid">Plug-in Hybrid</option>
            </select>
          </div>
          
          <!-- Gear Type -->
          <div>
            <label class="block label-upper mb-2">Gear Type</label>
            <select v-model="formData.gearType" class="input">
              <option value="">Select gear type</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
              <option value="CVT">CVT</option>
            </select>
          </div>
          
          <!-- Kilometers -->
          <div>
            <label class="block label-upper mb-2">Kilometers</label>
            <input 
              v-model.number="formData.kilometers"
              type="number" 
              min="0"
              placeholder="e.g., 50000" 
              class="input"
            />
          </div>
        </div>
      </div>
        </form>

        <DialogFooter class="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
          <Button
            label="Cancel"
            variant="outline"
            size="small"
            class="rounded-sm w-full sm:w-auto"
            @click="$emit('close')"
          />
          <Button
            label="Add Vehicle"
            variant="primary"
            size="small"
            class="rounded-sm w-full sm:w-auto !bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
            :disabled="!isValid"
            @click="handleSubmit"
          />
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
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

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  lead: {
    type: Object,
    default: null
  },
  customerId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close', 'saved'])

const handleOpenChange = (isOpen) => {
  if (!isOpen) {
    emit('close')
  }
}

const showAdvanced = ref(false)

const formData = ref({
  type: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  price: null,
  requestType: 'Quotation',
  requestMessage: '',
  image: '',
  dealership: '',
  fuelType: '',
  gearType: '',
  kilometers: null
})

// Reset form when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    // Reset form for new vehicle
    formData.value = {
      type: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      price: null,
      requestType: 'Quotation',
      requestMessage: '',
      image: '',
      dealership: '',
      fuelType: '',
      gearType: '',
      kilometers: null
    }
    showAdvanced.value = false
  }
})

const isValid = computed(() => {
  return formData.value.type &&
         formData.value.brand.trim() && 
         formData.value.model.trim() && 
         formData.value.year > 1900
})

const handleSubmit = () => {
  if (!isValid.value) return
  
  // Clean up the data (remove empty optional fields)
  const vehicleData = {
    type: formData.value.type,
    brand: formData.value.brand.trim(),
    model: formData.value.model.trim(),
    year: formData.value.year
  }
  
  // Add optional fields only if they have values
  if (formData.value.price) vehicleData.price = formData.value.price
  if (formData.value.image) vehicleData.image = formData.value.image.trim()
  if (formData.value.dealership) vehicleData.dealership = formData.value.dealership.trim()
  if (formData.value.fuelType) vehicleData.fuelType = formData.value.fuelType
  if (formData.value.gearType) vehicleData.gearType = formData.value.gearType
  if (formData.value.kilometers !== null) vehicleData.kilometers = formData.value.kilometers
  
  // Add request-specific fields only for requested type
  if (formData.value.type === 'requested') {
    vehicleData.requestType = formData.value.requestType
    if (formData.value.requestMessage) vehicleData.requestMessage = formData.value.requestMessage.trim()
  }
  
  emit('saved', vehicleData)
}
</script>
