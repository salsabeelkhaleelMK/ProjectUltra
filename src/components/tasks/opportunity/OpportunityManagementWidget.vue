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
        :secondary-actions="opportunityState.secondaryActions.value || []"
        :format-date-time="formatDateTime"
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
        @customer-click="handleCustomerClick"
      />
      
      <!-- In Negotiation Management Section (exclude Contract Pending / Offer Accepted) -->
      <NegotiationManagementSection
        v-if="isInNegotiation"
        ref="negotiationManagementSectionRef"
        :opportunity="opportunity"
        :show-negotiation-section="showNegotiationSection"
        :show-add-offer-section="showAddOfferSection"
        :negotiation-channel="negotiationChannel"
        :negotiation-message="negotiationMessage"
        :negotiation-selected-offer-id="negotiationSelectedOfferId"
        :offer-select-options="offerSelectOptions"
        :can-send-negotiation-message="canSendNegotiationMessage"
        :can-create-inline-offer="canCreateInlineOffer"
        :secondary-actions="opportunityState.secondaryActions.value || []"
        @update:show-negotiation-section="showNegotiationSection = $event"
        @update:show-add-offer-section="showAddOfferSection = $event"
        @update:negotiation-channel="negotiationChannel = $event"
        @update:negotiation-message="negotiationMessage = $event"
        @update:negotiation-selected-offer-id="negotiationSelectedOfferId = $event"
        @reset-negotiation-form="negotiationChannel = null; negotiationMessage = ''; negotiationSelectedOfferId = null"
        @send-negotiation-message="handleSendNegotiationMessage"
        @cancel-negotiation="handleCancelNegotiation"
        @offer-created="handleInlineOfferCreated"
        @cancel-add-offer="handleCancelAddOffer"
        @confirm-add-offer="handleConfirmAddOffer"
        @offer-accepted="handleOfferAccepted"
        @mark-offer-accepted="handleMarkOfferAccepted"
        @ofb-postpone="handleTaskPostpone"
        @generate-pdf="handleOfferPDFGenerate"
        @secondary-action="handleSecondaryAction"
      />
      
      <!-- Contract Pending Management Section -->
      <ContractPendingManagementSection
        v-if="!opportunityActions.isClosed.value && opportunity.stage === 'In Negotiation' && (opportunity.negotiationSubstatus === 'Offer Accepted' || getDisplayStage(opportunity, 'opportunity') === 'In Negotiation - Contract Pending')"
        ref="contractPendingManagementSectionRef"
        :opportunity="opportunity"
        :show-finalize-contract-section="showFinalizeContractSection"
        :show-add-offer-contract-pending-section="showAddOfferContractPendingSection"
        :show-extend-deadline-section="showExtendDeadlineSection"
        :show-schedule-appointment-contract-pending-section="showScheduleAppointmentContractPendingSection"
        :contract-pending-form="contractPendingForm"
        :extend-deadline-form="extendDeadlineForm"
        :contract-pending-actions="contractPendingActions"
        :can-submit-finalize-contract="canSubmitFinalizeContract"
        :can-submit-extend-deadline="canSubmitExtendDeadline"
        :can-create-inline-offer-contract-pending="canCreateInlineOfferContractPending"
        :max-contract-date="maxContractDate"
        :min-deadline-date="minDeadlineDate"
        @update:show-finalize-contract-section="showFinalizeContractSection = $event"
        @update:show-add-offer-contract-pending-section="showAddOfferContractPendingSection = $event"
        @update:show-extend-deadline-section="showExtendDeadlineSection = $event"
        @update:show-schedule-appointment-contract-pending-section="showScheduleAppointmentContractPendingSection = $event"
        @update:contract-pending-form="contractPendingForm = $event"
        @update:extend-deadline-form="extendDeadlineForm = $event"
        @confirm-finalize-contract="handleConfirmFinalizeContract"
        @cancel-finalize-contract="handleCancelFinalizeContract"
        @offer-created-contract-pending="handleInlineOfferCreatedContractPending"
        @cancel-add-offer-contract-pending="handleCancelAddOfferContractPending"
        @confirm-add-offer-contract-pending="handleConfirmAddOfferContractPending"
        @confirm-extend-deadline="handleConfirmExtendDeadline"
        @cancel-extend-deadline="handleCancelExtendDeadline"
        @schedule-appointment-contract-pending-submit="handleScheduleAppointmentContractPendingSubmit"
        @cancel-schedule-appointment-contract-pending="handleCancelScheduleAppointmentContractPending"
        @contract-pending-action="handleContractPendingAction"
      />
      
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
                      if (!deliveryScheduleForm.value.deliveryDate) {
                        const today = new Date()
                        deliveryScheduleForm.value.deliveryDate = today.toISOString().split('T')[0]
                      }
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
                      if (!deliveryConfirmForm.value.actualDeliveryDate) {
                        const today = new Date()
                        deliveryConfirmForm.value.actualDeliveryDate = today.toISOString().split('T')[0]
                      }
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
                v-if="opportunityState.secondaryActions.value && opportunityState.secondaryActions.value.length > 0"
                :actions="opportunityState.secondaryActions.value"
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
              <!-- Loss Reason Display -->
              <div v-if="opportunity.lossReason" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div class="flex items-start gap-2">
                  <i class="fa-solid fa-info-circle text-red-600 text-sm mt-0.5"></i>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-red-900">Loss Reason</p>
                    <p class="text-sm text-red-700 mt-1">{{ opportunity.lossReason }}</p>
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
                v-if="opportunityState.secondaryActions.value && opportunityState.secondaryActions.value.length > 0"
                :actions="opportunityState.secondaryActions.value"
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

      <!-- Regular Task Widgets -->
      <div v-else-if="opportunityState.activeTaskWidget.value && opportunityState.activeTaskWidget.value.component" class="space-y-3">
        <!-- Task Title Header -->
        <div class="flex items-center gap-2 pb-2 border-b border">
          <i class="fa-solid fa-clipboard-check text-blue-600 text-sm"></i>
          <h5 class="font-semibold text-foreground text-sm">{{ opportunityState.taskWidgetTitle.value }}</h5>
        </div>
        
        <component
          :is="opportunityState.activeTaskWidget.value.component"
          v-bind="opportunityState.activeTaskWidget.value.props"
          @close="handleTaskWidgetClose"
          @set-callback="handleSetCallback"
          @auto-close-lost="handleAutoCloseLost"
          @survey-submitted="handleTaskWidgetSurveySubmitted"
          @survey-cancelled="handleTaskWidgetClose"
          @postpone="handleTaskPostpone"
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

    <!-- PDF Generation Modals -->
    <PDFGenerationModal
      v-if="showPDFGenerationModal"
      :show="showPDFGenerationModal"
      :opportunity-id="opportunity.id"
      :document-type="pdfGenerationDocumentType"
      :offer-id="pdfGenerationOfferId"
      :available-offers="availableOffersForPDF"
      @close="showPDFGenerationModal = false"
      @generate="handlePDFGenerate"
      @preview="handlePDFPreview"
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
</template>

