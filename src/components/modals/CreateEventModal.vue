<template>
  <ModalShell
    :show="show"
    title="Create New Event"
    subtitle="Fill in the details for the new event."
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
        <label class="block label-upper mb-2">Dealership</label>
        <select v-model="localEvent.dealership" class="input">
          <option value="">Select dealership...</option>
          <option v-for="d in dealerships" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>
    </div>

    <template #actions>
      <Button
        label="Create Event"
        variant="primary"
        size="small"
        class="rounded-sm"
        @click="handleCreate"
      />
    </template>
  </ModalShell>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { Button } from '@motork/component-library'
import ModalShell from '@/components/shared/ModalShell.vue'
import { useUserStore } from '@/stores/user'
import { useUsersStore } from '@/stores/users'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  initialDate: {
    type: String,
    default: ''
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

const emit = defineEmits(['create', 'cancel'])

const userStore = useUserStore()
const usersStore = useUsersStore()

const assignableUsers = computed(() => usersStore.assignableUsers)
const assignableTeams = computed(() => usersStore.assignableTeams)

const isTeamSelected = computed(() => {
  return localEvent.value.assignee && localEvent.value.assignee.startsWith('team-')
})

const localEvent = ref({
  type: 'test-drive',
  title: '',
  date: '',
  time: '',
  customer: '',
  assignee: '',
  dealership: ''
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    const defaultAssignee = props.assignee || `user-${userStore.currentUser?.id || 1}`
    localEvent.value = {
      type: 'test-drive',
      title: '',
      date: props.initialDate || '',
      time: '',
      customer: props.customer?.name || '',
      assignee: defaultAssignee,
      dealership: ''
    }
  }
})

onMounted(() => {
  if (!localEvent.value.assignee) {
    localEvent.value.assignee = props.assignee || `user-${userStore.currentUser?.id || 1}`
  }
})

const handleCreate = () => {
  if (localEvent.value.title && localEvent.value.date) {
    emit('create', { ...localEvent.value })
  }
}

const handleCancel = () => {
  emit('cancel')
}
</script>





