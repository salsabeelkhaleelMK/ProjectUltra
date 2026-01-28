<template>
  <div class="rounded-lg flex flex-col bg-muted">
    <div class="pt-1 px-1">
      <!-- Add contract card: only when no contracts -->
      <div
        v-if="!hasContracts"
        class="bg-white rounded-lg shadow-nsc-card overflow-visible"
      >
        <div class="p-6">
          <div class="mb-3">
            <h4 class="font-bold text-foreground text-sm">Add contract</h4>
            <p class="text-sm text-muted-foreground mt-0.5">
              Create a new contract to track versions. Use the + button on the carousel above to add a contract.
            </p>
          </div>
          <div class="flex flex-wrap gap-3 items-center">
            <SecondaryActionsDropdown
              :actions="contractPendingActions"
              @action-selected="$emit('contract-pending-action', $event)"
            />
          </div>
        </div>
      </div>

      <!-- Set Delivery Date card: only when at least one contract -->
      <div
        v-else
        class="bg-white rounded-lg shadow-nsc-card overflow-visible"
      >
        <div class="p-6">
          <div class="mb-3">
            <h4 class="font-bold text-foreground text-sm">Set Delivery Date</h4>
            <p class="text-sm text-muted-foreground mt-0.5">
              Schedule vehicle delivery with the customer. Set the delivery date, time, and location.
            </p>
          </div>
          <div class="flex flex-wrap gap-3 items-center">
            <div class="outcome-toggle-group flex flex-wrap gap-3">
              <Toggle
                v-if="!hasDeliveryDate"
                variant="outline"
                :model-value="showSetDeliveryDateSection"
                @update:model-value="$emit('update:show-set-delivery-date-section', $event)"
                class="outcome-toggle-item"
              >
                <Truck class="w-4 h-4 shrink-0" />
                <span>Set Delivery Date</span>
              </Toggle>
            </div>
            <SecondaryActionsDropdown
              :actions="contractPendingActions"
              @action-selected="$emit('contract-pending-action', $event)"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="px-4 py-4 space-y-4">
      <!-- Inline Close as Lost Section -->
      <div v-if="showCloseAsLostSection">
        <CloseAsLostCard
          ref="closeAsLostCardRef"
          :preselected-reason="closeAsLostReason"
          :preselected-notes="closeAsLostNotes"
          @cancel="$emit('close-as-lost-cancel')"
          @confirm="$emit('close-as-lost-confirm', $event)"
        />
      </div>

      <!-- Inline Set Delivery Date Section -->
      <div v-if="showSetDeliveryDateSection">
        <div class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
          <h5 class="font-semibold text-foreground text-sm mb-4">Set Delivery Date</h5>
          <div class="space-y-4">
            <div>
              <Label class="block text-sm font-medium text-muted-foreground mb-2">Delivery Date <span class="text-red-600">*</span></Label>
              <Input
                type="date"
                :model-value="deliveryDateForm.deliveryDate"
                @update:model-value="$emit('update:delivery-date-form', { ...deliveryDateForm, deliveryDate: $event })"
                :min="minDeliveryDate"
                class="w-full"
              />
            </div>
            <div>
              <Label class="block text-sm font-medium text-muted-foreground mb-2">Time (Optional)</Label>
              <Input
                type="time"
                :model-value="deliveryDateForm.deliveryTime"
                @update:model-value="$emit('update:delivery-date-form', { ...deliveryDateForm, deliveryTime: $event })"
                class="w-full"
              />
            </div>
            <div>
              <Label class="block text-sm font-medium text-muted-foreground mb-2">Delivery Location</Label>
              <Select
                :model-value="deliveryDateForm.deliveryLocation"
                @update:model-value="$emit('update:delivery-date-form', { ...deliveryDateForm, deliveryLocation: $event })"
              >
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Select location..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dealership">At Dealership</SelectItem>
                  <SelectItem value="Customer Address">Customer Address</SelectItem>
                  <SelectItem value="Other">Other Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label class="block text-sm font-medium text-muted-foreground mb-2">Notes (Optional)</Label>
              <Textarea
                :model-value="deliveryDateForm.notes"
                @update:model-value="$emit('update:delivery-date-form', { ...deliveryDateForm, notes: $event })"
                rows="4"
                placeholder="Add any relevant delivery details..."
                class="w-full"
              />
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <Button variant="secondary" @click="$emit('cancel-set-delivery-date')">
            Cancel
          </Button>
          <Button
            variant="default"
            :disabled="!canSubmitSetDeliveryDate"
            @click="$emit('confirm-set-delivery-date')"
          >
            Set Delivery Date
          </Button>
        </div>
      </div>

      <!-- Inline Schedule Appointment Section -->
      <div v-if="showScheduleAppointmentContractPendingSection">
        <OpportunityScheduleForm
          ref="scheduleAppointmentContractPendingFormRef"
          :opportunity="opportunity"
          mode="schedule"
          @submit="$emit('schedule-appointment-contract-pending-submit', $event)"
          @cancel="$emit('cancel-schedule-appointment-contract-pending')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Truck } from 'lucide-vue-next'
import { Button, Toggle, Label, Input, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@motork/component-library/future/primitives'
import SecondaryActionsDropdown from '@/components/shared/SecondaryActionsDropdown.vue'
import OpportunityScheduleForm from '@/components/tasks/opportunity/OpportunityScheduleForm.vue'
import CloseAsLostCard from '@/components/shared/CloseAsLostCard.vue'

const props = defineProps({
  opportunity: { type: Object, required: true },
  hasContracts: { type: Boolean, default: false },
  showCloseAsLostSection: { type: Boolean, default: false },
  showScheduleAppointmentContractPendingSection: { type: Boolean, default: false },
  showSetDeliveryDateSection: { type: Boolean, default: false },
  closeAsLostReason: { type: String, default: '' },
  closeAsLostNotes: { type: String, default: '' },
  deliveryDateForm: { type: Object, required: true },
  hasDeliveryDate: { type: Boolean, default: false },
  minDeliveryDate: { type: String, default: '' },
  canSubmitSetDeliveryDate: { type: Boolean, default: false },
  contractPendingActions: { type: Array, default: () => [] }
})

defineEmits([
  'update:show-schedule-appointment-contract-pending-section',
  'update:show-set-delivery-date-section',
  'update:delivery-date-form',
  'confirm-set-delivery-date',
  'cancel-set-delivery-date',
  'schedule-appointment-contract-pending-submit',
  'cancel-schedule-appointment-contract-pending',
  'contract-pending-action',
  'close-as-lost-cancel',
  'close-as-lost-confirm'
])

const scheduleAppointmentContractPendingFormRef = ref(null)
const closeAsLostCardRef = ref(null)

defineExpose({
  scheduleAppointmentContractPendingFormRef,
  closeAsLostCardRef
})
</script>
