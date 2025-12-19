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
        >
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
      <button 
        @click="handleCreate"
        class="btn-primary"
      >
        Create Event
      </button>
    </template>
  </ModalShell>
</template>

<script setup>
import { ref, watch } from 'vue'
import ModalShell from '@/components/shared/ModalShell.vue'

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
  }
})

const emit = defineEmits(['create', 'cancel'])

const localEvent = ref({
  type: 'test-drive',
  title: '',
  date: '',
  time: '',
  customer: '',
  dealership: ''
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    localEvent.value = {
      type: 'test-drive',
      title: '',
      date: props.initialDate || '',
      time: '',
      customer: '',
      dealership: ''
    }
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

