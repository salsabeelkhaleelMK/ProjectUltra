<template>
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 shrink-0 shadow-sm">
      <div class="px-4 md:px-8 py-4 md:py-6">
        <ContactInfo
          :initials="task.customer.initials"
          :name="task.customer.name"
          :email="task.customer.email"
          :phone="task.customer.phone"
          :third-field-value="task.customer.address"
          :avatar-color-class="type === 'lead' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'"
          email-label="Email"
          phone-label="Phone"
          third-field-label="Address"
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
        </ContactInfo>
      </div>
    </header>

    <!-- Scrollable Content -->
    <main class="flex-1 overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full scrollbar-hide">
      <!-- Tabs -->
      <div class="mb-4">
        <Tabs 
          v-model="activeTab"
          :tabs="tabs"
          class="mb-0"
        />
      </div>

      <!-- Stage & Owner Bar -->
      <div v-if="activeTab === 'overview'" class="mb-6">
        <StageOwnerBar
          :stage="task.stage"
          :owner="task.assignee"
          :source="task.source || ''"
        />
      </div>

      <!-- Pinned Widgets Section (only on overview tab) -->
      <div v-if="activeTab === 'overview'" class="space-y-6 mb-6">
        <!-- Management widget -->
        <component
          :is="managementWidget"
          :lead="type === 'lead' ? task : undefined"
          :opportunity="type === 'opportunity' ? task : undefined"
          :activities="allActivities"
        />
        
        <!-- Add New (overview tab - after next steps widget) -->
        <AddNewButton
          v-if="addNewConfig.overviewActions.length"
          :actions="addNewConfig.overviewActions"
          :active-tab="activeTab"
          @action="handleAddNewAction"
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
        <TaskCard
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

    <!-- Overview Modal Widgets (Purchase Method, Trade-in) -->
    <Teleport to="body">
      <div 
        v-if="showOverviewModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
        @click.self="closeOverviewModal"
      >
        <div 
          v-if="overviewModalType === 'purchase-method' || overviewModalType === 'tradein'"
          class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h5 class="text-sm font-bold text-slate-800">
                {{ overviewModalType === 'purchase-method' ? 'Add Purchase Method' : 'Add Trade-in' }}
              </h5>
              <button @click="closeOverviewModal" class="text-gray-400 hover:text-gray-600">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
            <PurchaseMethodWidget
              v-if="overviewModalType === 'purchase-method'"
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
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import ContactInfo from '@/components/tasks/widgets/ContactInfo.vue'
import Tabs from '@/components/tasks/widgets/Tabs.vue'
import StageOwnerBar from '@/components/tasks/widgets/StageOwnerBar.vue'
import AddNewButton from '@/components/tasks/widgets/AddNewButton.vue'
import TaskCard from '@/components/tasks/TaskCard.vue'
import CommunicationWidget from '@/components/tasks/widgets/CommunicationWidget.vue'
import NoteWidget from '@/components/tasks/widgets/NoteWidget.vue'
import AttachmentWidget from '@/components/tasks/widgets/AttachmentWidget.vue'
import PurchaseMethodWidget from '@/components/tasks/widgets/PurchaseMethodWidget.vue'
import TradeInWidget from '@/components/tasks/widgets/TradeInWidget.vue'
import { getTabForItemTypeDefault as getTabForItemType } from '@/composables/useTaskTabs'
import { useTaskInlineWidgets } from '@/composables/useTaskInlineWidgets'

const props = defineProps({
  task: { type: Object, required: true },
  type: { type: String, required: true }, // 'lead' | 'opportunity'
  managementWidget: { type: Object, required: true },
  storeAdapter: { type: Object, required: true }, // { currentActivities, addActivity, updateActivity, deleteActivity }
  addNewConfig: {
    type: Object,
    required: true // { overviewActions: [], tabActions: [] }
  }
})

const taskId = computed(() => props.task.id)

// Modal state for overview actions (financing, tradein, purchase)
const showOverviewModal = ref(false)
const overviewModalType = ref(null)

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
  
  // Check if it's a modal action
  if (result && result.modalAction) {
    overviewModalType.value = result.modalAction
    showOverviewModal.value = true
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
  const overviewCount = allItems.length
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
</script>


