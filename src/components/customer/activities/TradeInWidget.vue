<template>
  <div 
    class="animate-fade-in relative"
    :class="{ 'bg-surface border border-E5E7EB rounded-xl p-5 shadow-sm mb-6': !hideHeader }"
  >
    <div v-if="!hideHeader" class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-surface border-t border-l border-E5E7EB rotate-45"></div>
    <div v-if="!hideHeader" class="flex justify-between items-center mb-4">
      <h5 class="text-fluid-sm font-semibold text-heading">{{ item ? 'Edit Trade-In' : 'Add Trade-In' }}</h5>
      <button @click="$emit('cancel')" class="text-sub hover:text-body"><i class="fa-solid fa-xmark"></i></button>
    </div>

    <form @submit.prevent="handleSave" class="space-y-4">
      <!-- Vehicle Information -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-fluid-xs font-medium text-body mb-1">Brand <span class="text-brand-red">*</span></label>
          <input 
            v-model="vehicleData.brand"
            type="text" 
            placeholder="e.g., Volkswagen" 
            class="input"
            required
          >
        </div>
        <div>
          <label class="block text-fluid-xs font-medium text-body mb-1">Model <span class="text-brand-red">*</span></label>
          <input 
            v-model="vehicleData.model"
            type="text" 
            placeholder="e.g., ID.4" 
            class="input"
            required
          >
        </div>
        <div>
          <label class="block text-fluid-xs font-medium text-body mb-1">Year <span class="text-brand-red">*</span></label>
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
        <label class="block text-fluid-xs font-medium text-body mb-1">Version/Trim</label>
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
          <label class="block text-fluid-xs font-medium text-body mb-1">VIN</label>
          <input 
            v-model="vehicleData.vin"
            type="text" 
            placeholder="Vehicle Identification Number" 
            class="input"
          >
        </div>
        <div>
          <label class="block text-fluid-xs font-medium text-body mb-1">Plates</label>
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
          <label class="block text-fluid-xs font-medium text-body mb-1">Fuel Type</label>
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
          <label class="block text-fluid-xs font-medium text-body mb-1">Gear Type</label>
          <select v-model="vehicleData.gearType" class="input">
            <option value="">Select gear type...</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
            <option value="CVT">CVT</option>
          </select>
        </div>
        <div>
          <label class="block text-fluid-xs font-medium text-body mb-1">Mileage (km)</label>
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
        <label class="block text-fluid-xs font-medium text-body mb-1">Registration Year/Month</label>
        <input 
          v-model="vehicleData.registration"
          type="text" 
          placeholder="MM/YYYY (e.g., 01/2024)" 
          class="input"
        >
      </div>

      <!-- Valuation Card (collapsed by default) -->
      <div class="border border-E5E7EB rounded-card bg-surfaceSecondary">
        <button
          type="button"
          @click="showValuation = !showValuation"
          class="w-full flex items-center justify-between p-4 text-left hover:bg-surface transition-colors rounded-card"
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
            <label class="block text-fluid-xs font-medium text-body mb-1">Trade-In Price (€)</label>
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
              <label class="block text-fluid-xs font-medium text-body mb-1">Evaluation Range - Low (€)</label>
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
              <label class="block text-fluid-xs font-medium text-body mb-1">Evaluation Range - High (€)</label>
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
              <label class="block text-fluid-xs font-medium text-body mb-1">Provider</label>
              <select v-model="valuationData.provider" class="input">
                <option value="">Select provider...</option>
                <option value="Eurotax">Eurotax</option>
                <option value="Infocar">Infocar</option>
                <option value="Manual">Manual</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-fluid-xs font-medium text-body mb-1">Evaluation Date</label>
              <input 
                v-model="valuationData.evaluationDate"
                type="date" 
                class="input"
              >
            </div>
          </div>
        </div>
      </div>
    </form>

    <div v-if="!hideActions" class="flex justify-end gap-2 mt-6 border-t border-E5E7EB pt-4">
      <Button
        label="Cancel"
        variant="outline"
        size="small"
        @click="$emit('cancel')"
      />
      <Button
        label="Save"
        variant="primary"
        size="small"
        :disabled="!isValid"
        @click="handleSave"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Button } from '@motork/component-library'

const props = defineProps({
  item: {
    type: Object,
    default: null
  },
  taskType: {
    type: String,
    default: 'lead'
  },
  taskId: {
    type: Number,
    required: true
  },
  hideActions: {
    type: Boolean,
    default: false
  },
  hideHeader: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'cancel'])

const showValuation = ref(false)

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
  registration: ''
})

const valuationData = ref({
  tradeInPrice: null,
  evaluationRangeLow: null,
  evaluationRangeHigh: null,
  provider: '',
  evaluationDate: ''
})

const isValid = computed(() => {
  return !!vehicleData.value.brand && !!vehicleData.value.model && !!vehicleData.value.year
})

onMounted(() => {
  if (props.item && props.item.data) {
    // Load vehicle data from existing item
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
      registration: props.item.data.date || props.item.data.registration || ''
    }

    // Load valuation data if exists
    if (props.item.data.tradeInPrice !== undefined) {
      valuationData.value = {
        tradeInPrice: props.item.data.tradeInPrice || null,
        evaluationRangeLow: props.item.data.evaluationRangeLow || null,
        evaluationRangeHigh: props.item.data.evaluationRangeHigh || null,
        provider: props.item.data.provider || '',
        evaluationDate: props.item.data.evaluationDate || ''
      }
      showValuation.value = true
    }
  }
})

const handleSave = () => {
  if (!isValid.value) return

  const data = {
    id: props.item?.id || Date.now(),
    type: 'tradein',
    action: props.item ? 'updated a trade-in' : 'added a trade-in',
    timestamp: props.item?.timestamp || new Date().toISOString(),
    isEdit: !!props.item,
    data: {
      brand: vehicleData.value.brand,
      model: vehicleData.value.model,
      year: parseInt(vehicleData.value.year) || null,
      version: vehicleData.value.version || null,
      vin: vehicleData.value.vin || null,
      plate: vehicleData.value.plates || null,
      plates: vehicleData.value.plates || null,
      fuelType: vehicleData.value.fuelType || null,
      gearType: vehicleData.value.gearType || null,
      km: parseInt(vehicleData.value.kilometers) || 0,
      kilometers: parseInt(vehicleData.value.kilometers) || 0,
      date: vehicleData.value.registration || null,
      registration: vehicleData.value.registration || null,
      // Valuation data
      tradeInPrice: valuationData.value.tradeInPrice,
      evaluationRangeLow: valuationData.value.evaluationRangeLow,
      evaluationRangeHigh: valuationData.value.evaluationRangeHigh,
      provider: valuationData.value.provider || null,
      evaluationDate: valuationData.value.evaluationDate || null
    }
  }

  emit('save', data)
}

defineExpose({
  submit: handleSave,
  canSubmit: () => isValid.value
})
</script>
