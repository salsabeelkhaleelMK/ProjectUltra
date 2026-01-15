<template>
  <div class="flex-1 flex flex-col overflow-hidden h-full">
    <!-- Header - Contact Card (Full Width) -->
    <header class="bg-white border-b border-gray-200 shrink-0">
      <div class="px-4 md:px-8 py-3 md:py-4">
        <ContactInfo
          :initials="task.customer.initials"
          :name="task.customer.name"
          :email="task.customer.email"
          :phone="task.customer.phone"
          :third-field-value="task.customer.address"
          :avatar-color-class="getAvatarColorClass"
          :task-type="type"
          :customer-id="task.customer?.id || task.customerId || task.id"
          email-label="Email"
          phone-label="Phone"
          third-field-label="Address"
          @action="handleContactInfoAction"
          @add-tag="showAddTagModal = true"
        >
          <template #tags>
            <span 
              v-for="tag in task.tags" 
              :key="tag"
              class="badge-ui bg-blue-50 border-blue-100 text-blue-700 font-semibold"
            >
              {{ tag }}
            </span>
          </template>
          <template #name-action>
            <button
              v-if="isTasksView"
              @click="openCustomerPage"
              class="w-6 h-6 flex items-center justify-center bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-blue-600 hover:text-blue-700 transition-colors shrink-0"
              title="Open in new page"
              aria-label="Open customer page"
            >
              <i class="fa-solid fa-external-link text-xs"></i>
            </button>
          </template>
        </ContactInfo>
      </div>
    </header>

    <!-- Two-column layout: Tabs+Content | Activity Timeline -->
    <div class="flex-1 flex flex-row overflow-hidden">
      <!-- Left: Tabs and Content -->
      <div class="flex-1 flex flex-col overflow-hidden min-w-0">
        <!-- Content area with feed -->
        <main class="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
          <!-- Tabs -->
          <div class="mb-4">
            <Tabs 
              v-model="activeTab"
              :tabs="tabs"
              class="mb-0"
            />
          </div>
          <!-- Overview tab content -->
          <div v-if="activeTab === 'overview'">
            <!-- Request Component (Stage/Owner/Source + Request Details) - hide for contacts -->
            <div v-if="type !== 'contact'">
              <Request
                :stage="task.displayStage || task.stage"
                :owner="task.assignee"
                :source="task.source || ''"
                :delivery-substatus="task.deliverySubstatus"
                :activities="task.activities || []"
                :entity-type="type"
                :request-type="task.requestType || task.requestedCar?.requestType || ''"
                :request-message="task.requestedCar?.requestMessage || ''"
                :requested-car="task.requestedCar"
                :task="task"
                @reassign="handleReassign"
              />
            </div>

            <!-- Manage Next Steps widget -->
            <div v-if="managementWidget" class="mb-6">
              <component
                :is="managementWidget"
                :lead="type === 'lead' ? task : undefined"
                :opportunity="type === 'opportunity' ? task : undefined"
                :contact="type === 'contact' ? task : undefined"
                :activities="allActivities"
                @car-added="$emit('car-added', $event)"
                @convert-to-lead="$emit('convert-to-lead')"
                @convert-to-opportunity="$emit('convert-to-opportunity')"
                @vehicle-selected="handleVehicleSelected"
                @create-offer="handleCreateOffer"
              />
            </div>

            <!-- Feed timeline (other overview items) -->
            <div v-if="filteredInlineContent.length > 0" class="space-y-4 mb-6 px-1">
              <FeedItemCard
                v-for="item in filteredInlineContent"
                :key="item.id"
                :item="item"
                :task-type="type"
                :customer-initials="'SK'"
                @edit="handleEditItem"
                @delete="handleDeleteItem"
              />
            </div>
          </div>
          
          <!-- Other tab content (Notes, Communication, Attachments) -->
          <div v-else>
            <!-- Add New (non-overview tabs) -->
            <AddNewButton
              :actions="addNewConfig.tabActions"
              :active-tab="activeTab"
              @action="handleAddNewAction"
            />

            <!-- Inline widgets -->
            <div>
              <CommunicationWidget
                v-if="showInlineWidget === 'communication'"
                :type="communicationType"
                :task-type="type"
                :task-id="task.id"
                :item="editingItem"
                @save="handleWidgetSave"
                @cancel="handleWidgetCancel"
              />

              <NoteWidget
                v-if="showInlineWidget === 'note'"
                :item="editingItem"
                :task-type="type"
                :task-id="task.id"
                @save="handleWidgetSave"
                @cancel="handleWidgetCancel"
              />

              <AttachmentWidget
                v-if="showInlineWidget === 'attachment'"
                :item="editingItem"
                :task-type="type"
                :task-id="task.id"
                @save="handleWidgetSave"
                @cancel="handleWidgetCancel"
              />
            </div>

            <!-- Feed -->
            <div v-if="filteredInlineContent.length > 0" class="space-y-4 mb-6 px-1">
              <FeedItemCard
                v-for="item in filteredInlineContent"
                :key="item.id"
                :item="item"
                :task-type="type"
                :customer-initials="'SK'"
                @edit="handleEditItem"
                @delete="handleDeleteItem"
              />
            </div>
          </div>
        </main>
      </div>

      <!-- Right: Activity Timeline (collapsed by default) -->
      <ActivitySummarySidebar
        :title="'Activity summary'"
        :activities="allActivities"
        :collapsed="activitySidebarCollapsed"
        :show-collapse="true"
        :show="true"
        class="hidden lg:flex"
        @toggle-collapse="activitySidebarCollapsed = !activitySidebarCollapsed"
      />
    </div>

    <!-- Financing Modal -->
    <FinancingModal
      :show="overviewModalType === 'financing' && showOverviewModal"
      :item="null"
      :task-type="type"
      :task-id="task.id"
      @save="handleOverviewModalSave"
      @close="closeOverviewModal"
    />
    
    <!-- Trade-In Modal -->
    <TradeInModal
      :show="overviewModalType === 'tradein' && showOverviewModal"
      :item="null"
      :task-type="type"
      :task-id="task.id"
      @save="handleOverviewModalSave"
      @close="closeOverviewModal"
    />
    
    <!-- Offer/Purchase Modal -->
    <OfferModal
      :show="overviewModalType === 'purchase' && showOverviewModal"
      :item="null"
      :task-type="type"
      :task-id="task.id"
      :requested-car="type === 'lead' ? task.requestedCar : null"
      :recommended-cars="[]"
      @save="handleOverviewModalSave"
      @close="closeOverviewModal"
    />
    
    <!-- Reassign Modal -->
    <ReassignUserModal
      :show="showReassignModal"
      @close="showReassignModal = false"
      @confirm="handleReassignConfirm"
    />
    
    <!-- Create Appointment Modal -->
    <CreateEventModal
      v-if="showCreateAppointmentModal"
      :show="showCreateAppointmentModal"
      :customer="task.customer"
      :assignee="task.assignee"
      :disabled-fields="['customer']"
      @create="handleAppointmentCreated"
      @cancel="showCreateAppointmentModal = false"
    />
    
    <!-- Add Tag Modal -->
    <AddTagModal
      :show="showAddTagModal"
      :existing-tags="task.tags || []"
      @close="showAddTagModal = false"
      @add="handleAddTag"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ContactInfo from '@/components/customer/widgets/ContactInfo.vue'
