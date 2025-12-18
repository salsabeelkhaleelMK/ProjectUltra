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
      <!-- Tabs + Add New (overview only) -->
      <div class="flex items-center justify-between mb-4">
        <Tabs 
          v-model="activeTab"
          :tabs="tabs"
          class="mb-0"
        />

        <AddNewButton
          v-if="activeTab === 'overview' && addNewConfig.overviewActions.length"
          :actions="addNewConfig.overviewActions"
          :active-tab="activeTab"
          :inline="true"
          @action="handleAddNewAction"
        />
      </div>

      <!-- Stage & Owner Bar -->
      <div v-if="activeTab === 'overview'" class="mb-6">
        <StageOwnerBar
          :stage="task.stage"
          :owner="task.assignee"
          :source="task.source || ''"
          :probability="task.probability"
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
</template>

<script setup>
import { computed } from 'vue'
import ContactInfo from '@/components/shared/ContactInfo.vue'
import Tabs from '@/components/shared/Tabs.vue'
import StageOwnerBar from '@/components/shared/StageOwnerBar.vue'
import AddNewButton from '@/components/shared/AddNewButton.vue'
import FeedItemCard from '@/components/feed/FeedItemCard.vue'
import CommunicationWidget from '@/components/widgets/CommunicationWidget.vue'
import NoteWidget from '@/components/widgets/NoteWidget.vue'
import AttachmentWidget from '@/components/widgets/AttachmentWidget.vue'
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
  store: props.storeAdapter,
  taskId,
  getTabForItemType,
  isOverviewModalAction: (action) =>
    activeTab.value === 'overview' && props.addNewConfig.overviewActions.includes(action)
})

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


