import { mockCustomers } from '@/api/mockData'
import { getDisplayStage } from '@/utils/stageMapper'
import { LeadRepository } from '@/repositories/LeadRepository'

// Create repository instance
const leadRepository = new LeadRepository()

/**
 * Lead Service
 * 
 * Handles business logic and data transformation for leads.
 * This layer sits between API wrappers and repositories.
 * 
 * Responsibilities:
 * - Data enrichment (customer data, display stages)
 * - Business logic
 * - Data transformation
 * - Validation
 */
export class LeadService {
  /**
   * Enrich lead with customer data
   * @param {Object} lead - Lead object
   * @returns {Object} Lead with customer data
   */
  enrichWithCustomer(lead) {
    if (!lead) return null
    
    const customer = mockCustomers.find(c => c.id === lead.customerId)
    if (!customer) {
      // Fallback if customer not found
      return {
        ...lead,
        customer: {
          id: lead.customerId,
          name: 'Unknown Customer',
          initials: '??',
          email: '',
          phone: '',
          address: ''
        }
      }
    }
    
    return {
      ...lead,
      customer: {
        id: customer.id,
        name: customer.name,
        initials: customer.initials,
        email: customer.email,
        phone: customer.phone,
        address: customer.address
      }
    }
  }

  /**
   * Enrich lead with display stage and customer data
   * @param {Object} lead - Lead object
   * @returns {Object} Enriched lead with display stage
   */
  enrichWithStage(lead) {
    if (!lead) return null
    
    const leadWithCustomer = this.enrichWithCustomer(lead)
    
    // Explicitly preserve isDisqualified - critical for state machine
    const enrichedLead = {
      ...leadWithCustomer,
      apiStatus: lead.stage,
      // Ensure isDisqualified is explicitly set (default to false if missing)
      isDisqualified: lead.isDisqualified === true,
      displayStage: getDisplayStage({ ...leadWithCustomer, apiStatus: lead.stage, isDisqualified: lead.isDisqualified === true }, 'lead')
    }
    
    return enrichedLead
  }

  /**
   * Fetch all leads with enrichment
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Object with data and total
   */
  async findAll(filters = {}) {
    // Use repository to fetch leads
    let results = await leadRepository.findAll(filters)
    
    // Apply customer search filter (business logic)
    if (filters.search) {
      const search = filters.search.toLowerCase()
      results = results.filter(lead => {
        const customer = mockCustomers.find(c => c.id === lead.customerId)
        const customerName = customer?.name || ''
        return customerName.toLowerCase().includes(search) ||
          (lead.requestedCar && lead.requestedCar.brand && lead.requestedCar.brand.toLowerCase().includes(search)) ||
          (lead.requestedCar && lead.requestedCar.model && lead.requestedCar.model.toLowerCase().includes(search))
      })
    }
    
    // Enrich with display stages
    const enrichedResults = results.map(lead => this.enrichWithStage(lead))
    
    return { data: enrichedResults, total: enrichedResults.length }
  }

  /**
   * Fetch lead by ID with enrichment
   * @param {number|string} id - Lead ID
   * @returns {Promise<Object>} Enriched lead
   */
  async findById(id) {
    const lead = await leadRepository.findById(id)
    if (!lead) throw new Error('Lead not found')
    return this.enrichWithStage(lead)
  }

  /**
   * Create a new lead with enrichment
   * @param {Object} data - Lead data
   * @returns {Promise<Object>} Created and enriched lead
   */
  async create(data) {
    const newLead = await leadRepository.create(data)
    return this.enrichWithStage(newLead)
  }

  /**
   * Update an existing lead with enrichment
   * @param {number|string} id - Lead ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated and enriched lead
   */
  async update(id, updates) {
    const updatedLead = await leadRepository.update(id, updates)
    return this.enrichWithStage(updatedLead)
  }

  /**
   * Delete a lead
   * @param {number|string} id - Lead ID
   * @returns {Promise<Object>} Success object
   */
  async delete(id) {
    return await leadRepository.delete(id)
  }
}

// Export singleton instance
export const leadService = new LeadService()

