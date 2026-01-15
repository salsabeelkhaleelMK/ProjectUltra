<template>
  <div class="bg-gray-50/50 border border-gray-100 rounded-lg p-6 relative transition-all duration-300">
    <div class="flex justify-between items-start mb-3">
      <div>
        <h4 class="font-bold text-gray-900 text-content">{{ dynamicTitle }}</h4>
        <p class="text-meta mt-0.5">
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
        <span class="text-meta-bold text-blue-900">Scheduled Follow-up Call</span>
      </div>
      <p class="text-meta text-blue-700">
        {{ formatDate(lead.scheduledAppointment.start) }} at {{ formatTime(lead.scheduledAppointment.start) }}
      </p>
    </div>

    <!-- Contact Attempt Counter -->
    <div v-if="contactAttempts > 0" class="mb-3 bg-gray-100 border border-gray-200 rounded-lg p-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-phone text-gray-600 text-xs"></i>
          <span class="text-meta-bold text-gray-700">Contact Attempts:</span>
          <span class="text-meta-bold text-gray-900">{{ contactAttempts }} / {{ maxContactAttempts }}</span>
        </div>
        <div 
          v-if="contactAttempts >= maxContactAttempts - 1"
          class="text-meta text-orange-600 font-medium flex items-center gap-1"
        >
          <i class="fa-solid fa-exclamation-triangle"></i>
          One more attempt before auto-disqualification
        </div>
      </div>
    </div>

    <!-- Phone Number Row -->
    <div class="flex items-center gap-2 mb-3">
      <span class="text-content text-gray-700 font-medium">{{ lead.customer.phone }}</span>
      <button
        @click="copyNumber"
        class="flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors w-[21.6px] h-[21.6px]"
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
    <div v-if="showOutcomeSelection" class="mt-4 space-y-4 border-t border-gray-200 pt-4">
      <div>
        <h4 class="font-semibold text-gray-900 mb-2 text-content">What's the outcome?</h4>
        <div class="grid grid-cols-3 gap-2">
          <button 
            @click="selectOutcome('no-answer')"
            class="bg-white border-2 rounded-lg py-3 px-4 flex flex-col items-center justify-center gap-1.5 text-sm font-medium text-gray-700 transition-all"
            :class="selectedOutcome === 'no-answer' ? 'border-brand-red bg-red-50 text-brand-red' : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'"
          >
            <i class="fa-solid fa-phone-slash text-sm"></i>
            <span>No answer</span>
          </button>
          
          <button 
            @click="selectOutcome('not-valid')"
            class="bg-white border-2 rounded-lg py-3 px-4 flex flex-col items-center justify-center gap-1.5 text-sm font-medium text-gray-700 transition-all"
            :class="selectedOutcome === 'not-valid' ? 'border-brand-red bg-red-50 text-brand-red' : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'"
          >
            <i class="fa-solid fa-ban text-sm"></i>
            <span>Not valid</span>
          </button>
          
          <button 
            @click="selectOutcome('interested')"
            class="bg-white border-2 rounded-lg py-3 px-4 flex flex-col items-center justify-center gap-1.5 text-sm font-medium text-gray-700 transition-all"
            :class="selectedOutcome === 'interested' ? 'border-brand-red bg-red-50 text-brand-red' : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'"
          >
            <i class="fa-solid fa-check-circle text-sm"></i>
            <span>Interested</span>
          </button>
        </div>
      </div>

      <!-- No Answer Follow-up (Inline) -->
      <div v-if="selectedOutcome === 'no-answer'" class="space-y-4 bg-white border border-gray-200 rounded-lg p-6">
        <h5 class="font-semibold text-gray-900 text-content">Send follow-up message</h5>
        <div class="grid grid-cols-4 gap-2">
          <button 
            v-for="channel in followupChannels"
            :key="channel.value"
            @click="() => { followupChannel.value = channel.value }"
            class="bg-white border-2 rounded-lg h-10 flex items-center justify-center gap-2 text-sm font-medium transition-all"
            :class="followupChannel.value === channel.value ? 'border-primary-700 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-primary-50/50'"
          >
            <i 
              v-if="channel.value === 'whatsapp'" 
              class="fa-brands fa-whatsapp text-xs"
            ></i>
            <i 
              v-else-if="channel.value === 'sms'" 
              class="fa-solid fa-message text-xs"
            ></i>
            <i 
              v-else-if="channel.value === 'email'" 
              class="fa-solid fa-envelope text-xs"
            ></i>
            <i 
              v-else-if="channel.value === 'dont-send'" 
              class="fa-solid fa-xmark text-xs"
            ></i>
            <span>{{ channel.label }}</span>
          </button>
        </div>

        <div v-if="followupChannel && followupChannel !== 'dont-send'">
          <label class="block text-meta-bold mb-1.5">Template</label>
          <select 
            v-model="selectedTemplate" 
            class="input"
          >
            <option value="followup-1">Follow-up 1</option>
            <option value="followup-2">Follow-up 2</option>
            <option value="custom">Custom message</option>
          </select>
          
          <div class="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p class="text-meta-bold mb-1 uppercase">Message preview</p>
            <p class="text-meta text-gray-700">{{ messagePreview }}</p>
          </div>
        </div>
        
        <div>
          <h5 class="font-semibold text-gray-900 text-content mb-2">Next call attempt</h5>
          <div class="grid grid-cols-3 gap-2">
            <button 
              @click="rescheduleTime = 'tomorrow-9am'"
              class="bg-white border-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all"
              :class="rescheduleTime === 'tomorrow-9am' ? 'border-primary-700 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50/50'"
            >
              Tomorrow 9:00 AM
            </button>
            <button 
              @click="rescheduleTime = 'monday'"
              class="bg-white border-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all"
              :class="rescheduleTime === 'monday' ? 'border-primary-700 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50/50'"
            >
              Monday
            </button>
            <button 
              @click="rescheduleTime = 'custom'"
              class="bg-white border-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all"
              :class="rescheduleTime === 'custom' ? 'border-primary-700 bg-primary-50 text-primary-700' : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50/50'"
            >
              Select time
            </button>
          </div>
          
          <div v-if="rescheduleTime === 'custom'" class="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label class="block text-meta-bold mb-1.5">Date</label>
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
      <div v-if="selectedOutcome === 'not-valid'" class="space-y-4 bg-white border border-gray-200 rounded-lg p-6">
        <div>
          <label class="block text-meta-bold mb-2">Category</label>
          <div class="flex gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                v-model="disqualifyCategory"
                value="Not Valid"
                class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              >
              <span class="text-content text-gray-700">Not Valid</span>
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
            class="w-full bg-white border-2 border-red-500 rounded-lg px-3 py-2 text-content text-gray-700 focus:outline-none focus:border-red-600"
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
        <!-- Assignment Section (full width) -->
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h5 class="font-semibold text-gray-900 text-content mb-3">Assign to salesman</h5>
          
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
        <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h5 class="font-semibold text-gray-900 text-content mb-3">Customer preferences</h5>
          
          <!-- Purchase Method, Trade-in, and Note Buttons -->
          <div class="flex gap-2">
            <Button
              label="Add purchase method"
              variant="primary"
              size="small"
              @click="emit('open-purchase-method')"
              class="!bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
            />
            <Button
              label="Add trade-in"
              variant="primary"
              size="small"
              @click="emit('open-trade-in')"
              class="!bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
            />
            <Button
              label="Add note"
              variant="primary"
              size="small"
              @click="showNoteModal = true"
              class="!bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
            />
      </div>
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
          <Button
            label="Reschedule Appointment"
            variant="outline"
            size="small"
            @click="showScheduleAppointmentModal = true"
          />
        </div>

        <!-- Next Step Selection (only show if no existing appointment) -->
        <div v-if="!hasExistingAppointment" class="bg-white border border-gray-200 rounded-lg p-6">
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
                <div class="heading-sub">Qualify without appointment</div>
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
                <div class="heading-sub">Schedule Appointment</div>
                <div class="text-xs text-gray-500 mt-0.5">
                  {{ appointmentScheduled ? 'Appointment scheduled' : 'Book a meeting or test drive' }}
                </div>
              </div>
              <Button
                v-if="appointmentScheduled"
                label="Reschedule"
                variant="primary"
                size="small"
                @click.stop.prevent="showScheduleAppointmentModal = true"
                class="text-xs !bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
              />
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
      @confirm="handleScheduleAppointmentConfirm"
      @close="showScheduleAppointmentModal = false"
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
import InlineFormContainer from '@/components/customer/InlineFormContainer.vue'
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

const handleNoteModalOpenChange = (isOpen) => {
  if (!isOpen) {
    showNoteModal.value = false
  }
}

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



</script>

