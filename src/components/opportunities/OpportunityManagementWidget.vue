<template>
  <div
    v-if="opportunity && opportunity.stage === 'Open'"
    class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8"
  >
    <div class="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
      <h3 class="font-bold text-slate-800 text-sm">Manage this opportunity</h3>
      <span class="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-medium">Active</span>
    </div>

    <div class="p-5 space-y-6">
      <!-- Vehicle Actions Section -->
      <div v-if="opportunity.vehicle">
        <!-- Vehicle in stock -->
        <div v-if="opportunity.vehicle.stockDays !== null && opportunity.vehicle.stockDays !== undefined" class="bg-green-50/50 border border-green-100 rounded-lg p-4 relative transition-all duration-300">
          <div class="flex justify-between items-start mb-3">
            <div>
              <h4 class="font-bold text-slate-800 text-sm">Next Step: Add Vehicle</h4>
              <p class="text-xs text-gray-500 mt-0.5">The requested vehicle is available. Add it to the opportunity to proceed.</p>
            </div>
          </div>
          <button
            @click="openModal('Add requested vehicle to opportunity')"
            class="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
          >
            Add requested vehicle to opportunity
          </button>
        </div>
        
        <!-- Vehicle out of stock -->
        <div v-else class="bg-orange-50/50 border border-orange-100 rounded-lg p-4 relative transition-all duration-300">
          <div class="flex justify-between items-start mb-3">
            <div>
              <h4 class="font-bold text-slate-800 text-sm">Next Step: Find Alternative</h4>
              <p class="text-xs text-gray-500 mt-0.5">The requested vehicle is currently out of stock. Explore other options.</p>
            </div>
          </div>
          <div class="flex gap-3 flex-wrap">
            <button
              @click="openModal('Add vehicle from stock')"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
            >
              Add vehicle from stock
            </button>
            <button
              @click="openModal('Configure vehicle')"
              class="bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
            >
              Configure vehicle
            </button>
          </div>
        </div>
      </div>

      <!-- Appointment Section -->
      <div v-if="scheduledAppointment" class="bg-blue-50/50 border border-blue-100 rounded-lg p-4 relative transition-all duration-300">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h4 class="font-bold text-slate-800 text-sm">Next Appointment</h4>
            <p class="text-xs text-gray-500 mt-0.5">
              {{ scheduledAppointment.title }} on {{ formatDate(scheduledAppointment.start) }} at {{ formatTime(scheduledAppointment.start) }}
            </p>
          </div>
        </div>
        <button
          @click="showReschedule = true"
          class="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
        >
          Postpone
        </button>
        <RescheduleWidget
          :show="showReschedule"
          @close="showReschedule = false"
          @confirm="handleReschedule"
        />
      </div>
      
      <!-- No Appointment - Schedule Button -->
      <div v-else class="bg-gray-50/50 border border-gray-100 rounded-lg p-4 relative transition-all duration-300">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h4 class="font-bold text-slate-800 text-sm">No Appointment Scheduled</h4>
            <p class="text-xs text-gray-500 mt-0.5">Schedule a new appointment to move the opportunity forward.</p>
          </div>
        </div>
        <button
          @click="openModal('Schedule appointment')"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
        >
          Schedule appointment
        </button>
      </div>
    </div>

    <ComingSoonModal
      :show="showModal"
      :title="modalTitle"
      @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RescheduleWidget from '@/components/shared/RescheduleWidget.vue'
import ComingSoonModal from '@/components/shared/ComingSoonModal.vue'

const props = defineProps({
  opportunity: {
    type: Object,
    required: true
  },
  scheduledAppointment: {
    type: Object,
    default: null
  }
})

const showReschedule = ref(false)
const showModal = ref(false)
const modalTitle = ref('')

const openModal = (title) => {
  modalTitle.value = title
  showModal.value = true
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const handleReschedule = (newDateTime) => {
  showReschedule.value = false
  // Implement actual reschedule logic here
}
</script>
