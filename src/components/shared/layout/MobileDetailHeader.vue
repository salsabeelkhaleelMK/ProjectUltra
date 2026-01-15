<template>
  <div v-if="show" class="lg:hidden border-b border-gray-200 shrink-0 bg-brand-gray">
    <div class="px-4 py-3 flex items-center justify-between gap-3">
      <!-- Back Button -->
      <button
        @click="handleBack"
        class="w-11 h-11 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
        :aria-label="backLabel"
      >
        <i class="fa-solid fa-arrow-left text-lg"></i>
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

