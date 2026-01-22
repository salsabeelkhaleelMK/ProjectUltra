<template>
  <div
    class="rounded-lg flex flex-col"
    style="background-color: var(--base-muted, #f5f5f5)"
  >
    <!-- Success state (post qualify / disqualify / no-answer) -->
    <template v-if="successState">
      <div
        class="bg-white rounded-lg p-4 shadow-nsc-card flex flex-col relative"
        style="box-shadow: var(--nsc-card-shadow)"
      >
        <div class="flex items-center gap-3">
          <div class="size-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
            <Check :size="16" class="text-green-600" />
          </div>
          <p class="text-fluid-sm font-medium text-heading flex-1 pr-10">
            {{ successState.statusText }}
          </p>
        </div>
        <div
          v-if="successState.meeting"
          class="mt-4 bg-white rounded-lg border border-E5E7EB overflow-hidden shadow-sm"
        >
          <div class="grid grid-cols-2 gap-3 p-4 text-fluid-sm">
            <div>
              <span class="text-body">Date:</span>
              <span class="ml-2 font-medium text-heading">{{ successState.meeting.date }}</span>
            </div>
            <div>
              <span class="text-body">Time:</span>
              <span class="ml-2 font-medium text-heading">{{ successState.meeting.time }}</span>
            </div>
            <div>
              <span class="text-body">Type:</span>
              <span class="ml-2 font-medium text-heading capitalize">{{ successState.meeting.title }}</span>
            </div>
            <div>
              <span class="text-body">Assigned to:</span>
              <span class="ml-2 font-medium text-heading">{{ successState.meeting.location }}</span>
            </div>
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <Button
            variant="outline"
            size="small"
            class="flex items-center gap-2"
            @click="handleReopen"
          >
            <RotateCcw :size="14" />
            Re-open
          </Button>
        </div>
      </div>
      <div class="px-4 py-2 flex items-center justify-between text-fluid-sm text-sub">
        <span>Updated by {{ successState.actorName || 'Unknown' }}</span>
        <span class="tabular-nums">{{ successPerformedAtLabel }}</span>
      </div>
    </template>

    <template v-else>
      <!-- Contact block: white card -->
      <div
        class="bg-white rounded-lg shadow-nsc-card overflow-hidden"
        style="box-shadow: var(--nsc-card-shadow)"
      >
        <DeadlineBanner
          :next-action-due="lead.nextActionDue"
          :show-deadline-banner="showDeadlineBanner"
          :task-id="lead.id"
        />
        <div class="p-4">
          <div class="flex justify-between items-start mb-3">
          <div>
            <h4 class="font-bold text-heading text-fluid-sm">{{ dynamicTitle }}</h4>
            <p class="text-fluid-xs text-body mt-0.5">
              {{ dynamicDescription }}
            </p>
          </div>
          <div
            class="flex items-center gap-2 px-2 py-1 rounded-btn text-fluid-xs font-semibold"
            :class="statusBadge.class"
          >
            {{ statusBadge.text }}
          </div>
        </div>

        <!-- Display scheduled follow-up if exists -->
        <div v-if="hasScheduledFollowUp" class="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div class="flex items-center gap-2 mb-1">
            <i class="fa-solid fa-phone text-blue-600 text-fluid-xs"></i>
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
              <i class="fa-solid fa-phone text-body text-fluid-xs"></i>
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
            <i class="fa-regular fa-copy text-fluid-xs"></i>
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
          :contact-attempts="contactAttempts"
          :max-contact-attempts="maxContactAttempts"
          @start-call="startCall"
          @end-call="endCallFromComposable"
          @log-manual-call="logManualCall"
          @extract-information="extractInformationFromComposable"
          @update:call-notes="updateCallNotes"
          @copy-number="copyNumber"
        />
        </div>
      </div>

      <!-- Grey outcome area: outcome selection -->
      <div class="px-4 py-4 space-y-3">
        <!-- Inline Outcome Selection -->
        <div v-if="!successState" class="space-y-4">
          <div>
            <p class="text-fluid-sm font-medium text-heading leading-6 mb-3">Log what is happening?</p>
            <div class="flex flex-wrap gap-3">
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-lg border-2 px-4 py-2.5 text-fluid-sm font-medium transition-all bg-white"
                :class="
                  selectedOutcome === 'no-answer'
                    ? 'border-green-600 text-heading'
                    : 'border-E5E7EB text-body hover:border-green-600/30 hover:bg-surfaceSecondary/50'
                "
                @click="selectOutcome('no-answer')"
              >
                <PhoneOff :size="18" class="shrink-0" />
                <span>No answer</span>
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-lg border-2 px-4 py-2.5 text-fluid-sm font-medium transition-all bg-white"
                :class="
                  selectedOutcome === 'not-valid'
                    ? 'border-green-600 text-heading'
                    : 'border-E5E7EB text-body hover:border-green-600/30 hover:bg-surfaceSecondary/50'
                "
                @click="selectOutcome('not-valid')"
              >
                <ThumbsDown :size="18" class="shrink-0" />
                <span>Not valid</span>
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-lg border-2 px-4 py-2.5 text-fluid-sm font-medium transition-all bg-white"
                :class="
                  selectedOutcome === 'interested'
                    ? 'border-green-600 text-heading'
                    : 'border-E5E7EB text-body hover:border-green-600/30 hover:bg-surfaceSecondary/50'
                "
                @click="selectOutcome('interested')"
              >
                <Check :size="18" class="shrink-0" />
                <span>Interested</span>
              </button>
            </div>
          </div>

          <!-- No Answer Follow-up (Inline) -->
          <div v-if="selectedOutcome === 'no-answer'" class="space-y-4">
            <!-- When did you call field -->
            <div class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
              <label class="block text-fluid-xs font-semibold mb-2">When did you call?</label>
              <input
                type="datetime-local"
                v-model="callLogDateTime"
                class="input w-full"
              />
            </div>
            <div class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
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
            <div class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
              <h5 class="font-semibold text-heading text-fluid-sm mb-2">Next call attempt</h5>
              <div class="grid grid-cols-3 gap-2">
                <button
                  @click="rescheduleTime = 'tomorrow-9am'"
                  class="bg-surfaceSecondary border-2 rounded-lg px-4 py-2 text-fluid-xs font-medium text-heading transition-all"
                  :class="rescheduleTime === 'tomorrow-9am' ? 'border-green-600 bg-surfaceSecondary' : 'border-E5E7EB hover:border-green-600/30 hover:bg-surfaceSecondary/50'"
                >
                  Tomorrow 9:00 AM
                </button>
                <button
                  @click="handleAISuggestionClick"
                  class="bg-surfaceSecondary border-2 rounded-lg px-4 py-2 text-fluid-xs font-medium text-heading transition-all"
                  :class="rescheduleTime === 'monday' ? 'border-green-600 bg-surfaceSecondary' : 'border-E5E7EB hover:border-green-600/30 hover:bg-surfaceSecondary/50'"
                >
                  AI suggestion
                </button>
                <button
                  @click="rescheduleTime = 'custom'"
                  class="bg-surfaceSecondary border-2 rounded-lg px-4 py-2 text-fluid-xs font-medium text-heading transition-all"
                  :class="rescheduleTime === 'custom' ? 'border-green-600 bg-surfaceSecondary' : 'border-E5E7EB hover:border-green-600/30 hover:bg-surfaceSecondary/50'"
                >
                  Select time
                </button>
              </div>
              <div v-if="rescheduleTime === 'custom'" class="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-fluid-xs font-semibold mb-1.5">Date</label>
                  <input type="date" v-model="customDate" class="input">
                </div>
                <div>
                  <label class="block text-fluid-xs font-medium text-body mb-1.5">Time</label>
                  <input type="time" v-model="customTime" class="input">
                </div>
              </div>
              <div v-if="rescheduleTime === 'monday' && aiSuggestionData" class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p class="text-fluid-xs text-body">
                  <span class="font-semibold text-heading">AI Suggestion:</span>
                  {{ aiSuggestionData.formattedDate }} at {{ aiSuggestionData.time }}. {{ aiSuggestionData.reason }}
                </p>
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
                class="!bg-brand-black !hover:bg-brand-darkDarker !text-white !border-brand-black"
              />
            </div>
          </div>

          <!-- Not Valid (Inline) -->
          <div v-if="selectedOutcome === 'not-valid'" class="space-y-4">
            <!-- When did you call field -->
            <div class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
              <label class="block text-fluid-xs font-semibold mb-2">When did you call?</label>
              <input
                type="datetime-local"
                v-model="callLogDateTime"
                class="input w-full"
              />
            </div>
            <div class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
              <div>
                <label class="block text-fluid-xs font-semibold mb-2">Category</label>
                <div class="flex gap-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      v-model="disqualifyCategory"
                      value="Not Valid"
                      class="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300"
                    >
                    <span class="text-fluid-sm text-body">Not Valid</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      v-model="disqualifyCategory"
                      value="Not Interested"
                      class="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300"
                    >
                    <span class="text-fluid-sm text-body">Not Interested</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="block text-fluid-xs font-medium text-body mb-2">Failure Reason</label>
                <select v-model="disqualifyReason" class="input">
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
                  label="Disqualify"
                  variant="primary"
                  size="small"
                  :disabled="!disqualifyCategory || !disqualifyReason"
                  @click="handleNotValidConfirm"
                  class="!bg-brand-black !hover:bg-brand-darkDarker !text-white !border-brand-black"
                />
              </div>
            </div>
          </div>

      <!-- Interested (Inline) -->
          <div v-if="selectedOutcome === 'interested'" class="space-y-4">
            <!-- When did you call field -->
            <div class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
              <label class="block text-fluid-xs font-semibold mb-2">When did you call?</label>
              <input
                type="datetime-local"
                v-model="callLogDateTime"
                class="input w-full"
              />
            </div>
            <!-- Add Note Card -->
            <div class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
              <h5 class="font-semibold text-heading text-fluid-sm mb-3">Add Note</h5>
              <div>
                <label class="block text-fluid-xs font-medium text-body mb-1.5">Note</label>
                <textarea 
                  v-model="inlineNoteText"
                  rows="4" 
                  class="input w-full"
                  placeholder="Enter your note..."
                ></textarea>
              </div>
              <div class="flex gap-2 mt-3">
                <Button
                  label="Save"
                  variant="primary"
                  size="small"
                  @click="handleInlineNoteSave"
                  class="!bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
                />
                <AIButton
                  label="Extract with AI"
                  size="small"
                  @click="handleExtractWithAI"
                />
              </div>
            </div>

            <!-- Customer Data Section -->
            <div class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
              <h5 class="font-semibold text-heading text-fluid-sm mb-3">Customer data</h5>
              <div class="flex gap-2 flex-wrap">
                <Button
                  label="+ Add trade-in"
                  variant="outline"
                  size="small"
                  @click="showVehicleModal = true"
                />
                <Button
                  label="+ Add financing"
                  variant="outline"
                  size="small"
                  @click="showFinancingModal = true"
                />
              </div>
            </div>

            <!-- Survey Section -->
            <div v-if="showSurvey && !surveyCompleted" class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
              <SurveyWidget
                :questions="leadQualificationSurveyQuestions"
                :initial-expanded="false"
                @survey-completed="handleSurveyCompleted"
                @survey-refused="handleSurveyRefused"
                @not-responding="handleNotResponding"
              />
            </div>

            <!-- Survey Completed Indicator -->
            <div v-if="surveyCompleted" class="bg-green-50 border border-green-200 rounded-lg p-3">
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-check-circle text-green-600 text-fluid-sm"></i>
                <span class="text-fluid-xs font-semibold text-green-900">Survey completed</span>
              </div>
            </div>

            <!-- Select team - REMOVED: Now handled by TaskAssignee component shown before LQTask -->
            <!-- Team assignment is now managed via TaskAssignee component in LeadManagementWidget -->
            <!-- The assignee data flows from lead.assignee prop, set by TaskAssignee component -->

            <!-- Qualification method -->
            <div class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
              <h5 class="font-semibold text-heading text-fluid-sm mb-3">Qualification method</h5>
              <div class="space-y-2">
                <label
                  class="flex items-center gap-3 border rounded-lg px-3 py-2 cursor-pointer transition-colors"
                  :class="
                    qualificationMethod === 'assign-only'
                      ? 'border-2 border-brand-blue bg-surfaceSecondary/50'
                      : 'border border-E5E7EB hover:bg-surfaceSecondary/50'
                  "
                >
                  <input v-model="qualificationMethod" type="radio" value="assign-only" class="shrink-0" />
                  <span class="text-fluid-sm text-heading">Assign only</span>
                </label>
                <label
                  class="flex items-center gap-3 border rounded-lg px-3 py-2 cursor-pointer transition-colors"
                  :class="
                    qualificationMethod === 'assign-and-schedule'
                      ? 'border-2 border-brand-blue bg-surfaceSecondary/50'
                      : 'border border-E5E7EB hover:bg-surfaceSecondary/50'
                  "
                >
                  <input v-model="qualificationMethod" type="radio" value="assign-and-schedule" class="shrink-0" />
                  <span class="text-fluid-sm text-heading">Assign and schedule</span>
                </label>
              </div>
            </div>

            <!-- Schedule (only when Assign and schedule) -->
            <div
              v-if="qualificationMethod === 'assign-and-schedule'"
              class="space-y-4"
            >
              <!-- Step 1: Event Type Selection (FIRST STEP) -->
              <div class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
                <h5 class="font-semibold text-heading text-fluid-sm mb-3">Event Type</h5>
                <label class="block text-fluid-xs font-medium text-body mb-1.5">Select event type</label>
                <select
                  v-model="qualificationEventType"
                  class="input w-full"
                >
                  <option value="" disabled>Select event type</option>
                  <option
                    v-for="opt in qualificationEventTypeOptions"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </option>
                </select>
              </div>

              <!-- Step 2: Duration and Date Range (only show if event type selected) -->
              <div v-if="qualificationEventType" class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
                <h5 class="font-semibold text-heading text-fluid-sm mb-4">Schedule</h5>
                
                <!-- Duration Selection -->
                <div class="mb-4">
                  <label class="block text-fluid-xs font-medium text-body mb-2">Duration</label>
                  <div class="flex gap-2 items-center flex-wrap">
                    <button
                      type="button"
                      class="px-3 py-2 rounded-lg border-2 text-fluid-sm font-medium transition-all"
                      :class="
                        qualificationDurationMinutes === 30
                          ? 'border-green-600 bg-surfaceSecondary text-heading'
                          : 'border-E5E7EB text-body hover:border-green-600/30'
                      "
                      @click="handleQualificationDurationSelect(30)"
                    >
                      30min
                    </button>
                    <button
                      type="button"
                      class="px-3 py-2 rounded-lg border-2 text-fluid-sm font-medium transition-all"
                      :class="
                        qualificationDurationMinutes === 60
                          ? 'border-green-600 bg-surfaceSecondary text-heading'
                          : 'border-E5E7EB text-body hover:border-green-600/30'
                      "
                      @click="handleQualificationDurationSelect(60)"
                    >
                      60min
                    </button>
                    <input
                      v-model="qualificationCustomDuration"
                      type="number"
                      min="1"
                      placeholder="Custom"
                      class="input w-24"
                      @input="qualificationDurationMinutes = null"
                    >
                  </div>
                </div>

                <!-- Date Range Selection -->
                <div class="mb-4">
                  <label class="block text-fluid-xs font-medium text-body mb-2">Select Date Range</label>
                  <div class="flex gap-2 flex-wrap">
                    <button
                      type="button"
                      class="px-4 py-2 rounded-lg border-2 text-fluid-sm font-medium transition-all"
                      :class="
                        qualificationDateRange === 'tomorrow'
                          ? 'border-green-600 bg-surfaceSecondary text-heading'
                          : 'border-E5E7EB text-body hover:border-green-600/30'
                      "
                      @click="handleDateRangeSelect('tomorrow')"
                    >
                      Tomorrow
                    </button>
                    <button
                      type="button"
                      class="px-4 py-2 rounded-lg border-2 text-fluid-sm font-medium transition-all"
                      :class="
                        qualificationDateRange === 'this-week'
                          ? 'border-green-600 bg-surfaceSecondary text-heading'
                          : 'border-E5E7EB text-body hover:border-green-600/30'
                      "
                      @click="handleDateRangeSelect('this-week')"
                    >
                      This Week
                    </button>
                    <button
                      type="button"
                      class="px-4 py-2 rounded-lg border-2 text-fluid-sm font-medium transition-all"
                      :class="
                        qualificationDateRange === 'custom'
                          ? 'border-green-600 bg-surfaceSecondary text-heading'
                          : 'border-E5E7EB text-body hover:border-green-600/30'
                      "
                      @click="handleDateRangeSelect('custom')"
                    >
                      Custom
                    </button>
                  </div>
                  
                  <!-- Custom Date Range Inputs -->
                  <div v-if="qualificationDateRange === 'custom'" class="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-fluid-xs font-medium text-body mb-1.5">Start Date</label>
                      <input
                        type="date"
                        v-model="qualificationCustomDateStart"
                        class="input w-full"
                      />
                    </div>
                    <div>
                      <label class="block text-fluid-xs font-medium text-body mb-1.5">End Date</label>
                      <input
                        type="date"
                        v-model="qualificationCustomDateEnd"
                        class="input w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 3: Recommended Teams and People (show when date range selected, with default selection) -->
              <div v-if="qualificationEventType && qualificationDateRange" class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
                <h5 class="font-semibold text-heading text-fluid-sm mb-2">Assign appointment to :</h5>
                
                <!-- Teams -->
                <div class="mb-3">
                  <label class="block text-fluid-xs font-medium text-body mb-2">Select Team</label>
                  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    <button
                      v-for="team in sortedTeams"
                      :key="team.id"
                      type="button"
                      class="flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 text-fluid-sm font-medium transition-all whitespace-nowrap shrink-0"
                      :class="
                        qualificationSelectedTeam && qualificationSelectedTeam.id === team.id
                          ? 'border-green-600 bg-surfaceSecondary text-heading'
                          : 'border-E5E7EB text-body hover:border-green-600/30 hover:bg-surfaceSecondary/50'
                      "
                      @click="qualificationSelectedTeam = team"
                    >
                      <span class="text-sub">{{ team.dealership || 'No location' }}</span>
                      <span class="text-sub">→</span>
                      <span class="font-medium text-heading">{{ team.name }}</span>
                    </button>
                  </div>
                </div>

                <!-- People -->
                <div v-if="qualificationSelectedTeam">
                  <label class="block text-fluid-xs font-medium text-body mb-2">Select Salesperson (Optional)</label>
                  <p class="text-fluid-xs text-sub mb-2">You can proceed without selecting a salesperson - the appointment will be assigned to the team.</p>
                  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    <button
                      v-for="(user, index) in assignableUsers"
                      :key="user.id"
                      type="button"
                      class="flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-fluid-sm font-medium transition-all whitespace-nowrap shrink-0"
                      :class="
                        qualificationSelectedSalesman && qualificationSelectedSalesman.id === user.id
                          ? 'border-green-600 bg-surfaceSecondary text-heading'
                          : index === 0 && !qualificationSelectedSalesman
                            ? 'border-green-600/50 bg-surfaceSecondary/30 text-heading'
                            : 'border-E5E7EB text-body hover:border-green-600/30 hover:bg-surfaceSecondary/50'
                      "
                      @click="qualificationSelectedSalesman = user"
                    >
                      <div
                        class="w-6 h-6 rounded-full flex items-center justify-center font-semibold text-fluid-xs shrink-0"
                        :class="getRoleAvatarClass(user.role)"
                      >
                        {{ getInitials(user.name) }}
                      </div>
                      <span class="font-medium text-heading truncate">{{ user.name }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Step 4: Time Slot Selection (only show after team/person selected) -->
              <div v-if="qualificationSelectedTeam" class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
                <h5 class="font-semibold text-heading text-fluid-sm mb-3">Select Date and Time Slot</h5>
                
                <!-- Available Dates from Range -->
                <div v-if="availableDatesForRange.length > 0" class="mb-4">
                  <label class="block text-fluid-xs font-medium text-body mb-2">Select Date</label>
                  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    <button
                      v-for="date in availableDatesForRange"
                      :key="date.getTime()"
                      type="button"
                      class="px-3 py-2 rounded-lg border-2 text-fluid-sm font-medium transition-all whitespace-nowrap shrink-0"
                      :class="
                        qualificationSelectedDate && qualificationIsSameDay(date, qualificationSelectedDate)
                          ? 'border-green-600 bg-surfaceSecondary text-heading'
                          : 'border-E5E7EB text-body hover:border-green-600/30 hover:bg-surfaceSecondary/50'
                      "
                      @click="qualificationSelectedDate = date; qualificationSelectedSlot = ''"
                    >
                      {{ formatDate(date) }}
                    </button>
                  </div>
                </div>

                <!-- Time Slots (only show if date selected) -->
                <div v-if="qualificationSelectedDate">
                  <label class="block text-fluid-xs font-medium text-body mb-2">Select Time Slot</label>
                  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    <button
                      v-for="slot in availableScheduleSlots"
                      :key="slot"
                      type="button"
                      class="px-3 py-2 rounded-lg border-2 text-fluid-sm font-medium transition-all whitespace-nowrap shrink-0"
                      :class="
                        qualificationSelectedSlot === slot
                          ? 'border-green-600 bg-surfaceSecondary text-heading'
                          : 'border-E5E7EB text-body hover:border-green-600/30 hover:bg-surfaceSecondary/50'
                      "
                      @click="qualificationSelectedSlot = slot"
                    >
                      {{ slot }}
                    </button>
                    <p v-if="availableScheduleSlots.length === 0" class="text-fluid-xs text-sub text-center py-4">
                      No available slots for this date
                    </p>
                  </div>
                </div>
              </div>

              <!-- Step 5: Automated Communications (ALWAYS SHOW when assign-and-schedule) -->
              <AppointmentCommunications
                :appointment="{
                  type: qualificationEventType,
                  date: qualificationSelectedDate,
                  time: qualificationSelectedSlot,
                  duration: qualificationDurationValue
                }"
                :customer="lead.customer"
                :salesperson="qualificationSelectedSalesman"
                :team="qualificationSelectedTeam"
                :dealership="qualificationSelectedTeam?.dealership ? { name: qualificationSelectedTeam.dealership } : null"
                @update="handleCommunicationsUpdate"
              />
            </div>

            <!-- Existing Appointment (if lead already has one) -->
            <div v-if="hasExistingAppointment && qualificationMethod === 'assign-only'" class="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-2">
                  <i class="fa-solid fa-calendar-check text-blue-600"></i>
                  <h5 class="font-semibold text-heading text-fluid-sm">Existing Appointment</h5>
                </div>
                <span class="text-fluid-xs font-semibold text-blue-600 uppercase">Scheduled</span>
              </div>
              <div class="grid grid-cols-2 gap-3 text-fluid-sm mb-3">
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
                  v-if="qualificationMethod !== 'assign-and-schedule'"
                  label="Disqualify"
                  variant="outline"
                  size="small"
                  @click="handleDisqualifyFromInterested"
                />
                <Button
                  :label="qualificationMethod === 'assign-and-schedule' ? 'Confirm Appointment and Qualify' : 'Qualify'"
                  variant="primary"
                  size="small"
                  :disabled="!canQualify"
                  @click="handleQualify"
                  class="!bg-green-600 !hover:bg-green-700 !text-white !border-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

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


    <!-- Purchase Method Modal -->
    <PurchaseMethodModal
      :show="showFinancingModal"
      :task-type="'lead'"
      :task-id="lead.id"
      @save="handlePurchaseMethodSave"
      @close="showFinancingModal = false"
    />

    <!-- Add Trade-In Modal -->
    <AddVehicleModal
      :show="showVehicleModal"
      mode="tradein"
      :task-type="'lead'"
      :task-id="lead.id"
      :customer-id="lead.customerId"
      @close="showVehicleModal = false"
      @save="handleVehicleSave"
    />

  </div>
