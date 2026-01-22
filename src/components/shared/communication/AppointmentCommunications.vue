<template>
  <div class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
    <h5 class="font-semibold text-heading text-fluid-sm mb-4">Automated Appointment Communications</h5>
    
    <div class="space-y-1">
      <!-- Immediate Confirmation - Email -->
      <label class="flex items-center gap-2 cursor-pointer py-1 px-2 rounded-lg hover:bg-surfaceSecondary/50 transition-colors">
        <input
          type="checkbox"
          v-model="communications.immediateConfirmationEmail"
          class="w-4 h-4 appearance-none text-green-600 focus:ring-green-600 border-gray-300 rounded checkbox-green cursor-pointer"
        />
        <span class="text-fluid-sm font-medium text-heading">Send immediate confirmation email to customer</span>
      </label>

      <!-- Immediate Confirmation - SMS -->
      <label class="flex items-center gap-2 cursor-pointer py-1 px-2 rounded-lg hover:bg-surfaceSecondary/50 transition-colors">
        <input
          type="checkbox"
          v-model="communications.immediateConfirmationSMS"
          class="w-4 h-4 appearance-none text-green-600 focus:ring-green-600 border-gray-300 rounded checkbox-green cursor-pointer"
        />
        <span class="text-fluid-sm font-medium text-heading">Send immediate confirmation SMS to customer</span>
      </label>

      <!-- Immediate Confirmation - WhatsApp -->
      <label class="flex items-center gap-2 cursor-pointer py-1 px-2 rounded-lg hover:bg-surfaceSecondary/50 transition-colors">
        <input
          type="checkbox"
          v-model="communications.immediateConfirmationWhatsApp"
          class="w-4 h-4 appearance-none text-green-600 focus:ring-green-600 border-gray-300 rounded checkbox-green cursor-pointer"
        />
        <span class="text-fluid-sm font-medium text-heading">Send immediate confirmation WhatsApp to customer</span>
      </label>

      <!-- Reminder Email (Day Before) -->
      <label class="flex items-center gap-2 cursor-pointer py-1 px-2 rounded-lg hover:bg-surfaceSecondary/50 transition-colors">
        <input
          type="checkbox"
          v-model="communications.reminderEmail"
          class="w-4 h-4 appearance-none text-green-600 focus:ring-green-600 border-gray-300 rounded checkbox-green cursor-pointer"
        />
        <span class="text-fluid-sm font-medium text-heading">Send reminder email the day before appointment</span>
      </label>

      <!-- Reminder SMS (Day Before) -->
      <label class="flex items-center gap-2 cursor-pointer py-1 px-2 rounded-lg hover:bg-surfaceSecondary/50 transition-colors">
        <input
          type="checkbox"
          v-model="communications.reminderSMS"
          class="w-4 h-4 appearance-none text-green-600 focus:ring-green-600 border-gray-300 rounded checkbox-green cursor-pointer"
        />
        <span class="text-fluid-sm font-medium text-heading">Send reminder SMS the day before appointment</span>
      </label>

      <!-- Salesperson/Team Notification -->
      <label class="flex items-center gap-2 cursor-pointer py-1 px-2 rounded-lg hover:bg-surfaceSecondary/50 transition-colors">
        <input
          type="checkbox"
          v-model="communications.salespersonNotification"
          class="w-4 h-4 appearance-none text-green-600 focus:ring-green-600 border-gray-300 rounded checkbox-green cursor-pointer"
        />
        <span class="text-fluid-sm font-medium text-heading">
          Notify {{ salesperson ? salesperson.name : (team ? team.name : 'salesperson') }} about appointment
        </span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  appointment: {
    type: Object,
    required: true
  },
  customer: {
    type: Object,
    required: true
  },
  salesperson: {
    type: Object,
    default: null
  },
  team: {
    type: Object,
    default: null
  },
  dealership: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update'])

const communications = ref({
  immediateConfirmationEmail: true,
  immediateConfirmationSMS: false,
  immediateConfirmationWhatsApp: false,
  reminderEmail: true,
  reminderSMS: false,
  salespersonNotification: true
})

// Watch for changes and emit updates
watch(communications, (newVal) => {
  // Convert flat structure to nested structure for handler compatibility
  const nested = {
    immediateConfirmation: {
      enabled: newVal.immediateConfirmationEmail || newVal.immediateConfirmationSMS || newVal.immediateConfirmationWhatsApp,
      channels: []
    },
    reminder: {
      enabled: newVal.reminderEmail || newVal.reminderSMS,
      channels: []
    },
    salespersonNotification: {
      enabled: newVal.salespersonNotification
    }
  }
  
  if (newVal.immediateConfirmationEmail) nested.immediateConfirmation.channels.push('email')
  if (newVal.immediateConfirmationSMS) nested.immediateConfirmation.channels.push('sms')
  if (newVal.immediateConfirmationWhatsApp) nested.immediateConfirmation.channels.push('whatsapp')
  if (newVal.reminderEmail) nested.reminder.channels.push('email')
  if (newVal.reminderSMS) nested.reminder.channels.push('sms')
  
  emit('update', nested)
}, { deep: true })
</script>

<style scoped>
input[type="checkbox"].checkbox-green {
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
}

input[type="checkbox"].checkbox-green:checked {
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  background-color: #16a34a !important;
  border-color: #16a34a !important;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L4 12.586l7.293-7.293a1 1 0 011.414 0z'/%3e%3c/svg%3e") !important;
  background-size: 100% 100% !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
}

input[type="checkbox"].checkbox-green:checked:hover {
  background-color: #15803d !important;
  border-color: #15803d !important;
}

input[type="checkbox"].checkbox-green:not(:checked) {
  background-color: white !important;
}
</style>
