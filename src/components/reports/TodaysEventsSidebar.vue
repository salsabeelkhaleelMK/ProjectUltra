<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
    <h2 class="label-upper mb-4">Today's Events</h2>
    <div class="space-y-4">
      <div
        v-for="event in events"
        :key="event.id"
        class="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
      >
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <i class="fa-regular fa-calendar text-blue-600 text-sm"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="label-upper mb-1 text-gray-400">{{ event.time }}</div>
            <div class="text-content-bold mb-0.5">{{ event.type }}</div>
            <div class="text-[11px] text-gray-600 leading-tight">{{ event.customer }}</div>
            <div class="text-[10px] text-gray-400 mt-0.5">{{ event.location }}</div>
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

