<template>
  <div class="bg-gray-50/50 border border-gray-100 rounded-lg p-4 relative transition-all duration-300">
    <div class="flex justify-between items-start mb-3">
      <div>
        <h4 class="font-bold text-slate-800 text-sm">Lead Qualification Task</h4>
        <p class="text-xs text-gray-500 mt-0.5">
          {{ taskDescription }}
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
          <span class="text-xs font-semibold text-slate-700">Contact Attempts:</span>
          <span class="text-xs font-bold text-slate-800">{{ contactAttempts }} / 5</span>
        </div>
        <div 
          v-if="contactAttempts >= 4"
          class="text-xs text-orange-600 font-medium flex items-center gap-1"
        >
          <i class="fa-solid fa-exclamation-triangle"></i>
          One more attempt before auto-disqualification
        </div>
      </div>
    </div>

    <!-- Phone Number Row -->
    <div class="flex items-center gap-2 mb-3">
      <span class="text-sm text-slate-700 font-medium">{{ lead.customer.phone }}</span>
      <button 
        @click="copyNumber"
        class="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        title="Copy phone number"
      >
        <i class="fa-regular fa-copy text-xs"></i>
      </button>
    </div>
    
    <!-- Call Action Buttons Row -->
    <div class="flex gap-2 items-center mb-4">
      <!-- Primary: Call Button -->
      <button 
        @click="startCall"
        :disabled="isCallActive"
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-blue-200"
      >
        <i class="fa-solid fa-phone"></i>
        {{ contactAttempts > 0 ? 'Call Again' : 'Initiate Call' }}
        <span v-if="contactAttempts > 0" class="bg-blue-500 px-2 py-0.5 rounded text-xs font-bold">
          {{ contactAttempts + 1 }}/5
        </span>
      </button>
      
      <!-- Secondary: Log Manual Call -->
      <button 
        @click="logManualCall"
        :disabled="isCallActive"
        class="bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed border border-gray-200 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
      >
        <i class="fa-solid fa-clipboard-check text-xs"></i>
        Log Call Outcome
      </button>
    </div>

    <!-- Inline Call Interface (shows when call is active or ended) -->
    <div v-if="isCallActive || callEnded" class="mb-4 space-y-4 border-t border-gray-200 pt-4">
      
      <!-- Transcription Area (shows when call is active) -->
      <div v-if="isCallActive" class="bg-slate-900 text-white rounded-lg p-4">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-waveform-lines text-blue-400 animate-pulse"></i>
            <span class="text-xs font-bold uppercase tracking-wider">TRANSCRIBING</span>
          </div>
          <div class="flex items-center gap-2 text-red-400">
            <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span class="text-xs font-mono">REC {{ formattedCallDuration }}</span>
          </div>
        </div>
        
        <!-- Mock Transcription -->
        <div class="space-y-3 text-sm font-mono">
          <div>
            <span class="text-blue-400 font-semibold">Lead:</span>
            <span class="ml-2">{{ mockTranscription.leadLines[0] }}</span>
          </div>
          <div>
            <span class="text-green-400 font-semibold">Sales:</span>
            <span class="ml-2">{{ mockTranscription.salesLines[0] }}</span>
          </div>
          <div v-if="callDuration >= 5">
            <span class="text-blue-400 font-semibold">Lead:</span>
            <span class="ml-2">{{ mockTranscription.leadLines[1] }}</span>
          </div>
          <div v-if="callDuration >= 8">
            <span class="text-green-400 font-semibold">Sales:</span>
            <span class="ml-2">{{ mockTranscription.salesLines[1] }}</span>
          </div>
          <div v-if="callDuration >= 12">
            <span class="text-blue-400 font-semibold">Lead:</span>
            <span class="ml-2">{{ mockTranscription.leadLines[2] }}</span>
          </div>
        </div>
        
        <!-- Quick Note -->
        <div class="mt-4 pt-4 border-t border-slate-700">
          <textarea 
            v-model="callNotes"
            placeholder="Add a quick note about this call..."
            class="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
            rows="3"
          ></textarea>
        </div>
        
        <!-- End Call Button -->
        <div class="mt-4 flex justify-end">
          <button 
            @click="endCall"
            class="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
          >
            <i class="fa-solid fa-phone-slash"></i>
            End Call
          </button>
        </div>
      </div>
      
      <!-- Call Ended Section -->
      <div v-if="callEnded && !isCallActive" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-bold text-slate-800 mb-1 text-sm">Call Ended</h4>
            <p class="text-xs text-gray-600">Extract information from the transcription</p>
          </div>
      <button 
            @click="extractInformation"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm"
      >
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            Extract information
      </button>
        </div>
      </div>
    </div>

    <!-- Inline Outcome Selection (replaces modal) -->
    <div v-if="showOutcomeSelection" class="mt-4 space-y-4 border-t border-gray-200 pt-4">
      <div>
        <h4 class="font-semibold text-slate-800 mb-2 text-sm">What's the outcome?</h4>
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
        <h5 class="font-semibold text-slate-800 text-sm">Send follow-up message</h5>
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
            class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="followup-1">Follow-up 1</option>
            <option value="followup-2">Follow-up 2</option>
            <option value="custom">Custom message</option>
          </select>
          
          <div class="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p class="text-xs font-semibold text-gray-600 mb-1 uppercase">Message preview</p>
            <p class="text-xs text-slate-700">{{ messagePreview }}</p>
          </div>
        </div>
        
        <div>
          <h5 class="font-semibold text-slate-800 text-sm mb-2">Next call attempt</h5>
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
                class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
              >
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Time</label>
              <input 
                type="time" 
                v-model="customTime"
                class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
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
          <h5 class="font-semibold text-slate-800 text-sm mb-3">Assign to salesman</h5>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1.5">Dealership</label>
              <select 
                v-model="assignment.dealership" 
                class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
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
                class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
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
                class="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500"
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
          <h5 class="font-semibold text-slate-800 text-sm mb-3">Customer preferences</h5>
          
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
              <h5 class="text-sm font-semibold text-slate-800">Existing Appointment</h5>
            </div>
            <span class="text-xs font-semibold text-blue-600 uppercase">Scheduled</span>
          </div>
          <div class="grid grid-cols-2 gap-3 text-sm mb-3">
            <div>
              <span class="text-gray-600">Date:</span>
              <span class="ml-2 font-medium text-slate-800">{{ formatDate(lead.scheduledAppointment.start) }}</span>
            </div>
            <div>
              <span class="text-gray-600">Time:</span>
              <span class="ml-2 font-medium text-slate-800">{{ formatTime(lead.scheduledAppointment.start) }}</span>
            </div>
            <div>
              <span class="text-gray-600">Type:</span>
              <span class="ml-2 font-medium text-slate-800 capitalize">{{ lead.scheduledAppointment.type }}</span>
            </div>
            <div>
              <span class="text-gray-600">Assigned to:</span>
              <span class="ml-2 font-medium text-slate-800">{{ lead.scheduledAppointment.assignee }}</span>
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
                <div class="text-sm font-semibold text-slate-800">Qualify without appointment</div>
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
                <div class="text-sm font-semibold text-slate-800">Schedule Appointment</div>
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
                <span class="ml-2 font-medium text-slate-800">{{ formatDate(scheduledAppointmentData.datetime) }}</span>
              </div>
              <div>
                <span class="text-gray-600">Time:</span>
                <span class="ml-2 font-medium text-slate-800">{{ scheduledAppointmentData.time }}</span>
              </div>
              <div>
                <span class="text-gray-600">Type:</span>
                <span class="ml-2 font-medium text-slate-800 capitalize">{{ scheduledAppointmentData.type }}</span>
              </div>
              <div>
                <span class="text-gray-600">Assigned to:</span>
                <span class="ml-2 font-medium text-slate-800">{{ scheduledAppointmentData.assignee }}</span>
              </div>
            </div>
            <div v-if="scheduledAppointmentData.location" class="text-sm">
              <span class="text-gray-600">Location:</span>
              <span class="ml-2 font-medium text-slate-800">{{ scheduledAppointmentData.location }}</span>
            </div>
            <div v-if="scheduledAppointmentData.notes" class="text-sm">
              <span class="text-gray-600">Notes:</span>
              <p class="mt-1 text-slate-700">{{ scheduledAppointmentData.notes }}</p>
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
    <Teleport to="body">
      <div 
        v-if="showNoteModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="showNoteModal = false"
      >
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h5 class="text-sm font-bold text-slate-800">Add Note</h5>
              <button @click="showNoteModal = false" class="text-gray-400 hover:text-gray-600">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <NoteWidget
              :item="null"
              :task-type="'lead'"
              :task-id="lead.id"
              :borderless="false"
              @save="handleNoteSave"
              @cancel="showNoteModal = false"
            />
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Schedule Appointment Modal -->
    <Teleport to="body">
      <div 
        v-if="showScheduleAppointmentModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="showScheduleAppointmentModal = false"
      >
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h5 class="text-sm font-bold text-slate-800">Schedule Appointment</h5>
              <button @click="showScheduleAppointmentModal = false" class="text-gray-400 hover:text-gray-600">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <ScheduleAppointmentWidget
              :show="true"
              @confirm="handleScheduleAppointmentConfirm"
              @cancel="showScheduleAppointmentModal = false"
            />
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { Teleport } from 'vue'
import NoteWidget from '@/components/tasks/widgets/NoteWidget.vue'
import ScheduleAppointmentWidget from '@/components/tasks/widgets/ScheduleAppointmentWidget.vue'
import InlineFormContainer from '@/components/tasks/widgets/InlineFormContainer.vue'
import { useUsersStore } from '@/stores/users'
import { useUserStore } from '@/stores/user'
import { formatDate, formatTime } from '@/utils/formatters'

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

