<template>
  <div class="flex-1 flex flex-row overflow-hidden h-full">
    <!-- Left Column: Header, Banner, and Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden min-w-0">
      <!-- Header - Contact Card (Full Width) -->
      <header class="bg-white border-b border-gray-200 shrink-0 shadow-sm">
      <div class="px-4 md:px-8 py-4 md:py-6">
        <ContactInfo
          :initials="task.customer.initials"
          :name="task.customer.name"
          :email="task.customer.email"
          :phone="task.customer.phone"
          :third-field-value="task.customer.address"
          :avatar-color-class="getAvatarColorClass"
          :task-type="type"
          email-label="Email"
          phone-label="Phone"
          third-field-label="Address"
          @action="handleContactInfoAction"
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
              @click="openLeadPage"
              class="w-7 h-7 flex items-center justify-center bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-blue-600 hover:text-blue-700 transition-colors shrink-0"
              title="Open in new page"
            >
              <i class="fa-solid fa-external-link text-xs"></i>
            </button>
          </template>
        </ContactInfo>
      </div>
    </header>
    
      <!-- Deadline Banner (only for warnings: overdue or urgent) -->
      <div 
        v-if="task.nextActionDue && type === 'lead' && !deadlineBannerDismissed && (deadlineStatus.type === 'overdue' || deadlineStatus.type === 'urgent')"
        class="px-4 md:px-8 py-3 border-b flex items-center justify-between shrink-0"
        :class="[deadlineStatus.bgClass, deadlineStatus.borderClass]"
      >
        <div class="flex items-center gap-3">
          <div 
            class="w-10 h-10 rounded-lg flex items-center justify-center"
            :class="[deadlineStatus.bgClass, deadlineStatus.borderClass, 'border']"
          >
            <i 
              class="text-lg"
              :class="[`fa-solid ${deadlineStatus.icon}`, deadlineStatus.textClass]"
            ></i>
          </div>
          <div>
            <div class="text-xs font-medium text-gray-600 mb-0.5">Next Action Due</div>
            <div 
              class="text-sm font-bold"
              :class="deadlineStatus.textClass"
            >
              {{ formatDeadlineFull(task.nextActionDue) }}
              <span v-if="deadlineStatus.type !== 'overdue'" class="text-xs font-normal opacity-75">
                ({{ formatDueDate(task.nextActionDue) }})
              </span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div 
            v-if="deadlineStatus.type === 'overdue'"
            class="text-xs font-bold uppercase px-3 py-1.5 rounded-lg"
            :class="[deadlineStatus.bgClass, deadlineStatus.textClass, deadlineStatus.borderClass, 'border']"
          >
            <i class="fa-solid fa-exclamation-circle mr-1"></i>
            Overdue
          </div>
          <div 
            v-else-if="deadlineStatus.type === 'urgent'"
            class="text-xs font-bold uppercase px-3 py-1.5 rounded-lg"
            :class="[deadlineStatus.bgClass, deadlineStatus.textClass, deadlineStatus.borderClass, 'border']"
          >
            <i class="fa-solid fa-bolt mr-1"></i>
            Urgent
          </div>
          <button
            @click="dismissBanner"
            class="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
            title="Dismiss"
          >
            <i class="fa-solid fa-xmark text-xs"></i>
          </button>
        </div>
      </div>

      <!-- Main Content - Tabs and Activity Panel -->
      <main class="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full scrollbar-hide">
      <!-- Tabs -->
      <div class="mb-4">
        <Tabs 
          v-model="activeTab"
          :tabs="tabs"
          class="mb-0"
        />
      </div>

      <!-- Stage & Owner Bar (hide for contacts) -->
      <div v-if="activeTab === 'overview' && type !== 'contact'" class="mb-6">
        <StageOwnerBar
          :stage="task.stage"
          :owner="task.assignee"
          :source="task.source || ''"
          @reassign="handleReassign"
        />
      </div>

      <!-- Pinned Widgets Section (only on overview tab) -->
      <div v-if="activeTab === 'overview'" class="space-y-6 mb-6">
        <!-- Management widget -->
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
        <!-- Type-specific extra pinned widgets -->
        <slot name="pinned-extra" :task="task" />
      </div>

      <!-- Add New (non-overview tabs) -->
      <AddNewButton
        v-if="activeTab !== 'overview'"
        :actions="addNewConfig.tabActions"
        :active-tab="activeTab"
        @action="handleAddNewAction"
      />

      <!-- Inline widgets -->
      <div v-if="activeTab !== 'overview'">
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
    </main>
    </div>

    <!-- Right Column: Activity Summary Sidebar (Full Height) -->
    <ActivitySummarySidebar
      :title="'Activity summary'"
      :activities="allActivities"
      :collapsed="activitySidebarCollapsed"
      :show-collapse="true"
      :show="true"
      class="hidden lg:flex"
      @toggle-collapse="activitySidebarCollapsed = !activitySidebarCollapsed"
    />

    <!-- Overview Modal Widgets (Financing, Trade-in, Purchase) -->
    <Teleport to="body">
      <div 
        v-if="showOverviewModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        @click.self="closeOverviewModal"
      >
        <div 
          v-if="overviewModalType === 'financing' || overviewModalType === 'tradein'"
          class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h5 class="text-sm font-bold text-slate-800">
                {{ overviewModalType === 'financing' ? 'Add Financing' : 'Add Trade-in' }}
              </h5>
              <button @click="closeOverviewModal" class="text-gray-400 hover:text-gray-600">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <FinancingWidget
              v-if="overviewModalType === 'financing'"
              :item="null"
              :task-type="type"
              :task-id="task.id"
              @save="handleOverviewModalSave"
              @cancel="closeOverviewModal"
            />
            <TradeInWidget
              v-if="overviewModalType === 'tradein'"
              :item="null"
              :task-type="type"
              :task-id="task.id"
              @save="handleOverviewModalSave"
              @cancel="closeOverviewModal"
            />
          </div>
        </div>
        
        <div 
          v-if="overviewModalType === 'purchase'"
          class="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <OfferWidget
            :item="null"
            :task-type="type"
            :task-id="task.id"
            :requested-car="type === 'lead' ? task.requestedCar : null"
            :recommended-cars="[]"
            @save="handleOverviewModalSave"
            @cancel="closeOverviewModal"
          />
        </div>
      </div>
    </Teleport>
    
    <!-- Reassign Modal -->
    <ReassignUserModal
      :show="showReassignModal"
      @close="showReassignModal = false"
      @confirm="handleReassignConfirm"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ContactInfo from '@/components/tasks/widgets/ContactInfo.vue'
