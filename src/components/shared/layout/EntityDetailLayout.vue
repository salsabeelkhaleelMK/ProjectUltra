<template>
  <div class="flex-1 flex flex-col overflow-hidden h-full">
    <!-- Header - Contact Card (Full Width) -->
    <!-- Contact Info Header (only shown for customer view, not tasks) -->
    <CustomerContactHeader
      v-if="!isTasksView"
      :initials="task.customer.initials"
      :name="task.customer.name"
      :email="task.customer.email"
      :phone="task.customer.phone"
      :third-field-value="task.customer.address"
      :avatar-color-class="getAvatarColorClass"
      :task-type="type"
      :customer-id="task.customer?.id || task.customerId || task.id"
      :tags="task.tags || []"
      :show-close-button="showCloseButton"
      email-label="Email"
      phone-label="Phone"
      third-field-label="Address"
      @add-tag="showAddTagModal = true"
      @close="$emit('close')"
    >
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
    </CustomerContactHeader>

    <!-- DEFAULT VIEW: Two-column layout with Tabs+Content | Activity Timeline (only for customer view) -->
    <div v-if="!isTasksView" class="flex-1 flex flex-row overflow-hidden">
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

            <!-- Pinned Extra Slot - for customer-specific widgets (CustomerSummaryWidget, VehiclesCarousel, etc.) -->
            <slot name="pinned-extra" :task="task" />

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
                @view-history="handleViewHistory"
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
          
          <!-- Other tab content (Notes, Communication, Attachments, Negotiations, Appointments) -->
          <div v-else>
            <!-- Customer-only: Negotiations tab (Leads + Opportunities) -->
            <div v-if="type === 'contact' && activeTab === 'negotiations'">
              <slot name="tab-negotiations" />
            </div>
            <!-- Customer-only: Appointments tab -->
            <div v-else-if="type === 'contact' && activeTab === 'appointments'">
              <!-- + Add appointment row (same pattern as AddNewButton on other tabs) -->
              <div class="relative flex items-center py-1 mb-4">
                <div class="flex-grow border-t border"></div>
                <div class="relative mx-4">
                  <button
                    v-if="!showInlineAppointmentForm"
                    @click.stop="showInlineAppointmentForm = true"
                    class="bg-surface hover:bg-surfaceSecondary text-body font-medium rounded-full text-sm shadow-sm transition-all flex items-center justify-center px-4 py-2 h-9 border border-E5E7EB"
                  >
                    <i class="fa-solid fa-plus text-xs text-body"></i>
                    <span class="ml-1.5 text-body">add appointment</span>
                  </button>
                </div>
                <div class="flex-grow border-t border"></div>
              </div>

              <!-- Inline Add Appointment form (same form as modal, inline wrapper like NoteWidget) -->
              <div
                v-if="showInlineAppointmentForm"
                class="animate-fade-in relative bg-surface border border-E5E7EB rounded-xl p-5 shadow-sm mb-6"
              >
                <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-surface border-t border-l border-E5E7EB rotate-45"></div>
                <div class="flex justify-between items-center mb-4">
                  <h5 class="text-sm font-semibold text-heading">Add Appointment</h5>
                  <button
                    type="button"
                    @click="showInlineAppointmentForm = false"
                    class="text-sub hover:text-body"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
                <CreateEventForm
                  :key="'inline-appointment'"
                  :customer="task.customer"
                  :assignee="task.assignee"
                  :disabled-fields="['customer']"
                  :initial-date="initialDateToday"
                  :dealerships="dealerships"
                  :show-actions="true"
                  :reset-trigger="showInlineAppointmentForm"
                  @create="handleAppointmentCreated"
                  @cancel="showInlineAppointmentForm = false"
                />
              </div>

              <slot name="tab-appointments" />
            </div>
            <!-- Enrich / Communication / Attachments -->
            <template v-else>
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
                  :phone-number="task.customer?.phone || ''"
                  :item="editingItem"
                  @save="handleWidgetSave"
                  @cancel="handleWidgetCancel"
                />

                <NoteWidget
                  v-if="activeTab === 'data' && showInlineWidget === 'note'"
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
            </template>
          </div>
        </main>
      </div>

      <!-- Right: Activity Timeline (collapsed by default) -->
      <div class="hidden lg:flex flex-col overflow-hidden border-l border-black/5 shrink-0 w-80 h-full">
        <TaskActivityCard
          :activities="allActivities"
          :expanded-summaries="expandedSummaries"
          @activity-click="handleActivityClick"
          @toggle-summary-expanded="toggleSummaryExpanded"
          @add-activity="handleAddActivityFromSidebar"
        />
      </div>
    </div>

    <!-- GRID VIEW: Tabbed layout (only for tasks) -->
    <div v-else-if="isTasksView" class="flex-1 flex flex-row overflow-hidden">
      <!-- Left: Content area with tabs -->
      <div class="flex-1 flex flex-col overflow-hidden min-w-0">
        <div class="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide">
        <!-- Main Tabs -->
        <Tabs 
          v-model="gridMainTab"
          :tabs="gridMainTabs"
          class="mb-6"
        />
        
        <!-- Tab 1: Manage -->
        <div v-if="gridMainTab === 'manage'" class="grid grid-cols-1 lg:grid-cols-[80%_20%] gap-6 items-start">
          <!-- Left Column: Lead Qualification Tasks -->
          <div class="space-y-6">
            <div v-if="managementWidget">
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
                @view-history="handleViewHistory"
              />
            </div>
          </div>

          <!-- Right Column: Requested Card, Customer Car, and Other Tasks -->
          <div v-if="type !== 'contact'" class="lg:col-span-1 space-y-6">
            <!-- Requested Car Card -->
            <TaskRequestOverviewTab
              :task="task"
              :entity-type="type"
              :activities="task.activities || []"
              @reassign="handleReassign"
              @add-requested-car="handleAddRequestedCar"
            />

            <!-- Other Tasks for This Customer -->
            <CustomerRelatedTasksWidget
              :task="task"
              :entity-type="type"
            />
          </div>
        </div>

        <!-- Tab 2: Request -->
        <div v-if="gridMainTab === 'request'" class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <!-- Request Card + Contact Info Card -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:col-span-2">
            <!-- Request Card -->
            <TaskRequestOverviewTab
              v-if="type !== 'contact'"
              :task="task"
              :entity-type="type"
              :activities="task.activities || []"
              @reassign="handleReassign"
              @add-requested-car="handleAddRequestedCar"
            />

            <!-- Contact Info Card -->
            <TaskContactCard
              :task="task"
              :task-type="type"
              :customer-id="task.customer?.id || task.customerId || task.id"
              @action="handleContactInfoAction"
              @add-tag="showAddTagModal = true"
            />
          </div>

          <!-- Customer Related Tasks Widget -->
          <CustomerRelatedTasksWidget
            v-if="type !== 'contact'"
            :task="task"
            :entity-type="type"
          />

          <!-- Activity Summary Card -->
          <div class="rounded-card flex flex-col" style="background-color: var(--base-muted, #f5f5f5)">
            <!-- Title Section -->
            <div class="px-4 py-4 flex items-center justify-between shrink-0">
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-clock text-heading"></i>
                <h2 class="text-sm font-semibold text-heading leading-5">Activity Summary</h2>
              </div>
            </div>
            
            <!-- Card Content -->
            <div class="bg-white rounded-lg p-4 shadow-sm flex flex-col flex-1 min-h-0" style="box-shadow: var(--nsc-card-shadow);">
              <!-- Timeline -->
              <div class="relative flex-1 min-h-0">
                <div v-if="allActivities.length > 0" class="absolute left-5 top-0 bottom-0 w-0.5 bg-border z-0"></div>
                
                <div v-if="allActivities.length === 0" class="text-center py-6 text-sub">
                  <i class="fa-solid fa-clock text-2xl mb-2"></i>
                  <p class="text-sm text-sub">No activities yet</p>
                </div>
                
                <div v-else class="space-y-6 h-full overflow-y-auto pr-2">
                  <div v-for="activity in allActivities" :key="activity.id" class="flex gap-4 relative">
                    <div 
                      class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 relative bg-surface"
                      :class="getActivityIconClass(activity.type)"
                    >
                      <i :class="getActivityIcon(activity.type)" class="text-sm"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm text-body leading-snug">
                        <span class="font-bold">{{ activity.user }}</span> {{ activity.action }}
                      </div>
                      <div v-if="activity.content" class="mt-2 bg-orange-50/50 border border-orange-100 p-3 rounded-lg text-sm text-body">
                        {{ activity.content }}
                      </div>
                      <div class="text-xs text-sub mt-1">{{ formatActivityTime(activity.timestamp) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 3: Data (Enrich) - Feed Layout -->
        <div v-if="gridMainTab === 'data'">
          <!-- Add Button with Dropdown -->
          <AddNewButton
            :actions="enrichActions"
            :active-tab="'data'"
            @action="handleEnrichAction"
          />

          <!-- Inline Widgets for Enrich Tab -->
          <div>
            <NoteWidget
              v-if="enrichWidgetType === 'note'"
              :item="enrichEditingItem"
              :task-type="type"
              :task-id="task.id"
              @save="handleEnrichWidgetSave"
              @cancel="handleEnrichWidgetCancel"
            />

            <AttachmentWidget
              v-if="enrichWidgetType === 'attachment'"
              :item="enrichEditingItem"
              :task-type="type"
              :task-id="task.id"
              @save="handleEnrichWidgetSave"
              @cancel="handleEnrichWidgetCancel"
            />

            <TradeInWidget
              v-if="enrichWidgetType === 'tradein'"
              :item="enrichEditingItem"
              :task-type="type"
              :task-id="task.id"
              @save="handleEnrichWidgetSave"
              @cancel="handleEnrichWidgetCancel"
            />

            <PurchaseMethodWidget
              v-if="enrichWidgetType === 'purchase'"
              :item="enrichEditingItem"
              :task-type="type"
              :task-id="task.id"
              @save="handleEnrichWidgetSave"
              @cancel="handleEnrichWidgetCancel"
            />
          </div>

          <!-- Feed Items -->
          <div v-if="enrichFeedItems.length > 0" class="space-y-4 mt-4">
            <FeedItemCard
              v-for="item in enrichFeedItems"
              :key="item.id"
              :item="item"
              :task-type="type"
              :customer-initials="task.customer?.initials || 'SK'"
              @edit="handleEnrichEditItem"
              @delete="handleEnrichDeleteItem"
            />
          </div>

          <!-- Empty State -->
          <div v-else-if="!enrichWidgetType" class="text-center py-12 text-sub">
            <i class="fa-solid fa-folder-open text-4xl mb-3"></i>
            <p class="text-sm text-sub">No enrichment data yet</p>
            <p class="text-xs text-sub mt-1">Click the + button above to add notes, attachments, trade-ins, or purchase methods</p>
          </div>
        </div>

        <!-- Tab 4: Contact -->
        <!--
        <div v-if="gridMainTab === 'contact'" class="space-y-6">
          <div class="rounded-card flex flex-col" style="background-color: var(--base-muted, #f5f5f5)">
            <div class="px-4 py-4 flex items-center justify-between shrink-0">
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-comments text-heading"></i>
                <h2 class="text-sm font-semibold text-heading leading-5">Communicate</h2>
              </div>
            </div>
            
            <div class="bg-white rounded-lg p-4 shadow-sm flex flex-col" style="box-shadow: var(--nsc-card-shadow);">
              <CommunicationWidget
                type="call"
                :task-type="type"
                :task-id="task.id"
                :phone-number="task.customer?.phone || ''"
                :show-arrow="false"
                @save="handleCommunicationWidgetSave"
                @cancel="showCommunicationWidget = false"
              />
              
              <div v-if="gridCommunications.length > 0" class="mt-6 pt-6 border-t border">
                <div class="space-y-2 max-h-52 overflow-y-auto">
                  <div v-for="comm in gridCommunications" :key="comm.id" class="p-3 bg-surfaceSecondary border border-E5E7EB rounded-lg">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-xs font-semibold text-heading">{{ comm.type }}</span>
                      <span class="text-xs text-sub">{{ formatGridDate(comm.timestamp) }}</span>
                    </div>
                    <p class="text-sm text-body">{{ comm.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        -->

        </div>
      </div>

      <!-- Right: Activity Timeline (collapsed by default) -->
      <!-- COMMENTED OUT: Moved to Manage tab as a card -->
      <!-- <ActivitySummarySidebar
        :title="'Activity summary'"
        :activities="allActivities"
        :collapsed="activitySidebarCollapsed"
        :show-collapse="true"
        :show="true"
        class="hidden lg:flex"
        @toggle-collapse="activitySidebarCollapsed = !activitySidebarCollapsed"
      /> -->
    </div>

    <!-- Purchase Method Modal -->
    <PurchaseMethodModal
      :show="overviewModalType === 'financing' && showOverviewModal"
      :task-type="type"
      :task-id="task.id"
      @save="handlePurchaseMethodSave"
      @close="closeOverviewModal"
    />
    
    <!-- Trade-In Modal -->
    <AddVehicleModal
      :show="overviewModalType === 'tradein' && showOverviewModal"
      mode="tradein"
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
      :customer="task.customer"
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
    
    <!-- Add Requested Car Modal -->
    <AddRequestedCarModal
      :show="showAddRequestedCarModal"
      :task="task"
      :task-type="type"
      :task-id="task.id"
      @close="showAddRequestedCarModal = false"
      @save="handleAddRequestedCarSave"
    />
    
    <!-- Activity Modals -->
    <NoteWidget
      modal
      :show="showNoteModal"
      :task-type="type"
      :task-id="task.id"
      @save="handleNoteSave"
      @close="showNoteModal = false"
    />
    
    <AttachmentWidget
      modal
      :show="showAttachmentModal"
      :task-type="type"
      :task-id="task.id"
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
    
    <!-- Create Appointment Modal (contact card + button) -->
    <CreateEventModal
      v-if="showCreateAppointmentModal"
      :show="showCreateAppointmentModal"
      :customer="task.customer"
      :assignee="task.assignee"
      :disabled-fields="['customer']"
      :dealerships="dealerships"
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
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CustomerContactHeader from '@/components/customer/widgets/CustomerContactHeader.vue'
import Tabs from '@/components/customer/widgets/Tabs.vue'
import Request from '@/components/shared/Request.vue'
import TaskRequestOverviewTab from '@/components/tasks/TaskRequestOverviewTab.vue'
import TaskContactCard from '@/components/tasks/TaskContactCard.vue'
import CustomerRelatedTasksWidget from '@/components/tasks/CustomerRelatedTasksWidget.vue'
import AddNewButton from '@/components/customer/widgets/AddNewButton.vue'
import FeedItemCard from '@/components/customer/feed/FeedItemCard.vue'
import TaskActivityCard from '@/components/tasks/TaskActivityCard.vue'
import CommunicationWidget from '@/components/shared/communication/CommunicationWidget.vue'
import NoteWidget from '@/components/customer/activities/NoteWidget.vue'
import AttachmentWidget from '@/components/customer/activities/AttachmentWidget.vue'
import TradeInWidget from '@/components/customer/activities/TradeInWidget.vue'
import PurchaseMethodWidget from '@/components/customer/activities/PurchaseMethodWidget.vue'
import ReassignUserModal from '@/components/modals/ReassignUserModal.vue'
import CreateEventModal from '@/components/modals/CreateEventModal.vue'
import PurchaseMethodModal from '@/components/modals/PurchaseMethodModal.vue'
import AddVehicleModal from '@/components/modals/AddVehicleModal.vue'
import AddRequestedCarModal from '@/components/modals/AddRequestedCarModal.vue'
import OfferModal from '@/components/modals/OfferModal.vue'
import AddTagModal from '@/components/modals/AddTagModal.vue'
import AddWhatsAppModal from '@/components/modals/AddWhatsAppModal.vue'
import AddSMSModal from '@/components/modals/AddSMSModal.vue'
import AddEmailModal from '@/components/modals/AddEmailModal.vue'
import ComingSoonModal from '@/components/modals/ComingSoonModal.vue'
import { useTradeInVehicle } from '@/composables/useTradeInVehicle'
import { getTabForItemTypeDefault as getTabForItemType } from '@/composables/useTaskTabs'
import { useTaskInlineWidgets } from '@/composables/useTaskInlineWidgets'
import { useCustomersStore } from '@/stores/customers'
import { useUsersStore } from '@/stores/users'
import CreateEventForm from '@/components/shared/forms/CreateEventForm.vue'
import { createCalendarEvent, fetchCalendarFilterOptions } from '@/api/calendar'

const props = defineProps({
  task: { type: Object, required: true },
  type: { type: String, required: true }, // 'lead' | 'opportunity' | 'contact'
  managementWidget: { type: Object, required: true },
  storeAdapter: { type: Object, required: true }, // { currentActivities, addActivity, updateActivity, deleteActivity }
  addNewConfig: {
    type: Object,
    required: true // { overviewActions: [], tabActions: [] }
  },
  showCloseButton: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['car-added', 'convert-to-lead', 'convert-to-opportunity', 'tag-updated', 'appointment-created', 'close'])

const route = useRoute()
const router = useRouter()
const customersStore = useCustomersStore()
const usersStore = useUsersStore()

const taskId = computed(() => props.task.id)

// Check if we're on the tasks view (not the customer view)
const isTasksView = computed(() => {
  return route.path.startsWith('/tasks') && !route.path.startsWith('/customer')
})

// Grid view main tabs state
const gridMainTab = ref('manage')
const gridMainTabs = [
  { key: 'manage', label: 'Manage' },
  { key: 'request', label: 'Request' },
  { key: 'data', label: 'Note' }
  // { key: 'contact', label: 'Contact' }
]

// Grid view communication state (kept for cancel handler)
const showCommunicationWidget = ref(false)

// Enrich tab state
const enrichWidgetType = ref(null) // 'note' | 'attachment' | 'tradein' | 'purchase' | null
const enrichEditingItem = ref(null)
const enrichActions = ['note', 'attachment', 'tradein', 'purchase']

// Computed: Enrich feed items (notes, attachments, trade-ins, purchase methods) sorted by timestamp
const enrichFeedItems = computed(() => {
  const items = []
  const seenIds = new Set()
  const enrichTypes = ['note', 'attachment', 'tradein', 'purchase', 'purchase-method', 'financing']
  
  // First, get activities from store adapter (this is the primary source of loaded activities)
  if (props.storeAdapter?.currentActivities?.value) {
    const storeActivities = props.storeAdapter.currentActivities.value.filter(a => enrichTypes.includes(a.type))
    storeActivities.forEach(a => {
      if (!seenIds.has(a.id)) {
        seenIds.add(a.id)
        items.push(a)
      }
    })
  }
  
  // Also check props.task.activities as fallback (may contain activities not yet in store)
  if (props.task.activities) {
    const taskActivities = props.task.activities.filter(a => enrichTypes.includes(a.type))
    taskActivities.forEach(a => {
      if (!seenIds.has(a.id)) {
        seenIds.add(a.id)
        items.push(a)
      }
    })
  }
  
  // Also include inline content that matches enrich types (for newly added items in current session)
  const enrichInlineContent = inlineContent.value.filter(item => enrichTypes.includes(item.type))
  enrichInlineContent.forEach(item => {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id)
      items.push(item)
    }
  })
  
  // Sort by timestamp descending (newest first)
  return items.sort((a, b) => {
    const dateA = new Date(a.timestamp || 0)
    const dateB = new Date(b.timestamp || 0)
    return dateB - dateA
  })
})

// Handle enrich tab actions
const handleEnrichAction = (action) => {
  enrichEditingItem.value = null
  enrichWidgetType.value = action
}

// Handle enrich widget save
const handleEnrichWidgetSave = async (data) => {
  try {
    // Add activity to the store
    await props.storeAdapter.addActivity(props.task.id, {
      type: data.type,
      action: data.action,
      content: data.content,
      data: data.data,
      fileName: data.fileName,
      timestamp: data.timestamp || new Date().toISOString()
    })
    
    // Also add to inline content for immediate display
    inlineContent.value.push({
      id: data.id || Date.now(),
      type: data.type,
      action: data.action,
      content: data.content,
      data: data.data,
      fileName: data.fileName,
      timestamp: data.timestamp || new Date().toISOString()
    })
    
    // Close the widget
    enrichWidgetType.value = null
    enrichEditingItem.value = null
  } catch (error) {
    console.error('Error saving enrich data:', error)
  }
}

// Handle enrich widget cancel
const handleEnrichWidgetCancel = () => {
  enrichWidgetType.value = null
  enrichEditingItem.value = null
}

// Handle enrich item edit
const handleEnrichEditItem = (item) => {
  enrichEditingItem.value = item
  enrichWidgetType.value = item.type === 'purchase-method' ? 'purchase' : item.type
}

// Handle enrich item delete
const handleEnrichDeleteItem = async (item) => {
  try {
    await props.storeAdapter.deleteActivity(props.task.id, item.id)
    // Remove from inline content
    const index = inlineContent.value.findIndex(i => i.id === item.id)
    if (index !== -1) {
      inlineContent.value.splice(index, 1)
    }
  } catch (error) {
    console.error('Error deleting enrich item:', error)
  }
}

// Filter activities by type for grid view
const gridNotes = computed(() => {
  if (!props.task.activities) return []
  return props.task.activities.filter(a => a.type === 'note')
})

const gridCommunications = computed(() => {
  if (!props.task.activities) return []
  return props.task.activities.filter(a => 
    ['email', 'call', 'sms', 'whatsapp'].includes(a.type)
  )
})

const gridAttachments = computed(() => {
  if (!props.task.activities) return []
  return props.task.activities.filter(a => a.type === 'attachment')
})

const gridPurchases = computed(() => {
  if (!props.task.activities) return []
  return props.task.activities.filter(a => a.type === 'purchase')
})

const gridTradeIns = computed(() => {
  if (!props.task.activities) return []
  return props.task.activities.filter(a => a.type === 'tradein')
})

const openPurchaseModal = () => {
  overviewModalType.value = 'purchase'
  showOverviewModal.value = true
}

const openTradeInModal = () => {
  overviewModalType.value = 'tradein'
  showOverviewModal.value = true
}

const formatGridDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatGridCurrency = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('en-US').format(value)
}

const formatGridNumber = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('en-US').format(value)
}

const handleCommunicationWidgetSave = async (data) => {
  // Handle communication save from CommunicationWidget
  await props.storeAdapter.addActivity(props.task.id, {
    type: data.communicationType || data.type,
    content: data.content || data.message || 'Communication logged',
    subject: data.subject,
    template: data.template,
    timestamp: new Date().toISOString()
  })
  
  // Hide widget after save
  showCommunicationWidget.value = false
}

// Avatar color class based on type
const getAvatarColorClass = computed(() => {
  if (props.type === 'contact') return 'bg-blue-100 text-blue-600'
  if (props.type === 'lead') return 'bg-orange-100 text-orange-600'
  return 'bg-purple-100 text-purple-600' // opportunity
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

// Build calendar event payload from CreateEventForm data; create via API; close modal/inline; emit.
async function handleAppointmentCreated(eventData) {
  const customerId = props.task.customer?.id ?? props.task.id
  const time = eventData.time || '10:00'
  const timeNorm = time.length === 5 ? `${time}:00` : time
  const startStr = `${eventData.date}T${timeNorm}`
  const [h, m] = time.split(':').map(Number)
  const endH = h + 1
  const endStr = `${eventData.date}T${String(endH).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}:00`

  let assigneeId = null
  let assigneeType = 'user'
  let teamId = null
  let assigneeName = ''
  let teamName = null
  if (eventData.assignee) {
    if (eventData.assignee.startsWith('user-')) {
      const id = parseInt(eventData.assignee.replace('user-', ''), 10)
      const u = usersStore.getUserById(id)
      assigneeId = id
      assigneeType = 'user'
      assigneeName = u?.name || ''
    } else if (eventData.assignee.startsWith('team-')) {
      const id = parseInt(eventData.assignee.replace('team-', ''), 10)
      const t = usersStore.getTeamById(id)
      teamId = id
      assigneeType = 'team'
      teamName = t?.name || ''
      assigneeName = teamName
    }
  }

  const payload = {
    type: eventData.type,
    title: eventData.title || `${eventData.type} - ${eventData.customer || 'Customer'}`,
    customer: eventData.customer || props.task.customer?.name || '',
    customerId,
    start: startStr,
    end: endStr,
    assignee: assigneeName,
    assigneeId,
    assigneeType,
    teamId,
    team: teamName,
    dealership: eventData.dealership || '',
    status: 'confirmed'
  }

  try {
    await createCalendarEvent(payload)
  } catch (err) {
    console.error('Failed to create appointment:', err)
    return
  }

  showCreateAppointmentModal.value = false
  showInlineAppointmentForm.value = false
  emit('appointment-created')
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

const handleAddRequestedCar = () => {
  showAddRequestedCarModal.value = true
}

const handleAddRequestedCarSave = async (carData) => {
  try {
    if (props.type === 'lead') {
      await props.storeAdapter.updateLead?.(props.task.id, { requestedCar: carData })
    } else if (props.type === 'opportunity') {
      await props.storeAdapter.updateOpportunity?.(props.task.id, { requestedCar: carData })
    }
    showAddRequestedCarModal.value = false
  } catch (error) {
    console.error('Error saving requested car:', error)
  }
}

// Modal state for overview actions (financing, tradein, purchase)
const showOverviewModal = ref(false)
const overviewModalType = ref(null)
const showCreateAppointmentModal = ref(false)
const showInlineAppointmentForm = ref(false)
const showReassignModal = ref(false)
const showAddTagModal = ref(false)
const showAddRequestedCarModal = ref(false)
const dealerships = ref([])

// Activity modals
const showNoteModal = ref(false)
const showAttachmentModal = ref(false)
const showWhatsAppModal = ref(false)
const showSMSModal = ref(false)
const showEmailModal = ref(false)
const showComingSoonModal = ref(false)

// Activity card state
const expandedSummaries = ref({})

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

// Clear inline appointment form when switching away from Appointments tab
watch(activeTab, (tab) => {
  if (tab !== 'appointments') {
    showInlineAppointmentForm.value = false
  }
})

// Today in YYYY-MM-DD for inline appointment form initial date
const initialDateToday = computed(() => {
  const d = new Date()
  return d.toISOString().slice(0, 10)
})

onMounted(async () => {
  if (!isTasksView.value) {
    try {
      const opts = await fetchCalendarFilterOptions()
      dealerships.value = opts.dealerships || []
    } catch (err) {
      console.error('Failed to fetch calendar filter options:', err)
    }
  }
})

// Handle view history - switch to Request tab (for tasks view)
const handleViewHistory = () => {
  if (isTasksView.value) {
    gridMainTab.value = 'request'
  } else {
    // For customer view, switch to overview tab (which shows activity summary sidebar)
    activeTab.value = 'overview'
  }
}

// Wrapper to handle modal actions
const handleAddNewAction = (action) => {
  const result = handleAddNewActionBase(action)
  
  // Check if it's an overview modal action
  if (result && result.modalAction) {
    overviewModalType.value = result.modalAction
    showOverviewModal.value = true
  }
}

// Handle actions from CustomerContactHeader "+" button
const handleContactInfoAction = (action) => {
  // For appointments, open CreateEventModal
  if (action === 'appointment') {
    showCreateAppointmentModal.value = true
    return
  }
  
  // For call, show ComingSoonModal
  if (action === 'call') {
    showComingSoonModal.value = true
    return
  }
  
  // Open modals for activity types
  if (action === 'note') {
    showNoteModal.value = true
    return
  }
  if (action === 'attachment') {
    showAttachmentModal.value = true
    return
  }
  if (action === 'whatsapp') {
    showWhatsAppModal.value = true
    return
  }
  if (action === 'sms') {
    showSMSModal.value = true
    return
  }
  if (action === 'email') {
    showEmailModal.value = true
    return
  }
  
  // Map actions to tabs (for call and other actions)
  const actionToTab = {
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
const handlePurchaseMethodSave = async (purchaseMethodData) => {
  try {
    // Create activity for the purchase method (for activity feed display)
    const typeLabel = purchaseMethodData.type === 'FIN' ? 'Captive Financing' 
      : purchaseMethodData.type === 'LEA' ? 'Leasing' 
      : 'Long-Term Rental'
    const monthly = purchaseMethodData.fields?.monthlyInstalment || 0
    
    // Use standard handler to save as activity
    await handleWidgetSave({
      type: 'purchase-method',
      action: `added a ${typeLabel} purchase method`,
      content: `${typeLabel}: €${monthly.toLocaleString()}/month for ${purchaseMethodData.fields?.duration || 0} months`,
      data: {
        purchaseMethodId: purchaseMethodData.id,
        type: purchaseMethodData.type,
        ...purchaseMethodData.fields
      }
    })
    closeOverviewModal()
  } catch (error) {
    console.error('Error saving purchase method:', error)
  }
}

const handleOverviewModalSave = async (data) => {
  // Special handling for trade-in: save vehicle and activity
  if (overviewModalType.value === 'tradein') {
    try {
      const { saveTradeInVehicle } = useTradeInVehicle()
      const result = await saveTradeInVehicle(props.type, props.task.id, data.vehicle, data.valuation || {})
      // Add to inline content for immediate display
      inlineContent.value.push({
        id: result.activity.id,
        type: 'tradein',
        action: 'added a trade-in',
        vehicleId: result.vehicle.id,
        data: result.activity.data,
        timestamp: result.activity.timestamp,
        activityId: result.activity.id
      })
      closeOverviewModal()
    } catch (error) {
      console.error('Error saving trade-in:', error)
    }
  } else if (overviewModalType.value === 'purchase') {
    // For purchase offers, use standard handler
    await handleWidgetSave(data)
    closeOverviewModal()
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

// Activity card handlers
const handleActivityClick = (activity) => {
  // Could open a modal here for detailed view
  console.log('Activity clicked:', activity)
}

const toggleSummaryExpanded = (activityId) => {
  expandedSummaries.value[activityId] = !expandedSummaries.value[activityId]
}

const handleAddActivityFromSidebar = (activityType) => {
  // Use the same handler as the main add activity
  handleContactInfoAction(activityType)
}

const tabs = computed(() => {
  const base = [
    { key: 'overview', label: 'Overview' },
    { key: 'data', label: 'Note' },
    { key: 'communication', label: 'Communication' },
    { key: 'attachment', label: 'Attachments' }
  ]
  if (props.type === 'contact') {
    return [
      { key: 'overview', label: 'Overview' },
      { key: 'negotiations', label: 'Negotiations' },
      ...base.slice(1),
      { key: 'appointments', label: 'Appointments' }
    ]
  }
  return base
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
      // Reload the task to get updated data
      if (props.storeAdapter.loadLeadById) {
        await props.storeAdapter.loadLeadById(props.task.id)
      }
    } else if (props.type === 'opportunity') {
      await props.storeAdapter.updateOpportunity?.(props.task.id, { tags: updatedTags })
      // Reload the task to get updated data
      if (props.storeAdapter.loadOpportunityById) {
        await props.storeAdapter.loadOpportunityById(props.task.id)
      }
    } else if (props.type === 'contact') {
      // Handle contact/customer tag updates
      // Determine customer type from route query or default to 'contact'
      const customerType = route.query.type === 'account' ? 'account' : 'contact'
      await customersStore.updateCustomer(props.task.id, { tags: updatedTags }, customerType)
      // Reload customer data
      await customersStore.fetchCustomerById(props.task.id, customerType)
      // Emit event to notify parent (Customer.vue) to reload its local customerData
      emit('tag-updated')
    }
    
    showAddTagModal.value = false
  } catch (error) {
    console.error('Error adding tag:', error)
  }
}

// Activity summary helper methods
const getActivityIcon = (type) => {
  const icons = {
    'call': 'fa-solid fa-phone text-blue-600',
    'email': 'fa-solid fa-envelope text-green-600',
    'note': 'fa-solid fa-sticky-note text-yellow-600',
    'meeting': 'fa-solid fa-calendar text-purple-600',
    'task': 'fa-solid fa-check-circle text-indigo-600',
    'attachment': 'fa-solid fa-paperclip text-body',
    'status': 'fa-solid fa-tag text-orange-600',
    'default': 'fa-solid fa-circle text-sub'
  }
  return icons[type] || icons.default
}

const getActivityIconClass = (type) => {
  const classes = {
    'call': 'bg-blue-100 text-blue-600',
    'email': 'bg-green-100 text-green-600',
    'note': 'bg-yellow-100 text-yellow-600',
    'meeting': 'bg-purple-100 text-purple-600',
    'task': 'bg-indigo-100 text-indigo-600',
    'attachment': 'bg-surfaceSecondary text-body',
    'status': 'bg-orange-100 text-orange-600',
    'default': 'bg-surfaceSecondary text-sub'
  }
  return classes[type] || classes.default
}

const formatActivityTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}
</script>

