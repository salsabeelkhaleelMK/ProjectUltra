<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-lg">
        <DialogHeader>
          <DialogTitle class="text-fluid-lg">Schedule Appointment</DialogTitle>
          <DialogDescription class="text-fluid-xs">Book an appointment with the customer</DialogDescription>
        </DialogHeader>

        <div class="space-y-4">
      <div>
        <label class="block text-fluid-xs font-medium text-sub mb-1.5">Appointment Type</label>
        <select v-model="appointmentType" class="input text-fluid-sm">
          <option value="" disabled>Select type...</option>
          <option>Showroom Visit</option>
          <option>Test Drive</option>
          <option>Video Call</option>
          <option>Home Visit</option>
          <option>Closing Meeting</option>
        </select>
      </div>
      
      <div>
        <label class="block text-fluid-xs font-medium text-sub mb-1.5">Select Date</label>
        <input type="date" v-model="appointmentDate" :min="minDate" class="input text-fluid-sm">
      </div>
      
      <!-- Assigned To Display -->
      <div v-if="selectedAssignee" class="bg-surfaceSecondary border border-E5E7EB rounded-lg p-3">
        <div class="flex items-center justify-between mb-2">
          <label class="text-fluid-xs font-medium text-sub">Assigned to</label>
          <button 
            @click="showAssigneeChange = !showAssigneeChange"
            class="text-fluid-xs text-sub hover:text-brand-dark hover:underline font-medium transition-colors"
          >
            {{ showAssigneeChange ? 'Cancel' : 'Change' }}
          </button>
        </div>
        
        <div v-if="!showAssigneeChange" class="flex items-center gap-3">
          <div 
            class="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-fluid-sm"
            :class="currentAssigneeDisplay.avatarClass"
          >
            <i v-if="isTeamSelected" class="fa-solid fa-users text-fluid-sm"></i>
            <span v-else>{{ currentAssigneeDisplay.initials }}</span>
          </div>
          <div class="flex-1">
            <p class="font-medium text-fluid-sm text-heading">{{ currentAssigneeDisplay.name }}</p>
            <p class="text-fluid-xs text-sub capitalize">{{ currentAssigneeDisplay.subtitle }}</p>
          </div>
        </div>
        
        <!-- Change Assignee -->
        <div v-else class="animate-fade-in">
          <select v-model="selectedAssignee" class="input text-fluid-sm">
            <optgroup label="Teams">
              <option v-for="team in assignableTeams" :key="`team-${team.id}`" :value="`team-${team.id}`">
                {{ team.name }} Team
              </option>
            </optgroup>
            <optgroup label="Users">
              <option v-for="user in assignableUsers" :key="`user-${user.id}`" :value="`user-${user.id}`">
                {{ user.name }}{{ user.id === userStore.currentUser?.id ? ' (Me)' : '' }}
              </option>
            </optgroup>
          </select>
        </div>
      </div>
      
      <!-- Availability Status -->
      <div v-if="appointmentDate && selectedAssignee">
        <div v-if="availabilityStatus === 'none'" class="bg-amber-50 border border-amber-200 rounded-lg p-3 animate-fade-in">
          <div class="flex items-start gap-2">
            <i class="fa-solid fa-calendar-xmark text-amber-600 mt-0.5"></i>
            <div class="flex-1">
              <p class="text-fluid-sm font-medium text-amber-900">No availability on this date</p>
              <p class="text-fluid-xs text-amber-700 mt-1">
                Try selecting a different date or 
                <button @click="showAlternatives = !showAlternatives" class="underline font-medium">
                  view other {{ isTeamSelected ? 'teams' : 'salespeople' }}
                </button>
              </p>
            </div>
          </div>
          
          <!-- Show Alternatives -->
          <div v-if="showAlternatives && alternatives.length > 0" class="mt-3 pt-3 border-t border-amber-200">
            <p class="text-fluid-xs font-medium text-amber-900 mb-2">Available alternatives:</p>
            <div class="space-y-1">
              <button
                v-for="alt in alternatives.slice(0, 3)"
                :key="alt.assigneeId"
                @click="selectAlternative(alt)"
                class="w-full text-left p-2 rounded bg-white hover:bg-amber-50 border border-amber-200 transition-colors"
              >
                <p class="text-fluid-sm font-medium text-heading">{{ alt.name }}</p>
                <p class="text-fluid-xs text-sub">{{ alt.slotCount }} slots available</p>
              </button>
            </div>
          </div>
        </div>
        
        <div v-else-if="availabilityStatus === 'limited'" class="bg-blue-50 border border-blue-200 rounded-lg p-3 animate-fade-in">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-clock text-blue-600"></i>
            <p class="text-fluid-sm text-blue-700">
              <span class="font-medium">Limited availability</span> - Book soon!
            </p>
          </div>
        </div>
        
        <div v-else-if="availabilityStatus === 'good'" class="bg-green-50 border border-green-200 rounded-lg p-3 animate-fade-in">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-check-circle text-green-600"></i>
            <p class="text-fluid-sm text-green-700">
              <span class="font-medium">Good availability</span> on this date
            </p>
          </div>
        </div>
      </div>
      
      <!-- Available Time Slots -->
      <div v-if="availableSlots.length > 0" class="animate-fade-in">
        <label class="block text-fluid-xs font-medium text-sub mb-2">Available Time Slots</label>
        <div class="grid grid-cols-4 gap-2">
          <button 
            v-for="slot in availableSlots"
            :key="slot"
            @click="selectedTimeSlot = slot"
            class="py-2 border rounded-lg text-fluid-xs font-medium transition-all"
            :class="selectedTimeSlot === slot 
              ? 'border-brand-dark bg-surfaceSecondary text-brand-dark' 
              : 'border-E5E7EB text-body hover:border-brand-dark/30 hover:bg-surfaceSecondary/50'"
          >
            {{ slot }}
          </button>
        </div>
      </div>
    </div>

        <DialogFooter class="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
          <Button
            label="Cancel"
            variant="outline"
            size="small"
            class="rounded-sm w-full sm:w-auto text-fluid-sm"
            @click="handleClose"
          />
          <Button
            label="Confirm Appointment"
            variant="primary"
            size="small"
            class="rounded-sm w-full sm:w-auto text-fluid-sm !bg-brand-black !hover:bg-brand-darkDarker !text-white !border-brand-black"
            :disabled="!isValid"
            @click="handleConfirm"
          />
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Button } from '@motork/component-library'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle
} from '@motork/component-library/future/primitives'
import { useUserStore } from '@/stores/user'
import { useUsersStore } from '@/stores/users'
import { 
  getAvailabilityForAssignee, 
  getAvailabilityStatus,
  findAlternativeAssignees 
} from '@/services/availabilityService'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  preselectedAssignee: {
    type: Object,
    default: null // { type: 'user', id: 1, name: 'John Smith', role: 'salesman' }
  }
})

