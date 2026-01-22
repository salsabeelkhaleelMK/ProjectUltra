<template>
  <!-- Modal Mode -->
  <Dialog v-if="modal" :open="show" @update:open="handleOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50" />
      <DialogContent class="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{{ item ? 'Edit Note' : 'Add Note' }}</DialogTitle>
          <DialogDescription v-if="!item">
            Add a note to document important information
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="handleSave" class="space-y-4">
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
            @click="handleCancel"
          />
          <Button
            :label="saving ? 'Saving...' : (item ? 'Update Note' : 'Save Note')"
            variant="primary"
            size="small"
            class="rounded-sm w-full sm:w-auto !bg-brand-red !hover:bg-brand-red-dark !text-white !border-brand-red"
            :disabled="!noteText.trim() || saving"
            @click="handleSave"
          />
        </DialogFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>

  <!-- Inline Mode -->
  <div 
    v-else
    class="animate-fade-in relative"
    :class="{ 'bg-surface border border-E5E7EB rounded-xl p-5 shadow-sm mb-6': !hideHeader }"
  >
    <div v-if="!hideHeader" class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-surface border-t border-l border-E5E7EB rotate-45"></div>
    <div v-if="!hideHeader" class="flex justify-between items-center mb-4">
      <h5 class="text-fluid-sm font-semibold text-heading">{{ item ? 'Edit Note' : 'Add Note' }}</h5>
      <button @click="handleCancel" class="text-sub hover:text-body"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div>
      <label class="block text-fluid-xs font-medium text-body mb-1">Note</label>
      <textarea 
        v-model="noteText"
        rows="4" 
        class="input"
        placeholder="Enter your note..."
      ></textarea>
    </div>
    <div v-if="!hideActions" class="flex justify-end gap-2 mt-6 border-t border-E5E7EB pt-4">
      <Button
        label="Cancel"
        variant="outline"
        size="small"
        @click="handleCancel"
      />
      <Button
        label="Save"
        variant="primary"
        size="small"
        @click="handleSave"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
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
  // Modal mode props
  modal: {
    type: Boolean,
    default: false
  },
  show: {
    type: Boolean,
    default: false
  },
  
  // Note data props
  item: {
    type: Object,
    default: null
  },
  taskType: {
    type: String,
    default: 'lead'
  },
  taskId: {
    type: Number,
    default: null
  },
  
  // Inline mode customization props
  hideActions: {
    type: Boolean,
    default: false
  },
  hideHeader: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'cancel', 'close'])

const noteText = ref('')
const saving = ref(false)

// Initialize note text from item if editing
onMounted(() => {
  if (props.item) {
    noteText.value = props.item.content || props.item.message || ''
  }
})

// Watch for item changes (for edit mode)
watch(() => props.item, (newItem) => {
  if (newItem) {
    noteText.value = newItem.content || newItem.message || ''
  }
}, { deep: true })

// Reset form when modal closes (modal mode only)
watch(() => props.show, (isOpen) => {
  if (props.modal && !isOpen) {
    setTimeout(() => {
      noteText.value = props.item ? (props.item.content || props.item.message || '') : ''
      saving.value = false
    }, 300)
  }
})

const handleSave = async () => {
  if (!noteText.value.trim()) return
  
  saving.value = true
  
  try {
    const noteData = {
      id: props.item?.id || Date.now(),
      type: 'note',
      action: props.item ? 'updated a note' : 'added a note',
      content: noteText.value,
      message: noteText.value, // Support both content and message for compatibility
      timestamp: props.item?.timestamp || new Date().toISOString(),
      isEdit: !!props.item
    }
    
    emit('save', noteData)
    
    // In modal mode, close after save
    if (props.modal) {
      emit('close')
    }
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
  if (props.modal) {
    emit('close')
  }
}

const handleOpenChange = (isOpen) => {
  if (!isOpen) {
    emit('close')
  }
}

defineExpose({
  submit: handleSave,
  canSubmit: () => !!noteText.value.trim()
})
</script>
