<template>
  <TaskManagementWidget :task="opportunity" hide-title hide-border>
    <template #deadline-banner>
      <div class="px-4 pt-4">
        <DeadlineBanner
          v-if="!opportunityState.isClosed.value"
          :next-action-due="opportunity.nextActionDue"
          :show-deadline-banner="opportunityState.showDeadlineBanner.value"
          :task-id="opportunity.id"
        />
      </div>
    </template>
    
    <template #primary-action>
      <!-- TaskAssignee (assigned card) -->
      <TaskAssignee
        :task="opportunity"
        task-type="opportunity"
        :readonly="opportunityState.isClosed.value"
        @reassigned="handleOwnerReassigned"
        class="mb-3"
      />

      <!-- Primary action -->
      <!-- Regular primary action widget -->
      <!-- Hide for Contract Pending - delivery date is handled inline in ContractPendingManagementSection -->
      <PrimaryActionWidget
        v-if="!opportunityState.isClosed.value && !isInNegotiation && !isContractPending && opportunityState.primaryAction.value"
        :action="opportunityState.primaryAction.value"
        :color-scheme="opportunityState.primaryAction.value.colorScheme"
        @action-clicked="opportunityState.primaryAction.value.handler"
      />
      
      <!-- Offers Carousel - Show for all stages when offers exist -->
      <div v-show="hasOffers" class="mt-4" :key="`offers-wrapper-${opportunity.id}`">
        <OfferCarousel
          v-if="hasOffers"
          ref="offerCarouselRef"
          :key="`carousel-${opportunity.id}`"
          :offers="opportunity.offers || []"
          :opportunity-id="opportunity.id"
          @offer-activated="handleOfferActivated"
          @generate-pdf="handleOfferPDFGenerate"
          @add="openCreateOfferModal"
        />
      </div>
      
      <!-- Contract Carousel (Contract Pending) -->
      <div v-if="isContractPending && !opportunityActions.isClosed.value" class="mt-4">
        <ContractCarousel
          ref="contractCarouselRef"
          :contracts="contracts"
          :opportunity-id="opportunity.id"
          :max-contract-date="maxContractDate"
          @generate-pdf="handleContractPDFGenerate"
          @collect-esignatures="handleCollectESignaturesFromContract"
          @add="openCreateContractModal"
        />
      </div>
      
      <!-- Contract Pending Management Section -->
      <ContractPendingManagementSection
        v-if="!opportunityActions.isClosed.value && opportunity.stage === 'In Negotiation' && getDisplayStage(opportunity, 'opportunity') === 'In Negotiation - Contract Pending'"
        ref="contractPendingManagementSectionRef"
        :opportunity="opportunity"
        :has-contracts="contracts.length > 0"
        :show-add-offer-contract-pending-section="showAddOfferContractPendingSection"
        :show-close-as-lost-section="showCloseAsLostSection"
        :show-schedule-appointment-contract-pending-section="showScheduleAppointmentContractPendingSection"
        :show-set-delivery-date-section="showSetDeliveryDateSection"
        :close-as-lost-reason="closeAsLostReason"
        :close-as-lost-notes="closeAsLostNotes"
        :delivery-date-form="deliveryDateForm"
        :has-delivery-date="hasDeliveryDate"
        :contract-pending-actions="contractPendingActions"
        :can-submit-set-delivery-date="canSubmitSetDeliveryDate"
        :can-create-inline-offer-contract-pending="canCreateInlineOfferContractPending"
        :min-delivery-date="minDeliveryDate"
        @update:show-schedule-appointment-contract-pending-section="showScheduleAppointmentContractPendingSection = $event"
        @update:show-set-delivery-date-section="(p) => { 
          showSetDeliveryDateSection.value = p
          if (p) {
            showAddOfferContractPendingSection.value = false
            showCloseAsLostSection.value = false
            initDateField(deliveryDateForm, 'deliveryDate')
          }
        }"
        @update:delivery-date-form="deliveryDateForm = $event"
        @offer-created-contract-pending="handleInlineOfferCreatedContractPending"
        @cancel-add-offer-contract-pending="handleCancelAddOfferContractPending"
        @confirm-add-offer-contract-pending="handleConfirmAddOfferContractPending"
        @confirm-set-delivery-date="handleConfirmSetDeliveryDate"
        @cancel-set-delivery-date="handleCancelSetDeliveryDate"
        @schedule-appointment-contract-pending-submit="handleScheduleAppointmentContractPendingSubmit"
        @cancel-schedule-appointment-contract-pending="handleCancelScheduleAppointmentContractPending"
        @contract-pending-action="handleContractPendingAction"
        @close-as-lost-cancel="handleCancelCloseAsLost"
        @close-as-lost-confirm="handleConfirmCloseAsLost"
        class="mt-4"
      />
      
      <!-- In Negotiation Management Section (exclude Contract Pending) - Show below carousel -->
      <NegotiationManagementSection
        v-if="isInNegotiation"
        ref="negotiationManagementSectionRef"
        :opportunity="opportunity"
        :show-negotiation-section="showNegotiationSection"
        :show-add-offer-section="showAddOfferSection"
        :show-survey-section="showSurveySection"
        :negotiation-channel="negotiationChannel"
        :negotiation-message="negotiationMessage"
        :negotiation-selected-offer-id="negotiationSelectedOfferId"
        :offer-select-options="offerSelectOptions"
        :can-send-negotiation-message="canSendNegotiationMessage"
        :can-create-inline-offer="canCreateInlineOffer"
        :secondary-actions="filteredSecondaryActions"
        @update:show-negotiation-section="showNegotiationSection = $event"
        @update:show-add-offer-section="showAddOfferSection = $event"
        @update:show-survey-section="showSurveySection = $event"
        @update:negotiation-channel="negotiationChannel = $event"
        @update:negotiation-message="negotiationMessage = $event"
        @update:negotiation-selected-offer-id="negotiationSelectedOfferId = $event"
        @reset-negotiation-form="negotiationChannel = null; negotiationMessage = ''; negotiationSelectedOfferId = null"
        @send-negotiation-message="handleSendNegotiationMessage"
        @cancel-negotiation="handleCancelNegotiation"
        @offer-created="handleInlineOfferCreated"
        @cancel-add-offer="handleCancelAddOffer"
        @confirm-add-offer="handleConfirmAddOffer"
        @ofb-postpone="handleTaskPostpone"
        @generate-pdf="handleOfferPDFGenerate"
        @secondary-action="handleSecondaryAction"
        @survey-submitted="handleSurveySubmitted"
        @survey-cancelled="handleSurveyCancelled"
      />

      <!-- Manage Appointment: last among conditionally shown cards (shows independently when appointment scheduled) -->
      <AppointmentManagementSection
        v-if="!opportunityState.isClosed.value && scheduledAppointment && scheduledAppointment.start"
        ref="appointmentManagementSectionRef"
        :opportunity="opportunity"
        :scheduled-appointment="scheduledAppointment"
        :show-reschedule-section="showRescheduleSection"
        :show-ns-task-section="showNsTaskSection"
        :show-offer-assignment-section="showOfferAssignmentSection"
        :ns-task-count="nsTaskCount"
        :can-submit-ns-task="canSubmitNsTask"
        :ns-task-button-label="nsTaskButtonLabel"
        :can-create-offer="canCreateOffer"
        :secondary-actions="filteredSecondaryActions"
        :customer-name="customerName"
        :customer-profile-url="customerProfileUrl"
        :is-appointment-today="isAppointmentToday"
        @confirm-appointment="handleConfirmAppointment"
        @update:show-reschedule-section="showRescheduleSection = $event"
        @update:show-ns-task-section="showNsTaskSection = $event"
        @update:show-offer-assignment-section="showOfferAssignmentSection = $event"
        @mark-no-show="handleMarkNoShow"
        @mark-showed-up="handleMarkShowedUp"
        @reschedule-submit="(p) => handleScheduleFormSubmit(p, 'reschedule')"
        @reschedule-cancel="cancelRescheduleForm"
        @ns-assigned="handleNsAssigned"
        @ns-cancel="handleCancelNsTask"
        @ns-confirm="handleConfirmNsTask"
        @ns-close-as-lost="handleNsCloseAsLost"
        @offer-assignment-created="handleOfferAssignmentCreated"
        @offer-assignment-cancel="handleCancelOfferAssignment"
        @offer-assignment-confirm="handleConfirmOfferAssignment"
        @secondary-action="handleSecondaryAction"
        @close-as-lost-confirmed="handleCloseAsLostFromAppointment"
        @customer-click="handleCustomerClick"
        class="mt-4"
      />
    </template>

    <template #task-widgets>
      <!-- Closed Won - Contract Carousel -->
      <div v-if="isClosedWon && contracts.length > 0" class="mb-4">
        <ContractCarousel
          ref="contractCarouselRef"
          :contracts="contracts"
          :opportunity-id="opportunity.id"
          :max-contract-date="maxContractDate"
          @generate-pdf="handleContractPDFGenerate"
          @collect-esignatures="handleCollectESignaturesFromContract"
        />
      </div>

      <!-- Qualified and Awaiting Appointment Schedule Form -->
      <div v-if="shouldShowScheduleForm" class="space-y-4">
        <!-- Assignment Note Card -->
        <div v-if="opportunity.assignmentNote" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <i class="fa-solid fa-sticky-note text-blue-600 text-sm mt-0.5"></i>
            <div class="flex-1">
              <h5 class="font-semibold text-foreground text-sm mb-1">Note from Assigner</h5>
              <p class="text-sm text-muted-foreground whitespace-pre-wrap">{{ opportunity.assignmentNote }}</p>
            </div>
          </div>
        </div>

        <!-- Call and Schedule Appointment Container (matching LQTask.vue design) -->
        <div
          class="rounded-lg flex flex-col bg-muted"
        >
          <div class="pt-1 px-1">
            <!-- Call Interface (always visible) -->
            <div
              class="bg-white rounded-lg shadow-nsc-card overflow-hidden"
            >
            <div class="p-6">
              <div class="mb-3">
                <h4 class="font-bold text-foreground text-sm">Call to Schedule Appointment</h4>
                <p class="text-sm text-muted-foreground mt-0.5">
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

      <!-- Closed Won Delivery Management Section -->
      <div
        v-if="shouldShowDeliveryManagement"
        class="rounded-lg flex flex-col bg-muted"
      >
        <div class="pt-1 px-1">
          <div
            class="bg-white rounded-lg shadow-nsc-card overflow-visible"
          >
          <div class="p-6">
            <div class="mb-3">
              <h4 class="font-bold text-foreground text-sm">{{ deliveryManagementTitle }}</h4>
              <p class="text-sm text-muted-foreground mt-0.5">
                {{ deliveryManagementDescription }}
              </p>
            </div>
            <div class="flex flex-wrap gap-3 items-center">
              <div class="outcome-toggle-group flex flex-wrap gap-3">
                <Toggle
                  v-if="!hasDeliveryDate"
                  variant="outline"
                  :model-value="showScheduleDeliverySection"
                  @update:model-value="(p) => { 
                    showScheduleDeliverySection = p
                    if (p) {
                      showConfirmDeliverySection = false
                      // Initialize form with today's date
                      initDateField(deliveryScheduleForm, 'deliveryDate')
                    }
                  }"
                  class="outcome-toggle-item"
                >
                  <i class="fa-solid fa-truck"></i>
                  <span>Schedule Delivery</span>
                </Toggle>
                <Toggle
                  v-if="hasDeliveryDate && !isDelivered"
                  variant="outline"
                  :model-value="showConfirmDeliverySection"
                  @update:model-value="(p) => { 
                    showConfirmDeliverySection = p
                    if (p) {
                      showScheduleDeliverySection = false
                      // Initialize form with today's date
                      initDateField(deliveryConfirmForm, 'actualDeliveryDate')
                    }
                  }"
                  class="outcome-toggle-item"
                >
                  <i class="fa-solid fa-calendar-check"></i>
                  <span>Confirm Delivery</span>
                </Toggle>
              </div>
              
              <!-- Reopen Opportunity Button -->
              <Button
                variant="outline"
                @click="handleReopen"
                class="inline-flex items-center gap-2 cursor-pointer"
              >
                <i class="fa-solid fa-rotate-left"></i>
                <span>Reopen Opportunity</span>
              </Button>
              
              <!-- Secondary Actions Dropdown -->
              <SecondaryActionsDropdown
                v-if="filteredSecondaryActions.length > 0"
                :actions="filteredSecondaryActions"
                @action-selected="handleSecondaryAction"
              />
            </div>
          </div>
          </div>
        </div>
        
        <div class="px-4 py-4 space-y-4">
        <!-- Schedule Delivery Section -->
        <div v-if="showScheduleDeliverySection">
          <div class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
            <h5 class="font-semibold text-foreground text-sm mb-4">Schedule Delivery</h5>
            
            <div class="space-y-4">
              <!-- Delivery Date -->
              <div>
                <Label class="block text-sm font-medium text-muted-foreground mb-2">Delivery Date <span class="text-red-600">*</span></Label>
                <Input 
                  type="date"
                  v-model="deliveryScheduleForm.deliveryDate"
                  :min="minDeliveryDate"
                  class="w-full"
                />
              </div>
              
              <!-- Delivery Time -->
              <div>
                <Label class="block text-sm font-medium text-muted-foreground mb-2">Time (Optional)</Label>
                <Input 
                  type="time"
                  v-model="deliveryScheduleForm.deliveryTime"
                  class="w-full"
                />
              </div>
              
              <!-- Delivery Location -->
              <div>
                <Label class="block text-sm font-medium text-muted-foreground mb-2">Delivery Location</Label>
                <Select v-model="deliveryScheduleForm.deliveryLocation">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select location..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dealership">At Dealership</SelectItem>
                    <SelectItem value="Customer Address">Customer Address</SelectItem>
                    <SelectItem value="Other">Other Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <!-- Notes -->
              <div>
                <Label class="block text-sm font-medium text-muted-foreground mb-2">Notes (Optional)</Label>
                <Textarea 
                  v-model="deliveryScheduleForm.notes"
                  rows="4"
                  placeholder="Add any relevant delivery details..."
                  class="w-full"
                />
              </div>
            </div>
          </div>
          
          <!-- Schedule Delivery Buttons -->
          <div class="flex justify-end gap-2 mt-4">
            <Button
              variant="secondary"
              @click="handleCancelScheduleDelivery"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              :disabled="!canSubmitScheduleDelivery"
              @click="handleConfirmScheduleDelivery"
            >
              Schedule Delivery
            </Button>
          </div>
        </div>
        
        <!-- Confirm Delivery Section -->
        <div v-if="showConfirmDeliverySection">
          <div class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
            <h5 class="font-semibold text-foreground text-sm mb-4">Confirm Delivery</h5>
            <p class="text-sm text-muted-foreground mb-4">
              Delivery was scheduled for {{ formatDateTime(opportunity.deliveryDate) }}. Confirm that the delivery has been completed.
            </p>
            <div class="space-y-4">
              <!-- Delivery Date (read-only, showing scheduled date) -->
              <div>
                <Label class="block text-sm font-medium text-muted-foreground mb-2">Scheduled Delivery Date</Label>
                <Input 
                  type="text"
                  :value="formatDateTime(opportunity.deliveryDate)"
                  disabled
                  class="w-full"
                />
              </div>
              
              <!-- Actual Delivery Date -->
              <div>
                <Label class="block text-sm font-medium text-muted-foreground mb-2">Actual Delivery Date <span class="text-red-600">*</span></Label>
                <Input 
                  type="date"
                  v-model="deliveryConfirmForm.actualDeliveryDate"
                  :max="maxDeliveryDate"
                  class="w-full"
                />
              </div>
              
              <!-- Delivery Time -->
              <div>
                <Label class="block text-sm font-medium text-muted-foreground mb-2">Time (Optional)</Label>
                <Input 
                  type="time"
                  v-model="deliveryConfirmForm.deliveryTime"
                  class="w-full"
                />
              </div>
              
              <!-- Delivery Location -->
              <div>
                <Label class="block text-sm font-medium text-muted-foreground mb-2">Delivery Location</Label>
                <Select v-model="deliveryConfirmForm.deliveryLocation">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select location..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dealership">At Dealership</SelectItem>
                    <SelectItem value="Customer Address">Customer Address</SelectItem>
                    <SelectItem value="Other">Other Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <!-- Notes -->
              <div>
                <Label class="block text-sm font-medium text-muted-foreground mb-2">Delivery Notes (Optional)</Label>
                <Textarea 
                  v-model="deliveryConfirmForm.notes"
                  rows="4"
                  placeholder="Add any relevant delivery details, customer feedback, etc..."
                  class="w-full"
                />
              </div>
            </div>
          </div>
          
          <!-- Confirm Delivery Buttons -->
          <div class="flex justify-end gap-2 mt-4">
            <Button
              variant="secondary"
              @click="handleCancelConfirmDelivery"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              :disabled="!canSubmitConfirmDelivery"
              @click="handleConfirmDelivery"
            >
              Mark as Delivered
            </Button>
          </div>
        </div>
        
        <!-- Reschedule Delivery Section -->
        <div v-if="showRescheduleDeliverySection">
          <div class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
            <h5 class="font-semibold text-foreground text-sm mb-4">Reschedule Delivery</h5>
            <p class="text-sm text-muted-foreground mb-4">
              Current delivery scheduled for {{ formatDateTime(opportunity.deliveryDate) }}. Update the delivery date and time.
            </p>
            <div class="space-y-4">
              <!-- Delivery Date -->
              <div>
                <Label class="block text-sm font-medium text-muted-foreground mb-2">New Delivery Date <span class="text-red-600">*</span></Label>
                <Input 
                  type="date"
                  v-model="deliveryRescheduleForm.deliveryDate"
                  :min="minDeliveryDate"
                  class="w-full"
                />
              </div>
              
              <!-- Delivery Time -->
              <div>
                <Label class="block text-sm font-medium text-muted-foreground mb-2">Time (Optional)</Label>
                <Input 
                  type="time"
                  v-model="deliveryRescheduleForm.deliveryTime"
                  class="w-full"
                />
              </div>
              
              <!-- Delivery Location -->
              <div>
                <Label class="block text-sm font-medium text-muted-foreground mb-2">Delivery Location</Label>
                <Select v-model="deliveryRescheduleForm.deliveryLocation">
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select location..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dealership">At Dealership</SelectItem>
                    <SelectItem value="Customer Address">Customer Address</SelectItem>
                    <SelectItem value="Other">Other Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <!-- Notes -->
              <div>
                <Label class="block text-sm font-medium text-muted-foreground mb-2">Notes (Optional)</Label>
                <Textarea 
                  v-model="deliveryRescheduleForm.notes"
                  rows="4"
                  placeholder="Add reason for rescheduling or any relevant details..."
                  class="w-full"
                />
              </div>
            </div>
          </div>
          
          <!-- Reschedule Delivery Buttons -->
          <div class="flex justify-end gap-2 mt-4">
            <Button
              variant="secondary"
              @click="handleCancelRescheduleDelivery"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              :disabled="!canSubmitRescheduleDelivery"
              @click="handleConfirmRescheduleDelivery"
            >
              Reschedule Delivery
            </Button>
          </div>
        </div>
        
        <!-- Complete Checklist Section -->
        <div v-if="showCompleteChecklistSection" class="px-4 py-4">
          <div class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
            <h5 class="font-semibold text-foreground text-sm mb-4">Complete Delivery Checklist</h5>
            <p class="text-sm text-muted-foreground mb-4">
              Complete the post-delivery checklist to finalize the delivery process.
            </p>
            <div class="space-y-4">
              <!-- Checklist Items -->
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <input type="checkbox" id="checklist-vehicle" v-model="checklistItems.vehicleInspected" class="rounded border-gray-300" />
                  <Label for="checklist-vehicle" class="text-sm text-foreground cursor-pointer">Vehicle inspected and in good condition</Label>
                </div>
                <div class="flex items-center gap-3">
                  <input type="checkbox" id="checklist-documents" v-model="checklistItems.documentsProvided" class="rounded border-gray-300" />
                  <Label for="checklist-documents" class="text-sm text-foreground cursor-pointer">All documents provided to customer</Label>
                </div>
                <div class="flex items-center gap-3">
                  <input type="checkbox" id="checklist-payment" v-model="checklistItems.paymentReceived" class="rounded border-gray-300" />
                  <Label for="checklist-payment" class="text-sm text-foreground cursor-pointer">Payment received and processed</Label>
                </div>
                <div class="flex items-center gap-3">
                  <input type="checkbox" id="checklist-warranty" v-model="checklistItems.warrantyExplained" class="rounded border-gray-300" />
                  <Label for="checklist-warranty" class="text-sm text-foreground cursor-pointer">Warranty and service information explained</Label>
                </div>
                <div class="flex items-center gap-3">
                  <input type="checkbox" id="checklist-keys" v-model="checklistItems.keysHandedOver" class="rounded border-gray-300" />
                  <Label for="checklist-keys" class="text-sm text-foreground cursor-pointer">Keys and accessories handed over</Label>
                </div>
              </div>
              
              <!-- Additional Notes -->
              <div>
                <Label class="block text-sm font-medium text-muted-foreground mb-2">Additional Notes (Optional)</Label>
                <Textarea 
                  v-model="checklistNotes"
                  rows="4"
                  placeholder="Add any additional notes or observations..."
                  class="w-full"
                />
              </div>
            </div>
          </div>
          
          <!-- Complete Checklist Buttons -->
          <div class="flex justify-end gap-2 mt-4">
            <Button
              variant="secondary"
              @click="handleCancelCompleteChecklist"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              :disabled="!canSubmitChecklist"
              @click="handleConfirmCompleteChecklist"
            >
              Complete Checklist
            </Button>
          </div>
        </div>
        </div>
      </div>

      <!-- Closed Lost Management Section -->
      <div
        v-if="isClosedLost"
        class="rounded-lg flex flex-col bg-muted"
      >
        <div class="pt-1 px-1">
          <div
            class="bg-white rounded-lg shadow-nsc-card overflow-visible"
          >
          <div class="p-6">
            <div class="mb-3">
              <h4 class="font-bold text-foreground text-sm">Opportunity Closed as Lost</h4>
              <p class="text-sm text-muted-foreground mt-0.5">
                This opportunity was closed as lost. You can reopen it to continue the sales process or requalify it as a lead.
              </p>
              <!-- Loss Reason Display - Always shown -->
              <div class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div class="flex items-start gap-2">
                  <i class="fa-solid fa-info-circle text-red-600 text-sm mt-0.5"></i>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-red-900">Reason for Closing</p>
                    <p class="text-sm text-red-700 mt-1">{{ opportunity.lossReason || 'No reason provided' }}</p>
                    <p v-if="opportunity.lossNotes" class="text-sm text-red-600 mt-2">{{ opportunity.lossNotes }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap gap-3 items-center">
              <div class="outcome-toggle-group flex flex-wrap gap-3">
                <Toggle
                  variant="outline"
                  :model-value="showReopenSection"
                  @update:model-value="(p) => (showReopenSection = p)"
                  class="outcome-toggle-item"
                >
                  <i class="fa-solid fa-rotate-left"></i>
                  <span>Reopen Opportunity</span>
                </Toggle>
              </div>
              
              <!-- Secondary Actions Dropdown -->
              <SecondaryActionsDropdown
                v-if="filteredSecondaryActions.length > 0"
                :actions="filteredSecondaryActions"
                @action-selected="handleSecondaryAction"
              />
            </div>
          </div>
          </div>
        </div>
        
        <div class="px-4 py-4 space-y-4">
          <!-- Reopen Confirmation Section -->
          <div v-if="showReopenSection">
            <div class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
              <h5 class="font-semibold text-foreground text-sm mb-4">Reopen Opportunity</h5>
              <p class="text-sm text-muted-foreground mb-4">
                Reopening this opportunity will restore it to an active state. The opportunity will return to the appropriate stage based on its current state (e.g., if it has offers, it will return to "In Negotiation").
              </p>
              <div class="flex justify-end gap-2 pt-3">
                <Button
                  variant="secondary"
                  @click="showReopenSection = false"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  @click="handleReopen"
                >
                  Reopen Opportunity
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Standalone Inline Offer Section (when NegotiationManagementSection is not shown) -->
      <div v-if="showStandaloneOfferSection && !isInNegotiation && !opportunityState.isClosed.value" class="space-y-4">
        <div class="bg-white rounded-lg shadow-nsc-card overflow-hidden p-6">
          <h5 class="font-semibold text-foreground text-sm mb-4">Create Offer</h5>
          
          <OfferWidget
            ref="standaloneOfferWidgetRef"
            :task-id="opportunity.id"
            :task-type="'opportunity'"
            :customer="opportunity.customer"
            :selected-vehicle="opportunity.selectedVehicle || opportunity.vehicle || opportunity.requestedCar"
            hide-header
            hide-actions
            @save="handleStandaloneOfferCreated"
            @cancel="handleCancelStandaloneOffer"
          />
        </div>
        
        <!-- Standalone Offer Buttons -->
        <div class="flex justify-end gap-2">
          <Button
            variant="secondary"
            @click="handleCancelStandaloneOffer"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            :disabled="!canCreateStandaloneOffer"
            @click="handleConfirmStandaloneOffer"
          >
            Create Offer
          </Button>
        </div>
      </div>

      <!-- Inline Close as Lost Section -->
      <!-- Only show if AppointmentManagementSection is not visible (it handles its own close as lost) -->
      <CloseAsLostCard
        v-if="showCloseAsLostSection && !opportunityState.isClosed.value && !(scheduledAppointment && scheduledAppointment.start) && !(isContractPending)"
        ref="closeAsLostCardRef"
        :preselected-reason="closeAsLostReason"
        :preselected-notes="closeAsLostNotes"
        @cancel="handleCancelCloseAsLost"
        @confirm="handleConfirmCloseAsLost"
      />

      <!-- Regular Task Widgets -->
      <div v-else-if="opportunityState.activeTaskWidget.value && opportunityState.activeTaskWidget.value.component" class="space-y-3">
        <component
          :is="opportunityState.activeTaskWidget.value.component"
          v-bind="opportunityState.activeTaskWidget.value.props"
          @close="handleTaskWidgetClose"
          @auto-close-lost="handleAutoCloseLost"
          @survey-submitted="handleTaskWidgetSurveySubmitted"
          @survey-cancelled="handleTaskWidgetClose"
          @postpone="handleTaskPostpone"
          @reschedule-delivery="handleRescheduleDeliveryFromTask"
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

    <!-- PDF Generation Modals -->
    <PDFGenerationModal
      v-if="showPDFGenerationModal"
      :show="showPDFGenerationModal"
      :opportunity-id="opportunity.id"
      :document-type="pdfGenerationDocumentType"
      :offer-id="pdfGenerationOfferId"
      :available-offers="availableOffersForPDF"
      :customer="opportunity.customer"
      @close="showPDFGenerationModal = false"
      @generate="handlePDFGenerate"
      @preview="handlePDFPreview"
      @send="handlePDFSend"
    />

    <PDFPreviewModal
      v-if="showPDFPreviewModal"
      :show="showPDFPreviewModal"
      :pdf-url="previewPDFUrl"
      :pdf-id="previewPDFId"
      :loading="isPreviewingPDF"
      :error="pdfPreviewError"
      @close="showPDFPreviewModal = false"
      @regenerate="handlePDFRegenerate"
      @download="handlePDFDownload"
      @email="handlePDFEmail"
      @print="handlePDFPrint"
    />

  <CreateContractModal
    v-if="showCreateContractModal"
    :show="showCreateContractModal"
    :max-contract-date="maxContractDate"
    @confirm="handleConfirmCreateContractFromModal"
    @cancel="closeCreateContractModal"
  />

  <CreateOfferModal
    v-if="showCreateOfferModal"
    :show="showCreateOfferModal"
    :opportunity="opportunity"
    @confirm="handleOfferCreatedFromModal"
    @cancel="closeCreateOfferModal"
  />

  <PostponeTaskDialog
    :show="showPostponeTaskDialog"
    :task-type="postponeTaskType || ''"
    @close="handlePostponeTaskCancel"
    @confirm="handlePostponeTaskConfirm"
  />

  <EditExpectedCloseDateModal
    :show="showEditExpectedCloseDateModal"
    :opportunity="opportunity"
    @close="handleCancelExtendExpectedCloseDate"
    @confirm="handleExtendExpectedCloseDate"
  />

  <EmailPDFModal
    v-if="showEmailPDFModal"
      :show="showEmailPDFModal"
      :pdf-id="emailPDFId"
      :recipient-email="emailRecipient"
      :default-subject="emailSubject"
      @close="showEmailPDFModal = false"
      @sent="handlePDFEmailSent"
    />

  <!-- Archive Confirmation Dialog -->
  <Dialog v-if="showArchiveConfirm">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Archive Opportunity</DialogTitle>
        <DialogDescription>
          Are you sure you want to archive this opportunity? This action will mark it as completed and archived.
        </DialogDescription>
      </DialogHeader>
      <div class="flex justify-end gap-2 mt-4">
        <Button
          variant="secondary"
          @click="showArchiveConfirm = false"
        >
          Cancel
        </Button>
        <Button
          variant="default"
          @click="handleArchiveOpportunity"
        >
          Archive
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, computed, onMounted, toRef, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Button, Label, Textarea, Input, Toggle, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@motork/component-library/future/primitives'
import { SelectMenu } from '@motork/component-library/future/components'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useUsersStore } from '@/stores/users'
import { useUserStore } from '@/stores/user'
import { fetchVehicles } from '@/api/vehicles'
import { getDisplayStage, OPPORTUNITY_STAGES } from '@/utils/stageMapper'
import { formatDateTime } from '@/utils/formatters'
import { initDateField, getTodayDateString } from '@/utils/formHelpers'
import { useOpportunityActions } from '@/composables/useOpportunityActions'
import { useLQWidgetCall } from '@/composables/useLQWidgetCall'
import { useContractPDF } from '@/composables/useContractPDF'
import { useCloseAsLost } from '@/composables/useCloseAsLost'
import { createCalendarEvent } from '@/api/calendar'
import { ChevronDown } from 'lucide-vue-next'

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
import CloseAsLostCard from '@/components/shared/CloseAsLostCard.vue'
import RequalifyAsLeadModal from '@/components/modals/RequalifyAsLeadModal.vue'
import ComingSoonModal from '@/components/modals/ComingSoonModal.vue'
import QuickViewEventModal from '@/components/modals/QuickViewEventModal.vue'
import EditEventModal from '@/components/modals/EditEventModal.vue'
import PDFGenerationModal from '@/components/modals/PDFGenerationModal.vue'
import PDFPreviewModal from '@/components/modals/PDFPreviewModal.vue'
import EmailPDFModal from '@/components/modals/EmailPDFModal.vue'
import CallInterface from '@/components/tasks/lead/CallInterface.vue'
import PostponeTaskDialog from '@/components/tasks/shared/PostponeTaskDialog.vue'
import EditExpectedCloseDateModal from '@/components/tasks/opportunity/EditExpectedCloseDateModal.vue'
import OpportunityScheduleForm from '@/components/tasks/opportunity/OpportunityScheduleForm.vue'
import NS1Task from '@/components/tasks/opportunity/NS1Task.vue'
import NS2Task from '@/components/tasks/opportunity/NS2Task.vue'
import NS3Task from '@/components/tasks/opportunity/NS3Task.vue'
import OfferAssignmentTask from '@/components/tasks/opportunity/OfferAssignmentTask.vue'
import OfferCarousel from '@/components/shared/OfferCarousel.vue'
import ContractCarousel from '@/components/shared/ContractCarousel.vue'
import AppointmentManagementSection from '@/components/tasks/opportunity/AppointmentManagementSection.vue'
import NegotiationManagementSection from '@/components/tasks/opportunity/NegotiationManagementSection.vue'
import ContractPendingManagementSection from '@/components/tasks/opportunity/ContractPendingManagementSection.vue'
import CreateContractModal from '@/components/modals/CreateContractModal.vue'
import CreateOfferModal from '@/components/modals/CreateOfferModal.vue'

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

