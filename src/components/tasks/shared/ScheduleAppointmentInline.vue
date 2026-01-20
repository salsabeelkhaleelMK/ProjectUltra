<template>
  <div class="bg-surface border border-E5E7EB rounded-card p-6 space-y-4">
    <button
      @click="isExpanded = !isExpanded"
      class="w-full flex items-center justify-between mb-2"
    >
      <h5 class="font-semibold text-heading text-fluid-sm">Schedule Appointment</h5>
      <i 
        class="fa-solid text-fluid-xs text-sub transition-transform"
        :class="isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'"
      ></i>
    </button>

    <div v-if="isExpanded" class="space-y-4">
      <!-- Event Type -->
      <div>
        <label class="block text-fluid-xs font-medium text-sub mb-1.5">Event type</label>
        <select v-model="appointmentType" class="input text-fluid-sm w-full">
          <option value="" disabled>Select event type</option>
          <option>Showroom Visit</option>
          <option>Test Drive</option>
          <option>Video Call</option>
          <option>Home Visit</option>
          <option>Closing Meeting</option>
        </select>
      </div>
      
      <!-- Duration -->
      <div>
        <label class="block text-fluid-xs font-medium text-sub mb-1.5">Duration</label>
        <div class="flex gap-2">
          <button 
            @click="duration = '30min'"
            class="px-4 py-2 border-2 rounded-btn text-fluid-sm font-medium transition-all"
            :class="duration === '30min' 
              ? 'border-green-600 bg-surfaceSecondary text-heading' 
              : 'border-E5E7EB text-body hover:border-green-600/30'"
          >
            30min
          </button>
          <button 
            @click="duration = '60min'"
            class="px-4 py-2 border-2 rounded-btn text-fluid-sm font-medium transition-all"
            :class="duration === '60min' 
              ? 'border-green-600 bg-surfaceSecondary text-heading' 
              : 'border-E5E7EB text-body hover:border-green-600/30'"
          >
            60min
          </button>
          <button 
            @click="duration = 'custom'"
            class="px-4 py-2 border-2 rounded-btn text-fluid-sm font-medium transition-all"
            :class="duration === 'custom' 
              ? 'border-green-600 bg-surfaceSecondary text-heading' 
              : 'border-E5E7EB text-body hover:border-green-600/30'"
          >
            Custom
          </button>
        </div>
      </div>
      
      <!-- Calendar and Time Slots - Two Column Layout -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Left Column - Calendar -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <button 
              @click="previousMonth"
              class="p-1 hover:bg-surfaceSecondary rounded transition-colors"
            >
              <i class="fa-solid fa-chevron-left text-fluid-sm text-body"></i>
            </button>
            <h6 class="text-fluid-sm font-semibold text-heading">{{ currentMonthYear }}</h6>
            <button 
              @click="nextMonth"
              class="p-1 hover:bg-surfaceSecondary rounded transition-colors"
            >
              <i class="fa-solid fa-chevron-right text-fluid-sm text-body"></i>
            </button>
          </div>
          
          <!-- Calendar Grid -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            <div v-for="day in ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']" 
              :key="day"
              class="text-center text-fluid-xs font-medium text-sub py-2">
              {{ day }}
            </div>
          </div>
          
          <div class="grid grid-cols-7 gap-1">
            <div 
              v-for="(day, index) in calendarDays" 
              :key="index"
              @click="selectDate(day)"
              class="aspect-square flex items-center justify-center text-fluid-sm font-medium rounded-btn cursor-pointer transition-all"
              :class="isSelectedDate(day) 
                ? 'bg-green-600 text-white' 
                : day ? 'text-body hover:bg-surfaceSecondary' : 'text-transparent'"
            >
              {{ day }}
            </div>
          </div>
        </div>

        <!-- Right Column - Time Slots -->
        <div>
          <h6 class="text-fluid-sm font-semibold text-heading mb-4">{{ selectedDateLabel }}</h6>
          <div v-if="appointmentDate && availableSlots.length > 0" class="space-y-2">
            <button 
              v-for="slot in availableSlots"
              :key="slot"
              @click="selectedTimeSlot = slot"
              class="w-full py-2 px-4 border-2 rounded-btn text-fluid-sm font-medium text-left transition-all"
              :class="selectedTimeSlot === slot 
                ? 'border-green-600 bg-surfaceSecondary text-heading' 
                : 'border-E5E7EB text-body hover:border-green-600/30 hover:bg-surfaceSecondary/50'"
            >
              {{ slot }}
            </button>
          </div>
          <div v-else-if="appointmentDate && availableSlots.length === 0" class="text-fluid-sm text-sub py-4 text-center">
            No available time slots for this date
          </div>
          <div v-else class="text-fluid-sm text-sub py-4 text-center">
            Select a date to see available time slots
          </div>
        </div>
      </div>
      
      <!-- Confirm Button -->
      <div class="flex justify-end gap-2 pt-3 border-t border-E5E7EB">
        <Button
          label="Confirm Appointment"
          variant="primary"
          size="small"
          class="text-fluid-sm !bg-brand-black !hover:bg-brand-darkDarker !text-white !border-brand-black"
          :disabled="!isValid"
          @click="handleConfirm"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Button } from '@motork/component-library'
