<template>
  <div class="bg-purple-50/50 border border-purple-100 rounded-lg p-4 relative transition-all duration-300">
    <div class="flex justify-between items-start mb-3">
      <div>
        <h4 class="font-bold text-slate-800 text-sm">Opportunity Follow-up</h4>
        <p class="text-xs text-gray-500 mt-0.5">No contract date exists. Push to close or schedule a closing meeting to finalize the deal.</p>
      </div>
    </div>
    <div class="flex gap-3 flex-wrap">
      <button
        @click="handleCloseOpportunity"
        class="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
      >
        Close Opportunity
      </button>
      <button
        @click="handleScheduleClosing"
        class="bg-white hover:bg-gray-50 border border-gray-200 text-slate-700 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
      >
        Schedule Closing Meeting
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  opportunity: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close-opportunity', 'schedule-closing'])

const handleCloseOpportunity = () => {
  emit('close-opportunity', props.opportunity)
}

const handleScheduleClosing = () => {
  emit('schedule-closing', props.opportunity)
}
</script>

