import { ref } from 'vue'
import { parseFile, detectColumns } from '@/utils/fileParser'

/**
 * Composable for handling file upload and parsing
 * 
 * @returns {Object} Object containing file upload state and methods
 */
export function useFileUpload() {
  const selectedFile = ref(null)
  const parsedData = ref(null)
  const headers = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * Validate file
   */
  const validateFile = (file) => {
    const validExtensions = ['.csv', '.xls', '.xlsx']
    const fileName = file.name.toLowerCase()
    const isValidExtension = validExtensions.some(ext => fileName.endsWith(ext))

    if (!isValidExtension) {
      throw new Error('Invalid file type. Please upload a CSV or Excel file (.csv, .xls, .xlsx)')
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 10MB limit')
    }

    return true
  }

  /**
   * Handle file selection
   */
  const handleFileSelect = async (file) => {
    try {
      error.value = null
      loading.value = true

      // Validate file
      validateFile(file)

      // Parse file
      const result = await parseFile(file)
      
      selectedFile.value = file
      parsedData.value = result.data
      headers.value = result.headers

      // Validate parsed data
      if (!result.data || result.data.length === 0) {
        throw new Error('File contains no data rows')
      }

      if (!result.headers || result.headers.length === 0) {
        throw new Error('File contains no header row')
      }

      return {
        file,
        headers: result.headers,
        data: result.data,
        rowCount: result.data.length
      }
    } catch (err) {
      error.value = err.message
      selectedFile.value = null
      parsedData.value = null
      headers.value = []
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear selected file
   */
  const clearFile = () => {
    selectedFile.value = null
    parsedData.value = null
    headers.value = []
    error.value = null
  }

  /**
   * Get file preview (first N rows)
   */
  const getPreview = (limit = 5) => {
    if (!parsedData.value) {
      return []
    }
    return parsedData.value.slice(0, limit)
  }

  return {
    selectedFile,
    parsedData,
    headers,
    loading,
    error,
    handleFileSelect,
    clearFile,
    getPreview
  }
}
