<template>
  <div v-if="task" class="flex flex-col flex-1 min-w-0 overflow-hidden">
    <!-- Task Header -->
    <TaskDetailHeader
      :task="task"
      :filtered-tasks="filteredTasks"
      @previous="handlePrevious"
      @next="handleNext"
    />

    <!-- Center + Right Panels Row -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Center Panel: Tabs + Content -->
      <div class="flex-1 flex flex-col overflow-hidden bg-white min-w-0">
        <!-- Tabs Section -->
        <div class="px-6 py-0 shrink-0">
          <div class="flex items-stretch h-12 gap-4 border-b border-black/5">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              class="relative flex items-center gap-1.5 px-0 h-full"
            >
              <span 
                class="text-sm font-medium"
                :class="activeTab === tab.key ? 'text-greys-900' : 'text-greys-500'"
              >
                {{ tab.label }}
              </span>
              <span
                class="px-2 py-0.5 rounded-lg text-sm"
                :class="activeTab === tab.key ? 'bg-blue-50 text-blue-600 font-bold' : 'bg-surfaceSecondary text-greys-600 font-medium'"
              >
                {{ getTabCount(tab.key) }}
              </span>
              <span
                v-if="activeTab === tab.key"
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
              />
            </button>
          </div>
        </div>

        <!-- Scrollable Content Area -->
        <div class="flex-1 overflow-y-auto">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="p-6 space-y-4">
            <TaskInfoCards 
              :task="task" 
              :type="task.type" 
            />
            <TaskManagementCard
              :task="task"
              :type="task.type"
              :management-widget="managementWidget"
              :activities="allActivities"
              v-bind="$attrs"
            />
          </div>

          <!-- Communication Tab -->
          <div v-if="activeTab === 'communication'" class="p-6 space-y-4">
            <div
              v-for="message in communicationItems"
              :key="message.id"
              :ref="el => setMessageRef(message.id, el)"
              :class="[
                'bg-greys-100 rounded-lg p-1',
                isHighlightedMessage(message) && message.type === 'whatsapp' ? 'highlight-whatsapp' : '',
                isHighlightedMessage(message) && message.type === 'email' ? 'highlight-email' : ''
              ]"
              style="background-color: var(--base-muted, #f5f5f5)"
            >
              <!-- Communication card header -->
              <div class="px-4 py-2 flex items-center justify-between rounded-t-lg -mx-1 -mt-1">
                <div class="flex items-center gap-2">
                  <component 
                    :is="getCommunicationIcon(message.type)" 
                    :size="18" 
                    :class="getCommunicationIconClass(message.type)"
                  />
                  <h3 class="text-base font-medium text-greys-500">
                    {{ getCommunicationTitle(message) }}
                  </h3>
                </div>
                <span class="text-sm text-greys-500">{{ message.timestamp || message.time }}</span>
              </div>
              
              <!-- Communication card content -->
              <div 
                class="p-4 overflow-hidden"
                style="
                  border-radius: var(--border-radius-rounded-lg, 10px);
                  background: var(--base-card, #FFF);
                  box-shadow: 0 0 0 1px rgba(14, 63, 126, 0.04), 0 1px 1px -0.5px rgba(42, 51, 69, 0.04), 
                              0 3px 3px -1.5px rgba(42, 51, 70, 0.04), 0 6px 6px -3px rgba(42, 51, 70, 0.04), 
                              0 12px 12px -6px rgba(14, 63, 126, 0.04), 0 24px 24px -12px rgba(14, 63, 126, 0.04);
                "
              >
                <p class="text-sm font-medium text-greys-900">{{ message.senderName || message.user }}</p>
                <p class="text-sm mt-1 text-greys-700">{{ message.content }}</p>
                
                <!-- Reply button for incoming messages -->
                <div v-if="message.from === 'lead' || message.direction === 'incoming'" class="flex justify-end mt-4">
                  <Button size="sm">Reply</Button>
                </div>
              </div>
            </div>
            
            <!-- Empty state -->
            <div v-if="communicationItems.length === 0" class="empty-state flex flex-col items-center justify-center py-12">
              <MessageCircle :size="48" class="text-greys-400 mb-4" />
              <h3 class="text-base font-medium text-greys-900 mb-2">No communication yet</h3>
              <p class="text-sm text-greys-500 mb-4">Start a conversation with the customer</p>
              <Button>Send message</Button>
            </div>
          </div>

          <!-- Notes Tab -->
          <div v-if="activeTab === 'notes'" class="p-6 space-y-4">
            <div
              v-for="note in noteItems"
              :key="note.id"
              :ref="el => setNoteRef(note.id, el)"
              :class="[
                'bg-[#fef7ee] rounded-lg p-1',
                isHighlightedNote(note) ? 'highlight-note' : ''
              ]"
            >
              <!-- Note card header -->
              <div class="px-4 py-2 flex items-center justify-between rounded-t-lg -mx-1 -mt-1">
                <div class="flex items-center gap-2">
                  <StickyNote :size="18" class="text-orange-600" />
                  <h3 class="text-base font-medium text-greys-500">Note by {{ note.user }}</h3>
                </div>
                <span class="text-sm text-greys-500">{{ note.timestamp || note.time }}</span>
              </div>
              
              <!-- Note card content -->
              <div 
                class="p-4 overflow-hidden"
                style="
                  border-radius: var(--border-radius-rounded-lg, 10px);
                  background: var(--base-card, #FFF);
                  box-shadow: 0 0 0 1px rgba(14, 63, 126, 0.04), 0 1px 1px -0.5px rgba(42, 51, 69, 0.04), 
                              0 3px 3px -1.5px rgba(42, 51, 70, 0.04), 0 6px 6px -3px rgba(42, 51, 70, 0.04), 
                              0 12px 12px -6px rgba(14, 63, 126, 0.04), 0 24px 24px -12px rgba(14, 63, 126, 0.04);
                "
              >
                <p class="text-sm text-greys-900">{{ note.content }}</p>
              </div>
            </div>
            
            <!-- Empty state -->
            <div v-if="noteItems.length === 0" class="empty-state flex flex-col items-center justify-center py-12">
              <StickyNote :size="48" class="text-greys-400 mb-4" />
              <h3 class="text-base font-medium text-greys-900 mb-2">No notes yet</h3>
              <p class="text-sm text-greys-500 mb-4">Add a note to keep track of important information</p>
              <Button>Add note</Button>
            </div>
          </div>

          <!-- Attachments Tab -->
          <div v-if="activeTab === 'attachments'" class="p-6">
            <div v-if="attachmentItems.length === 0" class="empty-state flex flex-col items-center justify-center py-12">
              <Paperclip :size="48" class="text-greys-400 mb-4" />
              <h3 class="text-base font-medium text-greys-900 mb-2">No attachments yet</h3>
              <p class="text-sm text-greys-500 mb-4">Upload files related to this task</p>
              <Button>Add attachment</Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar -->
      <div
        class="right-sidebar flex flex-col overflow-y-auto shrink-0 border-l border-black/5"
        style="background-color: #F8F8F8"
      >
        <div class="space-y-2 p-2">
          <TaskContactCard
            :task="task"
            :task-type="task.type"
            :customer-id="task.customerId || task.customer?.id"
            @action="handleContactAction"
          />
          <TaskRequestCard
            v-if="task.requestedCar || task.vehicle"
            :vehicle="task.requestedCar || task.vehicle"
            :request-message="task.requestMessage || task.requestedCar?.requestMessage"
            :source="task.source"
            :image-url="getCarImageUrl(task.requestedCar || task.vehicle)"
            @open-ad="handleOpenAd"
            @more-actions="handleMoreActions"
          />
          <TaskActivityCard
            :activities="allActivities"
            :expanded-summaries="expandedSummaries"
            @activity-click="handleActivityClick"
            @toggle-summary-expanded="toggleSummaryExpanded"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Empty State -->
  <div v-else class="flex-1 flex items-center justify-center bg-surface">
    <div class="text-center max-w-sm p-8">
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surfaceSecondary flex items-center justify-center">
        <i class="fa-solid fa-tasks text-2xl text-sub"></i>
      </div>
      <h3 class="text-fluid-lg font-semibold text-heading mb-2">No task selected</h3>
      <p class="text-fluid-sm text-sub">Select a task from the list to view its details and manage activities</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { Button } from '@motork/component-library/future/primitives'
import { StickyNote, MessageCircle, Mail, Paperclip } from 'lucide-vue-next'
import TaskDetailHeader from './TaskDetailHeader.vue'
import TaskInfoCards from './TaskInfoCards.vue'
import TaskManagementCard from './TaskManagementCard.vue'
import TaskContactCard from './TaskContactCard.vue'
import TaskRequestCard from './TaskRequestCard.vue'
import TaskActivityCard from './TaskActivityCard.vue'

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
  }
})

