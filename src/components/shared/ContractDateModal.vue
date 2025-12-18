<template>
  <Teleport to="body">
    <div 
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="handleCancel"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fade-in">
        <div class="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 class="font-bold text-lg text-gray-900">Set Contract Signing Date</h3>
          <p class="text-xs text-gray-500 mt-1">Record when the contract was signed to track delivery timeline</p>
        </div>
        
        <div class="p-5 space-y-4">
          <!-- Contract Date -->
          <div>
            <label class="block label-upper mb-2">Contract Date</label>
            <input 
              type="date"
              v-model="contractDate"
              :max="maxDate"
              class="input"
            />
          </div>
          
          <!-- Contract Time -->
          <div>
            <label class="block label-upper mb-2">Time (Optional)</label>
            <input 
              type="time"
              v-model="contractTime"
              class="input"
            />
          </div>
          
          <!-- Notes -->
          <div>
            <label class="block label-upper mb-2">Notes (Optional)</label>
            <textarea 
              v-model="notes"
              rows="3"
              placeholder="Add any relevant notes about the contract signing..."
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
            :disabled="!contractDate"
            class="bg-green-600 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Set Contract Date
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

const contractDate = ref('')
const contractTime = ref('')
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
    contractDate.value = today.toISOString().split('T')[0]
    contractTime.value = today.toTimeString().slice(0, 5)
    notes.value = ''
  }
})

const handleConfirm = () => {
  if (!contractDate.value) return
  
  // Combine date and time
  const datetime = contractTime.value 
    ? `${contractDate.value}T${contractTime.value}:00`
    : `${contractDate.value}T12:00:00`
  
  emit('confirm', {
    contractDate: datetime,
    notes: notes.value
  })
}

const handleCancel = () => {
  emit('cancel')
}
</script>

