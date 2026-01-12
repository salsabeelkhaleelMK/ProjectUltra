<template>
  <ModalShell
    :show="show"
    :title="title"
    @close="handleClose"
    @cancel="handleClose"
  >
    <div class="py-8 flex items-center justify-center">
      <p class="text-gray-600 text-lg font-medium">Coming soon</p>
    </div>
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
