<template>
  <div 
    class="rounded-lg p-4 relative transition-all duration-300 border"
    :class="[colorScheme.background, colorScheme.border]"
  >
    <div class="flex justify-between items-start mb-3">
      <div>
        <h4 class="font-bold text-gray-900 text-sm">{{ action.title }}</h4>
        <p class="text-xs text-gray-500 mt-0.5">{{ action.description }}</p>
      </div>
    </div>
    <div class="flex gap-3 flex-wrap">
      <button
        @click="$emit('action-clicked')"
        :class="action.buttonClass"
        class="font-medium px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
      >
        <component :is="getLucideIcon(action.icon)" class="w-4 h-4 shrink-0" />
        {{ action.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { getLucideIcon } from '@/utils/lucideIcons'

defineProps({
  action: { type: Object, required: true },
  colorScheme: { type: Object, required: true }
})
defineEmits(['action-clicked'])
</script>



