<template>
  <Teleport to="body">
    <div 
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="handleClose"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
          <button 
            @click="handleClose"
            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i class="fa-solid fa-times text-sm"></i>
          </button>
        </div>
        
        <!-- Content -->
        <div class="px-6 py-12 flex items-center justify-center">
          <p class="text-gray-600 text-lg font-medium">Coming soon</p>
        </div>
        
        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button 
            @click="handleClose"
            class="bg-gray-800 hover:bg-gray-900 text-white font-medium px-6 py-2 rounded-lg text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { Teleport } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Coming Soon'
  }
})

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}
</script>

