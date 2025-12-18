<template>
  <div class="bg-slate-900 rounded-xl border border-slate-700 shadow-sm p-4 md:p-6 mt-6">
    <h2 class="label-upper !text-slate-400 mb-4">Insights powered by AI</h2>
    
    <div class="space-y-3 mb-6">
      <button
        v-for="(question, index) in suggestedQuestions"
        :key="index"
        @click="askQuestion(question)"
        class="w-full text-left px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-200 transition-colors"
      >
        {{ question }}
      </button>
    </div>
    
    <button
      @click="showMoreIdeas = !showMoreIdeas"
      class="label-upper !text-slate-500 hover:!text-slate-400 mb-4 transition-colors lowercase italic"
    >
      Show more ideas...
    </button>
    
    <div class="flex gap-2">
      <input
        v-model="questionInput"
        @keyup.enter="handleAsk"
        type="text"
        placeholder="Ask me anything"
        class="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
      >
      <button
        @click="handleAsk"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <i class="fa-solid fa-arrow-right"></i>
      </button>
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
    // Placeholder: wire this to a real AI endpoint or backend later.
    // For now we just clear the input to simulate a handled question.
    questionInput.value = ''
  }
}
</script>

