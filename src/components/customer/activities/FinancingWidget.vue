<template>
  <div class="animate-fade-in">
    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Start date</label>
          <input type="date" v-model="financingData.startDate" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Expiration date</label>
          <input type="date" v-model="financingData.expDate" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
        </div>
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-700 mb-1">Financial product name</label>
        <input type="text" v-model="financingData.productName" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Deposit</label>
          <input type="number" v-model="financingData.deposit" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Total loan amount</label>
          <input type="number" v-model="financingData.loanAmount" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
        </div>
      </div>
    </div>
    <div class="flex justify-end gap-2 mt-6 border-t border-gray-100 pt-4">
      <button @click="$emit('cancel')" class="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
      <button @click="handleSave" :disabled="!financingData.productName" class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors shadow-sm shadow-blue-200">Save</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

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
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['save', 'cancel'])

const financingData = ref({
  startDate: '',
  expDate: '',
  productName: '',
  deposit: '',
  loanAmount: ''
})

onMounted(() => {
  if (props.item && props.item.data) {
    financingData.value = {
      startDate: props.item.data.startDate || '',
      expDate: props.item.data.expDate || '',
      productName: props.item.data.product || props.item.data.productName || '',
      deposit: props.item.data.deposit || '',
      loanAmount: props.item.data.total || props.item.data.loanAmount || ''
    }
  }
})

const handleSave = () => {
  if (!financingData.value.productName) return
  
  emit('save', {
    id: props.item?.id || Date.now(),
    type: 'financing',
    action: props.item ? 'updated a financing proposal' : 'added a financing proposal',
    data: {
      product: financingData.value.productName,
      provider: 'Audi Financial',
      total: financingData.value.loanAmount || '0',
      monthly: Math.round((parseFloat(financingData.value.loanAmount || 0) / 36)).toString(),
      startDate: financingData.value.startDate,
      expDate: financingData.value.expDate,
      deposit: financingData.value.deposit
    },
    timestamp: props.item?.timestamp || new Date().toISOString(),
    isEdit: !!props.item
  })
}
</script>
