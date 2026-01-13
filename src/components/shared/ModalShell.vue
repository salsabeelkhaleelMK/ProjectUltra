<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogContent 
        :class="[
          'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white rounded-sm shadow-2xl w-full max-w-[calc(100%-2rem)] overflow-hidden border border-gray-100 flex flex-col',
          sizeClass,
          { 'animate-fade-in': animate }
        ]"
        @escapeKeyDown="handleEscapeKeyDown"
        @pointerDownOutside="handlePointerDownOutside"
      >
        <!-- Header Slot Override or Default Header -->
        <slot name="header">
          <DialogHeader class="px-6 py-4 md:py-5 border-b border-gray-100 bg-white shrink-0">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <DialogTitle class="text-lg md:text-xl font-bold text-gray-900 leading-tight tracking-tight break-words">{{ title }}</DialogTitle>
                <DialogDescription v-if="subtitle" class="text-xs text-gray-500 mt-1.5 break-words">{{ subtitle }}</DialogDescription>
              </div>
              <button
                v-if="showCloseButton"
                @click="emit('close')"
                type="button"
                class="flex-shrink-0 w-11 h-11 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-sm transition-colors -mt-1"
                aria-label="Close"
              >
                <i class="fa-solid fa-xmark text-lg"></i>
              </button>
            </div>
          </DialogHeader>
        </slot>

        <!-- Body Slot -->
        <div class="overflow-y-auto max-h-[calc(80vh-140px)] flex-1">
          <slot></slot>
        </div>

        <!-- Footer Slot - Always visible with at least cancel button -->
        <slot name="footer">
          <DialogFooter 
            class="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3 border-t border-gray-100 shrink-0"
          >
            <Button
              v-if="!hideCancelButton"
              :label="cancelLabel"
              variant="outline"
              size="small"
              class="rounded-sm w-full sm:w-auto order-2 sm:order-1"
              @click="handleCancel"
            />
            <div class="flex gap-3 order-1 sm:order-2 w-full sm:w-auto">
              <slot name="actions"></slot>
            </div>
          </DialogFooter>
        </slot>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup>
import { computed, useSlots } from 'vue'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogOverlay, 
  DialogPortal, 
  DialogTitle
} from '@motork/component-library/future/primitives'
import { Button } from '@motork/component-library'

const $slots = useSlots()

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
  hideCancelButton: {
    type: Boolean,
    default: false
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
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl'
  }
  return sizes[props.size] || sizes.md
})

const handleOpenChange = (isOpen) => {
  if (!isOpen) {
    emit('close')
  }
}

const handleCancel = () => {
  emit('cancel')
  emit('close')
}

const handleEscapeKeyDown = () => {
  emit('close')
}

const handlePointerDownOutside = (event) => {
  emit('backdrop-click')
  if (!props.clickOutsideToClose) {
    event.preventDefault()
  } else {
    emit('cancel')
    emit('close')
  }
}
</script>
