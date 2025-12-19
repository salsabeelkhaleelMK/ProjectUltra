<template>
  <div class="metadata-bar w-full">
    <!-- Stage -->
    <div class="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5">
      <span class="label-upper text-[9px] md:text-xs">Stage</span>
      <span class="text-[10px] md:text-xs font-bold text-gray-800">{{ stage }}</span>
    </div>

    <!-- Divider -->
    <div class="metadata-divider"></div>

    <!-- Probability (optional) -->
    <div v-if="showProbability" class="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5">
      <span class="label-upper text-[9px] md:text-xs">Probability</span>
      <div class="flex items-center gap-1.5 md:gap-2">
        <div class="w-12 md:w-16 bg-gray-200 rounded-full h-1.5 md:h-2">
          <div
            class="h-1.5 md:h-2 rounded-full transition-all"
            :class="probabilityBarClass"
            :style="{ width: probability + '%' }"
          ></div>
        </div>
        <span class="text-[10px] md:text-xs font-bold text-gray-800">{{ probability }}%</span>
      </div>
    </div>

    <div v-if="showProbability" class="metadata-divider"></div>

    <!-- Owner -->
    <div class="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5">
      <span class="label-upper text-[9px] md:text-xs">Owner</span>
      <span class="text-[10px] md:text-xs font-bold text-gray-800">{{ owner }}</span>
    </div>

    <!-- Source (optional) -->
    <template v-if="source">
      <div class="metadata-divider"></div>
      <div class="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5">
        <span class="label-upper text-[9px] md:text-xs">Source</span>
        <span class="text-[10px] md:text-xs font-bold text-gray-800">{{ source }}</span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * Compact summary bar for a task's commercial metadata:
 * stage, probability, owner and (optionally) source.
 *
 * Used on both lead and opportunity tasks to keep visual
 * hierarchy and semantics identical across contexts.
 */
const props = defineProps({
  stage: {
    type: String,
    required: true
  },
  owner: {
    type: String,
    required: true
  },
  source: {
    type: String,
    default: ''
  },
  probability: {
    type: Number,
    default: null
  }
})

const showProbability = computed(() => props.probability !== null && props.probability !== undefined)

const probabilityBarClass = computed(() => {
  if (props.probability >= 70) return 'bg-green-500'
  if (props.probability >= 40) return 'bg-orange-500'
  return 'bg-red-500'
})
</script>


