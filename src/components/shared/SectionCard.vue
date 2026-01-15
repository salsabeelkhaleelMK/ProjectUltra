<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
    <div class="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <i v-if="icon" :class="[icon, 'text-gray-400 text-xs']"></i>
        <h3 class="heading-sub">{{ title }}</h3>
        <span 
          v-if="count !== undefined && count > 0" 
          class="text-xs font-bold px-2 py-0.5 rounded"
          :class="countColorClass || 'bg-gray-100 text-gray-700'"
        >
          {{ count }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <slot name="header-actions" />
        <button 
          v-if="showAddButton"
          @click.stop="$emit('add')"
          class="text-xs font-bold flex items-center gap-1 transition-colors"
          :class="addButtonColorClass || 'text-blue-600 hover:text-blue-700'"
        >
          <i class="fa-solid fa-plus-circle"></i>
          {{ addButtonLabel || 'Add' }}
        </button>
      </div>
    </div>
    
    <div v-if="hasEmptyState" class="p-6 text-center text-gray-400">
      <slot name="empty-state">
        <i class="fa-solid fa-inbox text-2xl mb-2"></i>
        <p class="text-content">{{ emptyStateMessage || 'No items found' }}</p>
      </slot>
    </div>
    
    <div v-else class="p-4">
      <slot name="content" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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