// Computed opportunity for template use (uses store if available, otherwise props)
const opportunity = computed(() => getCurrentOpportunity())

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

// Check if appointment is today (same day)
const isAppointmentToday = computed(() => {
  if (!scheduledAppointment.value || !scheduledAppointment.value.start) return false
  const appointmentDate = new Date(scheduledAppointment.value.start)
  const today = new Date()
  
  // Compare year, month, and day only (ignore time)
  return appointmentDate.getFullYear() === today.getFullYear() &&
         appointmentDate.getMonth() === today.getMonth() &&
         appointmentDate.getDate() === today.getDate()
})

// Customer name and profile URL
const customerName = computed(() => {
  if (props.opportunity.customer) {
    return typeof props.opportunity.customer === 'string' 
      ? props.opportunity.customer 
      : props.opportunity.customer.name
  }
  return 'Customer'
})

const customerProfileUrl = computed(() => {
  const customerId = props.opportunity.customerId || 
                     (props.opportunity.customer && typeof props.opportunity.customer === 'object' 
                      ? props.opportunity.customer.id 
                      : null)
  if (customerId) {
    return router.resolve(`/customer/${customerId}`).href
  }
  return '#'
})

const handleCustomerClick = (event) => {
  event.preventDefault()
  const customerId = props.opportunity.customerId || 
                     (props.opportunity.customer && typeof props.opportunity.customer === 'object' 
                      ? props.opportunity.customer.id 
                      : null)
  if (customerId) {
    window.open(router.resolve(`/customer/${customerId}`).href, '_blank')
  }
}

