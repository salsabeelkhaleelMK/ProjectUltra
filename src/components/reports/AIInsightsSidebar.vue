<template>
  <div
    class="rounded-[12px] p-px flex flex-col"
    style="background: linear-gradient(to right, #40B3E9, #8873FF, #FF8B42); height: 480px"
  >
    <div
      class="bg-greys-100 rounded-[11px] flex flex-col h-full overflow-hidden"
      style="background-color: var(--base-muted, #f5f5f5)"
    >
      <!-- Title Section -->
      <div class="px-4 py-4 flex items-center gap-2 shrink-0">
        <Sparkles :size="16" class="text-heading" />
        <h3 class="text-lg font-medium text-heading leading-5">AI Assistant</h3>
      </div>

      <!-- Card Content -->
      <div
        class="bg-white rounded-lg p-4 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden"
        style="box-shadow: var(--nsc-card-shadow);"
      >
        <div ref="chatContainer" class="flex-1 overflow-y-auto space-y-4 min-h-0 pr-2">
          <div
            v-for="message in chatMessages"
            :key="message.id"
            :class="[
              'flex gap-3',
              message.role === 'user' ? 'justify-end' : 'justify-start',
            ]"
          >
            <div
              v-if="message.role === 'assistant'"
              class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style="background: linear-gradient(to bottom right, #40B3E9, #8873FF, #FF8B42);"
            >
              <Sparkles :size="14" class="text-white" />
            </div>
            <div
              :class="[
                'rounded-lg px-4 py-2.5 max-w-[80%]',
                message.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-greys-50 text-greys-900 border border-black/5',
              ]"
            >
              <p class="text-fluid-sm leading-relaxed whitespace-pre-wrap text-heading">
                {{ message.content }}
              </p>
            </div>
            <div
              v-if="message.role === 'user'"
              class="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0"
            >
              <span class="text-fluid-xs font-medium text-purple-700">You</span>
            </div>
          </div>
        </div>

        <div class="border-t border-black/5 shrink-0 pt-4">
          <div
            v-if="chatMessages.length === 0"
            class="mb-3 flex flex-wrap gap-2"
          >
            <button
              v-for="suggestion in suggestedQuestions"
              :key="suggestion"
              @click="askQuestion(suggestion)"
              class="px-3 py-1.5 text-fluid-sm bg-greys-50 hover:bg-greys-100 border border-black/5 rounded-lg text-greys-700 transition-colors cursor-pointer"
            >
              {{ suggestion }}
            </button>
          </div>
          <div class="relative">
            <input
              v-model="questionInput"
              type="text"
              placeholder="Ask anything..."
              class="w-full pr-12 text-fluid-sm input"
              @keypress="handleKeyPress"
            />
            <button
              :disabled="!questionInput.trim()"
              @click="handleAsk"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-greys-100 active:bg-greys-200"
              :class="
                questionInput.trim()
                  ? 'text-purple-600'
                  : 'text-greys-400'
              "
            >
              <Send :size="18" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Send, Sparkles } from 'lucide-vue-next'

const suggestedQuestions = ref([
  "Who's performing best?",
  "How many deals were closed?",
  "What's the conversion rate?"
])

const questionInput = ref('')
const chatMessages = ref([])
const chatContainer = ref(null)

const askQuestion = (question) => {
  questionInput.value = question
  handleAsk()
}

const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    handleAsk()
  }
}

const handleAsk = () => {
  if (questionInput.value.trim()) {
    // Add user message
    chatMessages.value.push({
      id: Date.now(),
      role: 'user',
      content: questionInput.value
    })
    
    // Simulate AI response (placeholder)
    setTimeout(() => {
      chatMessages.value.push({
        id: Date.now() + 1,
        role: 'assistant',
        content: 'This is a placeholder response. AI functionality will be implemented later.'
      })
      // Scroll to bottom
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      }
    }, 500)
    
    questionInput.value = ''
  }
}
</script>
