<template>
  <div 
    v-if="show"
    class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-xl max-w-4xl w-full p-6 shadow-2xl">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-slate-800">What's the outcome?</h2>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <i class="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>
      
      <!-- 3 Primary Outcomes -->
      <div class="grid grid-cols-3 gap-4 mb-6">
        <button 
          @click="selectOutcome('no-answer')"
          class="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all"
          :class="outcome === 'no-answer' 
            ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md' 
            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'"
        >
          <i class="fa-solid fa-phone-slash text-2xl"></i>
          <span class="font-semibold">No answer</span>
        </button>
        
        <button 
          @click="selectOutcome('not-valid')"
          class="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all"
          :class="outcome === 'not-valid' 
            ? 'bg-red-50 border-red-500 text-red-700 shadow-md' 
            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'"
        >
          <i class="fa-solid fa-thumbs-down text-2xl"></i>
          <span class="font-semibold">Not valid</span>
        </button>
        
        <button 
          @click="selectOutcome('interested')"
          class="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 transition-all"
          :class="outcome === 'interested' 
            ? 'bg-green-50 border-green-500 text-green-700 shadow-md' 
            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'"
        >
          <i class="fa-solid fa-check text-2xl"></i>
          <span class="font-semibold">Interested</span>
        </button>
      </div>
      
      <!-- Dynamic Content Based on Selection -->
      <div v-if="outcome" class="border-t border-gray-200 pt-6">
        <NoAnswerFollowupModal
          v-if="outcome === 'no-answer'"
          :lead="lead"
          :call-notes="callNotes"
          @confirm="handleNoAnswerConfirm"
          @cancel="outcome = null"
        />
        
        <DisqualifyModal
          v-else-if="outcome === 'not-valid'"
          :show="true"
          @confirm="handleNotValidConfirm"
          @cancel="outcome = null"
        />
        
        <InterestedQualificationModal
          v-else-if="outcome === 'interested'"
          :lead="lead"
          :call-notes="callNotes"
          :extracted-data="extractedData"
          @confirm="handleInterestedConfirm"
          @cancel="outcome = null"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NoAnswerFollowupModal from './NoAnswerFollowupModal.vue'
import InterestedQualificationModal from './InterestedQualificationModal.vue'
import DisqualifyModal from '@/components/tasks/modals/DisqualifyModal.vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  lead: {
    type: Object,
    required: true
  },
  callNotes: {
    type: String,
    default: ''
  },
  extractedData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'outcome-selected'])

const outcome = ref(null)

const selectOutcome = (selected) => {
  outcome.value = selected
}

const handleNoAnswerConfirm = (data) => {
  emit('outcome-selected', {
    outcome: 'no-answer',
    ...data
  })
}

const handleNotValidConfirm = (data) => {
  emit('outcome-selected', {
    outcome: 'not-valid',
    category: data.category,
    reason: data.reason
  })
}

const handleInterestedConfirm = (data) => {
  emit('outcome-selected', {
    outcome: 'interested',
    ...data
  })
}
</script>
