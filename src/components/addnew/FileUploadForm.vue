<template>
  <div class="space-y-4">
    <!-- File Input -->
    <div>
      <label class="block label-upper text-sub text-fluid-xs font-bold uppercase tracking-wider mb-1.5">
        Select File <span class="text-brand-red">*</span>
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
        <Card
          @click="fileInputRef?.click()"
          class="border-dashed cursor-pointer"
          :class="{ 'opacity-50 cursor-not-allowed': loading }"
        >
          <CardContent class="text-center">
            <i class="fa-solid fa-cloud-arrow-up text-3xl text-sub mb-3"></i>
            <p class="text-heading text-fluid-xs font-bold mb-1">
              {{ selectedFile ? selectedFile.name : 'Click to upload or drag and drop' }}
            </p>
            <p class="text-meta text-fluid-xs">CSV or Excel (.csv, .xls, .xlsx) up to 10MB</p>
          </CardContent>
        </Card>
      </div>
      <p v-if="error" class="text-brand-red text-fluid-xs mt-1.5">{{ error }}</p>
    </div>

    <!-- File Preview -->
    <Card v-if="selectedFile && parsedData && parsedData.length > 0">
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle>File Preview</CardTitle>
          <Badge :text="`${parsedData.length} rows`" theme="gray" size="small" />
        </div>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <table class="w-full text-fluid-xs">
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
                class="border-b border-border hover:bg-surfaceSecondary"
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
        
        <p v-if="parsedData.length > previewLimit" class="text-meta text-fluid-xs mt-3 text-center">
          Showing first {{ previewLimit }} of {{ parsedData.length }} rows
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Badge } from '@motork/component-library'
import { Card, CardHeader, CardTitle, CardContent } from '@motork/component-library/future/primitives'
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
