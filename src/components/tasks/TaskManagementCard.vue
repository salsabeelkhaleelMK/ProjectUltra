<template>
  <div>
    <component
      :is="managementWidget"
      v-if="managementWidget"
      :lead="type === 'lead' ? task : undefined"
      :opportunity="type === 'opportunity' ? task : undefined"
      :activities="activities"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  type: {
    type: String,
    required: true,
    validator: (value) => ['lead', 'opportunity'].includes(value)
  },
  managementWidget: {
    type: Object,
    required: true
  },
  activities: {
    type: Array,
    default: () => []
  }
})

// Pass through all emits from the management widget
defineOptions({
  inheritAttrs: false
})
</script>

<style scoped>
/* No additional styles needed - wrapper component only */
</style>
