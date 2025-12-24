<template>
  <div v-if="show" class="space-y-4 animate-fade-in">
    <div>
      <label class="block text-xs font-medium text-gray-500 mb-1.5">Appointment Type</label>
      <select v-model="appointmentType" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none appearance-none cursor-pointer transition-colors shadow-sm">
        <option value="" disabled>Select type...</option>
        <option>Showroom Visit</option>
        <option>Test Drive</option>
        <option>Video Call</option>
        <option>Home Visit</option>
        <option>Closing Meeting</option>
      </select>
    </div>
    <div>
      <label class="block text-xs font-medium text-gray-500 mb-1.5">Assign to Salesman</label>
      <select v-model="selectedUserId" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none appearance-none cursor-pointer transition-colors shadow-sm">
        <option v-for="user in assignableUsers" :key="user.id" :value="user.id">
          {{ user.name }}{{ user.id === userStore.currentUser?.id ? ' (Me)' : '' }}
        </option>
      </select>
    </div>
    <div>
      <label class="block text-xs font-medium text-gray-500 mb-1.5">Select Date</label>
      <input type="date" v-model="appointmentDate" @change="showTimeslots = true" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none shadow-sm transition-colors cursor-pointer">
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
    <div class="flex gap-3 pt-2">
      <button 
        @click="handleCancel"
        class="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium py-2.5 rounded-lg text-sm transition-colors"
      >
        Cancel
      </button>
      <button 
        @click="handleConfirm"
        class="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors shadow-sm shadow-green-100 flex items-center justify-center gap-2"
      >
        Confirm Appointment <i class="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useUsersStore } from '@/stores/users'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const userStore = useUserStore()
const usersStore = useUsersStore()

const appointmentType = ref('')
const selectedUserId = ref(null)
const appointmentDate = ref('')
const showTimeslots = ref(false)
const selectedTimeSlot = ref('')

// Get assignable users from store
const assignableUsers = computed(() => usersStore.assignableUsers)

// Set default assignee to current user
onMounted(() => {
  selectedUserId.value = userStore.currentUser?.id || 1
})

// Reset form when component is hidden
watch(() => props.show, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})

const resetForm = () => {
  appointmentType.value = ''
  selectedUserId.value = userStore.currentUser?.id || 1
  appointmentDate.value = ''
  showTimeslots.value = false
  selectedTimeSlot.value = ''
}

const handleConfirm = () => {
  if (!appointmentType.value || !appointmentDate.value || !selectedTimeSlot.value) {
    alert('Please fill in all required fields: Type, Date, and Time')
    return
  }
  
  const selectedUser = usersStore.getUserById(selectedUserId.value)
  const appointmentDateTime = `${appointmentDate.value}T${selectedTimeSlot.value}:00`
  
  emit('confirm', {
    type: appointmentType.value,
    assignee: selectedUser?.name || 'Unknown',
    assigneeId: selectedUserId.value,
    date: appointmentDate.value,
    time: selectedTimeSlot.value,
    datetime: appointmentDateTime,
    location: '',
    notes: ''
  })
  
  resetForm()
}

const handleCancel = () => {
  resetForm()
  emit('cancel')
}
</script>

