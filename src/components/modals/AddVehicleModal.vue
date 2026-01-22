<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{{ getTitle() }}</DialogTitle>
          <DialogDescription>
            {{ getDescription() }}
          </DialogDescription>
        </DialogHeader>

        <!-- Vehicle Type Selection (only when mode is 'vehicle' and no item is being edited) -->
        <!-- Skip selection screen when mode is 'tradein' - go directly to form -->
        <div v-if="mode === 'vehicle' && !item && !selectedVehicleType" class="space-y-4 py-4">
          <p class="text-body text-sm mb-4">Select the type of vehicle you want to add:</p>
          <div class="grid grid-cols-1 gap-3">
            <Button
              label="Drove"
              variant="outline"
              size="small"
              class="w-full justify-start !border-D1D5DB !text-heading hover:!bg-surfaceSecondary"
              @click="selectedVehicleType = 'drove'"
            />
            <Button
              label="Requested"
              variant="outline"
              size="small"
              class="w-full justify-start !border-D1D5DB !text-heading hover:!bg-surfaceSecondary"
              @click="selectedVehicleType = 'requested'"
            />
            <Button
              label="Trade-In"
              variant="outline"
              size="small"
              class="w-full justify-start !border-D1D5DB !text-heading hover:!bg-surfaceSecondary"
              @click="selectedVehicleType = 'tradein'"
            />
          </div>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Trade-In Fields (simplified) -->
          <template v-if="isTradeIn">
            <!-- Brand and Model in same row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block label-upper mb-2">Brand *</label>
                <input 
                  v-model="vehicleData.brand"
                  type="text" 
                  placeholder="e.g., Volkswagen" 
                  class="input"
                  required
                >
              </div>
              <div>
                <label class="block label-upper mb-2">Model *</label>
                <input 
                  v-model="vehicleData.model"
                  type="text" 
                  placeholder="e.g., ID.4" 
                  class="input"
                  required
                >
              </div>
            </div>

            <!-- Year and Kilometers in same row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block label-upper mb-2">Year (or registration year) *</label>
                <input 
                  v-model="vehicleData.year"
                  type="number" 
                  placeholder="e.g., 2024" 
                  class="input"
                  min="1900"
                  :max="new Date().getFullYear() + 1"
                  required
                >
              </div>
              <div>
                <label class="block label-upper mb-2">Kilometers</label>
                <input 
                  v-model.number="vehicleData.kilometers"
                  type="number" 
                  placeholder="0" 
                  class="input"
                  min="0"
                >
              </div>
            </div>

            <!-- Fuel Type and Gear Type in same row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block label-upper mb-2">Fuel Type</label>
                <select v-model="vehicleData.fuelType" class="input">
                  <option value="">Select fuel type...</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                </select>
              </div>
              <div>
                <label class="block label-upper mb-2">Gear Type</label>
                <select v-model="vehicleData.gearType" class="input">
                  <option value="">Select gear type...</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                  <option value="CVT">CVT</option>
                </select>
              </div>
            </div>

            <!-- Plates -->
            <div>
              <label class="block label-upper mb-2">Plates</label>
              <input 
                v-model="vehicleData.plates"
                type="text" 
                placeholder="License plate number" 
                class="input"
              >
              <p class="text-xs text-sub mt-1">These can be relevant for automatically retrieving other information.</p>
            </div>

            <!-- Note field -->
            <div>
              <label class="block label-upper mb-2">Note</label>
              <textarea 
                v-model="vehicleData.note"
                rows="4"
                placeholder="Add unquantifiable requests, such as the customer's desired value for the car..." 
                class="input resize-none"
              ></textarea>
            </div>
          </template>

          <!-- Regular Vehicle Fields (for non-trade-in mode) -->
          <template v-else>
            <!-- Vehicle Information -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block label-upper mb-2">Brand</label>
                <input 
                  v-model="vehicleData.brand"
                  type="text" 
                  placeholder="e.g., Volkswagen" 
                  class="input"
                  required
                >
              </div>
              <div>
                <label class="block label-upper mb-2">Model</label>
                <input 
                  v-model="vehicleData.model"
                  type="text" 
                  placeholder="e.g., ID.4" 
                  class="input"
                  required
                >
              </div>
              <div>
                <label class="block label-upper mb-2">Year</label>
                <input 
                  v-model="vehicleData.year"
                  type="number" 
                  placeholder="e.g., 2024" 
                  class="input"
                  min="1900"
                  :max="new Date().getFullYear() + 1"
                  required
                >
              </div>
            </div>

            <!-- Version/Trim -->
            <div>
              <label class="block label-upper mb-2">Version/Trim</label>
              <input 
                v-model="vehicleData.version"
                type="text" 
                placeholder="e.g., Premium Plus" 
                class="input"
              >
            </div>

            <!-- Identification -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block label-upper mb-2">VIN</label>
                <input 
                  v-model="vehicleData.vin"
                  type="text" 
                  placeholder="Vehicle Identification Number" 
                  class="input"
                >
              </div>
              <div>
                <label class="block label-upper mb-2">Plates</label>
                <input 
                  v-model="vehicleData.plates"
                  type="text" 
                  placeholder="License plate number" 
                  class="input"
                >
              </div>
            </div>

            <!-- Vehicle Details -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block label-upper mb-2">Fuel Type</label>
                <select v-model="vehicleData.fuelType" class="input">
                  <option value="">Select fuel type...</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                </select>
              </div>
              <div>
                <label class="block label-upper mb-2">Gear Type</label>
                <select v-model="vehicleData.gearType" class="input">
                  <option value="">Select gear type...</option>
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                  <option value="CVT">CVT</option>
                </select>
              </div>
              <div>
                <label class="block label-upper mb-2">Mileage (km)</label>
                <input 
                  v-model.number="vehicleData.kilometers"
                  type="number" 
                  placeholder="0" 
                  class="input"
                  min="0"
                >
              </div>
            </div>

            <!-- Registration -->
            <div>
              <label class="block label-upper mb-2">Registration Year/Month</label>
              <input 
                v-model="vehicleData.registration"
                type="text" 
                placeholder="MM/YYYY (e.g., 01/2024)" 
                class="input"
              >
            </div>

            <!-- Owner Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block label-upper mb-2">Owned Since</label>
                <input 
                  v-model="vehicleData.ownedSince"
                  type="text" 
                  placeholder="MM/YYYY (e.g., 01/2024)" 
                  class="input"
                >
              </div>
              <div>
                <label class="block label-upper mb-2">Owner</label>
                <input 
                  v-model="vehicleData.owner"
                  type="text" 
                  placeholder="Owner name" 
                  class="input"
                >
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block label-upper mb-2">Ownership Type</label>
                <select v-model="vehicleData.ownershipType" class="input">
                  <option value="">Select ownership type...</option>
                  <option value="Private">Private</option>
                  <option value="Company">Company</option>
                  <option value="Lease">Lease</option>
                  <option value="Fleet">Fleet</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block label-upper mb-2">Warranty Info</label>
              <textarea 
                v-model="vehicleData.warrantyInfo"
                rows="3"
                placeholder="Warranty information..." 
                class="input"
              ></textarea>
            </div>
          </template>
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
            :label="isTradeIn ? 'Save Trade-In' : 'Add Vehicle'"
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
import { ref, computed, onMounted, watch } from 'vue'
import { Button } from '@motork/component-library'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle
} from '@motork/component-library/future/primitives'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  mode: {
    type: String,
    default: 'vehicle', // 'vehicle' or 'tradein'
    validator: (value) => ['vehicle', 'tradein'].includes(value)
  },
  item: {
    type: Object,
    default: null
  },
  taskType: {
    type: String,
    default: 'lead'
  },
  taskId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

