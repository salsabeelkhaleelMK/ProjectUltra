<template>
  <div class="bg-white rounded-lg p-4 shadow-nsc-card">
    <h5 class="font-semibold text-foreground text-sm mb-4">Send confirmations and reminders</h5>
    
    <div class="space-y-4">
      <!-- Immediate Confirmation -->
      <div class="flex items-center gap-3">
        <Label class="flex items-center gap-2 cursor-pointer py-1 px-2 rounded-lg hover:bg-muted/50 transition-colors flex-1">
          <Checkbox
            id="immediate-confirmation"
            v-model="communications.immediateConfirmationEnabled"
          />
          <span class="text-sm font-medium text-foreground">Send immediate confirmation to customer</span>
        </Label>
        <SelectMenu
          v-if="communications.immediateConfirmationEnabled"
          v-model="communications.immediateConfirmationChannels"
          :items="channelOptions"
          :multiple="true"
          placeholder="Select channels"
          class="w-48"
        />
      </div>

      <!-- Reminder -->
      <div class="flex items-center gap-3">
        <Label class="flex items-center gap-2 cursor-pointer py-1 px-2 rounded-lg hover:bg-muted/50 transition-colors flex-1">
          <Checkbox
            id="reminder"
            v-model="communications.reminderEnabled"
          />
          <span class="text-sm font-medium text-foreground">Send reminder the day before appointment</span>
        </Label>
        <SelectMenu
          v-if="communications.reminderEnabled"
          v-model="communications.reminderChannels"
          :items="channelOptions"
          :multiple="true"
          placeholder="Select channels"
          class="w-48"
        />
      </div>

      <!-- Salesperson/Team Notification -->
      <Label class="flex items-center gap-2 cursor-pointer py-1 px-2 rounded-lg hover:bg-muted/50 transition-colors">
        <Checkbox
          id="salesperson-notification"
          v-model="communications.salespersonNotification"
        />
        <span class="text-sm font-medium text-foreground">
          Notify {{ salesperson ? salesperson.name : (team ? team.name : 'salesperson') }} about appointment
        </span>
      </Label>
    </div>
    
    <!-- Action Buttons Slot -->
    <slot name="actions"></slot>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { Checkbox, Label } from '@motork/component-library/future/primitives'
import { SelectMenu } from '@motork/component-library/future/components'

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

const channelOptions = [
  { value: 'email', label: 'via Email' },
  { value: 'sms', label: 'via SMS' },
  { value: 'whatsapp', label: 'via WhatsApp' }
]

const communications = ref({
  immediateConfirmationEnabled: true,
  immediateConfirmationChannels: ['email'],
  reminderEnabled: true,
  reminderChannels: ['email'],
  salespersonNotification: true
})

// Watch for changes and emit updates
watch(communications, (newVal) => {
  // Convert to nested structure for handler compatibility
  const nested = {
    immediateConfirmation: {
      enabled: newVal.immediateConfirmationEnabled,
      channels: newVal.immediateConfirmationEnabled && newVal.immediateConfirmationChannels?.length > 0
        ? newVal.immediateConfirmationChannels
        : []
    },
    reminder: {
      enabled: newVal.reminderEnabled,
      channels: newVal.reminderEnabled && newVal.reminderChannels?.length > 0
        ? newVal.reminderChannels
        : []
    },
    salespersonNotification: {
      enabled: newVal.salespersonNotification
    }
  }
  
  emit('update', nested)
}, { deep: true })
</script>

