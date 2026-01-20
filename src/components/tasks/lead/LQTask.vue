<template>
  <div class="bg-surfaceSecondary/50 rounded-lg p-6 relative transition-all duration-300">
    <div class="flex justify-between items-start mb-3">
      <div>
        <h4 class="font-bold text-heading text-fluid-sm">{{ dynamicTitle }}</h4>
        <p class="text-fluid-xs mt-0.5">
          {{ dynamicDescription }}
        </p>
      </div>
      <div 
        class="flex items-center gap-2 px-2 py-1 rounded text-xs font-semibold"
        :class="statusBadge.class"
      >
        {{ statusBadge.text }}
      </div>
    </div>

    <!-- Display scheduled follow-up if exists -->
    <div v-if="hasScheduledFollowUp" class="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div class="flex items-center gap-2 mb-1">
        <i class="fa-solid fa-phone text-blue-600 text-xs"></i>
        <span class="text-fluid-xs font-semibold text-blue-900">Scheduled Follow-up Call</span>
      </div>
      <p class="text-fluid-xs text-blue-700">
        {{ formatDate(lead.scheduledAppointment.start) }} at {{ formatTime(lead.scheduledAppointment.start) }}
      </p>
    </div>

    <!-- Contact Attempt Counter -->
    <div v-if="contactAttempts > 0" class="mb-3 bg-surfaceSecondary border border-E5E7EB rounded-lg p-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-phone text-body text-xs"></i>
          <span class="text-fluid-xs font-semibold text-body">Contact Attempts:</span>
          <span class="text-fluid-xs font-semibold text-heading">{{ contactAttempts }} / {{ maxContactAttempts }}</span>
        </div>
        <div 
          v-if="contactAttempts >= maxContactAttempts - 1"
          class="text-fluid-xs text-orange-600 font-medium flex items-center gap-1"
        >
          <i class="fa-solid fa-exclamation-triangle"></i>
          One more attempt before auto-disqualification
        </div>
      </div>
    </div>

    <!-- Phone Number Row -->
    <div class="flex items-center gap-2 mb-3">
      <span class="text-fluid-sm text-body font-medium">{{ lead.customer.phone }}</span>
      <button
        @click="copyNumber"
        class="flex items-center justify-center rounded hover:bg-surfaceSecondary text-sub hover:text-body transition-colors w-6 h-6"
        title="Copy phone number"
      >
        <i class="fa-regular fa-copy text-xs"></i>
      </button>
    </div>
    
    <!-- Call Interface Component -->
    <CallInterface
      :is-call-active="isCallActive"
      :call-ended="callEnded"
      :call-duration="callDuration"
      :call-notes="callNotes"
      :formatted-call-duration="formattedCallDuration"
      :mock-transcription="mockTranscription"
      :show-outcome-selection="showOutcomeSelection"
      :contact-attempts="contactAttempts"
      :max-contact-attempts="maxContactAttempts"
      @start-call="startCall"
      @end-call="endCallFromComposable"
      @log-manual-call="logManualCall"
      @extract-information="extractInformationFromComposable"
      @update:call-notes="updateCallNotes"
      @copy-number="copyNumber"
    />

    <!-- Inline Outcome Selection (replaces modal) -->
    <div v-if="showOutcomeSelection" class="mt-4 space-y-4 border-t border-E5E7EB pt-4">
      <div>
        <h4 class="font-semibold text-heading mb-2 text-fluid-sm">What's the outcome?</h4>
        <div class="grid grid-cols-3 gap-2">
          <button 
            @click="selectOutcome('no-answer')"
            class="bg-surface border-2 rounded-lg py-3 px-4 flex flex-col items-center justify-center gap-1.5 text-fluid-xs font-medium text-body transition-all"
            :class="selectedOutcome === 'no-answer' ? 'border-brand-dark bg-surfaceSecondary text-brand-dark' : 'border-E5E7EB hover:border-brand-dark/30 hover:bg-surfaceSecondary/50'"
          >
            <i class="fa-solid fa-phone-slash text-sm"></i>
            <span>No answer</span>
          </button>
          
          <button 
            @click="selectOutcome('not-valid')"
            class="bg-surface border-2 rounded-lg py-3 px-4 flex flex-col items-center justify-center gap-1.5 text-fluid-xs font-medium text-body transition-all"
            :class="selectedOutcome === 'not-valid' ? 'border-brand-dark bg-surfaceSecondary text-brand-dark' : 'border-E5E7EB hover:border-brand-dark/30 hover:bg-surfaceSecondary/50'"
          >
            <i class="fa-solid fa-ban text-sm"></i>
            <span>Not valid</span>
          </button>
          
          <button 
            @click="selectOutcome('interested')"
            class="bg-surface border-2 rounded-lg py-3 px-4 flex flex-col items-center justify-center gap-1.5 text-fluid-xs font-medium text-body transition-all"
            :class="selectedOutcome === 'interested' ? 'border-brand-dark bg-surfaceSecondary text-brand-dark' : 'border-E5E7EB hover:border-brand-dark/30 hover:bg-surfaceSecondary/50'"
          >
            <i class="fa-solid fa-check-circle text-sm"></i>
            <span>Interested</span>
          </button>
        </div>
      </div>

      <!-- No Answer Follow-up (Inline) -->
      <div v-if="selectedOutcome === 'no-answer'" class="space-y-4">
        <!-- Communication Selector Component (with its own border) -->
        <div class="bg-surface border border-E5E7EB rounded-lg p-6">
          <CommunicationSelector
            title="Send follow-up message"
            :show-email="true"
            :show-sms="true"
            :show-whatsapp="true"
            :show-dont-send="true"
            @send="handleFollowupSend"
            @dont-send="() => { followupChannel.value = 'dont-send' }"
            @cancel="() => { selectedOutcome.value = null }"
          />
        </div>
        
        <!-- Next call attempt (in its own bordered card) -->
        <div class="bg-surface border border-E5E7EB rounded-lg p-6">
          <h5 class="font-semibold text-heading text-fluid-sm mb-2">Next call attempt</h5>
          <div class="grid grid-cols-3 gap-2">
            <button 
              @click="rescheduleTime = 'tomorrow-9am'"
              class="bg-surface border-2 rounded-lg px-4 py-2 text-fluid-xs font-medium text-body transition-all"
              :class="rescheduleTime === 'tomorrow-9am' ? 'border-primary-700 bg-primary-50 text-primary-700' : 'border-E5E7EB hover:border-primary-300 hover:bg-primary-50/50'"
            >
              Tomorrow 9:00 AM
            </button>
            <button 
              @click="rescheduleTime = 'monday'"
              class="bg-surface border-2 rounded-lg px-4 py-2 text-fluid-xs font-medium text-body transition-all"
              :class="rescheduleTime === 'monday' ? 'border-primary-700 bg-primary-50 text-primary-700' : 'border-E5E7EB hover:border-primary-300 hover:bg-primary-50/50'"
            >
              Monday
            </button>
            <button 
              @click="rescheduleTime = 'custom'"
              class="bg-surface border-2 rounded-lg px-4 py-2 text-fluid-xs font-medium text-body transition-all"
              :class="rescheduleTime === 'custom' ? 'border-primary-700 bg-primary-50 text-primary-700' : 'border-E5E7EB hover:border-primary-300 hover:bg-primary-50/50'"
            >
              Select time
            </button>
          </div>
          
          <div v-if="rescheduleTime === 'custom'" class="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label class="block text-fluid-xs font-semibold mb-1.5">Date</label>
              <input 
                type="date" 
                v-model="customDate"
                class="input"
              >
            </div>
            <div>
              <label class="block text-fluid-xs font-medium text-body mb-1.5">Time</label>
              <input 
                type="time" 
                v-model="customTime"
                class="input"
              >
            </div>
          </div>
        </div>
        
        <div class="flex justify-end gap-2 pt-3 border-t border-E5E7EB">
          <Button
            label="Cancel"
            variant="outline"
            size="small"
            @click="cancelOutcome"
          />
          <Button
            label="Send and reschedule"
            variant="primary"
            size="small"
            @click="handleNoAnswerConfirm"
            class="!bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
          />
        </div>
      </div>

      <!-- Not Valid (Inline) -->
      <div v-if="selectedOutcome === 'not-valid'" class="space-y-4 bg-surface border border-E5E7EB rounded-lg p-6">
        <div>
          <label class="block text-fluid-xs font-semibold mb-2">Category</label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                v-model="disqualifyCategory"
                value="Not Valid"
                class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              >
              <span class="text-fluid-sm text-body">Not Valid</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                v-model="disqualifyCategory"
                value="Not Interested"
                class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              >
              <span class="text-fluid-sm text-body">Not Interested</span>
            </label>
          </div>
        </div>
        
        <div>
          <label class="block text-fluid-xs font-medium text-body mb-2">Failure Reason</label>
          <select 
            v-model="disqualifyReason"
            class="w-full bg-surface border-2 border-red-500 rounded-lg px-3 py-2 text-fluid-sm text-body focus:outline-none focus:border-red-600"
          >
            <option value="">Select a reason...</option>
            <option value="Data cleanup">Data cleanup</option>
            <option value="Unreachable">Unreachable</option>
            <option value="Purchase postponed">Purchase postponed</option>
            <option value="Vehicle sold">Vehicle sold</option>
            <option value="Out of budget">Out of budget</option>
            <option value="Financing rejected">Financing rejected</option>
            <option value="Duplicate">Duplicate</option>
            <option value="Bought elsewhere">Bought elsewhere</option>
          </select>
        </div>
        
        <div class="flex justify-end gap-2 pt-3 border-t border-E5E7EB">
          <Button
            label="Cancel"
            variant="outline"
            size="small"
            @click="cancelOutcome"
          />
          <Button
            label="Confirm Disqualification"
            variant="primary"
            size="small"
            :disabled="!disqualifyCategory || !disqualifyReason"
            @click="handleNotValidConfirm"
            class="!bg-red-600 !hover:bg-red-700 !text-white !border-red-600"
          />
        </div>
      </div>

      <!-- Interested (Inline) -->
      <div v-if="selectedOutcome === 'interested'" class="space-y-4">
        <!-- Customer Preferences Section (full width, first step) -->
        <div class="bg-surface border border-E5E7EB rounded-lg p-6">
          <h5 class="font-semibold text-heading text-fluid-sm mb-3">Customer preferences</h5>
          
          <!-- Purchase Method, Trade-in, and Note Buttons -->
          <div class="flex gap-2">
            <Button
              label="+ Add purchase method"
              variant="primary"
              size="small"
              @click="emit('open-purchase-method')"
              class="!bg-brand-black !hover:bg-brand-darkDarker !text-white !border-brand-black"
            />
            <Button
              label="+ Add trade-in"
              variant="primary"
              size="small"
              @click="emit('open-trade-in')"
              class="!bg-brand-black !hover:bg-brand-darkDarker !text-white !border-brand-black"
            />
            <Button
              label="+ Add note"
              variant="primary"
              size="small"
              @click="showNoteModal = true"
              class="!bg-brand-black !hover:bg-brand-darkDarker !text-white !border-brand-black"
            />
      </div>
    </div>

        <!-- Assignment Section (second step, after preferences) -->
        <div class="bg-surface border border-E5E7EB rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h5 class="font-semibold text-heading text-fluid-sm">Assign to salesman</h5>
            <Button
              label="Change"
              variant="outline"
              size="small"
              class="text-fluid-xs"
              @click="showAssignmentModal = true"
            />
          </div>
          
          <!-- Current Assignment Display -->
          <div v-if="assignment.assignee" class="flex items-center gap-3 p-3 bg-surfaceSecondary rounded-lg border border-E5E7EB">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-fluid-sm"
              :class="assignment.assignee.type === 'team' ? 'bg-green-100 text-green-700' : getRoleAvatarClass(assignment.assignee.role)"
            >
              <i v-if="assignment.assignee.type === 'team'" class="fa-solid fa-users text-fluid-sm"></i>
              <span v-else>{{ getInitials(assignment.assignee.name) }}</span>
            </div>
            <div class="flex-1">
              <p class="font-medium text-fluid-sm text-heading">{{ assignment.assignee.name }}</p>
              <p class="text-fluid-xs text-sub capitalize">
                {{ assignment.assignee.type === 'team' ? 'Team' : assignment.assignee.role }}
              </p>
            </div>
          </div>
          
          <!-- No Assignment Yet -->
          <button 
            v-else 
            @click="showAssignmentModal = true"
            class="w-full p-4 border-2 border-dashed border-E5E7EB rounded-lg hover:border-brand-red hover:bg-red-50/50 transition-colors text-center"
          >
            <i class="fa-solid fa-user-plus text-2xl text-sub mb-2"></i>
            <p class="text-fluid-sm font-medium text-body">Click to assign to salesman</p>
          </button>
        </div>

        <!-- Existing Appointment (if lead already has one) -->
        <div v-if="hasExistingAppointment && !appointmentScheduled" class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-calendar-check text-blue-600"></i>
              <h5 class="heading-sub">Existing Appointment</h5>
            </div>
            <span class="text-xs font-semibold text-blue-600 uppercase">Scheduled</span>
          </div>
          <div class="grid grid-cols-2 gap-3 text-sm mb-3">
            <div>
              <span class="text-body">Date:</span>
              <span class="ml-2 font-medium text-heading">{{ formatDate(lead.scheduledAppointment.start) }}</span>
            </div>
            <div>
              <span class="text-body">Time:</span>
              <span class="ml-2 font-medium text-heading">{{ formatTime(lead.scheduledAppointment.start) }}</span>
            </div>
            <div>
              <span class="text-body">Type:</span>
              <span class="ml-2 font-medium text-heading capitalize">{{ lead.scheduledAppointment.type }}</span>
            </div>
            <div>
              <span class="text-body">Assigned to:</span>
              <span class="ml-2 font-medium text-heading">{{ lead.scheduledAppointment.assignee }}</span>
            </div>
          </div>
          <Button
            label="Reschedule Appointment"
            variant="outline"
            size="small"
            @click="showScheduleAppointmentModal = true"
          />
        </div>

        <!-- Schedule Appointment Section (only show if no existing appointment) -->
        <div v-if="!hasExistingAppointment && !showInlineAppointmentBooking && !appointmentScheduled">
          <button
            @click="showInlineAppointmentBooking = true"
            class="w-full p-4 border-2 border-dashed border-E5E7EB rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-colors text-center"
          >
            <i class="fa-solid fa-calendar-plus text-2xl text-blue-600 mb-2"></i>
            <p class="text-fluid-sm font-medium text-heading">Schedule Appointment</p>
            <p class="text-fluid-xs text-sub mt-1">Book a meeting or test drive (optional)</p>
          </button>
        </div>
        
        <!-- Inline Appointment Booking -->
        <ScheduleAppointmentInline
          v-if="showInlineAppointmentBooking && !appointmentScheduled"
          :preselected-assignee="assignment.assignee"
          :can-cancel="true"
          @confirm="handleScheduleAppointmentConfirm"
          @cancel="showInlineAppointmentBooking = false"
        />
        
        <!-- Appointment Summary (after scheduling) -->
        <div v-if="appointmentScheduled" class="bg-green-50 border border-green-200 rounded-lg p-6">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-calendar-check text-green-600"></i>
              <h5 class="font-semibold text-heading text-fluid-sm">Appointment Scheduled</h5>
            </div>
            <button
              @click="() => { showInlineAppointmentBooking = true; appointmentScheduled = false; }"
              class="text-fluid-xs text-green-700 hover:underline font-medium"
            >
              Reschedule
            </button>
          </div>
          <div class="grid grid-cols-2 gap-3 text-fluid-sm">
            <div>
              <span class="text-body">Date:</span>
              <span class="ml-2 font-medium text-heading">{{ formatDate(scheduledAppointmentData.datetime) }}</span>
            </div>
            <div>
              <span class="text-body">Time:</span>
              <span class="ml-2 font-medium text-heading">{{ scheduledAppointmentData.time }}</span>
            </div>
            <div>
              <span class="text-body">Type:</span>
              <span class="ml-2 font-medium text-heading capitalize">{{ scheduledAppointmentData.type }}</span>
            </div>
            <div>
              <span class="text-body">Assigned to:</span>
              <span class="ml-2 font-medium text-heading">{{ scheduledAppointmentData.assignee }}</span>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex justify-between items-center pt-3 border-t border-E5E7EB">
          <Button
            label="Cancel"
            variant="outline"
            size="small"
            @click="cancelOutcome"
          />
          
          <div class="flex gap-2">
            <Button
              label="Disqualify"
              variant="outline"
              size="small"
              @click="handleDisqualifyFromInterested"
            />
            <Button
              label="Qualify"
              variant="primary"
              size="small"
              @click="handleQualify"
              class="!bg-green-600 !hover:bg-green-700 !text-white !border-green-600"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Note Modal -->
    <Dialog :open="showNoteModal" @update:open="handleNoteModalOpenChange">
      <DialogPortal>
        <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
        <DialogContent class="w-full sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Note</DialogTitle>
          </DialogHeader>

          <NoteWidget
            ref="noteWidgetRef"
            :item="null"
            :task-type="'lead'"
            :task-id="lead.id"
            :borderless="false"
            :hide-actions="true"
            :hide-header="true"
            @save="handleNoteSave"
            @cancel="showNoteModal = false"
          />

          <DialogFooter class="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
            <Button
              variant="outline"
              size="small"
              class="rounded-sm w-full sm:w-auto"
              @click="showNoteModal = false"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="small"
              class="rounded-sm w-full sm:w-auto !bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
              :disabled="!noteWidgetRef?.canSubmit()"
              @click="noteWidgetRef?.submit"
            >
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>

    <!-- Schedule Appointment Modal -->
    <ScheduleAppointmentModal
      :show="showScheduleAppointmentModal"
      :preselected-assignee="assignment.assignee"
      @confirm="handleScheduleAppointmentConfirm"
      @close="showScheduleAppointmentModal = false"
    />

    <!-- Assignment Modal -->
    <ReassignUserModal
      :show="showAssignmentModal"
      title="Assign to salesman"
      confirm-label="Assign"
      @confirm="handleAssignmentConfirm"
      @close="showAssignmentModal = false"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, toRef } from 'vue'
