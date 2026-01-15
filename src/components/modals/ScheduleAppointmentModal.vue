<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Schedule Appointment</DialogTitle>
          <DialogDescription>Book an appointment with the customer</DialogDescription>
        </DialogHeader>

        <div class="space-y-4">
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1.5">Appointment Type</label>
        <select v-model="appointmentType" class="input">
          <option value="" disabled>Select type...</option>
          <option>Showroom Visit</option>
          <option>Test Drive</option>
          <option>Video Call</option>
          <option>Home Visit</option>
          <option>Closing Meeting</option>
        </select>
      </div>
      
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1.5">Assign to</label>
        <select v-model="selectedAssignee" class="input">
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
        <p v-if="isTeamSelected" class="text-xs text-gray-500 mt-1">
          <i class="fa-solid fa-users text-gray-400"></i> Any available team member will be assigned
        </p>
      </div>
      
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1.5">Select Date</label>
        <input type="date" v-model="appointmentDate" @change="showTimeslots = true" class="input">
      </div>
      
      <div v-if="showTimeslots" class="animate-fade-in">
        <label class="block text-xs font-medium text-gray-500 mb-2">Available Slots</label>
        <div class="grid grid-cols-4 gap-2">
          <button 
            v-for="slot in ['09:00', '10:30', '11:00', '14:30', '15:00', '16:30']"
            :key="slot"
            @click="selectedTimeSlot = slot"
            class="py-2 border border-gray-200 rounded-lg text-xs font-medium transition-all"
            :class="selectedTimeSlot === slot ? 'border-blue-500 bg-blue-50 text-blue-600' : 'text-slate-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600'"
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
            class="rounded-sm w-full sm:w-auto"
            @click="handleClose"
          />
          <Button
            label="Confirm Appointment"
            variant="primary"
            size="small"
            class="rounded-sm w-full sm:w-auto !bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
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

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'confirm'])

const userStore = useUserStore()
const usersStore = useUsersStore()

const appointmentType = ref('')
const selectedAssignee = ref(null)
const appointmentDate = ref('')
const showTimeslots = ref(false)
const selectedTimeSlot = ref('')

// Get assignable users and teams from store
const assignableUsers = computed(() => usersStore.assignableUsers)
const assignableTeams = computed(() => usersStore.assignableTeams)

// Check if a team is selected
const isTeamSelected = computed(() => {
  return selectedAssignee.value && selectedAssignee.value.startsWith('team-')
})

// Check if form is valid
const isValid = computed(() => {
  return !!(appointmentType.value && appointmentDate.value && selectedTimeSlot.value && selectedAssignee.value)
})

// Set default assignee to current user
onMounted(() => {
  selectedAssignee.value = `user-${userStore.currentUser?.id || 1}`
})

// Reset form when modal is closed
watch(() => props.show, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})

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
