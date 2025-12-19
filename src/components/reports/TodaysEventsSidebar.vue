<template>
  <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-5">
    <h2 class="label-upper !text-[10px] mb-4">Today's Events</h2>
    <div class="space-y-3">
      <div
        v-for="event in events"
        :key="event.id"
        class="pb-3 border-b border-gray-50 last:border-0 last:pb-0"
      >
        <div class="flex items-start gap-3">
          <!-- Compact Date/Time Square -->
          <div class="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex flex-col items-center justify-center shrink-0 leading-none">
            <span class="text-[10px] font-bold text-gray-400 uppercase">{{ event.time.split(':')[0] }}</span>
            <span class="text-xs font-bold text-gray-900 mt-0.5">{{ event.time.split(':')[1].split(' ')[0] }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <div class="text-[11px] font-bold text-gray-900 truncate">{{ event.type }}</div>
              <div class="text-[10px] text-gray-400">{{ event.time }}</div>
            </div>
            <div class="text-[10px] text-gray-500 mt-0.5 truncate">{{ event.customer }}</div>
            <div class="text-[10px] text-gray-400 mt-0.5 truncate flex items-center gap-1">
              <i class="fa-solid fa-location-dot text-[8px]"></i>
              {{ event.location }}
            </div>
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