import { Button } from '@motork/component-library'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle
} from '@motork/component-library/future/primitives'
import NoteWidget from '@/components/customer/activities/NoteWidget.vue'
import ScheduleAppointmentModal from '@/components/modals/ScheduleAppointmentModal.vue'
import ScheduleAppointmentInline from '@/components/tasks/shared/ScheduleAppointmentInline.vue'
import ReassignUserModal from '@/components/modals/ReassignUserModal.vue'
import InlineFormContainer from '@/components/customer/InlineFormContainer.vue'
import CommunicationSelector from '@/components/shared/communication/CommunicationSelector.vue'
import { useUsersStore } from '@/stores/users'
import { useUserStore } from '@/stores/user'
import { useSettingsStore } from '@/stores/settings'
import { useLeadsStore } from '@/stores/leads'
import { formatDate, formatTime, formatDueDate } from '@/utils/formatters'
import { useLeadActions } from '@/composables/useLeadActions'
import { LEAD_STAGES } from '@/utils/stageMapper'
import { useLQWidgetCall } from '@/composables/useLQWidgetCall'
import { useLQWidgetOutcomes } from '@/composables/useLQWidgetOutcomes'
import { useLQWidgetHandlers } from '@/composables/useLQWidgetHandlers'
import CallInterface from '@/components/tasks/lead/CallInterface.vue'

