<template>
  <div
    v-if="opportunity"
    class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8"
  >
    <div class="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-thumbtack text-gray-400 text-xs"></i>
        <h3 class="font-bold text-slate-800 text-sm">Manage Next steps</h3>
      </div>
      <span class="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-medium">
        {{ isClosed ? 'Closed' : 'Active' }}
      </span>
    </div>

    <div class="p-5 space-y-6">
      <!-- Reopen button for closed opportunities (in body) -->
      <div 
        v-if="isClosed"
        class="bg-green-50/50 border border-green-100 rounded-lg p-4 relative transition-all duration-300"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <h4 class="font-bold text-slate-800 text-sm">Opportunity Closed</h4>
            <p class="text-xs text-gray-500 mt-0.5">This opportunity has been closed. Reopen it to restart the management process, or requalify as a lead.</p>
          </div>
        </div>
        <div class="flex gap-3">
          <button
            @click="handleReopen"
            class="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
          >
            Reopen <i class="fa-solid fa-rotate-left"></i>
          </button>
          <button
            @click="showRequalifyModal = true"
            class="bg-white hover:bg-yellow-50 text-yellow-700 border border-yellow-300 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
          >
            Requalify as Lead <i class="fa-solid fa-arrow-left"></i>
          </button>
        </div>
      </div>
      
      <!-- Risk Warning (when appointment exists but opportunity is taking longer than expected) - Show at top -->
      <div v-if="shouldShowRiskWarning" class="bg-yellow-50/50 border border-yellow-200 rounded-lg p-4 relative transition-all duration-300">
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 mt-0.5">
            <i class="fa-solid fa-exclamation-triangle text-yellow-600 text-sm"></i>
          </div>
          <div class="flex-1">
            <h4 class="font-bold text-slate-800 text-sm mb-1">
              <span v-if="riskWarningLevel === 'high'">High Risk</span>
              <span v-else>At Risk</span>
            </h4>
            <p class="text-xs text-gray-600">
              <span v-if="riskWarningLevel === 'high'">
                This opportunity has been open for {{ daysSinceCreated }} days. Even with a scheduled appointment, consider following up to ensure engagement.
              </span>
              <span v-else>
                This opportunity has been open for {{ daysSinceCreated }} days. Monitor closely to ensure the scheduled appointment proceeds as planned.
              </span>
            </p>
          </div>
        </div>
      </div>
      
      <!-- Vehicle Actions Section (only for Qualified stage) -->
      <div v-if="opportunity.stage === 'Qualified' && opportunity.vehicle">
        <div :class="opportunity.vehicle.stockDays !== null && opportunity.vehicle.stockDays !== undefined ? 'bg-green-50/50 border border-green-100' : 'bg-orange-50/50 border border-orange-100'"
             class="rounded-lg p-4 relative transition-all duration-300">
          <div class="flex justify-between items-start mb-3">
            <div>
              <h4 class="font-bold text-slate-800 text-sm">
                <span v-if="opportunity.vehicle.stockDays !== null && opportunity.vehicle.stockDays !== undefined">
                  Add Vehicle
                </span>
                <span v-else>
                  Find Alternative
                </span>
              </h4>
              <p class="text-xs text-gray-500 mt-0.5">
                <span v-if="opportunity.vehicle.stockDays !== null && opportunity.vehicle.stockDays !== undefined">
                  The requested vehicle is available. Add it to the opportunity to proceed.
                </span>
                <span v-else>
                  The requested vehicle is currently out of stock. Explore other options.
                </span>
              </p>
            </div>
          </div>
          <div class="flex gap-3 flex-wrap">
            <button
              v-if="opportunity.vehicle.stockDays !== null && opportunity.vehicle.stockDays !== undefined"
              @click="handleAddRequestedVehicle"
              class="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
            >
              Add requested vehicle to opportunity
            </button>
            <button
              @click="handleAddVehicleFromStock"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
            >
              Add vehicle from stock
            </button>
            <button
              @click="handleConfigureVehicle"
              class="bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
            >
              Configure vehicle
            </button>
            <button
              @click="handleCreateOffer"
              class="bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
            >
              Create offer
            </button>
          </div>
          
          <!-- Recommended Cars Slider (only if vehicle out of stock) -->
          <div v-if="opportunity.vehicle.stockDays === null || opportunity.vehicle.stockDays === undefined" class="mt-4">
            <div class="[&>div]:mb-0">
              <RecommendedCarsSlider
                @add-to-opportunity="handleAddToOpportunity"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Appointment Section (only for Qualified stage) -->
      <div v-if="opportunity.stage === 'Qualified' && scheduledAppointment" class="bg-blue-50/50 border border-blue-100 rounded-lg p-4 relative transition-all duration-300">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h4 class="font-bold text-slate-800 text-sm">Next Appointment</h4>
            <p class="text-xs text-gray-500 mt-0.5">
              {{ scheduledAppointment.title }} on {{ formatDate(scheduledAppointment.start) }} at {{ formatTime(scheduledAppointment.start) }}
            </p>
          </div>
        </div>
        <button
          @click="toggleReschedule"
          class="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
        >
          Postpone
        </button>
        <div v-if="showReschedule" class="pt-4">
          <RescheduleWidget
            :show="showReschedule"
            @close="showReschedule = false"
            @confirm="handleReschedule"
          />
        </div>
      </div>
      
      <!-- No Appointment - Schedule Button -->
      <div v-else-if="opportunity.stage === 'Qualified' && !hasAppointment" class="bg-gray-50/50 border border-gray-100 rounded-lg p-4 relative transition-all duration-300">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h4 class="font-bold text-slate-800 text-sm">No Appointment Scheduled</h4>
            <p class="text-xs text-gray-500 mt-0.5">Schedule a new appointment to move the opportunity forward.</p>
          </div>
        </div>
        <button
          @click="toggleScheduleAppointment('no-appointment')"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
        >
          Schedule appointment
        </button>
      </div>
      
      <!-- Contract Signed - Mark as Closed Won (In Negotiation with contractDate) -->
      <div 
        v-if="shouldShowClosedWonCTA"
        class="bg-green-50/50 border border-green-100 rounded-lg p-4 relative transition-all duration-300"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <h4 class="font-bold text-slate-800 text-sm">Contract Signed</h4>
            <p class="text-xs text-gray-500 mt-0.5">
              Contract was signed on {{ formatDate(opportunity.contractDate) }}. Mark this opportunity as Closed Won to complete the deal.
            </p>
          </div>
        </div>
        <button
          @click="handleMarkAsClosedWon"
          class="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
        >
          Mark as Closed Won <i class="fa-solid fa-check-circle"></i>
        </button>
      </div>
      
      <!-- Legacy Task Widgets - Conditionally Loaded (Priority Order) -->
      <!-- Open/Qualified Opportunities (Most Urgent First) -->
      <!-- NS Widget (No-Show) - appears first if appointment was missed -->
      <NSWidget
        v-if="shouldShowNS"
        :opportunity="opportunity"
        :scheduled-appointment="scheduledAppointment"
        @contact-customer="handleContactCustomer"
        @reschedule="openRescheduleModal"
        @auto-close-lost="handleAutoCloseLost"
        @survey-completed="handleSurveyCompleted"
        @survey-refused="handleSurveyRefused"
        @not-responding="handleNotResponding"
      />
      
      <UFBWidget
        v-if="shouldShowUFB"
        :opportunity="opportunity"
        @create-offer="handleCreateOffer"
        @survey-completed="handleSurveyCompleted"
        @survey-refused="handleSurveyRefused"
        @not-responding="handleNotResponding"
      />
      
      <OOFBWidget
        v-if="shouldShowOOFB"
        :opportunity="opportunity"
        @create-offer="handleCreateOffer"
        @review="handleReview"
        @survey-completed="handleSurveyCompleted"
        @survey-refused="handleSurveyRefused"
        @not-responding="handleNotResponding"
      />
      
      <!-- In Negotiation Opportunities (Action-Required First) -->
      <NFUWidget
        v-if="shouldShowNFU"
        :opportunity="opportunity"
        @schedule-closing="handleScheduleClosing"
        @survey-completed="handleSurveyCompleted"
        @survey-refused="handleSurveyRefused"
        @not-responding="handleNotResponding"
      />
      
      
      <OFBWidget
        v-if="shouldShowOFB"
        :opportunity="opportunity"
        @create-contract="handleCreateContract"
        @survey-completed="handleSurveyCompleted"
        @survey-refused="handleSurveyRefused"
        @not-responding="handleNotResponding"
      />
      
      <!-- Closed Won Opportunities -->
      <CFBWidget
        v-if="shouldShowCFB"
        :opportunity="opportunity"
        @prepare-delivery="handlePrepareDelivery"
        @pre-delivery-checklist="handlePreDeliveryChecklist"
        @survey-completed="handleSurveyCompleted"
        @survey-refused="handleSurveyRefused"
        @not-responding="handleNotResponding"
      />
      
      <!-- Registration Status CTA (after contract signed, before delivery) -->
      <div 
        v-if="shouldShowRegistrationCTA"
        class="bg-indigo-50/50 border border-indigo-100 rounded-lg p-4 relative transition-all duration-300"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <h4 class="font-bold text-slate-800 text-sm">Administrative Phase</h4>
            <p class="text-xs text-gray-500 mt-0.5">Contract has been signed. Move to Registration stage to complete administrative processes before delivery.</p>
          </div>
        </div>
        <button
          @click="handleMarkAsRegistration"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
        >
          Mark as Registration <i class="fa-solid fa-file-contract"></i>
        </button>
      </div>
      
      <DFBWidget
        v-if="shouldShowDFB"
        :opportunity="opportunity"
        :activities="activities"
        @delivery-feedback="handleDeliveryFeedback"
        @survey-completed="handleSurveyCompleted"
        @survey-refused="handleSurveyRefused"
        @not-responding="handleNotResponding"
      />
      
      <!-- Close Opportunity Widget (shows for all non-closed stages) -->
      <CloseOpportunityWidget
        v-if="shouldShowCloseOpportunity"
        :opportunity="opportunity"
        @close-won="handleCloseWon"
        @close-lost="handleCloseAsLost"
      />
    </div>

    <ComingSoonModal
      :show="showModal"
      :title="modalTitle"
      @close="showModal = false"
    />
    
    <!-- Close as Lost Modal -->
    <CloseAsLostModal
      :show="showCloseAsLostModal"
      @confirm="handleCloseAsLostConfirm"
      @cancel="showCloseAsLostModal = false"
    />
    
    <!-- Requalify as Lead Modal -->
    <RequalifyAsLeadModal
      :show="showRequalifyModal"
      @confirm="handleRequalifyAsLead"
      @cancel="showRequalifyModal = false"
    />
    
    <!-- Contract Date Modal -->
    <ContractDateModal
      :show="showContractDateModal"
      @confirm="handleContractDateConfirm"
      @cancel="showContractDateModal = false"
    />
    
    <!-- Delivery Modal -->
    <DeliveryModal
      :show="showDeliveryModal"
      @confirm="handleDeliveryConfirm"
      @cancel="showDeliveryModal = false"
    />
    
    <!-- Offer Creation Modal -->
    <Teleport to="body">
      <div 
        v-if="showOfferModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="handleCloseOfferModal"
      >
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <OfferWidget
              :item="null"
              :task-type="'opportunity'"
              :task-id="opportunity.id"
              :requested-car="opportunity.vehicle || null"
              :recommended-cars="recommendedCars"
              @save="handleOfferSave"
              @cancel="handleCloseOfferModal"
            />
          </div>
        </div>
      </div>
    </Teleport>
    
    <!-- Schedule Appointment Modal -->
    <Teleport to="body">
      <div 
        v-if="showScheduleAppointment"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="handleCloseScheduleModal"
      >
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <ScheduleAppointmentWidget
              :show="showScheduleAppointment"
              @confirm="handleScheduleAppointment"
              @cancel="handleCloseScheduleModal"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Teleport } from 'vue'
