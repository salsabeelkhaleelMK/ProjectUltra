<template>
  <ModalShell
    :show="show"
    :title="title"
    @cancel="handleClose"
  >
    <div class="py-8 flex items-center justify-center">
      <p class="text-gray-600 text-lg font-medium">Coming soon</p>
    </div>

    <!-- Override footer to show only Close button -->
    <template #footer>
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
        <button 
          @click="handleClose"
          class="bg-gray-800 hover:bg-gray-900 text-white font-medium px-6 py-2 rounded-lg text-sm transition-colors"
        >
          Close
        </button>
      </div>
    </template>
  </ModalShell>
</template>

<script setup>
import ModalShell from '@/components/shared/ModalShell.vue'

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
