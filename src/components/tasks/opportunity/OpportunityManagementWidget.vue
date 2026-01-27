<template>
  <TaskManagementWidget :task="opportunity" hide-title hide-border>
    <template #deadline-banner>
      <DeadlineBanner
        v-if="!opportunityState.isClosed.value"
        :next-action-due="opportunity.nextActionDue"
        :show-deadline-banner="opportunityState.showDeadlineBanner.value"
        :task-id="opportunity.id"
      />
    </template>
    
    <template #primary-action>
      <!-- NEW: TaskAssignee Component (shows first, extremely compact) -->
      <TaskAssignee
        v-if="!opportunityState.isClosed.value"
        :task="opportunity"
        task-type="opportunity"
        @reassigned="handleOwnerReassigned"
        class="mb-3"
      />
      
      <!-- Primary action -->
      <!-- Show appointment management card if appointment is scheduled -->
      <div
        v-if="!opportunityState.isClosed.value && scheduledAppointment && scheduledAppointment.start"
        class="rounded-lg flex flex-col"
        style="background-color: var(--base-muted, #f5f5f5)"
      >
        <div class="pt-1 px-1">
          <div
            class="bg-white rounded-lg shadow-nsc-card overflow-hidden"
            style="box-shadow: var(--nsc-card-shadow)"
          >
          <div class="p-4">
            <div class="mb-3">
              <h4 class="font-bold text-heading text-sm">Manage Appointment</h4>
              <p class="text-sm text-body mt-0.5">
                Appointment scheduled for {{ scheduledAppointment?.start ? formatDateTime(scheduledAppointment.start) : 'TBD' }}
              </p>
            </div>
            <div class="flex flex-wrap gap-3 items-center">
              <Button
                v-if="scheduledAppointment?.status === 'pending_confirmation'"
                variant="outline"
                @click="handleConfirmAppointment"
                class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-green-500 bg-green-50 text-green-700 cursor-pointer"
              >
                <i class="fa-solid fa-calendar-check"></i>
                <span>Confirm appointment</span>
              </Button>
              <Button
                variant="outline"
                @click="handleRescheduleAppointment"
                class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer"
                :class="showRescheduleSection ? 'border-blue-500 bg-blue-50 text-blue-700' : ''"
              >
                <i class="fa-solid fa-calendar-days"></i>
                <span>Reschedule</span>
              </Button>
              <Button
                variant="outline"
                @click="handleMarkNoShow"
                class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer"
                :class="showNsTaskSection ? 'border-orange-500 bg-orange-50 text-orange-700' : ''"
              >
                <i class="fa-solid fa-user-slash"></i>
                <span>Mark as No-Show</span>
              </Button>
              <Button
                variant="outline"
                @click="handleMarkShowedUp"
                class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer"
                :class="showOfferAssignmentSection ? 'border-green-500 bg-green-50 text-green-700' : ''"
              >
                <i class="fa-solid fa-user-check"></i>
                <span>Mark as Showed Up</span>
              </Button>
              
              <!-- Secondary Actions Dropdown - Inline with management buttons -->
              <SecondaryActionsDropdown
                v-if="opportunityState.secondaryActions.value && opportunityState.secondaryActions.value.length > 0"
                :actions="opportunityState.secondaryActions.value"
                @action-selected="handleSecondaryAction"
              />
            </div>
          </div>
          </div>
        </div>
        
        <!-- Unified schedule/reschedule form (same component, mode + initialAppointment) -->
        <transition name="expand">
          <div v-if="showRescheduleSection" class="mt-4">
            <OpportunityScheduleForm
              ref="scheduleFormRef"
              :opportunity="opportunity"
              mode="reschedule"
              :initial-appointment="scheduledAppointment"
              @submit="(p) => handleScheduleFormSubmit(p, 'reschedule')"
              @cancel="cancelRescheduleForm"
            />
          </div>
        </transition>
        
        <!-- Inline NS Task Section -->
        <transition name="expand">
          <div v-if="showNsTaskSection" class="mt-4">
            <NS1Task
              v-if="nsTaskCount === 1"
              ref="ns1TaskRef"
              :opportunity="opportunity"
              :scheduled-appointment="scheduledAppointment"
              @assigned="handleNsAssigned"
              @cancel="handleCancelNsTask"
            />
            <NS2Task
              v-else-if="nsTaskCount === 2"
              ref="ns2TaskRef"
              :opportunity="opportunity"
              :scheduled-appointment="scheduledAppointment"
              @assigned="handleNsAssigned"
              @cancel="handleCancelNsTask"
            />
            <NS3Task
              v-else-if="nsTaskCount >= 3"
              ref="ns3TaskRef"
              :opportunity="opportunity"
              :scheduled-appointment="scheduledAppointment"
              @close-as-lost="handleNsCloseAsLost"
              @cancel="handleCancelNsTask"
            />
          </div>
        </transition>
        
        <!-- Unified NS Task Buttons -->
        <div v-if="showNsTaskSection" class="flex justify-end gap-2 px-4 pb-4 pt-3">
          <Button
            variant="secondary"
            @click="handleCancelNsTask"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            :disabled="!canSubmitNsTask"
            @click="handleConfirmNsTask"
            class="bg-primary"
          >
            {{ nsTaskButtonLabel }}
          </Button>
        </div>
        
        <!-- Inline Offer Assignment Task Section -->
        <transition name="expand">
          <div v-if="showOfferAssignmentSection" class="mt-4">
            <OfferAssignmentTask
              ref="offerAssignmentTaskRef"
              :opportunity="opportunity"
              :scheduled-appointment="scheduledAppointment"
              @offer-created="handleOfferAssignmentCreated"
              @cancel="handleCancelOfferAssignment"
            />
          </div>
        </transition>
        
        <!-- Unified Offer Assignment Buttons -->
        <div v-if="showOfferAssignmentSection" class="flex justify-end gap-2 px-4 pb-4 pt-3">
          <Button
            variant="secondary"
            @click="handleCancelOfferAssignment"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            :disabled="!canCreateOffer"
            @click="handleConfirmOfferAssignment"
            class="bg-primary"
          >
            Create Offer
          </Button>
        </div>
      </div>
      
      <!-- In Negotiation Management Section (exclude Contract Pending / Offer Accepted) -->
      <div
        v-if="!opportunityState.isClosed.value && opportunity.stage === 'In Negotiation' && opportunity.negotiationSubstatus !== 'Offer Accepted' && opportunity.offers && opportunity.offers.length > 0"
        class="rounded-lg flex flex-col"
        style="background-color: var(--base-muted, #f5f5f5)"
      >
        <div class="pt-1 px-1">
          <div
            class="bg-white rounded-lg shadow-nsc-card overflow-hidden"
            style="box-shadow: var(--nsc-card-shadow)"
          >
          <div class="p-4">
            <div class="mb-3">
              <h4 class="font-bold text-heading text-sm">Manage Offers & Follow Up</h4>
              <p class="text-sm text-body mt-0.5">
                {{ opportunity.negotiationSubstatus === 'Offer Feedback' ? 'Request feedback on pending offers' : 'Follow up with customer about offers' }}
              </p>
            </div>
            <!-- Offers Carousel (before action buttons) -->
            <div class="mb-4">
              <OfferCarousel
                :offers="opportunity.offers"
                :opportunity-id="opportunity.id"
                @offer-accepted="handleOfferAccepted"
              />
            </div>
            <div class="flex flex-wrap gap-3 items-center">
              <Button
                variant="outline"
                @click="handleFollowUpOffer"
                class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer"
                :class="showNegotiationSection ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : ''"
              >
                <i class="fa-solid fa-phone-volume"></i>
                <span>{{ opportunity.negotiationSubstatus === 'Offer Feedback' ? 'Request Feedback' : 'Follow Up' }}</span>
              </Button>
              <Button
                variant="outline"
                @click="handleAddAnotherOffer"
                class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer"
                :class="showAddOfferSection ? 'border-blue-500 bg-blue-50 text-blue-700' : ''"
              >
                <i class="fa-solid fa-plus"></i>
                <span>Add Offer</span>
              </Button>
              
              <!-- Secondary Actions Dropdown -->
              <SecondaryActionsDropdown
                v-if="opportunityState.secondaryActions.value && opportunityState.secondaryActions.value.length > 0"
                :actions="opportunityState.secondaryActions.value"
                @action-selected="handleSecondaryAction"
              />
            </div>
          </div>
          </div>
        </div>
        
        <!-- Inline Follow Up Section -->
        <transition name="expand">
          <div v-if="showNegotiationSection" class="mt-4 space-y-4">
            <!-- Communication Options -->
            <div class="bg-white border border-black/5 rounded-lg shadow-sm overflow-hidden p-6">
              <h5 class="font-semibold text-heading text-sm mb-4">Contact Customer</h5>
              
              <!-- Channel Selection -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                <Button
                  variant="outline"
                  @click="negotiationChannel = 'call'"
                  class="flex items-center justify-center gap-2"
                  :class="negotiationChannel === 'call' ? 'border-brand-blue bg-blue-50 text-brand-blue' : ''"
                >
                  <i class="fa-solid fa-phone text-xs"></i>
                  <span>Call</span>
                </Button>
                <Button
                  variant="outline"
                  @click="negotiationChannel = 'whatsapp'"
                  class="flex items-center justify-center gap-2"
                  :class="negotiationChannel === 'whatsapp' ? 'border-brand-blue bg-blue-50 text-brand-blue' : ''"
                >
                  <i class="fa-brands fa-whatsapp text-xs"></i>
                  <span>WhatsApp</span>
                </Button>
                <Button
                  variant="outline"
                  @click="negotiationChannel = 'sms'"
                  class="flex items-center justify-center gap-2"
                  :class="negotiationChannel === 'sms' ? 'border-brand-blue bg-blue-50 text-brand-blue' : ''"
                >
                  <i class="fa-solid fa-message text-xs"></i>
                  <span>SMS</span>
                </Button>
                <Button
                  variant="outline"
                  @click="negotiationChannel = 'email'"
                  class="flex items-center justify-center gap-2"
                  :class="negotiationChannel === 'email' ? 'border-brand-blue bg-blue-50 text-brand-blue' : ''"
                >
                  <i class="fa-solid fa-envelope text-xs"></i>
                  <span>Email</span>
                </Button>
              </div>
              
              <!-- Message Composer -->
              <div v-if="negotiationChannel" class="space-y-3">
                <div>
                  <Label class="block text-sm font-medium text-body mb-2">Select offer to reference</Label>
                  <SelectMenu
                    v-model="negotiationSelectedOfferId"
                    :items="offerSelectOptions"
                    placeholder="Select an offer..."
                    value-key="id"
                    class="w-full"
                  >
                    <template #item="{ item }">
                      <div class="flex items-center justify-between gap-2">
                        <span>{{ item.label }}</span>
                        <span class="text-sub text-xs">€ {{ formatCurrency(item.price) }}</span>
                      </div>
                    </template>
                  </SelectMenu>
                </div>
                
                <div>
                  <Label class="block text-sm font-medium text-body mb-2">Message</Label>
                  <Textarea
                    v-model="negotiationMessage"
                    rows="4"
                    placeholder="Type your message here..."
                    class="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </transition>
        
        <!-- Unified Negotiation Buttons -->
        <div v-if="showNegotiationSection" class="flex justify-end gap-2 px-4 pb-4 pt-3">
          <Button
            variant="secondary"
            @click="handleCancelNegotiation"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            :disabled="!canSendNegotiationMessage"
            @click="handleSendNegotiationMessage"
            class="bg-primary"
          >
            Send Message
          </Button>
        </div>
        
        <!-- Inline Add Offer Section -->
        <transition name="expand">
          <div v-if="showAddOfferSection" class="mt-4">
            <div class="bg-white border border-black/5 rounded-lg shadow-sm overflow-hidden p-6">
              <OfferWidget
                ref="addOfferWidgetRef"
                :task-id="opportunity.id"
                :task-type="'opportunity'"
                :customer="opportunity.customer"
                :selected-vehicle="opportunity.selectedVehicle || opportunity.vehicle || opportunity.requestedCar"
                hide-header
                hide-actions
                @save="handleInlineOfferCreated"
                @cancel="handleCancelAddOffer"
              />
            </div>
          </div>
        </transition>
        
        <!-- Unified Add Offer Buttons -->
        <div v-if="showAddOfferSection" class="flex justify-end gap-2 px-4 pb-4 pt-3">
          <Button
            variant="secondary"
            @click="handleCancelAddOffer"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            :disabled="!canCreateInlineOffer"
            @click="handleConfirmAddOffer"
            class="bg-primary"
          >
            Create Offer
          </Button>
        </div>
      </div>
      
      <!-- Contract Pending Management Section -->
      <div
        v-if="!opportunityState.isClosed.value && opportunity.stage === 'In Negotiation' && (opportunity.negotiationSubstatus === 'Offer Accepted' || opportunityState.displayStage.value === 'In Negotiation - Contract Pending')"
        class="rounded-lg flex flex-col"
        style="background-color: var(--base-muted, #f5f5f5)"
      >
        <div class="pt-1 px-1">
          <div
            class="bg-white rounded-lg shadow-nsc-card overflow-hidden"
            style="box-shadow: var(--nsc-card-shadow)"
          >
          <div class="p-4">
            <div class="mb-3">
              <h4 class="font-bold text-heading text-sm">Collect e-signatures, finalize contract</h4>
              <p class="text-sm text-body mt-0.5">
                Get the formal contract signed electronically by the customer. Finalize all contractual terms and conditions. Ensure all required signatures are collected. Set the official Contract Date when customer signs.
              </p>
            </div>
            <div class="flex flex-wrap gap-3 items-center">
              <!-- Primary Action Button -->
              <Button
                variant="outline"
                @click="handleFinalizeContract"
                class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer"
                :class="showFinalizeContractSection ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : ''"
              >
                <i class="fa-solid fa-file-signature"></i>
                <span>Collect Signatures</span>
              </Button>
              
              <!-- More Actions Dropdown -->
              <SecondaryActionsDropdown
                :actions="contractPendingActions"
                @action-selected="handleContractPendingAction"
              />
            </div>
          </div>
          </div>
        </div>
        
        <!-- Inline Finalize Contract Section -->
        <transition name="expand">
          <div v-if="showFinalizeContractSection" class="mt-4 px-4 pb-4">
            <div class="bg-white border border-black/5 rounded-lg shadow-sm overflow-hidden p-6">
              <h5 class="font-semibold text-heading text-sm mb-4">Set Contract Signing Date</h5>
              
              <div class="space-y-4">
                <!-- Contract Date -->
                <div>
                  <Label class="block text-sm font-medium text-body mb-2">Contract Date <span class="text-red-600">*</span></Label>
                  <Input 
                    type="date"
                    v-model="contractPendingForm.contractDate"
                    :max="maxContractDate"
                    class="w-full"
                  />
                </div>
                
                <!-- Contract Time -->
                <div>
                  <Label class="block text-sm font-medium text-body mb-2">Time (Optional)</Label>
                  <Input 
                    type="time"
                    v-model="contractPendingForm.contractTime"
                    class="w-full"
                  />
                </div>
                
                <!-- Notes -->
                <div>
                  <Label class="block text-sm font-medium text-body mb-2">Notes (Optional)</Label>
                  <Textarea 
                    v-model="contractPendingForm.notes"
                    rows="4"
                    placeholder="Add any relevant notes about the contract signing..."
                    class="w-full"
                  />
                </div>
              </div>
            </div>
            
            <!-- Finalize Contract Buttons -->
            <div class="flex justify-end gap-2 mt-4">
              <Button
                variant="secondary"
                @click="handleCancelFinalizeContract"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                :disabled="!canSubmitFinalizeContract"
                @click="handleConfirmFinalizeContract"
                class="bg-primary"
              >
                Set Contract Date
              </Button>
            </div>
          </div>
        </transition>
        
        <!-- Inline Add Offer Section -->
        <transition name="expand">
          <div v-if="showAddOfferContractPendingSection" class="mt-4">
            <div class="bg-white border border-black/5 rounded-lg shadow-sm overflow-hidden p-6">
              <OfferWidget
                ref="addOfferContractPendingRef"
                :task-id="opportunity.id"
                :task-type="'opportunity'"
                :customer="opportunity.customer"
                :selected-vehicle="opportunity.selectedVehicle || opportunity.vehicle || opportunity.requestedCar"
                hide-header
                hide-actions
                @save="handleInlineOfferCreatedContractPending"
                @cancel="handleCancelAddOfferContractPending"
              />
            </div>
          </div>
        </transition>
        
        <!-- Unified Add Offer Buttons -->
        <div v-if="showAddOfferContractPendingSection" class="flex justify-end gap-2 px-4 pb-4 pt-3">
          <Button
            variant="secondary"
            @click="handleCancelAddOfferContractPending"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            :disabled="!canCreateInlineOfferContractPending"
            @click="handleConfirmAddOfferContractPending"
            class="bg-primary"
          >
            Create Offer
          </Button>
        </div>
        
        <!-- Inline Extend Deadline Section -->
        <transition name="expand">
          <div v-if="showExtendDeadlineSection" class="mt-4 px-4 pb-4">
            <div class="bg-white border border-black/5 rounded-lg shadow-sm overflow-hidden p-6">
              <h5 class="font-semibold text-heading text-sm mb-4">Extend Deadline</h5>
              
              <div class="space-y-4">
                <div>
                  <Label class="block text-sm font-medium text-body mb-2">New Deadline Date <span class="text-red-600">*</span></Label>
                  <Input 
                    type="date"
                    v-model="extendDeadlineForm.newDeadline"
                    :min="minDeadlineDate"
                    class="w-full"
                  />
                </div>
                
                <div>
                  <Label class="block text-sm font-medium text-body mb-2">Reason (Optional)</Label>
                  <Textarea 
                    v-model="extendDeadlineForm.reason"
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
                @click="handleCancelExtendDeadline"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                :disabled="!canSubmitExtendDeadline"
                @click="handleConfirmExtendDeadline"
                class="bg-primary"
              >
                Extend Deadline
              </Button>
            </div>
          </div>
        </transition>
        
        <!-- Inline Schedule Appointment Section -->
        <transition name="expand">
          <div v-if="showScheduleAppointmentContractPendingSection" class="mt-4 px-4 pb-4">
            <OpportunityScheduleForm
              ref="scheduleAppointmentContractPendingFormRef"
              :opportunity="opportunity"
              mode="schedule"
              @submit="(p) => handleScheduleAppointmentContractPendingSubmit(p)"
              @cancel="handleCancelScheduleAppointmentContractPending"
            />
          </div>
        </transition>
      </div>
      
      <!-- Regular primary action widget -->
      <PrimaryActionWidget
        v-else-if="!opportunityState.isClosed.value && opportunityState.primaryAction.value"
        :action="opportunityState.primaryAction.value"
        :color-scheme="opportunityState.primaryAction.value.colorScheme"
        @action-clicked="opportunityState.primaryAction.value.handler"
      />
    </template>

    <template #task-widgets>
      <!-- Qualified and Awaiting Appointment Schedule Form -->
      <div v-if="shouldShowScheduleForm" class="space-y-4">
        <!-- Assignment Note Card -->
        <div v-if="opportunity.assignmentNote" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <i class="fa-solid fa-sticky-note text-blue-600 text-sm mt-0.5"></i>
            <div class="flex-1">
              <h5 class="font-semibold text-heading text-sm mb-1">Note from Assigner</h5>
              <p class="text-sm text-body whitespace-pre-wrap">{{ opportunity.assignmentNote }}</p>
            </div>
          </div>
        </div>

        <!-- Call and Schedule Appointment Container (matching LQTask.vue design) -->
        <div
          class="rounded-lg flex flex-col"
          style="background-color: var(--base-muted, #f5f5f5)"
        >
          <div class="pt-1 px-1">
            <!-- Call Interface (always visible) -->
            <div
              class="bg-white rounded-lg shadow-nsc-card overflow-hidden"
              style="box-shadow: var(--nsc-card-shadow)"
            >
            <div class="p-4">
              <div class="mb-3">
                <h4 class="font-bold text-heading text-sm">Call to Schedule Appointment</h4>
                <p class="text-sm text-body mt-0.5">
                  Contact the customer to schedule an appointment
                </p>
              </div>
              <CallInterface
                :is-call-active="isCallActive"
                :call-ended="callEnded"
                :call-duration="callDuration"
                :call-notes="callNotes"
                :formatted-call-duration="formattedCallDuration"
                :mock-transcription="mockTranscription"
                :contact-attempts="0"
                :max-contact-attempts="3"
                @start-call="startCall"
                @end-call="endCall"
                @log-manual-call="logManualCall"
                @extract-information="showComingSoonModal = true"
                @update:call-notes="updateCallNotes"
                @copy-number="copyNumber"
              />
            </div>
          </div>
          </div>

          <!-- Unified schedule form (same as reschedule); always visible, buttons in form -->
          <div class="px-4 py-4">
            <OpportunityScheduleForm
              ref="scheduleFormRef"
              :opportunity="opportunity"
              mode="schedule"
              @submit="(p) => handleScheduleFormSubmit(p, 'schedule')"
              @cancel="cancelScheduleForm"
            />
          </div>

        </div>
      </div>

      <!-- Post-Delivery Survey Section -->
      <div
        v-if="shouldShowPostDeliverySurvey"
        class="rounded-lg flex flex-col"
        style="background-color: var(--base-muted, #f5f5f5)"
      >
        <div class="pt-1 px-1">
          <div
            class="bg-white rounded-lg shadow-nsc-card overflow-hidden"
            style="box-shadow: var(--nsc-card-shadow)"
          >
          <div class="p-4">
            <div class="mb-3">
              <h4 class="font-bold text-heading text-sm">Post-Delivery Customer Satisfaction Survey</h4>
              <p class="text-sm text-body mt-0.5">
                Collect feedback from the customer about their delivery experience
              </p>
            </div>
            <div class="flex flex-wrap gap-3 items-center">
              <Button
                variant="outline"
                @click="showPostDeliverySurveySection = !showPostDeliverySurveySection"
                class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer"
                :class="showPostDeliverySurveySection ? 'border-blue-500 bg-blue-50 text-blue-700' : ''"
              >
                <i class="fa-solid fa-clipboard-list"></i>
                <span>Complete Survey</span>
              </Button>
              
              <!-- Reopen Opportunity Button (only for Closed Won) -->
              <Button
                v-if="isClosedWon"
                variant="outline"
                @click="handleReopen"
                class="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-green-500 bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer"
              >
                <i class="fa-solid fa-rotate-left"></i>
                <span>Reopen Opportunity</span>
              </Button>
              
              <!-- Actions Dropdown -->
              <div class="relative">
                <button 
                  @click.stop="showPostDeliverySurveyDropdown = !showPostDeliverySurveyDropdown"
                  class="w-auto bg-surface hover:bg-surfaceSecondary border border-E5E7EB text-body font-medium px-4 py-2 rounded-lg text-fluid-xs flex items-center justify-between gap-2 transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>More actions</span>
                  <i 
                    class="fa-solid fa-chevron-down text-xs transition-transform duration-200 flex-shrink-0"
                    :class="{ 'rotate-180': showPostDeliverySurveyDropdown }"
                  ></i>
                </button>

                <!-- Dropdown menu -->
                <div 
                  v-if="showPostDeliverySurveyDropdown && postDeliverySurveyMenuItems.length > 0"
                  class="absolute top-full right-0 mt-2 z-50 dropdown-menu-small"
                  v-click-outside="() => showPostDeliverySurveyDropdown = false"
                >
                  <DropdownMenu 
                    :items="postDeliverySurveyMenuItems" 
                    className="w-56" 
                  />
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
        
        <!-- Survey Form (Collapsible) -->
        <transition name="expand">
          <div v-if="showPostDeliverySurveySection" class="mt-4 px-4 pb-4">
            <PostDeliverySurvey
              ref="postDeliverySurveyRef"
              :opportunity="opportunity"
              @submit="handleSurveySubmit"
              @cancel="showPostDeliverySurveySection = false"
            />
            
            <!-- Survey Action Buttons -->
            <div class="flex justify-end gap-2 mt-4">
              <Button
                variant="secondary"
                @click="handleCancelSurvey"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                :disabled="!canSubmitSurvey"
                @click="handleConfirmSurvey"
                class="bg-primary"
              >
                Submit Survey
              </Button>
            </div>
          </div>
        </transition>
      </div>

      <!-- Regular Task Widgets -->
      <div v-else-if="opportunityState.activeTaskWidget.value && opportunityState.activeTaskWidget.value.component" class="space-y-3">
        <!-- Task Title Header -->
        <div class="flex items-center gap-2 pb-2 border-b border">
          <i class="fa-solid fa-clipboard-check text-blue-600 text-sm"></i>
          <h5 class="font-semibold text-heading text-fluid-sm">{{ opportunityState.taskWidgetTitle.value }}</h5>
        </div>
        
        <component
          :is="opportunityState.activeTaskWidget.value.component"
          v-bind="opportunityState.activeTaskWidget.value.props"
          @close="handleTaskWidgetClose"
          @set-callback="handleSetCallback"
          @auto-close-lost="handleAutoCloseLost"
        />
      </div>
    </template>


    <template #secondary-actions>
      <!-- Secondary actions now shown inline with management buttons -->
    </template>
  </TaskManagementWidget>

  <!-- Appointment Modals -->
  <CreateEventModal
    v-if="showCreateAppointment"
    :show="showCreateAppointment"
    :customer="opportunity.customer"
    :assignee="opportunity.assignee"
    :disabled-fields="['customer']"
    @create="handleAppointmentCreated"
    @cancel="showCreateAppointment = false"
  />

    <!-- Modals -->
    <VehicleSelectionModal
      v-if="showVehicleSelectionModal"
      :opportunity="opportunity"
      :requested-car="opportunity.requestedCar"
      :recommended-cars="recommendedCars"
      @vehicle-selected="handleVehicleSelected"
      @close="showVehicleSelectionModal = false"
    />

    <OfferWidget
      v-if="showOfferModal"
      :opportunity="opportunity"
      :vehicle="opportunity.selectedVehicle || opportunity.vehicle || opportunity.requestedCar"
      @offer-created="handleOfferCreated"
      @close="showOfferModal = false"
    />

    <ContractDateModal
      v-if="showContractDateModal"
      :opportunity="opportunity"
      @contract-set="handleContractSet"
      @close="showContractDateModal = false"
    />

    <DeliveryModal
      v-if="showDeliveryModal"
      :opportunity="opportunity"
      @delivered="handleDelivered"
      @close="showDeliveryModal = false"
    />

    <CloseAsLostModal
      v-if="showCloseAsLostModal"
      :opportunity="opportunity"
      :preselected-reason="nsCloseReason"
      @confirm="handleClosedLost"
      @cancel="showCloseAsLostModal = false; nsCloseReason = ''"
    />
    
    <!-- Contract Pending Modals -->
    <CloseAsLostModal
      v-if="showCloseAsLostContractPending"
      :opportunity="opportunity"
      @confirm="handleCloseAsLostContractPending"
      @cancel="showCloseAsLostContractPending = false"
    />
    

    <RequalifyAsLeadModal
      v-if="showRequalifyModal"
      :opportunity="opportunity"
      @requalified="handleRequalified"
      @close="showRequalifyModal = false"
    />

    <ComingSoonModal
      v-if="showComingSoonModal"
      @close="showComingSoonModal = false"
    />

    <QuickViewEventModal
      v-if="showViewAppointment && scheduledAppointment"
      :show="showViewAppointment"
      :event="scheduledAppointment"
      @close="showViewAppointment = false"
      @edit="showViewAppointment = false; showEditAppointment = true"
      @delete="handleDeleteAppointment"
    />

    <EditEventModal
      v-if="showEditAppointment && scheduledAppointment"
      :show="showEditAppointment"
      :event="scheduledAppointment"
      :customer="opportunity.customer"
      :disabled-fields="['customer']"
      @save="handleSaveAppointment"
      @cancel="showEditAppointment = false"
    />
