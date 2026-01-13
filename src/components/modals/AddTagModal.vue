<template>
  <ModalShell 
    :show="show" 
    @close="$emit('close')" 
    @cancel="$emit('close')"
    title="Add Tag"
  >
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Tag Name
        </label>
        <input
          v-model="tagName"
          @keyup.enter="handleAdd"
          type="text"
          placeholder="Enter tag name"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autofocus
        />
      </div>
      
      <!-- Existing tags -->
      <div v-if="existingTags.length > 0">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Existing Tags
        </label>
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
    
    <template #actions>
      <button
        @click="handleAdd"
        :disabled="!tagName.trim()"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-sm"
      >
        Add Tag
      </button>
    </template>
  </ModalShell>
</template>

<script setup>
import { ref, watch } from 'vue'
import ModalShell from '@/components/shared/ModalShell.vue'

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

