<template>
  <div class="space-y-3">
    <div v-if="appointments.length === 0" class="text-center py-8 text-gray-500">
      <i class="fa-solid fa-calendar-check text-4xl mb-2 text-gray-300"></i>
      <p class="text-sm">No appointments scheduled for today</p>
    </div>
    
    <div
      v-for="appointment in appointments"
      :key="appointment.id"
      @click="handleClick(appointment)"
      class="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
    >
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span 
              class="text-xs font-bold px-2 py-0.5 rounded"
              :class="getTimeBadgeClass(appointment.date)"
            >
              {{ appointment.time }}
            </span>
            <span 
              class="text-xs font-medium px-2 py-0.5 rounded border"
              :class="getStatusClass(appointment.status)"
            >
              {{ appointment.status }}
            </span>
          </div>
          
          <h4 class="font-semibold text-slate-800 text-sm mb-1">
            {{ appointment.customer || appointment.title }}
          </h4>
          
          <p class="text-xs text-gray-600 mb-2">
            {{ appointment.type }}
            <span v-if="appointment.vehicle"> - {{ appointment.vehicle }}</span>
          </p>
          
          <div class="flex items-center gap-2 text-xs text-gray-500">
            <i class="fa-solid fa-user text-gray-400"></i>
            <span v-if="appointment.assigneeType === 'team'">
              {{ appointment.team }} Team
            </span>
            <span v-else>
              {{ appointment.assignee || 'Unassigned' }}
            </span>
          </div>
        </div>
        
        <button
          @click.stop="handleClick(appointment)"
          class="text-gray-400 hover:text-blue-600 transition-colors"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>
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

const getTimeBadgeClass = (date) => {
  const now = new Date()
  const appointmentTime = new Date(date)
  const hoursUntil = (appointmentTime - now) / (1000 * 60 * 60)
  
  if (hoursUntil < 0) {
    return 'bg-red-100 text-red-700 border-red-200'
  } else if (hoursUntil < 2) {
    return 'bg-orange-100 text-orange-700 border-orange-200'
  } else {
    return 'bg-blue-100 text-blue-700 border-blue-200'
  }
}

const getStatusClass = (status) => {
  const statusMap = {
    'confirmed': 'bg-green-50 text-green-700 border-green-200',
    'scheduled': 'bg-blue-50 text-blue-700 border-blue-200',
    'pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'cancelled': 'bg-red-50 text-red-700 border-red-200',
    'no-show': 'bg-gray-50 text-gray-700 border-gray-200'
  }
  return statusMap[status] || 'bg-gray-50 text-gray-700 border-gray-200'
}

const handleClick = (appointment) => {
  if (appointment.opportunityId) {
    router.push(`/tasks/${appointment.opportunityId}?type=opportunity`)
  } else if (appointment.leadId) {
    router.push(`/tasks/${appointment.leadId}?type=lead`)
  } else {
    // Navigate to calendar or task list
    router.push('/calendar')
  }
}
</script>



