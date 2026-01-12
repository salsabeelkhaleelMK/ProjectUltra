<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
    <!-- Dark Header -->
    <div class="bg-gray-900 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-white font-bold text-sm">Insights</span>
        <span class="text-gray-300 text-sm">powered by AI</span>
      </div>
    </div>
    
    <!-- White Content Area -->
    <div class="bg-white flex-1 overflow-y-auto">
      <div class="p-4 space-y-2">
        <!-- Suggested Questions -->
        <button
          v-for="(question, index) in suggestedQuestions"
          :key="index"
          @click="askQuestion(question)"
          class="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors text-sm text-gray-700"
        >
          {{ question }}
        </button>
      </div>
      
      <!-- Show More Ideas -->
      <div class="px-4 pb-4">
        <button
          @click="showMoreIdeas = !showMoreIdeas"
          class="w-full text-left text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
        >
          <span>Show more ideas</span>
          <i class="fa-solid fa-chevron-down text-xs transition-transform duration-300" :class="{ 'rotate-180': showMoreIdeas }"></i>
        </button>
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-4 bg-white border-t border-gray-200">
      <div class="flex gap-2 items-center">
        <!-- Icon/Avatar -->
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
          <i class="fa-solid fa-sparkles text-white text-xs"></i>
        </div>
        
        <!-- Input Field -->
        <div class="flex-1 relative">
          <input
            v-model="questionInput"
            @keyup.enter="handleAsk"
            type="text"
            placeholder="Ask me anything"
            class="input"
          >
        </div>
        
        <!-- Submit Button -->
        <button
          @click="handleAsk"
          class="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center transition-all shrink-0"
        >
          <i class="fa-solid fa-arrow-right text-sm"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const suggestedQuestions = ref([
  'Who are my top 3 best performing sales people?',
  "What's our current pipeline conversion rate?",
  'How many leads did we get today?',
  'How many leads are in negotiation?'
])

const questionInput = ref('')
const showMoreIdeas = ref(false)

const askQuestion = (question) => {
  questionInput.value = question
  handleAsk()
}

const handleAsk = () => {
  if (questionInput.value.trim()) {
    // Placeholder for AI logic
    questionInput.value = ''
  }
}
</script>
