import { ref, computed } from 'vue'
import { useContractsStore } from '@/stores/contracts'
import { useSettingsStore } from '@/stores/settings'
import { contractService } from '@/services/contractService'

/**
 * Composable for PDF generation functionality
 * 
 * Provides reusable functions for generating contract and offer PDFs
 * with data preparation, validation, and error handling.
 */
export function useContractPDF() {
  const contractsStore = useContractsStore()
  const settingsStore = useSettingsStore()

  // Local state
  const isGenerating = ref(false)
  const isPreviewing = ref(false)
  const generationError = ref(null)

  /**
   * Get default PDF options from settings
   * @returns {Object} Default options
   */
  const getDefaultOptions = () => {
    const settings = settingsStore.settings
    return {
      template: settings.defaultPDFTemplate || 'classic',
      language: settings.defaultPDFLanguage || 'en',
      includeTermsAndConditions: settings.defaultIncludeTermsAndConditions ?? true,
      includeDisclaimerPage: settings.defaultIncludeDisclaimerPage ?? true
    }
  }

  /**
   * Generate contract PDF
   * @param {number|string} opportunityId - Opportunity ID
   * @param {Object} options - PDF generation options
   * @returns {Promise<Object>} Generated PDF info
   */
  const generateContractPDF = async (opportunityId, options = {}) => {
    isGenerating.value = true
    generationError.value = null

    try {
      // Merge with defaults
      const finalOptions = {
        ...getDefaultOptions(),
        ...options
      }

      const pdfInfo = await contractsStore.generateContractPDF(opportunityId, finalOptions)
      return pdfInfo
    } catch (err) {
      generationError.value = err.message
      throw err
    } finally {
      isGenerating.value = false
    }
  }

  /**
   * Generate offer PDF
   * @param {number|string} opportunityId - Opportunity ID
   * @param {number|string} offerId - Offer ID
   * @param {Object} options - PDF generation options
   * @returns {Promise<Object>} Generated PDF info
   */
  const generateOfferPDF = async (opportunityId, offerId, options = {}) => {
    isGenerating.value = true
    generationError.value = null

    try {
      // Merge with defaults
      const finalOptions = {
        ...getDefaultOptions(),
        ...options,
        includeDisclaimerPage: false // Offers don't have disclaimer
      }

      const pdfInfo = await contractsStore.generateOfferPDF(opportunityId, offerId, finalOptions)
      return pdfInfo
    } catch (err) {
      generationError.value = err.message
      throw err
    } finally {
      isGenerating.value = false
    }
  }

  /**
   * Preview contract PDF
   * @param {number|string} opportunityId - Opportunity ID
   * @param {Object} options - PDF generation options
   * @returns {Promise<Object>} Preview PDF info
   */
  const previewContractPDF = async (opportunityId, options = {}) => {
    isPreviewing.value = true
    generationError.value = null

    try {
      // Merge with defaults
      const finalOptions = {
        ...getDefaultOptions(),
        ...options
      }

      const previewInfo = await contractsStore.previewContractPDF(opportunityId, finalOptions)
      return previewInfo
    } catch (err) {
      generationError.value = err.message
      throw err
    } finally {
      isPreviewing.value = false
    }
  }

  /**
   * Preview offer PDF
   * @param {number|string} opportunityId - Opportunity ID
   * @param {number|string} offerId - Offer ID
   * @param {Object} options - PDF generation options
   * @returns {Promise<Object>} Preview PDF info
   */
  const previewOfferPDF = async (opportunityId, offerId, options = {}) => {
    isPreviewing.value = true
    generationError.value = null

    try {
      // Merge with defaults
      const finalOptions = {
        ...getDefaultOptions(),
        ...options,
        includeDisclaimerPage: false // Offers don't have disclaimer
      }

      const previewInfo = await contractsStore.previewOfferPDF(opportunityId, offerId, finalOptions)
      return previewInfo
    } catch (err) {
      generationError.value = err.message
      throw err
    } finally {
      isPreviewing.value = false
    }
  }

  /**
   * Download PDF
   * @param {string} pdfId - PDF ID
   */
  const downloadPDF = async (pdfId) => {
    try {
      await contractsStore.downloadPDF(pdfId)
    } catch (err) {
      generationError.value = err.message
      throw err
    }
  }

  /**
   * Send PDF by email
   * @param {string} pdfId - PDF ID
   * @param {Object} emailOptions - Email options
   */
  const sendPDFByEmail = async (pdfId, emailOptions) => {
    try {
      return await contractsStore.sendPDFByEmail(pdfId, emailOptions)
    } catch (err) {
      generationError.value = err.message
      throw err
    }
  }

  /**
   * Clear error state
   */
  const clearError = () => {
    generationError.value = null
    contractsStore.clearError()
  }

  /**
   * Clear preview
   */
  const clearPreview = () => {
    contractsStore.clearPreview()
  }

  /**
   * Load templates if not already loaded
   */
  const ensureTemplatesLoaded = async () => {
    if (!contractsStore.hasTemplates) {
      await contractsStore.fetchTemplates()
    }
  }

  return {
    // State
    isGenerating: computed(() => isGenerating.value),
    isPreviewing: computed(() => isPreviewing.value),
    isLoading: computed(() => contractsStore.isLoading),
    error: computed(() => generationError.value || contractsStore.error),
    previewPDF: computed(() => contractsStore.previewPDF),
    templates: computed(() => contractsStore.availableTemplates),

    // Methods
    generateContractPDF,
    generateOfferPDF,
    previewContractPDF,
    previewOfferPDF,
    downloadPDF,
    sendPDFByEmail,
    clearError,
    clearPreview,
    ensureTemplatesLoaded,
    getDefaultOptions
  }
}
