<template>
  <div v-if="task" class="flex-1 flex flex-col overflow-hidden lg:border-l border bg-surface">
    <EntityDetailLayout
      :task="task"
      :type="task.type"
      :management-widget="managementWidget"
      :store-adapter="storeAdapter"
      :add-new-config="addNewConfig"
    />
  </div>
  
  <!-- Empty State (right side on desktop, hidden on mobile) -->
  <div v-else class="hidden lg:flex flex-1 flex-col overflow-hidden lg:border-l border-black/5 bg-surface">
    <div class="flex-1 flex items-center justify-center p-8">
      <div class="text-center max-w-sm">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surfaceSecondary flex items-center justify-center">
          <i class="fa-solid fa-tasks text-2xl text-sub"></i>
        </div>
        <h3 class="text-fluid-base font-semibold text-heading mb-2">No task selected</h3>
        <p class="text-fluid-sm text-sub">Select a task from the list to view its details and manage activities</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import EntityDetailLayout from '@/components/shared/layout/EntityDetailLayout.vue'

defineProps({
  task: {
    type: Object,
    default: null
  },
  managementWidget: {
    type: Object,
    required: true
  },
  storeAdapter: {
    type: Object,
    required: true
  },
  addNewConfig: {
    type: Object,
    required: true
  }
})
</script>

