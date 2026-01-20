<template>
  <div 
    class="overflow-hidden p-4 rounded-card bg-white shadow-nsc-card"
  >
    <!-- Card Header -->
    <h3 class="text-base font-medium mb-4 text-greys-900 -mx-4 -mt-4 px-4 pt-4 rounded-t-card">Activity</h3>
    
    <!-- Timeline -->
    <div v-if="sortedActivities.length > 0" class="space-y-6">
      <!-- Date Header -->
      <h3 class="text-sm text-greys-500 font-medium">
        {{ getActivityDateHeader(sortedActivities) }}
      </h3>
      
      <!-- Activity Items -->
      <div class="space-y-4">
        <div
          v-for="activity in sortedActivities"
          :key="activity.id"
          class="flex gap-2"
          :class="{
            'cursor-pointer hover:opacity-80 transition-opacity':
              activity.type === 'note' ||
              activity.type === 'email' ||
              activity.type === 'whatsapp' ||
              activity.type === 'survey'
          }"
          @click="handleActivityClick(activity)"
        >
          <!-- Icon -->
          <div 
            class="size-8 rounded-btn flex items-center justify-center shrink-0"
            :style="getIconStyle(activity.type)"
          >
            <component 
              :is="getActivityIcon(activity.type)" 
              :size="16" 
              :class="getIconClass(activity.type)"
            />
          </div>
          
          <!-- Content -->
          <div class="flex-1 min-w-0">
            <!-- Activity Description -->
            <p class="text-sm leading-5">
              <span class="font-normal text-greys-900">{{ activity.user }}</span>
              <span class="text-greys-500"> {{ activity.action }}</span>
            </p>
            
            <!-- Activity Content (for notes and messages) -->
            <div 
              v-if="activity.content && shouldShowContent(activity)" 
              class="mt-2 rounded-card p-4"
              :style="getContentBackgroundStyle(activity.type)"
            >
              <p 
                class="text-sm text-greys-900"
                :class="{ 'whitespace-pre-line': activity.type === 'survey' }"
              >
                {{ getDisplayContent(activity) }}
              </p>
              <button
                v-if="getContentLength(activity) > 100 && !expandedSummaries[activity.id]"
                @click.stop="toggleSummaryExpanded(activity.id)"
                class="text-xs text-blue-600 hover:text-blue-700 mt-1"
              >
                Show more
              </button>
              <button
                v-else-if="getContentLength(activity) > 100 && expandedSummaries[activity.id]"
                @click.stop="toggleSummaryExpanded(activity.id)"
                class="text-xs text-blue-600 hover:text-blue-700 mt-1"
              >
                Show less
              </button>
            </div>
            
            <!-- Timestamp -->
            <p class="text-xs text-greys-500 mt-1">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-8 text-center">
      <Clock :size="32" class="text-greys-400 mb-2" />
      <p class="text-sm text-greys-500">No activity yet</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  StickyNote, 
  Mail, 
  MessageCircle, 
  Phone, 
  Calendar, 
  FileText,
  Clock,
  User,
  Tag,
  ClipboardCheck
} from 'lucide-vue-next'

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

const emit = defineEmits(['activity-click', 'toggle-summary-expanded'])

// Sort activities by timestamp (most recent first)
const sortedActivities = computed(() => {
  return [...props.activities].sort((a, b) => {
    // Assuming activities have a timestamp field
    const timeA = new Date(a.timestamp || a.createdAt || 0).getTime()
    const timeB = new Date(b.timestamp || b.createdAt || 0).getTime()
    return timeB - timeA // Descending order (most recent first)
  })
})

const getActivityIcon = (type) => {
  const iconMap = {
    note: StickyNote,
    email: Mail,
    whatsapp: MessageCircle,
    sms: MessageCircle,
    call: Phone,
    meeting: Calendar,
    task: FileText,
    status_change: Tag,
    assignment: User,
    survey: ClipboardCheck
  }
  
  return iconMap[type] || FileText
}

const getIconStyle = (type) => {
  const styleMap = {
    note: 'background-color: #fef7ee;',
    email: 'background-color: #eff6ff;',
    whatsapp: 'background-color: #dcfce7;',
    sms: 'background-color: #f3e8ff;',
    call: 'background-color: #dbeafe;',
    meeting: 'background-color: #e0e7ff;',
    task: 'background-color: #f5f5f5;',
    status_change: 'background-color: #fef3c7;',
    assignment: 'background-color: #e5e7eb;',
    survey: 'background-color: #f0f9ff;'
  }
  
  return styleMap[type] || 'background-color: #f5f5f5;'
}

