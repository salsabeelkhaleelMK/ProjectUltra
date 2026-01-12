<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogContent 
        :class="[
          'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] bg-white rounded-xl shadow-2xl w-full mx-4 overflow-hidden',
          sizeClass,
          { 'animate-fade-in': animate }
        ]"
        @escapeKeyDown="handleEscapeKeyDown"
        @pointerDownOutside="handlePointerDownOutside"
      >
        <!-- Header Slot Override or Default Header -->
        <slot name="header">
          <DialogHeader class="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div>
              <DialogTitle class="font-bold text-lg text-gray-900">{{ title }}</DialogTitle>
              <DialogDescription v-if="subtitle" class="text-xs text-gray-500 mt-1">{{ subtitle }}</DialogDescription>
            </div>
            <DialogClose 
              v-if="showCloseButton"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i class="fa-solid fa-times"></i>
            </DialogClose>
          </DialogHeader>
        </slot>

        <!-- Body Slot -->
        <div class="p-5">
          <slot></slot>
        </div>

        <!-- Footer Slot Override or Default Footer -->
        <slot name="footer">
          <DialogFooter class="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
            <Button
              :label="cancelLabel"
              variant="outline"
              size="small"
              @click="handleCancel"
            />
            <slot name="actions"></slot>
          </DialogFooter>
        </slot>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogOverlay, 
  DialogPortal, 
  DialogTitle, 
  DialogClose 
} from '@motork/component-library/future/primitives'
import { Button } from '@motork/component-library'

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



