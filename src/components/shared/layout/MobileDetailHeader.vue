<template>
  <div v-if="show" class="lg:hidden border-b border shrink-0 bg-brand-gray">
    <div class="px-4 py-3 flex items-center justify-between gap-3">
      <!-- Back Button -->
      <button
        @click="handleBack"
        class="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors shrink-0"
        :aria-label="backLabel"
      >
        <ArrowLeft class="w-5 h-5 shrink-0" />
      </button>
      
      <!-- Optional Title Slot -->
      <div v-if="$slots.title" class="flex-1 flex items-center justify-center">
        <slot name="title" />
      </div>
      
      <!-- Optional Actions Slot -->
      <div v-if="$slots.actions" class="flex items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft } from 'lucide-vue-next'
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  backLabel: {
    type: String,
    default: 'Back'
  }
})

const emit = defineEmits(['back'])

const handleBack = () => {
  emit('back')
}
</script>

