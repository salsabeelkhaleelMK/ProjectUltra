<template>
  <ModalShell :show="show" @close="$emit('close')" title="Schedule Callback">
    <div class="space-y-5">
      <p class="text-sm text-gray-600">
        Schedule a callback with {{ entityName }} to follow up at a convenient time.
      </p>

      <!-- Callback Date & Time -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">
            Callback Date <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="formData.date"
            type="date"
            :min="minDate"
            required
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-2">
            Callback Time <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="formData.time"
            type="time"
            required
            class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Callback Reason -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2">
          Reason for Callback
        </label>
        <select 
          v-model="formData.reason"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a reason...</option>
          <option value="customer-requested">Customer Requested</option>
          <option value="follow-up-quote">Follow up on Quote</option>
          <option value="financing-discussion">Financing Discussion</option>
          <option value="trade-in-evaluation">Trade-in Evaluation</option>
          <option value="vehicle-availability">Vehicle Availability Update</option>
          <option value="general-inquiry">General Inquiry</option>
          <option value="other">Other</option>
        </select>
      </div>

      <!-- Notes -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2">
          Callback Notes
        </label>
        <textarea 
          v-model="formData.notes"
          rows="3"
          placeholder="Add any relevant notes about this callback..."
          class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        ></textarea>
      </div>

      <!-- Assignee (optional) -->
      <div v-if="showAssignee">
        <label class="block text-sm font-semibold text-slate-700 mb-2">
          Assign To
        </label>
        <select 
          v-model="formData.assigneeId"
          class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option :value="null">Current Owner</option>
          <option 
            v-for="user in availableUsers" 
            :key="user.id" 
            :value="user.id"
          >
            {{ user.name }}
          </option>
        </select>
      </div>

      <!-- Set Reminder -->
      <div class="flex items-center gap-2">
        <input 
          v-model="formData.setReminder"
          type="checkbox"
          id="reminder"
          class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label for="reminder" class="text-sm text-slate-700">
          Set reminder 15 minutes before callback
        </label>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-3 pt-2">
        <button
          @click="handleConfirm"
          :disabled="!isValid"
          class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
        >
          <i class="fa-solid fa-calendar-check mr-2"></i>
          Schedule Callback
        </button>
        <button
          @click="$emit('close')"
          class="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-slate-700 font-medium rounded-lg text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </ModalShell>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ModalShell from '@/components/shared/ModalShell.vue'
import { mockUsers } from '@/api/mockData'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  entityType: {
    type: String,
    default: 'lead' // 'lead' or 'opportunity'
  },
  entityName: {
    type: String,
    default: 'the customer'
  },
  currentAssigneeId: {
    type: Number,
    default: null
  },
  showAssignee: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'scheduled'])

const formData = ref({
  date: '',
  time: '',
  reason: '',
  notes: '',
  assigneeId: null,
  setReminder: true
})

const availableUsers = ref([])

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const isValid = computed(() => {
  return formData.value.date && formData.value.time
})

onMounted(() => {
  // Set default date to tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  formData.value.date = tomorrow.toISOString().split('T')[0]
  
  // Set default time to 10:00 AM
  formData.value.time = '10:00'
  
  // Load available users
  availableUsers.value = mockUsers
  
  // Set default assignee
  formData.value.assigneeId = props.currentAssigneeId
})

function handleConfirm() {
  if (!isValid.value) return
  
  const callbackData = {
    date: formData.value.date,
    time: formData.value.time,
    dateTime: `${formData.value.date}T${formData.value.time}:00`,
    reason: formData.value.reason,
    notes: formData.value.notes,
    assigneeId: formData.value.assigneeId || props.currentAssigneeId,
    assignee: availableUsers.value.find(u => u.id === (formData.value.assigneeId || props.currentAssigneeId))?.name,
    setReminder: formData.value.setReminder
  }
  
  emit('scheduled', callbackData)
  emit('close')
}
</script>

