<template>
  <div 
    class="overflow-hidden p-4 flex flex-col flex-1"
    style="
      border-radius: var(--border-radius-rounded-lg, 10px);
      background: var(--base-card, #FFF);
      box-shadow: var(--nsc-card-shadow);
      min-height: 100vh;
    "
  >
    <div class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-base font-medium text-greys-900 leading-6">Activity</h3>
        
        <!-- Filter Dropdown and Chips (Right side of title) -->
        <div class="flex items-center gap-2 flex-wrap">
          <!-- Filter Dropdown Button -->
          <div class="relative" ref="filterContainer">
            <button
              @click.stop="toggleFilterMenu"
              class="relative w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-900"
            >
              <i class="fa-solid fa-filter text-sm"></i>
              <span 
                v-if="selectedFilters.length > 0"
                class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white bg-black"
              ></span>
            </button>
            
            <transition name="dropdown">
              <div 
                v-if="showFilterMenu"
                class="absolute right-0 mt-2 z-50 filter-dropdown-wrapper"
                v-click-outside="() => showFilterMenu = false"
              >
                <DropdownMenu :items="filterMenuItems" className="w-56" />
              </div>
            </transition>
          </div>
          
          <!-- Selected Filter Chips -->
          <div v-if="selectedFilters.length > 0" class="flex items-center gap-2 flex-wrap">
            <div
              v-for="filterValue in selectedFilters"
              :key="filterValue"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surfaceSecondary text-xs font-medium text-heading border border-E5E7EB"
            >
              <span>{{ getFilterLabel(filterValue) }}</span>
              <button
                @click="removeFilter(filterValue)"
                class="flex items-center justify-center w-4 h-4 rounded-full hover:bg-gray-200 transition-colors text-sub hover:text-heading"
                aria-label="Remove filter"
              >
                <i class="fa-solid fa-xmark text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Add Activity Button - Always below title -->
      <div class="relative">
        <button
          @click="showAddDropdown = !showAddDropdown"
          class="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 underline decoration-blue-600 hover:decoration-blue-700 transition-colors"
        >
          <Plus :size="14" />
          Add activity
        </button>
        <div
          v-if="showAddDropdown"
          class="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-black/10 py-1 z-10"
          v-click-outside="() => showAddDropdown = false"
        >
          <button
            @click="$emit('add-activity', 'note')"
            class="w-full px-4 py-2 text-left text-sm text-greys-900 hover:bg-greys-50 flex items-center gap-2"
          >
            <StickyNote :size="16" class="text-orange-600" />
            Note
          </button>
          <button
            @click="$emit('add-activity', 'sms')"
            class="w-full px-4 py-2 text-left text-sm text-greys-900 hover:bg-greys-50 flex items-center gap-2"
          >
            <MessageCircle :size="16" class="text-purple-600" />
            SMS
          </button>
          <button
            @click="$emit('add-activity', 'whatsapp')"
            class="w-full px-4 py-2 text-left text-sm text-greys-900 hover:bg-greys-50 flex items-center gap-2"
          >
            <MessageCircle :size="16" class="text-green-600" />
            WhatsApp
          </button>
          <button
            @click="$emit('add-activity', 'email')"
            class="w-full px-4 py-2 text-left text-sm text-greys-900 hover:bg-greys-50 flex items-center gap-2"
          >
            <Mail :size="16" class="text-blue-600" />
            Email
          </button>
          <button
            @click="$emit('add-activity', 'attachment')"
            class="w-full px-4 py-2 text-left text-sm text-greys-900 hover:bg-greys-50 flex items-center gap-2"
          >
            <Paperclip :size="16" class="text-gray-600" />
            Attachment
          </button>
          <button
            @click="$emit('add-activity', 'tradein')"
            class="w-full px-4 py-2 text-left text-sm text-greys-900 hover:bg-greys-50 flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-blue-600">
              <path d="M7 17L17 7M7 7h10v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Trade-In
          </button>
          <button
            @click="$emit('add-activity', 'purchase-method')"
            class="w-full px-4 py-2 text-left text-sm text-greys-900 hover:bg-greys-50 flex items-center gap-2"
          >
            <FileText :size="16" class="text-indigo-600" />
            Purchase Method
          </button>
        </div>
      </div>
    </div>
    
    <div class="space-y-6 flex-1 flex flex-col min-h-0">
      <div v-if="sortedActivities.length > 0" class="flex-1 overflow-y-auto min-h-0">
        <div class="flex flex-col items-start gap-1 mb-4">
          <h3
            class="text-fluid-sm font-normal text-greys-500"
            style="line-height: var(--leading-5)"
          >
            {{ getActivityDateHeader(sortedActivities) }}
          </h3>
        </div>
        <div class="space-y-4">
          <div
            v-for="activity in sortedActivities"
            :key="activity.id"
            class="space-y-2"
          >
            <div
              class="flex items-start gap-2"
              :class="{
                'cursor-pointer hover:opacity-80 transition-opacity':
                  activity.type === 'note' ||
                  activity.type === 'email' ||
                  activity.type === 'whatsapp',
              }"
              @click="handleActivityClick(activity)"
            >
              <div
                :class="[
                  'size-8 rounded-md flex items-center justify-center shrink-0 p-2',
                  activity.type === 'note'
                    ? 'bg-orange-100'
                    : activity.type === 'call'
                      ? 'bg-green-100'
                      : activity.type === 'ai-summary'
                        ? 'bg-purple-100'
                        : activity.type === 'email'
                          ? 'bg-blue-100'
                          : activity.type === 'whatsapp'
                            ? 'bg-green-100'
                            : 'bg-greys-100',
                ]"
              >
                <StickyNote
                  v-if="activity.type === 'note'"
                  :size="16"
                  class="text-orange-600"
                />
                <Phone
                  v-else-if="activity.type === 'call'"
                  :size="16"
                  class="text-green-600"
                />
                <Sparkles
                  v-else-if="activity.type === 'ai-summary'"
                  :size="16"
                  class="text-purple-600"
                />
                <Mail
                  v-else-if="activity.type === 'email'"
                  :size="16"
                  class="text-blue-600"
                />
                <MessageCircle
                  v-else-if="activity.type === 'whatsapp'"
                  :size="16"
                  class="text-green-600"
                />
                <FileText v-else :size="16" class="text-greys-900" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <p
                    class="text-xs text-greys-900 flex-1 wrap-break-word min-w-0"
                    style="line-height: var(--leading-5)"
                  >
                    <span
                      :class="[
                        'font-normal',
                        activity.type === 'ai-summary' ? 'font-medium' : '',
                      ]"
                    >
                      {{ activity.type === 'ai-summary' ? 'MotorKAI' : activity.user }}
                    </span>
                    <span v-if="activity.type === 'note'" class="text-greys-500">
                      added a note</span
                    >
                    <span
                      v-else-if="activity.type === 'created'"
                      class="text-greys-500"
                    >
                      {{ activity.message || activity.action }}</span
                    >
                    <span v-else-if="activity.type === 'call'" class="text-greys-500">
                      {{ ' ' + (activity.message || activity.action) }}</span
                    >
                    <span
                      v-else-if="activity.type === 'ai-summary'"
                      class="text-greys-500"
                    >
                      summary</span
                    >
                    <span v-else-if="activity.type === 'email'" class="text-greys-500">
                      {{ ' sent an email' }}</span
                    >
                    <span
                      v-else-if="activity.type === 'whatsapp'"
                      class="text-greys-500"
                    >
                      {{ ' sent a WhatsApp message' }}</span
                    >
                    <span v-else class="text-greys-500">
                      {{ ' ' + (activity.message || activity.action) }}</span
                    >
                  </p>
                  <p
                    class="text-xs text-greys-500 text-right shrink-0 w-14"
                    style="line-height: var(--leading-5)"
                  >
                    {{ activity.time }}
                  </p>
                </div>
                <div
                  v-if="activity.type === 'note' && (activity.message || activity.content)"
                  class="mt-2 bg-[#fef7ee] rounded-lg p-4 backdrop-blur-sm"
                >
                  <p
                    class="text-xs text-greys-900 wrap-break-word"
                    style="line-height: var(--leading-5)"
                  >
                    {{ activity.message || activity.content }}
                  </p>
                </div>
                <div
                  v-if="activity.type === 'email' && activity.content"
                  class="mt-2 bg-blue-50 rounded-lg p-4"
                >
                  <p
                    class="text-xs text-greys-900 wrap-break-word"
                    style="line-height: var(--leading-5)"
                  >
                    {{ activity.content }}
                  </p>
                </div>
                <div
                  v-if="activity.type === 'whatsapp' && activity.content"
                  class="mt-2 bg-green-50 rounded-lg p-4"
                >
                  <p
                    class="text-xs text-greys-900 wrap-break-word"
                    style="line-height: var(--leading-5)"
                  >
                    {{ activity.content }}
                  </p>
                </div>
                <div
                  v-if="activity.type === 'ai-summary' && (activity.message || activity.content)"
                  class="mt-2 bg-purple-50 rounded-lg p-4"
                >
                  <p
                    class="text-xs text-greys-900 wrap-break-word"
                    style="line-height: var(--leading-5)"
                  >
                    {{ activity.message || activity.content }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="py-8 flex-1 flex flex-col justify-center min-h-full">
        <div class="text-center">
          <Clock :size="32" class="mx-auto text-greys-400 mb-2" />
          <p class="text-sm text-greys-500">No activity yet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  StickyNote, 
  Mail, 
  MessageCircle, 
  Phone,
  FileText,
  Clock,
  Sparkles,
  Plus,
  Paperclip
} from 'lucide-vue-next'
import { DropdownMenu } from '@motork/component-library'

