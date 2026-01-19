<template>
  <div class="flex-1 flex flex-col overflow-hidden h-full">
    <!-- Header - Contact Card (Full Width) -->
    <header class="bg-surface border-b border shrink-0">
      <!-- Contact Info Header (only shown for customer view, not tasks) -->
      <div v-if="!isTasksView" class="px-4 md:px-8 py-3 md:py-4">
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
        
        <!-- Tab 1: Request -->
        <div v-if="gridMainTab === 'request'" class="space-y-6">
          <!-- Request Card + Contact Info Card -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Request Card -->
            <RequestCard
              v-if="type !== 'contact'"
              :task="task"
              :entity-type="type"
              :activities="task.activities || []"
              @reassign="handleReassign"
            />

            <!-- Contact Info Card -->
            <ContactInfoCard
              :task="task"
              :task-type="type"
              :customer-id="task.customer?.id || task.customerId || task.id"
              @action="handleContactInfoAction"
              @add-tag="showAddTagModal = true"
            />
          </div>
        </div>

        <!-- Tab 2: Manage -->
        <div v-if="gridMainTab === 'manage'" class="space-y-6">
          <!-- Management Widget -->
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
            />
          </div>

          <!-- Communicate -->
          <div class="bg-surface border border rounded-xl shadow-sm overflow-hidden">
            <div class="p-6">
              <div class="flex items-center gap-2 mb-4">
                <i class="fa-solid fa-comments text-sub text-sm"></i>
                <h3 class="font-bold text-heading text-base">Communicate</h3>
              </div>
              
              <!-- Choice Buttons Grid -->
              <div class="grid grid-cols-4 gap-2 mb-4">
                <!-- Outbound Call -->
                <button 
                  @click="selectCommunicationMethod('call')"
                  class="bg-surface border-2 rounded-lg py-3 px-3 flex flex-col items-center justify-center gap-1.5 text-sm font-medium transition-all"
                  :class="selectedCommunicationMethod === 'call' ? 'border-brand-red bg-red-50 text-brand-red' : 'border text-body hover:border-red-300 hover:bg-red-50/50'"
                >
                  <i class="fa-solid fa-phone text-base"></i>
                  <span class="text-xs">Call</span>
                </button>
                
                <!-- WhatsApp -->
                <button 
                  @click="selectCommunicationMethod('whatsapp')"
                  class="bg-surface border-2 rounded-lg py-3 px-3 flex flex-col items-center justify-center gap-1.5 text-sm font-medium transition-all"
                  :class="selectedCommunicationMethod === 'whatsapp' ? 'border-brand-red bg-red-50 text-brand-red' : 'border text-body hover:border-red-300 hover:bg-red-50/50'"
                >
                  <i class="fa-brands fa-whatsapp text-base"></i>
                  <span class="text-xs">WhatsApp</span>
                </button>
                
                <!-- SMS -->
                <button 
                  @click="selectCommunicationMethod('sms')"
                  class="bg-surface border-2 rounded-lg py-3 px-3 flex flex-col items-center justify-center gap-1.5 text-sm font-medium transition-all"
                  :class="selectedCommunicationMethod === 'sms' ? 'border-brand-red bg-red-50 text-brand-red' : 'border text-body hover:border-red-300 hover:bg-red-50/50'"
                >
                  <i class="fa-solid fa-message text-base"></i>
                  <span class="text-xs">SMS</span>
                </button>
                
                <!-- Email -->
                <button 
                  @click="selectCommunicationMethod('email')"
                  class="bg-surface border-2 rounded-lg py-3 px-3 flex flex-col items-center justify-center gap-1.5 text-sm font-medium transition-all"
                  :class="selectedCommunicationMethod === 'email' ? 'border-brand-red bg-red-50 text-brand-red' : 'border text-body hover:border-red-300 hover:bg-red-50/50'"
                >
                  <i class="fa-solid fa-envelope text-base"></i>
                  <span class="text-xs">Email</span>
                </button>
              </div>
              
              <!-- Input Area for Selected Method -->
              <div v-if="selectedCommunicationMethod" class="space-y-3">
                <!-- Template Selection (for WhatsApp, SMS, Email) -->
                <div v-if="['whatsapp', 'sms', 'email'].includes(selectedCommunicationMethod)" class="space-y-2">
                  <label class="block text-xs font-medium text-body">Select Template</label>
                  <select 
                    v-model="selectedTemplate"
                    class="w-full bg-surface border border rounded-lg px-3 py-2 text-sm text-body focus:outline-none focus:border-brand-red"
                  >
                    <option value="">Select a template...</option>
                    <option value="followup-1">Follow-up 1</option>
                    <option value="followup-2">Follow-up 2</option>
                    <option value="custom">Custom message</option>
                  </select>
                  <button
                    @click="handleCommunicationAction"
                    class="px-4 py-2 text-xs font-medium bg-brand-red text-white rounded-lg hover:bg-brand-redDark transition-colors"
                  >
                    Send {{ selectedCommunicationMethod === 'whatsapp' ? 'WhatsApp' : selectedCommunicationMethod === 'sms' ? 'SMS' : 'Email' }}
                  </button>
                </div>
              </div>
              
              <!-- Communications List -->
              <div v-if="gridCommunications.length > 0" class="mt-6 pt-6 border-t border">
                <div class="space-y-2 max-h-[200px] overflow-y-auto">
                  <div v-for="comm in gridCommunications" :key="comm.id" class="p-3 bg-surfaceSecondary border border rounded-lg">
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

        <!-- Tab 3: Data -->
        <div v-if="gridMainTab === 'data'" class="space-y-6">
          <!-- Notes Card -->
          <div class="bg-surface border border rounded-xl shadow-sm overflow-hidden">
            <div class="p-6">
              <div class="flex items-center gap-2 mb-4">
                <i class="fa-solid fa-note-sticky text-sub text-sm"></i>
                <h3 class="font-bold text-heading text-base">Notes</h3>
              </div>
              <div class="space-y-2 max-h-[300px] overflow-y-auto">
                <div v-if="gridNotes.length === 0" class="text-center py-6 text-sub text-sm">
                  <i class="fa-solid fa-note-sticky text-2xl mb-2"></i>
                  <p>No notes yet</p>
                </div>
                <div v-for="note in gridNotes" :key="note.id" class="p-3 bg-surfaceSecondary border border rounded-lg">
                  <div class="text-xs text-sub mb-1">{{ formatGridDate(note.timestamp) }}</div>
                  <p class="text-sm text-body">{{ note.content }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Attachments Card -->
          <div class="bg-surface border border rounded-xl shadow-sm overflow-hidden">
            <div class="p-6">
              <div class="flex items-center gap-2 mb-4">
                <i class="fa-solid fa-paperclip text-sub text-sm"></i>
                <h3 class="font-bold text-heading text-base">Attachments</h3>
              </div>
              <div class="space-y-2 max-h-[300px] overflow-y-auto">
                <div v-if="gridAttachments.length === 0" class="text-center py-6 text-sub text-sm">
                  <i class="fa-solid fa-paperclip text-2xl mb-2"></i>
                  <p>No attachments yet</p>
                </div>
                <div v-for="attachment in gridAttachments" :key="attachment.id" class="p-3 bg-surfaceSecondary border border rounded-lg flex items-center gap-3">
                  <i class="fa-solid fa-file text-sub text-lg"></i>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-heading truncate">{{ attachment.filename }}</div>
                    <div class="text-xs text-sub">{{ formatGridDate(attachment.timestamp) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Trade-in and Purchase Cards (2-column grid) -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Trade-in Card -->
            <div class="bg-surface border border rounded-xl shadow-sm overflow-hidden">
              <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <i class="fa-solid fa-arrow-right-arrow-left text-sub text-sm"></i>
                    <h3 class="font-bold text-heading text-base">Trade-in</h3>
                  </div>
                  <button
                    @click="openTradeInModal"
                    class="px-3 py-1.5 text-xs font-medium bg-brand-red text-white rounded-lg hover:bg-brand-redDark transition-colors flex items-center gap-1.5"
                  >
                    <i class="fa-solid fa-plus text-xs"></i>
                    <span>Add New</span>
                  </button>
                </div>
                
                <div class="space-y-2 max-h-[300px] overflow-y-auto">
                  <div v-if="gridTradeIns.length === 0" class="text-center py-6 text-sub text-sm">
                    <i class="fa-solid fa-arrow-right-arrow-left text-2xl mb-2"></i>
                    <p>No trade-ins yet</p>
                  </div>
                  <div v-for="tradein in gridTradeIns" :key="tradein.id" class="p-3 bg-surfaceSecondary border border rounded-lg">
                    <div class="flex items-center justify-between mb-1">
                      <div class="text-xs text-sub">{{ formatGridDate(tradein.timestamp) }}</div>
                    </div>
                    <div v-if="tradein.data && tradein.data.brand" class="text-sm font-medium text-heading">
                      {{ tradein.data.brand }} {{ tradein.data.model }}
                      <span v-if="tradein.data.version"> {{ tradein.data.version }}</span>
                    </div>
                    <div v-if="tradein.data && (tradein.data.kilometers || tradein.data.price)" class="grid grid-cols-2 gap-2 mt-2 text-xs text-body">
                      <div v-if="tradein.data.kilometers">
                        <span class="text-sub">KM:</span> {{ formatGridNumber(tradein.data.kilometers) }}
                      </div>
                      <div v-if="tradein.data.price">
                        <span class="text-sub">Price:</span> € {{ formatGridCurrency(tradein.data.price) }}
                      </div>
                    </div>
                    <div v-if="tradein.content" class="text-xs text-body mt-2">{{ tradein.content }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Purchase Card -->
            <div class="bg-surface border border rounded-xl shadow-sm overflow-hidden">
              <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <i class="fa-solid fa-shopping-cart text-sub text-sm"></i>
                    <h3 class="font-bold text-heading text-base">Purchase</h3>
                  </div>
                  <button
                    @click="openPurchaseModal"
                    class="px-3 py-1.5 text-xs font-medium bg-brand-red text-white rounded-lg hover:bg-brand-redDark transition-colors flex items-center gap-1.5"
                  >
                    <i class="fa-solid fa-plus text-xs"></i>
                    <span>Add New</span>
                  </button>
                </div>
                
                <div class="space-y-2 max-h-[300px] overflow-y-auto">
                  <div v-if="gridPurchases.length === 0" class="text-center py-6 text-sub text-sm">
                    <i class="fa-solid fa-shopping-cart text-2xl mb-2"></i>
                    <p>No purchases yet</p>
                  </div>
                  <div v-for="purchase in gridPurchases" :key="purchase.id" class="p-3 bg-surfaceSecondary border border rounded-lg">
                    <div class="flex items-center justify-between mb-1">
                      <div class="text-xs text-sub">{{ formatGridDate(purchase.timestamp) }}</div>
                    </div>
                    <div v-if="purchase.data && purchase.data.brand" class="text-sm font-medium text-heading">
                      {{ purchase.data.brand }} {{ purchase.data.model }}
                      <span v-if="purchase.data.year">({{ purchase.data.year }})</span>
                    </div>
                    <div v-if="purchase.data && purchase.data.price" class="text-sm text-body mt-1">
                      € {{ formatGridCurrency(purchase.data.price) }}
                    </div>
                    <div v-if="purchase.content" class="text-xs text-body mt-2">{{ purchase.content }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        </div>
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
import RequestCard from '@/components/tasks/RequestCard.vue'
import ContactInfoCard from '@/components/tasks/ContactInfoCard.vue'
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

// Check if we're on the tasks view (not the customer view)
const isTasksView = computed(() => {
  return route.path.startsWith('/tasks') && !route.path.startsWith('/customer')
})

// Grid view main tabs state
const gridMainTab = ref('request')
const gridMainTabs = [
  { key: 'request', label: 'Request' },
  { key: 'manage', label: 'Manage' },
  { key: 'data', label: 'Data' }
]

// Grid view communication state
const selectedCommunicationMethod = ref(null)
const communicationNotes = ref('')
const selectedTemplate = ref('')

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

const selectCommunicationMethod = (method) => {
  selectedCommunicationMethod.value = selectedCommunicationMethod.value === method ? null : method
  communicationNotes.value = ''
  selectedTemplate.value = ''
}

const handleCommunicationAction = async () => {
  if (!selectedCommunicationMethod.value) return
  
  let actionType = selectedCommunicationMethod.value
  
  // Handle call logging (no notes input)
  if (actionType === 'call') {
    await props.storeAdapter.addActivity(props.task.id, {
      type: 'call',
      content: 'Call logged',
      timestamp: new Date().toISOString()
    })
    selectedCommunicationMethod.value = null
    return
  }
  
  // Handle WhatsApp, SMS, Email with template
  if (['whatsapp', 'sms', 'email'].includes(actionType)) {
    if (!selectedTemplate.value) {
      // Could show error toast here
      return
    }
    
    // Map method to activity type
    const activityType = actionType === 'whatsapp' ? 'whatsapp' : actionType === 'sms' ? 'sms' : 'email'
    
    await props.storeAdapter.addActivity(props.task.id, {
      type: activityType,
      content: `Template: ${selectedTemplate.value}`,
      timestamp: new Date().toISOString()
    })
    selectedCommunicationMethod.value = null
    selectedTemplate.value = ''
  }
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
    'note': 'data',
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
  return [
    { key: 'overview', label: 'Overview' },
    { key: 'data', label: 'Data' },
    { key: 'communication', label: 'Communication' },
    { key: 'attachment', label: 'Attachments' }
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

