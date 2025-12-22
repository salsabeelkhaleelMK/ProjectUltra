<template>
  <div class="animate-fade-in">
    <div class="space-y-4">
      <!-- Payment Method Selector -->
      <div>
        <label class="block text-xs font-medium text-slate-700 mb-1">Payment Method</label>
        <select 
          v-model="purchaseData.method" 
          class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
        >
          <option value="cash">Cash</option>
          <option value="financing">Financing</option>
          <option value="lease">Lease</option>
        </select>
      </div>

      <!-- Common Fields: Brand, Model, Year -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Brand</label>
          <input 
            type="text" 
            v-model="purchaseData.brand" 
            placeholder="e.g., Audi"
            class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
          >
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Model</label>
          <input 
            type="text" 
            v-model="purchaseData.model" 
            placeholder="e.g., Q4 e-tron"
            class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
          >
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Year</label>
          <input 
            type="number" 
            v-model="purchaseData.year" 
            placeholder="2024"
            class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
          >
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">
            {{ purchaseData.method === 'cash' ? 'Purchase Price (€)' : 'Total Amount (€)' }}
          </label>
          <input 
            type="number" 
            v-model="purchaseData.price" 
            placeholder="45000"
            class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
          >
        </div>
      </div>

      <!-- Cash-specific Fields -->
      <div v-if="purchaseData.method === 'cash'" class="space-y-4 pt-2 border-t border-gray-100">
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Purchase Date</label>
          <input 
            type="date" 
            v-model="purchaseData.purchaseDate" 
            class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
          >
        </div>
      </div>

      <!-- Financing-specific Fields -->
      <div v-if="purchaseData.method === 'financing'" class="space-y-4 pt-2 border-t border-gray-100">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Financial Product</label>
            <input 
              type="text" 
              v-model="purchaseData.productName" 
              placeholder="e.g., Auto Loan Plus"
              class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
            >
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Provider</label>
            <input 
              type="text" 
              v-model="purchaseData.provider" 
              placeholder="e.g., Audi Financial"
              class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
            >
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Deposit (€)</label>
            <input 
              type="number" 
              v-model="purchaseData.deposit" 
              placeholder="5000"
              class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
            >
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Loan Term (months)</label>
            <input 
              type="number" 
              v-model="purchaseData.loanTerm" 
              placeholder="36"
              class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
            >
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Start Date</label>
            <input 
              type="date" 
              v-model="purchaseData.startDate" 
              class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
            >
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">End Date</label>
            <input 
              type="date" 
              v-model="purchaseData.expDate" 
              class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
            >
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Monthly Payment (€)</label>
          <input 
            type="text" 
            :value="calculatedMonthlyPayment" 
            readonly
            class="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700"
          >
        </div>
      </div>

      <!-- Lease-specific Fields -->
      <div v-if="purchaseData.method === 'lease'" class="space-y-4 pt-2 border-t border-gray-100">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Lease Provider</label>
            <input 
              type="text" 
              v-model="purchaseData.provider" 
              placeholder="e.g., Audi Leasing"
              class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
            >
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Lease Term (months)</label>
            <input 
              type="number" 
              v-model="purchaseData.leaseTerm" 
              placeholder="36"
              class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
            >
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Down Payment (€)</label>
            <input 
              type="number" 
              v-model="purchaseData.deposit" 
              placeholder="3000"
              class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
            >
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Residual Value (€)</label>
            <input 
              type="number" 
              v-model="purchaseData.residualValue" 
              placeholder="15000"
              class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
            >
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Start Date</label>
            <input 
              type="date" 
              v-model="purchaseData.startDate" 
              class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
            >
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">End Date</label>
            <input 
              type="date" 
              v-model="purchaseData.expDate" 
              class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
            >
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Monthly Payment (€)</label>
          <input 
            type="text" 
            :value="calculatedLeasePayment" 
            readonly
            class="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700"
          >
        </div>
      </div>

      <!-- Notes (Common for all methods) -->
      <div>
        <label class="block text-xs font-medium text-slate-700 mb-1">Notes</label>
        <textarea 
          v-model="purchaseData.notes"
          rows="3" 
          class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-colors shadow-sm resize-none"
          placeholder="Additional details..."
        ></textarea>
      </div>
    </div>
    
    <div class="flex justify-end gap-2 mt-6 border-t border-gray-100 pt-4">
      <button 
        @click="$emit('cancel')" 
        class="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button 
        @click="handleSave" 
        :disabled="!canSave" 
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors shadow-sm shadow-blue-200"
      >
        Save
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

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
  }
})