const props = defineProps({
  activities: {
    type: Array,
    default: () => []
  },
  expandedSummaries: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['activity-click', 'toggle-summary-expanded', 'add-activity'])

const showAddDropdown = ref(false)
const showFilterMenu = ref(false)
const filterContainer = ref(null)

// Activity filters
const activityFilters = [
  { label: 'Important', value: 'important' },
  { label: 'Communications', value: 'communications' },
  { label: 'Notes', value: 'notes' },
  { label: 'Transcriptions', value: 'transcriptions' },
  { label: 'System Updates', value: 'system-updates' }
]

const selectedFilters = ref([])

const toggleFilterMenu = () => {
  showFilterMenu.value = !showFilterMenu.value
}

const toggleFilter = (filterValue) => {
  showFilterMenu.value = false
  const index = selectedFilters.value.indexOf(filterValue)
  if (index > -1) {
    selectedFilters.value.splice(index, 1)
  } else {
    selectedFilters.value.push(filterValue)
  }
}

const removeFilter = (filterValue) => {
  const index = selectedFilters.value.indexOf(filterValue)
  if (index > -1) {
    selectedFilters.value.splice(index, 1)
  }
}

const getFilterLabel = (filterValue) => {
  const filter = activityFilters.find(f => f.value === filterValue)
  return filter ? filter.label : filterValue
}

// Build filter menu items
const filterMenuItems = computed(() => {
  return activityFilters.map(filter => ({
    key: filter.value,
    label: filter.label,
    onClick: () => toggleFilter(filter.value),
    className: selectedFilters.value.includes(filter.value) ? 'filter-item-selected' : ''
  }))
})

// Map activity types to filter categories
const getActivityFilterCategory = (activity) => {
  if (activity.important || activity.isImportant) return 'important'
  if (['email', 'sms', 'whatsapp', 'call'].includes(activity.type)) return 'communications'
  if (activity.type === 'note') return 'notes'
  if (activity.type === 'transcription' || activity.transcription) return 'transcriptions'
  if (activity.type === 'system' || activity.type === 'created' || activity.type === 'status') return 'system-updates'
  return null
}

// Sort and filter activities by timestamp (most recent first) and selected filters
const sortedActivities = computed(() => {
  let filtered = [...props.activities]
  
  // Filter by selected filter categories
  if (selectedFilters.value.length > 0) {
    filtered = filtered.filter(activity => {
      const category = getActivityFilterCategory(activity)
      return category && selectedFilters.value.includes(category)
    })
  }
  
  // Sort by timestamp
  return filtered.sort((a, b) => {
    const timeA = new Date(a.timestamp || a.createdAt || 0).getTime()
    const timeB = new Date(b.timestamp || b.createdAt || 0).getTime()
    return timeB - timeA
  })
})

const getActivityDateHeader = (activities) => {
  if (!activities || activities.length === 0) return ''
  
  const mostRecent = activities[0]
  const timestamp = mostRecent.timestamp || mostRecent.createdAt
  
  if (!timestamp) return 'Recent Activity'
  
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  }
  
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  }
  
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  })
}

