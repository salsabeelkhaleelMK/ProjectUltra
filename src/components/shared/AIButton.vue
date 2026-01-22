<template>
  <button
    :class="[
      'flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium text-fluid-sm transition-all',
      'hover:opacity-90 active:scale-95',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      size === 'small' ? 'px-3 py-1.5 text-fluid-xs' : ''
    ]"
    :disabled="disabled"
    style="background: linear-gradient(to right, #9333EA, #A855F7, #C084FC);"
    @click="$emit('click', $event)"
  >
    <Sparkles :size="16" class="text-white shrink-0" />
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
