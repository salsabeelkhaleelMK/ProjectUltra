<template>
  <header class="page-header">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="page-header-title">{{ title }}</h1>
        <p class="page-header-subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="flex items-center gap-3">
        <slot name="actions"></slot>
      </div>
    </div>
    <div v-if="$slots.bottom" class="mt-4 pt-0">
      <slot name="bottom"></slot>
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  }
})
</script>

