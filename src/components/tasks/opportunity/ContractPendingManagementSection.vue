<template>
  <div class="rounded-lg flex flex-col bg-muted">
    <div class="pt-1 px-1">
      <div class="bg-white rounded-lg shadow-nsc-card overflow-visible">
        <div class="p-6">
          <div class="mb-3">
            <h4 class="font-bold text-foreground text-sm">Collect e-signatures, finalize contract</h4>
            <p class="text-sm text-muted-foreground mt-0.5">
              Get the formal contract signed electronically by the customer. Finalize all contractual terms and conditions. Ensure all required signatures are collected. Set the official Contract Date when customer signs.
            </p>
          </div>
          <div class="flex flex-wrap gap-3 items-center">
            <div class="outcome-toggle-group flex flex-wrap gap-3">
              <Toggle
                variant="outline"
                :model-value="showFinalizeContractSection"
                @update:model-value="$emit('update:show-finalize-contract-section', $event)"
                class="outcome-toggle-item"
              >
                <i class="fa-solid fa-file-signature"></i>
                <span>Collect Signatures</span>
              </Toggle>
            </div>
            
            <!-- More Actions Dropdown -->
            <SecondaryActionsDropdown
              :actions="contractPendingActions"
              @action-selected="$emit('contract-pending-action', $event)"
            />
          </div>
        </div>
      </div>
    </div>
    
    <div class="px-4 py-4 space-y-4">
      <!-- Inline Finalize Contract Section -->
      <div v-if="showFinalizeContractSection">
        <div class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
          <h5 class="font-semibold text-foreground text-sm mb-4">Set Contract Signing Date</h5>
          
          <div class="space-y-4">
            <!-- Contract Date -->
            <div>
              <Label class="block text-sm font-medium text-muted-foreground mb-2">Contract Date <span class="text-red-600">*</span></Label>
              <Input 
                type="date"
                :model-value="contractPendingForm.contractDate"
                @update:model-value="$emit('update:contract-pending-form', { ...contractPendingForm, contractDate: $event })"
                :max="maxContractDate"
                class="w-full"
              />
            </div>
            
            <!-- Contract Time -->
            <div>
              <Label class="block text-sm font-medium text-muted-foreground mb-2">Time (Optional)</Label>
              <Input 
                type="time"
                :model-value="contractPendingForm.contractTime"
                @update:model-value="$emit('update:contract-pending-form', { ...contractPendingForm, contractTime: $event })"
                class="w-full"
              />
            </div>
            
            <!-- Notes -->
            <div>
              <Label class="block text-sm font-medium text-muted-foreground mb-2">Notes (Optional)</Label>
              <Textarea 
                :model-value="contractPendingForm.notes"
                @update:model-value="$emit('update:contract-pending-form', { ...contractPendingForm, notes: $event })"
                rows="4"
                placeholder="Add any relevant notes about the contract signing..."
                class="w-full"
              />
            </div>
            
            <!-- Auto-mark offer as accepted checkbox (only show if not already accepted) -->
            <div v-if="opportunity.negotiationSubstatus !== 'Offer Accepted' && opportunity.negotiationSubstatus !== 'Contract Pending'">
              <div class="flex items-start gap-2">
                <input
                  type="checkbox"
                  :checked="contractPendingForm.autoMarkOfferAccepted !== false"
                  @change="$emit('update:contract-pending-form', { ...contractPendingForm, autoMarkOfferAccepted: $event.target.checked })"
                  class="mt-0.5 rounded border-border text-primary focus:ring-primary"
                  id="auto-mark-offer-accepted"
                />
                <div class="flex-1">
                  <Label for="auto-mark-offer-accepted" class="text-sm text-foreground cursor-pointer font-medium">
                    Auto-mark offer as accepted
                  </Label>
                  <p class="text-xs text-muted-foreground mt-0.5">
                    Automatically mark the offer as accepted when creating this contract
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Finalize Contract Buttons -->
        <div class="flex justify-end gap-2 mt-4">
          <Button
            variant="secondary"
            @click="$emit('cancel-finalize-contract')"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            :disabled="!canSubmitFinalizeContract"
            @click="$emit('confirm-finalize-contract')"
          >
            Set Contract Date
          </Button>
        </div>
      </div>
      
      <!-- Inline Add Offer Section -->
      <div v-if="showAddOfferContractPendingSection">
        <div class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
          <OfferWidget
            ref="addOfferContractPendingRef"
            :task-id="opportunity.id"
            :task-type="'opportunity'"
            :customer="opportunity.customer"
            :selected-vehicle="opportunity.selectedVehicle || opportunity.vehicle || opportunity.requestedCar"
            hide-header
            hide-actions
            @save="$emit('offer-created-contract-pending', $event)"
            @cancel="$emit('cancel-add-offer-contract-pending')"
          />
        </div>
      </div>
      
      <!-- Unified Add Offer Buttons -->
      <div v-if="showAddOfferContractPendingSection" class="flex justify-end gap-2 pt-3">
        <Button
          variant="secondary"
          @click="$emit('cancel-add-offer-contract-pending')"
        >
          Cancel
        </Button>
        <Button
          variant="default"
          :disabled="!canCreateInlineOfferContractPending"
          @click="$emit('confirm-add-offer-contract-pending')"
        >
          Create Offer
        </Button>
      </div>
      
      <!-- Inline Extend Deadline Section -->
      <div v-if="showExtendDeadlineSection">
        <div class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
          <h5 class="font-semibold text-foreground text-sm mb-4">Extend Deadline</h5>
          
          <div class="space-y-4">
            <div>
              <Label class="block text-sm font-medium text-muted-foreground mb-2">New Deadline Date <span class="text-red-600">*</span></Label>
              <Input 
                type="date"
                :model-value="extendDeadlineForm.newDeadline"
                @update:model-value="$emit('update:extend-deadline-form', { ...extendDeadlineForm, newDeadline: $event })"
                :min="minDeadlineDate"
                class="w-full"
              />
            </div>
            
            <div>
              <Label class="block text-sm font-medium text-muted-foreground mb-2">Reason (Optional)</Label>
              <Textarea 
                :model-value="extendDeadlineForm.reason"
                @update:model-value="$emit('update:extend-deadline-form', { ...extendDeadlineForm, reason: $event })"
                rows="3"
                placeholder="Reason for extending the deadline..."
                class="w-full"
              />
            </div>
          </div>
        </div>
        
        <!-- Extend Deadline Buttons -->
        <div class="flex justify-end gap-2 mt-4">
          <Button
            variant="secondary"
            @click="$emit('cancel-extend-deadline')"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            :disabled="!canSubmitExtendDeadline"
            @click="$emit('confirm-extend-deadline')"
          >
            Extend Deadline
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
import { Button, Toggle, Label, Input, Textarea } from '@motork/component-library/future/primitives'
import SecondaryActionsDropdown from '@/components/shared/SecondaryActionsDropdown.vue'
import OfferWidget from '@/components/customer/activities/OfferWidget.vue'
import OpportunityScheduleForm from '@/components/tasks/opportunity/OpportunityScheduleForm.vue'