</template>

<script setup>
import { ref, computed, onMounted, toRef, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Button, Label, Textarea, Input, DropdownMenu } from '@motork/component-library/future/primitives'
import { SelectMenu } from '@motork/component-library/future/components'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useUsersStore } from '@/stores/users'
import { useUserStore } from '@/stores/user'
import { fetchVehicles } from '@/api/vehicles'
import { getDisplayStage, OPPORTUNITY_STAGES } from '@/utils/stageMapper'
import { useOpportunityActions } from '@/composables/useOpportunityActions'
import { useLQWidgetCall } from '@/composables/useLQWidgetCall'
import { createCalendarEvent } from '@/api/calendar'

// Components
import TaskManagementWidget from '@/components/tasks/shared/TaskManagementWidget.vue'
import PrimaryActionWidget from '@/components/tasks/shared/PrimaryActionWidget.vue'
import SecondaryActionsDropdown from '@/components/shared/SecondaryActionsDropdown.vue'
import TaskAssignee from '@/components/tasks/TaskAssignee.vue'
import DeadlineBanner from '@/components/tasks/shared/DeadlineBanner.vue'
import OfferWidget from '@/components/customer/activities/OfferWidget.vue'
import CreateEventModal from '@/components/modals/CreateEventModal.vue'
import VehicleSelectionModal from '@/components/modals/VehicleSelectionModal.vue'
import ContractDateModal from '@/components/modals/ContractDateModal.vue'
import DeliveryModal from '@/components/modals/DeliveryModal.vue'
import CloseAsLostModal from '@/components/modals/CloseAsLostModal.vue'
import RequalifyAsLeadModal from '@/components/modals/RequalifyAsLeadModal.vue'
import ComingSoonModal from '@/components/modals/ComingSoonModal.vue'
import QuickViewEventModal from '@/components/modals/QuickViewEventModal.vue'
import EditEventModal from '@/components/modals/EditEventModal.vue'
import CallInterface from '@/components/tasks/lead/CallInterface.vue'
import OpportunityScheduleForm from '@/components/tasks/opportunity/OpportunityScheduleForm.vue'
import NS1Task from '@/components/tasks/opportunity/NS1Task.vue'
import NS2Task from '@/components/tasks/opportunity/NS2Task.vue'
import NS3Task from '@/components/tasks/opportunity/NS3Task.vue'
import OfferAssignmentTask from '@/components/tasks/opportunity/OfferAssignmentTask.vue'
import OfferCarousel from '@/components/shared/OfferCarousel.vue'
import PostDeliverySurvey from '@/components/tasks/opportunity/PostDeliverySurvey.vue'

