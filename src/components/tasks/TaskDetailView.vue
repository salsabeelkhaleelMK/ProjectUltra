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
          class="right-sidebar flex flex-col overflow-hidden shrink-0 border-l border-black/5"
          style="background-color: #F8F8F8"
        >
          <!-- Sidebar Tabs -->
          <div class="flex border-b border-black/5 bg-white">
            <button
              @click="sidebarTab = 'request'"
              class="flex-1 px-4 py-3 text-sm font-medium transition-colors relative"
              :class="sidebarTab === 'request' ? 'text-blue-600' : 'text-greys-600 hover:text-greys-900'"
            >
              Request
              <span
                v-if="sidebarTab === 'request'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              ></span>
            </button>
            <button
              @click="sidebarTab = 'activity'"
              class="flex-1 px-4 py-3 text-sm font-medium transition-colors relative"
              :class="sidebarTab === 'activity' ? 'text-blue-600' : 'text-greys-600 hover:text-greys-900'"
            >
              Activity
              <span
                v-if="sidebarTab === 'activity'"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              ></span>
            </button>
          </div>
          
          <!-- Sidebar Content -->
          <div class="flex-1 overflow-y-auto">
            <!-- Request Tab -->
            <div v-if="sidebarTab === 'request'" class="space-y-2 p-2">
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
            </div>
            
            <!-- Activity Tab -->
            <div v-if="sidebarTab === 'activity'" class="p-2 flex-1 overflow-hidden h-full flex flex-col">
              <TaskActivityCard
                :activities="allActivities"
                :expanded-summaries="expandedSummaries"
                @activity-click="handleActivityClick"
                @toggle-summary-expanded="toggleSummaryExpanded"
                @add-activity="handleAddActivity"
              />
            </div>
          </div>
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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

// Activities
const allActivities = computed(() => {
  return props.storeAdapter.currentActivities?.value || []
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
</style>
