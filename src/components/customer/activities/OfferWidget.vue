<template>
  <div class="bg-surface rounded-xl p-5 mb-6 animate-fade-in relative">
    <div v-if="!hideHeader" class="flex justify-between items-center mb-4">
      <h5 class="text-sm font-bold text-heading">{{ item ? 'Edit Offer' : 'Create Offer' }}</h5>
      <button @click="$emit('cancel')" class="text-sub hover:text-body"><i class="fa-solid fa-xmark"></i></button>
    </div>
    
    <!-- Selected Vehicle Display -->
    <div v-if="selectedVehicle" class="mb-6 p-4 bg-surfaceSecondary rounded-lg border border-E5E7EB">
      <p class="text-xs text-sub mb-2">Creating offer for:</p>
      <div class="flex items-center gap-3">
        <div class="w-16 h-16 bg-surfaceTertiary rounded overflow-hidden flex-shrink-0">
          <img 
            v-if="selectedVehicle.image" 
            :src="selectedVehicle.image" 
            alt="Vehicle" 
            class="w-full h-full object-cover"
          />
          <i v-else class="fa-solid fa-car text-sub w-full h-full flex items-center justify-center"></i>
        </div>
        <div>
          <h4 class="font-bold text-sm text-heading">
            {{ selectedVehicle.brand }} {{ selectedVehicle.model }} ({{ selectedVehicle.year }})
          </h4>
          <p class="text-xs text-sub">Base Price: € {{ formatCurrency(selectedVehicle.price) }}</p>
        </div>
      </div>
    </div>
    
    <!-- Offer Details Form -->
    <div class="space-y-4">
      <!-- Offer Price -->
      <div>
        <label class="block text-xs font-medium text-body mb-1">
          Offer Price (€) <span class="text-red-500">*</span>
        </label>
        <input 
          type="number" 
          v-model="offerData.price" 
          class="input"
          placeholder="Enter offer price"
        />
      </div>
      
      <!-- Financing Type -->
      <div>
        <label class="block text-xs font-medium text-body mb-1">
          Payment Method <span class="text-red-500">*</span>
        </label>
        <select 
          v-model="offerData.financingType" 
          class="input"
        >
          <option value="">Select payment method</option>
          <option value="cash">Cash</option>
          <option value="finance">Finance</option>
          <option value="lease">Lease</option>
        </select>
      </div>
      
      <!-- Financing Details (if finance or lease selected) -->
      <div v-if="offerData.financingType === 'finance' || offerData.financingType === 'lease'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-body mb-1">Down Payment (€)</label>
          <input 
            type="number" 
            v-model="offerData.downPayment" 
            class="input"
            placeholder="0"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-body mb-1">Monthly Payment (€)</label>
          <input 
            type="number" 
            v-model="offerData.monthlyPayment" 
            class="input"
            placeholder="Calculated automatically"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-body mb-1">Term (months)</label>
          <input 
            type="number" 
            v-model="offerData.term" 
            class="input"
            placeholder="36"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-body mb-1">Interest Rate (%)</label>
          <input 
            type="number" 
            step="0.1" 
            v-model="offerData.interestRate" 
            class="input"
            placeholder="3.5"
          />
        </div>
      </div>
      
      <!-- Expected Delivery Date -->
      <div>
        <label class="block text-xs font-medium text-body mb-1">Expected Delivery Date</label>
        <input 
          type="date" 
          v-model="offerData.deliveryDate" 
          class="input"
        />
      </div>
      
      <!-- Offer Valid Until -->
      <div>
        <label class="block text-xs font-medium text-body mb-1">Offer Valid Until</label>
        <input 
          type="date" 
          v-model="offerData.validUntil" 
          class="input"
        />
      </div>
      
      <!-- Additional Notes -->
      <div>
        <label class="block text-xs font-medium text-body mb-1">Notes / Special Terms</label>
        <textarea 
          v-model="offerData.notes" 
          rows="3"
          class="input"
          placeholder="Any special terms, conditions, or notes about this offer..."
        ></textarea>
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div v-if="!hideActions" class="flex justify-end gap-2 mt-6 border-t border-gray-100 pt-4">
      <button 
        @click="$emit('cancel')" 
        class="text-xs font-medium text-sub hover:text-body px-3 py-2 rounded-lg hover:bg-surfaceSecondary transition-colors"
      >
        Cancel
      </button>
      <button 
        @click="handleSave" 
        :disabled="!canSave" 
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors shadow-sm shadow-blue-200"
      >
        {{ item ? 'Update Offer' : 'Create Offer' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

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
  selectedVehicle: {
    type: Object,
    default: null
  },
  hideHeader: {
    type: Boolean,
    default: false
  },
  hideActions: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'cancel'])

