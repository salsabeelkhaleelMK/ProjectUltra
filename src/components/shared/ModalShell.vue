<template>
  <Teleport to="body">
    <div 
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="handleBackdropClick"
    >
      <div 
        :class="[
          'bg-white rounded-xl shadow-2xl w-full mx-4 overflow-hidden',
          sizeClass,
          { 'animate-fade-in': animate }
        ]"
      >
        <!-- Header Slot Override or Default Header -->
        <slot name="header">
          <div class="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h3 class="font-bold text-lg text-gray-900">{{ title }}</h3>
              <p v-if="subtitle" class="text-xs text-gray-500 mt-1">{{ subtitle }}</p>
            </div>
            <button 
              v-if="showCloseButton"
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
        </slot>

        <!-- Body Slot -->
        <div class="p-5">
          <slot></slot>
        </div>

        <!-- Footer Slot Override or Default Footer -->
        <slot name="footer">
          <div class="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
            <button 
              @click="$emit('cancel')"
              class="btn-secondary text-sm"
            >
              {{ cancelLabel }}
            </button>
            <slot name="actions"></slot>
          </div>
        </slot>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { Teleport } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md'
  },
  showCloseButton: {
    type: Boolean,
    default: true
  },
  cancelLabel: {
    type: String,
    default: 'Cancel'
  },
  clickOutsideToClose: {
    type: Boolean,
    default: true
  },
  animate: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'cancel', 'backdrop-click'])

const sizeClass = computed(() => {
  const sizes = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl'
  }
  return sizes[props.size] || sizes.md
})

const handleBackdropClick = () => {
  emit('backdrop-click')
  if (props.clickOutsideToClose) {
    emit('cancel')
  }
}
</script>