</template>

<script setup>
import { ref, computed, toRef, watch } from 'vue'
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
import { Check, PhoneOff, ThumbsDown, RotateCcw } from 'lucide-vue-next'
import NoteWidget from '@/components/customer/activities/NoteWidget.vue'
import ScheduleAppointmentModal from '@/components/modals/ScheduleAppointmentModal.vue'
import ReassignUserModal from '@/components/modals/ReassignUserModal.vue'
import PurchaseMethodModal from '@/components/modals/PurchaseMethodModal.vue'
import AddVehicleModal from '@/components/modals/AddVehicleModal.vue'
import { useTradeInVehicle } from '@/composables/useTradeInVehicle'
import SurveyWidget from '@/components/customer/SurveyWidget.vue'
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
import AIButton from '@/components/shared/AIButton.vue'
import DeadlineBanner from '@/components/tasks/shared/DeadlineBanner.vue'
import AppointmentCommunications from '@/components/shared/communication/AppointmentCommunications.vue'
import { getAvailabilityForAssignee } from '@/services/availabilityService'

const props = defineProps({
  lead: {
    type: Object,
    required: true
  },
  activities: {
    type: Array,
    default: () => []
  },
  showDeadlineBanner: {
    type: Boolean,
    default: true
  }
})

const handleNoteModalOpenChange = (isOpen) => {
  if (!isOpen) {
    showNoteModal.value = false
  }
}

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
const showFinancingModal = ref(false)
const showVehicleModal = ref(false)

