<template>
  <div class="rounded-lg flex flex-col bg-muted">
    <div class="pt-1 px-1">
      <div class="bg-white rounded-lg shadow-nsc-card overflow-visible">
        <div class="p-6">
          <div class="mb-3">
            <h4 class="font-bold text-foreground text-sm">Manage Appointment</h4>
            <p class="text-sm text-muted-foreground mt-0.5">
              Appointment scheduled for {{ scheduledAppointment?.start ? formatDateTime(scheduledAppointment.start) : 'TBD' }}
              <span v-if="opportunity.customer || opportunity.customerId" class="ml-2">
                with 
                <a 
                  :href="customerProfileUrl"
                  target="_blank"
                  @click.stop="handleCustomerClick"
                  class="text-primary hover:underline font-medium"
                >
                  {{ customerName }}
                </a>
              </span>
            </p>
          </div>
          <div class="flex flex-wrap gap-3 items-center">
            <Button
              v-if="scheduledAppointment?.status === 'pending_confirmation'"
              variant="outline"
              @click="$emit('confirm-appointment')"
              class="inline-flex items-center gap-2 cursor-pointer"
            >
              <i class="fa-solid fa-calendar-check"></i>
              <span>Confirm appointment</span>
            </Button>
            <div class="outcome-toggle-group flex flex-wrap gap-3">
              <Toggle
                v-if="!isAppointmentToday"
                variant="outline"
                :model-value="showRescheduleSection"
                @update:model-value="(p) => { 
                  $emit('update:show-reschedule-section', p); 
                  if (p) { 
                    $emit('update:show-ns-task-section', false); 
                    $emit('update:show-offer-assignment-section', false);
                    activeSecondaryAction.value = null; // Hide secondary action forms
                  } 
                }"
                class="outcome-toggle-item"
              >
                <i class="fa-solid fa-calendar-days"></i>
                <span>Reschedule</span>
              </Toggle>
              <Toggle
                v-if="isAppointmentToday"
                variant="outline"
                :model-value="showNsTaskSection"
                @update:model-value="(p) => { 
                  if (p) {
                    $emit('mark-no-show');
                    activeSecondaryAction.value = null; // Hide secondary action forms
                  } else {
                    $emit('update:show-ns-task-section', false);
                  }
                }"
                class="outcome-toggle-item"
              >
                <i class="fa-solid fa-user-slash"></i>
                <span>Mark No-Show</span>
              </Toggle>
              <Toggle
                v-if="isAppointmentToday"
                variant="outline"
                :model-value="showOfferAssignmentSection"
                @update:model-value="(p) => { 
                  if (p) {
                    $emit('mark-showed-up');
                    activeSecondaryAction.value = null; // Hide secondary action forms
                  } else {
                    $emit('update:show-offer-assignment-section', false);
                  }
                }"
                class="outcome-toggle-item"
              >
                <i class="fa-solid fa-user-check"></i>
                <span>Mark Showed Up</span>
              </Toggle>
            </div>
            
            <!-- Secondary Actions Dropdown - Inline with management buttons -->
            <SecondaryActionsDropdown
              v-if="secondaryActions && secondaryActions.length > 0"
              :actions="secondaryActions"
              @action-selected="handleSecondaryActionSelected"
            />
          </div>
        </div>
      </div>
    </div>
    
    <div class="px-4 py-4 space-y-4">
      <div v-if="showRescheduleSection">
        <OpportunityScheduleForm
          ref="scheduleFormRef"
          :opportunity="opportunity"
          mode="reschedule"
          :initial-appointment="scheduledAppointment"
          @submit="$emit('reschedule-submit', $event)"
          @cancel="$emit('reschedule-cancel')"
        />
      </div>
      
      <!-- Secondary Action Forms - Show inline when selected from dropdown -->
      <CloseAsLostCard
        v-if="activeSecondaryAction === 'close-lost'"
        ref="closeAsLostCardRef"
        :preselected-reason="closeAsLostReason"
        :preselected-notes="closeAsLostNotes"
        @cancel="handleCancelCloseAsLost"
        @confirm="handleConfirmCloseAsLost"
      />
      
      <!-- Inline NS Task Section -->
      <div v-if="showNsTaskSection">
        <NS1Task
          v-if="nsTaskCount === 1"
          ref="ns1TaskRef"
          :opportunity="opportunity"
          :scheduled-appointment="scheduledAppointment"
          @assigned="$emit('ns-assigned', $event)"
          @cancel="$emit('ns-cancel')"
        />
        <NS2Task
          v-else-if="nsTaskCount === 2"
          ref="ns2TaskRef"
          :opportunity="opportunity"
          :scheduled-appointment="scheduledAppointment"
          @assigned="$emit('ns-assigned', $event)"
          @cancel="$emit('ns-cancel')"
        />
        <NS3Task
          v-else-if="nsTaskCount >= 3"
          ref="ns3TaskRef"
          :opportunity="opportunity"
          :scheduled-appointment="scheduledAppointment"
          @close-as-lost="$emit('ns-close-as-lost', $event)"
          @cancel="$emit('ns-cancel')"
        />
      </div>
      
      <!-- Unified NS Task Buttons -->
      <div v-if="showNsTaskSection" class="flex justify-end gap-2 px-4 pb-4 pt-3">
        <Button
          variant="secondary"
          @click="$emit('ns-cancel')"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          :disabled="!canSubmitNsTask"
          @click="$emit('ns-confirm')"
          class="bg-primary"
        >
          {{ nsTaskButtonLabel }}
        </Button>
      </div>
      
      <!-- Offer Assignment Task (Create Offer opens modal) -->
      <transition name="expand">
        <div v-if="showOfferAssignmentSection" class="mt-4">
          <OfferAssignmentTask
            ref="offerAssignmentTaskRef"
            :opportunity="opportunity"
            :scheduled-appointment="scheduledAppointment"
            @offer-created="$emit('offer-assignment-created', $event)"
            @cancel="$emit('offer-assignment-cancel')"
            @open-create-offer-modal="$emit('open-create-offer-modal')"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { Button, Toggle } from '@motork/component-library/future/primitives'
