<template>
  <div class="bg-surfaceSecondary/50 border border-E5E7EB rounded-card p-4 relative transition-all duration-300">
    <div class="flex justify-between items-start mb-3">
      <div>
        <h4 class="font-bold text-heading text-sm">{{ dynamicTitle }}</h4>
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
    <div v-if="hasScheduledFollowUp" class="mb-3 bg-blue-50 border border-blue-200 rounded-card p-3">
      <div class="flex items-center gap-2 mb-1">
        <i class="fa-solid fa-phone text-blue-600 text-xs"></i>
        <span class="text-xs font-semibold text-blue-900">Scheduled Follow-up Call</span>
      </div>
      <p class="text-xs text-blue-700">
        {{ formatDate(lead.scheduledAppointment.start) }} at {{ formatTime(lead.scheduledAppointment.start) }}
      </p>
    </div>

    <!-- Contact Attempt Counter -->
    <div v-if="contactAttempts > 0" class="mb-3 bg-surfaceSecondary border border-E5E7EB rounded-card p-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-phone text-gray-600 text-xs"></i>
          <span class="text-xs font-semibold text-body">Contact Attempts:</span>
          <span class="text-xs font-bold text-heading">{{ contactAttempts }} / {{ maxContactAttempts }}</span>
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
      <span class="text-sm text-body font-medium">{{ lead.customer.phone }}</span>
      <Button
        label="Copy"
        variant="ghost"
        size="small"
        @click="copyNumber"
        title="Copy phone number"
      />
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
    <div v-if="showOutcomeSelection" class="mt-4 space-y-4 border-t border-E5E7EB pt-4">
      <div>
        <h4 class="font-semibold text-heading mb-2 text-sm">What's the outcome?</h4>
        <div class="grid grid-cols-3 gap-2">
          <button 
            @click="selectOutcome('no-answer')"
            class="bg-surface border-2 rounded-card py-3 px-4 flex flex-col items-center justify-center gap-1.5 text-sm font-medium text-body transition-all"
            :class="selectedOutcome === 'no-answer' ? 'border-brand-dark bg-surfaceSecondary text-brand-dark' : 'border-E5E7EB hover:border-brand-dark/30 hover:bg-surfaceSecondary/50'"
          >
            <i class="fa-solid fa-phone-slash text-sm"></i>
            <span>No answer</span>
          </button>
          
          <button 
            @click="selectOutcome('not-valid')"
            class="bg-surface border-2 rounded-card py-3 px-4 flex flex-col items-center justify-center gap-1.5 text-sm font-medium text-body transition-all"
            :class="selectedOutcome === 'not-valid' ? 'border-brand-dark bg-surfaceSecondary text-brand-dark' : 'border-E5E7EB hover:border-brand-dark/30 hover:bg-surfaceSecondary/50'"
          >
            <i class="fa-solid fa-ban text-sm"></i>
            <span>Not valid</span>
          </button>
          
          <button 
            @click="selectOutcome('interested')"
            class="bg-surface border-2 rounded-card py-3 px-4 flex flex-col items-center justify-center gap-1.5 text-sm font-medium text-body transition-all"
            :class="selectedOutcome === 'interested' ? 'border-brand-dark bg-surfaceSecondary text-brand-dark' : 'border-E5E7EB hover:border-brand-dark/30 hover:bg-surfaceSecondary/50'"
          >
            <i class="fa-solid fa-check-circle text-sm"></i>
            <span>Interested</span>
          </button>
        </div>
      </div>

      <!-- No Answer Follow-up (Inline) -->
      <div v-if="selectedOutcome === 'no-answer'" class="space-y-4 bg-surface border border-E5E7EB rounded-card p-4">
        <h5 class="font-semibold text-heading text-sm">Send follow-up message</h5>
        <div class="grid grid-cols-4 gap-2">
          <button 
            v-for="channel in followupChannels"
            :key="channel.value"
            @click="() => { followupChannel.value = channel.value }"
            class="bg-surface border-2 rounded-btn h-10 flex items-center justify-center gap-2 text-sm font-medium transition-all"
            :class="followupChannel.value === channel.value ? 'border-primary-700 bg-primary-50 text-primary-700' : 'border-E5E7EB text-body hover:border-primary-300 hover:bg-primary-50/50'"
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
          <label class="block text-xs font-medium text-gray-600 mb-1.5">Template</label>
          <select 
            v-model="selectedTemplate" 
            class="input"
          >
            <option value="followup-1">Follow-up 1</option>
            <option value="followup-2">Follow-up 2</option>
            <option value="custom">Custom message</option>
          </select>
          
          <div class="mt-2 p-3 bg-surfaceSecondary border border-E5E7EB rounded-card">
            <p class="text-xs font-semibold text-gray-600 mb-1 uppercase">Message preview</p>
            <p class="text-xs text-body">{{ messagePreview }}</p>
          </div>
        </div>
        
        <div>
          <h5 class="font-semibold text-heading text-sm mb-2">Next call attempt</h5>
          <div class="grid grid-cols-3 gap-2">
            <button 
              @click="rescheduleTime = 'tomorrow-9am'"
              class="bg-surfaceSecondary border-2 rounded-btn px-4 py-2 text-sm font-medium text-heading transition-all border-E5E7EB hover:border-primary-300 hover:bg-brand-gray"
              :class="rescheduleTime === 'tomorrow-9am' ? 'border-primary-700 bg-primary-700 text-white' : ''"
            >
              Tomorrow 9:00 AM
            </button>
            <button 
              @click="rescheduleTime = 'monday'"
              class="bg-surfaceSecondary border-2 rounded-btn px-4 py-2 text-sm font-medium text-heading transition-all border-E5E7EB hover:border-primary-300 hover:bg-brand-gray"
              :class="rescheduleTime === 'monday' ? 'border-primary-700 bg-primary-700 text-white' : ''"
            >
              AI suggestion
            </button>
            <button 
              @click="rescheduleTime = 'custom'"
              class="bg-surfaceSecondary border-2 rounded-btn px-4 py-2 text-sm font-medium text-heading transition-all border-E5E7EB hover:border-primary-300 hover:bg-brand-gray"
              :class="rescheduleTime === 'custom' ? 'border-primary-700 bg-primary-700 text-white' : ''"
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
        
        <div class="flex items-center gap-2 pt-3 border-t border-E5E7EB flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            class="flex-1 min-w-0"
            @click="cancelOutcome"
          >
            <i class="fa-solid fa-xmark mr-1.5"></i>
            <span class="truncate">Cancel</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            class="flex-1 min-w-0 !bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
            @click="handleNoAnswerConfirm"
          >
            <i class="fa-solid fa-paper-plane mr-1.5"></i>
            <span class="truncate">Send and reschedule</span>
          </Button>
        </div>
      </div>

      <!-- Not Valid (Inline) -->
      <div v-if="selectedOutcome === 'not-valid'" class="space-y-4 bg-surface border border-E5E7EB rounded-card p-4">
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
              <span class="text-sm text-body">Not Valid</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                v-model="disqualifyCategory"
                value="Not Interested"
                class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              >
              <span class="text-sm text-body">Not Interested</span>
            </label>
          </div>
        </div>
        
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-2">Failure Reason</label>
          <select 
            v-model="disqualifyReason"
            class="w-full bg-surface border-2 border-red-500 rounded-btn px-3 py-2 text-sm text-body focus:outline-none focus:border-red-600"
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
        
        <div class="flex items-center gap-2 pt-3 border-t border-E5E7EB flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            class="flex-1 min-w-0"
            @click="cancelOutcome"
          >
            <i class="fa-solid fa-xmark mr-1.5"></i>
            <span class="truncate">Cancel</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            class="flex-1 min-w-0 !bg-red-600 !hover:bg-red-700 !text-white !border-red-600"
            :disabled="!disqualifyCategory || !disqualifyReason"
            @click="handleNotValidConfirm"
          >
            <i class="fa-solid fa-ban mr-1.5"></i>
            <span class="truncate">Confirm Disqualification</span>
          </Button>
        </div>
      </div>

      <!-- Interested (Inline) -->
      <div v-if="selectedOutcome === 'interested'" class="space-y-4">
        <!-- Customer Data Section (full width, first step) -->
        <div class="bg-surface border border-E5E7EB rounded-card p-4">
          <h5 class="font-semibold text-heading text-sm mb-3">Customer data</h5>
          
          <!-- Trade-in, Financing, Vehicle, and Note Buttons -->
          <div class="flex gap-2 flex-wrap">
            <Button
              label="+ Add vehicle"
              variant="primary"
              size="small"
              @click="showVehicleModal = true"
              class="!bg-brand-black !hover:bg-brand-darkDarker !text-white !border-brand-black"
            />
            <Button
              label="+ Add trade-in"
              variant="primary"
              size="small"
              @click="showTradeInModal = true"
              class="!bg-brand-black !hover:bg-brand-darkDarker !text-white !border-brand-black"
            />
            <Button
              label="+ Add financing"
              variant="primary"
              size="small"
              @click="showFinancingModal = true"
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

        <!-- Survey Section -->
        <div v-if="showSurvey && !surveyCompleted" class="bg-surface border border-E5E7EB rounded-card p-4 space-y-3">
          <div class="flex items-center gap-2 pb-2 border-b border-E5E7EB">
            <i class="fa-solid fa-clipboard-check text-brand-red text-sm"></i>
            <h5 class="font-semibold text-heading text-sm">Lead Qualification Survey</h5>
            <span class="text-xs text-sub ml-auto">(Optional but recommended)</span>
          </div>
          <SurveyWidget
            :questions="leadQualificationSurveyQuestions"
            :initial-expanded="true"
            @survey-completed="handleSurveyCompleted"
            @survey-refused="handleSurveyRefused"
            @not-responding="handleNotResponding"
          />
        </div>

        <!-- Survey Completed Indicator -->
        <div v-if="surveyCompleted" class="bg-green-50 border border-green-200 rounded-card p-3">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-check-circle text-green-600 text-sm"></i>
            <span class="text-xs font-semibold text-green-900">Survey completed</span>
          </div>
        </div>

        <!-- Assignment Section (second step, after preferences) -->
        <div class="bg-surface border border-E5E7EB rounded-card p-4">
          <div class="flex items-center justify-between mb-3">
            <h5 class="font-semibold text-heading text-sm">Assign to salesman</h5>
            <Button
              label="Change"
              variant="outline"
              size="small"
              class="text-xs"
              @click="showAssignmentModal = true"
            />
          </div>
          
          <!-- Current Assignment Display -->
          <div v-if="assignment.assignee" class="flex items-center gap-3 p-2.5 bg-surfaceSecondary rounded-btn border border-E5E7EB">
            <div 
              class="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs"
              :class="assignment.assignee.type === 'team' ? 'bg-green-100 text-green-700' : getRoleAvatarClass(assignment.assignee.role)"
            >
              <i v-if="assignment.assignee.type === 'team'" class="fa-solid fa-users text-xs"></i>
              <span v-else>{{ getInitials(assignment.assignee.name) }}</span>
            </div>
            <div class="flex-1">
              <p class="font-medium text-sm text-heading">{{ assignment.assignee.name }}</p>
              <p class="text-xs text-sub capitalize">
                {{ assignment.assignee.type === 'team' ? 'Team' : assignment.assignee.role }}
              </p>
            </div>
          </div>
          
          <!-- No Assignment Yet -->
          <button 
            v-else 
            @click="showAssignmentModal = true"
            class="w-full p-3 border-2 border-dashed border-E5E7EB rounded-card hover:border-brand-red hover:bg-red-50/50 transition-colors text-center"
          >
            <i class="fa-solid fa-user-plus text-xl text-sub mb-1"></i>
            <p class="text-xs font-medium text-body">Click to assign</p>
          </button>
        </div>

        <!-- Existing Appointment (if lead already has one) -->
        <div v-if="hasExistingAppointment && !appointmentScheduled" class="bg-blue-50 border border-blue-200 rounded-card p-4">
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
              <span class="ml-2 font-medium text-heading">{{ formatDate(lead.scheduledAppointment.start) }}</span>
            </div>
            <div>
              <span class="text-gray-600">Time:</span>
              <span class="ml-2 font-medium text-heading">{{ formatTime(lead.scheduledAppointment.start) }}</span>
            </div>
            <div>
              <span class="text-gray-600">Type:</span>
              <span class="ml-2 font-medium text-heading capitalize">{{ lead.scheduledAppointment.type }}</span>
            </div>
            <div>
              <span class="text-gray-600">Assigned to:</span>
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
            class="w-full p-3 border-2 border-dashed border-E5E7EB rounded-card hover:border-blue-300 hover:bg-blue-50/50 transition-colors text-center"
          >
            <i class="fa-solid fa-calendar-plus text-xl text-blue-600 mb-1"></i>
            <p class="text-sm font-medium text-heading">Schedule Appointment</p>
            <p class="text-xs text-sub mt-0.5">Book a meeting or test drive (optional)</p>
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
        <div v-if="appointmentScheduled" class="bg-green-50 border border-green-200 rounded-card p-4">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-calendar-check text-green-600 text-sm"></i>
              <h5 class="font-semibold text-heading text-sm">Appointment Scheduled</h5>
            </div>
            <button
              @click="() => { showInlineAppointmentBooking = true; appointmentScheduled = false; }"
              class="text-xs text-green-700 hover:underline font-medium"
            >
              Reschedule
            </button>
          </div>
          <div class="grid grid-cols-2 gap-3 text-sm">
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
        <div class="flex items-center gap-2 pt-3 border-t border-E5E7EB flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            class="flex-1 min-w-0"
            @click="cancelOutcome"
          >
            <i class="fa-solid fa-xmark mr-1.5"></i>
            <span class="truncate">Cancel</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            class="flex-1 min-w-0"
            @click="handleDisqualifyFromInterested"
          >
            <i class="fa-solid fa-ban mr-1.5"></i>
            <span class="truncate">Disqualify</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            class="flex-1 min-w-0 !bg-green-600 !hover:bg-green-700 !text-white !border-green-600"
            @click="handleQualify"
          >
            <i class="fa-solid fa-check mr-1.5"></i>
            <span class="truncate">Qualify</span>
          </Button>
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
          :disabled="!noteWidgetRef?.canSubmit()"
          @click="noteWidgetRef?.submit"
          class="!bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
        />
      </template>
    </ModalShell>

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

    <!-- Trade-In Modal -->
    <TradeInModal
      :show="showTradeInModal"
      :task-type="'lead'"
      :task-id="lead.id"
      @save="handleTradeInSave"
      @close="showTradeInModal = false"
    />

    <!-- Financing Modal -->
    <FinancingModal
      :show="showFinancingModal"
      :task-type="'lead'"
      :task-id="lead.id"
      @save="handleFinancingSave"
      @close="showFinancingModal = false"
    />

    <!-- Add Vehicle Modal -->
    <AddVehicleModal
      :show="showVehicleModal"
      :lead="lead"
      :customer-id="lead.customerId"
      @close="showVehicleModal = false"
      @saved="handleVehicleSaved"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, toRef } from 'vue'
