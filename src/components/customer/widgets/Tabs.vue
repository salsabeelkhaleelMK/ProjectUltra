<template>
  <Tabs :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <TabsList class="w-full justify-start border-b border-border bg-transparent">
      <TabsTrigger
        v-for="tab in tabs"
        :key="tab.key"
        :value="tab.key"
        class="flex items-center gap-1.5 data-[state=active]:border-b-2 data-[state=active]:border-brand-dark data-[state=active]:text-brand-darkDarker rounded-none pb-2 focus-visible:outline-none focus-visible:ring-0"
      >
        <!-- Icon (always visible) -->
        <i 
          :class="[getIconClass(tab.key), 'text-sm']"
        ></i>
        
        <!-- Label (hidden on mobile, visible on desktop) -->
        <span class="hidden md:inline whitespace-nowrap">{{ tab.label }}</span>
      </TabsTrigger>
    </TabsList>
  </Tabs>
</template>

<script setup>
import { Tabs, TabsList, TabsTrigger } from '@motork/component-library/future/primitives'

defineProps({
  modelValue: {
    type: String,
    required: true
  },
  tabs: {
    type: Array,
    required: true
  }
})

defineEmits(['update:modelValue'])

// Icon mapping for each tab type
const iconMap = {
  overview: 'fa-solid fa-house',
  note: 'fa-solid fa-note-sticky',
  communication: 'fa-solid fa-comments',
  attachment: 'fa-solid fa-paperclip',
  request: 'fa-solid fa-globe',
  manage: 'fa-solid fa-gear',
  data: 'fa-solid fa-pen',
  notes: 'fa-solid fa-note-sticky',
  enrich: 'fa-solid fa-pen'
}

const getIconClass = (tabKey) => {
  return iconMap[tabKey] || 'fa-solid fa-circle'
}
</script>
