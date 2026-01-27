<template>
  <button
    :class="[
      'flex items-center gap-2 rounded-lg text-white font-medium transition-all',
      'hover:opacity-90 active:scale-95',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      size === 'small' ? 'px-3 py-1.5 text-fluid-xs' : 'px-4 py-2 text-fluid-sm'
    ]"
    :disabled="disabled"
    style="background: linear-gradient(135deg, #6B21A8, #9333EA, #A855F7);"
    @click="$emit('click', $event)"
  >
    <Sparkles :size="size === 'small' ? 14 : 16" class="text-white shrink-0" />
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
    default: 'medium', // 'small' | 'medium'
    validator: (val) => ['small', 'medium'].includes(val)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>
