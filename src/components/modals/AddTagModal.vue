<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-md max-h-[calc(100vh-4rem)] flex flex-col">
        <DialogHeader class="flex-shrink-0">
          <DialogTitle>Add Tag</DialogTitle>
        </DialogHeader>

        <div class="flex-1 overflow-y-auto px-6 py-4 w-full space-y-6">
      <div class="space-y-2">
        <Label class="block text-sm font-semibold text-foreground">Tag Name</Label>
        <Input
          v-model="tagName"
          @keyup.enter="handleAdd"
          type="text"
          placeholder="Enter tag name"
          class="w-full h-10"
          autofocus
        />
      </div>
      
      <!-- Existing tags -->
      <div v-if="existingTags.length > 0" class="space-y-2">
        <Label class="block text-sm font-semibold text-foreground">Existing Tags</Label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tag in existingTags"
            :key="tag"
            @click="tagName = tag"
            class="px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
          >
            {{ tag }}
          </button>
        </div>
      </div>
        </div>
    
        <DialogFooter class="flex-shrink-0 flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
          <Button
            label="Cancel"
            variant="outline"
            size="small"
            class="rounded-sm w-full sm:w-auto"
            @click="$emit('close')"
          />
          <Button
            label="Add Tag"
            variant="primary"
            size="small"
            class="rounded-sm w-full sm:w-auto !bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
            :disabled="!tagName.trim()"
            @click="handleAdd"
          />
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { 
  Button,
  Input,
  Label
} from '@motork/component-library/future/primitives'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle
} from '@motork/component-library/future/primitives'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  existingTags: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'add'])

const tagName = ref('')

const handleOpenChange = (isOpen) => {
  if (!isOpen) {
    emit('close')
  }
}

watch(() => props.show, (newValue) => {
  if (newValue) {
    tagName.value = ''
  }
})

const handleAdd = () => {
  const trimmedTag = tagName.value.trim()
  if (!trimmedTag) return
  
  // Check if tag already exists
  if (props.existingTags.includes(trimmedTag)) {
    return
  }
  
  emit('add', trimmedTag)
  tagName.value = ''
}
</script>