// Auto-set to 'tradein' when mode is 'tradein', otherwise null
const selectedVehicleType = ref(props.mode === 'tradein' ? 'tradein' : null) // 'drove', 'requested', 'tradein', or null

// Watch for mode changes to auto-set vehicle type
watch(() => props.mode, (newMode) => {
  if (newMode === 'tradein') {
    selectedVehicleType.value = 'tradein'
  } else if (!props.item) {
    selectedVehicleType.value = null
  }
})

// Computed to determine if we're in trade-in mode
const isTradeIn = computed(() => {
  return props.mode === 'tradein' || selectedVehicleType.value === 'tradein'
})

// Get modal title based on context
const getTitle = () => {
  if (props.mode === 'tradein') return 'Add Trade-In Vehicle'
  if (selectedVehicleType.value === 'tradein') return 'Add Trade-In Vehicle'
  if (selectedVehicleType.value === 'drove') return 'Add Drove Vehicle'
  if (selectedVehicleType.value === 'requested') return 'Add Requested Vehicle'
  return 'Add Vehicle'
}

// Get modal description based on context
const getDescription = () => {
  if (props.mode === 'tradein' || selectedVehicleType.value === 'tradein') {
    return 'Record details of the customer\'s trade-in vehicle'
  }
  if (selectedVehicleType.value === 'drove') {
    return 'Record details of a vehicle the customer drove'
  }
  if (selectedVehicleType.value === 'requested') {
    return 'Record details of a vehicle the customer requested'
  }
  return 'Fill in the details for the new vehicle'
}

