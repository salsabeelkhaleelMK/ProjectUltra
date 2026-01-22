<template>
  <div
    class="bg-greys-100 rounded-xl p-1 flex flex-col"
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
        class="bg-white rounded-lg p-4 shadow-nsc-card"
        style="box-shadow: var(--nsc-card-shadow)"
      >
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
      :show-outcome-selection="showOutcomeSelection"
      :show-call-log-form="showCallLogForm"
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

      <!-- Grey outcome area: call log form + outcome selection -->
      <div class="px-4 py-4 space-y-3">
        <!-- Call Log Form (shows datetime and assignee; stays visible when outcome selection appears below) -->
        <div v-if="showCallLogForm" class="space-y-4">
          <div class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
            <h4 class="font-semibold text-heading mb-4 text-fluid-sm">Log Call Details</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-fluid-xs font-medium text-body mb-1.5">Call Date & Time</label>
                <input
                  type="datetime-local"
                  v-model="callLogDateTime"
                  class="input w-full"
                >
              </div>
              <div>
                <label class="block text-fluid-xs font-medium text-body mb-1.5">Assigned To</label>
                <div class="flex items-center gap-3 p-3 bg-surfaceSecondary rounded-lg border border-E5E7EB">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-fluid-xs"
                    :class="getRoleAvatarClass(callLogAssignee?.role)"
                  >
                    {{ getInitials(callLogAssignee?.name) }}
                  </div>
                  <div class="flex-1">
                    <p class="font-medium text-fluid-sm text-heading">{{ callLogAssignee?.name || 'Unknown' }}</p>
                    <p class="text-fluid-xs text-sub capitalize">{{ callLogAssignee?.role || 'User' }}</p>
                  </div>
                  <span class="text-fluid-xs text-green-600 font-medium">Auto-assigned</span>
                </div>
              </div>
            </div>
            <div class="flex justify-end gap-2 mt-4 pt-4 border-t border-E5E7EB">
              <Button
                label="Cancel"
                variant="outline"
                size="small"
                @click="cancelCallLogForm"
              />
              <Button
                label="Continue"
                variant="primary"
                size="small"
                @click="confirmCallLogForm"
                class="!bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
              />
            </div>
          </div>
        </div>

        <!-- Inline Outcome Selection -->
        <div v-if="showOutcomeSelection" class="space-y-4">
          <div>
            <p class="text-fluid-sm font-medium text-heading leading-6 mb-3">What's the outcome?</p>
            <div class="flex flex-wrap gap-3">
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-lg border-2 px-4 py-2.5 text-fluid-sm font-medium transition-all bg-white"
                :class="
                  selectedOutcome === 'no-answer'
                    ? 'border-brand-blue text-heading'
                    : 'border-E5E7EB text-body hover:border-brand-blue/30 hover:bg-surfaceSecondary/50'
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
                    ? 'border-brand-blue text-heading'
                    : 'border-E5E7EB text-body hover:border-brand-blue/30 hover:bg-surfaceSecondary/50'
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
                    ? 'border-brand-blue text-heading'
                    : 'border-E5E7EB text-body hover:border-brand-blue/30 hover:bg-surfaceSecondary/50'
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
                  :class="rescheduleTime === 'tomorrow-9am' ? 'border-primary-700 bg-primary-700 text-white' : 'border-E5E7EB hover:border-primary-300 hover:bg-brand-gray'"
                >
                  Tomorrow 9:00 AM
                </button>
                <button
                  @click="handleAISuggestionClick"
                  class="bg-surfaceSecondary border-2 rounded-lg px-4 py-2 text-fluid-xs font-medium text-heading transition-all"
                  :class="rescheduleTime === 'monday' ? 'border-primary-700 bg-primary-700 text-white' : 'border-E5E7EB hover:border-primary-300 hover:bg-brand-gray'"
                >
                  AI suggestion
                </button>
                <button
                  @click="rescheduleTime = 'custom'"
                  class="bg-surfaceSecondary border-2 rounded-lg px-4 py-2 text-fluid-xs font-medium text-heading transition-all"
                  :class="rescheduleTime === 'custom' ? 'border-primary-700 bg-primary-700 text-white' : 'border-E5E7EB hover:border-primary-300 hover:bg-brand-gray'"
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
                class="!bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
              />
            </div>
          </div>

          <!-- Not Valid (Inline) -->
          <div v-if="selectedOutcome === 'not-valid'" class="space-y-4">
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
                  label="Confirm Disqualification"
                  variant="primary"
                  size="small"
                  :disabled="!disqualifyCategory || !disqualifyReason"
                  @click="handleNotValidConfirm"
                  class="!bg-red-600 !hover:bg-red-700 !text-white !border-red-600"
                />
              </div>
            </div>
          </div>

      <!-- Interested (Inline) -->
          <div v-if="selectedOutcome === 'interested'" class="space-y-4">
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
                  label="+ Add vehicle"
                  variant="primary"
                  size="small"
                  @click="showVehicleModal = true"
                  class="!bg-brand-black !hover:bg-brand-darkDarker !text-white !border-brand-black"
                />
                <Button
                  label="+ Add financing"
                  variant="primary"
                  size="small"
                  @click="showFinancingModal = true"
                  class="!bg-brand-black !hover:bg-brand-darkDarker !text-white !border-brand-black"
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

            <!-- Select team -->
            <div class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
              <div class="flex items-center justify-between mb-4">
                <h5 class="font-semibold text-heading text-fluid-sm">Select team</h5>
                <Button
                  label="Change"
                  variant="outline"
                  size="small"
                  class="text-fluid-xs"
                  @click="showAssignmentModal = true"
                />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  v-for="team in suggestedTeams"
                  :key="team.id"
                  type="button"
                  class="flex items-center gap-2 p-2 rounded-lg border-2 transition-all text-left"
                  :class="
                    assignment.assignee && assignment.assignee.type === 'team' && assignment.assignee.id === team.id
                      ? 'border-brand-blue bg-surfaceSecondary'
                      : 'border-E5E7EB hover:border-brand-blue/30 hover:bg-surfaceSecondary/50'
                  "
                  @click="assignment.assignee = { ...team, type: 'team' }"
                >
                  <div class="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                    <i class="fa-solid fa-users text-fluid-xs"></i>
                  </div>
                  <p class="font-medium text-fluid-sm text-heading">{{ team.name }}</p>
                </button>
              </div>
              <p v-if="suggestedTeams.length === 0" class="text-fluid-xs text-sub">No teams available. Use Change to assign.</p>
            </div>

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
              class="bg-white rounded-lg p-4 shadow-nsc-card"
              style="box-shadow: var(--nsc-card-shadow)"
            >
              <h5 class="font-semibold text-heading text-fluid-sm mb-4">Schedule</h5>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-fluid-xs font-medium text-body mb-1.5">Event type</label>
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
                <div>
                  <label class="block text-fluid-xs font-medium text-body mb-1.5">Duration</label>
                  <div class="flex gap-2 items-center flex-wrap">
                    <button
                      type="button"
                      class="px-3 py-2 rounded-lg border-2 text-fluid-sm font-medium transition-all"
                      :class="
                        qualificationDurationMinutes === 30
                          ? 'border-brand-blue bg-surfaceSecondary text-heading'
                          : 'border-E5E7EB text-body hover:border-brand-blue/30'
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
                          ? 'border-brand-blue bg-surfaceSecondary text-heading'
                          : 'border-E5E7EB text-body hover:border-brand-blue/30'
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
              </div>
              
              <!-- Select Salesman (only when team is selected) -->
              <div v-if="assignment.assignee?.type === 'team'" class="mb-4">
                <label class="block text-fluid-xs font-medium text-body mb-1.5">Select salesman from {{ assignment.assignee?.name }}</label>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  <button
                    v-for="user in assignableUsers"
                    :key="user.id"
                    type="button"
                    class="flex items-center gap-2 p-2 rounded-lg border-2 transition-all text-left"
                    :class="
                      qualificationSelectedSalesman && qualificationSelectedSalesman.id === user.id
                        ? 'border-brand-blue bg-surfaceSecondary'
                        : 'border-E5E7EB hover:border-brand-blue/30 hover:bg-surfaceSecondary/50'
                    "
                    @click="qualificationSelectedSalesman = user"
                  >
                    <div
                      class="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-fluid-xs shrink-0"
                      :class="getRoleAvatarClass(user.role)"
                    >
                      {{ getInitials(user.name) }}
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="font-medium text-fluid-xs text-heading truncate">{{ user.name }}</p>
                      <p class="text-fluid-xs text-sub capitalize truncate">{{ user.role }}</p>
                    </div>
                  </button>
                </div>
              </div>
              
              <div class="border border-E5E7EB rounded-lg overflow-hidden">
                <div class="grid grid-cols-1 lg:grid-cols-2">
                  <div class="p-3">
                    <div class="flex items-center justify-between mb-3">
                      <p class="text-fluid-sm font-medium text-heading">{{ qualificationCalendarMonthLabel }}</p>
                      <div class="flex items-center gap-1">
                        <button
                          type="button"
                          class="p-1.5 rounded-lg hover:bg-surfaceSecondary transition-colors"
                          aria-label="Previous month"
                          @click="qualificationGoPrevMonth"
                        >
                          <ChevronLeft :size="16" class="text-body" />
                        </button>
                        <button
                          type="button"
                          class="p-1.5 rounded-lg hover:bg-surfaceSecondary transition-colors"
                          aria-label="Next month"
                          @click="qualificationGoNextMonth"
                        >
                          <ChevronRight :size="16" class="text-body" />
                        </button>
                      </div>
                    </div>
                    <div class="grid grid-cols-7 gap-1 mb-1">
                      <div
                        v-for="day in ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']"
                        :key="day"
                        class="text-center text-fluid-xs font-medium text-sub py-1"
                      >
                        {{ day }}
                      </div>
                    </div>
                    <div class="grid grid-cols-7 gap-1">
                      <button
                        v-for="(cellDate, idx) in qualificationCalendarDayCells"
                        :key="`${idx}-${cellDate?.getTime?.() ?? 'e'}`"
                        type="button"
                        class="h-10 w-full rounded-lg text-fluid-sm flex items-center justify-center transition-colors"
                        :class="
                          !cellDate
                            ? 'pointer-events-none invisible'
                            : qualificationIsSameDay(cellDate, qualificationSelectedDate)
                              ? 'bg-brand-blue text-white'
                              : 'hover:bg-surfaceSecondary text-heading'
                        "
                        @click="qualificationSelectDate(cellDate)"
                      >
                        {{ cellDate ? cellDate.getDate() : '' }}
                      </button>
                    </div>
                  </div>
                  <div class="p-3 border-t border-E5E7EB lg:border-t-0 lg:border-l lg:border-E5E7EB">
                    <p class="text-fluid-sm font-medium text-heading mb-3">{{ qualificationSelectedDayLabel }}</p>
                    <div class="space-y-2 max-h-64 overflow-auto pr-1">
                      <button
                        v-for="slot in availableScheduleSlots"
                        :key="slot"
                        type="button"
                        class="w-full py-2.5 px-4 rounded-lg border-2 text-fluid-sm font-medium text-center transition-all"
                        :class="
                          qualificationSelectedSlot === slot
                            ? 'border-brand-blue bg-surfaceSecondary text-heading'
                            : 'border-E5E7EB text-body hover:border-brand-blue/30'
                        "
                        @click="qualificationSelectedSlot = slot"
                      >
                        {{ slot }}
                      </button>
                      <p v-if="availableScheduleSlots.length === 0 && qualificationSelectedSalesman" class="text-fluid-xs text-sub text-center py-4">
                        No available slots for {{ qualificationSelectedSalesman.name }} on this date
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
                  label="Disqualify"
                  variant="outline"
                  size="small"
                  @click="handleDisqualifyFromInterested"
                />
                <Button
                  label="Qualify"
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

    <!-- Add Vehicle Modal -->
    <AddVehicleModal
      :show="showVehicleModal"
      mode="vehicle"
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
import { Check, PhoneOff, ThumbsDown, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-vue-next'
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
import { getAvailabilityForAssignee } from '@/services/availabilityService'

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

// Qualification salesman selection state
const qualificationSelectedSalesman = ref(null)

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
  showCallLogForm,
  callLogDateTime,
  callLogAssignee,
  confirmCallLogForm,
  cancelCallLogForm,
  successState,
  successPerformedAt,
  qualificationMethod,
  qualificationEventType,
  qualificationDurationMinutes,
  qualificationCustomDuration,
  qualificationCalendarMonth,
  qualificationSelectedDate,
  qualificationSelectedSlot,
  qualificationCalendarMonthLabel,
  qualificationCalendarDayCells,
  qualificationSelectedDayLabel,
  qualificationScheduleSlotOptions,
  qualificationDurationValue,
  qualificationGoPrevMonth,
  qualificationGoNextMonth,
  qualificationIsSameDay,
  qualificationSelectDate
} = outcomeState