const props = defineProps({
  lead: {
    type: Object,
    required: true
  },
  activities: {
    type: Array,
    default: () => []
  }
})

const handleNoteModalOpenChange = (isOpen) => {
  if (!isOpen) {
    showNoteModal.value = false
  }
}

const emit = defineEmits(['postponed', 'validated', 'qualified', 'disqualified', 'call-attempt-logged', 'note-saved', 'open-purchase-method', 'open-trade-in', 'appointment-scheduled'])

const usersStore = useUsersStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()
const leadsStore = useLeadsStore()

// Use lead actions composable
const leadState = useLeadActions(() => props.lead, {})

// Use call composable
const callState = useLQWidgetCall()
const { 
  isCallActive, 
  callEnded, 
  callDuration, 
  callNotes, 
  callData, 
  extractedData, 
  mockTranscription, 
  formattedCallDuration, 
  startCall: startCallFromComposable, 
  endCall: endCallFromComposable, 
  copyNumber: copyNumberFromComposable, 
  extractInformation: extractInformationFromComposable 
} = callState

// State that stays in component
const noteWidgetRef = ref(null)
const showAssignmentModal = ref(false)
const showInlineAppointmentBooking = ref(false)

// Static data that stays in component
const assignableUsers = computed(() => usersStore.assignableUsers)
const currentUser = computed(() => userStore.currentUser)

