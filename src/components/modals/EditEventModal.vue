<template>
  <ModalShell
    :show="show"
    title="Edit Event"
    subtitle="Update the event details."
    @cancel="handleCancel"
  >
    <div class="space-y-4">
      <div>
        <label class="block label-upper mb-2">Event Type</label>
        <select v-model="localEvent.type" class="input">
          <option value="test-drive">Test Drive</option>
          <option value="appointment">Dealership Visit</option>
          <option value="offsite">Offsite Visit</option>
          <option value="workshop">Workshop</option>
          <option value="call">Call</option>
          <option value="delivery">Delivery</option>
          <option value="meeting">Meeting</option>
          <option value="training">Training</option>
          <option value="marketing">Marketing Event</option>
          <option value="leave">Leave</option>
          <option value="memo">Memo</option>
          <option value="recall">Recall</option>
          <option value="absence">Absence</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div>
        <label class="block label-upper mb-2">Title</label>
        <input 
          v-model="localEvent.title"
          type="text" 
          placeholder="Event title..." 
          class="input"
        >
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block label-upper mb-2">Date</label>
          <input 
            v-model="localEvent.date"
            type="date" 
            class="input"
          >
        </div>
        <div>
          <label class="block label-upper mb-2">Time</label>
          <input 
            v-model="localEvent.time"
            type="time" 
            class="input"
          >
        </div>
      </div>
      
      <div>
        <label class="block label-upper mb-2">Customer</label>
        <input 
          v-model="localEvent.customer"
          type="text" 
          placeholder="Customer name..." 
          class="input"
          :disabled="disabledFields.includes('customer')"
          :value="customer?.name || localEvent.customer"
        >
      </div>
      
      <div>
        <label class="block label-upper mb-2">Assign to</label>
        <select 
          v-model="localEvent.assignee" 
          class="input"
          :disabled="disabledFields.includes('assignee')"
        >
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
        <label class="block label-upper mb-2">Vehicle</label>
        <input 
          v-model="localEvent.vehicle"
          type="text" 
          placeholder="Vehicle..." 
          class="input"
        >
      </div>
      
      <div>
        <label class="block label-upper mb-2">Dealership</label>
        <select v-model="localEvent.dealership" class="input">
          <option value="">Select dealership...</option>
          <option v-for="d in dealerships" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>
      
      <div>
        <label class="block label-upper mb-2">Status</label>
        <select v-model="localEvent.status" class="input">
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No-show</option>
        </select>
      </div>
    </div>

    <template #actions>
      <button 
        @click="handleSave"
        class="btn-primary"
      >
        Save Changes
      </button>
    </template>
  </ModalShell>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import ModalShell from '@/components/shared/ModalShell.vue'
import { useUserStore } from '@/stores/user'
import { useUsersStore } from '@/stores/users'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  event: {
    type: Object,
    default: null
  },
  dealerships: {
    type: Array,
    default: () => []
  },
  customer: {
    type: Object,
    default: null
  },
  assignee: {
    type: String,
    default: null
  },
  disabledFields: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['save', 'cancel'])

const userStore = useUserStore()
const usersStore = useUsersStore()

const assignableUsers = computed(() => usersStore.assignableUsers)
const assignableTeams = computed(() => usersStore.assignableTeams)

const isTeamSelected = computed(() => {
  return localEvent.value.assignee && localEvent.value.assignee.startsWith('team-')
})

const localEvent = ref({
  id: null,
  type: 'test-drive',
  title: '',
  date: '',
  time: '',
  customer: '',
  assignee: '',
  vehicle: '',
  dealership: '',
  status: 'confirmed'
})

watch(() => [props.show, props.event], ([newShow, newEvent]) => {
  if (newShow && newEvent) {
    try {
      const startDate = newEvent.start ? new Date(newEvent.start) : new Date()
      if (isNaN(startDate.getTime())) {
        throw new Error('Invalid date')
      }
      // Extract assignee from event (could be assigneeId or assignee string)
      const eventAssignee = newEvent.assigneeId 
        ? `user-${newEvent.assigneeId}` 
        : (newEvent.assignee || props.assignee || `user-${userStore.currentUser?.id || 1}`)
      
      localEvent.value = {
        id: newEvent.id,
        type: newEvent.type || 'test-drive',
        title: newEvent.title || '',
        date: startDate.toISOString().split('T')[0],
        time: startDate.toTimeString().slice(0, 5),
        customer: props.customer?.name || newEvent.customer || '',
        assignee: eventAssignee,
        vehicle: newEvent.vehicle || '',
        dealership: newEvent.dealership || '',
        status: newEvent.status || 'confirmed'
      }
    } catch (error) {
      console.error('Error parsing event date:', error)
      // Set default values if date parsing fails
      const now = new Date()
      const eventAssignee = newEvent.assigneeId 
        ? `user-${newEvent.assigneeId}` 
        : (newEvent.assignee || props.assignee || `user-${userStore.currentUser?.id || 1}`)
      
      localEvent.value = {
        id: newEvent.id,
        type: newEvent.type || 'test-drive',
        title: newEvent.title || '',
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().slice(0, 5),
        customer: props.customer?.name || newEvent.customer || '',
        assignee: eventAssignee,
        vehicle: newEvent.vehicle || '',
        dealership: newEvent.dealership || '',
        status: newEvent.status || 'confirmed'
      }
    }
  }
})

const handleSave = () => {
  if (localEvent.value.title && localEvent.value.date) {
    emit('save', { ...localEvent.value })
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>



