<template>
  <ModalShell
    :show="show"
    :title="event?.title || 'Event Details'"
    size="md"
    @cancel="$emit('close')"
  >
    <!-- Custom header with event type styling -->
    <template #header>
      <div class="p-5" :class="getEventTypeHeaderClass(event?.type)">
        <div class="flex items-start justify-between">
          <div>
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
            <h3 class="font-bold text-lg" :class="getEventTypeTextClass(event?.type)">
              {{ event?.title }}
            </h3>
          </div>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
    </template>

    <!-- Event Details -->
    <CalendarEventDetails v-if="event" :event="event" />

    <!-- Custom footer with delete and edit buttons -->
    <template #footer>
      <div class="p-4 bg-gray-50 flex justify-between items-center border-t border-gray-100">
        <button 
          v-if="event?.id"
          @click="$emit('delete', event.id)"
          class="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
        >
          <i class="fa-regular fa-trash-can text-xs"></i> Delete
        </button>
        <div v-else></div>
        <div class="flex gap-2">
          <Button
            label="Close"
            variant="outline"
            @click="$emit('close')"
          />
          <div class="flex items-center gap-1">
            <i class="fa-regular fa-pen-to-square"></i>
            <Button
              label="Edit"
              variant="primary"
              @click="$emit('edit')"
            />
          </div>
        </div>
      </div>
    </template>
  </ModalShell>
</template>

<script setup>
import { Button } from '@motork/component-library'
import ModalShell from '@/components/shared/ModalShell.vue'
import CalendarEventDetails from './CalendarEventDetails.vue'
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

