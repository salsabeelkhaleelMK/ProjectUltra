<template>
  <div>
    <div v-if="appointments.length > 0" class="space-y-4 mb-6 px-1">
      <div
        v-for="apt in appointments"
        :key="apt.id"
        class="bg-white border border-E5E7EB rounded-xl p-4 shadow-sm flex gap-4 animate-fade-in feed-item cursor-pointer hover:shadow-md transition-shadow"
        @click="handleAppointmentClick(apt)"
      >
        <div 
          class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border bg-purple-100 text-purple-600 border-purple-200"
        >
          <i class="fa-solid fa-calendar text-sm"></i>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-bold text-heading">{{ getCustomerInitials(apt) }}</span>
            <span class="text-xs text-sub">scheduled</span>
            <span class="text-xs text-sub">• {{ formatTime(apt.start) }}</span>
            <div class="ml-auto relative">
              <button 
                @click.stop="showMenu[apt.id] = !showMenu[apt.id]"
                class="text-gray-400 hover:text-body transition-colors p-1"
                title="More actions"
              >
                <i class="fa-solid fa-ellipsis-vertical text-sm"></i>
              </button>
            </div>
          </div>
          <div class="text-sm text-body">
            <div class="flex items-center gap-2 mb-1 flex-wrap">
              <span
                class="text-xs px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter border"
                :class="getTypeBadgeClass(apt.type)"
              >
                {{ getTypeLabel(apt.type) }}
              </span>
              <span
                v-if="apt.status"
                class="text-xs px-1.5 py-0.5 rounded font-medium capitalize"
                :class="getStatusBadgeClass(apt.status)"
              >
                {{ apt.status }}
              </span>
            </div>
            <div class="text-sm font-medium text-heading mb-1">
              {{ apt.title || 'Appointment' }}
            </div>
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-sub">
              <span class="flex items-center gap-1">
                <i class="fa-solid fa-clock text-xs"></i>
                {{ formatDateTime(apt.start) }}
              </span>
              <span v-if="apt.assignee" class="flex items-center gap-1">
                <i class="fa-solid fa-user text-xs"></i>
                {{ apt.assignee }}
              </span>
              <span v-if="apt.vehicle" class="flex items-center gap-1">
                <i class="fa-solid fa-car text-xs"></i>
                {{ apt.vehicle }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8 text-sub">
      <i class="fa-solid fa-calendar-xmark text-2xl mb-2 opacity-30"></i>
      <p class="text-xs">No appointments for this customer</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  appointments: {
    type: Array,
    default: () => []
  }
})

const router = useRouter()
const showMenu = ref({})

const TYPE_LABELS = {
  'appointment': 'Dealership Visit',
  'test-drive': 'Test Drive',
  'meeting': 'Meeting',
  'call': 'Call',
  'delivery': 'Delivery',
  'offsite': 'Offsite Visit',
  'workshop': 'Workshop'
}

const getTypeLabel = (type) => TYPE_LABELS[type] || (type || 'Appointment')

const getTypeBadgeClass = (type) => {
  const classes = {
    'appointment': 'bg-blue-50 text-blue-600 border-blue-100',
    'test-drive': 'bg-green-50 text-green-600 border-green-100',
    'meeting': 'bg-purple-50 text-purple-600 border-purple-100',
    'call': 'bg-amber-50 text-amber-600 border-amber-100',
    'delivery': 'bg-teal-50 text-teal-600 border-teal-100',
    'offsite': 'bg-slate-50 text-slate-600 border-slate-100',
    'workshop': 'bg-orange-50 text-orange-600 border-orange-100'
  }
  return classes[type] || 'bg-surfaceSecondary text-body border-gray-100'
}

const getStatusBadgeClass = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'confirmed') return 'bg-green-50 text-green-600'
  if (s === 'cancelled') return 'bg-red-50 text-red-600'
  if (s === 'no-show') return 'bg-amber-50 text-amber-600'
  return 'bg-surfaceSecondary text-body'
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const d = new Date(dateString)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    hour: '2-digit',
    minute: '2-digit'
  })
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

const getCustomerInitials = (apt) => {
  // Try to get customer initials from appointment data
  if (apt.customerInitials) return apt.customerInitials
  if (apt.customer?.initials) return apt.customer.initials
  // Default fallback
  return 'SK'
}

const handleAppointmentClick = (apt) => {
  if (apt.opportunityId) {
    router.push({ path: `/tasks/${apt.opportunityId}`, query: { type: 'opportunity' } })
  } else if (apt.leadId) {
    router.push({ path: `/tasks/${apt.leadId}`, query: { type: 'lead' } })
  } else {
    router.push({ path: '/calendar' })
  }
}
</script>