// Static data that stays in component
const assignableUsers = computed(() => usersStore.assignableUsers)
const assignableTeams = computed(() => usersStore.assignableTeams)
const currentUser = computed(() => userStore.currentUser)

// Inline note state
const inlineNoteText = ref('')

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
  // Reset salesman selection if team changed
  if (assignee.type === 'team') {
    qualificationSelectedSalesman.value = null
  }
  showAssignmentModal.value = false
}


// Check if task is already assigned and show outcome
const isTaskAssigned = computed(() => {
  return !!callLogAssignee.value
})

const currentTaskOutcome = computed(() => {
  if (successState.value) {
    return successState.value.statusText
  }
  // Check if there's a recent activity with outcome
  const recentActivity = props.activities
    .filter(a => a.type === 'call' || a.type === 'outcome')
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
  if (recentActivity) {
    return recentActivity.outcome || recentActivity.content || 'Outcome logged'
  }
  return null
})

// Handle inline note save
const handleInlineNoteSave = async () => {
  if (!inlineNoteText.value.trim()) return
  
  try {
    await leadsStore.addActivity(props.lead.id, {
      type: 'note',
      user: currentUser.value?.name || 'You',
      action: 'added a note',
      content: inlineNoteText.value,
      timestamp: new Date().toISOString()
    })
    
    emit('note-saved', {
      type: 'note',
      content: inlineNoteText.value,
      timestamp: new Date().toISOString()
    })
    
    // Clear note text
    inlineNoteText.value = ''
  } catch (error) {
    console.error('Error saving note:', error)
  }
}

