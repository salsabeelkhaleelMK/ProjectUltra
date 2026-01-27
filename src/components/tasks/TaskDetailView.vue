<template>
  <div class="relative flex-1 flex flex-col min-w-0 overflow-hidden">
    <div v-if="task" class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <!-- Task Header -->
      <TaskDetailHeader
        :task="task"
        :filtered-tasks="filteredTasks"
        :is-drawer-view="isDrawerView"
        @previous="handlePrevious"
        @next="handleNext"
        @close="$emit('close')"
      />

      <!-- Center + Right Panels Row -->
      <div class="flex flex-1 overflow-hidden">
        <!-- Center Panel: Task Management Widget Only -->
        <div class="flex-1 flex flex-col overflow-hidden bg-white min-w-0">
          <div class="flex-1 overflow-y-auto">
            <div class="p-2">
              <TaskManagementCard
                :task="task"
                :type="task.type"
                :management-widget="managementWidget"
                :activities="allActivities"
                v-bind="$attrs"
              />
            </div>
          </div>
        </div>

        <!-- Right Sidebar with Tabs -->
        <div
          class="right-sidebar flex flex-col overflow-hidden shrink-0 border-l border-black/5 bg-surface"
        >
          <Tabs v-model="sidebarTab" class="flex flex-col flex-1 overflow-hidden">
            <!-- Sidebar Tabs -->
            <TabsList class="flex border-b border-black/5 bg-white rounded-none w-full relative h-full">
              <TabsTrigger 
                value="request" 
                class="flex items-center gap-2 text-sm font-medium transition-all relative flex-1 justify-center bg-transparent outline-none h-full"
                :class="sidebarTab === 'request' 
                  ? 'text-heading' 
                  : 'text-sub hover:text-body'"
              >
                <span>Request</span>
                <span 
                  v-if="requestCount > 0"
                  class="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold leading-none"
                  :class="sidebarTab === 'request' 
                    ? 'bg-[#0470e9] text-white' 
                    : 'bg-gray-200 text-heading'"
                >
                  {{ requestCount }}
                </span>
                <span 
                  v-if="sidebarTab === 'request'"
                  class="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0470e9] z-10"
                ></span>
              </TabsTrigger>
              <TabsTrigger 
                value="activity" 
                class="flex items-center gap-2 text-sm font-medium transition-all relative flex-1 justify-center bg-transparent outline-none h-full"
                :class="sidebarTab === 'activity' 
                  ? 'text-heading' 
                  : 'text-sub hover:text-body'"
              >
                <span>Activity</span>
                <span 
                  v-if="activityCount > 0"
                  class="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold leading-none"
                  :class="sidebarTab === 'activity' 
                    ? 'bg-[#0470e9] text-white' 
                    : 'bg-gray-200 text-heading'"
                >
                  {{ activityCount }}
                </span>
                <span 
                  v-if="sidebarTab === 'activity'"
                  class="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0470e9] z-10"
                ></span>
              </TabsTrigger>
            </TabsList>
            
            <!-- Sidebar Content -->
            <div class="flex-1 overflow-y-auto bg-[#F8F8F8]">
              <!-- Request Tab -->
              <TabsContent value="request" class="space-y-2 p-2 mt-0">
                <TaskContactCard
                  :task="task"
                  :task-type="task.type"
                  :customer-id="task.customerId || task.customer?.id"
                  @action="handleContactAction"
                />
                <VehicleRequestCard
                  v-if="task.requestedCar || task.vehicle"
                  :vehicle="task.requestedCar || task.vehicle"
                  :request-message="task.requestMessage || task.requestedCar?.requestMessage"
                  :source="task.source"
                  :image-url="getCarImageUrl(task.requestedCar || task.vehicle)"
                  @open-ad="handleOpenAd"
                  @more-actions="handleMoreActions"
                />
              </TabsContent>
              
              <!-- Activity Tab -->
              <TabsContent value="activity" class="p-2 flex-1 overflow-hidden h-full flex flex-col mt-0">
                <TaskActivityCard
                  :activities="allActivities"
                  :expanded-summaries="expandedSummaries"
                  @activity-click="handleActivityClick"
                  @toggle-summary-expanded="toggleSummaryExpanded"
                  @add-activity="handleAddActivity"
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex-1 flex items-center justify-center bg-surface">
      <div class="text-center max-w-sm p-8">
        <div class="w-16 h-16 mx-auto mb-4 rounded-card bg-surfaceSecondary flex items-center justify-center">
          <i class="fa-solid fa-tasks text-2xl text-sub"></i>
        </div>
        <h3 class="text-fluid-lg font-bold text-heading mb-2">No task selected</h3>
        <p class="text-fluid-sm text-sub">Select a task from the list to view its details and manage activities</p>
      </div>
    </div>
    
    <!-- Activity Modals -->
    <NoteWidget
      modal
      :show="showNoteModal"
      :task-type="task?.type || 'lead'"
      :task-id="task?.id"
      @save="handleNoteSave"
      @close="showNoteModal = false"
    />
    
    <AttachmentWidget
      modal
      :show="showAttachmentModal"
      :task-type="task?.type || 'lead'"
      :task-id="task?.id"
      @save="handleAttachmentSave"
      @close="showAttachmentModal = false"
    />
    
    <AddWhatsAppModal
      :show="showWhatsAppModal"
      @save="handleWhatsAppSave"
      @close="showWhatsAppModal = false"
    />
    
    <AddSMSModal
      :show="showSMSModal"
      @save="handleSMSSave"
      @close="showSMSModal = false"
    />
    
    <AddEmailModal
      :show="showEmailModal"
      @save="handleEmailSave"
      @close="showEmailModal = false"
    />
    
    <ComingSoonModal
      :show="showComingSoonModal"
      title="Call Feature"
      @close="showComingSoonModal = false"
    />
    
    <PurchaseMethodModal
      :show="showFinancingModal"
      :task-type="task?.type || 'lead'"
      :task-id="task?.id"
      @save="handleFinancingSave"
      @close="showFinancingModal = false"
    />
    
    <AddVehicleModal
      :show="showTradeInModal"
      mode="tradein"
      :task-type="task?.type || 'lead'"
      :task-id="task?.id"
      @save="handleTradeInSave"
      @close="showTradeInModal = false"
    />
    
    <OfferModal
      :show="showOfferModal"
      :task-type="task?.type || 'lead'"
      :task-id="task?.id"
      :customer="task?.customer"
      @save="handleOfferSave"
      @close="showOfferModal = false"
    />
    
    <CreateEventModal
      :show="showAppointmentModal"
      :customer="task?.customer"
      :assignee="task?.assignee"
      @create="handleAppointmentSave"
      @cancel="showAppointmentModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@motork/component-library/future/primitives'