import { useRouter } from 'vue-router'
import { useOpportunitiesStore } from '@/stores/opportunities'
import { useUserStore } from '@/stores/user'
import { mockVehicles } from '@/api/mockData'
import RescheduleWidget from '@/components/tasks/widgets/RescheduleWidget.vue'
import ScheduleAppointmentWidget from '@/components/tasks/leads/ScheduleAppointmentWidget.vue'
import ComingSoonModal from '@/components/shared/ComingSoonModal.vue'
import CloseAsLostModal from '@/components/tasks/modals/CloseAsLostModal.vue'
import ContractDateModal from '@/components/tasks/modals/ContractDateModal.vue'
import DeliveryModal from '@/components/tasks/modals/DeliveryModal.vue'
import RequalifyAsLeadModal from '@/components/tasks/modals/RequalifyAsLeadModal.vue'
import OfferWidget from '@/components/tasks/widgets/OfferWidget.vue'
import RecommendedCarsSlider from '@/components/tasks/opportunities/RecommendedCarsSlider.vue'
import OOFBWidget from '@/components/tasks/opportunities/tasks/OOFBWidget.vue'
import UFBWidget from '@/components/tasks/opportunities/tasks/UFBWidget.vue'
import OFBWidget from '@/components/tasks/opportunities/tasks/OFBWidget.vue'
import NFUWidget from '@/components/tasks/opportunities/tasks/NFUWidget.vue'
import NSWidget from '@/components/tasks/opportunities/tasks/NSWidget.vue'
import CFBWidget from '@/components/tasks/opportunities/tasks/CFBWidget.vue'
import DFBWidget from '@/components/tasks/opportunities/tasks/DFBWidget.vue'
import CloseOpportunityWidget from '@/components/tasks/opportunities/tasks/CloseOpportunityWidget.vue'

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

