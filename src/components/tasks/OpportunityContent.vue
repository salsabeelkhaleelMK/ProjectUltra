<template>
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 shrink-0 shadow-sm">
      <div class="px-4 md:px-8 py-4 md:py-6">
        <ContactInfo
          :initials="opportunity.customer.initials"
          :name="opportunity.customer.name"
          avatar-color-class="bg-purple-100 text-purple-600"
          :email="opportunity.customer.email"
          :phone="opportunity.customer.phone"
          :third-field-value="opportunity.customer.address"
          email-label="Email"
          phone-label="Phone"
          third-field-label="Address"
        >
          <template #tags>
            <span 
              v-for="tag in opportunity.tags" 
              :key="tag"
              class="px-2 py-0.5 rounded-full border bg-blue-50 border-blue-100 text-blue-700 text-xs font-semibold"
            >
              {{ tag }}
            </span>
            <div class="relative ml-1">
              <button 
                @click.stop="showTagMenu = !showTagMenu"
                class="text-[10px] md:text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 transition-colors outline-none"
              >
                + Add tag
              </button>
              <div 
                v-if="showTagMenu"
                class="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-1 overflow-hidden"
                v-click-outside="() => showTagMenu = false"
              >
                <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-2">Select Tag</div>
                <button 
                  v-for="availableTag in availableTags" 
                  :key="availableTag.name"
                  @click="addTag(availableTag.name)"
                  class="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-gray-50 rounded flex items-center gap-2 transition-colors"
                >
                  <span class="w-2 h-2 rounded-full" :class="availableTag.color"></span> {{ availableTag.name }}
                </button>
              </div>
            </div>
          </template>
        </ContactInfo>
      </div>
    </header>
    
    <!-- Scrollable Content -->
    <main class="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full scrollbar-hide">
      <!-- Tabs + Add New (overview only) -->
      <div class="flex items-center justify-between mb-4">
        <Tabs 
          v-model="activeTab"
          :tabs="opportunityTabs"
          class="mb-0"
        />
        
        <AddNewButton
          v-if="activeTab === 'overview'"
          :actions="overviewOpportunityActions"
          :active-tab="activeTab"
          :inline="true"
          @action="onOpportunityAddNewAction"
        />
      </div>
      
      <!-- Stage & Owner Bar - Under tabs -->
      <div v-if="activeTab === 'overview'" class="mb-6">
        <StageOwnerBar
          :stage="opportunity.stage"
          :owner="opportunity.assignee"
          :source="opportunity.source || ''"
          :probability="opportunity.probability"
        />
      </div>
      
      
      <!-- Pinned Widgets Section (only on overview tab) -->
      <div v-if="activeTab === 'overview'" class="space-y-6 mb-6">
        <!-- Manage Opportunity Widget (Pinned) -->
        <OpportunityManagementWidget
          :opportunity="opportunity"
          :scheduled-appointment="opportunity?.scheduledAppointment || null"
          :activities="[...opportunitiesStore.currentOpportunityActivities, ...inlineContent]"
          @add-vehicle="handleAddVehicle"
          @add-vehicle-from-stock="handleAddVehicleFromStock"
          @configure-vehicle="handleConfigureVehicle"
          @create-offer="handleCreateOfferFromModal"
          @add-to-opportunity="handleAddToOpportunity"
          @appointment-created="handleAppointmentCreated"
        />
        
        <!-- Offers Widget (Pinned if exists, only for In Negotiation or Closed) -->
        <div v-if="opportunity?.stage === 'In Negotiation' || opportunity?.stage === 'Closed'">
          <OffersCarousel />
        </div>
        
        <!-- Requested Car Widget (Pinned if no offers) -->
        <VehicleWidget
          v-if="opportunity && opportunity.vehicle && !(opportunity?.stage === 'In Negotiation' || opportunity?.stage === 'Closed')"
          :brand="opportunity.vehicle.brand"
          :model="opportunity.vehicle.model"
          :year="opportunity.vehicle.year"
          :image="opportunity.vehicle.image || ''"
          :price="opportunity.vehicle.price || null"
          :request-message="opportunity.vehicle.requestMessage || ''"
          :request-type="'Opportunity'"
          :source="opportunity.source || ''"
          :dealership="opportunity.vehicle.dealership || ''"
          :registration="opportunity.vehicle.registration || ''"
          :kilometers="opportunity.vehicle.kilometers !== undefined ? opportunity.vehicle.kilometers : null"
          :fuel-type="opportunity.vehicle.fuelType || ''"
          :gear-type="opportunity.vehicle.gearType || ''"
          :vin="opportunity.vehicle.vin || ''"
          :stock-days="opportunity.vehicle.stockDays !== undefined ? opportunity.vehicle.stockDays : null"
          :fiscal-entity="opportunity.vehicle.fiscalEntity || ''"
          :source-details="opportunity.vehicle.sourceDetails || ''"
        />
        
        <!-- Requested Car Widget (Pinned if offers exist) -->
        <VehicleWidget
          v-if="opportunity && opportunity.vehicle && (opportunity?.stage === 'In Negotiation' || opportunity?.stage === 'Closed')"
          :brand="opportunity.vehicle.brand"
          :model="opportunity.vehicle.model"
          :year="opportunity.vehicle.year"
          :image="opportunity.vehicle.image || ''"
          :price="opportunity.vehicle.price || null"
          :request-message="opportunity.vehicle.requestMessage || ''"
          :request-type="'Opportunity'"
          :source="opportunity.source || ''"
          :dealership="opportunity.vehicle.dealership || ''"
          :registration="opportunity.vehicle.registration || ''"
          :kilometers="opportunity.vehicle.kilometers !== undefined ? opportunity.vehicle.kilometers : null"
          :fuel-type="opportunity.vehicle.fuelType || ''"
          :gear-type="opportunity.vehicle.gearType || ''"
          :vin="opportunity.vehicle.vin || ''"
          :stock-days="opportunity.vehicle.stockDays !== undefined ? opportunity.vehicle.stockDays : null"
          :fiscal-entity="opportunity.vehicle.fiscalEntity || ''"
          :source-details="opportunity.vehicle.sourceDetails || ''"
        />
        
      </div>
      
      <!-- Add New Button (for non-overview tabs) -->
      <AddNewButton
        v-if="activeTab !== 'overview'"
        :actions="availableActions"
        :active-tab="activeTab"
        @action="handleAddNewAction"
      />
      
      <!-- Inline Widgets - Right after Add New Button (non-overview tabs only) -->
      <div v-if="activeTab !== 'overview'">
        <div v-if="showScheduleAppointment" class="bg-gray-50/50 border border-gray-100 rounded-lg p-4 mb-6">
          <ScheduleAppointmentWidget
            :show="showScheduleAppointment"
            @confirm="handleScheduleAppointment"
            @cancel="showScheduleAppointment = false"
          />
        </div>
        
        <CommunicationWidget
          v-if="showInlineWidget === 'communication'"
          :type="communicationType"
          :task-type="'opportunity'"
          :task-id="opportunity.id"
          @save="handleWidgetSave"
          @cancel="handleWidgetCancel"
        />
        
        <NoteWidget
          v-if="showInlineWidget === 'note'"
          :item="editingItem"
          :task-type="'opportunity'"
          :task-id="opportunity.id"
          @save="handleWidgetSave"
          @cancel="handleWidgetCancel"
        />
        
        <AttachmentWidget
          v-if="showInlineWidget === 'attachment'"
          :item="editingItem"
          :task-type="'opportunity'"
          :task-id="opportunity.id"
          @save="handleWidgetSave"
          @cancel="handleWidgetCancel"
        />
      </div>
      
      <!-- Feed Items Container -->
      <div v-if="filteredInlineContent.length > 0" class="space-y-4 mb-6 px-1">
        <FeedItemCard
          v-for="item in filteredInlineContent" 
          :key="item.id"
          :item="item"
          :task-type="'opportunity'"
          :customer-initials="'SK'"
          @edit="handleEditItem"
          @delete="handleDeleteItem"
        />
      </div>

      <!-- Trade-in & Financing Modals (overview + other triggers) -->
      <Teleport to="body">
        <!-- Trade-in Modal -->
        <div 
          v-if="showTradeInModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          @click.self="() => { showTradeInModal = false; editingItem = null }"
        >
          <div class="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-semibold text-slate-900">Add trade-in</h3>
                <button
                  class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                  @click="() => { showTradeInModal = false; editingItem = null }"
                >
                  <i class="fa-solid fa-xmark text-sm text-gray-500"></i>
                </button>
              </div>
              <TradeInWidget
                :item="editingItem && editingItem.type === 'tradein' ? editingItem : null"
                :task-type="'opportunity'"
                :task-id="opportunity.id"
                @save="(data) => handleWidgetSave({ ...data, type: 'tradein' })"
                @cancel="() => { showTradeInModal = false; editingItem = null }"
              />
            </div>
          </div>
        </div>

        <!-- Financing Modal -->
        <div 
          v-if="showFinancingModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          @click.self="() => { showFinancingModal = false; editingItem = null }"
        >
          <div class="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-semibold text-slate-900">Add financing</h3>
                <button
                  class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                  @click="() => { showFinancingModal = false; editingItem = null }"
                >
                  <i class="fa-solid fa-xmark text-sm text-gray-500"></i>
                </button>
              </div>
              <FinancingWidget
                :item="editingItem && editingItem.type === 'financing' ? editingItem : null"
                :task-type="'opportunity'"
                :task-id="opportunity.id"
                @save="(data) => handleWidgetSave({ ...data, type: 'financing' })"
                @cancel="() => { showFinancingModal = false; editingItem = null }"
              />
            </div>
          </div>
        </div>
      </Teleport>

    </main>
    
    <!-- Coming Soon Modal -->
    <ComingSoonModal
      :show="showComingSoonModal"
      :title="comingSoonModalTitle"
      @close="showComingSoonModal = false"
    />
    
    <!-- Schedule Appointment Modal -->
    <Teleport to="body">
      <div 
        v-if="showScheduleAppointment"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        @click.self="showScheduleAppointment = false"
      >
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <ScheduleAppointmentWidget
              :show="showScheduleAppointment"
              @confirm="handleScheduleAppointment"
              @cancel="showScheduleAppointment = false"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, Teleport } from 'vue'
