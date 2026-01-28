<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-lg max-h-[calc(100vh-4rem)] flex flex-col">
        <DialogHeader class="flex-shrink-0">
          <DialogTitle>{{ getTitle() }}</DialogTitle>
        </DialogHeader>

        <div class="flex-1 overflow-y-auto py-4 w-full">
          <!-- Vehicle Type Selection (only when mode is 'vehicle' and no item is being edited) -->
          <!-- Skip selection screen when mode is 'tradein' - go directly to form -->
          <div v-if="mode === 'vehicle' && !item && !selectedVehicleType" class="space-y-4 py-4 w-full">
          <p class="text-muted-foreground text-sm mb-4">Select the type of vehicle you want to add:</p>
          <div class="grid grid-cols-1 gap-3">
            <Button
              label="Drove"
              variant="outline"
              size="small"
              class="w-full justify-start"
              @click="selectedVehicleType = 'drove'"
            />
            <Button
              label="Requested"
              variant="outline"
              size="small"
              class="w-full justify-start"
              @click="selectedVehicleType = 'requested'"
            />
            <Button
              label="Trade-In"
              variant="outline"
              size="small"
              class="w-full justify-start"
              @click="selectedVehicleType = 'tradein'"
            />
          </div>
          </div>

          <div v-else class="space-y-6 w-full">
          <!-- Trade-In Fields (simplified) -->
          <template v-if="isTradeIn">
            <!-- Brand and Model in same row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label class="block text-sm font-medium text-foreground">Brand <span class="text-muted-foreground">*</span></Label>
                <Input 
                  v-model="vehicleData.brand"
                  type="text" 
                  placeholder="e.g., Volkswagen" 
                  class="w-full"
                  required
                />
              </div>
              <div class="space-y-2">
                <Label class="block text-sm font-medium text-foreground">Model <span class="text-muted-foreground">*</span></Label>
                <Input 
                  v-model="vehicleData.model"
                  type="text" 
                  placeholder="e.g., ID.4" 
                  class="w-full"
                  required
                />
              </div>
            </div>

            <!-- Year and Kilometers in same row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label class="block text-sm font-medium text-foreground">Year (or registration year) <span class="text-muted-foreground">*</span></Label>
                <Input 
                  v-model="vehicleData.year"
                  type="number" 
                  placeholder="e.g., 2024" 
                  class="w-full"
                  min="1900"
                  :max="new Date().getFullYear() + 1"
                  required
                />
              </div>
              <div class="space-y-2">
                <Label class="block text-sm font-medium text-foreground">Kilometers</Label>
                <Input 
                  v-model.number="vehicleData.kilometers"
                  type="number" 
                  placeholder="0" 
                  class="w-full"
                  min="0"
                />
              </div>
            </div>

            <!-- Valuation (€) -->
            <div class="space-y-2">
              <Label class="block text-sm font-medium text-foreground">Valuation (€)</Label>
              <Input 
                v-model.number="vehicleData.valuation"
                type="number"
                placeholder="0"
                class="w-full"
                min="0"
                step="1"
              />
            </div>

            <!-- Fuel Type and Gear Type in same row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label class="block text-sm font-medium text-foreground">Fuel Type</Label>
                <Select v-model="vehicleData.fuelType">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select fuel type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-2">
                <Label class="block text-sm font-medium text-foreground">Gear Type</Label>
                <Select v-model="vehicleData.gearType">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select gear type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="CVT">CVT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <!-- Plates -->
            <div class="space-y-2">
              <Label class="block text-sm font-medium text-foreground">Plates</Label>
              <Input 
                v-model="vehicleData.plates"
                type="text" 
                placeholder="License plate number" 
                class="w-full"
              />
              <p class="text-xs text-muted-foreground mt-1">These can be relevant for automatically retrieving other information.</p>
            </div>

            <!-- Note field -->
            <div class="space-y-2">
              <Label class="block text-sm font-medium text-foreground">Note</Label>
              <Textarea 
                v-model="vehicleData.note"
                rows="3"
                placeholder="Add unquantifiable requests, such as the customer's desired value for the car..." 
                class="w-full resize-none"
              />
            </div>
          </template>

          <!-- Regular Vehicle Fields (for non-trade-in mode) -->
          <template v-else>
            <!-- Vehicle Information -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <Label class="block text-sm font-semibold text-foreground">Brand</Label>
                <Input 
                  v-model="vehicleData.brand"
                  type="text" 
                  placeholder="e.g., Volkswagen" 
                  class="w-full h-10"
                  required
                />
              </div>
              <div class="space-y-2">
                <Label class="block text-sm font-semibold text-foreground">Model</Label>
                <Input 
                  v-model="vehicleData.model"
                  type="text" 
                  placeholder="e.g., ID.4" 
                  class="w-full h-10"
                  required
                />
              </div>
              <div class="space-y-2">
                <Label class="block text-sm font-semibold text-foreground">Year</Label>
                <Input 
                  v-model="vehicleData.year"
                  type="number" 
                  placeholder="e.g., 2024" 
                  class="w-full h-10"
                  min="1900"
                  :max="new Date().getFullYear() + 1"
                  required
                />
              </div>
            </div>

            <!-- Version/Trim -->
            <div class="space-y-2">
              <Label class="block text-sm font-semibold text-foreground">Version/Trim</Label>
              <Input 
                v-model="vehicleData.version"
                type="text" 
                placeholder="e.g., Premium Plus" 
                class="w-full h-10"
              />
            </div>

            <!-- Identification -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label class="block text-sm font-semibold text-foreground">VIN</Label>
                <Input 
                  v-model="vehicleData.vin"
                  type="text" 
                  placeholder="Vehicle Identification Number" 
                  class="w-full h-10"
                />
              </div>
              <div class="space-y-2">
                <Label class="block text-sm font-semibold text-foreground">Plates</Label>
                <Input 
                  v-model="vehicleData.plates"
                  type="text" 
                  placeholder="License plate number" 
                  class="w-full h-10"
                />
              </div>
            </div>

            <!-- Vehicle Details -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <Label class="block text-sm font-semibold text-foreground">Fuel Type</Label>
                <Select v-model="vehicleData.fuelType">
                  <SelectTrigger class="w-full h-10">
                    <SelectValue placeholder="Select fuel type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-2">
                <Label class="block text-sm font-semibold text-foreground">Gear Type</Label>
                <Select v-model="vehicleData.gearType">
                  <SelectTrigger class="w-full h-10">
                    <SelectValue placeholder="Select gear type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="CVT">CVT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="space-y-2">
                <Label class="block text-sm font-semibold text-foreground">Mileage (km)</Label>
                <Input 
                  v-model.number="vehicleData.kilometers"
                  type="number" 
                  placeholder="0" 
                  class="w-full h-10"
                  min="0"
                />
              </div>
            </div>

            <!-- Registration -->
            <div class="space-y-2">
              <Label class="block text-sm font-semibold text-foreground">Registration Year/Month</Label>
              <Input 
                v-model="vehicleData.registration"
                type="text" 
                placeholder="MM/YYYY (e.g., 01/2024)" 
                class="w-full h-10"
              />
            </div>

            <!-- Owner Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label class="block text-sm font-semibold text-foreground">Owned Since</Label>
                <Input 
                  v-model="vehicleData.ownedSince"
                  type="text" 
                  placeholder="MM/YYYY (e.g., 01/2024)" 
                  class="w-full h-10"
                />
              </div>
              <div class="space-y-2">
                <Label class="block text-sm font-semibold text-foreground">Owner</Label>
                <Input 
                  v-model="vehicleData.owner"
                  type="text" 
                  placeholder="Owner name" 
                  class="w-full h-10"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label class="block text-sm font-semibold text-foreground">Ownership Type</Label>
                <Select v-model="vehicleData.ownershipType">
                  <SelectTrigger class="w-full h-10">
                    <SelectValue placeholder="Select ownership type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Private">Private</SelectItem>
                    <SelectItem value="Company">Company</SelectItem>
                    <SelectItem value="Lease">Lease</SelectItem>
                    <SelectItem value="Fleet">Fleet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div class="space-y-2">
              <Label class="block text-sm font-semibold text-foreground">Warranty Info</Label>
              <Textarea 
                v-model="vehicleData.warrantyInfo"
                rows="4"
                placeholder="Warranty information..." 
                class="w-full min-h-[100px] resize-none"
              />
            </div>
          </template>
          </div>
        </div>

        <DialogFooter class="flex-shrink-0 flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
          <Button
            label="Cancel"
            variant="outline"
            size="small"
            @click="$emit('close')"
          />
          <Button
            :label="isTradeIn ? 'Save Trade-In' : 'Add Vehicle'"
            variant="default"
            size="small"
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
import { 
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@motork/component-library/future/primitives'
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
  stockDays: null,
  valuation: null
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
        stockDays: null,
        valuation: props.item.data.tradeInPrice ?? null
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
      stockDays: null,
      valuation: null
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

  if (selectedVehicleType.value) {
    data.vehicleType = selectedVehicleType.value
  }

  if (isTradeIn.value) {
    const v = vehicleData.value.valuation
    data.valuation = {
      tradeInPrice: v != null && v !== '' ? Number(v) : null
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
