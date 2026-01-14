<template>
  <div>
    <!-- Call Action Buttons Row (Only show if not in outcome selection or call active) -->
    <div v-if="!showOutcomeSelection && !isCallActive && !callEnded" class="flex gap-2 items-center mb-4">
      <!-- Primary: Call Button -->
      <button 
        @click="$emit('start-call')"
        :disabled="isCallActive"
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm shadow-blue-200"
      >
        <i class="fa-solid fa-phone"></i>
        {{ contactAttempts > 0 ? 'Call Again' : 'Initiate Call' }}
        <span v-if="contactAttempts > 0" class="bg-blue-500 px-2 py-0.5 rounded text-xs font-bold">
          {{ contactAttempts + 1 }}/{{ maxContactAttempts }}
        </span>
      </button>
      
      <!-- Secondary: Log Manual Call -->
      <button 
        @click="$emit('log-manual-call')"
        :disabled="isCallActive"
        class="bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed border border-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
      >
        <i class="fa-solid fa-clipboard-check text-xs"></i>
        Log Call Outcome
      </button>
    </div>

    <!-- Inline Call Interface (shows when call is active or ended) -->
    <div v-if="isCallActive || callEnded" class="mb-4 space-y-4 border-t border-gray-200 pt-4">
      
      <!-- Transcription Area (shows when call is active) -->
      <div v-if="isCallActive" class="bg-slate-900 text-white rounded-lg p-4">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-waveform-lines text-blue-400 animate-pulse"></i>
            <span class="text-xs font-bold uppercase tracking-wider">TRANSCRIBING</span>
          </div>
          <div class="flex items-center gap-2 text-red-400">
            <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <span class="text-xs font-mono">REC {{ formattedCallDuration }}</span>
          </div>
        </div>
        
        <!-- Mock Transcription -->
        <div class="space-y-3 text-sm font-mono">
          <div>
            <span class="text-blue-400 font-semibold">Lead:</span>
            <span class="ml-2">{{ mockTranscription.leadLines[0] }}</span>
          </div>
          <div>
            <span class="text-green-400 font-semibold">Sales:</span>
            <span class="ml-2">{{ mockTranscription.salesLines[0] }}</span>
          </div>
          <div v-if="callDuration >= 5">
            <span class="text-blue-400 font-semibold">Lead:</span>
            <span class="ml-2">{{ mockTranscription.leadLines[1] }}</span>
          </div>
          <div v-if="callDuration >= 8">
            <span class="text-green-400 font-semibold">Sales:</span>
            <span class="ml-2">{{ mockTranscription.salesLines[1] }}</span>
          </div>
          <div v-if="callDuration >= 12">
            <span class="text-blue-400 font-semibold">Lead:</span>
            <span class="ml-2">{{ mockTranscription.leadLines[2] }}</span>
          </div>
        </div>
        
        <!-- Quick Note -->
        <div class="mt-4 pt-4 border-t border-slate-700">
          <textarea 
            :model-value="callNotes"
            @update:model-value="$emit('update:call-notes', $event)"
            placeholder="Add a quick note about this call..."
            class="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
            rows="3"
          ></textarea>
        </div>
        
        <!-- End Call Button -->
        <div class="mt-4 flex justify-end">
          <button 
            @click="$emit('end-call')"
            class="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
          >
            <i class="fa-solid fa-phone-slash"></i>
            End Call
          </button>
        </div>
      </div>
      
      <!-- Call Ended Section -->
      <div v-if="callEnded && !isCallActive" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-bold text-gray-900 mb-1 text-sm">Call Ended</h4>
            <p class="text-xs text-gray-600">Extract information from the transcription or log the outcome</p>
          </div>
          <div class="flex gap-2">
            <button 
              @click="$emit('extract-information')"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors shadow-sm"
            >
              <i class="fa-solid fa-wand-magic-sparkles"></i>
              Extract information
            </button>
            <button 
              @click="$emit('log-manual-call')"
              class="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors"
            >
              <i class="fa-solid fa-clipboard-check text-xs"></i>
              Log outcome
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isCallActive: {
    type: Boolean,
    required: true
  },
  callEnded: {
    type: Boolean,
    required: true
  },
  callDuration: {
    type: Number,
    required: true
  },
  callNotes: {
    type: String,
    required: true
  },
  formattedCallDuration: {
    type: String,
    required: true
  },
  mockTranscription: {
    type: Object,
    required: true
  },
  showOutcomeSelection: {
    type: Boolean,
    required: true
  },
  contactAttempts: {
    type: Number,
    required: true
  },
  maxContactAttempts: {
    type: Number,
    required: true
  }
})

defineEmits(['start-call', 'end-call', 'log-manual-call', 'extract-information', 'update:call-notes'])
</script>