import { useOpportunitiesStore } from '@/stores/opportunities'
import ContactInfo from '@/components/shared/ContactInfo.vue'
import Tabs from '@/components/shared/Tabs.vue'
import StageOwnerBar from '@/components/shared/StageOwnerBar.vue'
import { getTabForItemTypeDefault as getTabForItemType } from '@/composables/useTaskTabs'
import AddNewButton from '@/components/shared/AddNewButton.vue'
import VehicleWidget from '@/components/shared/VehicleWidget.vue'
import OpportunityManagementWidget from '@/components/opportunities/OpportunityManagementWidget.vue'
import OffersCarousel from '@/components/opportunities/OffersCarousel.vue'
import ComingSoonModal from '@/components/shared/ComingSoonModal.vue'
import ScheduleAppointmentWidget from '@/components/shared/ScheduleAppointmentWidget.vue'
import FeedItemCard from '@/components/feed/FeedItemCard.vue'
import NoteWidget from '@/components/widgets/NoteWidget.vue'
import AttachmentWidget from '@/components/widgets/AttachmentWidget.vue'
import CommunicationWidget from '@/components/widgets/CommunicationWidget.vue'
import TradeInWidget from '@/components/widgets/TradeInWidget.vue'
import FinancingWidget from '@/components/widgets/FinancingWidget.vue'

