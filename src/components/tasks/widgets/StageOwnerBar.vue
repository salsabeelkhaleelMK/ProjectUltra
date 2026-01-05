<template>
  <div class="metadata-bar w-full">
    <!-- Stage -->
    <div class="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5">
      <span class="label-upper text-[9px] md:text-xs">Stage</span>
      <span class="text-[10px] md:text-xs font-bold text-gray-800">{{ stage }}</span>
    </div>

    <!-- Divider -->
    <div class="metadata-divider"></div>

    <!-- Owner -->
    <div class="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5">
      <span class="label-upper text-[9px] md:text-xs">Owner</span>
      <button 
        @click="$emit('reassign')"
        class="text-[10px] md:text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
      >
        {{ owner }}
      </button>
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
/**
 * Compact summary bar for a task's commercial metadata:
 * stage, owner and (optionally) source.
 *
 * Used on both lead and opportunity tasks to keep visual
 * hierarchy and semantics identical across contexts.
 */
defineProps({
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

defineEmits(['reassign'])
</script>