<script setup>
import { ref, computed, onMounted, toRef, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Button, Label, Textarea, Input, DropdownMenu, Toggle, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@motork/component-library/future/primitives'
import { SelectMenu } from '@motork/component-library/future/components'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useUsersStore } from '@/stores/users'
import { useUserStore } from '@/stores/user'
import { fetchVehicles } from '@/api/vehicles'
import { getDisplayStage, OPPORTUNITY_STAGES } from '@/utils/stageMapper'
import { useOpportunityActions } from '@/composables/useOpportunityActions'
import { useLQWidgetCall } from '@/composables/useLQWidgetCall'
import { useContractPDF } from '@/composables/useContractPDF'
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
import AppointmentManagementSection from '@/components/tasks/opportunity/AppointmentManagementSection.vue'
import NegotiationManagementSection from '@/components/tasks/opportunity/NegotiationManagementSection.vue'
import ContractPendingManagementSection from '@/components/tasks/opportunity/ContractPendingManagementSection.vue'

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

// Check if opportunity is Closed Lost
const isClosedLost = computed(() => {
  const opp = props.opportunity
  const displayStage = opportunityState.displayStage.value
  return opp.stage === 'Closed Lost' || displayStage === 'Closed Lost'
})

// Show Delivery Management for Closed Won opportunities (when not delivered yet)
const shouldShowDeliveryManagement = computed(() => {
  const opp = props.opportunity
  const displayStage = opportunityState.displayStage.value
  const isClosedLost = opp.stage === 'Closed Lost' || displayStage === 'Closed Lost'
  
  // Don't show for Closed Lost
  if (isClosedLost) return false
  
  // Only show for Closed Won opportunities that are not yet delivered
  if (!isClosedWon.value) return false
  
  // Show if deliverySubstatus is null (None) or 'Awaiting Delivery', but not 'Delivered'
  const deliverySubstatus = opp.deliverySubstatus
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
const nsCloseReason = ref('')

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
const negotiationChannel = ref(null)
const negotiationMessage = ref('')
const negotiationSelectedOfferId = ref(null)
// addOfferWidgetRef is now accessed through negotiationManagementSectionRef

// Delivery Management section state
const showScheduleDeliverySection = ref(false)
const showConfirmDeliverySection = ref(false)
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

// Closed Lost section state
const showReopenSection = ref(false)

// Dropdown visibility states
const showSecondaryActionsDropdown = ref(false)
const showSecondaryActionsDropdownNegotiation = ref(false)
const showContractPendingDropdown = ref(false)

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
  notes: '',
  autoMarkOfferAccepted: true // Default: checked
})

