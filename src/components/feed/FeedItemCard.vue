<template>
  <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex gap-4 animate-fade-in mb-4 feed-item">
    <div 
      class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border"
      :class="getItemIconClass(item.type)"
    >
      <i :class="getItemIcon(item.type)" class="text-sm"></i>
    </div>
    <div class="flex-1">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-xs font-bold text-slate-800">{{ customerInitials }}</span>
        <span class="text-[10px] text-gray-400">{{ item.action || 'added' }}</span>
        <span class="text-[10px] text-gray-400">• {{ formatTime(item.timestamp) }}</span>
        <span v-if="item.autoDetected" class="bg-blue-50 text-blue-600 text-[9px] px-1.5 py-0.5 rounded border border-blue-100">Auto-detected</span>
        <div class="ml-auto flex items-center gap-2">
          <button 
            @click="$emit('edit', item)"
            class="text-gray-400 hover:text-blue-600 transition-colors p-1"
            title="Edit"
          >
            <i class="fa-solid fa-pencil text-xs"></i>
          </button>
          <button 
            @click="handleDelete"
            class="text-gray-400 hover:text-red-600 transition-colors p-1"
            title="Delete"
          >
            <i class="fa-solid fa-trash text-xs"></i>
          </button>
        </div>
      </div>
      <div v-if="item.content" class="text-sm text-slate-700">{{ item.content }}</div>
      <div v-if="item.fileName" class="text-sm text-slate-700 flex items-center gap-2">
        <i class="fa-solid fa-paperclip text-gray-400"></i>
        <span>{{ item.fileName }}</span>
      </div>
      <div v-if="item.data" class="mt-2">
        <div v-if="item.type === 'appointment'">
          <AppointmentWidget :appointment-data="item.data" />
        </div>
        <div v-else class="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div v-if="item.type === 'tradein'" class="flex justify-between items-start">
            <div>
              <h4 class="text-sm font-bold text-slate-800">{{ item.data.brand }} {{ item.data.model }}</h4>
              <div class="text-xs text-gray-500 mt-1 flex gap-3">
                <span v-if="item.data.year"><i class="fa-regular fa-calendar mr-1"></i>{{ item.data.year }}</span>
                <span v-if="item.data.km"><i class="fa-solid fa-road mr-1"></i>{{ item.data.km }} km</span>
              </div>
            </div>
            <span class="bg-white border border-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded">Pending Eval</span>
          </div>
          <div v-else-if="item.type === 'financing'" class="flex justify-between items-center mb-2">
            <h4 class="text-sm font-bold text-slate-800">{{ item.data.product }}</h4>
            <span class="bg-white border border-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded">Draft</span>
          </div>
          <div v-else-if="item.type === 'offer'" class="flex items-center gap-3">
            <div v-if="item.data.image" class="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
              <img :src="item.data.image" alt="Car" class="w-full h-full object-cover">
            </div>
            <div class="flex-1">
              <h4 class="text-sm font-bold text-slate-800">{{ item.data.brand }} {{ item.data.model }} ({{ item.data.year }})</h4>
              <p class="text-xs text-gray-500">€ {{ formatCurrency(item.data.price) }}</p>
            </div>
            <span v-if="item.data.isMainOffer" class="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">Main Offer</span>
          </div>
          <div v-else-if="item.type === 'purchase'" class="flex items-center gap-3">
            <div class="flex-1">
              <h4 class="text-sm font-bold text-slate-800">{{ item.data.brand }} {{ item.data.model }} ({{ item.data.year }})</h4>
              <p class="text-xs text-gray-500">€ {{ formatCurrency(item.data.price) }}</p>
              <p v-if="item.data.purchaseDate" class="text-xs text-gray-400 mt-1">Purchased: {{ formatDate(item.data.purchaseDate) }}</p>
              <p v-if="item.data.notes" class="text-xs text-gray-600 mt-1">{{ item.data.notes }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppointmentWidget from '@/components/widgets/AppointmentWidget.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  taskType: {
    type: String,
    default: 'lead'
  },
  customerInitials: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

const showDeleteConfirm = ref(false)

const getItemIcon = (type) => {
  const icons = {
    'note': 'fa-regular fa-note-sticky',
    'communication': 'fa-solid fa-comment-dots',
    'email': 'fa-regular fa-envelope',
    'whatsapp': 'fa-brands fa-whatsapp',
    'sms': 'fa-solid fa-comment-dots',
    'attachment': 'fa-solid fa-paperclip',
    'tradein': 'fa-solid fa-car-side',
    'financing': 'fa-solid fa-file-invoice-dollar',
    'offer': 'fa-solid fa-handshake',
    'purchase': 'fa-solid fa-shopping-cart',
    'appointment': 'fa-solid fa-calendar'
  }
  return icons[type] || 'fa-solid fa-circle'
}

const getItemIconClass = (type) => {
  const classes = {
    'note': 'bg-orange-100 text-orange-600 border-orange-200',
    'communication': 'bg-gray-100 text-gray-600 border-gray-200',
    'email': 'bg-blue-100 text-blue-600 border-blue-200',
    'whatsapp': 'bg-green-100 text-green-600 border-green-200',
    'sms': 'bg-gray-100 text-gray-600 border-gray-200',
    'attachment': 'bg-blue-50 text-blue-600 border-blue-100',
    'tradein': 'bg-green-50 text-green-600 border-green-100',
    'financing': 'bg-purple-50 text-purple-600 border-purple-100',
    'offer': 'bg-indigo-50 text-indigo-600 border-indigo-100',
    'purchase': 'bg-teal-50 text-teal-600 border-teal-100',
    'appointment': 'bg-purple-100 text-purple-600 border-purple-200'
  }
  return classes[type] || 'bg-gray-100 text-gray-600 border-gray-200'
}

const formatTime = (timestamp) => {
  if (!timestamp) return 'Just now'
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const formatCurrency = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('en-US').format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this item?')) {
    emit('delete', props.item)
  }
}
</script>