const emit = defineEmits(['save', 'cancel'])

const purchaseData = ref({
  method: 'cash',
  brand: '',
  model: '',
  year: '',
  price: '',
  purchaseDate: '',
  productName: '',
  provider: '',
  deposit: '',
  loanTerm: 36,
  leaseTerm: 36,
  residualValue: '',
  startDate: '',
  expDate: '',
  notes: ''
})

onMounted(() => {
  if (props.item && props.item.data) {
    purchaseData.value = {
      method: props.item.data.method || 'cash',
      brand: props.item.data.brand || '',
      model: props.item.data.model || '',
      year: props.item.data.year || '',
      price: props.item.data.price || props.item.data.total || '',
      purchaseDate: props.item.data.purchaseDate || '',
      productName: props.item.data.productName || props.item.data.product || '',
      provider: props.item.data.provider || '',
      deposit: props.item.data.deposit || '',
      loanTerm: props.item.data.loanTerm || 36,
      leaseTerm: props.item.data.leaseTerm || 36,
      residualValue: props.item.data.residualValue || '',
      startDate: props.item.data.startDate || '',
      expDate: props.item.data.expDate || '',
      notes: props.item.data.notes || ''
    }
  }
})

const calculatedMonthlyPayment = computed(() => {
  if (purchaseData.value.method === 'financing') {
    const loanAmount = parseFloat(purchaseData.value.price || 0) - parseFloat(purchaseData.value.deposit || 0)
    const term = parseFloat(purchaseData.value.loanTerm || 36)
    if (loanAmount > 0 && term > 0) {
      return Math.round(loanAmount / term).toString()
    }
  }
  return '0'
})

const calculatedLeasePayment = computed(() => {
  if (purchaseData.value.method === 'lease') {
    const depreciationAmount = parseFloat(purchaseData.value.price || 0) - parseFloat(purchaseData.value.residualValue || 0) - parseFloat(purchaseData.value.deposit || 0)
    const term = parseFloat(purchaseData.value.leaseTerm || 36)
    if (depreciationAmount > 0 && term > 0) {
      return Math.round(depreciationAmount / term).toString()
    }
  }
  return '0'
})

const canSave = computed(() => {
  const hasBasicInfo = purchaseData.value.brand && purchaseData.value.model && purchaseData.value.price
  
  if (purchaseData.value.method === 'cash') {
    return hasBasicInfo
  } else if (purchaseData.value.method === 'financing') {
    return hasBasicInfo && purchaseData.value.productName
  } else if (purchaseData.value.method === 'lease') {
    return hasBasicInfo && purchaseData.value.provider
  }
  
  return false
})

const handleSave = () => {
  if (!canSave.value) return
  
  const methodLabel = {
    'cash': 'Cash',
    'financing': 'Financing',
    'lease': 'Lease'
  }[purchaseData.value.method]
  
  const action = props.item 
    ? `updated purchase method: ${methodLabel}` 
    : `added purchase method: ${methodLabel}`
  
  // Build data object with only relevant fields
  const data = {
    method: purchaseData.value.method,
    brand: purchaseData.value.brand,
    model: purchaseData.value.model,
    year: purchaseData.value.year || new Date().getFullYear(),
    price: purchaseData.value.price,
    notes: purchaseData.value.notes || ''
  }
  
  if (purchaseData.value.method === 'cash') {
    data.purchaseDate = purchaseData.value.purchaseDate || new Date().toISOString().split('T')[0]
  } else if (purchaseData.value.method === 'financing') {
    data.productName = purchaseData.value.productName
    data.provider = purchaseData.value.provider || 'Audi Financial'
    data.deposit = purchaseData.value.deposit
    data.loanTerm = purchaseData.value.loanTerm
    data.monthlyPayment = calculatedMonthlyPayment.value
    data.startDate = purchaseData.value.startDate
    data.expDate = purchaseData.value.expDate
  } else if (purchaseData.value.method === 'lease') {
    data.provider = purchaseData.value.provider
    data.leaseTerm = purchaseData.value.leaseTerm
    data.deposit = purchaseData.value.deposit
    data.residualValue = purchaseData.value.residualValue
    data.monthlyPayment = calculatedLeasePayment.value
    data.startDate = purchaseData.value.startDate
    data.expDate = purchaseData.value.expDate
  }
  
  emit('save', {
    id: props.item?.id || Date.now(),
    type: 'purchase-method',
    action: action,
    data: data,
    timestamp: props.item?.timestamp || new Date().toISOString(),
    isEdit: !!props.item
  })
}
</script>