// Helper functions
const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const getRoleAvatarClass = (role) => {
  const classes = {
    'manager': 'bg-blue-100 text-blue-700',
    'salesman': 'bg-purple-100 text-purple-700',
    'operator': 'bg-orange-100 text-orange-700'
  }
  return classes[role] || 'bg-surfaceSecondary text-body'
}

const handleAssignmentConfirm = (assignee) => {
  assignment.value.assignee = assignee
  showAssignmentModal.value = false
}

// Wrapper functions for coordination
const startCall = () => {
  startCallFromComposable()
}

const copyNumber = () => {
  copyNumberFromComposable(props.lead.customer.phone)
}

const updateCallNotes = (value) => {
  callNotes.value = value
}

const dynamicTitle = computed(() => {
  return leadState.primaryAction.value?.title || 'Call to Verify Contact Details'
})

const dynamicDescription = computed(() => {
  return leadState.primaryAction.value?.description || 'Begin lead qualification by verifying customer contact information.'
})

const isOverdue = computed(() => {
  // Only show overdue if there's an appointment that is overdue
  // Tasks without initial call should not be marked overdue
  if (!props.lead.scheduledAppointment) return false
  
  const appointmentDate = new Date(props.lead.scheduledAppointment.start)
  const now = new Date()
  return appointmentDate < now
})

