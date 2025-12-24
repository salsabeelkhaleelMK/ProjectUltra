<template>
  <div>
    <div>
      <label class="block text-xs font-medium text-slate-700 mb-1">Note</label>
      <textarea 
        v-model="noteText"
        rows="4" 
        class="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 placeholder-gray-400 transition-colors shadow-sm resize-none"
        placeholder="Enter your note..."
      ></textarea>
    </div>
    <div class="flex justify-end gap-2 mt-6 border-t border-gray-100 pt-4">
      <button @click="$emit('cancel')" class="text-xs font-medium text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
      <button @click="handleSave" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors shadow-sm shadow-blue-200">Save</button>
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
</script>

