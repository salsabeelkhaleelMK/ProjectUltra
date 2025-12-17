<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
    <h2 class="text-sm font-bold text-gray-900 mb-4">Today's Events</h2>
    <div class="space-y-4">
      <div
        v-for="event in events"
        :key="event.id"
        class="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
      >
        <div class="flex items-start gap-3">
          <div class="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <i class="fa-regular fa-calendar text-blue-600"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-xs font-semibold text-gray-500 mb-1">{{ event.time }}</div>
            <div class="text-sm font-bold text-gray-900 mb-1">{{ event.type }}</div>
            <div class="text-xs text-gray-600">{{ event.customer }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ event.location }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  events: {
    type: Array,
    required: true
  }
})
</script>

