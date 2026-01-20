<template>
  <div class="bg-greys-100 rounded-xl p-1 flex flex-col shrink-0" style="background-color: var(--base-muted, #f5f5f5)">
    <div class="bg-white rounded-lg shadow-sm flex flex-col" style="box-shadow: var(--nsc-card-shadow);">
    <!-- Loading Skeleton -->
    <template v-if="loading">
      <div class="px-4 py-4 shrink-0">
        <div class="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      <div class="px-4 pb-4 space-y-3">
        <div
          v-for="n in 5"
          :key="`skeleton-${n}`"
          class="pb-3 border-b border-gray-50 last:border-0 last:pb-0"
        >
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div class="flex-1 min-w-0 space-y-2">
              <div class="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div class="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div class="h-3 bg-gray-200 rounded w-40 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <!-- Actual Content -->
    <template v-else>
      <!-- Title Section -->
      <div class="px-4 py-4 flex items-center gap-2 shrink-0">
        <Calendar :size="16" class="text-heading" />
        <h3 class="text-lg font-medium text-heading leading-5">Today's events</h3>
      </div>
      <div class="px-4 pb-4 space-y-3">
        <div
          v-for="event in events"
          :key="event.id"
          class="pb-3 border-b border-black/5 last:border-0 last:pb-0"
        >
        <div class="flex items-start gap-3">
          <!-- Compact Date/Time Square -->
          <div class="w-10 h-10 rounded-lg bg-greys-50 border border-black/5 flex flex-col items-center justify-center shrink-0 leading-none">
            <span class="text-fluid-xs font-medium text-greys-500 uppercase">{{ event.time.split(':')[0] }}</span>
            <span class="text-fluid-xs font-semibold text-greys-900 mt-0.5">{{ event.time.split(':')[1].split(' ')[0] }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <div class="text-fluid-xs font-medium text-greys-900 truncate">{{ event.type }}</div>
              <div class="text-fluid-xs text-greys-500">{{ event.time }}</div>
            </div>
            <div class="text-fluid-xs text-greys-500 mt-0.5 truncate">{{ event.customer }}</div>
            <div class="text-fluid-xs text-greys-500 mt-0.5 truncate flex items-center gap-1">
              <i class="fa-solid fa-location-dot text-fluid-xs"></i>
              {{ event.location }}
            </div>
          </div>
        </div>
      </div>
    </div>
    </template>
    </div>
  </div>
</template>

<script setup>
import { Calendar } from 'lucide-vue-next'

defineProps({
  events: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

