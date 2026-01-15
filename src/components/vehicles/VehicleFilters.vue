<template>
  <div class="flex items-center gap-3 mb-4 overflow-x-auto pb-2 scrollbar-hide">
    <button
      v-for="tab in vehicleTabs"
      :key="tab.key"
      @click="$emit('filter-change', tab.key)"
      class="flex items-center justify-between gap-3 px-4 py-3 bg-white border border-border rounded-lg cursor-pointer hover:shadow-sm transition-all shrink-0 min-w-40 border-t-4"
      :class="vehicleFilter === tab.key ? tab.borderColor : 'border-t-border'"
    >
      <span class="text-sm font-medium text-foreground whitespace-nowrap">{{ tab.label }}</span>
      <Badge
        :text="String(tab.count)"
        size="small"
        :theme="vehicleFilter === tab.key ? 'blue' : 'gray'"
      />
    </button>
  </div>
</template>

<script setup>
import { Badge } from '@motork/component-library'

defineProps({
  vehicleTabs: {
    type: Array,
    required: true
  },
  vehicleFilter: {
    type: String,
    required: true
  }
})

defineEmits(['filter-change'])
</script>