const props = defineProps({
  opportunity: {
    type: Object,
    required: true
  },
  showFinalizeContractSection: {
    type: Boolean,
    default: false
  },
  showAddOfferContractPendingSection: {
    type: Boolean,
    default: false
  },
  showExtendDeadlineSection: {
    type: Boolean,
    default: false
  },
  showScheduleAppointmentContractPendingSection: {
    type: Boolean,
    default: false
  },
  contractPendingForm: {
    type: Object,
    required: true
  },
  extendDeadlineForm: {
    type: Object,
    required: true
  },
  contractPendingActions: {
    type: Array,
    default: () => []
  },
  canSubmitFinalizeContract: {
    type: Boolean,
    default: false
  },
  canSubmitExtendDeadline: {
    type: Boolean,
    default: false
  },
  canCreateInlineOfferContractPending: {
    type: Boolean,
    default: false
  },
  maxContractDate: {
    type: String,
    default: ''
  },
  minDeadlineDate: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'update:show-finalize-contract-section',
  'update:show-add-offer-contract-pending-section',
  'update:show-extend-deadline-section',
  'update:show-schedule-appointment-contract-pending-section',
  'update:contract-pending-form',
  'update:extend-deadline-form',
  'confirm-finalize-contract',
  'cancel-finalize-contract',
  'offer-created-contract-pending',
  'cancel-add-offer-contract-pending',
  'confirm-add-offer-contract-pending',
  'confirm-extend-deadline',
  'cancel-extend-deadline',
  'schedule-appointment-contract-pending-submit',
  'cancel-schedule-appointment-contract-pending',
  'contract-pending-action'
])

const addOfferContractPendingRef = ref(null)
const scheduleAppointmentContractPendingFormRef = ref(null)

// Expose refs for parent component
defineExpose({
  addOfferContractPendingRef,
  scheduleAppointmentContractPendingFormRef
})
</script>