const hasScheduledFollowUp = computed(() => {
  return !!props.lead.scheduledAppointment
})

const statusBadge = computed(() => {
  if (hasScheduledFollowUp.value) {
    return { text: 'Follow-up Scheduled', class: 'bg-blue-100 text-blue-700' }
  }
  if (isOverdue.value) {
    return { text: 'Overdue', class: 'bg-red-100 text-red-700' }
  }
  // For Pending, show "Task Pending - Due [date]" format
  const pendingText = props.lead.nextActionDue 
    ? `Task Pending - Due ${formatDueDate(props.lead.nextActionDue)}`
    : 'Task Pending'
  return { text: pendingText, class: 'bg-orange-100 text-orange-700' }
})

// Use contactAttempts and maxContactAttempts from state machine
const contactAttempts = leadState.contactAttempts
const maxContactAttempts = leadState.maxContactAttempts

// Use outcome composable
const outcomeState = useLQWidgetOutcomes(
  toRef(props, 'lead'),
  callData,
  extractedData,
  contactAttempts,
  maxContactAttempts,
  currentUser
)

const {
  showOutcomeSelection,
  selectedOutcome,
  appointmentScheduled,
  scheduledAppointmentData,
  showNoteModal,
  showScheduleAppointmentModal,
  followupChannels,
  followupChannel,
  selectedTemplate,
  rescheduleTime,
  customDate,
  customTime,
  disqualifyCategory,
  disqualifyReason,
  assignment,
  preferences,
  messageTemplates,
  messagePreview,
  hasExistingAppointment,
  selectOutcome,
  cancelOutcome,
  calculateNextCallDate
} = outcomeState

