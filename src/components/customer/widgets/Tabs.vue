<template>
  <HorizontalTabs
    :tabs="formattedTabs"
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    @tab-click="handleTabClick"
    class="custom-tabs"
  >
    <template v-for="(tab, index) in tabs" :key="tab.key" #[`tab-${index}`]>
      <div class="flex items-center justify-center gap-1.5">
        <!-- Icon (always visible) -->
        <i :class="getIconClass(tab.key)" class="text-base md:text-base"></i>
        
        <!-- Label (hidden on mobile, visible on desktop) -->
        <span class="hidden md:inline whitespace-nowrap">{{ tab.label }}</span>
        
        <!-- Count badge -->
        <Badge
          v-if="tab.count !== undefined"
          :text="String(tab.count)"
          size="small"
          theme="gray"
        />
      </div>
    </template>
  </HorizontalTabs>
</template>

<script setup>
import { computed } from 'vue'
import { HorizontalTabs } from '@motork/component-library'
import { Badge } from '@motork/component-library'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  tabs: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

// Transform tabs to library format
const formattedTabs = computed(() => 
  props.tabs.map(tab => ({ id: tab.key, label: tab.label }))
)

const handleTabClick = (tabId) => {
  emit('update:modelValue', tabId)
}

// Icon mapping for each tab type
const iconMap = {
  overview: 'fa-solid fa-house',
  note: 'fa-solid fa-note-sticky',
  communication: 'fa-solid fa-comments',
  attachment: 'fa-solid fa-paperclip'
}

const getIconClass = (tabKey) => {
  return iconMap[tabKey] || 'fa-solid fa-circle'
}
</script>

<style scoped>
@reference "tailwindcss";
/* Match current design exactly - override library defaults */
.custom-tabs :deep(.tab-item) {
  @apply flex-1 pb-2 border-b-2 cursor-pointer transition-colors px-4 py-2;
  @apply border-transparent hover:text-slate-700 hover:border-slate-200;
  @apply text-sm font-medium text-gray-600;
}

@media (min-width: 768px) {
  .custom-tabs :deep(.tab-item) {
    @apply flex-none;
  }
}

.custom-tabs :deep(.tab-item.active) {
  @apply border-slate-900 text-slate-900 font-semibold;
}

/* Ensure badge styling doesn't conflict */
.custom-tabs :deep(.tab-item) .badge {
  @apply ml-1.5;
}
</style>
