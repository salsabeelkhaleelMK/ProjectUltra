import { BaseRepository } from './BaseRepository.js'
import { mockLeads } from '@/api/mockData'

/**
 * Lead Repository
 * 
 * Abstracts data access for leads.
 * Maps to REST API endpoint: /leads
 * 
 * Current implementation uses mock data arrays.
 * When real API is integrated, this will call REST endpoints:
 * - findAll() → GET /leads
 * - findById(id) → GET /leads/{id}
 * - create(data) → POST /leads
 * - update(id, data) → PUT /leads/{id}
 * - delete(id) → DELETE /leads/{id}
 */
export class LeadRepository extends BaseRepository {
  constructor() {
    super(mockLeads)
    this.dataSource = mockLeads
  }

  /**
   * Find all leads matching filters
   * @param {Object} filters - Filter criteria (status, priority, assignee, search)
   * @returns {Promise<Array>} Array of leads
   */
  async findAll(filters = {}) {
    // Simulate API delay (will be removed when real API is integrated)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let results = [...this.dataSource]
    
    // Apply filters
    if (filters.status) {
      results = results.filter(lead => lead.status === filters.status)
    }
    if (filters.priority) {
      results = results.filter(lead => lead.priority === filters.priority)
    }
    if (filters.assignee) {
      results = results.filter(lead => lead.assignee === filters.assignee)
    }
    if (filters.search) {
      const search = filters.search.toLowerCase()
      results = results.filter(lead => {
        // Note: Customer filtering will be handled by service layer
        return (lead.requestedCar && lead.requestedCar.brand && lead.requestedCar.brand.toLowerCase().includes(search)) ||
               (lead.requestedCar && lead.requestedCar.model && lead.requestedCar.model.toLowerCase().includes(search))
      })
    }
    
    return results
  }

  /**
   * Find a lead by ID
   * @param {number|string} id - Lead ID
   * @returns {Promise<Object|null>} Lead or null if not found
   */
  async findById(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const lead = this.dataSource.find(l => l.id === parseInt(id))
    return lead || null
  }

  /**
   * Create a new lead
   * @param {Object} data - Lead data
   * @returns {Promise<Object>} Created lead
   */
  async create(data) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Generate ID (in real API, server generates this)
    const newId = this.dataSource.length > 0 
      ? Math.max(...this.dataSource.map(l => l.id)) + 1 
      : 1
    
    const newLead = {
      id: newId,
      customerId: data.customerId,
      status: data.status || 'Open',
      priority: data.priority || 'Normal',
      requestedCar: data.requestedCar,
      carStatus: data.carStatus || null,
      requestType: data.requestType || 'Generic Sales',
      source: data.source || 'Direct',
      fiscalEntity: data.fiscalEntity || '',
      sourceDetails: data.sourceDetails || '',
      assignee: data.assignee || null,
      assigneeInitials: data.assigneeInitials || '',
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      nextActionDue: data.nextActionDue || null,
      tags: data.tags || [],
      stage: data.stage || 'Open Lead',
      isDisqualified: data.isDisqualified || false,
      disqualifyReason: data.disqualifyReason || null,
      scheduledAppointment: data.scheduledAppointment || null,
      contactAttempts: data.contactAttempts || []
    }
    
    this.dataSource.push(newLead)
    return newLead
  }

  /**
   * Update an existing lead
   * @param {number|string} id - Lead ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated lead
   */
  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.dataSource.findIndex(l => l.id === parseInt(id))
    if (index === -1) {
      throw new Error('Lead not found')
    }
    
    // Remove computed fields that shouldn't be stored
    const { displayStage, ...updatesToStore } = updates
    
    this.dataSource[index] = { 
      ...this.dataSource[index], 
      ...updatesToStore, 
      lastActivity: new Date().toISOString() 
    }
    
    return this.dataSource[index]
  }

  /**
   * Delete a lead
   * @param {number|string} id - Lead ID
   * @returns {Promise<Object>} Success object
   */
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.dataSource.findIndex(l => l.id === parseInt(id))
    if (index === -1) {
      throw new Error('Lead not found')
    }
    
    this.dataSource.splice(index, 1)
    return { success: true }
  }

  /**
   * Generate next available lead ID
   * (Helper method - will not be needed when using real API)
   * @returns {number} Next available ID
   */
  generateId() {
    return this.dataSource.length > 0 
      ? Math.max(...this.dataSource.map(l => l.id)) + 1 
      : 1
  }
}