const existingNotes = computed(() => {
  return props.activities.filter(activity => activity.type === 'note')
})

// Use handlers composable
const handlers = useLQWidgetHandlers(
  emit,
  callState,
  outcomeState,
  toRef(props, 'lead'),
  contactAttempts,
  maxContactAttempts
)

const {
  logManualCall,
  handleScheduleAppointmentConfirm,
  handleQualify,
  handleDisqualifyFromInterested,
  handleNoAnswerConfirm,
  handleNotValidConfirm,
  handleNoteSave
} = handlers

// Handle follow-up communication send
const handleFollowupSend = async (data) => {
  try {
    followupChannel.value = data.type
    selectedTemplate.value = data.template || ''
    
    // Map communication type to activity action
    const actionMap = {
      'email': 'sent an email',
      'sms': 'sent an SMS',
      'whatsapp': 'sent a WhatsApp message'
    }
    
    // Get user name
    const userName = currentUser.value?.name || 'You'
    
    // Build content string
    let content = data.message || ''
    if (data.type === 'email' && data.subject) {
      content = `${data.subject}: ${content}`
    }
    
    // Save communication activity
    await leadsStore.addActivity(props.lead.id, {
      type: data.type,
      user: userName,
      action: actionMap[data.type] || 'sent a message',
      content: content,
      timestamp: new Date().toISOString()
    })
  } catch (err) {
    console.error('Failed to save follow-up communication:', err)
  }
}

</script>

