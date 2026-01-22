<template>
  <Dialog :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
          <DialogDescription>
            Add a note to document important information
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Note Content -->
          <div>
            <label class="block label-upper mb-2">
              Note <span class="text-brand-red">*</span>
            </label>
            <textarea 
              v-model="noteText"
              class="input" 
              rows="6" 
              placeholder="Type your note here..."
              required
            ></textarea>
          </div>
        </form>

        <DialogFooter class="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
          <Button
            label="Cancel"
            variant="outline"
            size="small"
            class="rounded-sm w-full sm:w-auto"
            @click="$emit('close')"
          />
          <Button
            label="Save Note"
            variant="primary"
            size="small"
            class="rounded-sm w-full sm:w-auto !bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
            :disabled="!noteText.trim() || saving"
            @click="handleSubmit"
          >
            <span v-if="saving">Saving...</span>
            <span v-else>Save Note</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Button } from '@motork/component-library'
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

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const noteText = ref('')
const saving = ref(false)

const handleSubmit = async () => {
  if (!noteText.value.trim()) return
  
  saving.value = true
  
  try {
    emit('save', {
      type: 'note',
      message: noteText.value,
      content: noteText.value
    })
    emit('close')
  } finally {
    saving.value = false
  }
}

const handleOpenChange = (isOpen) => {
  if (!isOpen) {
    emit('close')
  }
}

// Reset form when modal closes
watch(() => props.show, (isOpen) => {
  if (!isOpen) {
    setTimeout(() => {
      noteText.value = ''
      saving.value = false
    }, 300)
  }
})
</script>