// Check if opportunity is Closed Won
const isClosedWon = computed(() => {
  const opp = props.opportunity
  const displayStage = opportunityState.displayStage.value
  return opp.stage === 'Closed Won' || displayStage === 'Closed Won'
})

// Convert contract data to array format for carousel
const contracts = computed(() => {
  const opp = props.opportunity
  // If contracts is already an array with items, use it
  if (Array.isArray(opp.contracts) && opp.contracts.length > 0) {
    return opp.contracts
  }
  if (!opp.contractDate) return []
  // Otherwise, convert single contract data to array format
  return [{
    id: opp.id || `contract-${opp.contractDate}`,
    contractDate: opp.contractDate,
    contractNotes: opp.contractNotes,
    contractSigned: opp.contractSigned,
    esignatureCollectedDate: opp.esignatureCollectedDate,
    version: opp.contractVersion || 1,
    status: opp.contractSigned || opp.esignatureCollectedDate ? 'signed' : 'active'
  }]
})

// Check if opportunity is Closed Lost
const isClosedLost = computed(() => {
  const opp = props.opportunity
  const displayStage = opportunityState.displayStage.value
  return opp.stage === 'Closed Lost' || displayStage === 'Closed Lost'
})

// Show Delivery Management for Closed Won opportunities (when not delivered yet)
const shouldShowDeliveryManagement = computed(() => {
  // Don't show for Closed Lost
  if (isClosedLost.value) return false
  
  // Only show for Closed Won opportunities that are not yet delivered
  if (!isClosedWon.value) return false
  
  // Show if deliverySubstatus is null (None) or 'Awaiting Delivery', but not 'Delivered'
  const deliverySubstatus = props.opportunity.deliverySubstatus
  return deliverySubstatus !== 'Delivered'
})

