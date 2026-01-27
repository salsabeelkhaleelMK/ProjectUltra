import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as contractsApi from '@/api/contracts'

export const useContractsStore = defineStore('contracts', () => {
  // State
  const generatedPDFs = ref([]) // Store generated PDFs with their IDs
  const templates = ref([])
  const loading = ref(false)
  const error = ref(null)
  const previewPDF = ref(null) // Current preview PDF

  // Getters
  const availableTemplates = computed(() => templates.value)
  const hasTemplates = computed(() => templates.value.length > 0)
  const isLoading = computed(() => loading.value)

  // Actions
  /**
   * Fetch available PDF templates
   */
  const fetchTemplates = async () => {
    loading.value = true
    error.value = null
    try {
      templates.value = await contractsApi.getPDFTemplates()
      return templates.value
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Generate a contract PDF
   * @param {number|string} opportunityId - Opportunity ID
   * @param {Object} options - PDF generation options
   * @returns {Promise<Object>} Generated PDF info
   */
  const generateContractPDF = async (opportunityId, options = {}) => {
    loading.value = true
    error.value = null
    try {
      const pdfInfo = await contractsApi.generateContractPDF(opportunityId, options)
      
      // Store generated PDF
      generatedPDFs.value.push({
        id: pdfInfo.id,
        opportunityId,
        type: 'contract',
        ...pdfInfo,
        options
      })
      
      return pdfInfo
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Generate an offer PDF
   * @param {number|string} opportunityId - Opportunity ID
   * @param {number|string} offerId - Offer ID
   * @param {Object} options - PDF generation options
   * @returns {Promise<Object>} Generated PDF info
   */
  const generateOfferPDF = async (opportunityId, offerId, options = {}) => {
    loading.value = true
    error.value = null
    try {
      const pdfInfo = await contractsApi.generateOfferPDF(opportunityId, offerId, options)
      
      // Store generated PDF
      generatedPDFs.value.push({
        id: pdfInfo.id,
        opportunityId,
        offerId,
        type: 'offer',
        ...pdfInfo,
        options
      })
      
      return pdfInfo
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Preview a contract PDF
   * @param {number|string} opportunityId - Opportunity ID
   * @param {Object} options - PDF generation options
   * @returns {Promise<Object>} Preview PDF info
   */
  const previewContractPDF = async (opportunityId, options = {}) => {
    loading.value = true
    error.value = null
    try {
      const previewInfo = await contractsApi.previewContractPDF(opportunityId, options)
      previewPDF.value = {
        opportunityId,
        type: 'contract',
        ...previewInfo,
        options
      }
      return previewInfo
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Preview an offer PDF
   * @param {number|string} opportunityId - Opportunity ID
   * @param {number|string} offerId - Offer ID
   * @param {Object} options - PDF generation options
   * @returns {Promise<Object>} Preview PDF info
   */
  const previewOfferPDF = async (opportunityId, offerId, options = {}) => {
    loading.value = true
    error.value = null
    try {
      const previewInfo = await contractsApi.previewOfferPDF(opportunityId, offerId, options)
      previewPDF.value = {
        opportunityId,
        offerId,
        type: 'offer',
        ...previewInfo,
        options
      }
      return previewInfo
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Download PDF by ID
   * @param {string} pdfId - PDF ID
   * @returns {Promise<void>}
   */
  const downloadPDF = async (pdfId) => {
    loading.value = true
    error.value = null
    try {
      const blob = await contractsApi.downloadPDF(pdfId)
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `contract-${pdfId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Send PDF by email
   * @param {string} pdfId - PDF ID
   * @param {Object} emailOptions - Email options
   * @returns {Promise<Object>} Success response
   */
  const sendPDFByEmail = async (pdfId, emailOptions) => {
    loading.value = true
    error.value = null
    try {
      const result = await contractsApi.sendPDFByEmail(pdfId, emailOptions)
      return result
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear preview PDF
   */
  const clearPreview = () => {
    if (previewPDF.value?.previewUrl) {
      URL.revokeObjectURL(previewPDF.value.previewUrl)
    }
    previewPDF.value = null
  }

  /**
   * Clear error
   */
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    generatedPDFs,
    templates,
    loading,
    error,
    previewPDF,
    
    // Getters
    availableTemplates,
    hasTemplates,
    isLoading,
    
    // Actions
    fetchTemplates,
    generateContractPDF,
    generateOfferPDF,
    previewContractPDF,
    previewOfferPDF,
    downloadPDF,
    sendPDFByEmail,
    clearPreview,
    clearError
  }
})
