<template>
  <div class="space-y-3">
    <!-- Loading Skeleton -->
    <template v-if="loading">
      <div v-for="n in 3" :key="`skeleton-${n}`" class="bg-surface border border-border rounded-lg p-4">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0 space-y-2">
            <div class="flex items-center gap-2">
              <div class="h-5 bg-surfaceTertiary rounded w-16 animate-pulse"></div>
              <div class="h-5 bg-surfaceTertiary rounded w-20 animate-pulse"></div>
            </div>
            <div class="h-4 bg-surfaceTertiary rounded w-32 animate-pulse"></div>
            <div class="h-3 bg-surfaceTertiary rounded w-24 animate-pulse"></div>
            <div class="h-3 bg-surfaceTertiary rounded w-20 animate-pulse"></div>
          </div>
          <div class="h-4 w-4 bg-surfaceTertiary rounded animate-pulse"></div>
        </div>
      </div>
    </template>
    
    <!-- Actual Content -->
    <template v-else>
      <div v-if="appointments.length === 0" class="text-center py-8 text-muted-foreground">
        <CalendarCheck class="w-10 h-10 shrink-0 mb-2 text-muted-foreground/50" />
        <p class="text-sm">No appointments scheduled for today</p>
      </div>
      
      <div
        v-for="appointment in appointments"
        :key="appointment.id"
        @click="handleClick(appointment)"
        class="bg-surface border border-border rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
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
          
          <h4 class="text-sm font-semibold text-foreground mb-1">
            {{ appointment.customer || appointment.title }}
          </h4>
          
          <p class="text-xs mb-2">
            {{ appointment.type }}
            <span v-if="appointment.vehicle"> - {{ appointment.vehicle }}</span>
          </p>
          
          <div class="flex items-center gap-2 text-xs text-muted-foreground">
            <User class="w-4 h-4 shrink-0 text-muted-foreground" />
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
          class="text-muted-foreground hover:text-blue-600 transition-colors"
        >
          <ChevronRight class="w-4 h-4 shrink-0" />
        </button>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup>
import { CalendarCheck, User, ChevronRight } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const props = defineProps({
  appointments: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
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
    'no-show': 'bg-muted text-muted-foreground border'
  }
  return statusMap[status] || 'bg-muted text-muted-foreground border'
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