import Tabs from '@/components/customer/widgets/Tabs.vue'
import Request from '@/components/shared/Request.vue'
import AddNewButton from '@/components/customer/widgets/AddNewButton.vue'
import FeedItemCard from '@/components/customer/feed/FeedItemCard.vue'
import ActivitySummarySidebar from '@/components/customer/widgets/ActivitySummarySidebar.vue'
import CommunicationWidget from '@/components/customer/activities/CommunicationWidget.vue'
import NoteWidget from '@/components/customer/activities/NoteWidget.vue'
import AttachmentWidget from '@/components/customer/activities/AttachmentWidget.vue'
import ReassignUserModal from '@/components/modals/ReassignUserModal.vue'
import CreateEventModal from '@/components/modals/CreateEventModal.vue'
import FinancingModal from '@/components/modals/FinancingModal.vue'
import TradeInModal from '@/components/modals/TradeInModal.vue'
import OfferModal from '@/components/modals/OfferModal.vue'
import AddTagModal from '@/components/modals/AddTagModal.vue'
import { getTabForItemTypeDefault as getTabForItemType } from '@/composables/useTaskTabs'
import { useTaskInlineWidgets } from '@/composables/useTaskInlineWidgets'

const props = defineProps({
  task: { type: Object, required: true },
  type: { type: String, required: true }, // 'lead' | 'opportunity' | 'contact'
  managementWidget: { type: Object, required: true },
  storeAdapter: { type: Object, required: true }, // { currentActivities, addActivity, updateActivity, deleteActivity }
  addNewConfig: {
    type: Object,
    required: true // { overviewActions: [], tabActions: [] }
  }
})

