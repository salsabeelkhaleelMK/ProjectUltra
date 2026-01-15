<template>
  <div
    v-if="task"
    class="bg-white border border-gray-200 rounded-xl shadow-sm"
    :class="containerClass"
  >
    <!-- Header -->
    <div class="p-4 border-b border-gray-100 bg-gray-50/50">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-clipboard-check text-gray-400 text-xs"></i>
        <h3 class="font-bold text-gray-800 text-sm">Manage next steps</h3>
      </div>
    </div>

    <!-- Deadline Banner (optional - leads only) -->
    <slot name="deadline-banner" />

    <div class="p-5 space-y-6">
      <!-- Primary Action -->
      <slot name="primary-action" />

      <!-- Task Widgets -->
      <slot name="task-widgets" />

      <!-- Closed State -->
      <slot name="closed-state" />

      <!-- Secondary Actions -->
      <slot name="secondary-actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  task: {
    type: Object,
    required: true
  },
  containerClass: {
    type: String,
    default: ''
  }
})
</script>


