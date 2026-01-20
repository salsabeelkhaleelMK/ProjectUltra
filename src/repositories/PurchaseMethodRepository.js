import { BaseRepository } from './BaseRepository.js'

/**
 * Purchase Method Repository
 * 
 * Abstracts data access for purchase methods (FIN, LEA, LTR).
 * Maps to REST API endpoint: /purchase-methods
 * 
 * Current implementation uses in-memory storage.
 * When real API is integrated, this will call REST endpoints:
 * - findAll(filters) → GET /purchase-methods?{filters}
 * - findAllByLeadId(leadId) → GET /purchase-methods?leadId={leadId}
 * - findAllByOpportunityId(opportunityId) → GET /purchase-methods?opportunityId={opportunityId}
 * - findById(id) → GET /purchase-methods/{id}
 * - create(data) → POST /purchase-methods
 * - update(id, data) → PUT /purchase-methods/{id}
 * - delete(id) → DELETE /purchase-methods/{id}
 */
export class PurchaseMethodRepository extends BaseRepository {
  constructor() {
    super([]) // Initialize with empty array, data stored in memory
  }
  
  /**
   * Get current data source (in-memory storage)
   */
  get dataSource() {
    // Store purchase methods in memory (will be replaced with API calls)
    if (!this._dataSource) {
      this._dataSource = []
    }
    return this._dataSource
  }

  /**
   * Find all purchase methods matching filters
   * @param {Object} filters - Filter criteria (leadId, opportunityId, type, offerId, vehicleId)
   * @returns {Promise<Array>} Array of purchase methods
   */
  async findAll(filters = {}) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let results = [...this.dataSource]
    
    // Apply filters
    if (filters.leadId !== undefined) {
      results = results.filter(pm => pm.leadId === parseInt(filters.leadId))
    }
    if (filters.opportunityId !== undefined) {
      results = results.filter(pm => pm.opportunityId === parseInt(filters.opportunityId))
    }
    if (filters.type) {
      results = results.filter(pm => pm.type === filters.type)
    }
    if (filters.offerId !== undefined) {
      results = results.filter(pm => pm.offerId === parseInt(filters.offerId))
    }
    if (filters.vehicleId !== undefined) {
      results = results.filter(pm => pm.vehicleId === parseInt(filters.vehicleId))
    }
    
    return results
  }

  /**
   * Find all purchase methods for a specific lead
   * @param {number|string} leadId - Lead ID
   * @returns {Promise<Array>} Array of purchase methods
   */
  async findAllByLeadId(leadId) {
    return this.findAll({ leadId })
  }

  /**
   * Find all purchase methods for a specific opportunity
   * @param {number|string} opportunityId - Opportunity ID
   * @returns {Promise<Array>} Array of purchase methods
   */
  async findAllByOpportunityId(opportunityId) {
    return this.findAll({ opportunityId })
  }

  /**
   * Find a purchase method by ID
   * @param {number|string} id - Purchase method ID
   * @returns {Promise<Object|null>} Purchase method or null if not found
   */
  async findById(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const purchaseMethod = this.dataSource.find(pm => pm.id === parseInt(id))
    return purchaseMethod || null
  }

  /**
   * Create a new purchase method
   * @param {Object} data - Purchase method data
   * @returns {Promise<Object>} Created purchase method
   */
  async create(data) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Generate ID (in real API, server generates this)
    const newId = this.dataSource.length > 0 
      ? Math.max(...this.dataSource.map(pm => pm.id)) + 1 
      : 1
    
    const newPurchaseMethod = {
      id: newId,
      type: data.type, // 'FIN', 'LEA', or 'LTR'
      leadId: data.leadId !== undefined ? parseInt(data.leadId) : undefined,
      opportunityId: data.opportunityId !== undefined ? parseInt(data.opportunityId) : undefined,
      offerId: data.offerId !== undefined ? parseInt(data.offerId) : undefined,
      vehicleId: data.vehicleId !== undefined ? parseInt(data.vehicleId) : undefined,
      fields: data.fields || {},
      currency: data.currency || 'EUR',
      offerValidFrom: data.offerValidFrom || null,
      offerValidTo: data.offerValidTo || null,
      status: data.status || 'active',
      createdAt: data.createdAt || new Date().toISOString(),
      createdBy: data.createdBy || null,
      updatedAt: new Date().toISOString()
    }
    
    this.dataSource.push(newPurchaseMethod)
    return newPurchaseMethod
  }

  /**
   * Update an existing purchase method
   * @param {number|string} id - Purchase method ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated purchase method
   */
  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const purchaseMethod = this.dataSource.find(pm => pm.id === parseInt(id))
    if (!purchaseMethod) {
      throw new Error('Purchase method not found')
    }
    
    Object.assign(purchaseMethod, updates, { 
      updatedAt: new Date().toISOString() 
    })
    return purchaseMethod
  }

  /**
   * Delete a purchase method
   * @param {number|string} id - Purchase method ID
   * @returns {Promise<Object>} Success object
   */
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.dataSource.findIndex(pm => pm.id === parseInt(id))
    if (index === -1) {
      throw new Error('Purchase method not found')
    }
    
    this.dataSource.splice(index, 1)
    return { success: true }
  }
}