const isCallActive = ref(false)
const callEnded = ref(false)
const callDuration = ref(0)
const callNotes = ref('')
const callInterval = ref(null)
const showOutcomeSelection = ref(false)
const selectedOutcome = ref(null)
const showNoteModal = ref(false)
const showScheduleAppointmentModal = ref(false)
const appointmentScheduled = ref(false)
const scheduledAppointmentData = ref(null)

// No Answer state
const followupChannels = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'sms', label: 'SMS' },
  { value: 'email', label: 'Email' },
  { value: 'dont-send', label: "Don't send" }
]
const followupChannel = ref('whatsapp')
const selectedTemplate = ref('followup-1')
const rescheduleTime = ref('custom')
const customDate = ref('')
const customTime = ref('09:00')

// Not Valid state
const disqualifyCategory = ref('Not Interested')
const disqualifyReason = ref('')

// Interested state
const dealerships = ['Barcelona', 'Madrid', 'Valencia', 'Firenze', 'Milano', 'Roma']
const teams = ['Audi Sales (New)', 'Audi Sales (Used)', 'Sales (New)', 'Sales (Used)']
const assignableUsers = computed(() => usersStore.assignableUsers)
const currentUser = computed(() => userStore.currentUser)

const assignment = ref({
  dealership: props.lead?.requestedCar?.dealership || 'Barcelona',
  team: 'Audi Sales (New)',
  assigneeId: currentUser.value?.id || 1
})

