<template>
  <div class="animate-fade-in">
    <div class="space-y-4">
      <div>
        <label class="block text-xs font-medium text-slate-700 mb-1">Class</label>
        <select v-model="tradeInData.class" class="input">
          <option value="Car">Car</option>
          <option value="Motorcycle">Motorcycle</option>
          <option value="Truck">Truck</option>
        </select>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Brand</label>
          <input type="text" v-model="tradeInData.brand" class="input">
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Model</label>
          <input type="text" v-model="tradeInData.model" class="input">
        </div>
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-700 mb-1">Version</label>
        <input type="text" v-model="tradeInData.version" class="input">
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Km</label>
          <input type="number" v-model="tradeInData.km" class="input">
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-700 mb-1">Plate</label>
          <input type="text" v-model="tradeInData.plate" class="input">
        </div>
      </div>
      <div>
        <label class="block text-xs font-medium text-slate-700 mb-1">Registration date</label>
        <input type="date" v-model="tradeInData.date" class="input">
      </div>
    </div>
    <div v-if="!hideActions" class="flex justify-end gap-2 mt-6 border-t border-gray-100 pt-4">
      <button @click="$emit('cancel')" class="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
      <button @click="handleSave" :disabled="!tradeInData.brand" class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors shadow-sm shadow-blue-200">Save</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

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
  },
  hideActions: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'cancel'])

const tradeInData = ref({
  class: 'Car',
  brand: '',
  model: '',
  version: '',
  km: '',
  plate: '',
  date: ''
})

onMounted(() => {
  if (props.item && props.item.data) {
    tradeInData.value = {
      class: props.item.data.class || 'Car',
      brand: props.item.data.brand || '',
      model: props.item.data.model || '',
      version: props.item.data.version || '',
      km: props.item.data.km || '',
      plate: props.item.data.plate || '',
      date: props.item.data.date || ''
    }
  }
})

const handleSave = () => {
  if (!tradeInData.value.brand) return
  
  emit('save', {
    id: props.item?.id || Date.now(),
    type: 'tradein',
    action: props.item ? 'updated a trade-in' : 'added a trade-in',
    data: {
      class: tradeInData.value.class,
      brand: tradeInData.value.brand,
      model: tradeInData.value.model || 'Unknown Model',
      year: tradeInData.value.date ? new Date(tradeInData.value.date).getFullYear() : 'Unknown Year',
      km: tradeInData.value.km || '0',
      plate: tradeInData.value.plate || '',
      date: tradeInData.value.date || ''
    },
    timestamp: props.item?.timestamp || new Date().toISOString(),
    isEdit: !!props.item
  })
}

defineExpose({
  submit: handleSave,
  isValid: computed(() => !!tradeInData.value.brand)
})
</script>