import { Button } from '@motork/component-library'
import NoteWidget from '@/components/customer/activities/NoteWidget.vue'
import ScheduleAppointmentModal from '@/components/modals/ScheduleAppointmentModal.vue'
import ScheduleAppointmentInline from '@/components/tasks/shared/ScheduleAppointmentInline.vue'
import ReassignUserModal from '@/components/modals/ReassignUserModal.vue'
import TradeInModal from '@/components/modals/TradeInModal.vue'
import FinancingModal from '@/components/modals/FinancingModal.vue'
import AddVehicleModal from '@/components/modals/AddVehicleModal.vue'
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
import SurveyWidget from '@/components/customer/SurveyWidget.vue'
import { useLeadsStore } from '@/stores/leads'

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

const emit = defineEmits(['postponed', 'validated', 'qualified', 'disqualified', 'call-attempt-logged', 'note-saved', 'open-purchase-method', 'appointment-scheduled', 'survey-completed', 'survey-refused', 'not-responding'])

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
const showTradeInModal = ref(false)
const showFinancingModal = ref(false)
const showVehicleModal = ref(false)

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
  calculateNextCallDate,
  surveyCompleted,
  surveyResponses,
  showSurvey
} = outcomeState

const existingNotes = computed(() => {
  return props.activities.filter(activity => activity.type === 'note')
})