// Filter schedule slots based on selected salesman availability
const availableScheduleSlots = computed(() => {
  if (!qualificationSelectedSalesman.value || !qualificationSelectedDate.value) {
    return qualificationScheduleSlotOptions.value
  }
  
  // Format date as YYYY-MM-DD
  const dateStr = qualificationSelectedDate.value.toISOString().split('T')[0]
  const availableSlots = getAvailabilityForAssignee(`user-${qualificationSelectedSalesman.value.id}`, dateStr)
  
  // Filter qualificationScheduleSlotOptions to only show available slots
  return qualificationScheduleSlotOptions.value.filter(slot => {
    // Extract time from slot (format: "HH:MM")
    const slotTime = slot
    return availableSlots.includes(slotTime)
  })
})

const existingNotes = computed(() => {
  return props.activities.filter(activity => activity.type === 'note')
})

// Three suggested teams (first 3 from assignable teams), first selected by default
const suggestedTeams = computed(() => {
  const teams = assignableTeams.value || []
  return teams.slice(0, 3)
})

// Set first suggested team as assignee when entering "interested" flow with no assignee
watch(selectedOutcome, (outcome) => {
  if (outcome === 'interested' && !assignment.value?.assignee && suggestedTeams.value.length > 0) {
    assignment.value = { ...assignment.value, assignee: { ...suggestedTeams.value[0], type: 'team' } }
  }
})