const vehicleData = ref({
  brand: '',
  model: '',
  year: '',
  version: '',
  vin: '',
  plates: '',
  fuelType: '',
  gearType: '',
  kilometers: '',
  registration: '',
  owner: '',
  ownershipType: '',
  ownedSince: '',
  warrantyInfo: '',
  note: '',
  stockDays: null
})


// Load existing item data if editing
onMounted(() => {
  if (props.item) {
    if (props.item.data) {
      // Load vehicle data from activity
      vehicleData.value = {
        brand: props.item.data.brand || '',
        model: props.item.data.model || '',
        year: props.item.data.year || '',
        version: props.item.data.version || '',
        vin: props.item.data.vin || '',
        plates: props.item.data.plate || props.item.data.plates || '',
        fuelType: props.item.data.fuelType || '',
        gearType: props.item.data.gearType || '',
        kilometers: props.item.data.km || props.item.data.kilometers || '',
        registration: props.item.data.date || props.item.data.registration || '',
        owner: props.item.data.owner || '',
        ownershipType: props.item.data.ownershipType || '',
        ownedSince: props.item.data.ownedSince || '',
        warrantyInfo: props.item.data.warrantyInfo || '',
        note: props.item.data.note || '',
        stockDays: null
      }

    }
  }
})

// Reset form when modal closes
watch(() => props.show, (isOpen) => {
  if (!isOpen) {
    selectedVehicleType.value = null
    vehicleData.value = {
      brand: '',
      model: '',
      year: '',
      version: '',
      vin: '',
      plates: '',
      fuelType: '',
      gearType: '',
      kilometers: '',
      registration: '',
      owner: '',
      ownershipType: '',
      ownedSince: '',
      warrantyInfo: '',
      note: '',
      stockDays: null
    }
  }
})

const isValid = computed(() => {
  return !!vehicleData.value.brand && !!vehicleData.value.model && !!vehicleData.value.year
})

const handleOpenChange = (isOpen) => {
  if (!isOpen) {
    emit('close')
  }
}

const handleSubmit = () => {
  if (!isValid.value) return

  const data = {
    vehicle: {
      brand: vehicleData.value.brand,
      model: vehicleData.value.model,
      year: parseInt(vehicleData.value.year) || null,
      version: vehicleData.value.version || null,
      vin: vehicleData.value.vin || null,
      plates: vehicleData.value.plates || null,
      fuelType: vehicleData.value.fuelType || null,
      gearType: vehicleData.value.gearType || null,
      kilometers: parseInt(vehicleData.value.kilometers) || 0,
      registration: vehicleData.value.registration || null,
      owner: vehicleData.value.owner || null,
      ownershipType: vehicleData.value.ownershipType || null,
      ownedSince: vehicleData.value.ownedSince || null,
      warrantyInfo: vehicleData.value.warrantyInfo || null,
      note: vehicleData.value.note || null,
      stockDays: null,
      status: 'Available'
    }
  }

  // Add vehicle type if selected
  if (selectedVehicleType.value) {
    data.vehicleType = selectedVehicleType.value
  }

  // For trade-ins, note is stored in vehicle data (no separate valuation section)

  if (props.item) {
    data.id = props.item.id
    data.isEdit = true
    data.timestamp = props.item.timestamp || new Date().toISOString()
  }

  emit('save', data)
}
</script>
