<template>
  <ModalShell
    :show="show"
    :title="event?.title || 'Event Details'"
    size="md"
    :show-close-button="false"
    @close="$emit('close')"
    @cancel="$emit('close')"
  >
    <!-- Custom header with event type styling -->
    <template #header>
      <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white" :class="getEventTypeHeaderClass(event?.type)">
        <div class="flex-1 min-w-0 pr-4">
          <div class="flex items-center gap-2 mb-1">
            <span class="badge-ui" :class="getEventTypeBadgeClass(event?.type)">
              {{ getEventTypeLabel(event?.type) }}
            </span>
            <span 
              v-if="event?.status === 'cancelled'"
              class="badge-ui bg-red-100 text-red-700 border-red-200"
            >
              Cancelled
            </span>
            <span 
              v-else-if="event?.status === 'no-show'"
              class="badge-ui bg-orange-100 text-orange-700 border-orange-200"
            >
              No-show
            </span>
          </div>
          <h3 class="text-xl font-bold tracking-tight truncate" :class="getEventTypeTextClass(event?.type)">
            {{ event?.title }}
          </h3>
        </div>
        <button
          @click="$emit('close')"
          class="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-sm transition-all"
        >
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>
    </template>

    <!-- Event Details -->
    <CalendarEventDetails v-if="event" :event="event" />

    <!-- Custom footer with delete and edit buttons -->
    <template #actions>
      <button 
        v-if="event?.id"
        @click="$emit('delete', event.id)"
        class="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-2 mr-auto order-1"
      >
        <i class="fa-regular fa-trash-can text-xs"></i> 
        <span>Delete</span>
      </button>
      
      <Button
        label="Edit"
        variant="primary"
        size="small"
        class="rounded-sm order-2"
        @click="$emit('edit')"
      >
        <template #icon-left>
          <i class="fa-regular fa-pen-to-square"></i>
        </template>
      </Button>
    </template>
  </ModalShell>
</template>

<script setup>
import { Button } from '@motork/component-library'
import ModalShell from '@/components/shared/ModalShell.vue'
import CalendarEventDetails from '@/components/calendar/CalendarEventDetails.vue'
import { getEventTypeLabel, getEventTypeHeaderClass, getEventTypeBadgeClass, getEventTypeTextClass } from '@/utils/calendarHelpers'

defineProps({
  show: {
    type: Boolean,
    required: true
  },
  event: {
    type: Object,
    default: null
  }
})

defineEmits(['close', 'edit', 'delete'])
</script>

