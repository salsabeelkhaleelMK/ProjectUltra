<template>
  <div class="space-y-4">
    <!-- File Input -->
    <div>
      <label class="block label-upper text-sub text-[10px] font-bold uppercase tracking-wider mb-1.5">
        Select File <span class="text-red-500">*</span>
      </label>
      <div class="relative">
        <input
          ref="fileInputRef"
          type="file"
          accept=".csv,.xls,.xlsx"
          @change="handleFileChange"
          class="hidden"
          :disabled="loading"
        />
        <div
          @click="fileInputRef?.click()"
          class="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer transition-all hover:border-primary hover:bg-surfaceSecondary"
          :class="{ 'opacity-50 cursor-not-allowed': loading }"
        >
          <i class="fa-solid fa-cloud-arrow-up text-3xl text-gray-400 mb-3"></i>
          <p class="text-heading text-fluid-xs font-bold mb-1">
            {{ selectedFile ? selectedFile.name : 'Click to upload or drag and drop' }}
          </p>
          <p class="text-meta text-[10px]">CSV or Excel (.csv, .xls, .xlsx) up to 10MB</p>
        </div>
      </div>
      <p v-if="error" class="text-red-500 text-[10px] mt-1.5">{{ error }}</p>
    </div>

    <!-- File Preview -->
    <div v-if="selectedFile && parsedData && parsedData.length > 0" class="bg-surface border border-border rounded-xl p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-bold text-heading text-fluid-xs">File Preview</h3>
        <Badge :text="`${parsedData.length} rows`" theme="gray" size="small" />
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-[11px]">
          <thead>
            <tr class="border-b border-border">
              <th
                v-for="header in headers"
                :key="header"
                class="text-left p-2 font-bold text-sub uppercase tracking-wider"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in previewRows"
              :key="index"
              class="border-b border-border hover:bg-surfaceSecondary transition-colors"
            >
              <td
                v-for="header in headers"
                :key="header"
                class="p-2 text-body"
              >
                {{ row[header] || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <p v-if="parsedData.length > previewLimit" class="text-meta text-[10px] mt-3 text-center">
        Showing first {{ previewLimit }} of {{ parsedData.length }} rows
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Badge } from '@motork/component-library'
import { useFileUpload } from '@/composables/useFileUpload'

const props = defineProps({
  modelValue: {
    type: File,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'file-parsed'])

const fileInputRef = ref(null)
const previewLimit = 5

const {
  selectedFile,
  parsedData,
  headers,
  loading,
  error,
  handleFileSelect,
  clearFile,
  getPreview
} = useFileUpload()

const previewRows = computed(() => {
  return getPreview(previewLimit)
})

const handleFileChange = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    const result = await handleFileSelect(file)
    emit('update:modelValue', file)
    emit('file-parsed', result)
  } catch (err) {
    // Error is handled by useFileUpload composable
    emit('update:modelValue', null)
  }
}

defineExpose({
  clearFile,
  selectedFile,
  parsedData,
  headers
})
</script>
