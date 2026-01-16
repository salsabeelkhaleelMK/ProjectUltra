<template>
  <div 
    class="bg-surface border-l border shrink-0 flex flex-col transition-all duration-300"
    :class="[
      collapsed ? 'w-16' : 'w-80',
      mobileFullscreen ? 'xl:relative xl:border-l' : ''
    ]"
    v-if="show"
  >
    <div class="h-16 px-5 border-b border bg-surfaceSecondary/50 flex items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <!-- Mobile close button -->
        <button 
          v-if="mobileFullscreen"
          @click="$emit('close')"
          class="xl:hidden w-8 h-8 flex items-center justify-center text-body hover:text-heading hover:bg-surfaceSecondary rounded-lg transition-colors"
        >
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
        <!-- Desktop collapse button -->
        <button 
          v-else-if="showCollapse"
          @click="$emit('toggle-collapse')"
          class="w-8 h-8 flex items-center justify-center rounded-md text-sub hover:text-heading hover:bg-surfaceSecondary transition-colors shrink-0"
          :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <i v-if="collapsed" class="fa-solid fa-arrow-left text-sm"></i>
          <i v-else class="fa-solid fa-arrow-right text-sm"></i>
        </button>
        <h2 v-if="!collapsed" class="font-bold text-lg text-heading">{{ title }}</h2>
      </div>
    </div>
    
    <!-- Expanded View -->
    <div v-if="!collapsed" class="flex-1 overflow-y-auto px-5 py-6 scrollbar-hide relative">
      <div v-if="activities.length > 0" class="absolute left-[2.4375rem] top-0 bottom-0 w-0.5 bg-border z-0"></div>
      <div v-if="activities.length === 0" class="text-center py-8 text-sub relative z-10">
        <i class="fa-solid fa-clock text-4xl mb-2"></i>
        <p class="text-sm">{{ emptyMessage }}</p>
      </div>
      
      <div v-else class="space-y-6 relative z-10">
        <template v-for="(activity, idx) in activities" :key="activity.id">
          <div v-if="shouldShowDateHeader(idx, activity)" class="mb-4 pl-12">
            <h3 class="text-sm font-semibold text-heading">{{ formatActivityDate(activity.timestamp) }}</h3>
          </div>
          <div class="flex gap-4 relative mb-6">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 relative bg-surface"
              :class="getActivityIconClass(activity.type)"
            >
              <i :class="getActivityIcon(activity.type)" class="text-sm"></i>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm text-slate-700 leading-snug">
                <span class="font-bold">{{ activity.user }}</span> {{ activity.action }}
              </div>
              <div v-if="activity.content" class="mt-2 bg-orange-50/50 border border-orange-100 p-3 rounded-lg text-sm text-body">
                {{ activity.content }}
              </div>
              <div class="text-xs text-sub mt-1">{{ formatActivityTime(activity.timestamp) }}</div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Collapsed View -->
    <div v-else class="flex-1 overflow-y-auto py-6 scrollbar-hide relative flex flex-col items-center">
      <!-- Timeline line -->
      <div v-if="activities.length > 0" class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 z-0"></div>
      
      <!-- Activity icons -->
      <div v-if="activities.length > 0" class="space-y-4 relative z-10">
        <div
          v-for="activity in activities"
          :key="activity.id"
          class="relative"
        >
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 relative bg-surface border-2 border"
            :class="getActivityIconClass(activity.type)"
            :title="`${activity.user} ${activity.action}`"
          >
            <i :class="getActivityIcon(activity.type)" class="text-xs"></i>
          </div>
        </div>
      </div>
      
      <!-- Empty state when collapsed -->
      <div v-else class="text-center py-8 text-sub relative z-10">
        <i class="fa-solid fa-clock text-2xl mb-2"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Activity summary'
  },
  activities: {
    type: Array,
    default: () => []
  },
  emptyMessage: {
    type: String,
    default: 'No activities yet'
  },
  collapsed: {
    type: Boolean,
    default: true
  },
  showCollapse: {
    type: Boolean,
    default: true
  },
  show: {
    type: Boolean,
    default: true
  },
  mobileFullscreen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-collapse', 'close'])

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

const formatActivityDate = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
}

const formatActivityTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const shouldShowDateHeader = (idx, activity) => {
  if (idx === 0) return true
  const prevActivity = props.activities[idx - 1]
  if (!prevActivity) return true
  
  const currentDate = new Date(activity.timestamp).toDateString()
  const prevDate = new Date(prevActivity.timestamp).toDateString()
  
  return currentDate !== prevDate
}
</script>

