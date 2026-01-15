<template>
  <div 
    class="animate-fade-in relative"
    :class="{ 'bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6': !hideHeader }"
  >
    <div v-if="!hideHeader" class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45"></div>
    <div v-if="!hideHeader" class="flex justify-between items-center mb-4">
      <h5 class="heading-sub">{{ item ? 'Edit Note' : 'Add Note' }}</h5>
      <button @click="$emit('cancel')" class="text-gray-400 hover:text-gray-600"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div>
      <label class="block text-xs font-medium text-gray-700 mb-1">Note</label>
      <textarea 
        v-model="noteText"
        rows="4" 
        class="input"
        placeholder="Enter your note..."
      ></textarea>
    </div>
    <div v-if="!hideActions" class="flex justify-end gap-2 mt-6 border-t border-gray-100 pt-4">
      <Button
        variant="outline"
        size="small"
        @click="$emit('cancel')"
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        size="small"
        @click="handleSave"
      >
        Save
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Button } from '@motork/component-library'

const props = defineProps({
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
    required: true
  },
  hideActions: {
    type: Boolean,
    default: false
  },
  hideHeader: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['save', 'cancel'])

const noteText = ref('')

onMounted(() => {
  if (props.item) {
    noteText.value = props.item.content || ''
  }
})

const handleSave = () => {
  if (!noteText.value.trim()) return
  
  emit('save', {
    id: props.item?.id || Date.now(),
    type: 'note',
    action: props.item ? 'updated a note' : 'added a note',
    content: noteText.value,
    timestamp: props.item?.timestamp || new Date().toISOString(),
    isEdit: !!props.item
  })
}

defineExpose({
  submit: handleSave,
  canSubmit: () => !!noteText.value.trim()
})
</script>

