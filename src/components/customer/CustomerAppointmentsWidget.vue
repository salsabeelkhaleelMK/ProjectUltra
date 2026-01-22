<template>
  <div class="rounded-card flex flex-col mb-6" style="background-color: var(--base-muted, #f5f5f5)">
    <!-- Title Section -->
    <div class="px-4 py-4 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-calendar-days text-heading"></i>
        <h2 class="text-fluid-sm font-medium text-heading leading-5">Appointments</h2>
        <span class="ml-1 px-2 py-0.5 bg-brand-blue/10 text-brand-blue text-xs font-bold rounded-full">
          {{ appointments.length }}
        </span>
      </div>
    </div>

    <!-- Card Content -->
    <div class="bg-white rounded-card p-2 shadow-sm flex flex-col" style="box-shadow: var(--nsc-card-shadow);">
      <div v-if="appointments.length > 0" class="divide-y divide-gray-100">
        <div
          v-for="apt in appointments"
          :key="apt.id"
          class="flex flex-col p-3 hover:bg-surfaceSecondary transition-colors rounded-md group cursor-pointer"
          @click="handleAppointmentClick(apt)"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
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
              <div class="text-fluid-sm font-medium text-heading truncate mb-0.5">
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
            <div
              class="w-8 h-8 flex items-center justify-center bg-surface border border-black/5 rounded hover:bg-white hover:border-brand-blue/30 text-sub hover:text-brand-blue transition-all shrink-0"
            >
              <i class="fa-solid fa-chevron-right text-xs"></i>
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
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  appointments: {
    type: Array,
    default: () => []
  }
})

const router = useRouter()

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
