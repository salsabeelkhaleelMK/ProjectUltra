import { ContractRepository } from '@/repositories/ContractRepository'
import { CustomerRepository } from '@/repositories/CustomerRepository'
import { ActivityRepository } from '@/repositories/ActivityRepository'

// Create repository instances
const contractRepository = new ContractRepository()
const customerRepository = new CustomerRepository()
const activityRepository = new ActivityRepository()

/**
 * Contract Service
 * 
 * Handles business logic for PDF generation and contract/offer data assembly.
 * This layer sits between API wrappers and repositories.
 * 
 * Responsibilities:
 * - Assemble PDF data from opportunity/offer/customer/vehicle data
 * - Format pricing, VAT, trade-in calculations
 * - Extract payment terms and financing information
 * - Prepare data for Twig templates
 */
export class ContractService {
  /**
   * Prepare PDF data for contract generation
   * @param {Object} opportunity - Opportunity object (enriched with customer)
   * @param {Object} options - PDF generation options
   * @param {string} options.template - Template style ('classic' | 'express')
   * @param {string} options.language - Language code
   * @param {boolean} options.includeTermsAndConditions - Include T&C section
   * @param {boolean} options.includeDisclaimerPage - Include disclaimer page (contracts only)
   * @returns {Promise<Object>} Formatted PDF data payload
   */
  async prepareContractData(opportunity, options = {}) {
    if (!opportunity) throw new Error('Opportunity is required')
    
    // Get seller information
    const seller = await contractRepository.getSellerInfo()
    
    // Get customer (buyer) information
    const customer = customerRepository.findByIdSync(opportunity.customerId)
    if (!customer) throw new Error('Customer not found')
    
    // Get activities for trade-in and financing
    const activities = await activityRepository.findAllByOpportunityId(opportunity.id)
    const tradeInActivity = activities.find(a => a.type === 'trade-in')
    const financingActivity = activities.find(a => a.type === 'financing')
    
    // Get vehicle data (from opportunity or selected vehicle)
    const vehicle = opportunity.selectedVehicle || opportunity.vehicle || opportunity.requestedCar
    
    // Format pricing
    const pricing = this.formatPricing(opportunity, null, tradeInActivity)
    
    // Format payment terms
    const paymentTerms = this.formatPaymentTerms(financingActivity, opportunity)
    
    // Get equipment/options
    const equipment = this.getEquipment(vehicle)
    
    // Build PDF data payload
    const pdfData = {
      seller: {
        name: seller.name,
        address: seller.address,
        phone: seller.phone,
        email: seller.email,
        vatNumber: seller.vatNumber,
        registrationNumber: seller.registrationNumber,
        website: seller.website
      },
      buyer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address || '',
        company: customer.company || null
      },
      vehicle: vehicle ? {
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        fuelType: vehicle.fuelType,
        gearType: vehicle.gearType,
        kilometers: vehicle.kilometers || 0,
        vin: vehicle.vin || '',
        image: vehicle.image || null,
        color: vehicle.color || '',
        status: vehicle.status || 'New'
      } : null,
      pricing: pricing,
      paymentTerms: paymentTerms,
      equipment: equipment,
      termsAndConditions: options.includeTermsAndConditions ? this.getTermsAndConditions(options.language) : null,
      contractDate: opportunity.contractDate || new Date().toISOString().split('T')[0],
      signatureArea: true // Contracts always have signature area
    }
    