const getIconClass = (type) => {
  const classMap = {
    note: 'text-orange-600',
    email: 'text-blue-600',
    whatsapp: 'text-green-600',
    sms: 'text-purple-600',
    call: 'text-blue-500',
    meeting: 'text-indigo-600',
    task: 'text-gray-600',
    status_change: 'text-yellow-600',
    assignment: 'text-gray-500',
    survey: 'text-blue-600'
  }
  
  return classMap[type] || 'text-gray-600'
}

const getContentBackgroundStyle = (type) => {
  const bgMap = {
    note: 'background-color: #fef7ee;',
    email: 'background-color: #eff6ff;',
    whatsapp: 'background-color: #dcfce7;',
    survey: 'background-color: #f0f9ff;'
  }
  
  return bgMap[type] || 'background-color: #f5f5f5;'
}

const shouldShowContent = (activity) => {
  // Show content for notes, emails, whatsapp messages, and surveys
  return ['note', 'email', 'whatsapp', 'survey'].includes(activity.type) && activity.content
}

const getDisplayContent = (activity) => {
  if (!activity.content) return ''
  
  // For survey activities, format JSON responses as readable text
  if (activity.type === 'survey') {
    try {
      const responses = typeof activity.content === 'string' 
        ? JSON.parse(activity.content) 
        : activity.content
      
      // Format survey responses as key-value pairs
      const formattedResponses = Object.entries(responses)
        .filter(([key, value]) => value && value !== '')
        .map(([key, value]) => {
          // Convert camelCase to readable labels
          const label = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim()
          return `${label}: ${value}`
        })
        .join('\n')
      
      const fullContent = formattedResponses || activity.content
      
      // If expanded, show full content
      if (props.expandedSummaries[activity.id]) {
        return fullContent
      }
      
      // Otherwise, truncate to 100 characters
      if (fullContent.length > 100) {
        return fullContent.substring(0, 100) + '...'
      }
      
      return fullContent
    } catch (e) {
      // If parsing fails, treat as regular string
      const content = activity.content
      if (props.expandedSummaries[activity.id]) {
        return content
      }
      if (content.length > 100) {
        return content.substring(0, 100) + '...'
      }
      return content
    }
  }
  
  // For other activity types, show content as-is
  if (props.expandedSummaries[activity.id]) {
    return activity.content
  }
  
  // Otherwise, truncate to 100 characters
  if (activity.content.length > 100) {
    return activity.content.substring(0, 100) + '...'
  }
  
  return activity.content
}

const getActivityDateHeader = (activities) => {
  if (!activities || activities.length === 0) return ''
  
  // Get the most recent activity's timestamp
  const mostRecent = activities[0]
  const timestamp = mostRecent.timestamp || mostRecent.createdAt
  
  if (!timestamp) return 'Recent Activity'
  
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  // Check if today
  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  }
  
  // Check if yesterday
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  }
  
  // Otherwise, return formatted date
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  })
}

const handleActivityClick = (activity) => {
  // Only emit click for activities that have detailed views
  if (['note', 'email', 'whatsapp', 'survey'].includes(activity.type)) {
    emit('activity-click', activity)
  }
}

const toggleSummaryExpanded = (activityId) => {
  emit('toggle-summary-expanded', activityId)
}

const getContentLength = (activity) => {
  if (!activity.content) return 0
  if (activity.type === 'survey') {
    try {
      const responses = typeof activity.content === 'string' 
        ? JSON.parse(activity.content) 
        : activity.content
      const formattedResponses = Object.entries(responses)
        .filter(([key, value]) => value && value !== '')
        .map(([key, value]) => {
          const label = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim()
          return `${label}: ${value}`
        })
        .join('\n')
      return formattedResponses.length || activity.content.length
    } catch (e) {
      return activity.content.length
    }
  }
  return activity.content.length
}
</script>

<style scoped>
.text-greys-400 {
  color: #9CA3AF;
}

.text-greys-500 {
  color: #6B7280;
}

.text-greys-900 {
  color: #111827;
}

.size-8 {
  width: 2rem;
  height: 2rem;
}
</style>