const emit = defineEmits(['task-navigate'])

// Tab management
const activeTab = ref('overview')
const expandedSummaries = ref({})

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'communication', label: 'Communication' },
  { key: 'notes', label: 'Notes' },
  { key: 'attachments', label: 'Attachments' }
]

// Activities
const allActivities = computed(() => {
  return props.storeAdapter.currentActivities?.value || []
})

const communicationItems = computed(() => {
  return allActivities.value.filter(a => 
    ['email', 'whatsapp', 'sms', 'call'].includes(a.type)
  )
})

const noteItems = computed(() => {
  return allActivities.value.filter(a => a.type === 'note')
})

const attachmentItems = computed(() => {
  return allActivities.value.filter(a => a.type === 'attachment')
})

const getTabCount = (tabKey) => {
  if (tabKey === 'overview') return 1
  if (tabKey === 'communication') return communicationItems.value.length
  if (tabKey === 'notes') return noteItems.value.length
  if (tabKey === 'attachments') return attachmentItems.value.length
  return 0
}

// Navigation handlers
const handlePrevious = () => {
  emit('task-navigate', 'previous')
}

const handleNext = () => {
  emit('task-navigate', 'next')
}

// Highlight system (from reference)
const highlightTarget = ref(null)
const noteItemRefs = ref({})
const messageItemRefs = ref({})
let highlightTimeoutId = null