import Tabs from '@/components/tasks/widgets/Tabs.vue'
import StageOwnerBar from '@/components/tasks/widgets/StageOwnerBar.vue'
import AddNewButton from '@/components/tasks/widgets/AddNewButton.vue'
import FeedItemCard from '@/components/tasks/feed/FeedItemCard.vue'
import ActivitySummarySidebar from '@/components/tasks/widgets/ActivitySummarySidebar.vue'
import CommunicationWidget from '@/components/tasks/widgets/CommunicationWidget.vue'
import NoteWidget from '@/components/tasks/widgets/NoteWidget.vue'
import AttachmentWidget from '@/components/tasks/widgets/AttachmentWidget.vue'
import FinancingWidget from '@/components/tasks/widgets/FinancingWidget.vue'
import TradeInWidget from '@/components/tasks/widgets/TradeInWidget.vue'
import OfferWidget from '@/components/tasks/widgets/OfferWidget.vue'
import ReassignUserModal from '@/components/modals/ReassignUserModal.vue'
import { getTabForItemTypeDefault as getTabForItemType } from '@/composables/useTaskTabs'
import { useTaskInlineWidgets } from '@/composables/useTaskInlineWidgets'
import { formatDueDate, formatDeadlineFull, getDeadlineStatus } from '@/utils/formatters'

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

// Activity sidebar collapse state - always expanded by default
const activitySidebarCollapsed = ref(false)

// Deadline banner dismissal state - tracked per task ID
const dismissedBanners = ref(new Set())
const deadlineBannerDismissed = computed(() => dismissedBanners.value.has(props.task.id))

const dismissBanner = () => {
  dismissedBanners.value.add(props.task.id)
}

// Check if we're on the tasks view (not the lead view)
const isTasksView = computed(() => {
  return route.path.startsWith('/tasks') && !route.path.startsWith('/lead')
})

// Open lead page in standalone view
const openLeadPage = () => {
  router.push({ 
    path: `/lead/${props.task.id}`, 
    query: { stage: props.type } 
  })
}

// Handle reassign from StageOwnerBar
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

// Deadline status for banner
const deadlineStatus = computed(() => {
  return getDeadlineStatus(props.task.nextActionDue)
})

// Modal state for overview actions (financing, tradein, purchase)
const showOverviewModal = ref(false)
const overviewModalType = ref(null)
const triggerAppointmentModal = ref(false)
const showReassignModal = ref(false)

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
  // For opportunities, handle appointment differently
  if (action === 'appointment' && props.type === 'opportunity') {
    triggerAppointmentModal.value = !triggerAppointmentModal.value
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
          const inlineWidget = document.querySelector('.animate-fade-in')
          if (inlineWidget) {
            inlineWidget.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
</script>


