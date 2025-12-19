<template>
  <div class="metadata-bar w-full">
    <!-- Stage -->
    <div class="flex items-center gap-1 sm:gap-2 px-1.5 py-1 sm:px-3 sm:py-1.5">
      <span class="label-upper text-xs">Stage</span>
      <span class="text-xs sm:text-sm font-bold text-gray-800">{{ stage }}</span>
    </div>

    <!-- Divider -->
    <div class="metadata-divider"></div>

    <!-- Owner -->
    <div class="flex items-center gap-1 sm:gap-2 px-1.5 py-1 sm:px-3 sm:py-1.5">
      <span class="label-upper text-xs">Owner</span>
      <span class="text-xs sm:text-sm font-bold text-gray-800">{{ owner }}</span>
    </div>

    <!-- Source (optional) -->
    <template v-if="source">
      <div class="metadata-divider"></div>
      <div class="flex items-center gap-1 sm:gap-2 px-1.5 py-1 sm:px-3 sm:py-1.5">
        <span class="label-upper text-xs">Source</span>
        <span class="text-xs sm:text-sm font-bold text-gray-800">{{ source }}</span>
      </div>
    </template>
  </div>
</template>

<script setup>
/**
 * Compact summary bar for a task's commercial metadata:
 * stage, owner and (optionally) source.
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
  }
})
</script>


