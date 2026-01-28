import { contractService } from '@/services/contractService'
import { opportunityService } from '@/services/opportunityService'

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Generate a contract PDF
 * @param {number|string} opportunityId - Opportunity ID
 * @param {Object} options - PDF generation options
 * @param {string} options.template - Template style ('classic' | 'express')
 * @param {string} options.language - Language code ('en' | 'de' | 'fr' | 'it' | 'nl')
 * @param {boolean} options.includeTermsAndConditions - Include T&C section
 * @param {boolean} options.includeDisclaimerPage - Include disclaimer page
 * @returns {Promise<Object>} Generated PDF info
 */
export const generateContractPDF = async (opportunityId, options = {}) => {
  await delay()
  
  // Fetch and enrich opportunity
  const opportunity = await opportunityService.findById(opportunityId)
  if (!opportunity) throw new Error('Opportunity not found')
  
  // Prepare PDF data
  const pdfData = await contractService.prepareContractData(opportunity, options)
  
  // Determine template name
  const templateName = `contract-${options.template || 'classic'}`
  
  // Generate PDF
  return await contractService.generatePDF(
    templateName,
    options.language || 'en',
    pdfData
  )
}

/**
 * Generate an offer PDF
 * @param {number|string} opportunityId - Opportunity ID
 * @param {number|string} offerId - Offer ID (or offer activity ID)
 * @param {Object} options - PDF generation options
 * @param {string} options.template - Template style ('classic' | 'express')
 * @param {string} options.language - Language code
 * @param {boolean} options.includeTermsAndConditions - Include T&C section
 * @returns {Promise<Object>} Generated PDF info
 */
export const generateOfferPDF = async (opportunityId, offerId, options = {}) => {
  await delay()
  
  // Fetch and enrich opportunity
  const opportunity = await opportunityService.findById(opportunityId)
  if (!opportunity) throw new Error('Opportunity not found')
  
  // Find offer from opportunity's offers array or activities
  let offer = null
  
  // Check opportunity's offers array
  if (opportunity.offers && Array.isArray(opportunity.offers)) {
    offer = opportunity.offers.find(o => o.id === offerId || o.id === String(offerId))
  }
  
  // If not found, check activities
  if (!offer && opportunity.activities) {
    const offerActivity = opportunity.activities.find(
      a => a.type === 'offer' && (a.id === offerId || a.id === String(offerId))
    )
    if (offerActivity) {
      offer = offerActivity
    }
  }
  
  if (!offer) throw new Error('Offer not found')
  
  // Prepare PDF data
  const pdfData = await contractService.prepareOfferData(opportunity, offer, options)
  
  // Determine template name
  const templateName = `offer-${options.template || 'classic'}`
  
  // Generate PDF
  return await contractService.generatePDF(
    templateName,
    options.language || 'en',
    pdfData
  )
}

/**
 * Preview a contract PDF (generates temporary preview URL)
 * @param {number|string} opportunityId - Opportunity ID
 * @param {Object} options - PDF generation options
 * @returns {Promise<Object>} Preview PDF info
 */
export const previewContractPDF = async (opportunityId, options = {}) => {
  await delay()
  
  // Fetch and enrich opportunity
  const opportunity = await opportunityService.findById(opportunityId)
  if (!opportunity) throw new Error('Opportunity not found')
  
  // Prepare PDF data
  const pdfData = await contractService.prepareContractData(opportunity, options)
  
  // Determine template name
  const templateName = `contract-${options.template || 'classic'}`
  
  // Preview PDF
  return await contractService.previewPDF(
    templateName,
    options.language || 'en',
    pdfData
  )
}

/**
 * Preview an offer PDF (generates temporary preview URL)
 * @param {number|string} opportunityId - Opportunity ID
 * @param {number|string} offerId - Offer ID
 * @param {Object} options - PDF generation options
 * @returns {Promise<Object>} Preview PDF info
 */
export const previewOfferPDF = async (opportunityId, offerId, options = {}) => {
  await delay()
  
  // Fetch and enrich opportunity
  const opportunity = await opportunityService.findById(opportunityId)
  if (!opportunity) throw new Error('Opportunity not found')
  
  // Find offer
  let offer = null
  if (opportunity.offers && Array.isArray(opportunity.offers)) {
    offer = opportunity.offers.find(o => o.id === offerId || o.id === String(offerId))
  }
  if (!offer && opportunity.activities) {
    const offerActivity = opportunity.activities.find(
      a => a.type === 'offer' && (a.id === offerId || a.id === String(offerId))
    )
    if (offerActivity) {
      offer = offerActivity
    }
  }
  
  if (!offer) throw new Error('Offer not found')
  
  // Prepare PDF data
  const pdfData = await contractService.prepareOfferData(opportunity, offer, options)
  
  // Determine template name
  const templateName = `offer-${options.template || 'classic'}`
  
  // Preview PDF
  return await contractService.previewPDF(
    templateName,
    options.language || 'en',
    pdfData
  )
}

/**
 * Get available PDF templates
 * @returns {Promise<Array>} Array of available templates
 */
export const getPDFTemplates = async () => {
  await delay()
  return await contractService.getTemplates()
}

/**
 * Send PDF by email
 * @param {string} pdfId - PDF ID
 * @param {Object} emailOptions - Email options
 * @param {string} emailOptions.to - Recipient email
 * @param {string} emailOptions.subject - Email subject
 * @param {string} emailOptions.message - Optional message
 * @returns {Promise<Object>} Success response
 */
export const sendPDFByEmail = async (pdfId, emailOptions) => {
  await delay()
  return await contractService.sendPDFByEmail(pdfId, emailOptions)
}

/**
 * Download PDF by ID
 * @param {string} pdfId - PDF ID
 * @returns {Promise<Blob>} PDF blob
 */
export const downloadPDF = async (pdfId) => {
  await delay()
  const { ContractRepository } = await import('@/repositories/ContractRepository')
  const repository = new ContractRepository()
  return await repository.downloadPDF(pdfId)
}
