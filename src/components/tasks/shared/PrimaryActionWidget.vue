<template>
  <div 
    class="rounded-card p-4 relative transition-all duration-300 border"
    :class="[colorScheme.background, colorScheme.border]"
  >
    <div class="flex justify-between items-start mb-3">
      <div>
        <h4 class="font-bold text-gray-900 text-fluid-sm">{{ action.title }}</h4>
        <p class="text-fluid-xs text-gray-500 mt-0.5">{{ action.description }}</p>
      </div>
    </div>
    <div class="flex gap-3 flex-wrap">
      <button
        @click="$emit('action-clicked')"
        :class="action.buttonClass"
        class="font-medium px-4 py-2 rounded-btn text-fluid-xs flex items-center gap-2 transition-colors shadow-sm shadow-gray-200"
      >
        <i :class="action.icon"></i>
        {{ action.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  action: { type: Object, required: true },
  colorScheme: { type: Object, required: true }
})
defineEmits(['action-clicked'])
</script>



