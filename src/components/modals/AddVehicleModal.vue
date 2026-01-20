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

          <!-- Version/Trim (for trade-ins) -->
          <div v-if="isTradeIn">
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

          <!-- Owner Information (only for drove/requested vehicles, not trade-ins) -->
          <template v-if="mode === 'vehicle' && selectedVehicleType !== 'tradein'">
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

          <!-- Valuation Card (collapsed, only for trade-in mode) -->
          <div v-if="isTradeIn" class="border border-E5E7EB rounded-card bg-surfaceSecondary">
            <button
              type="button"
              @click="showValuation = !showValuation"
              class="w-full flex items-center justify-between p-4 text-left hover:bg-surface transition-colors"
            >
              <h3 class="text-fluid-sm font-medium text-heading">Valuation Information</h3>
              <i 
                :class="[
                  'fa-solid transition-transform duration-200 text-sub',
                  showValuation ? 'fa-chevron-up' : 'fa-chevron-down'
                ]"
              ></i>
            </button>
            
            <div v-if="showValuation" class="px-4 pb-4 space-y-4 border-t border-E5E7EB pt-4">
              <!-- Trade-In Price -->
              <div>
                <label class="block label-upper mb-2">Trade-In Price (€)</label>
                <input 
                  v-model.number="valuationData.tradeInPrice"
                  type="number" 
                  placeholder="0.00" 
                  class="input"
                  min="0"
                  step="0.01"
                >
              </div>

              <!-- Evaluation Range -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block label-upper mb-2">Evaluation Range - Low (€)</label>
                  <input 
                    v-model.number="valuationData.evaluationRangeLow"
                    type="number" 
                    placeholder="0.00" 
                    class="input"
                    min="0"
                    step="0.01"
                  >
                </div>
                <div>
                  <label class="block label-upper mb-2">Evaluation Range - High (€)</label>
                  <input 
                    v-model.number="valuationData.evaluationRangeHigh"
                    type="number" 
                    placeholder="0.00" 
                    class="input"
                    min="0"
                    step="0.01"
                  >
                </div>
              </div>

              <!-- Provider and Evaluation Date -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block label-upper mb-2">Provider</label>
                  <select v-model="valuationData.provider" class="input">
                    <option value="">Select provider...</option>
                    <option value="Eurotax">Eurotax</option>
                    <option value="Infocar">Infocar</option>
                    <option value="Manual">Manual</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label class="block label-upper mb-2">Evaluation Date</label>
                  <input 
                    v-model="valuationData.evaluationDate"
                    type="date" 
                    class="input"
                  >
                </div>
              </div>

              <!-- Optional Advanced Fields -->
              <div class="pt-2 border-t border-E5E7EB">
                <h4 class="text-fluid-xs font-medium text-heading mb-3">Optional Advanced Fields</h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block label-upper mb-2">Price to Buy (€)</label>
                    <input 
                      v-model.number="valuationData.priceToBuy"
                      type="number" 
                      placeholder="0.00" 
                      class="input"
                      min="0"
                      step="0.01"
                    >
                  </div>
                  <div>
                    <label class="block label-upper mb-2">Price to Sell (€)</label>
                    <input 
                      v-model.number="valuationData.priceToSell"
                      type="number" 
                      placeholder="0.00" 
                      class="input"
                      min="0"
                      step="0.01"
                    >
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label class="block label-upper mb-2">Price of Vehicle (€)</label>
                    <input 
                      v-model.number="valuationData.priceOfVehicle"
                      type="number" 
                      placeholder="0.00" 
                      class="input"
                      min="0"
                      step="0.01"
                    >
                  </div>
                  <div>
                    <label class="block label-upper mb-2">Price of Optionals (€)</label>
                    <input 
                      v-model.number="valuationData.priceOfOptionals"
                      type="number" 
                      placeholder="0.00" 
                      class="input"
                      min="0"
                      step="0.01"
                    >
                  </div>
                </div>

                <div class="mt-4">
                  <label class="block label-upper mb-2">List of Optionals</label>
                  <textarea 
                    v-model="valuationData.listOfOptionals"
                    rows="3"
                    placeholder="List of equipment/features..." 
                    class="input"
                  ></textarea>
                </div>
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

const selectedVehicleType = ref(null) // 'drove', 'requested', 'tradein', or null
const showValuation = ref(false)

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
  stockDays: null
})

const valuationData = ref({
  tradeInPrice: null,
  evaluationRangeLow: null,
  evaluationRangeHigh: null,
  provider: '',
  evaluationDate: '',
  priceToBuy: null,
  priceToSell: null,
  priceOfVehicle: null,
  priceOfOptionals: null,
  listOfOptionals: ''
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
        stockDays: null
      }

      // Load valuation data if exists
      if (props.item.data.tradeInPrice !== undefined) {
        valuationData.value = {
          tradeInPrice: props.item.data.tradeInPrice || null,
          evaluationRangeLow: props.item.data.evaluationRangeLow || null,
          evaluationRangeHigh: props.item.data.evaluationRangeHigh || null,
          provider: props.item.data.provider || '',
          evaluationDate: props.item.data.evaluationDate || '',
          priceToBuy: props.item.data.priceToBuy || null,
          priceToSell: props.item.data.priceToSell || null,
          priceOfVehicle: props.item.data.priceOfVehicle || null,
          priceOfOptionals: props.item.data.priceOfOptionals || null,
          listOfOptionals: props.item.data.listOfOptionals || ''
        }
        showValuation.value = true
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
      stockDays: null
    }
    valuationData.value = {
      tradeInPrice: null,
      evaluationRangeLow: null,
      evaluationRangeHigh: null,
      provider: '',
      evaluationDate: '',
      priceToBuy: null,
      priceToSell: null,
      priceOfVehicle: null,
      priceOfOptionals: null,
      listOfOptionals: ''
    }
    showValuation.value = false
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
      stockDays: null,
      status: 'Available'
    }
  }

  // Add vehicle type if selected
  if (selectedVehicleType.value) {
    data.vehicleType = selectedVehicleType.value
  }

  // Add valuation data for trade-ins
  if (isTradeIn.value) {
    data.valuation = {
      tradeInPrice: valuationData.value.tradeInPrice,
      evaluationRangeLow: valuationData.value.evaluationRangeLow,
      evaluationRangeHigh: valuationData.value.evaluationRangeHigh,
      provider: valuationData.value.provider || null,
      evaluationDate: valuationData.value.evaluationDate || null,
      priceToBuy: valuationData.value.priceToBuy,
      priceToSell: valuationData.value.priceToSell,
      priceOfVehicle: valuationData.value.priceOfVehicle,
      priceOfOptionals: valuationData.value.priceOfOptionals,
      listOfOptionals: valuationData.value.listOfOptionals || null
    }
  }

  if (props.item) {
    data.id = props.item.id
    data.isEdit = true
    data.timestamp = props.item.timestamp || new Date().toISOString()
  }

  emit('save', data)
}
</script>
