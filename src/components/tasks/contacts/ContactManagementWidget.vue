<template>
  <div
    v-if="contact"
    class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
  >
    <div class="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-user-circle text-gray-400 text-xs"></i>
        <h3 class="font-bold text-slate-800 text-sm">Contact Management</h3>
      </div>
    </div>

    <div class="p-5 space-y-4">
      <!-- Warning if no requested car -->
      <div 
        v-if="!contact.requestedCar"
        class="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3"
      >
        <i class="fa-solid fa-exclamation-triangle text-orange-600 text-lg mt-0.5"></i>
        <div class="flex-1">
          <p class="text-sm font-semibold text-orange-900 mb-1">No Requested Car</p>
          <p class="text-xs text-orange-700">
            Add a requested car to this contact before converting to a lead or opportunity.
          </p>
        </div>
      </div>

      <!-- Success message if car exists -->
      <div 
        v-else
        class="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3"
      >
        <i class="fa-solid fa-check-circle text-green-600 text-lg mt-0.5"></i>
        <div class="flex-1">
          <p class="text-sm font-semibold text-green-900 mb-1">Requested Car Added</p>
          <p class="text-xs text-green-700">
            {{ contact.requestedCar.brand }} {{ contact.requestedCar.model }} ({{ contact.requestedCar.year }})
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="space-y-3">
        <!-- Add/Edit Requested Car -->
        <button 
          @click="showAddCarModal = true"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <i class="fa-solid fa-car"></i>
          {{ contact.requestedCar ? 'Edit Requested Car' : 'Add Requested Car' }}
        </button>

        <div class="flex gap-3">
          <!-- Convert to Lead -->
          <button 
            @click="handleConvertToLead"
            :disabled="!contact.requestedCar || converting"
            :title="!contact.requestedCar ? 'Add a requested car first' : ''"
            class="flex-1 bg-white hover:bg-gray-50 border-2 border-blue-600 text-blue-600 font-medium px-4 py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
          >
            <i class="fa-solid fa-user-plus"></i>
            Convert to Lead
          </button>
          
          <!-- Convert to Opportunity -->
          <button 
            @click="handleConvertToOpportunity"
            :disabled="!contact.requestedCar || converting"
            :title="!contact.requestedCar ? 'Add a requested car first' : ''"
            class="flex-1 bg-white hover:bg-gray-50 border-2 border-purple-600 text-purple-600 font-medium px-4 py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
          >
            <i class="fa-solid fa-briefcase"></i>
            Convert to Opportunity
          </button>
        </div>
      </div>
    </div>
    
    <!-- Add Requested Car Modal -->
    <RequestedCarModal 
      :show="showAddCarModal"
      :contact="contact"
      @close="showAddCarModal = false"
      @saved="handleCarAdded"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import RequestedCarModal from '@/components/modals/RequestedCarModal.vue'

const props = defineProps({
  contact: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['car-added', 'convert-to-lead', 'convert-to-opportunity'])

const showAddCarModal = ref(false)
const converting = ref(false)

const handleCarAdded = (carData) => {
  emit('car-added', carData)
  showAddCarModal.value = false
}

const handleConvertToLead = () => {
  if (!props.contact.requestedCar || converting.value) return
  converting.value = true
  emit('convert-to-lead')
}

const handleConvertToOpportunity = () => {
  if (!props.contact.requestedCar || converting.value) return
  converting.value = true
  emit('convert-to-opportunity')
}
</script>

