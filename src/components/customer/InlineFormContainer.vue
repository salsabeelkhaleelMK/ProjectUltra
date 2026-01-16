<template>
  <div class="bg-surface border border rounded-lg p-4 animate-fade-in">
    <div v-if="title" class="flex justify-between items-center mb-4">
      <h5 class="font-semibold text-heading text-sm">{{ title }}</h5>
      <Button
        v-if="showClose"
        label="Close"
        variant="outline"
        size="small"
        @click="$emit('close')"
      />
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
import { Button } from '@motork/component-library'

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

