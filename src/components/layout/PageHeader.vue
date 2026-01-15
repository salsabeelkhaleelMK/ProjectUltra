<template>
  <header class="page-header">
    <div class="page-header-main">
      <div class="page-header-content">
        <div>
          <h2 class="page-header-title">{{ title }}</h2>
        </div>
        <div class="page-header-actions">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
    <div v-if="$slots.bottom" class="page-header-bottom">
      <slot name="bottom"></slot>
    </div>
  </header>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

