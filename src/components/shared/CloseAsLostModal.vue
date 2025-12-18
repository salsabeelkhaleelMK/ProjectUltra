<template>
  <Teleport to="body">
    <div 
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="handleCancel"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-fade-in">
        <div class="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 class="font-bold text-lg text-gray-900">Close as Lost</h3>
          <p class="text-xs text-gray-500 mt-1">Document why this opportunity didn't close</p>
        </div>
        
        <div class="p-5 space-y-4">
          <!-- Reason Dropdown -->
          <div>
            <label class="block label-upper mb-2">Reason</label>
            <select 
              v-model="selectedReason"
              class="input"
            >
              <option value="">Select a reason...</option>
              <option value="Not interested">Not interested</option>
              <option value="Budget constraints">Budget constraints</option>
              <option value="Found better price">Found better price at competitor</option>
              <option value="No response">Customer not responding</option>
              <option value="Wrong timing">Timing not right</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <!-- Notes -->
          <div>
            <label class="block label-upper mb-2">Additional Notes</label>
            <textarea 
              v-model="notes"
              rows="4"
              placeholder="Add any relevant details about why this opportunity was lost..."
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
            :disabled="!selectedReason"
            class="bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Close as Lost
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Teleport } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['confirm', 'cancel'])

const selectedReason = ref('')
const notes = ref('')

// Reset form when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    selectedReason.value = ''
    notes.value = ''
  }
})

const handleConfirm = () => {
  if (!selectedReason.value) return
  emit('confirm', {
    reason: selectedReason.value,
    notes: notes.value
  })
}

const handleCancel = () => {
  emit('cancel')
}
</script>

