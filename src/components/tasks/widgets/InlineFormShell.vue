<template>
  <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6 animate-fade-in relative">
    <!-- Top arrow decoration -->
    <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45"></div>
    
    <!-- Header with title and close button -->
    <div class="flex justify-between items-center mb-4">
      <h5 class="text-sm font-bold text-slate-800">{{ title }}</h5>
      <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    
    <!-- Widget content slot -->
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})

defineEmits(['close'])
</script>