const setHighlight = (target) => {
  // Clear existing timeout
  if (highlightTimeoutId !== null) {
    window.clearTimeout(highlightTimeoutId)
    highlightTimeoutId = null
  }
  
  highlightTarget.value = target
  
  if (!target) return
  
  // Auto-clear highlight after 900ms
  highlightTimeoutId = window.setTimeout(() => {
    highlightTarget.value = null
    highlightTimeoutId = null
  }, 900)
}

const scrollToHighlight = async () => {
  if (!highlightTarget.value) return
  
  await nextTick()
  
  if (highlightTarget.value.tab === 'notes' && activeTab.value === 'notes') {
    const el = noteItemRefs.value[highlightTarget.value.id]
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
  
  if (highlightTarget.value.tab === 'communication' && activeTab.value === 'communication') {
    const el = messageItemRefs.value[highlightTarget.value.id]
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}

const setNoteRef = (id, el) => {
  if (el) {
    noteItemRefs.value[id] = el
  } else {
    delete noteItemRefs.value[id]
  }
}

const setMessageRef = (id, el) => {
  if (el) {
    messageItemRefs.value[id] = el
  } else {
    delete messageItemRefs.value[id]
  }
}

const isHighlightedNote = (note) => {
  if (!highlightTarget.value) return false
  return (
    highlightTarget.value.tab === 'notes' &&
    highlightTarget.value.type === 'note' &&
    highlightTarget.value.id === note.id
  )
}

const isHighlightedMessage = (message) => {
  if (!highlightTarget.value) return false
  return (
    highlightTarget.value.tab === 'communication' &&
    (highlightTarget.value.type === 'email' || highlightTarget.value.type === 'whatsapp') &&
    highlightTarget.value.id === message.id
  )
}

// Watch for highlight target and active tab changes to trigger scroll
watch(() => [highlightTarget.value, activeTab.value], () => {
  if (!highlightTarget.value) return
  scrollToHighlight()
})

// Cleanup on unmount
onBeforeUnmount(() => {
  if (highlightTimeoutId !== null) {
    window.clearTimeout(highlightTimeoutId)
    highlightTimeoutId = null
  }
})

const handleActivityClick = (activity) => {
  // Switch to appropriate tab and set highlight
  if (activity.type === 'note') {
    activeTab.value = 'notes'
    setHighlight({
      tab: 'notes',
      type: 'note',
      id: activity.id
    })
  } else if (['email', 'whatsapp', 'sms', 'call'].includes(activity.type)) {
    activeTab.value = 'communication'
    setHighlight({
      tab: 'communication',
      type: activity.type,
      id: activity.id
    })
  } else if (activity.type === 'attachment') {
    activeTab.value = 'attachments'
    setHighlight(null)
  }
}

const toggleSummaryExpanded = (activityId) => {
  expandedSummaries.value[activityId] = !expandedSummaries.value[activityId]
}

// Communication helpers
const getCommunicationIcon = (type) => {
  if (type === 'email') return Mail
  if (type === 'whatsapp' || type === 'sms') return MessageCircle
  return MessageCircle
}

const getCommunicationIconClass = (type) => {
  if (type === 'email') return 'text-blue-600'
  if (type === 'whatsapp') return 'text-green-600'
  if (type === 'sms') return 'text-purple-600'
  return 'text-gray-600'
}

const getCommunicationTitle = (message) => {
  const isIncoming = message.from === 'lead' || message.direction === 'incoming'
  
  if (message.type === 'whatsapp') {
    return isIncoming ? 'Received WhatsApp message' : 'Sent WhatsApp message'
  } else if (message.type === 'email') {
    return isIncoming ? 'Received Email' : 'Sent Email'
  } else if (message.type === 'sms') {
    return isIncoming ? 'Received SMS' : 'Sent SMS'
  }
  
  return 'Message'
}

// Action handlers
const getCarImageUrl = (vehicle) => {
  if (!vehicle) return ''
  return vehicle.image || vehicle.imageUrl || ''
}

const handleOpenAd = () => {
  // TODO: Implement
  console.log('Open ad clicked')
}

const handleMoreActions = () => {
  // TODO: Implement
  console.log('More actions clicked')
}

const handleContactAction = (action) => {
  // TODO: Implement
  console.log('Contact action:', action)
}
</script>

<style scoped>
/* Right sidebar responsive widths */
.right-sidebar {
  width: 360px;
  min-width: 360px;
}

@media (min-width: 1440px) {
  .right-sidebar {
    width: 400px;
    min-width: 400px;
  }
}

@media (min-width: 1600px) {
  .right-sidebar {
    width: 480px;
    min-width: 480px;
  }
}

/* Color utilities */
.text-greys-400 {
  color: #9CA3AF;
}

.text-greys-500 {
  color: #6B7280;
}

.text-greys-600 {
  color: #4B5563;
}

.text-greys-700 {
  color: #374151;
}

.text-greys-900 {
  color: #111827;
}

/* Highlight animations */
@keyframes highlight-bounce-pulse-note {
  0% {
    background-color: #fef7ee;
    transform: scale(1);
  }
  15% {
    background-color: #fed7aa;
    transform: scale(1.02);
  }
  30% {
    background-color: #fef7ee;
    transform: scale(1);
  }
  45% {
    background-color: #fed7aa;
    transform: scale(1.015);
  }
  60% {
    background-color: #fef7ee;
    transform: scale(1);
  }
  75% {
    background-color: #fed7aa;
    transform: scale(1.008);
  }
  100% {
    background-color: #fef7ee;
    transform: scale(1);
  }
}

@keyframes highlight-bounce-pulse-whatsapp {
  0% {
    background-color: var(--base-muted, #f5f5f5);
    transform: scale(1);
  }
  15% {
    background-color: #dcfce7;
    transform: scale(1.02);
  }
  30% {
    background-color: var(--base-muted, #f5f5f5);
    transform: scale(1);
  }
  45% {
    background-color: #dcfce7;
    transform: scale(1.015);
  }
  60% {
    background-color: var(--base-muted, #f5f5f5);
    transform: scale(1);
  }
  75% {
    background-color: #dcfce7;
    transform: scale(1.008);
  }
  100% {
    background-color: var(--base-muted, #f5f5f5);
    transform: scale(1);
  }
}

@keyframes highlight-bounce-pulse-email {
  0% {
    background-color: var(--base-muted, #f5f5f5);
    transform: scale(1);
  }
  15% {
    background-color: #dbeafe;
    transform: scale(1.02);
  }
  30% {
    background-color: var(--base-muted, #f5f5f5);
    transform: scale(1);
  }
  45% {
    background-color: #dbeafe;
    transform: scale(1.015);
  }
  60% {
    background-color: var(--base-muted, #f5f5f5);
    transform: scale(1);
  }
  75% {
    background-color: #dbeafe;
    transform: scale(1.008);
  }
  100% {
    background-color: var(--base-muted, #f5f5f5);
    transform: scale(1);
  }
}

.highlight-note {
  animation: highlight-bounce-pulse-note 0.9s ease-out;
}

.highlight-whatsapp {
  animation: highlight-bounce-pulse-whatsapp 0.9s ease-out;
}

.highlight-email {
  animation: highlight-bounce-pulse-email 0.9s ease-out;
}

/* Fluid typography */
.text-fluid-lg {
  font-size: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  line-height: 1.4;
}

.text-fluid-sm {
  font-size: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  line-height: 1.5;
}
</style>
