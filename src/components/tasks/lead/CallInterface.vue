<template>
  <div>
    <!-- Call Action Buttons Row (hidden when hideButton is true or call is already active) -->
    <div v-if="!hideButton && !isCallActive" class="flex gap-2 items-center mb-4">
      <!-- Primary: Call Button -->
      <button
        @click="$emit('start-call')"
        :disabled="isCallActive"
        :class="[
          'border font-medium px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors',
          isCallActive 
            ? 'bg-surface border-E5E7EB text-body opacity-60 cursor-not-allowed' 
            : 'bg-primary hover:bg-primary/90 border-primary text-white'
        ]"
      >
        <i class="fa-solid fa-phone text-xs cursor-pointer"></i>
        {{ contactAttempts > 0 ? 'Call Again' : 'Initiate Call' }}
      </button>
    </div>

    <!-- Inline Call Interface (shows when call is active or ended) -->
    <div v-if="isCallActive || callEnded" class="mb-4 space-y-4">
      
      <!-- Transcription Area (shows when call is active or ended) -->
      <div v-if="isCallActive || callEnded" class="bg-slate-900 text-white rounded-card">
        <div class="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-waveform-lines text-blue-400 animate-pulse"></i>
            <span class="text-xs font-bold uppercase tracking-wider">
              {{ isCallActive ? 'TRANSCRIBING' : 'CALL SUMMARY' }}
            </span>
          </div>
          <div class="flex items-center gap-3">
            <template v-if="isCallActive">
              <div class="flex items-center gap-2 text-red-400">
                <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span class="text-xs font-mono">REC {{ formattedCallDuration }}</span>
              </div>
              <!-- Stop Call Button in Header -->
              <button
                @click="$emit('end-call')"
                class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
              >
                <i class="fa-solid fa-stop text-xs cursor-pointer"></i>
                Stop Call
              </button>
              <button
                type="button"
                class="flex items-center justify-center px-3 h-8 rounded-btn border border-slate-600 bg-slate-800/80 hover:bg-slate-700 cursor-pointer"
                @click="isExpanded = !isExpanded"
              >
                <i
                  :class="[
                    'fa-solid text-xs cursor-pointer',
                    isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'
                  ]"
                ></i>
              </button>
            </template>
            <template v-else>
              <span class="text-xs font-mono text-red-200">
                Call duration {{ formattedCallDuration }}
              </span>
              <button
                type="button"
                class="px-3 h-8 rounded-btn border border-slate-600 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
                @click="isExpanded = !isExpanded"
              >
                See transcription
              </button>
            </template>
          </div>
        </div>

        <div v-if="isExpanded" class="p-4 space-y-4">
          <!-- Summary when call has ended -->
          <div v-if="callEnded && !isCallActive" class="space-y-1">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-300">Summary</h4>
            <p class="text-sm text-slate-100">
              Lead confirmed their details and the call covered the main inquiry discussed in the transcript below.
            </p>
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

          <!-- Quick Note (only while call is active) -->
          <div v-if="isCallActive" class="pt-4 border-t border-slate-700">
            <textarea 
              :model-value="callNotes"
              @update:model-value="$emit('update:call-notes', $event)"
              placeholder="Add a quick note about this call..."
              class="w-full p-3 bg-slate-800 border border-slate-700 rounded-btn text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              rows="3"
            ></textarea>
          </div>
        </div>
      </div>
      
      <!-- Call Ended Section -->
      <div v-if="callEnded && !isCallActive" class="bg-blue-50 rounded-card p-4">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-bold text-heading mb-1 text-sm">Call Ended</h4>
            <p class="text-xs text-gray-600">Extract information from the transcription</p>
          </div>
          <div class="flex gap-2">
            <AIButton
              label="Extract information"
              size="small"
              @click="$emit('extract-information')"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Button } from '@motork/component-library/future/primitives'
import AIButton from '@/components/shared/AIButton.vue'

const props = defineProps({
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
  contactAttempts: {
    type: Number,
    required: true
  },
  maxContactAttempts: {
    type: Number,
    required: true
  },
  hideButton: {
    type: Boolean,
    default: false
  }
})

const isExpanded = ref(false)

watch(
  () => props.isCallActive,
  (isActive, wasActive) => {
    if (isActive && !wasActive) {
      isExpanded.value = false
      return
    }

    if (!isActive) {
      isExpanded.value = false
    }
  }
)

defineEmits(['start-call', 'end-call', 'log-manual-call', 'extract-information', 'update:call-notes', 'copy-number'])
</script>