const props = defineProps({
  opportunity: {
    type: Object,
    required: true
  },
  scheduledAppointment: {
    type: Object,
    default: null
  },
  activities: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['vehicle-selected', 'offer-created', 'appointment-scheduled', 'appointment-cancelled', 'appointment-no-show'])

const router = useRouter()
const opportunitiesStore = useOpportunitiesStore()
const usersStore = useUsersStore()
const userStore = useUserStore()
const { t } = useI18n()

// Helper to get current opportunity (try store first, fallback to props)
const getCurrentOpportunity = () => {
  const storeOpportunity = opportunitiesStore.currentOpportunity
  return (storeOpportunity && storeOpportunity.id === props.opportunity?.id) ? storeOpportunity : props.opportunity
}

// Use scheduledAppointment from prop if provided, otherwise from opportunity object
const scheduledAppointment = computed(() => {
  return props.scheduledAppointment || props.opportunity?.scheduledAppointment || null
})

// Detect "Qualified" or "Awaiting Appointment" status without scheduled appointment
const shouldShowScheduleForm = computed(() => {
  // Don't show schedule form if appointment already exists
  if (scheduledAppointment.value && scheduledAppointment.value.start) {
    return false
  }
  
  const displayStage = opportunityState.displayStage.value
  const isQualified = displayStage === OPPORTUNITY_STAGES.QUALIFIED
  const isAwaitingAppointment = displayStage === OPPORTUNITY_STAGES.AWAITING_APPOINTMENT
  return (isQualified || isAwaitingAppointment) && !opportunityState.isClosed.value
})

// Check if appointment is in the past
const isAppointmentPast = computed(() => {
  if (!scheduledAppointment.value || !scheduledAppointment.value.start) return false
  const appointmentDate = new Date(scheduledAppointment.value.start)
  const now = new Date()
  return appointmentDate < now && scheduledAppointment.value.status !== 'completed'
})

// Check if opportunity is Closed Won
const isClosedWon = computed(() => {
  const opp = props.opportunity
  const displayStage = opportunityState.displayStage.value
  return opp.stage === 'Closed Won' || displayStage === 'Closed Won'
})

// Show Post-Delivery Survey for Closed Won opportunities or those with delivery dates
// Note: We show it for Closed Won (not Closed Lost), so we check stage specifically
const shouldShowPostDeliverySurvey = computed(() => {
  const opp = props.opportunity
  const displayStage = opportunityState.displayStage.value
  const isClosedLost = opp.stage === 'Closed Lost' || displayStage === 'Closed Lost'
  
  // Don't show for Closed Lost
  if (isClosedLost) return false
  
  // Only show for Closed Won opportunities
  // Don't show for Qualified, Awaiting Appointment, In Negotiation, etc.
  return isClosedWon.value
})

// Call state management
const callState = useLQWidgetCall()
const { 
  isCallActive, 
  callEnded, 
  callDuration, 
  callNotes, 
  mockTranscription, 
  formattedCallDuration, 
  startCall: startCallFromComposable, 
  endCall: endCallFromComposable, 
  copyNumber: copyNumberFromComposable
} = callState

// Wrapper functions for call
const startCall = () => {
  startCallFromComposable()
}

const endCall = () => {
  endCallFromComposable()
}

const copyNumber = () => {
  copyNumberFromComposable(props.opportunity.customer?.phone || '')
}

const updateCallNotes = (value) => {
  callNotes.value = value
}

const logManualCall = () => {
  callState.callData.value = {
    channel: 'external',
    notes: '',
    transcription: null
  }
}

const scheduleFormRef = ref(null)

const cancelRescheduleForm = () => {
  showRescheduleSection.value = false
}

const cancelScheduleForm = () => {
  scheduleFormRef.value?.resetForm()
}

async function handleScheduleFormSubmit(payload, mode) {
  const {
    eventType,
    selectedDate,
    selectedSlot,
    selectedTeam,
    selectedSalesman,
    durationValue,
    communicationPreferences
  } = payload
  const opp = props.opportunity
  const d = selectedDate
  const [hours, minutes] = selectedSlot.split(':').map(Number)
  const startDateTime = new Date(d)
  startDateTime.setHours(hours, minutes, 0, 0)
  const duration = durationValue || 30
  const endDateTime = new Date(startDateTime.getTime() + duration * 60000)
  const assigneeName = selectedSalesman?.name || selectedTeam?.name || opp.assignee || 'Unassigned'
  const assigneeId = selectedSalesman?.id || selectedTeam?.id || null
  const assigneeType = selectedSalesman ? 'user' : 'team'

  try {
    if (mode === 'reschedule') {
      const appointmentData = {
        title: `Appointment - ${opp.customer?.name || 'Customer'}`,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        type: eventType,
        assignee: assigneeName,
        customerId: opp.customerId,
        opportunityId: opp.id,
        duration,
        status: 'pending_confirmation'
      }
      let appointmentToSave = { ...appointmentData }
      if (scheduledAppointment.value?.id) {
        const { updateCalendarEvent } = await import('@/api/calendar')
        await updateCalendarEvent(scheduledAppointment.value.id, { ...appointmentData, status: 'pending_confirmation' })
        appointmentToSave.id = scheduledAppointment.value.id
      } else {
        const created = await createCalendarEvent({ ...appointmentData, status: 'pending_confirmation' })
        appointmentToSave = { ...appointmentData, id: created.id, status: 'pending_confirmation' }
      }
      await opportunitiesStore.updateOpportunity(opp.id, { scheduledAppointment: appointmentToSave })
      emit('appointment-scheduled', appointmentToSave)
      showRescheduleSection.value = false
      return
    }

    const calendarEventData = {
      customerId: opp.customerId || opp.customer?.id,
      customer: opp.customer?.name || 'Unknown',
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      type: eventType,
      title: `${eventType} - ${opp.customer?.name || 'Customer'}`,
      assigneeId,
      assigneeType,
      teamId: selectedTeam?.id || null,
      team: selectedTeam?.name || null,
      salesperson: selectedSalesman?.name || null,
      salespersonId: selectedSalesman?.id || null,
      duration,
      opportunityId: opp.id
    }
    const calendarEvent = await createCalendarEvent(calendarEventData)
    const appointmentData = {
      id: calendarEvent.id,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      type: eventType,
      assignee: assigneeName,
      assigneeId,
      assigneeType,
      duration,
      team: selectedTeam?.name || null,
      teamId: selectedTeam?.id || null,
      salesperson: selectedSalesman?.name || null,
      salespersonId: selectedSalesman?.id || null,
      communications: communicationPreferences,
      status: 'confirmed'
    }
    await opportunitiesStore.updateOpportunity(opp.id, { scheduledAppointment: appointmentData })
    emit('appointment-scheduled', { ...appointmentData, calendarEventId: calendarEvent.id })
    cancelScheduleForm()
  } catch (err) {
    console.error('Failed to schedule/reschedule appointment:', err)
  }
}

async function handleConfirmAppointment() {
  if (!scheduledAppointment.value) return
  try {
    const updated = { ...scheduledAppointment.value, status: 'confirmed' }
    if (scheduledAppointment.value.id) {
      const { updateCalendarEvent } = await import('@/api/calendar')
      await updateCalendarEvent(scheduledAppointment.value.id, { status: 'confirmed' })
    }
    await opportunitiesStore.updateOpportunity(props.opportunity.id, { scheduledAppointment: updated })
    emit('appointment-scheduled', updated)
  } catch (error) {
    console.error('Failed to confirm appointment:', error)
  }
}

// Modal states
const showCreateAppointment = ref(false)
const showRescheduleSection = ref(false)
const showNsTaskSection = ref(false)
const showOfferAssignmentSection = ref(false)
const nsCloseReason = ref('')

// Template refs for child task components
const ns1TaskRef = ref(null)
const ns2TaskRef = ref(null)
const ns3TaskRef = ref(null)
const offerAssignmentTaskRef = ref(null)

// In Negotiation section state
const showNegotiationSection = ref(false)
const showAddOfferSection = ref(false)
const negotiationChannel = ref(null)
const negotiationMessage = ref('')
const negotiationSelectedOfferId = ref(null)
const addOfferWidgetRef = ref(null)

// Post-Delivery Survey section state
const showPostDeliverySurveySection = ref(false)
const postDeliverySurveyRef = ref(null)
const showPostDeliverySurveyDropdown = ref(false)

// Contract Pending Management section state
const showFinalizeContractSection = ref(false)
const showAddOfferContractPendingSection = ref(false)
const showExtendDeadlineSection = ref(false)
const showCloseAsLostContractPending = ref(false)
const showScheduleAppointmentContractPendingSection = ref(false)

// Contract Pending form data
const contractPendingForm = ref({
  contractDate: '',
  contractTime: '',
  notes: ''
})

const extendDeadlineForm = ref({
  newDeadline: '',
  reason: ''
})

// Template refs
const addOfferContractPendingRef = ref(null)
const scheduleAppointmentContractPendingFormRef = ref(null)

// Post-Delivery Survey actions dropdown menu items
const postDeliverySurveyMenuItems = computed(() => {
  return [
    {
      key: 'schedule-appointment',
      label: 'Schedule Appointment',
      onClick: () => {
        showPostDeliverySurveyDropdown.value = false
        showCreateAppointment.value = true
      }
    }
    // Can add more actions here in the future
  ]
})

const contractPendingActions = computed(() => {
  return [
    {
      key: 'add-offer',
      label: 'Add offer',
      handler: () => handleAddOfferContractPending()
    },
    {
      key: 'extend-deadline',
      label: 'Extend deadline',
      handler: () => handleExtendDeadline()
    },
    {
      key: 'close-as-lost',
      label: 'Close as Lost',
      handler: () => {
        showCloseAsLostContractPending.value = true
      }
    },
    {
      key: 'schedule-appointment',
      label: 'Schedule appointment',
      handler: () => handleScheduleAppointmentContractPending()
    }
  ]
})

function handleContractPendingAction(action) {
  // The handler is already called by SecondaryActionsDropdown
  // This is just for any additional logic if needed
}

// Computed for NS task count - this represents which NS task to show (1, 2, or 3)
const nsTaskCount = computed(() => {
  const currentCount = scheduledAppointment.value?.noShowCount || 0
  // When showing the NS section, if the count is 0, it means we're about to mark
  // as no-show for the first time, so show NS1Task
  if (currentCount === 0 && showNsTaskSection.value) {
    console.log('[OpportunityManagementWidget] nsTaskCount computed: returning 1 (first no-show)')
    return 1
  }
  // Otherwise use the actual count
  console.log('[OpportunityManagementWidget] nsTaskCount computed: returning', currentCount)
  return currentCount
})

// Watch for changes in section visibility
watch([showRescheduleSection, showNsTaskSection, showOfferAssignmentSection], ([reschedule, ns, offer]) => {
  console.log('[OpportunityManagementWidget] Section visibility changed:', {
    showRescheduleSection: reschedule,
    showNsTaskSection: ns,
    showOfferAssignmentSection: offer,
    nsTaskCount: nsTaskCount.value
  })
})

// NS Task validation
const canSubmitNsTask = computed(() => {
  const taskRefs = {
    1: ns1TaskRef,
    2: ns2TaskRef,
    3: ns3TaskRef
  }
  const ref = taskRefs[nsTaskCount.value]
  return ref.value?.canSubmit || false
})

const nsTaskButtonLabel = computed(() => {
  if (nsTaskCount.value === 3) return 'Close as Lost'
  return 'Assign and Save'
})

// Offer assignment validation
const canCreateOffer = computed(() => {
  return offerAssignmentTaskRef.value?.canSubmit || false
})

// In Negotiation computed properties
const offerSelectOptions = computed(() => {
  if (!opportunity.offers || opportunity.offers.length === 0) return []
  
  return opportunity.offers
    .filter(o => o.status === 'active')
    .map(offer => ({
      id: offer.id,
      label: `${offer.vehicleBrand} ${offer.vehicleModel} (${offer.vehicleYear})`,
      price: offer.price,
      value: offer.id
    }))
})

const canSendNegotiationMessage = computed(() => {
  return negotiationChannel.value && negotiationMessage.value.trim().length > 0
})

const showOfferModal = ref(false)
const showCloseAsLostModal = ref(false)
const showContractDateModal = ref(false)
const showDeliveryModal = ref(false)
const showRequalifyModal = ref(false)
const showVehicleSelectionModal = ref(false)
const showComingSoonModal = ref(false)
const showViewAppointment = ref(false)
const showEditAppointment = ref(false)
const recommendedCars = ref([])

// Helper function for formatting currency
function formatCurrency(value) {
  if (!value) return '0'
  return new Intl.NumberFormat('en-US').format(value)
}

// Helper function for formatting date/time
function formatDateTime(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

// Action handlers map
const actionHandlers = {
  'schedule-appointment': () => { showCreateAppointment.value = true },
  'manage-appointment': () => {
    // Show appointment management options (reschedule/cancel/mark no-show)
    // The secondary actions dropdown will show these options
    if (scheduledAppointment.value) {
      showViewAppointment.value = true
    }
  },
  'view-or-schedule-appointment': () => {
    if (scheduledAppointment.value) {
      showViewAppointment.value = true
    } else {
      showCreateAppointment.value = true
    }
  },
  'reschedule': () => {
    if (scheduledAppointment.value) {
      showEditAppointment.value = true
    }
  },
  'cancel-appointment': () => {
    handleCancelAppointment()
  },
  'mark-no-show': () => {
    handleMarkNoShow()
  },
  'select-vehicle': () => { showVehicleSelectionModal.value = true },
  'create-offer': () => {
    if (!props.opportunity.selectedVehicle && !props.opportunity.vehicle) {
      showVehicleSelectionModal.value = true
    } else {
      showOfferModal.value = true
    }
  },
  'call-prospect': () => { showComingSoonModal.value = true },
  'follow-up-offer': () => { showComingSoonModal.value = true },
  'request-decision': () => { showComingSoonModal.value = true },
  'finalize-contract': () => { showContractDateModal.value = true },
  'schedule-delivery': () => { showDeliveryModal.value = true },
  'confirm-delivery': () => { showDeliveryModal.value = true },
  'collect-feedback': () => { showComingSoonModal.value = true },
  'reschedule': () => { showEditAppointment.value = true },
  'cancel-appointment': () => {
    handleCancelAppointment()
  },
  'close-won': () => { showContractDateModal.value = true },
  'add-offer': () => { showOfferModal.value = true },
  'add-contract': () => { showContractDateModal.value = true },
  'extend-deadline': () => { showComingSoonModal.value = true },
  'close-lost': () => { showCloseAsLostModal.value = true },
  'reopen': () => { handleReopen() },
  'requalify': () => { showRequalifyModal.value = true }
}

// Use the opportunity actions composable - matches lead pattern
const opportunityActions = useOpportunityActions(
  toRef(props, 'opportunity'),
  scheduledAppointment,
  toRef(props, 'activities'),
  actionHandlers,
  formatDateTime
)

// Create opportunityState wrapper to match leadState pattern
const opportunityState = {
  isClosed: opportunityActions.isClosed,
  primaryAction: computed(() => {
    // Don't show primary action when showing inline call/schedule interface
    if (shouldShowScheduleForm.value) {
      return null
    }
    // Don't show primary action widget when we have a scheduled appointment (we show management card instead)
    if (scheduledAppointment.value && scheduledAppointment.value.start && 
        (opportunityState.displayStage.value === OPPORTUNITY_STAGES.APPOINTMENT_SCHEDULED || 
         opportunityState.displayStage.value === OPPORTUNITY_STAGES.AWAITING_APPOINTMENT)) {
      return null
    }
    return opportunityActions.primaryAction.value
  }),
  secondaryActions: opportunityActions.secondaryActions,
  activeTaskWidget: computed(() => {
    // Don't show regular task widgets when showing awaiting appointment view
    if (shouldShowScheduleForm.value) {
      return null
    }
    // Don't show NS task widget in task-widgets section - we use inline NS1Task/NS2Task/NS3Task instead
    const widget = opportunityActions.activeTaskWidget.value
    if (widget && widget.type === 'NS') {
      return null
    }
    return widget
  }),
  taskWidgetTitle: opportunityActions.taskWidgetTitle,
  displayStage: computed(() => {
    const stage = getDisplayStage(props.opportunity, 'opportunity')
    if (!stage) {
      console.warn('No display stage calculated for opportunity:', props.opportunity?.id)
    }
    return stage
  }),
  showDeadlineBanner: computed(() => {
    // Show deadline banner if opportunity has nextActionDue and is not closed
    return !opportunityActions.isClosed.value && !!props.opportunity?.nextActionDue
  })
}

// Helper function (kept for backward compatibility)
function calculateDaysSince(dateString) {
  if (!dateString) return 0
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}


// Handle owner reassignment from TaskAssignee component
const handleOwnerReassigned = async (assignee) => {
  // Reload the opportunity to get updated assignee data
  if (props.opportunity?.id) {
    await opportunitiesStore.fetchOpportunityById(props.opportunity.id)
  }
}

function handleTaskWidgetClose() {
  // Handle task widget close if needed
}

function handleVehicleSelected(vehicleData) {
  showVehicleSelectionModal.value = false
  emit('vehicle-selected', vehicleData)
  
  // After vehicle selected, show offer modal
  setTimeout(() => {
    showOfferModal.value = true
  }, 300)
}

function handleOfferCreated(offerData) {
  showOfferModal.value = false
  emit('offer-created', offerData)
}

function handleAppointmentCreated(eventData) {
  showCreateAppointment.value = false
  // Convert eventData to appointment format and emit
  emit('appointment-scheduled', {
    ...eventData,
    opportunityId: props.opportunity.id,
    customer: props.opportunity.customer.name
  })
}

// Handle appointment scheduled from inline form
function handleAppointmentScheduledFromForm(appointmentData) {
  // The handleScheduleAppointment function already emits the event
  // This is just for consistency
  handleAppointmentCreated(appointmentData)
}

async function handleCancelAppointment() {
  if (!scheduledAppointment.value) return
  
  if (!confirm('Are you sure you want to cancel this appointment?')) {
    return
  }
  
  try {
    // Delete calendar event if it has an ID
    if (scheduledAppointment.value.id) {
      const { deleteCalendarEvent } = await import('@/api/calendar')
      await deleteCalendarEvent(scheduledAppointment.value.id)
    }
    
    // Update opportunity to remove scheduled appointment
    await opportunitiesStore.updateOpportunity(props.opportunity.id, {
      scheduledAppointment: null
    })
    
    // Emit event for parent component
    emit('appointment-cancelled', scheduledAppointment.value.id)
  } catch (error) {
    console.error('Failed to cancel appointment:', error)
  }
}


function handleContractSet(contractData) {
  showContractDateModal.value = false
  // Update opportunity stage to Closed Won
  opportunitiesStore.updateOpportunity(props.opportunity.id, {
    stage: 'Closed Won',
    contractDate: contractData.contractDate
  })
}

function handleDelivered(deliveryData) {
  showDeliveryModal.value = false
  // Log delivery activity
  opportunitiesStore.addActivity(props.opportunity.id, {
    type: 'delivery',
    user: 'You',
    action: 'marked as delivered',
    data: deliveryData
  })
}

function handleClosedLost(data) {
  // Handle both object format { reason, notes } and string format
  const reason = typeof data === 'string' ? data : data.reason || data
  const notes = typeof data === 'object' ? data.notes : ''
  
  showCloseAsLostModal.value = false
  nsCloseReason.value = ''
  opportunitiesStore.updateOpportunity(props.opportunity.id, {
    stage: 'Closed Lost',
    lossReason: reason,
    lossNotes: notes
  })
}

function handleReopen() {
  opportunitiesStore.updateOpportunity(props.opportunity.id, {
    stage: 'Qualified'
  })
}

function handleRequalified(leadData) {
  showRequalifyModal.value = false
  // Navigate to new lead
  router.push(`/customer/${leadData.id}?type=lead`)
}

function handleDeleteAppointment(appointmentId) {
  showViewAppointment.value = false
  // Delete appointment logic would go here
}

function handleSaveAppointment(appointmentData) {
  showEditAppointment.value = false
  // Save appointment logic would go here
}

function handleSetCallback({ opportunity, callbackDate }) {
  // Set callback date to transition to "To be Called Back" stage
  opportunitiesStore.updateOpportunity(opportunity.id, {
    callbackDate: callbackDate
  })
}

// NS Assignment handler (called from NSTask component)
function handleNsAssigned({ opportunity, assignee, note }) {
  // Assignment is already handled in NSTask component
  // This is just for any additional handling if needed
  console.log('Opportunity assigned:', { opportunity, assignee, note })
}

// Handle confirm NS task
function handleConfirmNsTask() {
  const taskRefs = { 1: ns1TaskRef, 2: ns2TaskRef, 3: ns3TaskRef }
  const ref = taskRefs[nsTaskCount.value]
  ref.value?.submit()
}

// Handle cancel NS task
function handleCancelNsTask() {
  showNsTaskSection.value = false
}

// Handle offer created from offer assignment task
async function handleOfferAssignmentCreated({ opportunity, offerData }) {
  try {
    // Update appointment status to "completed"
    if (scheduledAppointment.value?.id) {
      const { updateCalendarEvent } = await import('@/api/calendar')
      await updateCalendarEvent(scheduledAppointment.value.id, {
        status: 'completed'
      })
    }
    
    // Add offer to offers array and transition to In Negotiation
    await opportunitiesStore.addOffer(opportunity.id, {
      vehicleBrand: offerData.data?.brand || '',
      vehicleModel: offerData.data?.model || '',
      vehicleYear: offerData.data?.year || '',
      price: offerData.data?.price || 0,
      data: offerData.data
    })
    
    showOfferAssignmentSection.value = false
  } catch (error) {
    console.error('Failed to create offer:', error)
  }
}

// Handle confirm offer assignment
function handleConfirmOfferAssignment() {
  offerAssignmentTaskRef.value?.submit()
}

// Handle cancel offer assignment
function handleCancelOfferAssignment() {
  showOfferAssignmentSection.value = false
}

// In Negotiation handlers
function handleFollowUpOffer() {
  console.log('[OpportunityManagementWidget] handleFollowUpOffer called')
  
  // Show negotiation section, hide others (mutually exclusive)
  showRescheduleSection.value = false
  showNsTaskSection.value = false
  showOfferAssignmentSection.value = false
  showAddOfferSection.value = false
  showNegotiationSection.value = !showNegotiationSection.value
  
  // Reset form if closing
  if (!showNegotiationSection.value) {
    negotiationChannel.value = null
    negotiationMessage.value = ''
    negotiationSelectedOfferId.value = null
  }
}

function handleAddAnotherOffer() {
  console.log('[OpportunityManagementWidget] handleAddAnotherOffer called')
  
  // Show add offer section, hide others (mutually exclusive)
  showRescheduleSection.value = false
  showNsTaskSection.value = false
  showOfferAssignmentSection.value = false
  showNegotiationSection.value = false
  showAddOfferSection.value = !showAddOfferSection.value
}

async function handleOfferAccepted(offer) {
  console.log('[OpportunityManagementWidget] handleOfferAccepted called', offer)
  
  try {
    // Mark offer as accepted and transition to In Negotiation - Contract Pending
    await opportunitiesStore.markOfferAccepted(opportunity.id, offer.id)
    
    // Add activity for offer acceptance
    await opportunitiesStore.addActivity(opportunity.id, {
      type: 'offer-acceptance',
      user: userStore.currentUser?.name || 'You',
      action: 'accepted offer',
      content: `Offer accepted: ${offer.vehicleBrand} ${offer.vehicleModel} (${offer.vehicleYear}) - € ${offer.price.toLocaleString()}`,
      data: { offerId: offer.id },
      timestamp: new Date().toISOString()
    })
    
    showNegotiationSection.value = false
  } catch (error) {
    console.error('Failed to mark offer as accepted:', error)
  }
}

async function handleOfferDeleted(offer) {
  console.log('[OpportunityManagementWidget] handleOfferDeleted called', offer)
  
  try {
    await opportunitiesStore.deleteOffer(opportunity.id, offer.id)
    
    // Add activity for offer deletion
    await opportunitiesStore.addActivity(opportunity.id, {
      type: 'offer-deletion',
      user: userStore.currentUser?.name || 'You',
      action: 'archived offer',
      content: `Offer archived: ${offer.vehicleBrand} ${offer.vehicleModel} (${offer.vehicleYear})`,
      data: { offerId: offer.id },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to delete offer:', error)
  }
}

function handleViewOffer(offer) {
  console.log('[OpportunityManagementWidget] handleViewOffer called', offer)
  // TODO: Open offer detail modal (Coming Soon)
  showComingSoonModal.value = true
}

async function handleSendNegotiationMessage() {
  if (!canSendNegotiationMessage.value) return
  
  console.log('[OpportunityManagementWidget] handleSendNegotiationMessage called', {
    channel: negotiationChannel.value,
    message: negotiationMessage.value,
    offerId: negotiationSelectedOfferId.value
  })
  
  try {
    // Add activity for communication
    const selectedOffer = opportunity.offers?.find(o => o.id === negotiationSelectedOfferId.value)
    const offerReference = selectedOffer 
      ? `${selectedOffer.vehicleBrand} ${selectedOffer.vehicleModel} (€${selectedOffer.price.toLocaleString()})`
      : 'offer'
    
    await opportunitiesStore.addActivity(opportunity.id, {
      type: negotiationChannel.value,
      user: userStore.currentUser?.name || 'You',
      action: `sent ${negotiationChannel.value}`,
      content: negotiationMessage.value,
      data: {
        channel: negotiationChannel.value,
        offerId: negotiationSelectedOfferId.value,
        offerReference: offerReference
      },
      timestamp: new Date().toISOString()
    })
    
    // Reset and close
    showNegotiationSection.value = false
    negotiationChannel.value = null
    negotiationMessage.value = ''
    negotiationSelectedOfferId.value = null
  } catch (error) {
    console.error('Failed to send negotiation message:', error)
  }
}

function handleCancelNegotiation() {
  showNegotiationSection.value = false
  negotiationChannel.value = null
  negotiationMessage.value = ''
  negotiationSelectedOfferId.value = null
}

// Add Offer inline handlers
const canCreateInlineOffer = computed(() => {
  return addOfferWidgetRef.value?.isValid || false
})

async function handleInlineOfferCreated(offerPayload) {
  console.log('[OpportunityManagementWidget] handleInlineOfferCreated called', offerPayload)
  
  try {
    // Add offer to opportunity
    await opportunitiesStore.addOffer(opportunity.id, {
      vehicleBrand: offerPayload.data?.brand || '',
      vehicleModel: offerPayload.data?.model || '',
      vehicleYear: offerPayload.data?.year || '',
      price: offerPayload.data?.price || 0,
      data: offerPayload.data
    })
    
    // Add activity for offer creation
    await opportunitiesStore.addActivity(opportunity.id, {
      type: 'offer',
      user: userStore.currentUser?.name || 'You',
      action: 'created an offer',
      content: `Offer created: ${offerPayload.data?.brand} ${offerPayload.data?.model} (${offerPayload.data?.year}) - € ${(offerPayload.data?.price || 0).toLocaleString()}`,
      data: offerPayload.data,
      timestamp: new Date().toISOString()
    })
    
    // Close the section
    showAddOfferSection.value = false
  } catch (error) {
    console.error('Failed to create offer:', error)
  }
}

function handleConfirmAddOffer() {
  if (addOfferWidgetRef.value) {
    addOfferWidgetRef.value.submit()
  }
}

function handleCancelAddOffer() {
  showAddOfferSection.value = false
  // Reset the form if needed
  if (addOfferWidgetRef.value) {
    // The OfferWidget component will handle its own reset
  }
}

// Post-Delivery Survey handlers
const canSubmitSurvey = computed(() => {
  return postDeliverySurveyRef.value?.isValid || false
})

async function handleSurveySubmit(surveyData) {
  console.log('[OpportunityManagementWidget] handleSurveySubmit called', surveyData)
  
  try {
    const opp = getCurrentOpportunity()
    const { responses, triggerActions } = surveyData
    
    // Save survey as activity
    await opportunitiesStore.addActivity(opp.id, {
      type: 'post-delivery-survey',
      user: userStore.currentUser?.name || 'You',
      action: 'completed post-delivery customer satisfaction survey',
      content: 'Post-Delivery Customer Satisfaction Survey completed',
      data: {
        responses,
        triggerActions,
        timestamp: surveyData.timestamp
      },
      timestamp: surveyData.timestamp
    })
    
    // Process trigger actions and send emails
    const triggerActivityPromises = []
    
    if (triggerActions.negativeSatisfaction) {
      triggerActivityPromises.push(
        opportunitiesStore.addActivity(opp.id, {
          type: 'survey-trigger',
          user: userStore.currentUser?.name || 'You',
          action: 'triggered email notification',
          content: 'Email sent to Sales Manager + Branch Manager (Negative satisfaction)',
          data: {
            trigger: 'negative-satisfaction',
            recipients: ['Sales Manager', 'Branch Manager'],
            surveyResponse: responses.q1
          },
          timestamp: new Date().toISOString()
        })
      )
    }
    
    if (triggerActions.issuesReported) {
      triggerActivityPromises.push(
        opportunitiesStore.addActivity(opp.id, {
          type: 'survey-trigger',
          user: userStore.currentUser?.name || 'You',
          action: 'triggered email notification',
          content: 'Email sent to Service Department (Issues reported)',
          data: {
            trigger: 'issues-reported',
            recipients: ['Service Department'],
            issueDescription: responses.q3
          },
          timestamp: new Date().toISOString()
        })
      )
    }
    
    if (triggerActions.deliveryDelay) {
      triggerActivityPromises.push(
        opportunitiesStore.addActivity(opp.id, {
          type: 'survey-trigger',
          user: userStore.currentUser?.name || 'You',
          action: 'triggered email notification',
          content: 'Email sent to Delivery Coordinator (Major delivery delay)',
          data: {
            trigger: 'delivery-delay',
            recipients: ['Delivery Coordinator'],
            surveyResponse: responses.q4
          },
          timestamp: new Date().toISOString()
        })
      )
    }
    
    if (triggerActions.highNPS) {
      triggerActivityPromises.push(
        opportunitiesStore.addActivity(opp.id, {
          type: 'survey-trigger',
          user: userStore.currentUser?.name || 'You',
          action: 'triggered email notification',
          content: 'Email sent to Marketing (High NPS - Definitely Yes)',
          data: {
            trigger: 'high-nps',
            recipients: ['Marketing'],
            surveyResponse: responses.q7
          },
          timestamp: new Date().toISOString()
        })
      )
    }
    
    // Wait for all trigger activities to be created
    await Promise.all(triggerActivityPromises)
    
    // Close the survey section
    showPostDeliverySurveySection.value = false
  } catch (error) {
    console.error('Failed to submit survey:', error)
  }
}

function handleConfirmSurvey() {
  if (postDeliverySurveyRef.value) {
    postDeliverySurveyRef.value.submit()
  }
}

function handleCancelSurvey() {
  showPostDeliverySurveySection.value = false
}

// Contract Pending Management handlers
// Computed properties for form validation
const maxContractDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const minDeadlineDate = computed(() => {
  const today = new Date()
  today.setDate(today.getDate() + 1) // Minimum tomorrow
  return today.toISOString().split('T')[0]
})

const canSubmitFinalizeContract = computed(() => {
  return !!contractPendingForm.value.contractDate
})

const canSubmitExtendDeadline = computed(() => {
  return !!extendDeadlineForm.value.newDeadline
})

const canCreateInlineOfferContractPending = computed(() => {
  return addOfferContractPendingRef.value?.isValid || false
})

// Primary Action: Finalize Contract
function handleFinalizeContract() {
  // Close other sections (mutually exclusive)
  showAddOfferContractPendingSection.value = false
  showExtendDeadlineSection.value = false
  showScheduleAppointmentContractPendingSection.value = false
  
  showFinalizeContractSection.value = !showFinalizeContractSection.value
  
  // Initialize form with today's date if opening
  if (showFinalizeContractSection.value && !contractPendingForm.value.contractDate) {
    const today = new Date()
    contractPendingForm.value.contractDate = today.toISOString().split('T')[0]
    contractPendingForm.value.contractTime = today.toTimeString().slice(0, 5)
  }
}

function handleCancelFinalizeContract() {
  showFinalizeContractSection.value = false
  contractPendingForm.value = {
    contractDate: '',
    contractTime: '',
    notes: ''
  }
}

async function handleConfirmFinalizeContract() {
  if (!canSubmitFinalizeContract.value) return
  
  try {
    const opp = getCurrentOpportunity()
    const datetime = contractPendingForm.value.contractTime 
      ? `${contractPendingForm.value.contractDate}T${contractPendingForm.value.contractTime}:00`
      : `${contractPendingForm.value.contractDate}T12:00:00`
    
    // Update opportunity with contract date
    await opportunitiesStore.updateOpportunity(opp.id, {
      contractDate: datetime,
      contractNotes: contractPendingForm.value.notes
    })
    
    // Add activity
    await opportunitiesStore.addActivity(opp.id, {
      type: 'contract',
      user: userStore.currentUser?.name || 'You',
      action: 'set contract signing date',
      content: `Contract date set: ${new Date(datetime).toLocaleString()}`,
      data: {
        contractDate: datetime,
        notes: contractPendingForm.value.notes
      },
      timestamp: new Date().toISOString()
    })
    
    // Close section and reset form
    handleCancelFinalizeContract()
  } catch (error) {
    console.error('Failed to set contract date:', error)
  }
}

// Add Offer
function handleAddOfferContractPending() {
  // Close other sections (mutually exclusive)
  showFinalizeContractSection.value = false
  showExtendDeadlineSection.value = false
  showScheduleAppointmentContractPendingSection.value = false
  
  showAddOfferContractPendingSection.value = !showAddOfferContractPendingSection.value
}

function handleCancelAddOfferContractPending() {
  showAddOfferContractPendingSection.value = false
}

function handleConfirmAddOfferContractPending() {
  if (addOfferContractPendingRef.value) {
    addOfferContractPendingRef.value.submit()
  }
}

async function handleInlineOfferCreatedContractPending(offerPayload) {
  try {
    const opp = getCurrentOpportunity()
    
    // Add offer to opportunity
    await opportunitiesStore.addOffer(opp.id, {
      vehicleBrand: offerPayload.data?.brand || '',
      vehicleModel: offerPayload.data?.model || '',
      vehicleYear: offerPayload.data?.year || '',
      price: offerPayload.data?.price || 0,
      data: offerPayload.data
    })
    
    // Add activity
    await opportunitiesStore.addActivity(opp.id, {
      type: 'offer',
      user: userStore.currentUser?.name || 'You',
      action: 'created an offer',
      content: `Offer created: ${offerPayload.data?.brand} ${offerPayload.data?.model} (${offerPayload.data?.year}) - € ${(offerPayload.data?.price || 0).toLocaleString()}`,
      data: offerPayload.data,
      timestamp: new Date().toISOString()
    })
    
    showAddOfferContractPendingSection.value = false
  } catch (error) {
    console.error('Failed to create offer:', error)
  }
}

// Extend Deadline
function handleExtendDeadline() {
  // Close other sections (mutually exclusive)
  showFinalizeContractSection.value = false
  showAddOfferContractPendingSection.value = false
  showScheduleAppointmentContractPendingSection.value = false
  
  showExtendDeadlineSection.value = !showExtendDeadlineSection.value
  
  // Initialize form if opening
  if (showExtendDeadlineSection.value && !extendDeadlineForm.value.newDeadline) {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    extendDeadlineForm.value.newDeadline = tomorrow.toISOString().split('T')[0]
  }
}

function handleCancelExtendDeadline() {
  showExtendDeadlineSection.value = false
  extendDeadlineForm.value = {
    newDeadline: '',
    reason: ''
  }
}

async function handleConfirmExtendDeadline() {
  if (!canSubmitExtendDeadline.value) return
  
  try {
    const opp = getCurrentOpportunity()
    
    // Update opportunity with new deadline
    await opportunitiesStore.updateOpportunity(opp.id, {
      deadline: extendDeadlineForm.value.newDeadline,
      deadlineExtensionReason: extendDeadlineForm.value.reason
    })
    
    // Add activity
    await opportunitiesStore.addActivity(opp.id, {
      type: 'deadline-extension',
      user: userStore.currentUser?.name || 'You',
      action: 'extended deadline',
      content: `Deadline extended to ${new Date(extendDeadlineForm.value.newDeadline).toLocaleDateString()}`,
      data: {
        newDeadline: extendDeadlineForm.value.newDeadline,
        reason: extendDeadlineForm.value.reason
      },
      timestamp: new Date().toISOString()
    })
    
    handleCancelExtendDeadline()
  } catch (error) {
    console.error('Failed to extend deadline:', error)
  }
}

// Schedule Appointment
function handleScheduleAppointmentContractPending() {
  // Close other sections (mutually exclusive)
  showFinalizeContractSection.value = false
  showAddOfferContractPendingSection.value = false
  showExtendDeadlineSection.value = false
  
  showScheduleAppointmentContractPendingSection.value = !showScheduleAppointmentContractPendingSection.value
}

function handleCancelScheduleAppointmentContractPending() {
  showScheduleAppointmentContractPendingSection.value = false
  // Form will reset itself when section closes
}

async function handleScheduleAppointmentContractPendingSubmit(payload) {
  const {
    eventType,
    selectedDate,
    selectedSlot,
    selectedTeam,
    selectedSalesman,
    durationValue,
    communicationPreferences
  } = payload
  const opp = getCurrentOpportunity()
  const d = selectedDate
  const [hours, minutes] = selectedSlot.split(':').map(Number)
  const startDateTime = new Date(d)
  startDateTime.setHours(hours, minutes, 0, 0)
  const duration = durationValue || 30
  const endDateTime = new Date(startDateTime.getTime() + duration * 60000)
  const assigneeName = selectedSalesman?.name || selectedTeam?.name || opp.assignee || 'Unassigned'
  const assigneeId = selectedSalesman?.id || selectedTeam?.id || null
  const assigneeType = selectedSalesman ? 'user' : 'team'

  try {
    const calendarEventData = {
      customerId: opp.customerId || opp.customer?.id,
      customer: opp.customer?.name || 'Unknown',
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      type: eventType,
      title: `${eventType} - ${opp.customer?.name || 'Customer'}`,
      assigneeId,
      assigneeType,
      teamId: selectedTeam?.id || null,
      team: selectedTeam?.name || null,
      salesperson: selectedSalesman?.name || null,
      salespersonId: selectedSalesman?.id || null,
      duration,
      opportunityId: opp.id
    }
    const calendarEvent = await createCalendarEvent(calendarEventData)
    const appointmentData = {
      id: calendarEvent.id,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      type: eventType,
      assignee: assigneeName,
      assigneeId,
      assigneeType,
      duration,
      team: selectedTeam?.name || null,
      teamId: selectedTeam?.id || null,
      salesperson: selectedSalesman?.name || null,
      salespersonId: selectedSalesman?.id || null,
      communications: communicationPreferences,
      status: 'confirmed'
    }
    await opportunitiesStore.updateOpportunity(opp.id, { scheduledAppointment: appointmentData })
    emit('appointment-scheduled', { ...appointmentData, calendarEventId: calendarEvent.id })
    handleCancelScheduleAppointmentContractPending()
  } catch (err) {
    console.error('Failed to schedule appointment:', err)
  }
}


// Close as Lost
function handleCloseAsLostContractPending(data) {
  const reason = typeof data === 'string' ? data : data.reason || data
  const notes = typeof data === 'object' ? data.notes : ''
  
  showCloseAsLostContractPending.value = false
  opportunitiesStore.updateOpportunity(props.opportunity.id, {
    stage: 'Closed Lost',
    lossReason: reason,
    lossNotes: notes
  })
}

function handleRescheduleAppointment() {
  if (!scheduledAppointment.value || !scheduledAppointment.value.start) return
  showRescheduleSection.value = true
  showNsTaskSection.value = false
  showOfferAssignmentSection.value = false
}

function handleMarkNoShow() {
  console.log('[OpportunityManagementWidget] handleMarkNoShow called', {
    hasAppointment: !!scheduledAppointment.value,
    appointmentStatus: scheduledAppointment.value?.status,
    noShowCount: scheduledAppointment.value?.noShowCount
  })
  
  if (!scheduledAppointment.value) {
    console.log('[OpportunityManagementWidget] No scheduled appointment, returning')
    return
  }

  // Show NS task section, hide others (mutually exclusive)
  showRescheduleSection.value = false
  showOfferAssignmentSection.value = false
  showNsTaskSection.value = true
  
  console.log('[OpportunityManagementWidget] Set showNsTaskSection to true')

  // Update appointment status to no-show if not already marked (async, but don't wait)
  if (scheduledAppointment.value.status !== 'no-show') {
    console.log('[OpportunityManagementWidget] Calling updateAppointmentToNoShow')
    updateAppointmentToNoShow()
  }
}

// Handle mark as showed up
function handleMarkShowedUp() {
  console.log('[OpportunityManagementWidget] handleMarkShowedUp called', {
    hasAppointment: !!scheduledAppointment.value,
    appointmentStatus: scheduledAppointment.value?.status
  })
  
  if (!scheduledAppointment.value) {
    console.log('[OpportunityManagementWidget] No scheduled appointment, returning')
    return
  }

  // Show offer assignment section, hide others (mutually exclusive)
  showRescheduleSection.value = false
  showNsTaskSection.value = false
  showOfferAssignmentSection.value = true
  
  console.log('[OpportunityManagementWidget] Set showOfferAssignmentSection to true')
}

async function updateAppointmentToNoShow() {
  if (!scheduledAppointment.value) return
  
  try {
    // Calculate the new no-show count (1st, 2nd, or 3rd time)
    const currentNoShowCount = scheduledAppointment.value.noShowCount || 0
    const newNoShowCount = currentNoShowCount + 1
    
    // Determine NS label for activity (NS1, NS2, or NS3)
    const nsLabel = newNoShowCount === 1 ? 'NS1' : newNoShowCount === 2 ? 'NS2' : 'NS3'
    
    // Update appointment status to no-show
    if (scheduledAppointment.value.id) {
      const { updateCalendarEvent } = await import('@/api/calendar')
      await updateCalendarEvent(scheduledAppointment.value.id, {
        status: 'no-show'
      })
    }
    
    // Update opportunity appointment status (keep stage as Qualified/Appointment Scheduled)
    const updatedAppointment = {
      ...scheduledAppointment.value,
      status: 'no-show',
      noShowCount: newNoShowCount
    }
    
    // Update opportunity with new appointment - keep stage as "Qualified" (displays as "Appointment Scheduled")
    // Don't change the stage, keep it as Qualified so it shows as "Appointment Scheduled"
    await opportunitiesStore.updateOpportunity(props.opportunity.id, {
      scheduledAppointment: updatedAppointment
      // Keep the existing stage (Qualified) - don't change to "Needs Follow-up"
    })
    
    // Create NS task activity with NS1/NS2/NS3 label
    await opportunitiesStore.addActivity(props.opportunity.id, {
      type: 'ns-task',
      user: userStore.currentUser?.name || 'You',
      action: `${nsLabel} - marked appointment as no-show`,
      content: `${nsLabel}: Appointment on ${new Date(scheduledAppointment.value.start).toLocaleString()} marked as no-show. This is the ${newNoShowCount === 1 ? 'first' : newNoShowCount === 2 ? 'second' : 'third'} no-show.`,
      data: {
        appointmentId: scheduledAppointment.value.id,
        noShowCount: newNoShowCount,
        nsLabel: nsLabel
      },
      timestamp: new Date().toISOString()
    })
    
    // Emit event for parent component
    emit('appointment-no-show', {
      appointmentId: scheduledAppointment.value.id,
      noShowCount: newNoShowCount,
      nsLabel: nsLabel
    })
  } catch (error) {
    console.error('Failed to mark appointment as no-show:', error)
  }
}

// NS Task event handlers
function handleContactCustomer(opportunity) {
  // Navigate to customer or open communication modal
  router.push(`/customer/${opportunity.customerId}`)
}

function handleRescheduleFromNs(opportunity) {
  showEditAppointment.value = true
}

function handleNsSurveyCompleted({ opportunity, responses }) {
  // Handle survey completion
  console.log('NS Survey completed:', responses)
  // You can add activity or update opportunity here
}

function handleNsSurveyRefused({ opportunity }) {
  // Handle survey refusal
  console.log('NS Survey refused')
}

function handleNsNotResponding({ opportunity }) {
  // Handle not responding
  console.log('NS Not responding')
}

function handleAutoCloseLost({ opportunity, reason }) {
  showCloseAsLostModal.value = true
}

// Handle close as lost from NS3
async function handleNsCloseAsLost({ opportunity, reason }) {
  // Close the NS task section
  showNsTaskSection.value = false
  
  // Update opportunity directly with the form data
  await opportunitiesStore.updateOpportunity(opportunity.id, {
    stage: 'Closed Lost',
    lossReason: reason
  })
  
  // Create activity for closing
  await opportunitiesStore.addActivity(opportunity.id, {
    type: 'close-lost',
    user: userStore.currentUser?.name || 'You',
    action: 'closed opportunity as lost',
    content: `Opportunity closed as lost. Reason: ${reason || 'N/A'}`,
    data: {
      reason: reason
    },
    timestamp: new Date().toISOString()
  })
}

function handleSecondaryAction(action) {
  // Execute the action handler if available
  if (action && action.handler) {
    action.handler()
  } else if (action && action.key) {
    // Fallback: try to find handler in actionHandlers
    const handler = actionHandlers[action.key]
    if (handler) {
      handler()
    }
  }
}


// Load recommended cars on mount
onMounted(async () => {
  try {
    const result = await fetchVehicles({})
    const allVehicles = result.data || []
    recommendedCars.value = allVehicles
      .filter(car => car.stockDays !== null && car.stockDays !== undefined)
      .slice(0, 5)
  } catch (err) {
    console.error('Failed to load recommended cars:', err)
    recommendedCars.value = []
  }
  
  // Check if appointment is already no-show and show NS task section
  if (scheduledAppointment.value && scheduledAppointment.value.status === 'no-show') {
    showNsTaskSection.value = true
  }
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

