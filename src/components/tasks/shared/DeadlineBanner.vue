<template>
  <div 
    v-if="shouldShow"
    class="mx-4 mt-4 px-4 py-3 rounded-lg border flex items-center justify-between"
    :class="[deadlineStatus.bgClass, deadlineStatus.borderClass]"
  >
    <div class="flex items-center gap-3">
      <div 
        class="w-9 h-9 rounded-lg flex items-center justify-center"
        :class="[deadlineStatus.bgClass, deadlineStatus.borderClass, 'border']"
      >
        <i 
          class="text-sm"
          :class="[`fa-solid ${deadlineStatus.icon}`, deadlineStatus.textClass]"
        ></i>
      </div>
      <div class="flex-1">
        <div class="text-fluid-xs font-medium text-gray-600 mb-0.5">Next Action Due</div>
        <div 
          class="text-fluid-sm font-bold"
          :class="deadlineStatus.textClass"
        >
          {{ formatDeadlineFull(nextActionDue) }}
          <span v-if="deadlineStatus.type !== 'overdue'" class="text-fluid-xs font-normal opacity-75">
            ({{ formatDueDate(nextActionDue) }})
          </span>
        </div>
      </div>
      <div 
        v-if="deadlineStatus.type === 'overdue'"
        class="text-fluid-xs font-bold uppercase px-2.5 py-1 rounded-md"
        :class="[deadlineStatus.bgClass, deadlineStatus.textClass, deadlineStatus.borderClass, 'border']"
      >
        <i class="fa-solid fa-exclamation-circle mr-1"></i>
        Overdue
      </div>
      <div 
        v-else-if="deadlineStatus.type === 'urgent'"
        class="text-fluid-xs font-bold uppercase px-2.5 py-1 rounded-md"
        :class="[deadlineStatus.bgClass, deadlineStatus.textClass, deadlineStatus.borderClass, 'border']"
      >
        <i class="fa-solid fa-bolt mr-1"></i>
        Urgent
      </div>
    </div>
    <button
      @click="dismiss"
      class="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors ml-2 shrink-0"
      title="Dismiss"
    >
      <i class="fa-solid fa-xmark text-xs"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatDueDate, formatDeadlineFull, getDeadlineStatus } from '@/utils/formatters'

const props = defineProps({
  nextActionDue: {
    type: String,
    default: null
  },
  isClosed: {
    type: Boolean,
    default: false
  },
  showDeadlineBanner: {
    type: Boolean,
    default: true
  },
  taskId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['dismissed'])

// Track dismissed state per component instance
const isDismissed = ref(false)

const deadlineStatus = computed(() => {
  return getDeadlineStatus(props.nextActionDue)
})

const shouldShow = computed(() => {
  if (props.isClosed) return false
  if (!props.showDeadlineBanner) return false
  if (isDismissed.value) return false
  // Only show for overdue or urgent
  return deadlineStatus.value.type === 'overdue' || deadlineStatus.value.type === 'urgent'
})

const dismiss = () => {
  isDismissed.value = true
  emit('dismissed')
}
</script>

