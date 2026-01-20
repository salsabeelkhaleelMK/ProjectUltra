import { BaseRepository } from './BaseRepository.js'
import { getMockData } from '@/api/mockData/localeLoader.js'

/**
 * Customer Repository
 * 
 * Abstracts data access for customers/contacts.
 * Maps to REST API endpoint: /customers or /contacts
 * 
 * Current implementation uses mock data arrays.
 * When real API is integrated, this will call REST endpoints:
 * - findAll() → GET /customers
 * - findById(id) → GET /customers/{id}
 * - create(data) → POST /customers
 * - update(id, data) → PUT /customers/{id}
 * - delete(id) → DELETE /customers/{id}
 */
export class CustomerRepository extends BaseRepository {
  constructor() {
    super([]) // Initialize with empty array, data loaded dynamically
  }
  
  /**
   * Get current data source (locale-aware)
   */
  get dataSource() {
    return getMockData().mockCustomers
  }

  /**
   * Find all customers matching filters
   * @param {Object} filters - Filter criteria (search, type, etc.)
   * @returns {Promise<Array>} Array of customers
   */
  async findAll(filters = {}) {
    // Simulate API delay (will be removed when real API is integrated)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let results = [...this.dataSource]
    
    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase()
      results = results.filter(customer => {
        return (customer.name && customer.name.toLowerCase().includes(search)) ||
               (customer.email && customer.email.toLowerCase().includes(search)) ||
               (customer.phone && customer.phone.toLowerCase().includes(search))
      })
    }
    
    if (filters.type) {
      results = results.filter(customer => customer.type === filters.type)
    }
    
    return results
  }

  /**
   * Find a customer by ID
   * @param {number|string} id - Customer ID
   * @returns {Promise<Object|null>} Customer or null if not found
   */
  async findById(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const customer = this.dataSource.find(c => c.id === parseInt(id))
    return customer || null
  }

  /**
   * Find a customer by ID (synchronous - for service layer enrichment)
   * @param {number|string} id - Customer ID
   * @returns {Object|null} Customer or null if not found
   */
  findByIdSync(id) {
    const customer = this.dataSource.find(c => c.id === parseInt(id))
    return customer || null
  }

  /**
   * Create a new customer
   * @param {Object} data - Customer data
   * @returns {Promise<Object>} Created customer
   */
  async create(data) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Generate ID (in real API, server generates this)
    const newId = this.dataSource.length > 0 
      ? Math.max(...this.dataSource.map(c => c.id)) + 1 
      : 1
    
    const newCustomer = {
      id: newId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address || '',
      initials: this.generateInitials(data.name),
      type: data.type || 'contact',
      createdAt: new Date().toISOString(),
      tags: data.tags || []
    }
    
    this.dataSource.push(newCustomer)
    return newCustomer
  }

  /**
   * Update an existing customer
   * @param {number|string} id - Customer ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated customer
   */
  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.dataSource.findIndex(c => c.id === parseInt(id))
    if (index === -1) {
      throw new Error('Customer not found')
    }
    
    this.dataSource[index] = { 
      ...this.dataSource[index], 
      ...updates,
      updatedAt: new Date().toISOString() 
    }
    
    return this.dataSource[index]
  }

  /**
   * Delete a customer
   * @param {number|string} id - Customer ID
   * @returns {Promise<Object>} Success object
   */
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.dataSource.findIndex(c => c.id === parseInt(id))
    if (index === -1) {
      throw new Error('Customer not found')
    }
    
    this.dataSource.splice(index, 1)
    return { success: true }
  }

  /**
   * Generate initials from name
   * @param {string} name - Customer name
   * @returns {string} Initials (2 letters)
   */
  generateInitials(name) {
    if (!name) return '??'
    const parts = name.split(' ').filter(Boolean)
    if (parts.length === 0) return '??'
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
}
