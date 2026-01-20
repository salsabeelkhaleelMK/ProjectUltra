import { getDisplayStage, getDeliverySubstatus } from '@/utils/stageMapper'
import { OpportunityRepository } from '@/repositories/OpportunityRepository'
import { ActivityRepository } from '@/repositories/ActivityRepository'
import { CustomerRepository } from '@/repositories/CustomerRepository'

// Create repository instances
const opportunityRepository = new OpportunityRepository()
const activityRepository = new ActivityRepository()
const customerRepository = new CustomerRepository()

/**
 * Opportunity Service
 * 
 * Handles business logic and data transformation for opportunities.
 * This layer sits between API wrappers and repositories.
 * 
 * Responsibilities:
 * - Data enrichment (customer data, display stages, delivery substatus)
 * - Business logic
 * - Data transformation
 * - Validation
 */
export class OpportunityService {
  /**
   * Enrich opportunity with customer data
   * @param {Object} opportunity - Opportunity object
   * @returns {Object} Opportunity with customer data
   */
  enrichWithCustomer(opportunity) {
    if (!opportunity) return null
    
    const customer = customerRepository.findByIdSync(opportunity.customerId)
    if (!customer) {
      // Fallback if customer not found
      return {
        ...opportunity,
        customer: {
          id: opportunity.customerId,
          name: 'Unknown Customer',
          initials: '??',
          email: '',
          phone: '',
          address: ''
        }
      }
    }
    
    return {
      ...opportunity,
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
   * Enrich opportunity with display stage, delivery substatus, and customer data
   * @param {Object} opportunity - Opportunity object
   * @returns {Promise<Object>} Enriched opportunity with display stage
   */
  async enrichWithStage(opportunity) {
    if (!opportunity) return null
    
    // Backward compatibility: Migrate old stage names
    let migratedStage = opportunity.stage
    if (opportunity.stage === 'Offer Sent') {
      migratedStage = 'In Negotiation'
    } else if (opportunity.stage === 'Awaiting Response') {
      migratedStage = 'Needs Follow-up'
    }
    
    const oppWithCustomer = this.enrichWithCustomer({ ...opportunity, stage: migratedStage })
    
    // Fetch activities using repository
    const activities = await activityRepository.findAllByOpportunityId(opportunity.id)
    const displayStage = getDisplayStage({ ...oppWithCustomer, apiStatus: migratedStage, activities }, 'opportunity')
    
    // Calculate delivery substatus only for Closed Won opportunities
    const deliverySubstatus = displayStage === 'Closed Won' 
      ? getDeliverySubstatus({ ...oppWithCustomer, displayStage }, activities)
      : null
    
    return {
      ...oppWithCustomer,
      stage: migratedStage, // Use migrated stage
      apiStatus: migratedStage,
      displayStage,
      deliverySubstatus,
      activities // Include activities for stage calculation
    }
  }

  /**
   * Fetch all opportunities with enrichment
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Object with data and total
   */
  async findAll(filters = {}) {
    // Use repository to fetch opportunities
    let results = await opportunityRepository.findAll(filters)
    
    // Apply customer search filter (business logic)
    if (filters.search) {
      const search = filters.search.toLowerCase()
      results = results.filter(opp => {
        const customer = customerRepository.findByIdSync(opp.customerId)
        const customerName = customer?.name || ''
        return customerName.toLowerCase().includes(search) ||
          (opp.vehicle && opp.vehicle.brand && opp.vehicle.brand.toLowerCase().includes(search)) ||
          (opp.vehicle && opp.vehicle.model && opp.vehicle.model.toLowerCase().includes(search))
      })
    }
    
    // Enrich with display stages
    const enrichedResults = await Promise.all(results.map(opp => this.enrichWithStage(opp)))
    
    return { data: enrichedResults, total: enrichedResults.length }
  }

  /**
   * Fetch opportunity by ID with enrichment
   * @param {number|string} id - Opportunity ID
   * @returns {Promise<Object>} Enriched opportunity
   */
  async findById(id) {
    const opportunity = await opportunityRepository.findById(id)
    if (!opportunity) throw new Error('Opportunity not found')
    return await this.enrichWithStage(opportunity)
  }

  /**
   * Create a new opportunity with enrichment
   * @param {Object} data - Opportunity data
   * @returns {Promise<Object>} Created and enriched opportunity
   */
  async create(data) {
    const newOpportunity = await opportunityRepository.create(data)
    return await this.enrichWithStage(newOpportunity)
  }

  /**
   * Update an existing opportunity with enrichment
   * @param {number|string} id - Opportunity ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated and enriched opportunity
   */
  async update(id, updates) {
    const updatedOpportunity = await opportunityRepository.update(id, updates)
    return await this.enrichWithStage(updatedOpportunity)
  }

  /**
   * Delete an opportunity
   * @param {number|string} id - Opportunity ID
   * @returns {Promise<Object>} Success object
   */
  async delete(id) {
    return await opportunityRepository.delete(id)
  }
}

// Export singleton instance
export const opportunityService = new OpportunityService()