const handleActivityClick = (activity) => {
  if (['note', 'email', 'whatsapp'].includes(activity.type)) {
    emit('activity-click', activity)
  }
}
</script>

<style scoped>
.size-8 {
  width: 2rem;
  height: 2rem;
}

.wrap-break-word {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Extended styling for Motork DropdownMenu */
:deep(.filter-dropdown-wrapper *) {
  font-size: 0.875rem !important; /* text-sm - smaller text for all items */
}

/* Target all dropdown menu items */
:deep(.filter-dropdown-wrapper button),
:deep(.filter-dropdown-wrapper [role="menuitem"]),
:deep(.filter-dropdown-wrapper a),
:deep(.filter-dropdown-wrapper [class*="item"]) {
  font-size: 0.875rem !important; /* text-sm */
  position: relative;
  padding-left: 2.5rem !important; /* Space for dot */
}

/* Selected item styling using className */
:deep(.filter-dropdown-wrapper .filter-item-selected),
:deep(.filter-dropdown-wrapper button.filter-item-selected),
:deep(.filter-dropdown-wrapper [class*="item"].filter-item-selected) {
  background-color: var(--color-bg-surface-secondary) !important; /* Light grey background */
}

/* Highlight dot for selected item */
:deep(.filter-dropdown-wrapper .filter-item-selected::before),
:deep(.filter-dropdown-wrapper button.filter-item-selected::before),
:deep(.filter-dropdown-wrapper [class*="item"].filter-item-selected::before) {
  content: '';
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background-color: var(--brand-dark); /* Black dot instead of red */
}
</style>