const preferences = ref({
  tradeIn: false,
  financing: false,
  contactAvailability: false
})

const callData = ref({})
const extractedData = ref(null)

const mockTranscription = {
  leadLines: [
    "Yes, this is Josh Adams speaking.",
    "Oh, hi Michael! Yes, I was waiting for your call.",
    "That sounds great. I'm definitely interested in seeing it."
  ],
  salesLines: [
    "Hi Josh, Michael here regarding your Audi A6 inquiry.",
    "Great. I see you're interested in the Allroad. Do you have a vehicle you'd like to trade in?"
  ]
}

const formattedCallDuration = computed(() => {
  const minutes = Math.floor(callDuration.value / 60)
  const seconds = callDuration.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const taskDescription = computed(() => {
  if (props.lead.stage === 'Open Lead') {
    return 'Contact and qualify this lead'
  } else if (props.lead.stage === 'Validated') {
    return 'Follow up with validated lead'
  }
  return 'Complete lead qualification'
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
  return { text: 'Pending', class: 'bg-orange-100 text-orange-700' }
})

const contactAttempts = computed(() => {
  return props.lead.contactAttempts?.length || 0
})

const existingNotes = computed(() => {
  return props.activities.filter(activity => activity.type === 'note')
})

const messageTemplates = {
  'followup-1': `Hi ${props.lead.customer.name.split(' ')[0]}! I tried calling you earlier but couldn't reach you. When would be a good time to discuss the ${props.lead.requestedCar.brand} ${props.lead.requestedCar.model}?`,
  'followup-2': `Hello ${props.lead.customer.name.split(' ')[0]}, this is regarding your inquiry about the ${props.lead.requestedCar.brand} ${props.lead.requestedCar.model}. Please let me know when you're available for a call.`,
  'custom': ''
}

const messagePreview = computed(() => {
  if (selectedTemplate.value === 'custom') {
    return 'Type your custom message...'
  }
  return messageTemplates[selectedTemplate.value]
})

const startCall = () => {
  isCallActive.value = true
  callDuration.value = 0
  callEnded.value = false
  callNotes.value = ''
  
  // Simulate call duration
  callInterval.value = setInterval(() => {
    callDuration.value++
    // Auto-end call after 20 seconds for demo
    if (callDuration.value >= 20) {
      endCall()
    }
  }, 1000)
}

const endCall = () => {
  if (callInterval.value) {
    clearInterval(callInterval.value)
    callInterval.value = null
  }
  isCallActive.value = false
  callEnded.value = true
  
  callData.value = {
    duration: callDuration.value,
    notes: callNotes.value,
    transcription: mockTranscription,
    channel: 'phone'
  }
  
  // Immediately show outcome selection
  showOutcomeSelection.value = true
}

const copyNumber = async () => {
  try {
    await navigator.clipboard.writeText(props.lead.customer.phone)
    // Show toast notification (you can add a toast component later)
    alert('Phone number copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const extractInformation = () => {
  extractedData.value = {
    tradeIn: mockTranscription.leadLines.some(line => 
      line.toLowerCase().includes('trade') || line.toLowerCase().includes('exchange')
    ) || false,
    financing: mockTranscription.leadLines.some(line => 
      line.toLowerCase().includes('financ') || line.toLowerCase().includes('payment') || line.toLowerCase().includes('loan')
    ) || false
  }
  
  if (extractedData.value.tradeIn) {
    preferences.value.tradeIn = true
  }
  if (extractedData.value.financing) {
    preferences.value.financing = true
  }
}

const handleScheduleAppointmentConfirm = async (appointmentData) => {
  // Store appointment data for qualify button
  scheduledAppointmentData.value = appointmentData
  appointmentScheduled.value = true
  showScheduleAppointmentModal.value = false
  
  // Emit event to create the appointment immediately
  emit('appointment-scheduled', appointmentData)
}

const handleQualify = () => {
  const attempt = {
    timestamp: new Date().toISOString(),
    outcome: 'interested',
    channel: callData.value.channel || 'phone',
    notes: callData.value.notes || '',
    transcription: callData.value.transcription || null
  }
  
  emit('call-attempt-logged', attempt)
  emit('validated', { scheduleFollowUp: false })
  emit('qualified', {
    assignment: assignment.value,
    preferences: preferences.value,
    scheduleAppointment: appointmentScheduled.value,
    appointmentData: scheduledAppointmentData.value
  })
  
  cancelOutcome()
}

const handleDisqualifyFromInterested = () => {
  // Log the attempt first
  const attempt = {
    timestamp: new Date().toISOString(),
    outcome: 'interested',
    channel: callData.value.channel || 'phone',
    notes: callData.value.notes || '',
    transcription: callData.value.transcription || null
  }
  emit('call-attempt-logged', attempt)
  
  // Then switch to disqualify outcome
  selectedOutcome.value = 'not-valid'
}

const logManualCall = () => {
  callData.value = {
    channel: 'external',
    notes: '',
    transcription: null
  }
  showOutcomeSelection.value = true
}

const selectOutcome = (outcome) => {
  selectedOutcome.value = outcome
  if (outcome === 'interested') {
    // Pre-populate from extracted data
    if (extractedData.value) {
      preferences.value.tradeIn = extractedData.value.tradeIn || false
      preferences.value.financing = extractedData.value.financing || false
    }
  }
}

const cancelOutcome = () => {
  selectedOutcome.value = null
  showOutcomeSelection.value = false
  appointmentScheduled.value = false
  scheduledAppointmentData.value = null
}

const calculateNextCallDate = () => {
  if (rescheduleTime.value === 'tomorrow-9am') {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(9, 0, 0, 0)
    return tomorrow.toISOString()
  } else if (rescheduleTime.value === 'monday') {
    const monday = new Date()
    const daysUntilMonday = (8 - monday.getDay()) % 7 || 7
    monday.setDate(monday.getDate() + daysUntilMonday)
    monday.setHours(9, 0, 0, 0)
    return monday.toISOString()
  } else if (rescheduleTime.value === 'custom' && customDate.value && customTime.value) {
    const dateTime = new Date(`${customDate.value}T${customTime.value}:00`)
    return dateTime.toISOString()
  }
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(9, 0, 0, 0)
  return tomorrow.toISOString()
}

const handleNoAnswerConfirm = async () => {
  const attempt = {
    timestamp: new Date().toISOString(),
    outcome: 'no-answer',
    channel: callData.value.channel || 'phone',
    notes: callData.value.notes || '',
    transcription: callData.value.transcription || null
  }
  
  emit('call-attempt-logged', attempt)
  
  if (followupChannel.value && followupChannel.value !== 'dont-send') {
    console.log('Sending follow-up:', followupChannel.value, messagePreview.value)
  }
  
  // Create appointment and calendar event
  const nextCallDate = calculateNextCallDate()
  const appointmentDate = nextCallDate.split('T')[0]
  const appointmentTime = new Date(nextCallDate).toTimeString().slice(0, 5)
  
    emit('postponed', {
    date: appointmentDate,
    time: appointmentTime,
    createAppointment: true
    })
    
    if (contactAttempts.value + 1 >= 5) {
      emit('disqualified', {
        category: 'Not Interested',
        reason: 'Unreachable'
      })
    }
    
  cancelOutcome()
}

const handleNotValidConfirm = () => {
  const attempt = {
    timestamp: new Date().toISOString(),
    outcome: 'not-valid',
    channel: callData.value.channel || 'phone',
    notes: callData.value.notes || '',
    transcription: callData.value.transcription || null
  }
  
  emit('call-attempt-logged', attempt)
    emit('disqualified', {
    category: disqualifyCategory.value,
    reason: disqualifyReason.value
  })
  
  cancelOutcome()
}

const handleNoteSave = (noteData) => {
  showNoteModal.value = false
  emit('note-saved', noteData)
}



onUnmounted(() => {
  if (callInterval.value) {
    clearInterval(callInterval.value)
  }
})
</script>
