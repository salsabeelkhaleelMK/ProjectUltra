<template>
  <header class="page-header-main">
    <div class="page-header-content">
      <div class="min-w-0 flex-1">
        <h1 class="page-header-title">{{ title }}</h1>
      </div>
      <div v-if="$slots.actions" class="page-header-actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </header>
  <div v-if="$slots.bottom" class="section-header px-4 md:px-8">
    <slot name="bottom"></slot>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>