// Handle extract with AI
const handleExtractWithAI = async () => {
  if (!inlineNoteText.value.trim()) {
    // TODO: Show error or placeholder
    return
  }
  
  // TODO: Implement AI extraction logic
  // For now, this is a placeholder
  console.log('Extracting information with AI from:', inlineNoteText.value)
}

// Wrapper functions for coordination
const startCall = () => {
  startCallFromComposable()
  // Auto-assign and auto-fill time when initiating call (don't show outcome selection yet)
  initCallLogForm(false)
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
  showSurvey,
  aiSuggestionData,
  handleAISuggestionClick,
  callLogDateTime,
  callLogAssignee,
  confirmCallLogForm,
  cancelCallLogForm,
  initCallLogForm,
  successState,
  successPerformedAt,
  qualificationMethod,
  qualificationEventType,
  qualificationDurationMinutes,
  qualificationCustomDuration,
  qualificationCalendarMonth,
  qualificationSelectedDate,
  qualificationSelectedSlot,
  qualificationDateRange,
  qualificationCustomDateStart,
  qualificationCustomDateEnd,
  availableDatesForRange,
  qualificationScheduleSlotOptions,
  qualificationDurationValue,
  qualificationSelectedTeam,
  qualificationSelectedSalesman,
  suggestedTeam,
  communicationPreferences
} = outcomeState

