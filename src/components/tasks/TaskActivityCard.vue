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
        <h3 class="text-base font-medium text-foreground leading-6">Activity</h3>
        
        <!-- Filter Dropdown, Add Activity Button, and Chips (Right side of title) -->
        <div class="flex items-center gap-2 flex-wrap">
          <!-- Filter Dropdown Button -->
          <div class="relative" ref="filterContainer">
            <Button
              variant="outline"
              size="icon"
              @click.stop="toggleFilterMenu"
              class="relative w-8 h-8"
            >
              <i class="fa-solid fa-filter text-sm"></i>
              <span 
                v-if="selectedFilters.length > 0"
                class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white bg-black"
              ></span>
            </Button>
            
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
          
          <!-- Add Activity Button -->
          <div class="relative">
            <Button
              variant="default"
              size="icon"
              @click.stop="showAddDropdown = !showAddDropdown"
              class="relative w-8 h-8 bg-primary text-white border border-primary hover:bg-primary/90"
              aria-label="Add activity"
            >
              <i class="fa-solid fa-plus text-sm"></i>
            </Button>
            <div
              v-if="showAddDropdown"
              class="absolute right-0 top-full mt-2 w-48 bg-white border border-black/10 rounded-lg shadow-nsc-card py-1 z-50"
              v-click-outside="() => showAddDropdown = false"
              @click.stop
            >
            <!-- Communication Group -->
            <button @click="handleAddActivity('email')" class="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center gap-2">
              <i class="fa-solid fa-envelope text-sm text-primary"></i> Email
            </button>
            <button @click="handleAddActivity('sms')" class="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center gap-2">
              <i class="fa-solid fa-comment text-sm text-purple-600"></i> SMS
            </button>
            <button @click="handleAddActivity('whatsapp')" class="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center gap-2">
              <i class="fa-brands fa-whatsapp text-sm text-green-600"></i> WhatsApp
            </button>
            <button @click="handleAddActivity('call')" class="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center gap-2">
              <i class="fa-solid fa-phone text-sm text-green-600"></i> Call
            </button>

            <div class="border-t border-black/10 my-1"></div>

            <!-- Activities Group -->
            <button @click="handleAddActivity('note')" class="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center gap-2">
              <i class="fa-solid fa-sticky-note text-sm text-orange-600"></i> Note
            </button>
            <button @click="handleAddActivity('attachment')" class="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center gap-2">
              <i class="fa-solid fa-paperclip text-sm text-muted-foreground"></i> Attachment
            </button>
        </div>
      </div>
          </div> <!-- Close flex items-center gap-2 flex-wrap -->
        </div> <!-- Close flex items-center justify-between mb-2 -->
      </div> <!-- Close mb-4 -->
    
    <div class="space-y-6 flex-1 flex flex-col min-h-0">
      <div v-if="sortedActivities.length > 0" class="flex-1 overflow-y-auto min-h-0">
        <div class="flex flex-col items-start gap-1 mb-4">
          <h3
            class="text-sm font-normal text-muted-foreground leading-normal"
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
                            : 'bg-muted',
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
                <FileText v-else :size="16" class="text-foreground" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <p
                    class="text-sm text-foreground flex-1 wrap-break-word min-w-0 leading-normal"
                  >
                    <span
                      :class="[
                        'font-normal',
                        activity.type === 'ai-summary' ? 'font-medium' : '',
                      ]"
                    >
                      {{ activity.type === 'ai-summary' ? 'MotorKAI' : activity.user }}
                    </span>
                    <span v-if="activity.type === 'note'" class="text-muted-foreground">
                      added a note</span
                    >
                    <span
                      v-else-if="activity.type === 'created'"
                      class="text-muted-foreground"
                    >
                      {{ activity.message || activity.action }}</span
                    >
                    <span v-else-if="activity.type === 'call'" class="text-muted-foreground">
                      {{ ' ' + (activity.message || activity.action) }}</span
                    >
                    <span
                      v-else-if="activity.type === 'ai-summary'"
                      class="text-muted-foreground"
                    >
                      summary</span
                    >
                    <span v-else-if="activity.type === 'email'" class="text-muted-foreground">
                      {{ ' sent an email' }}</span
                    >
                    <span
                      v-else-if="activity.type === 'whatsapp'"
                      class="text-muted-foreground"
                    >
                      {{ ' sent a WhatsApp message' }}</span
                    >
                    <span v-else class="text-muted-foreground">
                      {{ ' ' + (activity.message || activity.action) }}</span
                    >
                  </p>
                  <p
                    class="text-sm text-muted-foreground text-right shrink-0 w-14 leading-normal"
                  >
                    {{ activity.time }}
                  </p>
                </div>
                <div
                  v-if="activity.type === 'note' && (activity.message || activity.content)"
                  class="mt-2 bg-amber-50 rounded-lg p-4 backdrop-blur-sm"
                >
                  <p
                    class="text-sm text-foreground wrap-break-word leading-normal"
                  >
                    {{ activity.message || activity.content }}
                  </p>
                </div>
                <div
                  v-if="activity.type === 'email' && activity.content"
                  class="mt-2 bg-blue-50 rounded-lg p-4"
                >
                  <p
                    class="text-sm text-foreground wrap-break-word leading-normal"
                  >
                    {{ activity.content }}
                  </p>
                </div>
                <div
                  v-if="activity.type === 'whatsapp' && activity.content"
                  class="mt-2 bg-green-50 rounded-lg p-4"
                >
                  <p
                    class="text-sm text-foreground wrap-break-word leading-normal"
                  >
                    {{ activity.content }}
                  </p>
                </div>
                <div
                  v-if="activity.type === 'ai-summary' && (activity.message || activity.content)"
                  class="mt-2 bg-purple-50 rounded-lg p-4"
                >
                  <p
                    class="text-sm text-foreground wrap-break-word leading-normal"
                  >
                    {{ activity.message || activity.content }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Selected Filter Chips -->
          <div v-if="selectedFilters.length > 0" class="flex items-center gap-2 flex-wrap">
            <div
              v-for="filterValue in selectedFilters"
              :key="filterValue"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-sm font-medium text-foreground border border-border"
            >
              <span>{{ getFilterLabel(filterValue) }}</span>
              <Button
                variant="ghost"
                size="icon"
                @click="removeFilter(filterValue)"
                class="w-4 h-4 rounded-full"
                aria-label="Remove filter"
              >
                <i class="fa-solid fa-xmark text-sm"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="py-8 flex-1 flex flex-col justify-center min-h-full">
        <div class="text-center">
          <Clock :size="32" class="mx-auto text-muted-foreground mb-2" />
          <p class="text-sm text-muted-foreground">No activity yet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Button } from '@motork/component-library/future/primitives'
import { 
  StickyNote, 
  Mail, 
  MessageCircle, 
  Phone,
  FileText,
  Clock,
  Sparkles,
  Paperclip
} from 'lucide-vue-next'
import { DropdownMenu } from '@motork/component-library/future/primitives'

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

const handleAddActivity = (action) => {
  showAddDropdown.value = false
  emit('add-activity', action)
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
