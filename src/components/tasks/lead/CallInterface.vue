<template>
  <div>
    <!-- Call Action Buttons Row (hidden when hideButton is true or call is already active) -->
    <div v-if="!hideButton && !isCallActive" class="flex gap-2 items-center mb-4">
      <Button
        variant="default"
        :disabled="isCallActive"
        class="inline-flex items-center gap-2"
        @click="$emit('start-call')"
      >
        <Phone :size="16" class="shrink-0" aria-hidden="true" />
        {{ contactAttempts > 0 ? 'Call Again' : 'Initiate Call' }}
      </Button>
    </div>

    <!-- Inline Call Interface (shows when call is active or ended) -->
    <div v-if="isCallActive || callEnded" class="mb-4 space-y-4">
      
      <!-- Transcription Area (shows when call is active or ended) -->
      <div v-if="isCallActive || callEnded" class="bg-slate-900 text-white rounded-lg overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3">
          <div class="flex items-center gap-2">
            <Mic class="w-4 h-4 shrink-0 text-blue-400 animate-pulse" aria-hidden="true" />
            <span class="text-xs font-bold uppercase tracking-wider">
              {{ isCallActive ? 'TRANSCRIBING' : 'CALL SUMMARY' }}
            </span>
          </div>
          <div class="flex items-center gap-3">
            <template v-if="isCallActive">
              <div class="flex items-center gap-2 text-red-400">
                <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse" aria-hidden="true"></span>
                <span class="text-xs font-mono">REC {{ formattedCallDuration }}</span>
              </div>
              <Button
                variant="destructive"
                size="sm"
                class="inline-flex items-center gap-2 shrink-0"
                @click="$emit('end-call')"
              >
                <Square :size="14" class="shrink-0" aria-hidden="true" />
                Stop Call
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                class="shrink-0 border-slate-600 bg-slate-800/80 hover:bg-slate-700 hover:text-white text-white"
                :aria-label="isExpanded ? 'Collapse transcription' : 'Expand transcription'"
                @click="isExpanded = !isExpanded"
              >
                <ChevronDown v-if="!isExpanded" :size="14" stroke-width="2" aria-hidden="true" />
                <ChevronUp v-else :size="14" stroke-width="2" aria-hidden="true" />
              </Button>
            </template>
            <template v-else>
              <span class="text-xs font-mono text-red-200">
                Call duration {{ formattedCallDuration }}
              </span>
              <Button
                variant="outline"
                size="sm"
                class="shrink-0 border-slate-600 bg-slate-800/80 hover:bg-slate-700 text-white"
                @click="isExpanded = !isExpanded"
              >
                See transcription
              </Button>
            </template>
          </div>
        </div>

        <div v-if="isExpanded" class="p-4 space-y-4 border-t border-slate-700">
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
      <div v-if="callEnded && !isCallActive" class="rounded-lg p-px bg-ai-gradient">
        <div class="rounded-lg bg-background p-4 flex items-center justify-between">
          <div>
            <h4 class="card-heading-sm mb-1">Call Ended</h4>
            <p class="card-caption">Extract information from the transcription</p>
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
import { Mic, Square, Phone, ChevronDown, ChevronUp } from 'lucide-vue-next'
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