const props = defineProps({
  opportunity: {
    type: Object,
    required: true
  }
})

const opportunitiesStore = useOpportunitiesStore()

const taskId = computed(() => props.opportunity.id)

const taskStore = {
  currentActivities: computed(() => opportunitiesStore.currentOpportunityActivities),
  addActivity: (id, activity) => opportunitiesStore.addActivity(id, activity),
  updateActivity: (id, activityId, updates) => opportunitiesStore.updateActivity(id, activityId, updates),
  deleteActivity: (id, activityId) => opportunitiesStore.deleteActivity(id, activityId)
}

const isOverviewModalAction = (action) => ['tradein', 'financing'].includes(action)

const {
  activeTab,
  showInlineWidget,
  editingItem,
  communicationType,
  inlineContent,
  filteredInlineContent,
  handleAddNewAction,
  handleWidgetSave,
  handleWidgetCancel,
  handleEditItem,
  handleDeleteItem
} = useTaskInlineWidgets({
  store: taskStore,
  taskId,
  getTabForItemType,
  isOverviewModalAction
})

const showTagMenu = ref(false)
const showComingSoonModal = ref(false)
const comingSoonModalTitle = ref('')
const showScheduleAppointment = ref(false)
const showTradeInModal = ref(false)
const showFinancingModal = ref(false)

