import { purchaseMethodService } from '@/services/purchaseMethodService'

// Simulate API delay (acceptable for mocking - will be removed when real API is integrated)
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Fetch all purchase methods matching filters
 * @param {Object} filters - Filter criteria (leadId, opportunityId, type, offerId, vehicleId)
 * @returns {Promise<Array>} Array of purchase methods
 */
export const fetchPurchaseMethods = async (filters = {}) => {
  await delay()
  return await purchaseMethodService.findAll(filters)
}

/**
 * Fetch purchase methods for a specific lead
 * @param {number|string} leadId - Lead ID
 * @returns {Promise<Array>} Array of purchase methods
 */
export const fetchLeadPurchaseMethods = async (leadId) => {
  await delay()
  return await purchaseMethodService.findAll({ leadId })
}

/**
 * Fetch purchase methods for a specific opportunity
 * @param {number|string} opportunityId - Opportunity ID
 * @returns {Promise<Array>} Array of purchase methods
 */
export const fetchOpportunityPurchaseMethods = async (opportunityId) => {
  await delay()
  return await purchaseMethodService.findAll({ opportunityId })
}

/**
 * Fetch a purchase method by ID
 * @param {number|string} id - Purchase method ID
 * @returns {Promise<Object|null>} Purchase method or null
 */
export const fetchPurchaseMethodById = async (id) => {
  await delay()
  return await purchaseMethodService.findById(id)
}

/**
 * Create a new purchase method
 * @param {Object} purchaseMethodData - Purchase method data
 * @returns {Promise<Object>} Created purchase method
 */
export const createPurchaseMethod = async (purchaseMethodData) => {
  await delay()
  return await purchaseMethodService.create(purchaseMethodData)
}

/**
 * Update an existing purchase method
 * @param {number|string} id - Purchase method ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated purchase method
 */
export const updatePurchaseMethod = async (id, updates) => {
  await delay()
  return await purchaseMethodService.update(id, updates)
}

/**
 * Delete a purchase method
 * @param {number|string} id - Purchase method ID
 * @returns {Promise<Object>} Success object
 */
export const deletePurchaseMethod = async (id) => {
  await delay()
  return await purchaseMethodService.delete(id)
}