// Watch for team selection to reset salesman selection
watch(() => assignment.value?.assignee, (newAssignee) => {
  if (newAssignee?.type !== 'team') {
    qualificationSelectedSalesman.value = null
  }
})

// Watch for date changes to reset slot selection
watch(qualificationSelectedDate, () => {
  qualificationSelectedSlot.value = ''
})

// Watch for salesman changes to reset slot selection
watch(qualificationSelectedSalesman, () => {
  qualificationSelectedSlot.value = ''
})

const qualificationEventTypeOptions = [
  { value: 'test-drive', label: 'Test drive' },
  { value: 'video-call', label: 'Video call' },
  { value: 'phone-call', label: 'Phone call' },
  { value: 'in-store-visit', label: 'In-store visit' }
]

const handleQualificationDurationSelect = (minutes) => {
  qualificationDurationMinutes.value = minutes
  qualificationCustomDuration.value = ''
}

const canQualify = computed(() => {
  if (!assignment.value?.assignee) return false
  if (qualificationMethod.value !== 'assign-and-schedule') return true
  
  // If team is selected, require salesman selection
  if (assignment.value.assignee.type === 'team' && !qualificationSelectedSalesman.value) {
    return false
  }
  
  return Boolean(
    qualificationEventType.value &&
    qualificationDurationValue.value &&
    qualificationSelectedDate.value &&
    qualificationSelectedSlot.value
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

