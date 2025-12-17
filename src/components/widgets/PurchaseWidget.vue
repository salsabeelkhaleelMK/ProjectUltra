<template>
  <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6 animate-fade-in relative">
    <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45"></div>
    <div class="flex justify-between items-center mb-4">
      <h5 class="text-sm font-bold text-slate-800">{{ item ? 'Edit Purchase' : 'Add Purchase' }}</h5>
      <button @click="$emit('cancel')" class="text-gray-400 hover:text-gray-600"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Brand</label>
          <input type="text" v-model="purchaseData.brand" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Model</label>
          <input type="text" v-model="purchaseData.model" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Year</label>
          <input type="number" v-model="purchaseData.year" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Purchase Price (€)</label>
          <input type="number" v-model="purchaseData.price" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
        </div>
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-700 mb-1">Purchase Date</label>
        <input type="date" v-model="purchaseData.purchaseDate" class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700">
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-700 mb-1">Notes</label>
        <textarea 
          v-model="purchaseData.notes"
          rows="3" 
          class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-colors shadow-sm resize-none"
          placeholder="Additional purchase details..."
        ></textarea>
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
  brand: '',
  model: '',
  year: '',
  price: '',
  purchaseDate: '',
  notes: ''
})

onMounted(() => {
  if (props.item && props.item.data) {
    purchaseData.value = {
      brand: props.item.data.brand || '',
      model: props.item.data.model || '',
      year: props.item.data.year || '',
      price: props.item.data.price || '',
      purchaseDate: props.item.data.purchaseDate || '',
      notes: props.item.data.notes || ''
    }
  }
})

const canSave = computed(() => {
  return purchaseData.value.brand && purchaseData.value.model && purchaseData.value.price
})

const handleSave = () => {
  if (!canSave.value) return
  
  emit('save', {
    id: props.item?.id || Date.now(),
    type: 'purchase',
    action: props.item ? 'updated a purchase' : 'added a purchase',
    data: {
      brand: purchaseData.value.brand,
      model: purchaseData.value.model,
      year: purchaseData.value.year || new Date().getFullYear(),
      price: purchaseData.value.price,
      purchaseDate: purchaseData.value.purchaseDate || new Date().toISOString().split('T')[0],
      notes: purchaseData.value.notes || ''
    },
    timestamp: props.item?.timestamp || new Date().toISOString(),
    isEdit: !!props.item
  })
}
</script>

