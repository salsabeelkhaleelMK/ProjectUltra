<template>
  <Card class="mb-6 shadow-mk-dashboard-card">
    <CardHeader class="border-b border-black/5 bg-surfaceSecondary/50 p-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <i v-if="icon" :class="[icon, 'text-sub text-fluid-xs']"></i>
          <CardTitle class="text-fluid-sm font-medium text-heading">{{ title }}</CardTitle>
          <Badge
            v-if="count !== undefined && count > 0"
            :text="String(count)"
            size="small"
            :class="countColorClass"
          />
        </div>
        <div class="flex items-center gap-2">
          <slot name="header-actions" />
          <Button
            v-if="showAddButton"
            @click.stop="$emit('add')"
            variant="ghost"
            size="small"
            class="flex items-center gap-1"
            :class="addButtonColorClass"
          >
            <i class="fa-solid fa-plus-circle text-xs"></i>
            {{ addButtonLabel || 'Add' }}
          </Button>
        </div>
      </div>
    </CardHeader>
    
    <CardContent v-if="hasEmptyState" class="p-6 text-center text-sub">
      <slot name="empty-state">
        <i class="fa-solid fa-inbox text-2xl mb-2 text-sub opacity-50"></i>
        <p class="text-fluid-base text-sub">{{ emptyStateMessage || 'No items found' }}</p>
      </slot>
    </CardContent>
    
    <CardContent v-else class="p-4">
      <slot name="content" />
    </CardContent>
  </Card>
</template>

<script setup>
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@motork/component-library/future/primitives'

defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  },
  count: {
    type: Number,
    default: undefined
  },
  countColorClass: {
    type: String,
    default: ''
  },
  showAddButton: {
    type: Boolean,
    default: false
  },
  addButtonLabel: {
    type: String,
    default: 'Add'
  },
  addButtonColorClass: {
    type: String,
    default: ''
  },
  emptyStateMessage: {
    type: String,
    default: ''
  },
  hasEmptyState: {
    type: Boolean,
    default: false
  }
})

defineEmits(['add'])
</script>
