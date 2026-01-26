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
          <p class="text-sm font-medium text-heading flex-1 pr-10">
            {{ successState.statusText }}
          </p>
        </div>
        <div
          v-if="successState.meeting"
          class="mt-4 bg-white rounded-lg border border-black/5 overflow-hidden shadow-sm"
        >
          <div class="grid grid-cols-2 gap-3 p-4 text-sm">
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
      <div class="px-4 py-2 flex items-center justify-between text-sm text-sub">
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
            <h4 class="font-bold text-heading text-sm">{{ dynamicTitle }}</h4>
            <p class="text-sm text-body mt-0.5">
              {{ dynamicDescription }}
            </p>
          </div>
          <div
            class="flex items-center gap-2 px-2 py-1 rounded-btn text-sm font-semibold"
            :class="statusBadge.class"
          >
            {{ statusBadge.text }}
          </div>
        </div>

        <!-- Combined Follow-up and Contact Attempts Banner -->
        <div v-if="hasScheduledFollowUp || contactAttempts > 0" class="mb-3 bg-surfaceSecondary border border-black/5 rounded-lg p-3">
          <div class="flex items-center justify-between gap-4 flex-wrap">
            <!-- Scheduled Follow-up Call -->
            <div v-if="hasScheduledFollowUp" class="flex items-center gap-2">
              <i class="fa-solid fa-calendar-check text-blue-600 text-sm"></i>
              <div class="flex items-center gap-2">
                <span class="text-sm font-semibold text-heading">Scheduled Follow-up Call:</span>
                <span class="text-sm text-body">
                  {{ formatDate(lead.scheduledAppointment.start) }} at {{ formatTime(lead.scheduledAppointment.start) }}
                </span>
              </div>
            </div>
            
            <!-- Contact Attempts -->
            <div v-if="contactAttempts > 0" class="flex items-center gap-2">
              <i class="fa-solid fa-phone text-body text-sm"></i>
              <span class="text-sm font-semibold text-body">Contact Attempts:</span>
              <span class="text-sm font-semibold text-heading">{{ contactAttempts }} / {{ maxContactAttempts }}</span>
              <div
                v-if="contactAttempts >= maxContactAttempts - 1"
                class="text-sm text-orange-600 font-medium flex items-center gap-1 ml-2"
              >
                <i class="fa-solid fa-exclamation-triangle"></i>
                <span>One more attempt before auto-disqualification</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Phone Number Row -->
        <div class="flex items-center gap-2 mb-3">
          <span class="text-sm text-body font-medium">{{ lead.customer.phone }}</span>
          <button
            @click="copyNumber"
            class="flex items-center justify-center rounded hover:bg-surfaceSecondary text-sub hover:text-body transition-colors w-6 h-6"
            title="Copy phone number"
          >
            <i class="fa-regular fa-copy text-sm"></i>
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
            <p class="text-sm font-medium text-heading leading-normal mb-3">Log what is happening?</p>
            <div class="flex flex-wrap gap-3">
              <Button
                variant="outline"
                @click="selectOutcome('no-answer')"
                class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium"
                :style="selectedOutcome === 'no-answer' ? { borderColor: 'var(--brand-blue)', color: 'var(--brand-blue)' } : {}"
              >
                <PhoneOff :size="18" class="shrink-0" :style="selectedOutcome === 'no-answer' ? { color: 'var(--brand-blue)' } : {}" />
                <span>No answer</span>
              </Button>
              <Button
                variant="outline"
                @click="selectOutcome('not-valid')"
                class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium"
                :style="selectedOutcome === 'not-valid' ? { borderColor: 'var(--brand-blue)', color: 'var(--brand-blue)' } : {}"
              >
                <ThumbsDown :size="18" class="shrink-0" :style="selectedOutcome === 'not-valid' ? { color: 'var(--brand-blue)' } : {}" />
                <span>Not valid</span>
              </Button>
              <Button
                variant="outline"
                @click="selectOutcome('interested')"
                class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium"
                :style="selectedOutcome === 'interested' ? { borderColor: 'var(--brand-blue)', color: 'var(--brand-blue)' } : {}"
              >
                <Check :size="18" class="shrink-0" :style="selectedOutcome === 'interested' ? { color: 'var(--brand-blue)' } : {}" />
                <span>Interested</span>
              </Button>
            </div>
          </div>

          <!-- No Answer Follow-up (Inline) -->
          <div v-if="selectedOutcome === 'no-answer'" class="space-y-4">
            <!-- When did you call field -->
            <div class="bg-white border border-black/5 rounded-lg shadow-sm overflow-hidden p-6">
              <Label class="block text-sm font-semibold mb-2">When did you call?</Label>
              <Input
                type="datetime-local"
                v-model="callLogDateTime"
                class="w-full"
              />
            </div>
            
            <!-- Send follow-up message -->
            <div class="bg-white border border-black/5 rounded-lg shadow-sm overflow-hidden p-6">
              <h5 class="font-semibold text-heading text-sm mb-4">Send follow-up message</h5>
              
              <!-- Channel Selection -->
              <div class="grid grid-cols-4 gap-2 mb-4">
                <Button
                  variant="outline"
                  @click="followupChannel = 'whatsapp'"
                  class="flex items-center justify-center gap-2"
                  :style="followupChannel === 'whatsapp' ? { borderColor: 'var(--brand-blue)', color: 'var(--brand-blue)' } : {}"
                >
                  <i class="fa-brands fa-whatsapp text-xs" :style="followupChannel === 'whatsapp' ? { color: 'var(--brand-blue)' } : {}"></i>
                  <span>WhatsApp</span>
                </Button>
                <Button
                  variant="outline"
                  @click="followupChannel = 'sms'"
                  class="flex items-center justify-center gap-2"
                  :style="followupChannel === 'sms' ? { borderColor: 'var(--brand-blue)', color: 'var(--brand-blue)' } : {}"
                >
                  <i class="fa-solid fa-message text-xs" :style="followupChannel === 'sms' ? { color: 'var(--brand-blue)' } : {}"></i>
                  <span>SMS</span>
                </Button>
                <Button
                  variant="outline"
                  @click="followupChannel = 'email'"
                  class="flex items-center justify-center gap-2"
                  :style="followupChannel === 'email' ? { borderColor: 'var(--brand-blue)', color: 'var(--brand-blue)' } : {}"
                >
                  <i class="fa-solid fa-envelope text-xs" :style="followupChannel === 'email' ? { color: 'var(--brand-blue)' } : {}"></i>
                  <span>Email</span>
                </Button>
                <Button
                  variant="outline"
                  @click="followupChannel = 'dont-send'"
                  class="flex items-center justify-center gap-2"
                  :style="followupChannel === 'dont-send' ? { borderColor: 'var(--brand-blue)', color: 'var(--brand-blue)' } : {}"
                >
                  <i class="fa-solid fa-xmark text-xs" :style="followupChannel === 'dont-send' ? { color: 'var(--brand-blue)' } : {}"></i>
                  <span>Don't send</span>
                </Button>
              </div>
              
              <!-- Template and Message Preview (only show if channel selected and not 'dont-send') -->
              <div v-if="followupChannel && followupChannel !== 'dont-send'" class="space-y-3">
                <!-- Template -->
                <div>
                  <Label class="block text-sm font-medium text-body mb-1.5">Template</Label>
                  <Select v-model="selectedTemplate">
                    <SelectTrigger class="w-full h-10 min-h-10">
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="followup-1">Follow-up 1</SelectItem>
                      <SelectItem value="followup-2">Follow-up 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <!-- Message Preview -->
                <div>
                  <Label class="block text-sm font-medium text-body mb-1.5">Message preview</Label>
                  <textarea
                    :value="messagePreview"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-body bg-white resize-none"
                    readonly
                  ></textarea>
                </div>
              </div>
            </div>
            
            <!-- Next call attempt -->
            <div class="bg-white border border-black/5 rounded-lg shadow-sm overflow-hidden p-6">
              <h5 class="font-semibold text-heading text-sm mb-4">Next call attempt</h5>
              <div class="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  @click="rescheduleTime = 'tomorrow-9am'"
                  class="px-4 py-2 text-sm font-medium"
                  :style="rescheduleTime === 'tomorrow-9am' ? { borderColor: 'var(--brand-blue)', color: 'var(--brand-blue)' } : {}"
                >
                  Tomorrow 9:00 AM
                </Button>
                <Button
                  variant="outline"
                  @click="rescheduleTime = 'monday'"
                  class="px-4 py-2 text-sm font-medium"
                  :style="rescheduleTime === 'monday' ? { borderColor: 'var(--brand-blue)', color: 'var(--brand-blue)' } : {}"
                >
                  Monday
                </Button>
                <Button
                  variant="outline"
                  @click="rescheduleTime = 'custom'"
                  class="px-4 py-2 text-sm font-medium"
                  :style="rescheduleTime === 'custom' ? { borderColor: 'var(--brand-blue)', color: 'var(--brand-blue)' } : {}"
                >
                  Select time
                </Button>
              </div>
              <div v-if="rescheduleTime === 'custom'" class="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <Label class="block text-sm font-semibold mb-1.5">Date</Label>
                  <Input type="date" v-model="customDate" class="w-full" />
                </div>
                <div>
                  <Label class="block text-sm font-medium text-body mb-1.5">Time</Label>
                  <Input type="time" v-model="customTime" class="w-full" />
                </div>
              </div>
            </div>
          </div>

          <!-- Not Valid (Inline) -->
          <div v-if="selectedOutcome === 'not-valid'" class="space-y-4">
            <!-- When did you call field -->
            <div class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
              <Label class="block text-sm font-semibold mb-2">When did you call?</Label>
              <Input
                type="datetime-local"
                v-model="callLogDateTime"
                class="w-full"
              />
            </div>
            <div class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
              <div>
                <Label class="block text-sm font-semibold mb-2">Category</Label>
                <div class="flex gap-4">
                  <Label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      v-model="disqualifyCategory"
                      value="Not Valid"
                      class="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300"
                    >
                    <span class="text-sm text-body">Not Valid</span>
                  </Label>
                  <Label class="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      v-model="disqualifyCategory"
                      value="Not Interested"
                      class="w-4 h-4 text-brand-blue focus:ring-brand-blue border-gray-300"
                    >
                    <span class="text-sm text-body">Not Interested</span>
                  </Label>
                </div>
              </div>
              <div>
                <Label class="block text-sm font-medium text-body mb-2">Failure Reason</Label>
                <Select v-model="disqualifyReason">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select a reason..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Data cleanup">Data cleanup</SelectItem>
                    <SelectItem value="Unreachable">Unreachable</SelectItem>
                    <SelectItem value="Purchase postponed">Purchase postponed</SelectItem>
                    <SelectItem value="Vehicle sold">Vehicle sold</SelectItem>
                    <SelectItem value="Out of budget">Out of budget</SelectItem>
                    <SelectItem value="Financing rejected">Financing rejected</SelectItem>
                    <SelectItem value="Duplicate">Duplicate</SelectItem>
                    <SelectItem value="Bought elsewhere">Bought elsewhere</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

      <!-- Interested (Inline) -->
          <div v-if="selectedOutcome === 'interested'" class="space-y-4">
            <!-- When did you call field -->
            <div class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
              <Label class="block text-sm font-semibold mb-2">When did you call?</Label>
              <Input
                type="datetime-local"
                v-model="callLogDateTime"
                class="w-full"
              />
            </div>
            <!-- Call Notes Card -->
            <div class="bg-white border border-black/5 rounded-lg shadow-sm overflow-hidden p-6">
              <h5 class="font-semibold text-heading text-sm mb-4">Call notes</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Left: Free text box -->
                <div>
                  <Textarea 
                    v-model="inlineNoteText"
                    rows="8" 
                    class="w-full min-h-[200px]"
                    placeholder="Enter your notes..."
                  />
                </div>
                
                <!-- Right: Form elements -->
                <div class="space-y-4">
                  <!-- Interest Level -->
                  <div>
                    <Label class="block text-sm font-medium text-body mb-1.5">Interest level</Label>
                    <Select v-model="interestLevel">
                      <SelectTrigger class="w-full h-10 min-h-10">
                        <SelectValue placeholder="Interest level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <!-- Trade-in -->
                  <div class="space-y-2">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        v-model="hasTradeIn"
                        class="w-4 h-4 focus:ring-brand-blue border-gray-300 rounded"
                        style="accent-color: var(--brand-blue);"
                      />
                      <span class="text-sm font-medium text-body">Trade-in</span>
                    </label>
                    <Input
                      v-model="tradeInModel"
                      :disabled="!hasTradeIn"
                      placeholder="Trade-in"
                      class="w-full h-10 min-h-10"
                    />
                  </div>
                  
                  <!-- Financing -->
                  <div class="space-y-2">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        v-model="hasFinancing"
                        class="w-4 h-4 focus:ring-brand-blue border-gray-300 rounded"
                        style="accent-color: var(--brand-blue);"
                      />
                      <span class="text-sm font-medium text-body">Financing</span>
                    </label>
                    <Select v-model="financingOption" :disabled="!hasFinancing">
                      <SelectTrigger class="w-full h-10 min-h-10">
                        <SelectValue placeholder="Financing option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FIN">Captive Financing</SelectItem>
                        <SelectItem value="LEA">Leasing</SelectItem>
                        <SelectItem value="LTR">Long-Term Rental</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div class="flex gap-2 mt-4">
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

            <!-- Assign to Sales Section -->
            <div class="bg-white border border-black/5 rounded-lg shadow-sm overflow-hidden p-6">
              <h5 class="font-semibold text-heading text-sm mb-4">Assign to salesman</h5>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Dealership -->
                <div>
                  <Label class="block text-sm font-medium text-body mb-1.5">Dealership</Label>
                  <Select v-model="selectedDealership">
                    <SelectTrigger class="w-full h-10 min-h-10">
                      <SelectValue placeholder="Select dealership" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="dealership in availableDealerships"
                        :key="dealership"
                        :value="dealership"
                      >
                        {{ dealership }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <!-- Team -->
                <div>
                  <Label class="block text-sm font-medium text-body mb-1.5">Team</Label>
                  <Select v-model="selectedTeam">
                    <SelectTrigger class="w-full h-10 min-h-10">
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="team in filteredTeams"
                        :key="team.id"
                        :value="team.id"
                      >
                        {{ team.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <!-- Assignee -->
                <div>
                  <Label class="block text-sm font-medium text-body mb-1.5">Assignee</Label>
                  <Select v-model="selectedAssignee">
                    <SelectTrigger class="w-full h-10 min-h-10">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="user in filteredAssignees"
                        :key="user.id"
                        :value="user.id"
                      >
                        {{ user.name }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                <span class="text-sm font-semibold text-green-900">Survey completed</span>
              </div>
            </div>

            <!-- Select team - REMOVED: Now handled by TaskAssignee component shown before LQTask -->
            <!-- Team assignment is now managed via TaskAssignee component in LeadManagementWidget -->
            <!-- The assignee data flows from lead.assignee prop, set by TaskAssignee component -->

            <!-- Qualification method -->
            <div class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
              <h5 class="font-semibold text-heading text-sm mb-3">Qualification method</h5>
              <div class="space-y-2">
                <label
                  class="flex items-center gap-3 border rounded-lg px-3 py-2 cursor-pointer transition-colors"
                  :class="
                    qualificationMethod === 'assign-only'
                      ? 'border-2 border-brand-blue bg-surfaceSecondary/50'
                      : 'border border-black/5 hover:bg-surfaceSecondary/50'
                  "
                >
                  <input v-model="qualificationMethod" type="radio" value="assign-only" class="shrink-0" />
                  <span class="text-sm text-heading">Assign only</span>
                </label>
                <label
                  class="flex items-center gap-3 border rounded-lg px-3 py-2 cursor-pointer transition-colors"
                  :class="
                    qualificationMethod === 'assign-and-schedule'
                      ? 'border-2 border-brand-blue bg-surfaceSecondary/50'
                      : 'border border-black/5 hover:bg-surfaceSecondary/50'
                  "
                >
                  <input v-model="qualificationMethod" type="radio" value="assign-and-schedule" class="shrink-0" />
                  <span class="text-sm text-heading">Assign and schedule</span>
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
                <h5 class="font-semibold text-heading text-sm mb-3">Event Type</h5>
                <Label class="block text-sm font-medium text-body mb-1.5">Select event type</Label>
                <Select v-model="qualificationEventType">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="opt in qualificationEventTypeOptions"
                      :key="opt.value"
                      :value="opt.value"
                    >
                      {{ opt.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <!-- Step 2: Duration and Date Range (only show if event type selected) -->
              <div v-if="qualificationEventType" class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
                <h5 class="font-semibold text-heading text-sm mb-4">Schedule</h5>
                
                <!-- Duration Selection -->
                <div class="mb-4">
                  <Label class="block text-sm font-medium text-body mb-2">Duration</Label>
                  <div class="flex gap-2 items-center flex-wrap">
                    <Button
                      variant="outline"
                      @click="handleQualificationDurationSelect(30)"
                      class="px-3 py-2 text-sm font-medium"
                      :class="
                        qualificationDurationMinutes === 30
                          ? 'border-green-600 bg-surfaceSecondary text-heading'
                          : ''
                      "
                    >
                      30min
                    </Button>
                    <Button
                      variant="outline"
                      @click="handleQualificationDurationSelect(60)"
                      class="px-3 py-2 text-sm font-medium"
                      :class="
                        qualificationDurationMinutes === 60
                          ? 'border-green-600 bg-surfaceSecondary text-heading'
                          : ''
                      "
                    >
                      60min
                    </Button>
                    <Input
                      v-model="qualificationCustomDuration"
                      type="number"
                      min="1"
                      placeholder="Custom"
                      class="w-24"
                      @input="qualificationDurationMinutes = null"
                    />
                  </div>
                </div>

                <!-- Date Range Selection -->
                <div class="mb-4">
                  <Label class="block text-sm font-medium text-body mb-2">Select Date Range</Label>
                  <div class="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      @click="handleDateRangeSelect('tomorrow')"
                      class="px-4 py-2 text-sm font-medium"
                      :class="
                        qualificationDateRange === 'tomorrow'
                          ? 'border-green-600 bg-surfaceSecondary text-heading'
                          : ''
                      "
                    >
                      Tomorrow
                    </Button>
                    <Button
                      variant="outline"
                      @click="handleDateRangeSelect('this-week')"
                      class="px-4 py-2 text-sm font-medium"
                      :class="
                        qualificationDateRange === 'this-week'
                          ? 'border-green-600 bg-surfaceSecondary text-heading'
                          : ''
                      "
                    >
                      This Week
                    </Button>
                    <Button
                      variant="outline"
                      @click="handleDateRangeSelect('custom')"
                      class="px-4 py-2 text-sm font-medium"
                      :class="
                        qualificationDateRange === 'custom'
                          ? 'border-green-600 bg-surfaceSecondary text-heading'
                          : ''
                      "
                    >
                      Custom
                    </Button>
                  </div>
                  
                  <!-- Custom Date Range Inputs -->
                  <div v-if="qualificationDateRange === 'custom'" class="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <Label class="block text-sm font-medium text-body mb-1.5">Start Date</Label>
                      <Input
                        type="date"
                        v-model="qualificationCustomDateStart"
                        class="w-full"
                      />
                    </div>
                    <div>
                      <Label class="block text-sm font-medium text-body mb-1.5">End Date</Label>
                      <Input
                        type="date"
                        v-model="qualificationCustomDateEnd"
                        class="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 3: Recommended Teams and People (show when date range selected, with default selection) -->
              <div v-if="qualificationEventType && qualificationDateRange" class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
                <h5 class="font-semibold text-heading text-sm mb-2">Assign appointment to :</h5>
                
                <!-- Teams -->
                <div class="mb-3">
                  <Label class="block text-sm font-medium text-body mb-2">Select Team</Label>
                  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    <Button
                      v-for="team in sortedTeams"
                      :key="team.id"
                      variant="outline"
                      @click="qualificationSelectedTeam = team"
                      class="flex items-center gap-1.5 px-3 py-2 text-sm font-medium whitespace-nowrap shrink-0"
                      :class="
                        qualificationSelectedTeam && qualificationSelectedTeam.id === team.id
                          ? 'border-green-600 bg-surfaceSecondary text-heading'
                          : ''
                      "
                    >
                      <span class="text-sub">{{ team.dealership || 'No location' }}</span>
                      <span class="text-sub">→</span>
                      <span class="font-medium text-heading">{{ team.name }}</span>
                    </Button>
                  </div>
                </div>

                <!-- People -->
                <div v-if="qualificationSelectedTeam">
                  <Label class="block text-sm font-medium text-body mb-2">Select Salesperson (Optional)</Label>
                  <p class="text-sm text-sub mb-2">You can proceed without selecting a salesperson - the appointment will be assigned to the team.</p>
                  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    <Button
                      v-for="(user, index) in assignableUsers"
                      :key="user.id"
                      variant="outline"
                      @click="qualificationSelectedSalesman = user"
                      class="flex items-center gap-2 px-3 py-2 text-sm font-medium whitespace-nowrap shrink-0"
                      :class="
                        qualificationSelectedSalesman && qualificationSelectedSalesman.id === user.id
                          ? 'border-green-600 bg-surfaceSecondary text-heading'
                          : index === 0 && !qualificationSelectedSalesman
                            ? 'border-green-600/50 bg-surfaceSecondary/30 text-heading'
                            : ''
                      "
                    >
                      <div
                        class="w-6 h-6 rounded-full flex items-center justify-center font-semibold text-sm shrink-0"
                        :class="getRoleAvatarClass(user.role)"
                      >
                        {{ getInitials(user.name) }}
                      </div>
                      <span class="font-medium text-heading truncate">{{ user.name }}</span>
                    </Button>
                  </div>
                </div>
              </div>

              <!-- Step 4: Time Slot Selection (only show after team/person selected) -->
              <div v-if="qualificationSelectedTeam" class="bg-white rounded-lg p-4 shadow-nsc-card" style="box-shadow: var(--nsc-card-shadow)">
                <h5 class="font-semibold text-heading text-sm mb-3">Select Date and Time Slot</h5>
                
                <!-- Available Dates from Range -->
                <div v-if="availableDatesForRange.length > 0" class="mb-4">
                  <Label class="block text-sm font-medium text-body mb-2">Select Date</Label>
                  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    <Button
                      v-for="date in availableDatesForRange"
                      :key="date.getTime()"
                      variant="outline"
                      @click="qualificationSelectedDate = date; qualificationSelectedSlot = ''"
                      class="px-3 py-2 text-sm font-medium whitespace-nowrap shrink-0"
                      :class="
                        qualificationSelectedDate && qualificationIsSameDay(date, qualificationSelectedDate)
                          ? 'border-green-600 bg-surfaceSecondary text-heading'
                          : ''
                      "
                    >
                      {{ formatDate(date) }}
                    </Button>
                  </div>
                </div>

                <!-- Time Slots (only show if date selected) -->
                <div v-if="qualificationSelectedDate">
                  <Label class="block text-sm font-medium text-body mb-2">Select Time Slot</Label>
                  <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    <Button
                      v-for="slot in availableScheduleSlots"
                      :key="slot"
                      variant="outline"
                      @click="qualificationSelectedSlot = slot"
                      class="px-3 py-2 text-sm font-medium whitespace-nowrap shrink-0"
                      :class="
                        qualificationSelectedSlot === slot
                          ? 'border-green-600 bg-surfaceSecondary text-heading'
                          : ''
                      "
                    >
                      {{ slot }}
                    </Button>
                    <p v-if="availableScheduleSlots.length === 0" class="text-sm text-sub text-center py-4">
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
                  <h5 class="font-semibold text-heading text-sm">Existing Appointment</h5>
                </div>
                <span class="text-sm font-semibold text-blue-600 uppercase">Scheduled</span>
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
          </div>
        </div>
        
        <!-- Unified Action Buttons at Bottom Right of Gray Wrapper -->
        <div v-if="selectedOutcome && !successState" class="flex justify-end gap-2 px-4 pb-4 pt-3 border-t border-black/5">
          <Button
            variant="secondary"
            @click="cancelOutcome"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            :disabled="!canConfirmAction"
            @click="handleConfirmAction"
            class="bg-primary"
          >
            {{ actionButtonLabel }}
          </Button>
        </div>
      </div>
    </template>

    <!-- Note Modal -->
    <NoteWidget
      ref="noteWidgetRef"
      modal
      :show="showNoteModal"
      :item="null"
      :task-type="'lead'"
      :task-id="lead.id"
      @save="handleNoteSave"
      @close="showNoteModal = false"
      @cancel="showNoteModal = false"
    />

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
import { 
  Button,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Label,
  Input,
  Textarea
} from '@motork/component-library/future/primitives'
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
const interestLevel = ref('')
const hasTradeIn = ref(false)
const tradeInModel = ref('')
const hasFinancing = ref(false)
const financingOption = ref('')

const tradeInNoteLine = ref('')
const financingNoteLine = ref('')

// Assignment state
const selectedDealership = ref('')
const selectedTeam = ref('')
const selectedAssignee = ref('')

// Available dealerships (unique from teams)
const availableDealerships = computed(() => {
  const dealerships = new Set()
  assignableTeams.value?.forEach(team => {
    if (team.dealership) {
      dealerships.add(team.dealership)
    }
  })
  return Array.from(dealerships).sort()
})

// Filtered teams based on selected dealership
const filteredTeams = computed(() => {
  if (!selectedDealership.value) {
    return assignableTeams.value || []
  }
  return assignableTeams.value?.filter(team => team.dealership === selectedDealership.value) || []
})

// Filtered assignees based on selected team
const filteredAssignees = computed(() => {
  if (!selectedTeam.value) {
    return assignableUsers.value || []
  }
  const team = assignableTeams.value?.find(t => t.id === selectedTeam.value)
  if (!team) return assignableUsers.value || []
  return assignableUsers.value?.filter(user => user.team === team.name || user.teamId === team.id) || []
})

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

// Helper function to update notes with auto-generated lines
const updateNoteWithAutoLines = () => {
  const currentText = inlineNoteText.value || ''
  const lines = currentText.split('\n')
  
  const userLines = lines.filter(line => {
    const trimmed = line.trim()
    return trimmed !== '' && 
           trimmed !== tradeInNoteLine.value && 
           trimmed !== financingNoteLine.value
  })
  
  const autoLines = []
  if (hasTradeIn.value && tradeInModel.value && tradeInModel.value.trim()) {
    tradeInNoteLine.value = `Customer has a ${tradeInModel.value} for a trade-in`
    autoLines.push(tradeInNoteLine.value)
  } else {
    tradeInNoteLine.value = ''
  }
  
  if (hasFinancing.value && financingOption.value) {
    const optionLabels = {
      'FIN': 'Captive Financing',
      'LEA': 'Leasing',
      'LTR': 'Long-Term Rental'
    }
    financingNoteLine.value = `Customer is interested in ${optionLabels[financingOption.value] || financingOption.value}`
    autoLines.push(financingNoteLine.value)
  } else {
    financingNoteLine.value = ''
  }
  
  const allLines = [...userLines, ...autoLines].filter(line => line.trim() !== '')
  inlineNoteText.value = allLines.join('\n')
}

// Watch for trade-in changes to update notes
watch([hasTradeIn, tradeInModel], () => {
  updateNoteWithAutoLines()
  if (!hasTradeIn.value) {
    tradeInModel.value = ''
  }
}, { immediate: false })

// Watch for financing changes to update notes
watch([hasFinancing, financingOption], () => {
  updateNoteWithAutoLines()
  if (!hasFinancing.value) {
    financingOption.value = ''
  }
}, { immediate: false })

// Check if everything is selected for "Send and postpone" button
const canSendAndPostpone = computed(() => {
  if (selectedOutcome.value !== 'no-answer') return false
  if (!followupChannel.value) return false
  if (followupChannel.value !== 'dont-send' && !selectedTemplate.value) return false
  if (!rescheduleTime.value) return false
  if (rescheduleTime.value === 'custom' && (!customDate.value || !customTime.value)) return false
  return true
})

// Reset call notes fields when outcome changes
watch(selectedOutcome, (newOutcome) => {
  if (newOutcome !== 'interested') {
    inlineNoteText.value = ''
    interestLevel.value = ''
    hasTradeIn.value = false
    tradeInModel.value = ''
    hasFinancing.value = false
    financingOption.value = ''
    tradeInNoteLine.value = ''
    financingNoteLine.value = ''
    selectedDealership.value = ''
    selectedTeam.value = ''
    selectedAssignee.value = ''
  }
})

// Auto-fill dealership and team when assignee is selected
watch(selectedAssignee, (assigneeId) => {
  if (assigneeId) {
    const user = assignableUsers.value?.find(u => u.id === assigneeId)
    if (user) {
      const userTeam = assignableTeams.value?.find(team => 
        team.name === user.team || team.id === user.teamId
      )
      if (userTeam) {
        selectedTeam.value = userTeam.id
        if (userTeam.dealership) {
          selectedDealership.value = userTeam.dealership
        }
      }
    }
  }
})

// Reset assignee when team changes (if team doesn't match current assignee)
watch(selectedTeam, (teamId) => {
  if (teamId && selectedAssignee.value) {
    const user = assignableUsers.value?.find(u => u.id === selectedAssignee.value)
    const team = assignableTeams.value?.find(t => t.id === teamId)
    if (user && team && user.team !== team.name && user.teamId !== team.id) {
      selectedAssignee.value = ''
    }
  }
})

// Reset team and assignee when dealership changes (if dealership doesn't match)
watch(selectedDealership, (dealership) => {
  if (dealership && selectedTeam.value) {
    const team = assignableTeams.value?.find(t => t.id === selectedTeam.value)
    if (team && team.dealership !== dealership) {
      selectedTeam.value = ''
      selectedAssignee.value = ''
    }
  }
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

const canCloseAsNotValid = computed(() => {
  return !!(disqualifyCategory.value && disqualifyReason.value)
})

const actionButtonLabel = computed(() => {
  if (selectedOutcome.value === 'no-answer') {
    return followupChannel.value === 'dont-send' ? 'Postpone' : 'Send and postpone'
  }
  if (selectedOutcome.value === 'not-valid') {
    return disqualifyCategory.value ? `Close as ${disqualifyCategory.value}` : 'Close'
  }
  if (selectedOutcome.value === 'interested') {
    return 'Schedule and qualify'
  }
  return ''
})

const canConfirmAction = computed(() => {
  if (selectedOutcome.value === 'no-answer') {
    return canSendAndPostpone.value
  }
  if (selectedOutcome.value === 'not-valid') {
    return canCloseAsNotValid.value
  }
  if (selectedOutcome.value === 'interested') {
    return canQualify.value
  }
  return false
})

const handleConfirmAction = () => {
  if (selectedOutcome.value === 'no-answer') {
    handleNoAnswerConfirm()
  } else if (selectedOutcome.value === 'not-valid') {
    handleNotValidConfirm()
  } else if (selectedOutcome.value === 'interested') {
    handleQualify()
  }
}

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