const emit = defineEmits(['add-vehicle', 'add-vehicle-from-stock', 'configure-vehicle', 'create-offer', 'add-to-opportunity'])

// Check if opportunity is closed (Closed Won, Closed Lost, or Registration)
const isClosed = computed(() => {
  return props.opportunity?.stage === 'Closed' || 
         props.opportunity?.stage === 'Closed Lost' || 
         props.opportunity?.stage === 'Registration'
})

const showReschedule = ref(false)
const showScheduleAppointment = ref(false)
const scheduleAppointmentSource = ref(null) // Track which button triggered it: 'no-appointment' or 'nfu'
const showModal = ref(false)
const modalTitle = ref('')
const showOfferModal = ref(false)
const showCloseAsLostModal = ref(false)
const showContractDateModal = ref(false)
const showDeliveryModal = ref(false)
const showRequalifyModal = ref(false)
const recommendedCars = ref([])

const router = useRouter()
const opportunitiesStore = useOpportunitiesStore()
const userStore = useUserStore()

onMounted(() => {
  // Load recommended cars (in-stock vehicles)
  recommendedCars.value = mockVehicles
    .filter(car => car.stockDays !== null && car.stockDays !== undefined)
    .slice(0, 5)
    .map(car => ({
      id: car.id,
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price,
      image: car.image || '',
      stockDays: car.stockDays
    }))
})