// Offer data
const offerData = ref({
  price: 0,
  financingType: '',
  downPayment: 0,
  monthlyPayment: 0,
  term: 36,
  interestRate: 3.5,
  deliveryDate: '',
  validUntil: '',
  notes: '',
  // Vehicle info (from selected vehicle)
  brand: '',
  model: '',
  year: '',
  image: ''
})

// Initialize from selected vehicle
onMounted(() => {
  if (props.selectedVehicle) {
    offerData.value.price = props.selectedVehicle.price || 0
    offerData.value.brand = props.selectedVehicle.brand || ''
    offerData.value.model = props.selectedVehicle.model || ''
    offerData.value.year = props.selectedVehicle.year || ''
    offerData.value.image = props.selectedVehicle.image || ''
    
    // Set default valid until date (30 days from now)
    const validUntil = new Date()
    validUntil.setDate(validUntil.getDate() + 30)
    offerData.value.validUntil = validUntil.toISOString().split('T')[0]
  }
  
  // If editing existing offer
  if (props.item && props.item.data) {
    offerData.value = {
      ...offerData.value,
      ...props.item.data,
      price: props.item.data.price || props.item.data.total || 0,
      financingType: props.item.data.financingType || props.item.data.paymentMethod || '',
      notes: props.item.data.notes || props.item.data.description || ''
    }
  }
})

// Watch for changes in selected vehicle
watch(() => props.selectedVehicle, (newVehicle) => {
  if (newVehicle && !props.item) {
    offerData.value.price = newVehicle.price || 0
    offerData.value.brand = newVehicle.brand || ''
    offerData.value.model = newVehicle.model || ''
    offerData.value.year = newVehicle.year || ''
    offerData.value.image = newVehicle.image || ''
  }
})

// Validation
const canSave = computed(() => {
  return offerData.value.price > 0 && offerData.value.financingType !== ''
})

// Format currency
const formatCurrency = (value) => {
  if (!value) return '0'
  return value.toLocaleString('en-US')
}

// Save handler
const handleSave = () => {
  if (!canSave.value) return
  
  const offerPayload = {
    id: props.item?.id || Date.now(),
    type: 'offer',
    action: props.item ? 'updated an offer' : 'created an offer',
    data: {
      brand: offerData.value.brand,
      model: offerData.value.model,
      year: offerData.value.year,
      price: offerData.value.price,
      total: offerData.value.price,
      paymentMethod: offerData.value.financingType,
      financingType: offerData.value.financingType,
      downPayment: offerData.value.downPayment,
      monthlyPayment: offerData.value.monthlyPayment,
      term: offerData.value.term,
      interestRate: offerData.value.interestRate,
      deliveryDate: offerData.value.deliveryDate,
      validUntil: offerData.value.validUntil,
      notes: offerData.value.notes,
      description: offerData.value.notes,
      image: offerData.value.image
    },
    timestamp: props.item?.timestamp || new Date().toISOString(),
    isEdit: !!props.item
  }
  
  emit('save', offerPayload)
}

defineExpose({
  submit: handleSave,
  isValid: canSave,
  offerData
})
</script>
