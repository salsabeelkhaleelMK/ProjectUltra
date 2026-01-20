<template>
  <div class="mt-1.5 border-t border pt-1.5">
    <!-- Collapsed State - Minimal Space -->
    <button
      v-if="!isExpanded"
      @click="isExpanded = true"
      class="w-full flex items-center justify-between text-xs text-sub hover:text-body py-0.5 transition-colors"
    >
      <span class="font-medium">Survey / Feedback</span>
      <i class="fa-solid fa-chevron-down text-xs"></i>
    </button>
    
    <!-- Expanded State -->
    <div v-else>
      <div class="flex items-center justify-between mb-1.5">
        <h5 class="text-xs font-semibold text-body">Survey / Feedback</h5>
        <button
          @click="isExpanded = false"
          class="text-xs text-gray-400 hover:text-gray-600 font-medium py-0.5"
        >
          <i class="fa-solid fa-chevron-up text-xs"></i>
        </button>
      </div>
      
      <div class="space-y-1.5">
        <!-- Survey Questions -->
        <div
          v-for="(question, index) in questions"
          :key="index"
          class="bg-surfaceSecondary rounded-md p-1.5"
        >
          <label class="block label-upper mb-1">{{ question.label }}</label>
          
          <!-- Text input -->
          <textarea
            v-if="question.type === 'text'"
            v-model="responses[question.key]"
            :placeholder="question.placeholder"
            rows="2"
            class="input resize-none text-xs py-1 px-2"
          ></textarea>
          
          <!-- Select dropdown -->
          <select
            v-else-if="question.type === 'select'"
            v-model="responses[question.key]"
            class="input text-xs py-1 px-2"
          >
            <option value="">Select an option...</option>
            <option
              v-for="option in question.options"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
          
          <!-- Radio buttons -->
          <div
            v-else-if="question.type === 'radio'"
            class="space-y-0.5"
          >
            <label
              v-for="option in question.options"
              :key="option"
              class="flex items-center text-xs"
            >
              <input
                type="radio"
                v-model="responses[question.key]"
                :value="option"
                class="mr-1"
              />
              {{ option }}
            </label>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-1.5 flex-wrap pt-0.5">
          <button
            @click="handleComplete"
            class="bg-green-600 hover:bg-green-700 text-white font-medium px-2.5 py-1 rounded-md text-xs transition-colors"
          >
            Complete Survey
          </button>
          <button
            @click="handleRefuse"
            class="bg-surface hover:bg-surfaceSecondary border border-E5E7EB text-body font-medium px-2.5 py-1 rounded-md text-xs transition-colors"
          >
            Customer Refused
          </button>
          <button
            @click="handleNotResponding"
            class="bg-surface hover:bg-surfaceSecondary border border-E5E7EB text-body font-medium px-2.5 py-1 rounded-md text-xs transition-colors"
          >
            Not Responding
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  questions: {
    type: Array,
    required: true,
    // Format: [{ key: 'interest', label: 'Is customer still interested?', type: 'select', options: ['Yes', 'No', 'Maybe'], placeholder: '' }]
  },
  initialExpanded: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['survey-completed', 'survey-refused', 'not-responding'])

const isExpanded = ref(props.initialExpanded)
const responses = ref({})

// Initialize responses object
watch(() => props.questions, (newQuestions) => {
  const initialResponses = {}
  newQuestions.forEach(q => {
    initialResponses[q.key] = ''
  })
  responses.value = initialResponses
}, { immediate: true })

const handleComplete = () => {
  emit('survey-completed', { ...responses.value })
  resetForm()
}

const handleRefuse = () => {
  emit('survey-refused')
  resetForm()
}

const handleNotResponding = () => {
  emit('not-responding')
  resetForm()
}

const resetForm = () => {
  isExpanded.value = false
  const initialResponses = {}
  props.questions.forEach(q => {
    initialResponses[q.key] = ''
  })
  responses.value = initialResponses
}
</script>

