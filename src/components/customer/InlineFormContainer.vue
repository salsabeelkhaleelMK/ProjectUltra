<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4 animate-fade-in">
    <div v-if="title" class="flex justify-between items-center mb-4">
      <h5 class="font-semibold text-slate-800 text-sm">{{ title }}</h5>
      <button 
        v-if="showClose"
        @click="$emit('close')" 
        class="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  showClose: {
    type: Boolean,
    default: true
  }
})

defineEmits(['close'])
</script>

