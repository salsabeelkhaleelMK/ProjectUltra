<template>
  <div class="bg-surface border border rounded-xl p-4 shadow-sm flex gap-4 animate-fade-in mb-4 feed-item">
    <div 
      class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border"
      :class="getItemIconClass(item.type)"
    >
      <i :class="getItemIcon(item.type)" class="text-sm"></i>
    </div>
    <div class="flex-1">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-meta-bold text-heading">{{ customerInitials }}</span>
        <span class="text-meta">{{ item.action || 'added' }}</span>
        <span class="text-meta">• {{ formatTime(item.timestamp) }}</span>
        <span v-if="item.autoDetected" class="bg-blue-50 text-blue-600 text-meta px-1 py-0.5 rounded border border-blue-100">Auto-detected</span>
        <div class="ml-auto relative">
          <button 
            @click.stop="showMenu = !showMenu"
            class="text-gray-400 hover:text-body transition-colors p-1"
            title="More actions"
          >
            <i class="fa-solid fa-ellipsis-vertical text-sm"></i>
          </button>
          
          <!-- Dropdown Menu -->
          <div 
            v-if="showMenu"
            v-click-outside="() => showMenu = false"
            class="absolute right-0 top-full mt-1 z-10"
          >
            <DropdownMenu :items="menuItems" className="w-32" />
          </div>
        </div>
      </div>
      <div v-if="item.content" class="text-content text-body">{{ item.content }}</div>
      <div v-if="item.fileName" class="text-content text-body flex items-center gap-2">
        <i class="fa-solid fa-paperclip text-gray-400"></i>
        <span>{{ item.fileName }}</span>
      </div>
      <div v-if="item.data" class="mt-2">
        <div v-if="item.type === 'appointment'">
          <AppointmentWidget :appointment-data="item.data" />
        </div>
        <div v-else class="bg-surfaceSecondary border border rounded-lg p-3">
          <div v-if="item.type === 'tradein'">
              <h4 class="text-content font-bold text-heading">{{ item.data.brand }} {{ item.data.model }}</h4>
              <p v-if="item.data.version" class="text-meta mt-0.5">{{ item.data.version }}</p>
              <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-meta mt-2">
              <div v-if="item.data.year">
                <i class="fa-regular fa-calendar mr-1"></i>{{ item.data.year }}
              </div>
              <div v-if="item.data.km">
                <i class="fa-solid fa-road mr-1"></i>{{ item.data.km }} km
              </div>
              <div v-if="item.data.plate">
                <i class="fa-solid fa-id-card mr-1"></i>{{ item.data.plate }}
              </div>
              <div v-if="item.data.date">
                <i class="fa-regular fa-calendar-check mr-1"></i>{{ formatDate(item.data.date) }}
              </div>
              <div v-if="item.data.class">
                <i class="fa-solid fa-car mr-1"></i>{{ item.data.class }}
              </div>
            </div>
          </div>
          <div v-else-if="item.type === 'financing'">
              <h4 class="text-content font-bold text-heading mb-2">{{ item.data.product }}</h4>
              <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-meta">
              <div v-if="item.data.provider">
                <span class="text-gray-500">Provider:</span>
                <span class="text-body font-medium ml-1">{{ item.data.provider }}</span>
              </div>
              <div v-if="item.data.total">
                <span class="text-gray-500">Total:</span>
                <span class="text-body font-medium ml-1">€{{ formatCurrency(item.data.total) }}</span>
              </div>
              <div v-if="item.data.monthly">
                <span class="text-gray-500">Monthly:</span>
                <span class="text-body font-medium ml-1">€{{ formatCurrency(item.data.monthly) }}</span>
              </div>
              <div v-if="item.data.deposit">
                <span class="text-gray-500">Deposit:</span>
                <span class="text-body font-medium ml-1">€{{ formatCurrency(item.data.deposit) }}</span>
              </div>
              <div v-if="item.data.startDate">
                <span class="text-gray-500">Start:</span>
                <span class="text-body font-medium ml-1">{{ formatDate(item.data.startDate) }}</span>
              </div>
              <div v-if="item.data.expDate">
                <span class="text-gray-500">Expires:</span>
                <span class="text-body font-medium ml-1">{{ formatDate(item.data.expDate) }}</span>
              </div>
            </div>
          </div>
          <div v-else-if="item.type === 'offer'" class="flex items-center gap-3">
            <div v-if="item.data.image" class="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
              <img :src="item.data.image" alt="Car" class="w-full h-full object-cover">
            </div>
            <div class="flex-1">
              <h4 class="text-content font-bold text-heading">{{ item.data.brand }} {{ item.data.model }} ({{ item.data.year }})</h4>
              <p class="text-meta">€ {{ formatCurrency(item.data.price) }}</p>
            </div>
            <span v-if="item.data.isMainOffer" class="bg-purple-600 text-white text-xs font-bold px-1 py-0.5 rounded">Main Offer</span>
          </div>
          <div v-else-if="item.type === 'purchase'" class="flex items-center gap-3">
            <div class="flex-1">
              <h4 class="text-content font-bold text-heading">{{ item.data.brand }} {{ item.data.model }} ({{ item.data.year }})</h4>
              <p class="text-meta">€ {{ formatCurrency(item.data.price) }}</p>
              <p v-if="item.data.purchaseDate" class="text-meta mt-1">Purchased: {{ formatDate(item.data.purchaseDate) }}</p>
              <p v-if="item.data.notes" class="text-meta mt-1">{{ item.data.notes }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { DropdownMenu } from '@motork/component-library'
import AppointmentWidget from '@/components/customer/activities/AppointmentWidget.vue'

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

const showMenu = ref(false)

const menuItems = computed(() => ([
  { key: 'edit', label: 'Edit', onClick: handleEdit },
  { key: 'delete', label: 'Delete', onClick: handleDelete }
]))

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
    'communication': 'bg-surfaceSecondary text-body border',
    'email': 'bg-blue-100 text-blue-600 border-blue-200',
    'whatsapp': 'bg-green-100 text-green-600 border-green-200',
    'sms': 'bg-surfaceSecondary text-body border',
    'attachment': 'bg-blue-50 text-blue-600 border-blue-100',
    'tradein': 'bg-green-50 text-green-600 border-green-100',
    'financing': 'bg-purple-50 text-purple-600 border-purple-100',
    'offer': 'bg-indigo-50 text-indigo-600 border-indigo-100',
    'purchase': 'bg-teal-50 text-teal-600 border-teal-100',
    'appointment': 'bg-purple-100 text-purple-600 border-purple-200'
  }
  return classes[type] || 'bg-surfaceSecondary text-body border'
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

const handleEdit = () => {
  showMenu.value = false
  emit('edit', props.item)
}

const handleDelete = () => {
  showMenu.value = false
  if (confirm('Are you sure you want to delete this item?')) {
    emit('delete', props.item)
  }
}
</script>

