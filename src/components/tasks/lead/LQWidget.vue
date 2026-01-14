<template>
  <div class="bg-gray-50/50 border border-gray-100 rounded-lg p-4 relative transition-all duration-300">
    <div class="flex justify-between items-start mb-3">
      <div>
        <h4 class="font-bold text-gray-900 text-sm">{{ dynamicTitle }}</h4>
        <p class="text-xs text-gray-500 mt-0.5">
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
        <span class="text-xs font-semibold text-blue-900">Scheduled Follow-up Call</span>
      </div>
      <p class="text-xs text-blue-700">
        {{ formatDate(lead.scheduledAppointment.start) }} at {{ formatTime(lead.scheduledAppointment.start) }}
      </p>
    </div>

    <!-- Contact Attempt Counter -->
    <div v-if="contactAttempts > 0" class="mb-3 bg-gray-100 border border-gray-200 rounded-lg p-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-phone text-gray-600 text-xs"></i>
          <span class="text-xs font-semibold text-gray-700">Contact Attempts:</span>
          <span class="text-xs font-bold text-gray-900">{{ contactAttempts }} / {{ maxContactAttempts }}</span>
        </div>
        <div 
          v-if="contactAttempts >= maxContactAttempts - 1"
          class="text-xs text-orange-600 font-medium flex items-center gap-1"
        >
          <i class="fa-solid fa-exclamation-triangle"></i>
          One more attempt before auto-disqualification
        </div>
      </div>
    </div>

    <!-- Phone Number Row -->
    <div class="flex items-center gap-2 mb-3">
      <span class="text-sm text-gray-700 font-medium">{{ lead.customer.phone }}</span>
      <button 
        @click="copyNumber"
        class="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
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
    />

    <!-- Inline Outcome Selection (replaces modal) -->
    <div v-if="showOutcomeSelection" class="mt-4 space-y-4 border-t border-gray-200 pt-4">
      <div>
        <h4 class="font-semibold text-gray-900 mb-2 text-sm">What's the outcome?</h4>
        <div class="grid grid-cols-3 gap-2">
          <button 
            @click="selectOutcome('no-answer')"
            class="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border transition-all"
            :class="selectedOutcome === 'no-answer' 
              ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' 
              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'"
          >
            <i class="fa-solid fa-phone-slash text-base"></i>
            <span class="font-medium text-xs">No answer</span>
          </button>
          
          <button 
            @click="selectOutcome('not-valid')"
            class="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border transition-all"
            :class="selectedOutcome === 'not-valid' 
              ? 'bg-red-50 border-red-500 text-red-700 shadow-sm' 
              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'"
          >
            <i class="fa-solid fa-thumbs-down text-base"></i>
            <span class="font-medium text-xs">Not valid</span>
          </button>
          
          <button 
            @click="selectOutcome('interested')"
            class="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg border transition-all"
            :class="selectedOutcome === 'interested' 
              ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' 
              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'"
          >
            <i class="fa-solid fa-check text-base"></i>
            <span class="font-medium text-xs">Interested</span>
          </button>
        </div>
      </div>

      <!-- No Answer Follow-up (Inline) -->
      <div v-if="selectedOutcome === 'no-answer'" class="space-y-4 bg-white border border-gray-200 rounded-lg p-4">
        <h5 class="font-semibold text-gray-900 text-sm">Send follow-up message</h5>
        <div class="grid grid-cols-4 gap-2">
          <button 
            v-for="channel in followupChannels"
            :key="channel.value"
            @click="followupChannel = channel.value"
            class="px-3 py-2 rounded-lg text-xs font-medium transition-all border-2"
            :class="followupChannel === channel.value
              ? 'bg-blue-50 border-blue-500 text-blue-700'
              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'"
          >
            {{ channel.label }}
          </button>
        </div>

        <div v-if="followupChannel && followupChannel !== 'dont-send'">
          <label class="block text-xs font-medium text-gray-600 mb-1.5">Template</label>
          <select 
            v-model="selectedTemplate" 
            class="input"
          >
            <option value="followup-1">Follow-up 1</option>
            <option value="followup-2">Follow-up 2</option>
            <option value="custom">Custom message</option>
          </select>
          
          <div class="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p class="text-xs font-semibold text-gray-600 mb-1 uppercase">Message preview</p>
            <p class="text-xs text-gray-700">{{ messagePreview }}</p>
          </div>
        </div>
        
        <div>
          <h5 class="font-semibold text-gray-900 text-sm mb-2">Next call attempt</h5>
          <div class="grid grid-cols-3 gap-2">
            <button 
              @click="rescheduleTime = 'tomorrow-9am'"
              class="px-3 py-2 rounded-lg text-xs font-medium transition-all border-2"
              :class="rescheduleTime === 'tomorrow-9am'
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'"
            >
              Tomorrow 9:00 AM
            </button>
            <button 
              @click="rescheduleTime = 'monday'"
              class="px-3 py-2 rounded-lg text-xs font-medium transition-all border-2"
              :class="rescheduleTime === 'monday'
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'"
            >
              Monday
            </button>
            <button 
              @click="rescheduleTime = 'custom'"
              class="px-3 py-2 rounded-lg text-xs font-medium transition-all border-2"
              :class="rescheduleTime === 'custom'
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'"
            >
              Select time
            </button>
          </div>
          
          <div v-if="rescheduleTime === 'custom'" class="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Date</label>
              <input 
                type="date" 
                v-model="customDate"
                class="input"
              >
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Time</label>
              <input 
                type="time" 
                v-model="customTime"
                class="input"
              >
            </div>
          </div>
        </div>
        
        <div class="flex justify-end gap-2 pt-3 border-t border-gray-200">
          <button 
            @click="cancelOutcome"
            class="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="handleNoAnswerConfirm"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm"
          >
            Send and reschedule <i class="fa-solid fa-check"></i>
          </button>
        </div>
      </div>

      <!-- Not Valid (Inline) -->
      <div v-if="selectedOutcome === 'not-valid'" class="space-y-4 bg-white border border-gray-200 rounded-lg p-4">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-2">Category</label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                v-model="disqualifyCategory"
                value="Not Valid"
                class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              >
              <span class="text-sm text-gray-700">Not Valid</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                v-model="disqualifyCategory"
                value="Not Interested"
                class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              >
              <span class="text-sm text-gray-700">Not Interested</span>
            </label>
          </div>
        </div>
        
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-2">Failure Reason</label>
          <select 
            v-model="disqualifyReason"
            class="w-full bg-white border-2 border-red-500 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-red-600"
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
        
        <div class="flex justify-end gap-2 pt-3 border-t border-gray-200">
          <button 
            @click="cancelOutcome"
            class="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="handleNotValidConfirm"
            :disabled="!disqualifyCategory || !disqualifyReason"
            class="bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Confirm Disqualification
          </button>
        </div>
      </div>

      <!-- Interested (Inline) -->
      <div v-if="selectedOutcome === 'interested'" class="space-y-4">
        <!-- Assignment Section (full width) -->
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <h5 class="font-semibold text-gray-900 text-sm mb-3">Assign to salesman</h5>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Dealership</label>
              <select 
                v-model="assignment.dealership" 
                class="input"
              >
                <option v-for="dealership in dealerships" :key="dealership" :value="dealership">
                  {{ dealership }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Team</label>
              <select 
                v-model="assignment.team" 
                class="input"
              >
                <option v-for="team in teams" :key="team" :value="team">
                  {{ team }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Assignee</label>
              <select 
                v-model="assignment.assigneeId" 
                class="input"
              >
                <option v-for="user in assignableUsers" :key="user.id" :value="user.id">
                  {{ user.name }}{{ user.id === currentUser.id ? ' (Me)' : '' }}
                </option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Customer Preferences Section (full width, below assignment) -->
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <h5 class="font-semibold text-gray-900 text-sm mb-3">Customer preferences</h5>
          
          <!-- Purchase Method, Trade-in, and Note Buttons -->
          <div class="flex gap-2">
            <button 
              @click="emit('open-purchase-method')"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm"
            >
              <i class="fa-solid fa-plus text-xs"></i>
              Add purchase method
            </button>
            <button 
              @click="emit('open-trade-in')"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm"
            >
              <i class="fa-solid fa-plus text-xs"></i>
              Add trade-in
            </button>
            <button 
              @click="showNoteModal = true"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm"
            >
              <i class="fa-solid fa-plus text-xs"></i>
              Add note
            </button>
      </div>
    </div>

        <!-- Existing Appointment (if lead already has one) -->
        <div v-if="hasExistingAppointment && !appointmentScheduled" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-calendar-check text-blue-600"></i>
              <h5 class="text-sm font-semibold text-gray-900">Existing Appointment</h5>
            </div>
            <span class="text-xs font-semibold text-blue-600 uppercase">Scheduled</span>
          </div>
          <div class="grid grid-cols-2 gap-3 text-sm mb-3">
            <div>
              <span class="text-gray-600">Date:</span>
              <span class="ml-2 font-medium text-gray-900">{{ formatDate(lead.scheduledAppointment.start) }}</span>
            </div>
            <div>
              <span class="text-gray-600">Time:</span>
              <span class="ml-2 font-medium text-gray-900">{{ formatTime(lead.scheduledAppointment.start) }}</span>
            </div>
            <div>
              <span class="text-gray-600">Type:</span>
              <span class="ml-2 font-medium text-gray-900 capitalize">{{ lead.scheduledAppointment.type }}</span>
            </div>
            <div>
              <span class="text-gray-600">Assigned to:</span>
              <span class="ml-2 font-medium text-gray-900">{{ lead.scheduledAppointment.assignee }}</span>
            </div>
          </div>
          <button 
            @click="showScheduleAppointmentModal = true"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors shadow-sm flex items-center gap-2"
          >
            <i class="fa-solid fa-calendar-days text-xs"></i>
            Reschedule Appointment
          </button>
        </div>

        <!-- Next Step Selection (only show if no existing appointment) -->
        <div v-if="!hasExistingAppointment" class="bg-white border border-gray-200 rounded-lg p-4">
          <h5 class="text-xs font-semibold text-gray-600 mb-3">Choose Next Step</h5>
          <div class="space-y-2">
            <!-- Qualify without appointment -->
            <label class="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all"
              :class="{ 'border-blue-500 bg-blue-50': !appointmentScheduled }"
            >
              <input 
                type="radio" 
                :checked="!appointmentScheduled"
                @change="() => { appointmentScheduled = false; scheduledAppointmentData = null }"
                class="mt-0.5 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <div class="flex-1">
                <div class="text-sm font-semibold text-gray-900">Qualify without appointment</div>
                <div class="text-xs text-gray-500 mt-0.5">Proceed directly to opportunity stage</div>
              </div>
            </label>
            
            <!-- Schedule Appointment -->
            <label 
              class="flex items-start gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all"
              :class="{ 'border-blue-500 bg-blue-50': appointmentScheduled }"
              @click="!appointmentScheduled && (showScheduleAppointmentModal = true)"
            >
              <input 
                type="radio" 
                :checked="appointmentScheduled"
                :disabled="!appointmentScheduled"
                class="mt-0.5 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <div class="flex-1">
                <div class="text-sm font-semibold text-gray-900">Schedule Appointment</div>
                <div class="text-xs text-gray-500 mt-0.5">
                  {{ appointmentScheduled ? 'Appointment scheduled' : 'Book a meeting or test drive' }}
                </div>
              </div>
              <button 
                v-if="appointmentScheduled"
                @click.stop.prevent="showScheduleAppointmentModal = true"
                class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm"
              >
                Reschedule
              </button>
            </label>
          </div>
        </div>
        
        <!-- Appointment Summary (after scheduling) -->
        <InlineFormContainer 
          v-if="appointmentScheduled"
          title="Scheduled Appointment"
          :show-close="false"
        >
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span class="text-gray-600">Date:</span>
                <span class="ml-2 font-medium text-gray-900">{{ formatDate(scheduledAppointmentData.datetime) }}</span>
              </div>
              <div>
                <span class="text-gray-600">Time:</span>
                <span class="ml-2 font-medium text-gray-900">{{ scheduledAppointmentData.time }}</span>
              </div>
              <div>
                <span class="text-gray-600">Type:</span>
                <span class="ml-2 font-medium text-gray-900 capitalize">{{ scheduledAppointmentData.type }}</span>
              </div>
              <div>
                <span class="text-gray-600">Assigned to:</span>
                <span class="ml-2 font-medium text-gray-900">{{ scheduledAppointmentData.assignee }}</span>
              </div>
            </div>
            <div v-if="scheduledAppointmentData.location" class="text-sm">
              <span class="text-gray-600">Location:</span>
              <span class="ml-2 font-medium text-gray-900">{{ scheduledAppointmentData.location }}</span>
            </div>
            <div v-if="scheduledAppointmentData.notes" class="text-sm">
              <span class="text-gray-600">Notes:</span>
              <p class="mt-1 text-gray-700">{{ scheduledAppointmentData.notes }}</p>
            </div>
          </div>
        </InlineFormContainer>
        
        <!-- Action Buttons -->
        <div class="flex justify-between items-center pt-3 border-t border-gray-200">
          <button 
            @click="cancelOutcome"
            class="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
          
          <div class="flex gap-2">
            <button 
              @click="handleDisqualifyFromInterested"
              class="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <i class="fa-solid fa-ban text-xs"></i>
              Disqualify
            </button>
            <button 
              @click="handleQualify"
              class="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors shadow-sm flex items-center gap-2"
            >
              <i class="fa-solid fa-check text-xs"></i>
              Qualify
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Note Modal -->
    <ModalShell
      :show="showNoteModal"
      title="Add Note"
      size="2xl"
      @close="showNoteModal = false"
    >
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
      <template #actions>
        <Button
          label="Save Note"
          variant="primary"
          size="small"
          class="rounded-sm"
          :disabled="!noteWidgetRef?.canSubmit()"
          @click="noteWidgetRef?.submit"
        />
      </template>
    </ModalShell>

    <!-- Schedule Appointment Modal -->
    <ScheduleAppointmentModal
      :show="showScheduleAppointmentModal"
      @confirm="handleScheduleAppointmentConfirm"
      @close="showScheduleAppointmentModal = false"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, toRef } from 'vue'
import { Button } from '@motork/component-library'
import NoteWidget from '@/components/customer/activities/NoteWidget.vue'
import ScheduleAppointmentModal from '@/components/modals/ScheduleAppointmentModal.vue'
import InlineFormContainer from '@/components/customer/InlineFormContainer.vue'
import ModalShell from '@/components/shared/ModalShell.vue'
import { useUsersStore } from '@/stores/users'
import { useUserStore } from '@/stores/user'
import { useSettingsStore } from '@/stores/settings'
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

const emit = defineEmits(['postponed', 'validated', 'qualified', 'disqualified', 'call-attempt-logged', 'note-saved', 'open-purchase-method', 'open-trade-in', 'appointment-scheduled'])

const usersStore = useUsersStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

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

// Static data that stays in component
const dealerships = ['Barcelona', 'Madrid', 'Valencia', 'Firenze', 'Milano', 'Roma']
const teams = ['Audi Sales (New)', 'Audi Sales (Used)', 'Sales (New)', 'Sales (Used)']
const assignableUsers = computed(() => usersStore.assignableUsers)
const currentUser = computed(() => userStore.currentUser)

// Wrapper functions for coordination
const startCall = () => {
  startCallFromComposable()
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



</script>

