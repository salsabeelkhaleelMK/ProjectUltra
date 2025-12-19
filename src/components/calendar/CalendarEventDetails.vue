<template>
  <div class="space-y-4">
    <!-- Date & Time -->
    <div class="flex items-start gap-3">
      <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
        <i class="fa-regular fa-calendar text-blue-600 text-sm"></i>
      </div>
      <div>
        <p class="text-content-bold">{{ formattedDate }}</p>
        <p class="text-meta">{{ formattedStartTime }} - {{ formattedEndTime }}</p>
      </div>
    </div>
    
    <!-- Customer -->
    <div v-if="event.customer" class="flex items-start gap-3">
      <div class="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
        <i class="fa-regular fa-user text-green-600 text-sm"></i>
      </div>
      <div>
        <p class="text-content-bold">{{ event.customer }}</p>
        <p class="text-meta">Customer</p>
      </div>
    </div>
    
    <!-- Vehicle -->
    <div v-if="event.vehicle" class="flex items-start gap-3">
      <div class="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
        <i class="fa-solid fa-car text-purple-600 text-sm"></i>
      </div>
      <div>
        <p class="text-content-bold">{{ event.vehicle }}</p>
        <p class="text-meta">Vehicle</p>
      </div>
    </div>
    
    <!-- Dealership -->
    <div v-if="event.dealership" class="flex items-start gap-3">
      <div class="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
        <i class="fa-solid fa-building text-orange-600 text-sm"></i>
      </div>
      <div>
        <p class="text-content-bold">{{ event.dealership }}</p>
        <p class="text-meta">Dealership</p>
      </div>
    </div>
    
    <!-- Assignee -->
    <div v-if="event.assignee" class="flex items-start gap-3">
      <div class="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
        <i class="fa-regular fa-id-badge text-indigo-600 text-sm"></i>
      </div>
      <div>
        <p class="text-content-bold">{{ event.assignee }}</p>
        <p class="text-meta">Assigned to</p>
      </div>
    </div>
    
    <!-- Team -->
    <div v-if="event.team" class="flex items-start gap-3">
      <div class="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
        <i class="fa-solid fa-users text-teal-600 text-sm"></i>
      </div>
      <div>
        <p class="text-content-bold">{{ event.team }}</p>
        <p class="text-meta">Team</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatEventDate, formatEventTime } from '@/utils/calendarHelpers'

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

const formattedDate = computed(() => formatEventDate(props.event.start))
const formattedStartTime = computed(() => formatEventTime(props.event.start))
const formattedEndTime = computed(() => formatEventTime(props.event.end))
</script>