// Computed properties for delivery management
const hasDeliveryDate = computed(() => {
  return !!props.opportunity.deliveryDate
})

const isDelivered = computed(() => {
  return props.opportunity.deliverySubstatus === 'Delivered'
})

const deliveryManagementTitle = computed(() => {
  if (!hasDeliveryDate.value) {
    return 'Schedule Delivery'
  }
  return 'Confirm Delivery'
})

const deliveryManagementDescription = computed(() => {
  if (!hasDeliveryDate.value) {
    return 'Contract signed! Schedule vehicle delivery with the customer'
  }
  return 'Delivery scheduled. Confirm that the delivery has been completed'
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

// Template refs - now accessed through appointmentManagementSectionRef
const appointmentManagementSectionRef = ref(null)
const scheduleFormRef = computed(() => appointmentManagementSectionRef.value?.scheduleFormRef)

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

// Template refs for child task components - accessed through section refs
// appointmentManagementSectionRef is declared earlier in the file (line 913)
const negotiationManagementSectionRef = ref(null)
const contractPendingManagementSectionRef = ref(null)
const ns1TaskRef = computed(() => appointmentManagementSectionRef.value?.ns1TaskRef)
const ns2TaskRef = computed(() => appointmentManagementSectionRef.value?.ns2TaskRef)
const ns3TaskRef = computed(() => appointmentManagementSectionRef.value?.ns3TaskRef)
const offerAssignmentTaskRef = computed(() => appointmentManagementSectionRef.value?.offerAssignmentTaskRef)
const addOfferWidgetRef = computed(() => negotiationManagementSectionRef.value?.addOfferWidgetRef)

// In Negotiation section state
const showNegotiationSection = ref(false)
const showAddOfferSection = ref(false)
const showSurveySection = ref(false)
const showStandaloneOfferSection = ref(false)
const negotiationChannel = ref(null)
const negotiationMessage = ref('')
const negotiationSelectedOfferId = ref(null)
// addOfferWidgetRef is now accessed through negotiationManagementSectionRef

// Delivery Management section state
const showScheduleDeliverySection = ref(false)
const showConfirmDeliverySection = ref(false)
const showRescheduleDeliverySection = ref(false)
const showCompleteChecklistSection = ref(false)
const showArchiveConfirm = ref(false)
const deliveryScheduleForm = ref({
  deliveryDate: '',
  deliveryTime: '',
  deliveryLocation: '',
  notes: ''
})
const deliveryConfirmForm = ref({
  actualDeliveryDate: '',
  deliveryTime: '',
  deliveryLocation: '',
  notes: ''
})
const deliveryRescheduleForm = ref({
  deliveryDate: '',
  deliveryTime: '',
  deliveryLocation: '',
  notes: ''
})
const checklistItems = ref({
  vehicleInspected: false,
  documentsProvided: false,
  paymentReceived: false,
  warrantyExplained: false,
  keysHandedOver: false
})
const checklistNotes = ref('')

// Closed Lost section state
const showReopenSection = ref(false)
const showCloseAsLostSection = ref(false)
const { reason: closeAsLostReason, notes: closeAsLostNotes, cardRef: closeAsLostCardRef, reset: resetCloseAsLost } = useCloseAsLost()

// Dropdown visibility states
const showSecondaryActionsDropdown = ref(false)
const showSecondaryActionsDropdownNegotiation = ref(false)
const showContractPendingDropdown = ref(false)

// Contract Pending Management section state
const showAddOfferContractPendingSection = ref(false)
const showScheduleAppointmentContractPendingSection = ref(false)
const showSetDeliveryDateSection = ref(false)

// Contract Pending form data
const deliveryDateForm = ref({
  deliveryDate: '',
  deliveryTime: '',
  deliveryLocation: '',
  notes: ''
})

// Template refs - accessed through contractPendingManagementSectionRef
// contractPendingManagementSectionRef is declared earlier (line 1039)
const addOfferContractPendingRef = computed(() => contractPendingManagementSectionRef.value?.addOfferContractPendingRef)
const scheduleAppointmentContractPendingFormRef = computed(() => contractPendingManagementSectionRef.value?.scheduleAppointmentContractPendingFormRef)

const contractPendingActions = computed(() => {
  const actions = []
  if (!hasOffers.value) {
    actions.push({
      key: 'add-offer',
      label: 'Add offer',
      handler: () => handleAddOfferContractPending()
    })
  }
  actions.push(
    {
      key: 'close-as-lost',
      label: 'Close as Lost',
      handler: () => {
        showAddOfferContractPendingSection.value = false
        showScheduleAppointmentContractPendingSection.value = false
        showSetDeliveryDateSection.value = false
        showCloseAsLostSection.value = true
        resetCloseAsLost()
      }
    },
    {
      key: 'schedule-appointment',
      label: 'Schedule appointment',
      handler: () => handleScheduleAppointmentContractPending()
    }
  )
  return actions
})

// Menu items for dropdowns
const secondaryActionsMenuItems = computed(() => {
  return (opportunityState.secondaryActions.value || []).map(action => ({
    key: action.key,
    label: action.label,
    disabled: !!action.disabled,
    onClick: () => {
      showSecondaryActionsDropdown.value = false
      showSecondaryActionsDropdownNegotiation.value = false
      handleSecondaryAction(action)
    }
  }))
})

const contractPendingMenuItems = computed(() => {
  return (contractPendingActions.value || []).map(action => ({
    key: action.key,
    label: action.label,
    disabled: !!action.disabled,
    onClick: () => {
      showContractPendingDropdown.value = false
      if (action.handler) {
        action.handler()
      }
    }
  }))
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
    return 1
  }
  // Otherwise use the actual count
  return currentCount
})

// NS Task validation
const canSubmitNsTask = computed(() => {
  const taskRefs = {
    1: ns1TaskRef,
    2: ns2TaskRef,
    3: ns3TaskRef
  }
  const ref = taskRefs[nsTaskCount.value]
  return ref?.value?.canSubmit || false
})

const nsTaskButtonLabel = computed(() => {
  if (nsTaskCount.value === 3) return 'Close as Lost'
  return 'Assign and Save'
})

// Offer assignment validation
const canCreateOffer = computed(() => {
  return offerAssignmentTaskRef?.value?.canSubmit || false
})

// In Negotiation computed properties
const offerSelectOptions = computed(() => {
  const opp = opportunity.value
  if (!opp?.offers || opp.offers.length === 0) return []
  
  return opp.offers
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

const showContractDateModal = ref(false)
const showDeliveryModal = ref(false)
const showRequalifyModal = ref(false)
const showVehicleSelectionModal = ref(false)
const showComingSoonModal = ref(false)
const showViewAppointment = ref(false)
const showEditAppointment = ref(false)
const recommendedCars = ref([])

// PDF Generation state
const showPDFGenerationModal = ref(false)
const showCreateContractModal = ref(false)
const showCreateOfferModal = ref(false)
const showPDFPreviewModal = ref(false)
const showEmailPDFModal = ref(false)
const showPostponeTaskDialog = ref(false)
const postponeTaskType = ref(null)
const showEditExpectedCloseDateModal = ref(false)
// Expected close date menu moved to TaskDetailHeader
const pdfGenerationDocumentType = ref(null) // 'contract' | 'offer' | null
const pdfGenerationOfferId = ref(null)
const previewPDFUrl = ref(null)
const previewPDFId = ref(null)
const isPreviewingPDF = ref(false)
const pdfPreviewError = ref(null)
const emailPDFId = ref(null)
const emailRecipient = ref('')
const emailSubject = ref('Contract/Offer Document')

// Helper function for formatting currency
function formatCurrency(value) {
  if (!value) return '0'
  return new Intl.NumberFormat('en-US').format(value)
}


function openPostponeExpectedCloseModal() {
  showEditExpectedCloseDateModal.value = true
}

// Expose function for TaskDetailHeader to call
defineExpose({
  openPostponeExpectedCloseModal
})

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
    if (!props.opportunity.selectedVehicle && !props.opportunity.vehicle && !props.opportunity.requestedCar) {
      showVehicleSelectionModal.value = true
    } else {
      // Show inline offer form
      if (isInNegotiation.value) {
        // Use NegotiationManagementSection's inline form
        showAddOfferSection.value = true
        showNegotiationSection.value = false
        showSurveySection.value = false
      } else {
        // Show standalone inline offer section
        showStandaloneOfferSection.value = true
      }
    }
  },
  'call-prospect': () => { showComingSoonModal.value = true },
  'follow-up-offer': () => { showComingSoonModal.value = true },
  'request-decision': () => { showComingSoonModal.value = true },
  'finalize-contract': () => { showContractDateModal.value = true },
  'schedule-delivery': () => { 
    if (shouldShowDeliveryManagement.value) {
      showScheduleDeliverySection.value = true
      showConfirmDeliverySection.value = false
      // Initialize form with today's date
      initDateField(deliveryScheduleForm, 'deliveryDate')
    }
  },
  'confirm-delivery': () => { 
    if (shouldShowDeliveryManagement.value) {
      showConfirmDeliverySection.value = true
      showScheduleDeliverySection.value = false
      // Initialize form with today's date
      initDateField(deliveryConfirmForm, 'actualDeliveryDate')
    }
  },
  'collect-feedback': () => { showComingSoonModal.value = true },
  'reschedule': () => { showEditAppointment.value = true },
  'cancel-appointment': () => {
    handleCancelAppointment()
  },
  'close-won': () => { showContractDateModal.value = true },
  'add-offer': () => {
    // Always show inline offer form
    if (isInNegotiation.value) {
      // Use NegotiationManagementSection's inline form
      showAddOfferSection.value = true
      showNegotiationSection.value = false
    } else {
      // Show standalone inline offer section
      showStandaloneOfferSection.value = true
    }
  },
  'add-contract': () => { showContractDateModal.value = true },
  'create-contract': () => { openCreateContractModal() },
  'extend-deadline': () => { showComingSoonModal.value = true },
  'close-lost': () => { 
    showCloseAsLostSection.value = true
    resetCloseAsLost()
  },
  'reopen': () => { handleReopen() },
  'requalify': () => { showRequalifyModal.value = true },
  'reschedule-delivery': () => {
    if (isClosedWon.value && hasDeliveryDate.value) {
      showRescheduleDeliverySection.value = true
      showScheduleDeliverySection.value = false
      showConfirmDeliverySection.value = false
      // Initialize form with current delivery date
      if (props.opportunity.deliveryDate) {
        const deliveryDate = new Date(props.opportunity.deliveryDate)
        deliveryRescheduleForm.value.deliveryDate = deliveryDate.toISOString().split('T')[0]
        deliveryRescheduleForm.value.deliveryTime = deliveryDate.toTimeString().slice(0, 5)
        deliveryRescheduleForm.value.deliveryLocation = props.opportunity.deliveryLocation || ''
        deliveryRescheduleForm.value.notes = props.opportunity.deliveryNotes || ''
      }
    }
  },
  'complete-checklist': () => {
    if (isClosedWon.value && isDelivered.value) {
      showCompleteChecklistSection.value = true
    }
  },
  'archive': () => {
    if (isClosedWon.value && isDelivered.value) {
      showArchiveConfirm.value = true
    }
  }
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
      // For closed opportunities, we show them in dedicated sections, not as primary action widget
      if (opportunityActions.isClosed.value) {
        return null
      }
      return opportunityActions.primaryAction.value
    }),
    secondaryActions: computed(() => {
      const baseActions = opportunityActions.secondaryActions.value || []
      
      // Filter out "close-lost" if already closed as lost
      const filteredActions = baseActions.filter(action => {
        if (action.key === 'close-lost' && isClosedLost.value) {
          return false
        }
        return true
      })
      
      // Only add "close-lost" if not present and not already closed as lost
      const hasCloseAsLost = filteredActions.some(action => action.key === 'close-lost')
      
      if (!hasCloseAsLost && !isClosedLost.value) {
        return [
          ...filteredActions,
          {
            key: 'close-lost',
            label: 'Close as Lost',
            handler: () => {
              showCloseAsLostSection.value = true
              resetCloseAsLost()
            }
          }
        ]
      }
      
      return filteredActions
    }),
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
    return getDisplayStage(props.opportunity, 'opportunity')
  }),
  showDeadlineBanner: computed(() => {
    // Show deadline banner if opportunity has nextActionDue and is not closed
    return !opportunityActions.isClosed.value && !!props.opportunity?.nextActionDue
  })
}