const openModal = (title) => {
  modalTitle.value = title
  showModal.value = true
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const toggleReschedule = () => {
  showReschedule.value = !showReschedule.value
}

const handleReschedule = (newDateTime) => {
  showReschedule.value = false
  // Implement actual reschedule logic here
}

// Computed properties to determine which task widgets to show
const daysSinceCreated = computed(() => {
  if (!props.opportunity?.createdAt) return 0
  const created = new Date(props.opportunity.createdAt)
  const now = new Date()
  const diffTime = Math.abs(now - created)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const hasOffers = computed(() => {
  // Check if opportunity has offers by checking activities or stage
  // If stage is In Negotiation or Closed, assume offers exist
  // Also check activities for offer type
  const hasOfferActivities = props.activities.some(activity => activity.type === 'offer')
  return hasOfferActivities || props.opportunity?.stage === 'In Negotiation' || props.opportunity?.stage === 'Closed'
})

const hasAppointment = computed(() => {
  // Check if there's an appointment in activities
  return props.activities.some(activity => activity.type === 'appointment')
})

const hasContract = computed(() => {
  // Check if contract date exists
  const hasContractDate = props.opportunity?.contractDate !== null && props.opportunity?.contractDate !== undefined
  
  // Check if opportunity has contract signed via activities
  const hasWonActivity = props.activities.some(activity => 
    activity.action?.toLowerCase().includes('won') || 
    activity.action?.toLowerCase().includes('contract')
  )
  
  // Closed stage with probability 100 likely means contract signed
  return hasContractDate || hasWonActivity || (props.opportunity?.stage === 'Closed' && props.opportunity?.probability === 100)
})

const hasDelivery = computed(() => {
  // Check if vehicle has been delivered by looking for delivery activities
  return props.activities.some(activity => 
    activity.type === 'delivery' || 
    activity.action?.toLowerCase().includes('delivered') ||
    activity.action?.toLowerCase().includes('delivery')
  )
})

// Show OOFB when opportunity is Qualified for X days (e.g., 7 days) without offers
// But only if UFB shouldn't show (mutually exclusive) AND no appointment is scheduled
const shouldShowOOFB = computed(() => {
  if (props.opportunity?.stage !== 'Qualified' || hasOffers.value) return false
  // Don't show if there's a scheduled appointment - opportunity is in active sales management
  if (props.scheduledAppointment || hasAppointment.value) return false
  const days = daysSinceCreated.value
  // Show OOFB if 7-13 days (before UFB kicks in)
  return days >= 7 && days < 14
})

// Show UFB when opportunity is Qualified for 14+ days without offers
// This is a second follow-up after OOFB (14+ days vs 7-13 for OOFB)
const shouldShowUFB = computed(() => {
  if (props.opportunity?.stage !== 'Qualified' || hasOffers.value) return false
  // Don't show if there's a scheduled appointment - opportunity is in active sales management
  if (props.scheduledAppointment || hasAppointment.value) return false
  const days = daysSinceCreated.value
  // Show UFB if 14+ days (after OOFB threshold of 7-13 days)
  return days >= 14
})

// Show warning when opportunity has appointment but is taking longer than expected
const shouldShowRiskWarning = computed(() => {
  if (props.opportunity?.stage !== 'Qualified' || hasOffers.value) return false
  // Only show warning if there's an appointment but opportunity is at risk
  if (!props.scheduledAppointment) return false
  const days = daysSinceCreated.value
  // Show warning if 7+ days (same threshold as OOFB)
  return days >= 7
})

const riskWarningLevel = computed(() => {
  const days = daysSinceCreated.value
  if (days >= 14) return 'high' // UFB threshold
  if (days >= 7) return 'medium' // OOFB threshold
  return null
})

// Show OFB when opportunity is In Negotiation for X days (e.g., 5 days) without contract
const shouldShowOFB = computed(() => {
  if (props.opportunity?.stage !== 'In Negotiation') return false
  // Calculate days since negotiation started (use lastActivity as proxy)
  const negotiationDate = props.opportunity.lastActivity ? new Date(props.opportunity.lastActivity) : new Date(props.opportunity.createdAt)
  const now = new Date()
  const diffTime = Math.abs(now - negotiationDate)
  const daysInNegotiation = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return !hasContract.value && daysInNegotiation >= 5
})

// Show NFU when opportunity is In Negotiation with no contract date and no future appointment
// Primary Constraints:
// - Opportunity is in "In Negotiation" status for more than X days (configurable)
// - There is no contract date
// - There is no appointment in the future
const shouldShowNFU = computed(() => {
  if (props.opportunity?.stage !== 'In Negotiation') return false
  
  // Check if there's a contract date (not just contract status)
  const hasContractDate = props.opportunity?.contractDate !== null && props.opportunity?.contractDate !== undefined
  
  // Check if there's a future appointment (appointment date must be in the future)
  const hasFutureAppointment = (props.scheduledAppointment && 
    new Date(props.scheduledAppointment.start) > new Date()) ||
    (hasAppointment.value && props.activities.some(activity => {
      if (activity.type === 'appointment' && activity.data?.datetime) {
        return new Date(activity.data.datetime) > new Date()
      }
      return false
    }))
  
  // Calculate days in negotiation
  const negotiationDate = props.opportunity.lastActivity ? new Date(props.opportunity.lastActivity) : new Date(props.opportunity.createdAt)
  const now = new Date()
  const diffTime = Math.abs(now - negotiationDate)
  const daysInNegotiation = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  // NFU requires: In Negotiation for X+ days AND no contract date AND no future appointment
  const nfuThreshold = 5 // Configurable - could be a prop or constant
  return daysInNegotiation >= nfuThreshold && !hasContractDate && !hasFutureAppointment
})

// Show CFB when contract date is set and X days have passed without delivery
// Show for both Closed Won and Registration stages
const shouldShowCFB = computed(() => {
  // Must be Closed Won or Registration stage
  if (props.opportunity?.stage !== 'Closed' && props.opportunity?.stage !== 'Registration') return false
  
  // Check if contract date exists
  const contractDate = props.opportunity?.contractDate
  if (!contractDate) return false
  
  // Check if vehicle has been delivered
  if (hasDelivery.value) return false
  
  // Calculate days since contract date
  const contract = new Date(contractDate)
  const now = new Date()
  const diffTime = Math.abs(now - contract)
  const daysSinceContract = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  // CFB triggers after X days (e.g., 7 days) since contract date without delivery
  const cfbThreshold = 7 // Configurable
  return daysSinceContract >= cfbThreshold
})

// Show DFB when delivery date is recorded and X days have passed since delivery
// Works for Closed Won, Registration, or any stage with delivery
const shouldShowDFB = computed(() => {
  // Check if delivery date exists (from activities or opportunity field)
  const deliveryActivity = props.activities.find(activity => 
    activity.type === 'delivery' || 
    activity.action?.toLowerCase().includes('delivered')
  )
  
  if (!deliveryActivity) return false
  
  // Calculate days since delivery date
  const deliveryDate = new Date(deliveryActivity.timestamp)
  const now = new Date()
  const diffTime = Math.abs(now - deliveryDate)
  const daysSinceDelivery = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  // DFB triggers X days (e.g., 3 days) after delivery date
  const dfbThreshold = 3 // Configurable
  return daysSinceDelivery >= dfbThreshold
})

// Show NS (No-Show) when appointment date has passed without completion
const shouldShowNS = computed(() => {
  if (!props.scheduledAppointment) return false
  
  const appointmentDate = new Date(props.scheduledAppointment.start)
  const now = new Date()
  
  // Check if appointment is in the past
  if (appointmentDate >= now) return false
  
  // Check if appointment has been completed
  const isCompleted = props.activities.some(a => 
    a.type === 'appointment' && 
    (a.data?.status === 'completed' || a.action?.toLowerCase().includes('completed')) &&
    a.data?.appointmentId === props.scheduledAppointment.id
  )
  
  // Check if appointment is marked as no-show
  const isMarkedNoShow = props.scheduledAppointment.status === 'no-show'
  
  // Show NS widget if appointment is past, not completed, and not already marked as no-show
  return !isCompleted && !isMarkedNoShow
})

// Show Close Opportunity Widget for all non-closed stages
const shouldShowCloseOpportunity = computed(() => {
  return !isClosed.value
})

// Show Closed Won CTA when:
// - Opportunity is In Negotiation
// - Contract date exists (contract signed)
// - Not yet Closed Won
const shouldShowClosedWonCTA = computed(() => {
  // Must be In Negotiation stage
  if (props.opportunity?.stage !== 'In Negotiation') return false
  
  // Must have contract date
  if (!props.opportunity?.contractDate) return false
  
  // Must not already be Closed Won
  if (props.opportunity?.stage === 'Closed') return false
  
  return true
})

// Show Registration CTA when:
// - Opportunity is Closed Won (stage === 'Closed')
// - Contract date exists (contract signed)
// - Not yet delivered
// - After CFB threshold (contract signed 7+ days ago)
// - Not already in Registration stage
const shouldShowRegistrationCTA = computed(() => {
  // Must be Closed Won (not Registration, not Closed Lost)
  if (props.opportunity?.stage !== 'Closed') return false
  
  // Must have contract date
  if (!props.opportunity?.contractDate) return false
  
  // Must not be delivered
  if (hasDelivery.value) return false
  
  // Must not already be in Registration stage
  if (props.opportunity?.stage === 'Registration') return false
  
  // Check if CFB threshold has passed (7+ days since contract)
  const contractDate = new Date(props.opportunity.contractDate)
  const now = new Date()
  const diffTime = Math.abs(now - contractDate)
  const daysSinceContract = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  // Show after CFB threshold (7 days) - administrative phase begins
  return daysSinceContract >= 7
})

// Event handlers for vehicle actions
const handleAddRequestedVehicle = () => {
  emit('add-vehicle', props.opportunity)
}

const handleAddVehicleFromStock = () => {
  openModal('Add Vehicle from Stock')
}

const handleConfigureVehicle = () => {
  openModal('Configure Vehicle')
}

const handleCreateOffer = () => {
  showOfferModal.value = true
}

const handleCloseOfferModal = () => {
  showOfferModal.value = false
}

const handleOfferSave = (data) => {
  showOfferModal.value = false
  emit('create-offer', { opportunity: props.opportunity, offerData: data })
}

const handleAddToOpportunity = (car) => {
  emit('add-to-opportunity', car)
}

// Event handlers for task widgets

const handleReview = (opportunity) => {
  openModal('Review Opportunity')
}

const handleFollowUp = (opportunity) => {
  openModal('Follow-up Required')
}

const handleMarkUnsold = (opportunity) => {
  openModal('Mark as Unsold')
}

const handleCreateContract = (opportunity) => {
  showContractDateModal.value = true
}

const handleContractDateConfirm = (data) => {
  showContractDateModal.value = false
  console.log('Contract date set:', data)
  // In real implementation, this would update the opportunity.contractDate field
  // and trigger CFB widget logic
  // emit('contract-date-set', { opportunity: props.opportunity, ...data })
}

const handleCloseOpportunity = (opportunity) => {
  openModal('Close Opportunity')
}

const toggleScheduleAppointment = (source) => {
  // Open the modal
  showScheduleAppointment.value = true
  scheduleAppointmentSource.value = source
}

const handleCloseScheduleModal = () => {
  showScheduleAppointment.value = false
  scheduleAppointmentSource.value = null
}

const handleScheduleClosing = (opportunity) => {
  toggleScheduleAppointment('nfu')
}

const handleScheduleAppointment = (appointmentData) => {
  handleCloseScheduleModal()
  
  // Create appointment activity
  const appointmentActivity = {
    type: 'appointment',
    user: 'You',
    action: 'scheduled an appointment',
    content: `Appointment scheduled: ${appointmentData.type} on ${appointmentData.date} at ${appointmentData.time}`,
    data: {
      type: appointmentData.type,
      assignee: appointmentData.assignee,
      date: appointmentData.date,
      time: appointmentData.time,
      datetime: `${appointmentData.date}T${appointmentData.time}:00`,
      status: 'scheduled'
    },
    timestamp: new Date().toISOString()
  }
  
  // Emit to parent to add to activities
  emit('appointment-created', appointmentActivity)
}

const handlePrepareDelivery = (opportunity) => {
  showDeliveryModal.value = true
}

const handlePreDeliveryChecklist = (opportunity) => {
  openModal('Pre-Delivery Checklist')
}

const handleDeliveryConfirm = (data) => {
  showDeliveryModal.value = false
  console.log('Vehicle marked as delivered:', data)
  // In real implementation, this would create a delivery activity
  // and trigger DFB widget logic
  // emit('delivery-completed', { opportunity: props.opportunity, ...data })
}

const handleDeliveryFeedback = (opportunity) => {
  openModal('Delivery Feedback')
}

const handleCloseWon = () => {
  handleMarkAsClosedWon()
}

const handleCloseAsLost = () => {
  showCloseAsLostModal.value = true
}

const handleAutoCloseLost = (data) => {
  // Auto-close after NS3 - no modal needed
  console.log('Auto-closing opportunity as lost after NS3:', data)
  // In real implementation, this would:
  // 1. Update opportunity stage to "Closed Lost"
  // 2. Set closedReason to data.reason
  // 3. Set closedDate to current date
  // emit('auto-close-lost', { opportunity: props.opportunity, ...data })
}

const handleCloseAsLostConfirm = (data) => {
  showCloseAsLostModal.value = false
  // In real implementation, this would update the opportunity stage to "Closed Lost"
  // and store the reason and notes
  // For now, just log it
  console.log('Closing opportunity as lost:', data)
  // emit('close-as-lost', { opportunity: props.opportunity, ...data })
}

const handleContactCustomer = () => {
  openModal('Contact Customer')
}

const handleSurveyCompleted = (data) => {
  console.log('Survey completed:', data)
  // In real implementation, store survey responses in activities
}

const handleSurveyRefused = (data) => {
  console.log('Survey refused:', data)
  // In real implementation, log refusal
}

const handleNotResponding = (data) => {
  console.log('Customer not responding:', data)
  // In real implementation, update opportunity status
}

const handleReopen = async () => {
  try {
    await opportunitiesStore.reopenOpportunity(props.opportunity.id)
    // Reload opportunity to get updated state
    await opportunitiesStore.loadOpportunityById(props.opportunity.id)
  } catch (err) {
    console.error('Failed to reopen opportunity:', err)
  }
}

const handleRequalifyAsLead = async () => {
  try {
    showRequalifyModal.value = false
    
    // Convert opportunity to lead
    const leadId = await opportunitiesStore.convertOpportunityToLead(props.opportunity.id)
    
    // Check user permissions and navigate accordingly
    if (userStore.canAccessLeads()) {
      // Operator or Manager - redirect to the new lead
      router.push({ path: `/tasks/${leadId}`, query: { type: 'lead' } })
    } else {
      // Salesman - no access to leads, navigate to tasks list
      router.push('/tasks/1')
    }
  } catch (err) {
    console.error('Failed to convert opportunity to lead:', err)
    showRequalifyModal.value = false
  }
}

const handleMarkAsRegistration = async () => {
  try {
    await opportunitiesStore.markAsRegistration(props.opportunity.id)
    // Reload opportunity to get updated state
    await opportunitiesStore.loadOpportunityById(props.opportunity.id)
  } catch (err) {
    console.error('Failed to mark as registration:', err)
  }
}

const handleMarkAsClosedWon = async () => {
  try {
    await opportunitiesStore.markAsClosedWon(props.opportunity.id)
    // Reload opportunity to get updated state
    await opportunitiesStore.loadOpportunityById(props.opportunity.id)
  } catch (err) {
    console.error('Failed to mark as closed won:', err)
  }
}
</script>
