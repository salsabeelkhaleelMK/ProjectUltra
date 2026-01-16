import { BaseRepository } from './BaseRepository.js'
import { getMockData } from '@/api/mockData/localeLoader.js'

/**
 * Contact Repository
 * 
 * Abstracts data access for contacts (customers without company field).
 * Maps to REST API endpoint: /contacts
 * 
 * Current implementation uses mockCustomers array filtered for contacts.
 * When real API is integrated, this will call REST endpoints:
 * - findAll() → GET /contacts
 * - findById(id) → GET /contacts/{id}
 * - create(data) → POST /contacts
 * - update(id, data) → PUT /contacts/{id}
 * - delete(id) → DELETE /contacts/{id}
 */
export class ContactRepository extends BaseRepository {
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
   * Filter contacts from customers (contacts have no company field)
   * @returns {Array} Array of contacts
   */
  _getContacts() {
    return this.dataSource.filter(c => !c.company || c.company === '')
  }

  /**
   * Find all contacts matching filters
   * @param {Object} filters - Filter criteria (search)
   * @returns {Promise<Array>} Array of contacts
   */
  async findAll(filters = {}) {
    // Simulate API delay (will be removed when real API is integrated)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    let results = this._getContacts()
    
    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase()
      results = results.filter(contact => 
        contact.name.toLowerCase().includes(search) ||
        contact.email.toLowerCase().includes(search)
      )
    }
    
    return results
  }

  /**
   * Find a contact by ID
   * @param {number|string} id - Contact ID
   * @returns {Promise<Object|null>} Contact or null if not found
   */
  async findById(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const contacts = this._getContacts()
    const contact = contacts.find(c => c.id === parseInt(id))
    return contact || null
  }

  /**
   * Create a new contact
   * @param {Object} data - Contact data
   * @returns {Promise<Object>} Created contact
   */
  async create(data) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Generate ID (in real API, server generates this)
    const newId = this.dataSource.length > 0 
      ? Math.max(...this.dataSource.map(c => c.id)) + 1 
      : 1
    
    const newContact = {
      id: newId,
      ...data,
      company: null, // Ensure no company field for contacts
      createdAt: new Date().toISOString(),
      lastContact: new Date().toISOString()
    }
    
    this.dataSource.push(newContact)
    return newContact
  }

  /**
   * Update an existing contact
   * @param {number|string} id - Contact ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated contact
   */
  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.dataSource.findIndex(c => c.id === parseInt(id))
    if (index === -1) {
      throw new Error('Contact not found')
    }
    
    // Ensure company stays null for contacts
    this.dataSource[index] = { 
      ...this.dataSource[index], 
      ...updates, 
      company: null 
    }
    
    return this.dataSource[index]
  }

  /**
   * Delete a contact
   * @param {number|string} id - Contact ID
   * @returns {Promise<Object>} Success object
   */
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.dataSource.findIndex(c => c.id === parseInt(id))
    if (index === -1) {
      throw new Error('Contact not found')
    }
    
    this.dataSource.splice(index, 1)
    return { success: true }
  }
}