// Check if opportunity is in In Negotiation stage (Offer Sent substatus)
// Defined after opportunityActions to avoid circular dependency
const isInNegotiation = computed(() => {
  const opp = props.opportunity
  if (!opp) return false
  
  // Check if closed
  if (opportunityActions.isClosed.value) return false
  
  // Must be in In Negotiation stage
  if (opp.stage !== 'In Negotiation') return false
  
  // Exclude Contract Pending
  const displayStage = opportunityState.displayStage.value
  if (displayStage === 'In Negotiation - Contract Pending') return false
  
  return true
})

const isContractPending = computed(() => {
  return opportunityState.displayStage.value === 'In Negotiation - Contract Pending'
})

// Computed property for hasOffers to avoid reactivity issues
const hasOffers = computed(() => {
  return props.opportunity?.offers && Array.isArray(props.opportunity.offers) && props.opportunity.offers.length > 0
})

// More actions: hide "Create offer" / "Add offer" when at least one offer exists
const filteredSecondaryActions = computed(() => {
  const base = opportunityState.secondaryActions.value || []
  if (!hasOffers.value) return base
  return base.filter(a => a.key !== 'add-offer' && a.key !== 'create-offer')
})

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

function handleTaskWidgetSurveySubmitted(data) {
  // Survey submission is already handled in DFBTask component
  // This is just for any additional handling if needed
}


async function handleSurveySubmitted(data) {
  try {
    const { opportunity, surveyData } = data
    const { responses } = surveyData
    
    // Save survey as activity
    await opportunitiesStore.addActivity(opportunity.id, {
      type: 'offer-feedback-survey',
      user: userStore.currentUser?.name || 'You',
      action: 'completed offer feedback survey',
      content: 'Offer Feedback Survey completed',
      data: {
        responses,
        timestamp: surveyData.timestamp
      },
      timestamp: surveyData.timestamp
    })
    
    // Handle next steps based on survey response (send-revised-offer, close-opportunity, follow-up-later)
    // TODO: wire up offer creation, opportunity closure, or follow-up date

    // Close the survey section
    showSurveySection.value = false
  } catch (error) {
    console.error('Failed to submit survey:', error)
  }
}

function handleSurveyCancelled(data) {
  // Just close the survey section
  showSurveySection.value = false
}

async function handleTaskPostpone(taskType) {
  postponeTaskType.value = taskType.toLowerCase()
  showPostponeTaskDialog.value = true
}

async function handlePostponeTaskConfirm(data) {
  try {
    const opp = getCurrentOpportunity()
    const postponedTasks = opp.postponedTasks || {}
    postponedTasks[data.taskType] = data.dateTime
    
    await opportunitiesStore.updateOpportunity(opp.id, {
      postponedTasks: postponedTasks
    })
    
    // Create activity log
    await opportunitiesStore.addActivity(opp.id, {
      type: 'task-postponed',
      user: userStore.currentUser?.name || 'You',
      action: 'postponed task',
      content: `Task ${data.taskType.toUpperCase()} postponed to ${new Date(data.dateTime).toLocaleString()}${data.reason ? `: ${data.reason}` : ''}`,
      data: {
        taskType: data.taskType,
        dateTime: data.dateTime,
        reason: data.reason
      },
      timestamp: new Date().toISOString()
    })
    
    showPostponeTaskDialog.value = false
    postponeTaskType.value = null
  } catch (error) {
    console.error('Failed to postpone task:', error)
  }
}

function handlePostponeTaskCancel() {
  showPostponeTaskDialog.value = false
  postponeTaskType.value = null
}

async function handleExtendExpectedCloseDate(data) {
  try {
    const opp = getCurrentOpportunity()
    
    await opportunitiesStore.updateOpportunity(opp.id, {
      expectedCloseDate: data.expectedCloseDate
    })
    
    // Create activity log
    await opportunitiesStore.addActivity(opp.id, {
      type: 'expected-close-date-extension',
      user: userStore.currentUser?.name || 'You',
      action: 'extended expected close date',
      content: `Expected close date extended to ${new Date(data.expectedCloseDate).toLocaleDateString()}${data.reason ? `: ${data.reason}` : ''}`,
      data: {
        expectedCloseDate: data.expectedCloseDate,
        reason: data.reason
      },
      timestamp: new Date().toISOString()
    })
    
    showEditExpectedCloseDateModal.value = false
  } catch (error) {
    console.error('Failed to extend expected close date:', error)
  }
}

function handleCancelExtendExpectedCloseDate() {
  showEditExpectedCloseDateModal.value = false
}

function handleVehicleSelected(vehicleData) {
  showVehicleSelectionModal.value = false
  emit('vehicle-selected', vehicleData)
  
  // After vehicle selected, show inline offer form
  setTimeout(() => {
    if (isInNegotiation.value) {
      showAddOfferSection.value = true
      showNegotiationSection.value = false
    } else {
      showStandaloneOfferSection.value = true
    }
  }, 300)
}

