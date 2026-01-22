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
      <PrimaryActionWidget
        v-if="!opportunityState.isClosed.value && opportunityState.primaryAction.value"
        :action="opportunityState.primaryAction.value"
        :color-scheme="opportunityState.primaryAction.value.colorScheme"
        @action-clicked="opportunityState.primaryAction.value.handler"
      />
    </template>

    <template #task-widgets>
      <div v-if="opportunityState.activeTaskWidget.value && opportunityState.activeTaskWidget.value.component" class="space-y-3">
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

    <template #closed-state>
      <!-- Closed States -->
      <div
        v-if="opportunityState.isClosed.value"
        class="bg-surfaceSecondary/50 border border-E5E7EB rounded-card p-4"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <h4 class="font-bold text-heading text-fluid-sm">Opportunity Closed</h4>
            <p class="text-fluid-xs text-body mt-0.5">
              Status: {{ opportunityState.displayStage.value }}
              <span v-if="opportunity.lossReason"> - {{ opportunity.lossReason }}</span>
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="small"
          @click="handleReopen"
          class="flex items-center gap-2"
        >
          <span>Reopen Opportunity</span>
          <i class="fa-solid fa-rotate-left"></i>
        </Button>
      </div>
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
      @closed="handleClosedLost"
      @close="showCloseAsLostModal = false"
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
import { ref, computed, onMounted, toRef } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@motork/component-library'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { fetchVehicles } from '@/api/vehicles'
import { getDisplayStage } from '@/utils/stageMapper'
import { useOpportunityActions } from '@/composables/useOpportunityActions'

// Components
import TaskManagementWidget from '@/components/tasks/shared/TaskManagementWidget.vue'
import PrimaryActionWidget from '@/components/tasks/shared/PrimaryActionWidget.vue'
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

const emit = defineEmits(['vehicle-selected', 'offer-created', 'appointment-scheduled'])

const router = useRouter()
const opportunitiesStore = useOpportunitiesStore()

// Helper to get current opportunity (try store first, fallback to props)
const getCurrentOpportunity = () => {
  const storeOpportunity = opportunitiesStore.currentOpportunity
  return (storeOpportunity && storeOpportunity.id === props.opportunity?.id) ? storeOpportunity : props.opportunity
}

// Modal states
const showCreateAppointment = ref(false)
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
  'view-or-schedule-appointment': () => {
    if (props.scheduledAppointment) {
      showViewAppointment.value = true
    } else {
      showCreateAppointment.value = true
    }
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
    if (confirm('Are you sure you want to cancel this appointment?')) {
      handleCancelAppointment()
    }
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
  toRef(props, 'scheduledAppointment'),
  toRef(props, 'activities'),
  actionHandlers,
  formatDateTime
)

// Create opportunityState wrapper to match leadState pattern
const opportunityState = {
  isClosed: opportunityActions.isClosed,
  primaryAction: opportunityActions.primaryAction,
  activeTaskWidget: opportunityActions.activeTaskWidget,
  taskWidgetTitle: opportunityActions.taskWidgetTitle,
  displayStage: computed(() => {
    return getDisplayStage(props.opportunity, 'opportunity') || 'Qualified'
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

function handleCancelAppointment() {
  // Delete or mark appointment as cancelled
  // Update opportunity state
  if (props.scheduledAppointment) {
    // TODO: Call API to delete/cancel appointment
    // For now, emit event to parent
    emit('appointment-cancelled', props.scheduledAppointment.id)
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

function handleClosedLost(reason) {
  showCloseAsLostModal.value = false
  opportunitiesStore.updateOpportunity(props.opportunity.id, {
    stage: 'Closed Lost',
    lossReason: reason
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

function handleSetCallback(data) {
  // Set callback date to transition to "To be Called Back" stage
  opportunitiesStore.updateOpportunity(props.opportunity.id, {
    callbackDate: data.callbackDate
  })
}

function handleAutoCloseLost(data) {
  // Automatically close opportunity as lost after NS3
  opportunitiesStore.updateOpportunity(props.opportunity.id, {
    stage: 'Closed Lost',
    lossReason: data.reason || 'Multiple no-shows (NS3)'
  })
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
})
</script>