    return pdfData
  }

  /**
   * Prepare PDF data for offer generation
   * @param {Object} opportunity - Opportunity object (enriched with customer)
   * @param {Object} offer - Offer object or offer activity
   * @param {Object} options - PDF generation options
   * @param {string} options.template - Template style ('classic' | 'express')
   * @param {string} options.language - Language code
   * @param {boolean} options.includeTermsAndConditions - Include T&C section
   * @returns {Promise<Object>} Formatted PDF data payload
   */
  async prepareOfferData(opportunity, offer, options = {}) {
    if (!opportunity) throw new Error('Opportunity is required')
    if (!offer) throw new Error('Offer is required')
    
    // Get seller information
    const seller = await contractRepository.getSellerInfo()
    
    // Get customer (buyer) information
    const customer = customerRepository.findByIdSync(opportunity.customerId)
    if (!customer) throw new Error('Customer not found')
    
    // Get activities for trade-in and financing
    const activities = await activityRepository.findAllByOpportunityId(opportunity.id)
    const tradeInActivity = activities.find(a => a.type === 'trade-in')
    const financingActivity = activities.find(a => a.type === 'financing')
    
    // Get vehicle data from offer
    const vehicle = offer.data || offer.vehicle || offer
    
    // Format pricing
    const pricing = this.formatPricing(opportunity, offer, tradeInActivity)
    
    // Format payment terms
    const paymentTerms = this.formatPaymentTerms(financingActivity, opportunity)
    
    // Get equipment/options
    const equipment = this.getEquipment(vehicle)
    
    // Build PDF data payload
    const pdfData = {
      seller: {
        name: seller.name,
        address: seller.address,
        phone: seller.phone,
        email: seller.email,
        vatNumber: seller.vatNumber,
        registrationNumber: seller.registrationNumber,
        website: seller.website
      },
      buyer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address || '',
        company: customer.company || null
      },
      vehicle: {
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        fuelType: vehicle.fuelType,
        gearType: vehicle.gearType,
        kilometers: vehicle.kilometers || 0,
        vin: vehicle.vin || '',
        image: vehicle.image || null,
        color: vehicle.color || '',
        status: vehicle.status || 'New'
      },
      pricing: pricing,
      paymentTerms: paymentTerms,
      equipment: equipment,
      termsAndConditions: options.includeTermsAndConditions ? this.getTermsAndConditions(options.language) : null,
      contractDate: null, // Offers don't have contract date
      signatureArea: false // Offers don't have signature area
    }
    
    return pdfData
  }

  /**
   * Format pricing information with VAT and trade-in calculations
   * @param {Object} opportunity - Opportunity object
   * @param {Object} offer - Offer object (optional)
   * @param {Object} tradeInActivity - Trade-in activity (optional)
   * @returns {Object} Formatted pricing data
   */
  formatPricing(opportunity, offer = null, tradeInActivity = null) {
    // Get base price from offer or opportunity
    const basePrice = offer?.price || offer?.data?.price || opportunity.value || 0
    
    // Calculate VAT (assuming 19% for Germany, adjust as needed)
    const vatRate = 0.19
    const vatAmount = basePrice * vatRate
    const totalWithVAT = basePrice + vatAmount
    
    // Get trade-in value
    const tradeInValue = tradeInActivity?.data?.tradeInValue || tradeInActivity?.data?.value || 0
    
    // Calculate net amount after trade-in
    const netAmount = totalWithVAT - tradeInValue
    
    return {
      basePrice,
      vatRate: vatRate * 100, // Percentage
      vatAmount,
      totalWithVAT,
      tradeInValue,
      netAmount,
      currency: 'EUR'
    }
  }

  /**
   * Format payment terms from financing activity
   * @param {Object} financingActivity - Financing activity (optional)
   * @param {Object} opportunity - Opportunity object
   * @returns {Object} Formatted payment terms
   */
  formatPaymentTerms(financingActivity = null, opportunity = null) {
    if (!financingActivity || !financingActivity.data) {
      return {
        method: 'cash',
        deposit: 0,
        loanAmount: 0,
        productName: null,
        startDate: null,
        expDate: null
      }
    }
    
    const data = financingActivity.data
    
    return {
      method: 'financing',
      deposit: data.deposit || 0,
      loanAmount: data.loanAmount || data.total || 0,
      productName: data.productName || data.product || null,
      startDate: data.startDate || null,
      expDate: data.expDate || null
    }
  }

  /**
   * Extract equipment/options from vehicle
   * @param {Object} vehicle - Vehicle object
   * @returns {Array} Array of equipment/options
   */
  getEquipment(vehicle) {
    if (!vehicle) return []
    
    // Extract equipment from vehicle object
    // This may vary based on vehicle data structure
    const equipment = []
    
    if (vehicle.equipment && Array.isArray(vehicle.equipment)) {
      return vehicle.equipment
    }
    
    // If equipment is stored as object properties
    if (vehicle.options) {
      Object.entries(vehicle.options).forEach(([key, value]) => {
        if (value) {
          equipment.push({
            name: key,
            value: value
          })
        }
      })
    }
    
    return equipment
  }

  /**
   * Get terms and conditions text based on language
   * @param {string} language - Language code
   * @returns {string} Terms and conditions text
   */
  getTermsAndConditions(language = 'en') {
    // In real implementation, this would fetch from backend or i18n
    const terms = {
      en: 'Terms and conditions apply. Please refer to the full contract for detailed terms.',
      de: 'Es gelten die Allgemeinen Geschäftsbedingungen. Bitte beachten Sie den vollständigen Vertrag für detaillierte Bedingungen.',
      fr: 'Les termes et conditions s\'appliquent. Veuillez vous référer au contrat complet pour les termes détaillés.',
      it: 'Si applicano i termini e le condizioni. Si prega di fare riferimento al contratto completo per i termini dettagliati.',
      nl: 'Algemene voorwaarden zijn van toepassing. Raadpleeg het volledige contract voor gedetailleerde voorwaarden.'
    }
    
    return terms[language] || terms.en
  }

  /**
   * Generate PDF using repository
   * @param {string} template - Template name (e.g., 'contract-classic')
   * @param {string} language - Language code
   * @param {Object} data - PDF data payload
   * @returns {Promise<Object>} Generated PDF info
   */
  async generatePDF(template, language, data) {
    return await contractRepository.generatePDF({
      template,
      language,
      data
    })
  }

  /**
   * Preview PDF using repository
   * @param {string} template - Template name
   * @param {string} language - Language code
   * @param {Object} data - PDF data payload
   * @returns {Promise<Object>} Preview PDF info
   */
  async previewPDF(template, language, data) {
    return await contractRepository.previewPDF({
      template,
      language,
      data
    })
  }

  /**
   * Get available templates
   * @returns {Promise<Array>} Array of available templates
   */
  async getTemplates() {
    return await contractRepository.getTemplates()
  }

  /**
   * Send PDF by email
   * @param {string} pdfId - PDF ID
   * @param {Object} emailOptions - Email options
   * @returns {Promise<Object>} Success response
   */
  async sendPDFByEmail(pdfId, emailOptions) {
    return await contractRepository.sendPDFByEmail(pdfId, emailOptions)
  }
}

// Export singleton instance
export const contractService = new ContractService()
