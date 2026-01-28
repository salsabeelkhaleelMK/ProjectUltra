<template>
  <Button
    variant="secondary"
    :size="size === 'small' ? 'sm' : 'default'"
    :disabled="disabled"
    class="inline-flex items-center gap-2"
    @click="$emit('click', $event)"
  >
    <Sparkles :size="size === 'small' ? 14 : 16" class="shrink-0" aria-hidden="true" />
    {{ label }}
  </Button>
</template>

<script setup>
import { Button } from '@motork/component-library/future/primitives'
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