import { useUserStore } from '@/stores/user'
import { useUsersStore } from '@/stores/users'
import { 
  getAvailabilityForAssignee, 
  getAvailabilityStatus,
  findAlternativeAssignees 
} from '@/services/availabilityService'

const props = defineProps({
  preselectedAssignee: {
    type: Object,
    default: null // { type: 'user', id: 1, name: 'John Smith', role: 'salesman' }
  },
  canCancel: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const userStore = useUserStore()
const usersStore = useUsersStore()

const appointmentType = ref('')
const selectedAssignee = ref(null)
const appointmentDate = ref('')
const selectedTimeSlot = ref('')
const showAssigneeChange = ref(false)
const showAlternatives = ref(false)
const duration = ref('30min')
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const selectedDay = ref(null)
const isExpanded = ref(false)

// Get assignable users and teams from store
const assignableUsers = computed(() => usersStore.assignableUsers)
const assignableTeams = computed(() => usersStore.assignableTeams)

// Get minimum date (today)
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Current month/year display
const currentMonthYear = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

// Calendar days for current month
const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()
  
  const days = []
  // Empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }
  return days
})

// Selected date label
const selectedDateLabel = computed(() => {
  if (!selectedDay.value || !appointmentDate.value) {
    return 'Select a date'
  }
  const date = new Date(appointmentDate.value)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`
})

// Check if date is selected
const isSelectedDate = (day) => {
  if (!day || !appointmentDate.value) return false
  const selected = new Date(appointmentDate.value)
  return selected.getDate() === day && 
         selected.getMonth() === currentMonth.value && 
         selected.getFullYear() === currentYear.value
}

// Select date
const selectDate = (day) => {
  if (!day) return
  const date = new Date(currentYear.value, currentMonth.value, day)
  appointmentDate.value = date.toISOString().split('T')[0]
  selectedDay.value = day
  selectedTimeSlot.value = ''
}

// Navigate months
const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

// Current assignee (either selected or preselected)
const currentAssignee = computed(() => {
  return selectedAssignee.value || (props.preselectedAssignee ? `${props.preselectedAssignee.type}-${props.preselectedAssignee.id}` : null)
})

// Get assignee display info
const assigneeDisplay = computed(() => {
  if (!currentAssignee.value) return {}
  
  const [type, id] = currentAssignee.value.split('-')
  const numericId = parseInt(id)
  
  if (type === 'team') {
    const team = usersStore.getTeamById(numericId)
    return {
      name: team?.name || 'Unknown Team',
      subtitle: 'Team',
      avatarClass: 'bg-green-100 text-green-700',
      initials: '',
      isTeam: true
    }
  } else {
    const user = usersStore.getUserById(numericId)
    return {
      name: user?.name || 'Unknown',
      subtitle: user?.role || 'User',
      avatarClass: getRoleAvatarClass(user?.role),
      initials: getInitials(user?.name),
      isTeam: false
    }
  }
})

// Get available slots for selected assignee and date
const availableSlots = computed(() => {
  if (!appointmentDate.value || !currentAssignee.value) return []
  return getAvailabilityForAssignee(currentAssignee.value, appointmentDate.value)
})

// Get availability status
const availabilityStatus = computed(() => {
  if (!appointmentDate.value || !currentAssignee.value) return null
  return getAvailabilityStatus(currentAssignee.value, appointmentDate.value)
})

// Get alternative assignees when no availability
const alternatives = computed(() => {
  if (!appointmentDate.value || !currentAssignee.value) return []
  if (availabilityStatus.value !== 'none') return []
  
  // Combine all users and teams
  const allAssignees = [
    ...assignableTeams.value.map(t => ({ ...t, type: 'team' })),
    ...assignableUsers.value.map(u => ({ ...u, type: 'user' }))
  ]
  
  return findAlternativeAssignees(currentAssignee.value, appointmentDate.value, allAssignees)
})

// Check if form is valid
const isValid = computed(() => {
  return !!(appointmentType.value && appointmentDate.value && selectedTimeSlot.value && currentAssignee.value)
})

// Helper functions
const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const getRoleAvatarClass = (role) => {
  const classes = {
    'manager': 'bg-blue-100 text-blue-700',
    'salesman': 'bg-purple-100 text-purple-700',
    'operator': 'bg-orange-100 text-orange-700'
  }
  return classes[role] || 'bg-surfaceSecondary text-body'
}

// Select an alternative assignee
const selectAlternative = (alternative) => {
  selectedAssignee.value = alternative.assigneeId
  showAlternatives.value = false
  showAssigneeChange.value = false
}

// Watch for date changes to reset time slot
watch(appointmentDate, () => {
  selectedTimeSlot.value = ''
  showAlternatives.value = false
  if (appointmentDate.value) {
    const date = new Date(appointmentDate.value)
    selectedDay.value = date.getDate()
    currentMonth.value = date.getMonth()
    currentYear.value = date.getFullYear()
  }
})

// Watch for assignee changes to reset time slot
watch(() => currentAssignee.value, () => {
  selectedTimeSlot.value = ''
  showAlternatives.value = false
})

// Initialize assignee immediately
if (props.preselectedAssignee) {
  selectedAssignee.value = `${props.preselectedAssignee.type}-${props.preselectedAssignee.id}`
} else {
  selectedAssignee.value = `user-${userStore.currentUser?.id || 1}`
}

// Watch for preselectedAssignee changes
watch(() => props.preselectedAssignee, (newVal) => {
  if (newVal) {
    selectedAssignee.value = `${newVal.type}-${newVal.id}`
  }
}, { immediate: true })

const handleConfirm = () => {
  if (!isValid.value) return
  
  const [type, id] = currentAssignee.value.split('-')
  const numericId = parseInt(id)
  const isTeam = type === 'team'
  
  let assigneeData = {}
  
  if (isTeam) {
    const team = usersStore.getTeamById(numericId)
    assigneeData = {
      assigneeType: 'team',
      teamId: numericId,
      team: team?.name || 'Unknown Team',
      assignee: null,
      assigneeId: null
    }
  } else {
    const selectedUser = usersStore.getUserById(numericId)
    assigneeData = {
      assigneeType: 'user',
      assigneeId: numericId,
      assignee: selectedUser?.name || 'Unknown',
      teamId: null,
      team: null
    }
  }
  
  emit('confirm', {
    type: appointmentType.value,
    date: appointmentDate.value,
    time: selectedTimeSlot.value,
    duration: duration.value,
    ...assigneeData
  })
  
  // Reset form
  appointmentType.value = ''
  appointmentDate.value = ''
  selectedTimeSlot.value = ''
  showAssigneeChange.value = false
  showAlternatives.value = false
}

const handleCancel = () => {
  emit('cancel')
}
</script>
