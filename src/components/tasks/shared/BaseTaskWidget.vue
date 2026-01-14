<template>
  <div 
    class="rounded-lg p-4 relative transition-all duration-300 border"
    :class="[colorScheme.background, colorScheme.border]"
  >
    <div class="flex justify-between items-start mb-3">
      <div>
        <h4 class="font-bold text-gray-900 text-sm">{{ title }}</h4>
        <p class="text-xs text-gray-500 mt-0.5">{{ description }}</p>
      </div>
      <slot name="badge" />
    </div>
    
    <div class="flex gap-3 flex-wrap">
      <slot name="actions" />
    </div>
    
    <slot name="survey" />
    <slot name="content" />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  colorScheme: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.background && value.border
    }
  }
})
</script>