import { useLeadsStore } from '@/stores/leads'
import { useOpportunitiesStore } from '@/stores/opportunities'
import TaskDetailHeader from './TaskDetailHeader.vue'
import TaskManagementCard from './TaskManagementCard.vue'
import TaskContactCard from './TaskContactCard.vue'
import VehicleRequestCard from './VehicleRequestCard.vue'
import TaskActivityCard from './TaskActivityCard.vue'
import NoteWidget from '@/components/customer/activities/NoteWidget.vue'
import AttachmentWidget from '@/components/customer/activities/AttachmentWidget.vue'
import AddWhatsAppModal from '@/components/modals/AddWhatsAppModal.vue'
import AddSMSModal from '@/components/modals/AddSMSModal.vue'
import AddEmailModal from '@/components/modals/AddEmailModal.vue'
import ComingSoonModal from '@/components/modals/ComingSoonModal.vue'
import PurchaseMethodModal from '@/components/modals/PurchaseMethodModal.vue'
import AddVehicleModal from '@/components/modals/AddVehicleModal.vue'
import OfferModal from '@/components/modals/OfferModal.vue'
import CreateEventModal from '@/components/modals/CreateEventModal.vue'

const props = defineProps({
  task: { 
    type: Object, 
    default: null 
  },
  managementWidget: { 
    type: Object, 
    required: true 
  },
  storeAdapter: { 
    type: Object, 
    required: true 
  },
  addNewConfig: { 
    type: Object, 
    required: true 
  },
  filteredTasks: { 
    type: Array, 
    default: () => [] 
  },
  isDrawerView: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['task-navigate', 'close'])

const leadsStore = useLeadsStore()
const opportunitiesStore = useOpportunitiesStore()

// Sidebar tab state
const sidebarTab = ref('request')

// Expanded summaries state for activity details
const expandedSummaries = ref({})

// Activity modals
const showNoteModal = ref(false)
const showAttachmentModal = ref(false)
const showWhatsAppModal = ref(false)
const showSMSModal = ref(false)
const showEmailModal = ref(false)
const showComingSoonModal = ref(false)
const showFinancingModal = ref(false)
const showTradeInModal = ref(false)
const showOfferModal = ref(false)
const showAppointmentModal = ref(false)

// Activities
const allActivities = computed(() => {
  return props.storeAdapter.currentActivities?.value || []
})

// Badge counts
const activityCount = computed(() => {
  return allActivities.value.length
})

const requestCount = computed(() => {
  if (!props.task?.customer) return 0
  
  const customerEmail = props.task.customer.email
  const customerPhone = props.task.customer.phone
  const currentTaskId = props.task.compositeId || `${props.task.type}-${props.task.id}`
  
  // Combine all leads and opportunities
  const allTasks = [
    ...(leadsStore.leads || []).map(lead => ({ ...lead, type: 'lead', compositeId: `lead-${lead.id}` })),
    ...(opportunitiesStore.opportunities || []).map(opp => ({ ...opp, type: 'opportunity', compositeId: `opportunity-${opp.id}` }))
  ]
  
  // Filter by same customer (email or phone match) and exclude current task
  const relatedTasks = allTasks.filter(task => {
    if (task.compositeId === currentTaskId) return false
    if (!task.customer) return false
    
    return task.customer.email === customerEmail || task.customer.phone === customerPhone
  })
  
  return relatedTasks.length
})

// Navigation handlers
const handlePrevious = () => {
  emit('task-navigate', 'previous')
}

const handleNext = () => {
  emit('task-navigate', 'next')
}

// Activity interaction
const handleActivityClick = (activity) => {
  // Switch to activity tab if not already there
  if (sidebarTab.value !== 'activity') {
    sidebarTab.value = 'activity'
  }
  // Could open a modal here for detailed view
  console.log('Activity clicked:', activity)
}

const toggleSummaryExpanded = (activityId) => {
  expandedSummaries.value[activityId] = !expandedSummaries.value[activityId]
}

// Action handlers
const getCarImageUrl = (vehicle) => {
  if (!vehicle) return ''
  return vehicle.image || vehicle.imageUrl || ''
}

const handleOpenAd = () => {
  console.log('Open ad clicked')
}

const handleMoreActions = () => {
  console.log('More actions clicked')
}

const handleContactAction = (action) => {
  console.log('Contact action:', action)
}

// Handle add activity from TaskActivityCard
const handleAddActivity = (activityType) => {
  if (activityType === 'note') {
    showNoteModal.value = true
  } else if (activityType === 'attachment') {
    showAttachmentModal.value = true
  } else if (activityType === 'whatsapp') {
    showWhatsAppModal.value = true
  } else if (activityType === 'sms') {
    showSMSModal.value = true
  } else if (activityType === 'email') {
    showEmailModal.value = true
  } else if (activityType === 'call') {
    showComingSoonModal.value = true
  } else if (activityType === 'financing') {
    showFinancingModal.value = true
  } else if (activityType === 'tradein') {
    showTradeInModal.value = true
  } else if (activityType === 'purchase') {
    showOfferModal.value = true
  } else if (activityType === 'appointment') {
    showAppointmentModal.value = true
  }
}

// Activity modal save handlers
const handleNoteSave = async (noteData) => {
  try {
    await props.storeAdapter.addActivity(props.task.id, {
      type: 'note',
      content: noteData.content || noteData.message,
      message: noteData.content || noteData.message,
      timestamp: new Date().toISOString()
    })
    showNoteModal.value = false
  } catch (error) {
    console.error('Error saving note:', error)
  }
}

const handleAttachmentSave = async (attachmentData) => {
  try {
    await props.storeAdapter.addActivity(props.task.id, {
      type: 'attachment',
      fileName: attachmentData.fileName,
      file: attachmentData.file,
      content: `Attachment: ${attachmentData.fileName}`,
      timestamp: new Date().toISOString()
    })
    showAttachmentModal.value = false
  } catch (error) {
    console.error('Error saving attachment:', error)
  }
}

const handleWhatsAppSave = async (data) => {
  try {
    await props.storeAdapter.addActivity(props.task.id, {
      type: 'whatsapp',
      message: data.message,
      content: data.message,
      template: data.template,
      timestamp: new Date().toISOString()
    })
    showWhatsAppModal.value = false
  } catch (error) {
    console.error('Error saving WhatsApp:', error)
  }
}

const handleSMSSave = async (data) => {
  try {
    await props.storeAdapter.addActivity(props.task.id, {
      type: 'sms',
      message: data.message,
      content: data.message,
      template: data.template,
      timestamp: new Date().toISOString()
    })
    showSMSModal.value = false
  } catch (error) {
    console.error('Error saving SMS:', error)
  }
}

const handleEmailSave = async (data) => {
  try {
    await props.storeAdapter.addActivity(props.task.id, {
      type: 'email',
      subject: data.subject,
      message: data.message,
      content: data.message,
      template: data.template,
      timestamp: new Date().toISOString()
    })
    showEmailModal.value = false
  } catch (error) {
    console.error('Error saving email:', error)
  }
}

const handleFinancingSave = async (data) => {
  try {
    await props.storeAdapter.addActivity(props.task.id, {
      type: 'financing',
      action: data.action || 'added a financing proposal',
      content: data.content || `Financing: ${data.data?.product || 'Unknown'}`,
      data: data.data,
      timestamp: new Date().toISOString()
    })
    showFinancingModal.value = false
  } catch (error) {
    console.error('Error saving financing:', error)
  }
}

const handleTradeInSave = async (data) => {
  try {
    await props.storeAdapter.addActivity(props.task.id, {
      type: 'tradein',
      action: 'added a trade-in',
      content: data.content || 'Trade-in vehicle added',
      data: data.data,
      timestamp: new Date().toISOString()
    })
    showTradeInModal.value = false
  } catch (error) {
    console.error('Error saving trade-in:', error)
  }
}

const handleOfferSave = async (data) => {
  try {
    await props.storeAdapter.addActivity(props.task.id, {
      type: 'offer',
      action: data.action || 'created an offer',
      content: data.content || `Offer: €${data.data?.price || 0}`,
      data: data.data,
      timestamp: new Date().toISOString()
    })
    showOfferModal.value = false
  } catch (error) {
    console.error('Error saving offer:', error)
  }
}

const handleAppointmentSave = async (data) => {
  try {
    await props.storeAdapter.addActivity(props.task.id, {
      type: 'appointment',
      action: 'scheduled an appointment',
      content: `Appointment: ${data.type || 'Meeting'} on ${data.date || ''}`,
      data: data,
      timestamp: new Date().toISOString()
    })
    showAppointmentModal.value = false
  } catch (error) {
    console.error('Error saving appointment:', error)
  }
}
</script>

<style scoped>
/* Right sidebar responsive widths */
.right-sidebar {
  width: 320px;
  min-width: 320px;
}

@media (min-width: 1440px) {
  .right-sidebar {
    width: 360px;
    min-width: 360px;
  }
}

@media (min-width: 1600px) {
  .right-sidebar {
    width: 420px;
    min-width: 420px;
  }
}

/* Tab styling overrides to ensure proper appearance */
:deep([role="tablist"]) {
  border: none !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
  padding: 0 !important;
  margin: 0 !important;
  gap: 0 !important;
  height: auto !important;
  min-height: 48px !important;
}

:deep([role="tab"]) {
  background: transparent !important;
  border: none !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  border-bottom: none !important;
  margin: 0 !important;
  padding: 12px 16px !important;
  position: relative !important;
  box-shadow: none !important;
  height: 100% !important;
  min-height: 48px !important;
}

:deep([role="tab"]:not(:last-child)) {
  border-right: none !important;
}

:deep([role="tab"]::before),
:deep([role="tab"]::after) {
  display: none !important;
  box-shadow: none !important;
}

:deep([role="tab"] *) {
  box-shadow: none !important;
}

:deep([role="tab"][data-state="active"]) {
  color: var(--color-text-heading) !important;
  box-shadow: none !important;
}

:deep([role="tab"][data-state="inactive"]) {
  color: var(--color-text-sub) !important;
  box-shadow: none !important;
}
</style>
