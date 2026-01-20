<template>
  <div class="relative flex-1 flex flex-col min-w-0 overflow-hidden">
    <!-- View Mode Toggle Button -->
    <div 
      v-if="task"
      class="absolute top-3 right-[18px] z-50 flex items-center gap-1 bg-white border border-E5E7EB rounded-btn shadow-sm p-0.5"
    >
      <button
        @click="toggleViewMode('compact')"
        :class="[
          'px-2 py-1 text-[10px] font-medium rounded transition-colors',
          currentViewMode === 'compact'
            ? 'bg-brand-dark text-white hover:bg-brand-darkDarker'
            : 'text-sub hover:text-body hover:bg-surfaceSecondary'
        ]"
        title="Compact View"
      >
        <i class="fa-solid fa-list text-[10px] mr-1"></i>
        Compact
      </button>
      <button
        @click="toggleViewMode('tabbed')"
        :class="[
          'px-2 py-1 text-[10px] font-medium rounded transition-colors',
          currentViewMode === 'tabbed'
            ? 'bg-brand-dark text-white hover:bg-brand-darkDarker'
            : 'text-sub hover:text-body hover:bg-surfaceSecondary'
        ]"
        title="Tabbed View"
      >
        <i class="fa-solid fa-table-columns text-[10px] mr-1"></i>
        Tabbed
      </button>
    </div>

    <!-- Render Current View -->
    <component
      :is="currentViewComponent"
      :task="task"
      :management-widget="managementWidget"
      :store-adapter="storeAdapter"
      :add-new-config="addNewConfig"
      :filtered-tasks="filteredTasks"
      v-bind="$attrs"
      @task-navigate="$emit('task-navigate', $event)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import TaskDetailViewCompact from './TaskDetailViewCompact.vue'
import TaskDetailViewTabbed from './TaskDetailViewTabbed.vue'

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
  },
  filteredTasks: {
    type: Array,
    default: () => []
  }
})

defineEmits(['task-navigate'])

const settingsStore = useSettingsStore()

const currentViewMode = computed(() => {
  return settingsStore.getSetting('taskDetailsViewMode') || 'compact'
})

const currentViewComponent = computed(() => {
  return currentViewMode.value === 'tabbed' ? TaskDetailViewTabbed : TaskDetailViewCompact
})

const toggleViewMode = (mode) => {
  settingsStore.setSetting('taskDetailsViewMode', mode)
}
</script>

<style scoped>
/* Ensure toggle button is above all content */
.z-50 {
  z-index: 50;
}
</style>
