<template>
  <button
    :class="[
      'mk-ai-mode-active flex items-center gap-2 rounded-lg',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      size === 'small' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
    ]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <Sparkles
      :size="size === 'small' ? 14 : 16"
      class="mk-sparkles-icon shrink-0"
      fill="url(#sparkles-gradient)"
      stroke="none"
    />
    <span>{{ label }}</span>
  </button>
</template>

<script setup>
import { Sparkles } from 'lucide-vue-next'

defineProps({
  label: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'medium',
    validator: (val) => ['small', 'medium'].includes(val)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>
