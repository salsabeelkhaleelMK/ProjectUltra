/**
 * Shared helpers for activity summary timeline (icons, formatting).
 * Used by ActivitySummaryTimeline, ActivitySummaryCard, ActivitySummarySidebar.
 */

const ICONS = {
  call: 'fa-solid fa-phone text-blue-600',
  email: 'fa-solid fa-envelope text-green-600',
  note: 'fa-solid fa-sticky-note text-yellow-600',
  meeting: 'fa-solid fa-calendar text-purple-600',
  task: 'fa-solid fa-check-circle text-indigo-600',
  attachment: 'fa-solid fa-paperclip text-body',
  status: 'fa-solid fa-tag text-orange-600',
  default: 'fa-solid fa-circle text-sub'
}

const ICON_CLASSES = {
  call: 'bg-blue-100 text-blue-600',
  email: 'bg-green-100 text-green-600',
  note: 'bg-yellow-100 text-yellow-600',
  meeting: 'bg-purple-100 text-purple-600',
  task: 'bg-indigo-100 text-indigo-600',
  attachment: 'bg-surfaceSecondary text-body',
  status: 'bg-orange-100 text-orange-600',
  default: 'bg-surfaceSecondary text-sub'
}

export function getActivityIcon(type) {
  return ICONS[type] || ICONS.default
}

export function getActivityIconClass(type) {
  return ICON_CLASSES[type] || ICON_CLASSES.default
}

export function formatActivityTime(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export function formatActivityDate(timestamp) {
  if (!timestamp) return ''
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
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function shouldShowDateHeader(idx, activity, activities) {
  if (idx === 0) return true
  const prev = activities[idx - 1]
  if (!prev) return true
  const currentDate = new Date(activity.timestamp).toDateString()
  const prevDate = new Date(prev.timestamp).toDateString()
  return currentDate !== prevDate
}