// Define survey questions
const leadQualificationSurveyQuestions = [
  {
    key: 'interestLevel',
    label: 'Customer interest level?',
    type: 'radio',
    options: ['High', 'Medium', 'Low']
  },
  {
    key: 'purchaseTimeline',
    label: 'Expected purchase timeline?',
    type: 'select',
    options: ['Immediate', 'Within 1 month', 'Within 3 months', 'Within 6 months', 'Just browsing']
  },
  {
    key: 'budgetRange',
    label: 'Budget range (if discussed)?',
    type: 'select',
    options: ['Under €30k', '€30k-€50k', '€50k-€80k', '€80k+', 'Not discussed']
  },
  {
    key: 'preferredContact',
    label: 'Preferred contact method?',
    type: 'radio',
    options: ['Phone', 'Email', 'WhatsApp', 'SMS']
  },
  {
    key: 'additionalNotes',
    label: 'Additional notes',
    type: 'text',
    placeholder: 'Any relevant information about customer interest or preferences...'
  }
]

// Use handlers composable
const handlers = useLQWidgetHandlers(
  emit,
  callState,
  outcomeState,
  toRef(props, 'lead'),
  contactAttempts,
  maxContactAttempts,
  leadsStore
)

const {
  logManualCall,
  handleScheduleAppointmentConfirm,
  handleQualify,
  handleDisqualifyFromInterested,
  handleNoAnswerConfirm,
  handleNotValidConfirm,
  handleNoteSave,
  handleSurveyCompleted,
  handleSurveyRefused,
  handleNotResponding
} = handlers

// Trade-in and Financing handlers
const handleTradeInSave = (tradeInData) => {
  showTradeInModal.value = false
  // Update preferences to reflect trade-in was added
  preferences.value.tradeIn = true
  emit('note-saved', { type: 'trade-in', ...tradeInData })
}

const handleFinancingSave = (financingData) => {
  showFinancingModal.value = false
  // Update preferences to reflect financing was added
  preferences.value.financing = true
  emit('note-saved', { type: 'financing', ...financingData })
}

// Handle vehicle save
const handleVehicleSaved = async (vehicleData) => {
  try {
    showVehicleModal.value = false
    const { addVehicleToCustomer } = await import('@/api/contacts')
    await addVehicleToCustomer(props.lead.customerId, vehicleData)
    emit('note-saved', { type: 'vehicle', ...vehicleData })
  } catch (err) {
    console.error('Error saving vehicle:', err)
  }
}

</script>