const emit = defineEmits(['close', 'confirm'])

const userStore = useUserStore()
const usersStore = useUsersStore()

const appointmentType = ref('')
const selectedAssignee = ref(null)
const appointmentDate = ref('')
const selectedTimeSlot = ref('')
const showAssigneeChange = ref(false)
const showAlternatives = ref(false)

// Get assignable users and teams from store
const assignableUsers = computed(() => usersStore.assignableUsers)
const assignableTeams = computed(() => usersStore.assignableTeams)

// Get minimum date (today)
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Check if a team is selected
const isTeamSelected = computed(() => {
  return selectedAssignee.value && selectedAssignee.value.startsWith('team-')
})

// Get current assignee display info
const currentAssigneeDisplay = computed(() => {
  if (!selectedAssignee.value) return {}
  
  const [type, id] = selectedAssignee.value.split('-')
  const numericId = parseInt(id)
  
  if (type === 'team') {
    const team = usersStore.getTeamById(numericId)
    return {
      name: team?.name || 'Unknown Team',
      subtitle: 'Team',
      avatarClass: 'bg-green-100 text-green-700',
      initials: ''
    }
  } else {
    const user = usersStore.getUserById(numericId)
    return {
      name: user?.name || 'Unknown',
      subtitle: user?.role || 'User',
      avatarClass: getRoleAvatarClass(user?.role),
      initials: getInitials(user?.name)
    }
  }
})

// Get available slots for selected assignee and date
const availableSlots = computed(() => {
  if (!appointmentDate.value || !selectedAssignee.value) return []
  return getAvailabilityForAssignee(selectedAssignee.value, appointmentDate.value)
})

// Get availability status
const availabilityStatus = computed(() => {
  if (!appointmentDate.value || !selectedAssignee.value) return null
  return getAvailabilityStatus(selectedAssignee.value, appointmentDate.value)
})

// Get alternative assignees when no availability
const alternatives = computed(() => {
  if (!appointmentDate.value || !selectedAssignee.value) return []
  if (availabilityStatus.value !== 'none') return []
  
  // Combine all users and teams
  const allAssignees = [
    ...assignableTeams.value.map(t => ({ ...t, type: 'team' })),
    ...assignableUsers.value.map(u => ({ ...u, type: 'user' }))
  ]
  
  return findAlternativeAssignees(selectedAssignee.value, appointmentDate.value, allAssignees)
})

// Check if form is valid
const isValid = computed(() => {
  return !!(appointmentType.value && appointmentDate.value && selectedTimeSlot.value && selectedAssignee.value)
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

// Initialize assignee when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    initializeAssignee()
  } else {
    resetForm()
  }
})

// Watch for date changes to reset time slot
watch(appointmentDate, () => {
  selectedTimeSlot.value = ''
  showAlternatives.value = false
})

// Watch for assignee changes to reset time slot
watch(selectedAssignee, () => {
  selectedTimeSlot.value = ''
  showAlternatives.value = false
})

const initializeAssignee = () => {
  if (props.preselectedAssignee) {
    // Use preselected assignee from previous step
    const { type, id } = props.preselectedAssignee
    selectedAssignee.value = `${type}-${id}`
  } else {
    // Default to current user
    selectedAssignee.value = `user-${userStore.currentUser?.id || 1}`
  }
}

const resetForm = () => {
  appointmentType.value = ''
  selectedAssignee.value = `user-${userStore.currentUser?.id || 1}`
  appointmentDate.value = ''
  showTimeslots.value = false
  selectedTimeSlot.value = ''
}

const handleOpenChange = (isOpen) => {
  if (!isOpen) {
    emit('close')
  }
}

const handleConfirm = () => {
  if (!isValid.value) {
    return
  }
  
  const isTeam = selectedAssignee.value.startsWith('team-')
  const id = parseInt(selectedAssignee.value.split('-')[1])
  
  let assigneeData = {}
  
  if (isTeam) {
    const team = usersStore.getTeamById(id)
    assigneeData = {
      assigneeType: 'team',
      teamId: id,
      team: team?.name || 'Unknown Team',
      assignee: null,
      assigneeId: null
    }
  } else {
    const selectedUser = usersStore.getUserById(id)
    assigneeData = {
      assigneeType: 'user',
      assigneeId: id,
      assignee: selectedUser?.name || 'Unknown',
      teamId: null,
      team: null
    }
  }
  
  emit('confirm', {
    type: appointmentType.value,
    date: appointmentDate.value,
    time: selectedTimeSlot.value,
    ...assigneeData
  })
  
  emit('close')
}

const handleClose = () => {
  emit('close')
}
</script>
