<template>
  <div class="bg-gray-50/50 border border-gray-200 rounded-lg p-4 relative transition-all duration-300">
    <div class="flex justify-between items-start mb-3">
      <div>
        <h4 class="font-bold text-slate-800 text-sm">Close Opportunity</h4>
        <p class="text-xs text-gray-500 mt-0.5">Mark this opportunity as won or lost to close the deal.</p>
      </div>
    </div>
    <div class="flex gap-3 flex-wrap">
      <button
        @click="handleCloseWon"
        class="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
      >
        Close as Won <i class="fa-solid fa-check-circle"></i>
      </button>
      <button
        @click="handleCloseLost"
        class="bg-white hover:bg-red-50 border border-gray-200 text-slate-700 hover:text-red-600 hover:border-red-200 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
      >
        Close as Lost <i class="fa-solid fa-times-circle"></i>
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

const emit = defineEmits(['close-won', 'close-lost'])

const handleCloseWon = () => {
  emit('close-won', props.opportunity)
}

const handleCloseLost = () => {
  emit('close-lost', props.opportunity)
}
</script>