function handleOfferCreated(offerData) {
  emit('offer-created', offerData)
}

// Standalone offer handlers
const standaloneOfferWidgetRef = ref(null)

const canCreateStandaloneOffer = computed(() => {
  return standaloneOfferWidgetRef.value?.isValid || false
})

function handleCancelStandaloneOffer() {
  showStandaloneOfferSection.value = false
}

function handleConfirmStandaloneOffer() {
  if (standaloneOfferWidgetRef.value) {
    standaloneOfferWidgetRef.value.submit()
  }
}

async function handleStandaloneOfferCreated(offerPayload) {
  try {
    const opp = opportunity.value
    // Add offer to opportunity
    await opportunitiesStore.addOffer(opp.id, {
      vehicleBrand: offerPayload.data?.brand || '',
      vehicleModel: offerPayload.data?.model || '',
      vehicleYear: offerPayload.data?.year || '',
      price: offerPayload.data?.price || 0,
      data: offerPayload.data
    })
    
    // Add activity for offer creation
    await opportunitiesStore.addActivity(opp.id, {
      type: 'offer',
      user: userStore.currentUser?.name || 'You',
      action: 'created an offer',
      content: `Offer created: ${offerPayload.data?.brand} ${offerPayload.data?.model} (${offerPayload.data?.year}) - € ${(offerPayload.data?.price || 0).toLocaleString()}`,
      data: offerPayload.data,
      timestamp: new Date().toISOString()
    })
    
    // Close the section
    showStandaloneOfferSection.value = false
    emit('offer-created', offerPayload)
  } catch (error) {
    console.error('Failed to create offer:', error)
  }
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

async function handleDelivered(deliveryData) {
  showDeliveryModal.value = false
  
  try {
    const opp = getCurrentOpportunity()
    
    // Update opportunity with delivery date and set substatus to 'Delivered'
    await opportunitiesStore.updateOpportunity(opp.id, {
      deliveryDate: deliveryData.deliveryDate,
      deliverySubstatus: 'Delivered',
      actualDeliveryDate: deliveryData.deliveryDate,
      deliveryLocation: deliveryData.location,
      deliveryNotes: deliveryData.notes
    })
    
    // Log delivery activity
    await opportunitiesStore.addActivity(opp.id, {
      type: 'delivery',
      user: userStore.currentUser?.name || 'You',
      action: 'marked as delivered',
      content: `Delivery confirmed on ${new Date(deliveryData.deliveryDate).toLocaleString()} at ${deliveryData.location || 'N/A'}`,
      data: deliveryData,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to mark as delivered:', error)
  }
}

// Delivery Management handlers
function handleCancelScheduleDelivery() {
  showScheduleDeliverySection.value = false
  deliveryScheduleForm.value = {
    deliveryDate: '',
    deliveryTime: '',
    deliveryLocation: '',
    notes: ''
  }
}

async function handleConfirmScheduleDelivery() {
  if (!canSubmitScheduleDelivery.value) return
  
  try {
    const opp = getCurrentOpportunity()
    const datetime = deliveryScheduleForm.value.deliveryTime 
      ? `${deliveryScheduleForm.value.deliveryDate}T${deliveryScheduleForm.value.deliveryTime}:00`
      : `${deliveryScheduleForm.value.deliveryDate}T12:00:00`
    
    const isContractPending = getDisplayStage(opp, 'opportunity') === 'In Negotiation - Contract Pending'
    
    // Update opportunity with delivery date
    const updates = {
      deliveryDate: datetime,
      deliveryLocation: deliveryScheduleForm.value.deliveryLocation,
      deliveryNotes: deliveryScheduleForm.value.notes
    }
    
    // Track delivery date set date for Contract Pending
    if (isContractPending && !opp.deliveryDateSetDate) {
      updates.deliveryDateSetDate = new Date().toISOString()
    }
    
    // Set substatus to 'Awaiting Delivery' only if already Closed Won
    if (opp.stage === 'Closed Won') {
      updates.deliverySubstatus = 'Awaiting Delivery'
    }
    
    await opportunitiesStore.updateOpportunity(opp.id, updates)
    
    // Add activity
    await opportunitiesStore.addActivity(opp.id, {
      type: 'delivery-scheduled',
      user: userStore.currentUser?.name || 'You',
      action: isContractPending ? 'set delivery date (step 1 of 2)' : 'scheduled delivery',
      content: `Delivery scheduled for ${new Date(datetime).toLocaleString()} at ${deliveryScheduleForm.value.deliveryLocation}`,
      data: {
        deliveryDate: datetime,
        location: deliveryScheduleForm.value.deliveryLocation,
        notes: deliveryScheduleForm.value.notes,
        step: isContractPending ? 1 : null,
        totalSteps: isContractPending ? 2 : null
      },
      timestamp: new Date().toISOString()
    })
    
    // Close section and reset form
    handleCancelScheduleDelivery()
  } catch (error) {
    console.error('Failed to schedule delivery:', error)
  }
}

function handleCancelConfirmDelivery() {
  showConfirmDeliverySection.value = false
  deliveryConfirmForm.value = {
    actualDeliveryDate: '',
    deliveryTime: '',
    deliveryLocation: '',
    notes: ''
  }
}

function handleCancelRescheduleDelivery() {
  showRescheduleDeliverySection.value = false
  deliveryRescheduleForm.value = {
    deliveryDate: '',
    deliveryTime: '',
    deliveryLocation: '',
    notes: ''
  }
}

async function handleConfirmRescheduleDelivery() {
  if (!canSubmitRescheduleDelivery.value) return
  
  try {
    const opp = getCurrentOpportunity()
    const datetime = deliveryRescheduleForm.value.deliveryTime 
      ? `${deliveryRescheduleForm.value.deliveryDate}T${deliveryRescheduleForm.value.deliveryTime}:00`
      : `${deliveryRescheduleForm.value.deliveryDate}T12:00:00`
    
    // Update opportunity with rescheduled delivery date
    await opportunitiesStore.updateOpportunity(opp.id, {
      deliveryDate: datetime,
      deliveryLocation: deliveryRescheduleForm.value.deliveryLocation,
      deliveryNotes: deliveryRescheduleForm.value.notes
    })
    
    // Add activity
    await opportunitiesStore.addActivity(opp.id, {
      type: 'delivery',
      user: userStore.currentUser?.name || 'You',
      action: 'rescheduled delivery',
      content: `Delivery rescheduled to ${new Date(datetime).toLocaleString()} at ${deliveryRescheduleForm.value.deliveryLocation}. Previous date: ${formatDateTime(opp.deliveryDate)}`,
      data: {
        newDeliveryDate: datetime,
        previousDeliveryDate: opp.deliveryDate,
        location: deliveryRescheduleForm.value.deliveryLocation,
        notes: deliveryRescheduleForm.value.notes
      },
      timestamp: new Date().toISOString()
    })
    
    // Close section and reset form
    handleCancelRescheduleDelivery()
  } catch (error) {
    console.error('Failed to reschedule delivery:', error)
  }
}

function handleCancelCompleteChecklist() {
  showCompleteChecklistSection.value = false
  checklistItems.value = {
    vehicleInspected: false,
    documentsProvided: false,
    paymentReceived: false,
    warrantyExplained: false,
    keysHandedOver: false
  }
  checklistNotes.value = ''
}

async function handleConfirmCompleteChecklist() {
  if (!canSubmitChecklist.value) return
  
  try {
    const opp = getCurrentOpportunity()
    
    // Add activity for completed checklist
    await opportunitiesStore.addActivity(opp.id, {
      type: 'delivery',
      user: userStore.currentUser?.name || 'You',
      action: 'completed delivery checklist',
      content: `Delivery checklist completed. Items checked: ${Object.values(checklistItems.value).filter(v => v).length}/5${checklistNotes.value ? `. Notes: ${checklistNotes.value}` : ''}`,
      data: {
        checklistItems: checklistItems.value,
        notes: checklistNotes.value,
        completedAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    })
    
    // Close section and reset form
    handleCancelCompleteChecklist()
  } catch (error) {
    console.error('Failed to complete checklist:', error)
  }
}

async function handleArchiveOpportunity() {
  try {
    const opp = getCurrentOpportunity()
    
    // Add activity
    await opportunitiesStore.addActivity(opp.id, {
      type: 'note',
      user: userStore.currentUser?.name || 'You',
      action: 'archived opportunity',
      content: 'Opportunity archived after successful delivery completion',
      timestamp: new Date().toISOString()
    })
    
    // Mark opportunity as archived (you may want to add an archived field to the opportunity model)
    // For now, we'll just add a note. In a real system, you'd update a status field
    showArchiveConfirm.value = false
    // Could show a success message here
  } catch (error) {
    console.error('Failed to archive opportunity:', error)
  }
}

async function handleConfirmDelivery() {
  if (!canSubmitConfirmDelivery.value) return
  
  try {
    const opp = getCurrentOpportunity()
    const datetime = deliveryConfirmForm.value.deliveryTime 
      ? `${deliveryConfirmForm.value.actualDeliveryDate}T${deliveryConfirmForm.value.deliveryTime}:00`
      : `${deliveryConfirmForm.value.actualDeliveryDate}T12:00:00`
    
    // Update opportunity with actual delivery date and set substatus to 'Delivered'
    await opportunitiesStore.updateOpportunity(opp.id, {
      deliveryDate: datetime,
      deliverySubstatus: 'Delivered',
      actualDeliveryDate: datetime,
      deliveryLocation: deliveryConfirmForm.value.deliveryLocation,
      deliveryNotes: deliveryConfirmForm.value.notes
    })
    
    // Add activity
    await opportunitiesStore.addActivity(opp.id, {
      type: 'delivery',
      user: userStore.currentUser?.name || 'You',
      action: 'confirmed delivery',
      content: `Delivery confirmed on ${new Date(datetime).toLocaleString()} at ${deliveryConfirmForm.value.deliveryLocation}`,
      data: {
        actualDeliveryDate: datetime,
        scheduledDeliveryDate: opp.deliveryDate,
        location: deliveryConfirmForm.value.deliveryLocation,
        notes: deliveryConfirmForm.value.notes
      },
      timestamp: new Date().toISOString()
    })
    
    // Close section and reset form
    handleCancelConfirmDelivery()
  } catch (error) {
    console.error('Failed to confirm delivery:', error)
  }
}

function handleClosedLost(data) {
  // Handle both object format { reason, notes } and string format
  const reason = typeof data === 'string' ? data : data.reason || data
  const notes = typeof data === 'object' ? data.notes : ''
  
  opportunitiesStore.updateOpportunity(props.opportunity.id, {
    stage: 'Closed Lost',
    lossReason: reason,
    lossNotes: notes
  })
}

// Inline close as lost handlers
function handleCancelCloseAsLost() {
  showCloseAsLostSection.value = false
  resetCloseAsLost()
}

async function handleConfirmCloseAsLost(data) {
  try {
    await handleClosedLost({
      reason: data.reason,
      notes: data.notes
    })
    
    // Add activity
    await opportunitiesStore.addActivity(props.opportunity.id, {
      type: 'close-lost',
      user: userStore.currentUser?.name || 'You',
      action: 'closed opportunity as lost',
      content: `Opportunity closed as lost. Reason: ${data.reason}${data.notes ? `. Notes: ${data.notes}` : ''}`,
      data: {
        reason: data.reason,
        notes: data.notes
      },
      timestamp: new Date().toISOString()
    })
    
    handleCancelCloseAsLost()
  } catch (error) {
    console.error('Failed to close opportunity as lost:', error)
  }
}

// Handle close as lost from AppointmentManagementSection inline form
async function handleCloseAsLostFromAppointment(data) {
  try {
    await handleClosedLost({
      reason: data.reason,
      notes: data.notes
    })
    
    // Add activity
    await opportunitiesStore.addActivity(props.opportunity.id, {
      type: 'close-lost',
      user: userStore.currentUser?.name || 'You',
      action: 'closed opportunity as lost',
      content: `Opportunity closed as lost. Reason: ${data.reason}${data.notes ? `. Notes: ${data.notes}` : ''}`,
      data: {
        reason: data.reason,
        notes: data.notes
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to close opportunity as lost:', error)
  }
}

async function handleReopen() {
  const opp = getCurrentOpportunity()
  const wasClosedWon = opp.stage === 'Closed Won'
  const hasOffers = opp.offers && opp.offers.length > 0
  
  // Close the reopen section if it's open
  showReopenSection.value = false
  
  // Determine target stage and negotiation substatus
  let targetStage = 'Qualified'
  let negotiationSubstatus = null
  
  if (hasOffers) {
    targetStage = 'In Negotiation'
    const mostRecentOffer = opp.offers
      .filter(o => o.status === 'active')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
    
    // All offers now start as "Offer Sent"
    negotiationSubstatus = 'Offer Sent'
  }
  
  // If Closed Won, prevent task re-triggering
  if (wasClosedWon) {
    await opportunitiesStore.updateOpportunity(opp.id, {
      stage: targetStage,
      negotiationSubstatus: negotiationSubstatus,
      skipTaskReTrigger: true
    })
    
    // Clear flag after 2 seconds (allows UI to update without re-triggering)
    setTimeout(async () => {
      await opportunitiesStore.updateOpportunity(opp.id, {
        skipTaskReTrigger: false
      })
    }, 2000)
  } else {
    // Closed Lost - normal reopen (task rules will naturally re-trigger based on stage)
    await opportunitiesStore.updateOpportunity(opp.id, {
      stage: targetStage,
      negotiationSubstatus: negotiationSubstatus
    })
  }
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

// NS Assignment handler (called from NS1/NS2/NS3 components)
function handleNsAssigned({ opportunity, assignee, note }) {
  // Assignment is already handled in NS1/NS2/NS3 components
  // This is just for any additional handling if needed
}

// Handle confirm NS task
function handleConfirmNsTask() {
  const taskRefs = { 1: ns1TaskRef, 2: ns2TaskRef, 3: ns3TaskRef }
  const ref = taskRefs[nsTaskCount.value]
  ref?.value?.submit()
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
    const opp = opportunity.value
    await opportunitiesStore.addOffer(opp.id, {
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
  offerAssignmentTaskRef?.value?.submit()
}

// Handle cancel offer assignment
function handleCancelOfferAssignment() {
  showOfferAssignmentSection.value = false
}

// In Negotiation handlers
function handleFollowUpOffer() {
  // Show negotiation section, hide others (mutually exclusive)
  showRescheduleSection.value = false
  showNsTaskSection.value = false
  showOfferAssignmentSection.value = false
  showAddOfferSection.value = false
  showSurveySection.value = false
  showNegotiationSection.value = !showNegotiationSection.value
  
  // Reset form if closing
  if (!showNegotiationSection.value) {
    negotiationChannel.value = null
    negotiationMessage.value = ''
    negotiationSelectedOfferId.value = null
  }
}

function handleAddAnotherOffer() {
  // Show add offer section, hide others (mutually exclusive)
  showRescheduleSection.value = false
  showNsTaskSection.value = false
  showOfferAssignmentSection.value = false
  showNegotiationSection.value = false
  showSurveySection.value = false
  showAddOfferSection.value = !showAddOfferSection.value
}

const offerCarouselRef = ref(null)
const contractCarouselRef = ref(null)


async function handleOfferDeleted(offer) {
  
  try {
    const opp = opportunity.value
    await opportunitiesStore.deleteOffer(opp.id, offer.id)
    
    // Add activity for offer deletion
    await opportunitiesStore.addActivity(opp.id, {
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

async function handleOfferActivated(offer) {
  const opp = getCurrentOpportunity()
  
  try {
    await opportunitiesStore.activateOffer(opp.id, offer.id)
    
    // Add activity for offer activation
    await opportunitiesStore.addActivity(opp.id, {
      type: 'offer-activation',
      user: userStore.currentUser?.name || 'You',
      action: 'activated offer',
      content: `Offer activated: ${offer.vehicleBrand} ${offer.vehicleModel} (${offer.vehicleYear})`,
      data: { offerId: offer.id },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to activate offer:', error)
    alert('Failed to activate offer. Please try again.')
  } finally {
    // Clear loading state for all offers (since activation affects multiple offers)
    if (opp.offers) {
      opp.offers.forEach(o => {
        offerCarouselRef.value?.setOfferLoading(o.id, false)
      })
    }
  }
}

function handleViewOffer(offer) {
  // TODO: Open offer detail modal (Coming Soon)
  showComingSoonModal.value = true
}

async function handleSendNegotiationMessage() {
  if (!canSendNegotiationMessage.value) return
  
  try {
    const opp = opportunity.value
    // Add activity for communication
    const selectedOffer = opp?.offers?.find(o => o.id === negotiationSelectedOfferId.value)
    const offerReference = selectedOffer 
      ? `${selectedOffer.vehicleBrand} ${selectedOffer.vehicleModel} (€${selectedOffer.price.toLocaleString()})`
      : 'offer'
    
    await opportunitiesStore.addActivity(opp.id, {
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
  return addOfferWidgetRef?.value?.isValid || false
})

async function handleInlineOfferCreated(offerPayload) {
  
  try {
    const opp = opportunity.value
    // Add offer to opportunity
    await opportunitiesStore.addOffer(opp.id, {
      vehicleBrand: offerPayload.data?.brand || '',
      vehicleModel: offerPayload.data?.model || '',
      vehicleYear: offerPayload.data?.year || '',
      price: offerPayload.data?.price || 0,
      data: offerPayload.data
    })
    
    // Add activity for offer creation
    await opportunitiesStore.addActivity(opp.id, {
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
  if (addOfferWidgetRef?.value) {
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

// Contract Pending Management handlers
// Computed properties for form validation
const maxContractDate = computed(() => {
  return getTodayDateString()
})

const canSubmitSetDeliveryDate = computed(() => {
  return !!deliveryDateForm.value.deliveryDate && !!deliveryDateForm.value.deliveryLocation
})

const canCreateInlineOfferContractPending = computed(() => {
  return addOfferContractPendingRef.value?.isValid || false
})

// Delivery Management computed properties
const minDeliveryDate = computed(() => {
  return getTodayDateString()
})

const maxDeliveryDate = computed(() => {
  return getTodayDateString()
})

const canSubmitScheduleDelivery = computed(() => {
  return !!deliveryScheduleForm.value.deliveryDate && !!deliveryScheduleForm.value.deliveryLocation
})

const canSubmitConfirmDelivery = computed(() => {
  return !!deliveryConfirmForm.value.actualDeliveryDate && !!deliveryConfirmForm.value.deliveryLocation
})

const canSubmitRescheduleDelivery = computed(() => {
  return !!deliveryRescheduleForm.value.deliveryDate && !!deliveryRescheduleForm.value.deliveryLocation
})

const canSubmitChecklist = computed(() => {
  // At least one checklist item must be checked
  return Object.values(checklistItems.value).some(v => v === true)
})

function openCreateContractModal() {
  showCreateContractModal.value = true
}

function closeCreateContractModal() {
  showCreateContractModal.value = false
}

function openCreateOfferModal() {
  showCreateOfferModal.value = true
}

function closeCreateOfferModal() {
  showCreateOfferModal.value = false
}

async function handleOfferCreatedFromModal(offerPayload) {
  if (!offerPayload?.data) return
  try {
    const opp = opportunity.value
    await opportunitiesStore.addOffer(opp.id, {
      vehicleBrand: offerPayload.data?.brand || '',
      vehicleModel: offerPayload.data?.model || '',
      vehicleYear: offerPayload.data?.year || '',
      price: offerPayload.data?.price || 0,
      data: offerPayload.data
    })
    await opportunitiesStore.addActivity(opp.id, {
      type: 'offer',
      user: userStore.currentUser?.name || 'You',
      action: 'created an offer',
      content: `Offer created: ${offerPayload.data?.brand} ${offerPayload.data?.model} (${offerPayload.data?.year}) - € ${(offerPayload.data?.price || 0).toLocaleString()}`,
      data: offerPayload.data,
      timestamp: new Date().toISOString()
    })
    closeCreateOfferModal()
  } catch (error) {
    console.error('Failed to create offer:', error)
  }
}

async function handleConfirmCreateContractFromModal(payload) {
  if (!payload?.contractDate) return
  try {
    const opp = getCurrentOpportunity()
    await opportunitiesStore.addContract(opp.id, {
      contractDate: payload.contractDate,
      contractTime: payload.contractTime,
      notes: payload.notes
    })
    const datetime = payload.contractTime
      ? `${payload.contractDate}T${payload.contractTime}:00`
      : `${payload.contractDate}T12:00:00`
    await opportunitiesStore.addActivity(opp.id, {
      type: 'contract',
      user: userStore.currentUser?.name || 'You',
      action: 'created a contract',
      content: `Contract created: ${new Date(datetime).toLocaleString()}`,
      data: { contractDate: datetime, notes: payload.notes },
      timestamp: new Date().toISOString()
    })
    closeCreateContractModal()
  } catch (error) {
    console.error('Failed to create contract:', error)
  }
}

// Add Offer
function handleAddOfferContractPending() {
  showCloseAsLostSection.value = false
  showScheduleAppointmentContractPendingSection.value = false
  showSetDeliveryDateSection.value = false
  showAddOfferContractPendingSection.value = !showAddOfferContractPendingSection.value
}

function handleCancelAddOfferContractPending() {
  showAddOfferContractPendingSection.value = false
}

function handleConfirmAddOfferContractPending() {
  if (addOfferContractPendingRef?.value) {
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

// Schedule Appointment
function handleScheduleAppointmentContractPending() {
  showAddOfferContractPendingSection.value = false
  showCloseAsLostSection.value = false
  showSetDeliveryDateSection.value = false
  showScheduleAppointmentContractPendingSection.value = !showScheduleAppointmentContractPendingSection.value
}

function handleCancelSetDeliveryDate() {
  showSetDeliveryDateSection.value = false
  deliveryDateForm.value = {
    deliveryDate: '',
    deliveryTime: '',
    deliveryLocation: '',
    notes: ''
  }
}

async function handleConfirmSetDeliveryDate() {
  if (!canSubmitSetDeliveryDate.value) return
  
  try {
    const opp = getCurrentOpportunity()
    const datetime = deliveryDateForm.value.deliveryTime 
      ? `${deliveryDateForm.value.deliveryDate}T${deliveryDateForm.value.deliveryTime}:00`
      : `${deliveryDateForm.value.deliveryDate}T12:00:00`
    
    // Update opportunity with delivery date
    const updates = {
      deliveryDate: datetime,
      deliveryLocation: deliveryDateForm.value.deliveryLocation,
      deliveryNotes: deliveryDateForm.value.notes
    }
    
    // Track delivery date set date for Contract Pending
    if (!opp.deliveryDateSetDate) {
      updates.deliveryDateSetDate = new Date().toISOString()
    }
    
    await opportunitiesStore.updateOpportunity(opp.id, updates)
    
    // Add activity
    await opportunitiesStore.addActivity(opp.id, {
      type: 'delivery-scheduled',
      user: userStore.currentUser?.name || 'You',
      action: 'set delivery date (step 1 of 2)',
      content: `Delivery scheduled for ${new Date(datetime).toLocaleString()} at ${deliveryDateForm.value.deliveryLocation}`,
      data: {
        deliveryDate: datetime,
        location: deliveryDateForm.value.deliveryLocation,
        notes: deliveryDateForm.value.notes,
        step: 1,
        totalSteps: 2
      },
      timestamp: new Date().toISOString()
    })
    
    handleCancelSetDeliveryDate()
  } catch (error) {
    console.error('Failed to set delivery date:', error)
  }
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


// Close as Lost (contract pending - now uses inline section)
function handleCloseAsLostContractPending(data) {
  // This is now handled by handleConfirmCloseAsLost
  // Keeping for backward compatibility but redirecting to inline handler
  handleConfirmCloseAsLost()
}

function handleRescheduleAppointment() {
  if (!scheduledAppointment.value || !scheduledAppointment.value.start) return
  showRescheduleSection.value = true
  showNsTaskSection.value = false
  showOfferAssignmentSection.value = false
}

function handleMarkNoShow() {
  if (!scheduledAppointment.value) {
    return
  }

  // Show NS task section, hide others (mutually exclusive)
  showRescheduleSection.value = false
  showOfferAssignmentSection.value = false
  showNsTaskSection.value = true

  // Update appointment status to no-show if not already marked (async, but don't wait)
  if (scheduledAppointment.value.status !== 'no-show') {
    updateAppointmentToNoShow()
  }
}

// Handle mark as showed up
function handleMarkShowedUp() {
  if (!scheduledAppointment.value) {
    return
  }

  // Show offer assignment section, hide others (mutually exclusive)
  showRescheduleSection.value = false
  showNsTaskSection.value = false
  showOfferAssignmentSection.value = true
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
      // Keep the existing stage (Qualified)
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
  // You can add activity or update opportunity here
}

function handleNsSurveyRefused({ opportunity }) {
  // Handle survey refusal
}

function handleNsNotResponding({ opportunity }) {
  // Handle not responding
}

function handleAutoCloseLost({ opportunity, reason }) {
  showCloseAsLostSection.value = true
  resetCloseAsLost()
  if (reason) {
    closeAsLostReason.value = reason
  }
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

// PDF Generation handlers
const { 
  generateContractPDF: generateContractPDFComposable, 
  generateOfferPDF: generateOfferPDFComposable, 
  previewContractPDF: previewContractPDFComposable, 
  previewOfferPDF: previewOfferPDFComposable,
  downloadPDF: downloadPDFComposable,
  sendPDFByEmail: sendPDFByEmailComposable,
  isLoading: isPDFLoading
} = useContractPDF()

const availableOffersForPDF = computed(() => {
  const opp = opportunity.value
  if (!opp?.offers || !Array.isArray(opp.offers)) return []
  return opp.offers.filter(o => o.status === 'active' || !o.status)
})

function openPDFGenerationModal(documentType = null, offerId = null) {
  pdfGenerationDocumentType.value = documentType
  pdfGenerationOfferId.value = offerId
  showPDFGenerationModal.value = true
}

async function handlePDFGenerate(payload) {
  try {
    let pdfInfo
    if (payload.type === 'contract') {
      pdfInfo = await generateContractPDFComposable(payload.opportunityId, payload.options)
    } else {
      pdfInfo = await generateOfferPDFComposable(payload.opportunityId, payload.offerId, payload.options)
    }
    // Show preview after generation
    previewPDFUrl.value = pdfInfo.url
    previewPDFId.value = pdfInfo.id
    showPDFGenerationModal.value = false
    showPDFPreviewModal.value = true
  } catch (err) {
    console.error('Error generating PDF:', err)
    pdfPreviewError.value = err.message || 'Failed to generate PDF'
  }
}

async function handlePDFPreview(payload) {
  isPreviewingPDF.value = true
  pdfPreviewError.value = null
  
  try {
    let previewInfo
    if (payload.type === 'contract') {
      previewInfo = await previewContractPDFComposable(payload.opportunityId, payload.options)
    } else {
      previewInfo = await previewOfferPDFComposable(payload.opportunityId, payload.offerId, payload.options)
    }
    previewPDFUrl.value = previewInfo.previewUrl
    previewPDFId.value = null // Preview doesn't have permanent ID
    showPDFGenerationModal.value = false
    showPDFPreviewModal.value = true
  } catch (err) {
    console.error('Error previewing PDF:', err)
    pdfPreviewError.value = err.message || 'Failed to preview PDF'
  } finally {
    isPreviewingPDF.value = false
  }
}

async function handlePDFSend(payload) {
  try {
    // Generate PDF first
    let pdfInfo
    if (payload.type === 'offer') {
      pdfInfo = await generateOfferPDFComposable(payload.opportunityId, payload.offerId, payload.options)
    } else {
      pdfInfo = await generateContractPDFComposable(payload.opportunityId, payload.options)
    }
    
    // Send PDF by email
    await sendPDFByEmailComposable({
      pdfId: pdfInfo.id,
      email: payload.email,
      message: payload.message || '',
      opportunityId: payload.opportunityId
    })
    
    // Close modal and show success
    showPDFGenerationModal.value = false
    
    // Add activity
    await opportunitiesStore.addActivity(payload.opportunityId, {
      type: 'communication',
      user: userStore.currentUser?.name || 'You',
      action: 'sent offer PDF',
      content: `Offer PDF sent to ${payload.email}${payload.message ? `. Message: ${payload.message}` : ''}`,
      data: {
        email: payload.email,
        message: payload.message,
        pdfId: pdfInfo.id,
        offerId: payload.offerId
      },
      timestamp: new Date().toISOString()
    })
    
    // Could show a success toast here
  } catch (err) {
    console.error('Error sending PDF:', err)
    pdfPreviewError.value = err.message || 'Failed to send PDF'
  }
}

function handlePDFRegenerate() {
  showPDFPreviewModal.value = false
  showPDFGenerationModal.value = true
}

async function handlePDFDownload(pdfId) {
  if (pdfId) {
    try {
      await downloadPDFComposable(pdfId)
    } catch (err) {
      console.error('Error downloading PDF:', err)
      pdfPreviewError.value = err.message || 'Failed to download PDF'
    }
  }
}

function handlePDFEmail(payload) {
  emailPDFId.value = payload.pdfId
  emailRecipient.value = opportunity.value?.customer?.email || ''
  emailSubject.value = `${pdfGenerationDocumentType.value === 'contract' ? 'Contract' : 'Offer'} Document`
  showPDFPreviewModal.value = false
  showEmailPDFModal.value = true
}

function handlePDFPrint() {
  // Print is handled in the modal component
}

function handlePDFEmailSent(payload) {
  showEmailPDFModal.value = false
  // Could show a success toast here
}

function handleOfferPDFGenerate(offer) {
  openPDFGenerationModal('offer', offer.id)
}

function handleContractPDFGenerate(contract) {
  openPDFGenerationModal('contract')
}

async function handleCollectESignaturesFromContract(data) {
  try {
    const opp = props.opportunity
    const contract = data.contract || data
    const formData = data.formData || {}
    
    // Update opportunity with e-signature collection
    const updates = {
      contractSigned: true
    }
    
    // Use form data if provided, otherwise use current date
    if (formData.contractDate) {
      updates.contractDate = formData.contractDate
    }
    
    if (!opp.esignatureCollectedDate) {
      updates.esignatureCollectedDate = formData.contractDate || new Date().toISOString()
    }
    
    if (formData.notes) {
      updates.contractNotes = formData.notes
    }
    
    await opportunitiesStore.updateOpportunity(opp.id, updates)
    
    // Add activity
    await opportunitiesStore.addActivity(opp.id, {
      type: 'contract',
      user: userStore.currentUser?.name || 'You',
      action: 'collected e-signatures',
      content: `E-signatures collected for contract${contract.version ? ` v${contract.version}` : ''}`,
      data: {
        contractDate: formData.contractDate || contract.contractDate || opp.contractDate,
        contractVersion: contract.version,
        esignatureCollectedDate: updates.esignatureCollectedDate,
        notes: formData.notes
      },
      timestamp: new Date().toISOString()
    })
    
    // Clear loading state in carousel
    if (contractCarouselRef.value) {
      contractCarouselRef.value.setContractLoading(contract.id || contract.contractDate, false)
    }
  } catch (error) {
    console.error('Failed to collect e-signatures:', error)
    // Clear loading state on error
    const contract = data.contract || data
    if (contractCarouselRef.value) {
      contractCarouselRef.value.setContractLoading(contract.id || contract.contractDate, false)
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

