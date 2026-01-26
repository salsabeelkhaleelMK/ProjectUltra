<template>
  <div>
    <!-- Collapsed State - Minimal Space -->
    <button
      v-if="!isExpanded"
      @click="isExpanded = true"
      class="w-full flex items-center justify-between text-fluid-sm text-body hover:text-heading py-2 transition-colors"
    >
      <span class="font-medium">Lead Qualification Survey</span>
      <i class="fa-solid fa-chevron-down text-fluid-xs text-sub"></i>
    </button>
    
    <!-- Expanded State -->
    <div v-else class="space-y-4">
      <div class="flex items-center justify-between">
        <h5 class="text-fluid-sm font-semibold text-heading">Lead Qualification Survey</h5>
        <button
          @click="isExpanded = false"
          class="text-fluid-xs text-sub hover:text-body transition-colors"
        >
          <i class="fa-solid fa-chevron-up"></i>
        </button>
      </div>
      
      <div class="space-y-4">
        <!-- Survey Questions -->
        <div
          v-for="(question, index) in questions"
          :key="index"
          class="space-y-2"
        >
          <label class="block text-fluid-sm font-medium text-body">{{ question.label }}</label>
          
          <!-- Text input -->
          <textarea
            v-if="question.type === 'text'"
            v-model="responses[question.key]"
            :placeholder="question.placeholder"
            rows="3"
            class="input resize-none text-fluid-sm py-2 px-3 w-full"
          ></textarea>
          
          <!-- Select dropdown -->
          <select
            v-else-if="question.type === 'select'"
            v-model="responses[question.key]"
            class="input text-fluid-sm py-2 px-3 w-full"
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
            class="space-y-2"
          >
            <label
              v-for="option in question.options"
              :key="option"
              class="flex items-center text-fluid-sm text-body cursor-pointer"
            >
              <input
                type="radio"
                v-model="responses[question.key]"
                :value="option"
                class="mr-2 w-4 h-4 text-brand-red focus:ring-brand-red border-gray-300"
              />
              {{ option }}
            </label>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-2 flex-wrap justify-end pt-2">
          <Button
            label="Complete Survey"
            variant="primary"
            size="small"
            @click="handleComplete"
            class="!bg-green-600 !hover:bg-green-700 !text-white !border-green-600"
          />
          <Button
            label="Customer Refused"
            variant="outline"
            size="small"
            @click="handleRefuse"
          />
          <Button
            label="Not Responding"
            variant="outline"
            size="small"
            @click="handleNotResponding"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Button } from '@motork/component-library/future/primitives'

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