import { formatDateTime } from '@/utils/formatters'
import { useCloseAsLost } from '@/composables/useCloseAsLost'
import SecondaryActionsDropdown from '@/components/shared/SecondaryActionsDropdown.vue'
import OpportunityScheduleForm from '@/components/tasks/opportunity/OpportunityScheduleForm.vue'
import NS1Task from '@/components/tasks/opportunity/NS1Task.vue'
import NS2Task from '@/components/tasks/opportunity/NS2Task.vue'
import NS3Task from '@/components/tasks/opportunity/NS3Task.vue'
import OfferAssignmentTask from '@/components/tasks/opportunity/OfferAssignmentTask.vue'
import CloseAsLostCard from '@/components/shared/CloseAsLostCard.vue'

const props = defineProps({
  opportunity: {
    type: Object,
    required: true
  },
  scheduledAppointment: {
    type: Object,
    default: null
  },
  showRescheduleSection: {
    type: Boolean,
    default: false
  },
  showNsTaskSection: {
    type: Boolean,
    default: false
  },
  showOfferAssignmentSection: {
    type: Boolean,
    default: false
  },
  nsTaskCount: {
    type: Number,
    default: 0
  },
  canSubmitNsTask: {
    type: Boolean,
    default: false
  },
  nsTaskButtonLabel: {
    type: String,
    default: 'Assign'
  },
  canCreateOffer: {
    type: Boolean,
    default: false
  },
  secondaryActions: {
    type: Array,
    default: () => []
  },
  customerName: {
    type: String,
    default: ''
  },
  customerProfileUrl: {
    type: String,
    default: ''
  },
  isAppointmentToday: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'confirm-appointment',
  'update:show-reschedule-section',
  'update:show-ns-task-section',
  'update:show-offer-assignment-section',
  'mark-no-show',
  'mark-showed-up',
  'reschedule-submit',
  'reschedule-cancel',
  'ns-assigned',
  'ns-cancel',
  'ns-confirm',
  'ns-close-as-lost',
  'offer-assignment-created',
  'offer-assignment-cancel',
  'offer-assignment-confirm',
  'open-create-offer-modal',
  'secondary-action',
  'customer-click',
  'close-as-lost-confirmed'
])

const scheduleFormRef = ref(null)
const ns1TaskRef = ref(null)
const ns2TaskRef = ref(null)
const ns3TaskRef = ref(null)
const offerAssignmentTaskRef = ref(null)

// Track which secondary action form is currently active
const activeSecondaryAction = ref(null)
const { reason: closeAsLostReason, notes: closeAsLostNotes, cardRef: closeAsLostCardRef, reset: resetCloseAsLost } = useCloseAsLost()

// Actions that should show forms inline (others will be handled directly)
const actionsWithForms = ['close-lost']

function handleCustomerClick(event) {
  emit('customer-click', event)
}

function handleSecondaryActionSelected(action) {
  // If this action has a form, show it inline and hide other sections
  if (actionsWithForms.includes(action.key)) {
    // Toggle: if same action is selected, hide it; otherwise show it and hide others
    if (activeSecondaryAction.value === action.key) {
      activeSecondaryAction.value = null
    } else {
      activeSecondaryAction.value = action.key
      // Hide other sections
      emit('update:show-reschedule-section', false)
      emit('update:show-ns-task-section', false)
      emit('update:show-offer-assignment-section', false)
      
      // Initialize form data if needed
      if (action.key === 'close-lost') {
        resetCloseAsLost()
      }
    }
  } else {
    // For actions without forms, emit the event normally
    emit('secondary-action', action)
  }
}

function handleCancelCloseAsLost() {
  activeSecondaryAction.value = null
  resetCloseAsLost()
}

function handleConfirmCloseAsLost(data) {
  emit('close-as-lost-confirmed', {
    reason: data.reason,
    notes: data.notes
  })
  // Reset after confirmation
  activeSecondaryAction.value = null
  closeAsLostReason.value = ''
  closeAsLostNotes.value = ''
}

// Watch for prop changes to hide secondary action form when other sections are shown
watch(() => props.showRescheduleSection, (newVal) => {
  if (newVal) {
    activeSecondaryAction.value = null
  }
})

watch(() => props.showNsTaskSection, (newVal) => {
  if (newVal) {
    activeSecondaryAction.value = null
  }
})

watch(() => props.showOfferAssignmentSection, (newVal) => {
  if (newVal) {
    activeSecondaryAction.value = null
  }
})

// Expose refs for parent component
defineExpose({
  scheduleFormRef,
  ns1TaskRef,
  ns2TaskRef,
  ns3TaskRef,
  offerAssignmentTaskRef,
  closeAsLostCardRef
})
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 5000px;
  opacity: 1;
}
</style>
