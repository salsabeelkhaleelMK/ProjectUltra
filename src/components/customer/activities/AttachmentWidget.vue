<template>
  <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6 animate-fade-in relative">
    <div class="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45"></div>
    <div class="flex justify-between items-center mb-4">
      <h5 class="text-sm font-bold text-slate-800">{{ item ? 'Edit Attachment' : 'Add Attachment' }}</h5>
      <button @click="$emit('cancel')" class="text-gray-400 hover:text-gray-600"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div>
      <label class="block text-xs font-medium text-slate-700 mb-1">File</label>
      <div class="flex items-center gap-3">
        <input 
          type="file" 
          @change="handleFileSelect"
          ref="fileInput"
          class="hidden"
        />
        <button 
          @click="$refs.fileInput.click()"
          class="bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-md px-4 py-2 text-sm text-slate-700 transition-colors"
        >
          <i class="fa-solid fa-paperclip mr-2"></i>Choose File
        </button>
        <span v-if="selectedFileName" class="text-sm text-slate-600">{{ selectedFileName }}</span>
        <span v-else class="text-sm text-gray-400">No file selected</span>
      </div>
    </div>
    <div class="flex justify-end gap-2 mt-6 border-t border-gray-100 pt-4">
      <button @click="$emit('cancel')" class="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
      <button @click="handleSave" :disabled="!selectedFile" class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors shadow-sm shadow-blue-200">Save</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

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

