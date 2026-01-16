import { BaseRepository } from './BaseRepository.js'
import { getMockData } from '@/api/mockData/localeLoader.js'

/**
 * Opportunity Repository
 * 
 * Abstracts data access for opportunities.
 * Maps to REST API endpoint: /opportunities
 * 
 * Current implementation uses mock data arrays.
 * When real API is integrated, this will call REST endpoints:
 * - findAll() → GET /opportunities
 * - findById(id) → GET /opportunities/{id}
 * - create(data) → POST /opportunities
 * - update(id, data) → PUT /opportunities/{id}
 * - delete(id) → DELETE /opportunities/{id}
 */
export class OpportunityRepository extends BaseRepository {
  constructor() {
    super([]) // Initialize with empty array, data loaded dynamically
  }
  
  /**
   * Get current data source (locale-aware)
   */
  get dataSource() {
    return getMockData().mockOpportunities
  }

  /**
   * Find all opportunities matching filters
   * @param {Object} filters - Filter criteria (stage, assignee, search)
   * @returns {Promise<Array>} Array of opportunities
   */
  async findAll(filters = {}) {
    // Simulate API delay (will be removed when real API is integrated)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let results = [...this.dataSource]
    
    // Apply filters
    if (filters.stage) {
      results = results.filter(opp => opp.stage === filters.stage)
    }
    if (filters.assignee) {
      results = results.filter(opp => opp.assignee === filters.assignee)
    }
    if (filters.search) {
      const search = filters.search.toLowerCase()
      results = results.filter(opp => {
        // Note: Customer filtering will be handled by service layer
        return (opp.vehicle && opp.vehicle.brand && opp.vehicle.brand.toLowerCase().includes(search)) ||
               (opp.vehicle && opp.vehicle.model && opp.vehicle.model.toLowerCase().includes(search))
      })
    }
    
    return results
  }

  /**
   * Find an opportunity by ID
   * @param {number|string} id - Opportunity ID
   * @returns {Promise<Object|null>} Opportunity or null if not found
   */
  async findById(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const opportunity = this.dataSource.find(o => o.id === parseInt(id))
    return opportunity || null
  }

  /**
   * Create a new opportunity
   * @param {Object} data - Opportunity data
   * @returns {Promise<Object>} Created opportunity
   */
  async create(data) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Generate ID (in real API, server generates this)
    const newId = this.dataSource.length > 0 
      ? Math.max(...this.dataSource.map(o => o.id)) + 1 
      : 1
    
    const newOpportunity = {
      id: newId,
      customerId: data.customerId,
      requestedCar: data.requestedCar || null,
      vehicle: data.vehicle || data.requestedCar || null,
      selectedVehicle: data.selectedVehicle || null,
      stage: data.stage || 'Qualified',
      tags: data.tags || [],
      value: data.value || 0,
      expectedCloseDate: data.expectedCloseDate || null,
      assignee: data.assignee || null,
      source: data.source || 'Direct',
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      scheduledAppointment: data.scheduledAppointment || null,
      contractDate: data.contractDate || null
    }
    
    this.dataSource.push(newOpportunity)
    return newOpportunity
  }

  /**
   * Update an existing opportunity
   * @param {number|string} id - Opportunity ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated opportunity
   */
  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.dataSource.findIndex(o => o.id === parseInt(id))
    if (index === -1) {
      throw new Error('Opportunity not found')
    }
    
    // Remove computed fields that shouldn't be stored
    const { displayStage, ...updatesToStore } = updates
    
    this.dataSource[index] = { 
      ...this.dataSource[index], 
      ...updatesToStore 
    }
    
    return this.dataSource[index]
  }

  /**
   * Delete an opportunity
   * @param {number|string} id - Opportunity ID
   * @returns {Promise<Object>} Success object
   */
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.dataSource.findIndex(o => o.id === parseInt(id))
    if (index === -1) {
      throw new Error('Opportunity not found')
    }
    
    this.dataSource.splice(index, 1)
    return { success: true }
  }

  /**
   * Generate next available opportunity ID
   * (Helper method - will not be needed when using real API)
   * @returns {number} Next available ID
   */
  generateId() {
    return this.dataSource.length > 0 
      ? Math.max(...this.dataSource.map(o => o.id)) + 1 
      : 1
  }
}