// Handle communications update
const handleCommunicationsUpdate = (communications) => {
  communicationPreferences.value = communications
}

// Helper function to check if two dates are the same day
const qualificationIsSameDay = (a, b) => {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

// Handle date range selection
const handleDateRangeSelect = (range) => {
  qualificationDateRange.value = range
  qualificationSelectedDate.value = null
  qualificationSelectedSlot.value = ''
  
  // Auto-select first available date for "tomorrow" or "this-week"
  if (range === 'tomorrow' && availableDatesForRange.value.length > 0) {
    qualificationSelectedDate.value = availableDatesForRange.value[0]
  } else if (range === 'this-week' && availableDatesForRange.value.length > 0) {
    qualificationSelectedDate.value = availableDatesForRange.value[0]
  }
}

// Filter schedule slots based on selected team or salesperson availability
const availableScheduleSlots = computed(() => {
  if (!qualificationSelectedDate.value) {
    return []
  }
  
  // Format date as YYYY-MM-DD
  const dateStr = qualificationSelectedDate.value.toISOString().split('T')[0]
  
  // If salesperson is selected, use their availability
  if (qualificationSelectedSalesman.value) {
    const availableSlots = getAvailabilityForAssignee(`user-${qualificationSelectedSalesman.value.id}`, dateStr)
    return qualificationScheduleSlotOptions.value.filter(slot => availableSlots.includes(slot))
  }
  
  // If team is selected, use team availability
  if (qualificationSelectedTeam.value) {
    const availableSlots = getAvailabilityForAssignee(`team-${qualificationSelectedTeam.value.id}`, dateStr)
    return qualificationScheduleSlotOptions.value.filter(slot => availableSlots.includes(slot))
  }
  
  // If neither selected, show all slots
  return qualificationScheduleSlotOptions.value
})

const existingNotes = computed(() => {
  return props.activities.filter(activity => activity.type === 'note')
})

// Three suggested teams (first 3 from assignable teams) - kept for potential future use
const suggestedTeams = computed(() => {
  const teams = assignableTeams.value || []
  return teams.slice(0, 3)
})

// Sort teams so selected team appears first
const sortedTeams = computed(() => {
  if (!assignableTeams.value) return []
  const teams = [...assignableTeams.value]
  if (qualificationSelectedTeam.value) {
    const selectedIndex = teams.findIndex(t => t.id === qualificationSelectedTeam.value.id)
    if (selectedIndex > 0) {
      const selected = teams.splice(selectedIndex, 1)[0]
      teams.unshift(selected)
    }
  }
  return teams
})

// Auto-select suggested team when date range is selected
watch([qualificationDateRange, suggestedTeam, assignableTeams], ([range, suggested, teams]) => {
  if (range && suggested && teams && !qualificationSelectedTeam.value) {
    // Find the team in assignableTeams by ID
    const team = teams.find(t => t.id === suggested.id)
    if (team) {
      qualificationSelectedTeam.value = team
    }
  }
}, { immediate: true })

// Auto-select first available date when date range is selected
watch([qualificationDateRange, availableDatesForRange], ([range, dates]) => {
  if (range && dates && dates.length > 0 && !qualificationSelectedDate.value) {
    qualificationSelectedDate.value = dates[0]
  }
})

// Use lead.assignee (set by TaskAssignee component) when entering "interested" flow (for assign-only)
watch(selectedOutcome, (outcome) => {
  if (outcome === 'interested' && qualificationMethod.value === 'assign-only' && !assignment.value?.assignee) {
    // Try to use the assignee from the lead object (set by TaskAssignee component)
    if (props.lead.assignee) {
      const assigneeUser = assignableUsers.value?.find(u => u.name === props.lead.assignee)
      const assigneeTeam = assignableTeams.value?.find(t => t.name === props.lead.assignee)
      
      if (assigneeUser) {
        assignment.value = { ...assignment.value, assignee: { ...assigneeUser, type: 'user' } }
      } else if (assigneeTeam) {
        assignment.value = { ...assignment.value, assignee: { ...assigneeTeam, type: 'team' } }
      }
    } else if (suggestedTeams.value.length > 0) {
      // Fallback: use first suggested team if no assignee
      assignment.value = { ...assignment.value, assignee: { ...suggestedTeams.value[0], type: 'team' } }
    }
  }
})

// Watch for team selection to reset salesman selection
watch(() => assignment.value?.assignee, (newAssignee) => {
  if (newAssignee?.type !== 'team') {
    qualificationSelectedSalesman.value = null
  }
})

// Watch for qualificationSelectedTeam changes to reset salesman selection
watch(qualificationSelectedTeam, () => {
  qualificationSelectedSalesman.value = null
})

// Watch for date changes to reset slot selection
watch(qualificationSelectedDate, () => {
  qualificationSelectedSlot.value = ''
})

// Watch for salesman changes to reset slot selection
watch(qualificationSelectedSalesman, () => {
  qualificationSelectedSlot.value = ''
})

// Watch for call ending to initialize datetime and assignee
watch(callEnded, (ended) => {
  if (ended && !successState.value) {
    // Initialize datetime and assignee when call ends
    initCallLogForm(false)
  }
})

const qualificationEventTypeOptions = [
  { value: 'test-drive', label: 'Test Drive' },
  { value: 'in-store-visit', label: 'In-Store Visit' }
]

const handleQualificationDurationSelect = (minutes) => {
  qualificationDurationMinutes.value = minutes
  qualificationCustomDuration.value = ''
}

const canQualify = computed(() => {
  // For "assign-only" method, require assignee
  if (qualificationMethod.value === 'assign-only') {
    return !!assignment.value?.assignee
  }
  
  // For "assign-and-schedule" method, require:
  // - Event type
  // - Duration
  // - Date range selected
  // - Date selected
  // - Time slot
  // - Team (salesperson is optional)
  return Boolean(
    qualificationEventType.value &&
    qualificationDurationValue.value &&
    qualificationDateRange.value &&
    qualificationSelectedDate.value &&
    qualificationSelectedSlot.value &&
    qualificationSelectedTeam.value
  )
})

const handlers = useLQWidgetHandlers(
  emit,
  callState,
  outcomeState,
  toRef(props, 'lead'),
  contactAttempts,
  maxContactAttempts,
  leadsStore,
  currentUser
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
  handleNotResponding,
  handleReopen
} = handlers

const successPerformedAtLabel = computed(() => {
  if (!successPerformedAt.value) return ''
  const d = successPerformedAt.value
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = String(d.getFullYear())
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} ${hours}:${minutes}`
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

// Trade-in handler
const { saveTradeInVehicle } = useTradeInVehicle()

const handlePurchaseMethodSave = async (purchaseMethodData) => {
  try {
    showFinancingModal.value = false
    preferences.value.financing = true
    
    // Create activity for the purchase method (for activity feed display)
    const typeLabel = purchaseMethodData.type === 'FIN' ? 'Captive Financing' 
      : purchaseMethodData.type === 'LEA' ? 'Leasing' 
      : 'Long-Term Rental'
    const monthly = purchaseMethodData.fields?.monthlyInstalment || 0
    
    await leadsStore.addActivity(props.lead.id, {
      type: 'purchase-method',
      user: currentUser.value?.name || 'You',
      action: `added a ${typeLabel} purchase method`,
      content: `${typeLabel}: €${monthly.toLocaleString()}/month for ${purchaseMethodData.fields?.duration || 0} months`,
      data: {
        purchaseMethodId: purchaseMethodData.id,
        type: purchaseMethodData.type,
        ...purchaseMethodData.fields
      },
      timestamp: new Date().toISOString()
    })
    
    emit('note-saved', { type: 'purchase-method', ...purchaseMethodData })
  } catch (error) {
    console.error('Error saving purchase method:', error)
  }
}

// Handle vehicle save (handles drove, requested, and trade-in)
const handleVehicleSave = async (data) => {
  try {
    showVehicleModal.value = false
    
    // If it's a trade-in, use the trade-in handler
    if (data.vehicleType === 'tradein' || props.mode === 'tradein') {
      const result = await saveTradeInVehicle('lead', props.lead.id, data.vehicle, data.valuation || {})
      preferences.value.tradeIn = true
      emit('note-saved', { 
        type: 'tradein',
        id: result.activity.id,
        action: 'added a trade-in',
        vehicleId: result.vehicle.id,
        data: result.activity.data,
        timestamp: result.activity.timestamp
      })
    } else {
      // For drove or requested vehicles, add to customer
      const { addVehicleToCustomer } = await import('@/api/contacts')
      await addVehicleToCustomer(props.lead.customerId, data.vehicle)
      emit('note-saved', { type: 'vehicle', vehicleType: data.vehicleType, ...data.vehicle })
    }
  } catch (err) {
    console.error('Error saving vehicle:', err)
  }
}

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

