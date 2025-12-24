<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Left: Assignment -->
    <div class="space-y-4">
      <h3 class="font-semibold text-slate-800">Assign to salesman</h3>
      
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1.5">Dealership</label>
        <select 
          v-model="assignment.dealership" 
          class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
        >
          <option v-for="dealership in dealerships" :key="dealership" :value="dealership">
            {{ dealership }}
          </option>
        </select>
      </div>
      
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1.5">Team</label>
        <select 
          v-model="assignment.team" 
          class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
        >
          <option v-for="team in teams" :key="team" :value="team">
            {{ team }}
          </option>
        </select>
      </div>
      
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1.5">Assignee</label>
        <select 
          v-model="assignment.assigneeId" 
          class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
        >
          <option v-for="user in salespeople" :key="user.id" :value="user.id">
            {{ user.name }} {{ user.id === currentUser.id ? '(me)' : '' }}
          </option>
        </select>
      </div>
    </div>
    
    <!-- Right: Customer Preferences -->
    <div class="space-y-4">
      <h3 class="font-semibold text-slate-800">Customer preferences</h3>
      
      <div class="space-y-2">
        <label class="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            v-model="preferences.tradeIn" 
            class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span class="text-sm text-slate-700">Trade in</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            v-model="preferences.financing" 
            class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span class="text-sm text-slate-700">Financing options</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            v-model="preferences.contactAvailability" 
            class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span class="text-sm text-slate-700">Contact availability</span>
        </label>
      </div>
      
      <div>
        <label class="block text-xs font-medium text-gray-600 mb-1.5">Notes</label>
        <textarea 
          v-model="preferences.notes"
          placeholder="Add notes about customer preferences..."
          class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-blue-500 resize-none"
          rows="4"
        ></textarea>
      </div>
    </div>
  </div>
  
  <!-- Actions -->
  <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
    <button 
      @click="$emit('cancel')"
      class="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors"
    >
      Cancel
    </button>
    <button 
      @click="handleFinishWithoutAppointment"
      class="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors"
    >
      Finish without appointment
    </button>
    <button 
      @click="handleScheduleAppointment"
      class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors shadow-sm"
    >
      Schedule an appointment
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  lead: {
    type: Object,
    required: true
  },
  callNotes: {
    type: String,
    default: ''
  },
  extractedData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const usersStore = useUsersStore()
const userStore = useUserStore()

const salespeople = usersStore.salespeople
const currentUser = userStore.currentUser

const dealerships = ['Barcelona', 'Madrid', 'Valencia', 'Firenze', 'Milano', 'Roma']
const teams = ['Audi Sales (New)', 'Audi Sales (Used)', 'Sales (New)', 'Sales (Used)']

const assignment = ref({
  dealership: props.lead?.requestedCar?.dealership || 'Barcelona',
  team: 'Audi Sales (New)',
  assigneeId: currentUser.value?.id || 1
})

const preferences = ref({
  tradeIn: false,
  financing: false,
  contactAvailability: false,
  notes: ''
})

onMounted(() => {
  // Pre-populate from extracted data if available
  if (props.extractedData) {
    preferences.value.tradeIn = props.extractedData.tradeIn || false
    preferences.value.financing = props.extractedData.financing || false
    preferences.value.notes = props.extractedData.notes || props.callNotes || ''
  } else if (props.callNotes) {
    preferences.value.notes = props.callNotes
  }
})

const handleFinishWithoutAppointment = () => {
  emit('confirm', {
    assignment: assignment.value,
    preferences: preferences.value,
    scheduleAppointment: false
  })
}

const handleScheduleAppointment = () => {
  emit('confirm', {
    assignment: assignment.value,
    preferences: preferences.value,
    scheduleAppointment: true
  })
}
</script>