const availableTags = [
  { name: 'Sport', color: 'bg-red-400' },
  { name: 'Blacklist', color: 'bg-indigo-400' },
  { name: 'Green', color: 'bg-green-400' },
  { name: 'Premium', color: 'bg-blue-400' },
  { name: 'Rent', color: 'bg-purple-400' },
  { name: 'Automation', color: 'bg-orange-400' },
  { name: 'Complete Profile', color: 'bg-lime-400' }
]

const opportunityTabs = computed(() => {
  const allItems = [...opportunitiesStore.currentOpportunityActivities, ...inlineContent.value]
  const overviewCount = allItems.length
  const communicationCount = allItems.filter(item => ['call', 'email', 'sms', 'whatsapp', 'communication'].includes(item.type)).length
  const noteCount = allItems.filter(item => item.type === 'note').length
  const attachmentCount = allItems.filter(item => item.type === 'attachment').length

  return [
    { key: 'overview', label: 'Overview', count: overviewCount },
    { key: 'note', label: 'Notes', count: noteCount },
    { key: 'communication', label: 'Communication', count: communicationCount },
    { key: 'attachment', label: 'Attachments', count: attachmentCount }
  ]
})

const availableActions = computed(() => {
  // Base actions available for opportunities
  const baseActions = ['note', 'attachment', 'email', 'whatsapp', 'sms']
  
  // AddNewButton will filter based on activeTab prop
  return baseActions
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Actions available on overview Add New button for opportunities
const overviewOpportunityActions = computed(() => {
  // Mirror lead overview actions but without requestedCar for now
  return ['tradein', 'financing']
})

const onOpportunityAddNewAction = (action) => {
  const result = handleAddNewAction(action)
  if (result && result.modalAction && activeTab.value === 'overview') {
    if (result.modalAction === 'tradein') {
      showTradeInModal.value = true
      showFinancingModal.value = false
    } else if (result.modalAction === 'financing') {
      showFinancingModal.value = true
      showTradeInModal.value = false
    }
  } else if (activeTab.value !== 'overview') {
    if (action === 'scheduleAppointment') {
      showScheduleAppointment.value = !showScheduleAppointment.value
    } else if (['addVehicle', 'configureVehicle'].includes(action)) {
      comingSoonModalTitle.value = action.replace(/([A-Z])/g, ' $1').trim()
      showComingSoonModal.value = true
    }
  }
}

const addTag = async (tagName) => {
  if (!props.opportunity.tags.includes(tagName)) {
    const updatedTags = [...(props.opportunity.tags || []), tagName]
    await opportunitiesStore.modifyOpportunity(props.opportunity.id, { tags: updatedTags })
  }
  showTagMenu.value = false
}

// Reset inline widgets when switching tabs
watch(activeTab, () => {
  showInlineWidget.value = null
  editingItem.value = null
  showScheduleAppointment.value = false
})

const handleScheduleAppointment = async (appointmentData) => {
  showScheduleAppointment.value = false
  
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
  
  // Add to inline content for immediate UI update
  inlineContent.value.push({
    id: Date.now(),
    ...appointmentActivity
  })
  
  // Also add to store
  await opportunitiesStore.addActivity(props.opportunity.id, {
    type: 'appointment',
    user: 'You',
    action: appointmentActivity.action,
    content: appointmentActivity.content,
    data: appointmentActivity.data
  })
}

const handleAppointmentCreated = async (appointmentActivity) => {
  // Add to inline content for immediate UI update
  inlineContent.value.push({
    id: Date.now(),
    ...appointmentActivity
  })
  
  // Also add to store
  await opportunitiesStore.addActivity(props.opportunity.id, {
    type: 'appointment',
    user: appointmentActivity.user,
    action: appointmentActivity.action,
    content: appointmentActivity.content,
    data: appointmentActivity.data
  })
}

const handleAddVehicle = async (vehicle) => {
  if (!opportunity?.id) return
  
  // Create an offer activity with the vehicle
  const offerActivity = {
    type: 'offer',
    user: 'You',
    action: 'created an offer',
    content: `Offer created for ${vehicle.brand} ${vehicle.model}${vehicle.year ? ` (${vehicle.year})` : ''}`,
    data: {
      vehicle: vehicle,
      price: vehicle.price,
      isMainOffer: true
    }
  }
  
  // Add the activity
  await opportunitiesStore.addActivity(opportunity.id, offerActivity)
  
  // Update opportunity stage to "In Negotiation" if it's still "Qualified"
  if (opportunity.stage === 'Qualified') {
    await opportunitiesStore.modifyOpportunity(opportunity.id, {
      stage: 'In Negotiation',
      lastActivity: new Date().toISOString()
    })
    
    // Reload the opportunity to reflect changes
    await opportunitiesStore.loadOpportunityById(opportunity.id)
  }
  
  // Add to inline content for immediate UI update
  inlineContent.value.push({
    id: Date.now(),
    type: 'offer',
    action: 'created an offer',
    content: offerActivity.content,
    data: offerActivity.data,
    timestamp: new Date().toISOString()
  })
}

const handleAddVehicleFromStock = () => {
  // Handled by OpportunityManagementWidget modal
}

const handleConfigureVehicle = () => {
  // Handled by OpportunityManagementWidget modal
}

const handleCreateOffer = () => {
  // Handled by OpportunityManagementWidget modal
}

const handleCreateOfferFromModal = ({ opportunity, offerData }) => {
  // Handle offer creation from modal in OpportunityManagementWidget
  handleWidgetSave(offerData)
}

const handleAddToOpportunity = async (car) => {
  if (!opportunity?.id) return
  
  // Create an offer activity with the recommended car
  const offerActivity = {
    type: 'offer',
    user: 'You',
    action: 'created an offer',
    content: `Offer created for ${car.brand} ${car.model}${car.year ? ` (${car.year})` : ''}`,
    data: {
      vehicle: car,
      price: car.price,
      isMainOffer: false
    }
  }
  
  // Add the activity
  await opportunitiesStore.addActivity(opportunity.id, offerActivity)
  
  // Update opportunity stage to "In Negotiation" if it's still "Qualified"
  if (opportunity.stage === 'Qualified') {
    await opportunitiesStore.modifyOpportunity(opportunity.id, {
      stage: 'In Negotiation',
      lastActivity: new Date().toISOString()
    })
    
    // Reload the opportunity to reflect changes
    await opportunitiesStore.loadOpportunityById(opportunity.id)
  }
  
  // Add to inline content for immediate UI update
  inlineContent.value.push({
    id: Date.now(),
    type: 'offer',
    action: 'created an offer',
    content: offerActivity.content,
    data: offerActivity.data,
    timestamp: new Date().toISOString()
  })
}
</script>

