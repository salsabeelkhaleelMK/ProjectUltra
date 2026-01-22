<template>
  <div
    v-if="task"
    class="rounded-lg flex flex-col"
    :class="containerClass"
    style="background-color: var(--base-muted, #f5f5f5)"
  >
    <!-- Title Section -->
    <div v-if="!hideTitle" class="px-4 py-4 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-clipboard-check text-heading"></i>
        <h2 class="text-fluid-sm font-medium text-heading leading-5">Manage next steps</h2>
      </div>
    </div>

    <!-- Card Content -->
    <div
      class="bg-white rounded-lg p-4 flex flex-col"
      :class="hideBorder ? 'shadow-none' : 'shadow-sm'"
      :style="hideBorder ? undefined : { boxShadow: 'var(--nsc-card-shadow)' }"
    >
      <!-- Deadline Banner (optional - leads only) -->
      <slot name="deadline-banner" />

      <div class="space-y-6">
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
  },
  hideTitle: {
    type: Boolean,
    default: false
  },
  hideBorder: {
    type: Boolean,
    default: false
  }
})
</script>