const emit = defineEmits(['car-added', 'convert-to-lead', 'convert-to-opportunity'])

const route = useRoute()
const router = useRouter()

const taskId = computed(() => props.task.id)

// Avatar color class based on type
const getAvatarColorClass = computed(() => {
  if (props.type === 'contact') return 'bg-blue-100 text-blue-600'
  if (props.type === 'lead') return 'bg-orange-100 text-orange-600'
  return 'bg-purple-100 text-purple-600' // opportunity
})

// Check if we're on the tasks view (not the customer view)
const isTasksView = computed(() => {
  return route.path.startsWith('/tasks') && !route.path.startsWith('/customer')
})

// Activity sidebar collapse state - collapsed by default on tasks page, expanded on customer page
const activitySidebarCollapsed = ref(route.path.startsWith('/tasks') && !route.path.startsWith('/customer'))

// Watch route changes to update sidebar state
watch(() => route.path, (newPath) => {
  activitySidebarCollapsed.value = newPath.startsWith('/tasks') && !newPath.startsWith('/customer')
})

// Open customer page in standalone view
const openCustomerPage = () => {
  router.push({ 
    path: `/customer/${props.task.id}`, 
    query: { type: props.type } 
  })
}

// Handle reassign from Request component
function handleAppointmentCreated(eventData) {
  showCreateAppointmentModal.value = false
  // Emit event to parent or handle appointment creation
  // TODO: Integrate with calendar API
}

const handleReassign = () => {
  showReassignModal.value = true
}

const handleReassignConfirm = async (assignee) => {
  const assigneeName = assignee.name
  
  if (props.type === 'lead') {
    await props.storeAdapter.updateLead?.(props.task.id, { 
      assignee: assigneeName,
      assigneeType: assignee.type,
      teamId: assignee.type === 'team' ? assignee.id : null
    })
  } else if (props.type === 'opportunity') {
    await props.storeAdapter.updateOpportunity?.(props.task.id, { 
      assignee: assigneeName,
      assigneeType: assignee.type,
      teamId: assignee.type === 'team' ? assignee.id : null
    })
  }
  
  showReassignModal.value = false
}

// Modal state for overview actions (financing, tradein, purchase)
const showOverviewModal = ref(false)
const overviewModalType = ref(null)
const showCreateAppointmentModal = ref(false)
const showReassignModal = ref(false)
const showAddTagModal = ref(false)

const {
  activeTab,
  showInlineWidget,
  editingItem,
  communicationType,
  inlineContent,
  filteredInlineContent,
  handleAddNewAction: handleAddNewActionBase,
  handleWidgetSave,
  handleWidgetCancel,
  handleEditItem,
  handleDeleteItem
} = useTaskInlineWidgets({
  store: props.storeAdapter,
  taskId,
  getTabForItemType,
  isOverviewModalAction: (action) =>
    activeTab.value === 'overview' && props.addNewConfig.overviewActions.includes(action)
})

// Watch for task changes and reset to overview tab
watch(() => props.task.id, () => {
  activeTab.value = 'overview'
})

// Wrapper to handle modal actions
const handleAddNewAction = (action) => {
  const result = handleAddNewActionBase(action)
  
  // Check if it's an overview modal action
  if (result && result.modalAction) {
    overviewModalType.value = result.modalAction
    showOverviewModal.value = true
  }
}

