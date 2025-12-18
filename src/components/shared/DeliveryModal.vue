<template>
  <Teleport to="body">
    <div 
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="handleCancel"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fade-in">
        <div class="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 class="font-bold text-lg text-gray-900">Mark as Delivered</h3>
          <p class="text-xs text-gray-500 mt-1">Record the vehicle delivery date and details</p>
        </div>
        
        <div class="p-5 space-y-4">
          <!-- Delivery Date -->
          <div>
            <label class="block label-upper mb-2">Delivery Date</label>
            <input 
              type="date"
              v-model="deliveryDate"
              :max="maxDate"
              class="input"
            />
          </div>
          
          <!-- Delivery Time -->
          <div>
            <label class="block label-upper mb-2">Time (Optional)</label>
            <input 
              type="time"
              v-model="deliveryTime"
              class="input"
            />
          </div>
          
          <!-- Delivery Location -->
          <div>
            <label class="block label-upper mb-2">Delivery Location</label>
            <select 
              v-model="deliveryLocation"
              class="input"
            >
              <option value="">Select location...</option>
              <option value="Dealership">At Dealership</option>
              <option value="Customer Address">Customer Address</option>
              <option value="Other">Other Location</option>
            </select>
          </div>
          
          <!-- Notes -->
          <div>
            <label class="block label-upper mb-2">Delivery Notes</label>
            <textarea 
              v-model="notes"
              rows="3"
              placeholder="Add any relevant delivery details, customer feedback, etc..."
              class="input resize-none"
            ></textarea>
          </div>
        </div>
        
        <div class="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          <button 
            @click="handleCancel"
            class="btn-secondary text-sm"
          >
            Cancel
          </button>
          <button 
            @click="handleConfirm"
            :disabled="!deliveryDate || !deliveryLocation"
            class="bg-green-600 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Mark as Delivered
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { Teleport } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const deliveryDate = ref('')
const deliveryTime = ref('')
const deliveryLocation = ref('')
const notes = ref('')

// Max date is today
const maxDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Reset form when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    // Default to today
    const today = new Date()
    deliveryDate.value = today.toISOString().split('T')[0]
    deliveryTime.value = today.toTimeString().slice(0, 5)
    deliveryLocation.value = ''
    notes.value = ''
  }
})

const handleConfirm = () => {
  if (!deliveryDate.value || !deliveryLocation.value) return
  
  // Combine date and time
  const datetime = deliveryTime.value 
    ? `${deliveryDate.value}T${deliveryTime.value}:00`
    : `${deliveryDate.value}T12:00:00`
  
  emit('confirm', {
    deliveryDate: datetime,
    location: deliveryLocation.value,
    notes: notes.value
  })
}

const handleCancel = () => {
  emit('cancel')
}
</script>

