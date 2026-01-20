<template>
  <div class="bg-surface border border-E5E7EB rounded-xl p-5 shadow-sm mb-6 animate-fade-in relative">
    <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-surface border-t border-l border-E5E7EB rotate-45"></div>
    <div class="flex justify-between items-center mb-4">
      <h5 class="text-fluid-sm font-semibold text-heading">{{ item ? 'Edit Attachment' : 'Add Attachment' }}</h5>
      <button @click="$emit('cancel')" class="text-sub hover:text-body"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div>
      <label class="block text-fluid-xs font-medium text-slate-700 mb-1">File</label>
      <div class="flex items-center gap-3">
        <input 
          type="file" 
          @change="handleFileSelect"
          ref="fileInput"
          class="hidden"
        />
        <Button
          label="Choose File"
          variant="outline"
          size="small"
          @click="$refs.fileInput.click()"
        />
        <span v-if="selectedFileName" class="text-fluid-sm text-slate-600">{{ selectedFileName }}</span>
        <span v-else class="text-fluid-sm text-sub">No file selected</span>
      </div>
    </div>
    <div class="flex justify-end gap-2 mt-6 border-t border-E5E7EB pt-4">
      <Button
        label="Cancel"
        variant="outline"
        size="small"
        @click="$emit('cancel')"
      />
      <Button
        label="Save"
        variant="primary"
        size="small"
        :disabled="!selectedFile"
        @click="handleSave"
      />
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
  }
})

const emit = defineEmits(['save', 'cancel'])

const selectedFile = ref(null)
const selectedFileName = ref('')

onMounted(() => {
  if (props.item) {
    selectedFileName.value = props.item.fileName || ''
  }
})

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    selectedFileName.value = file.name
  }
}

const handleSave = () => {
  if (!selectedFile.value && !props.item) return
  
  emit('save', {
    id: props.item?.id || Date.now(),
    type: 'attachment',
    action: props.item ? 'updated an attachment' : 'added an attachment',
    fileName: selectedFileName.value,
    timestamp: props.item?.timestamp || new Date().toISOString(),
    isEdit: !!props.item
  })
}
</script>