// Handle actions from ContactInfo "+" button
const handleContactInfoAction = (action) => {
  // For appointments, open CreateEventModal
  if (action === 'appointment') {
    showCreateAppointmentModal.value = true
    return
  }
  
  // Map actions to tabs
  const actionToTab = {
    'note': 'note',
    'attachment': 'attachment',
    'email': 'communication',
    'whatsapp': 'communication',
    'sms': 'communication',
    'call': 'communication',
    'appointment': 'overview'
  }
  
  // Route to appropriate handler
  if (['financing', 'tradein', 'purchase'].includes(action)) {
    overviewModalType.value = action
    showOverviewModal.value = true
  } else {
    // For tab-based actions, switch to the appropriate tab
    const targetTab = actionToTab[action]
    if (targetTab) {
      activeTab.value = targetTab
      // Trigger the action after tab switch
      setTimeout(() => {
        handleAddNewAction(action)
        // Scroll to inline widget after a brief delay
        setTimeout(() => {
          try {
            const inlineWidget = document.querySelector('.animate-fade-in')
            // Check if element exists and is still in the DOM
            if (inlineWidget && inlineWidget.parentNode) {
              inlineWidget.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          } catch (error) {
            // Silently handle DOM access errors
          }
        }, 100)
      }, 50)
    } else {
      // For other actions, use the existing handler
      handleAddNewAction(action)
    }
  }
}

// Close modal
const closeOverviewModal = () => {
  showOverviewModal.value = false
  overviewModalType.value = null
}

// Handle modal save
const handleOverviewModalSave = async (data) => {
  await handleWidgetSave(data)
  closeOverviewModal()
}

const tabs = computed(() => {
  const allItems = [...props.storeAdapter.currentActivities.value, ...inlineContent.value]
  
  // Count items by their actual tab mapping
  const overviewCount = allItems.filter(item => {
    const tabKey = getTabForItemType(item.type)
    return tabKey === 'overview'
  }).length
  
  const communicationCount = allItems.filter(item =>
    ['call', 'email', 'sms', 'whatsapp', 'communication'].includes(item.type)
  ).length
  const noteCount = allItems.filter(item => item.type === 'note').length
  const attachmentCount = allItems.filter(item => item.type === 'attachment').length

  return [
    { key: 'overview', label: 'Overview', count: overviewCount },
    { key: 'note', label: 'Notes', count: noteCount },
    { key: 'communication', label: 'Communication', count: communicationCount },
    { key: 'attachment', label: 'Attachments', count: attachmentCount }
  ]
})

const allActivities = computed(() => [
  ...props.storeAdapter.currentActivities.value,
  ...inlineContent.value
])

// Computed title for overview modals
const overviewModalTitle = computed(() => {
  if (overviewModalType.value === 'financing') return 'Add Financing'
  if (overviewModalType.value === 'tradein') return 'Add Trade-in'
  if (overviewModalType.value === 'purchase') return 'Create Purchase Offer'
  return ''
})

// Handle vehicle selection from OpportunityManagementWidget
const handleVehicleSelected = async (data) => {
  if (props.type !== 'opportunity') return
  
  try {
    await props.storeAdapter.addVehicle(props.task.id, data.vehicleData)
    // Reload the opportunity to get updated data
    if (props.storeAdapter.loadOpportunityById) {
      await props.storeAdapter.loadOpportunityById(props.task.id)
    }
  } catch (error) {
    console.error('Error selecting vehicle:', error)
  }
}

// Handle offer creation from OpportunityManagementWidget
const handleCreateOffer = async (data) => {
  if (props.type !== 'opportunity') return
  
  try {
    await props.storeAdapter.createOffer(props.task.id, data.offerData)
    // Reload the opportunity to get updated stage and activities
    if (props.storeAdapter.loadOpportunityById) {
      await props.storeAdapter.loadOpportunityById(props.task.id)
    }
  } catch (error) {
    console.error('Error creating offer:', error)
  }
}

// Handle tag addition
const handleAddTag = async (tagName) => {
  const currentTags = props.task.tags || []
  
  // Check if tag already exists
  if (currentTags.includes(tagName)) {
    showAddTagModal.value = false
    return
  }
  
  const updatedTags = [...currentTags, tagName]
  
  try {
    if (props.type === 'lead') {
      await props.storeAdapter.updateLead?.(props.task.id, { tags: updatedTags })
    } else if (props.type === 'opportunity') {
      await props.storeAdapter.updateOpportunity?.(props.task.id, { tags: updatedTags })
    }
    
    // Reload the task to get updated data
    if (props.type === 'lead' && props.storeAdapter.loadLeadById) {
      await props.storeAdapter.loadLeadById(props.task.id)
    } else if (props.type === 'opportunity' && props.storeAdapter.loadOpportunityById) {
      await props.storeAdapter.loadOpportunityById(props.task.id)
    }
    
    showAddTagModal.value = false
  } catch (error) {
    console.error('Error adding tag:', error)
  }
}
</script>