const extendDeadlineForm = ref({
  newDeadline: '',
  reason: ''
})

// Template refs - accessed through contractPendingManagementSectionRef
// contractPendingManagementSectionRef is declared earlier (line 1039)
const addOfferContractPendingRef = computed(() => contractPendingManagementSectionRef.value?.addOfferContractPendingRef)
const scheduleAppointmentContractPendingFormRef = computed(() => contractPendingManagementSectionRef.value?.scheduleAppointmentContractPendingFormRef)

const contractPendingActions = computed(() => {
  return [
    {
      key: 'generate-pdf',
      label: 'Generate PDF',
      handler: () => openPDFGenerationModal('contract')
    },
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

// PDF Generation state
const showPDFGenerationModal = ref(false)
const showPDFPreviewModal = ref(false)
const showEmailPDFModal = ref(false)
const showPostponeTaskDialog = ref(false)
const postponeTaskType = ref(null)
const showEditExpectedCloseDateModal = ref(false)
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
  'schedule-delivery': () => { 
    if (shouldShowDeliveryManagement.value) {
      showScheduleDeliverySection.value = true
      showConfirmDeliverySection.value = false
      // Initialize form with today's date
      if (!deliveryScheduleForm.value.deliveryDate) {
        const today = new Date()
        deliveryScheduleForm.value.deliveryDate = today.toISOString().split('T')[0]
      }
    }
  },
  'confirm-delivery': () => { 
    if (shouldShowDeliveryManagement.value) {
      showConfirmDeliverySection.value = true
      showScheduleDeliverySection.value = false
      // Initialize form with today's date
      if (!deliveryConfirmForm.value.actualDeliveryDate) {
        const today = new Date()
        deliveryConfirmForm.value.actualDeliveryDate = today.toISOString().split('T')[0]
      }
    }
  },
  'collect-feedback': () => { showComingSoonModal.value = true },
  'reschedule': () => { showEditAppointment.value = true },
  'cancel-appointment': () => {
    handleCancelAppointment()
  },
  'close-won': () => { showContractDateModal.value = true },
  'add-offer': () => { showOfferModal.value = true },
  'add-contract': () => { showContractDateModal.value = true },
  'mark-offer-accepted': () => { handleMarkOfferAccepted() },
  'create-contract': () => { 
    // For Offer Accepted status, show contract creation
    showFinalizeContractSection.value = true
  },
  'extend-deadline': () => { showComingSoonModal.value = true },
  'extend-expected-close-date': () => { showEditExpectedCloseDateModal.value = true },
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
      // For closed opportunities, we show them in dedicated sections, not as primary action widget
      if (opportunityActions.isClosed.value) {
        return null
      }
      return opportunityActions.primaryAction.value
    }),
    secondaryActions: computed(() => {
      // Always include "close as lost" in secondary actions
      const baseActions = opportunityActions.secondaryActions.value || []
      const hasCloseAsLost = baseActions.some(action => action.key === 'close-lost')
      
      if (!hasCloseAsLost && !opportunityActions.isClosed.value) {
        return [
          ...baseActions,
          {
            key: 'close-lost',
            label: 'Close as Lost',
            handler: () => {
              showCloseAsLostModal.value = true
            }
          }
        ]
      }
      return baseActions
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

// Check if opportunity is in In Negotiation stage (any substatus except Offer Accepted)
// Defined after opportunityActions to avoid circular dependency
const isInNegotiation = computed(() => {
  const opp = props.opportunity
  if (!opp) return false
  
  // Check if closed
  if (opportunityActions.isClosed.value) return false
  
  // Must be in In Negotiation stage
  if (opp.stage !== 'In Negotiation') return false
  
  // Exclude Offer Accepted and Contract Pending
  const displayStage = getDisplayStage(opp, 'opportunity')
  if (displayStage === 'In Negotiation - Contract Pending') return false
  if (opp.negotiationSubstatus === 'Offer Accepted') return false
  
  // Include Offer Sent, Offer Under Review (formerly Awaiting Response), Offer Feedback (backward compatibility), and null (which means Offer Sent)
  return true
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
    
    // Update opportunity with delivery date and set substatus to 'Awaiting Delivery'
    await opportunitiesStore.updateOpportunity(opp.id, {
      deliveryDate: datetime,
      deliverySubstatus: 'Awaiting Delivery',
      deliveryLocation: deliveryScheduleForm.value.deliveryLocation,
      deliveryNotes: deliveryScheduleForm.value.notes
    })
    
    // Add activity
    await opportunitiesStore.addActivity(opp.id, {
      type: 'delivery-scheduled',
      user: userStore.currentUser?.name || 'You',
      action: 'scheduled delivery',
      content: `Delivery scheduled for ${new Date(datetime).toLocaleString()} at ${deliveryScheduleForm.value.deliveryLocation}`,
      data: {
        deliveryDate: datetime,
        location: deliveryScheduleForm.value.deliveryLocation,
        notes: deliveryScheduleForm.value.notes
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
  
  showCloseAsLostModal.value = false
  nsCloseReason.value = ''
  opportunitiesStore.updateOpportunity(props.opportunity.id, {
    stage: 'Closed Lost',
    lossReason: reason,
    lossNotes: notes
  })
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
    
    // Check if any offer was accepted
    const hasAcceptedOffer = opp.offers.some(o => o.status === 'accepted')
    
    if (hasAcceptedOffer) {
      negotiationSubstatus = 'Offer Accepted'
    } else if (mostRecentOffer) {
      const daysSinceOffer = Math.ceil((new Date() - new Date(mostRecentOffer.createdAt)) / (1000 * 60 * 60 * 24))
      negotiationSubstatus = daysSinceOffer >= 3 ? 'Offer Under Review' : 'Offer Sent'
    } else {
      negotiationSubstatus = 'Offer Sent'
    }
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

function handleSetCallback({ opportunity, callbackDate }) {
  // Set callback date to transition to "To be Called Back" stage
  opportunitiesStore.updateOpportunity(opportunity.id, {
    callbackDate: callbackDate
  })
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
  showAddOfferSection.value = !showAddOfferSection.value
}

async function handleOfferAccepted(offer) {
  await handleMarkOfferAccepted(offer)
}

async function handleMarkOfferAccepted(offer = null) {
  const opp = getCurrentOpportunity()
  
  // Validation using validation utility
  const { OpportunityValidations } = await import('@/utils/opportunityRules')
  const validation = OpportunityValidations.canMarkOfferAccepted(opp)
  if (!validation.valid) {
    alert(validation.error)
    return
  }
  
  // If no specific offer provided, use the most recent active offer
  let offerToAccept = offer
  if (!offerToAccept) {
    const activeOffers = opp.offers.filter(o => o.status === 'active')
    // Get most recent active offer
    offerToAccept = activeOffers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
  }
  
  try {
    // Mark offer as accepted with metadata
    const metadata = {
      acceptanceMethod: 'manual',
      acceptedByUserId: userStore.currentUser?.id || null
    }
    
    await opportunitiesStore.markOfferAccepted(opp.id, offerToAccept.id, metadata)
    
    // Add activity for offer acceptance
    await opportunitiesStore.addActivity(opp.id, {
      type: 'offer-acceptance',
      user: userStore.currentUser?.name || 'You',
      action: 'accepted offer',
      content: `Offer accepted: ${offerToAccept.vehicleBrand} ${offerToAccept.vehicleModel} (${offerToAccept.vehicleYear}) - € ${offerToAccept.price.toLocaleString()}`,
      data: { 
        offerId: offerToAccept.id,
        acceptanceMethod: 'manual',
        acceptedByUserId: userStore.currentUser?.id
      },
      timestamp: new Date().toISOString()
    })
    
    showNegotiationSection.value = false
  } catch (error) {
    console.error('Failed to mark offer as accepted:', error)
    alert('Failed to mark offer as accepted. Please try again.')
  }
}

async function handleOfferDeleted(offer) {
  
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
  // TODO: Open offer detail modal (Coming Soon)
  showComingSoonModal.value = true
}

async function handleSendNegotiationMessage() {
  if (!canSendNegotiationMessage.value) return
  
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
  return addOfferWidgetRef?.value?.isValid || false
})

async function handleInlineOfferCreated(offerPayload) {
  
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

// Delivery Management computed properties
const minDeliveryDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const maxDeliveryDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const canSubmitScheduleDelivery = computed(() => {
  return !!deliveryScheduleForm.value.deliveryDate && !!deliveryScheduleForm.value.deliveryLocation
})

const canSubmitConfirmDelivery = computed(() => {
  return !!deliveryConfirmForm.value.actualDeliveryDate && !!deliveryConfirmForm.value.deliveryLocation
})

function onFinalizeContractToggle(p) {
  showFinalizeContractSection.value = p
  if (p) {
    showAddOfferContractPendingSection.value = false
    showExtendDeadlineSection.value = false
    showScheduleAppointmentContractPendingSection.value = false
    if (!contractPendingForm.value.contractDate) {
      const today = new Date()
      contractPendingForm.value.contractDate = today.toISOString().split('T')[0]
      contractPendingForm.value.contractTime = today.toTimeString().slice(0, 5)
    }
  }
}

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
    notes: '',
    autoMarkOfferAccepted: true // Reset to default
  }
}

async function handleConfirmFinalizeContract() {
  if (!canSubmitFinalizeContract.value) return
  
  try {
    const opp = getCurrentOpportunity()
    const datetime = contractPendingForm.value.contractTime 
      ? `${contractPendingForm.value.contractDate}T${contractPendingForm.value.contractTime}:00`
      : `${contractPendingForm.value.contractDate}T12:00:00`
    
    // Check if this is a fast deal (contract from Offer Sent directly)
    const isFastDeal = opp.negotiationSubstatus === 'Offer Sent' || opp.negotiationSubstatus === null
    
    // Validation: Check if contract can be created (unless fast deal)
    if (!isFastDeal) {
      const { OpportunityValidations } = await import('@/utils/opportunityRules')
      const validation = OpportunityValidations.canCreateContract(opp, false)
      if (!validation.valid) {
        alert(validation.error)
        return
      }
    }
    
    // Auto-accept offer if checkbox is checked and status is "Offer Under Review" or "Offer Sent" (fast deal path)
    const shouldAutoAccept = contractPendingForm.value.autoMarkOfferAccepted !== false && 
                            (opp.negotiationSubstatus === 'Offer Under Review' || 
                             opp.negotiationSubstatus === 'Awaiting Response' || 
                             opp.negotiationSubstatus === 'Offer Sent' ||
                             opp.negotiationSubstatus === null)
    
    if (shouldAutoAccept && opp.offers && opp.offers.length > 0) {
      // Find most recent active offer
      const activeOffers = opp.offers.filter(o => o.status === 'active')
      if (activeOffers.length > 0) {
        const mostRecentOffer = activeOffers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
        
        // Auto-accept the offer with metadata
        const metadata = {
          acceptanceMethod: 'auto_via_contract',
          acceptedByUserId: userStore.currentUser?.id || null
        }
        
        await opportunitiesStore.markOfferAccepted(opp.id, mostRecentOffer.id, metadata)
        
        // Add activity for auto-acceptance
        await opportunitiesStore.addActivity(opp.id, {
          type: 'offer-acceptance',
          user: userStore.currentUser?.name || 'You',
          action: 'auto-accepted offer via contract creation',
          content: `Offer automatically accepted when creating contract: ${mostRecentOffer.vehicleBrand} ${mostRecentOffer.vehicleModel} (${mostRecentOffer.vehicleYear}) - € ${mostRecentOffer.price.toLocaleString()}`,
          data: { 
            offerId: mostRecentOffer.id,
            acceptanceMethod: 'auto_via_contract',
            contractDate: datetime,
            acceptedByUserId: userStore.currentUser?.id
          },
          timestamp: new Date().toISOString()
        })
      }
    }
    
    // Update opportunity with contract date and auto-transition to Closed Won
    await opportunitiesStore.updateOpportunity(opp.id, {
      contractDate: datetime,
      contractNotes: contractPendingForm.value.notes,
      stage: 'Closed Won'
    })
    
    // Add activity
    await opportunitiesStore.addActivity(opp.id, {
      type: 'contract',
      user: userStore.currentUser?.name || 'You',
      action: 'set contract signing date',
      content: `Contract date set: ${new Date(datetime).toLocaleString()}`,
      data: {
        contractDate: datetime,
        notes: contractPendingForm.value.notes,
        autoAcceptedOffer: shouldAutoAccept
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
  // You can add activity or update opportunity here
}

function handleNsSurveyRefused({ opportunity }) {
  // Handle survey refusal
}

function handleNsNotResponding({ opportunity }) {
  // Handle not responding
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
  if (!opportunity.offers || !Array.isArray(opportunity.offers)) return []
  return opportunity.offers.filter(o => o.status === 'active' || !o.status)
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
  emailRecipient.value = opportunity.customer?.email || ''
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

