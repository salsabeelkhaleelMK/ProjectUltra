import { mockCustomers } from './mockData'
import { mockLeads, mockOpportunities, mockActivities, mockCalendarEvents, mockTasks } from './mockData'

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Filter contacts (customers without company field)
const getContacts = () => {
  return mockCustomers.filter(c => !c.company || c.company === '')
}

export const fetchContacts = async (filters = {}) => {
  await delay()
  
  let results = getContacts()
  
  if (filters.search) {
    const search = filters.search.toLowerCase()
    results = results.filter(contact => 
      contact.name.toLowerCase().includes(search) ||
      contact.email.toLowerCase().includes(search)
    )
  }
  
  return { data: results, total: results.length }
}

export const fetchContactById = async (id) => {
  await delay()
  const contacts = getContacts()
  const contact = contacts.find(c => c.id === parseInt(id))
  if (!contact) throw new Error('Contact not found')
  return contact
}

export const createContact = async (contactData) => {
  await delay()
  const newContact = {
    id: mockCustomers.length + 1,
    ...contactData,
    company: null, // Ensure no company field for contacts
    createdAt: new Date().toISOString(),
    lastContact: new Date().toISOString()
  }
  mockCustomers.push(newContact)
  return newContact
}

export const updateContact = async (id, updates) => {
  await delay()
  const contacts = getContacts()
  const index = contacts.findIndex(c => c.id === parseInt(id))
  if (index === -1) throw new Error('Contact not found')
  
  const customerIndex = mockCustomers.findIndex(c => c.id === parseInt(id))
  if (customerIndex !== -1) {
    // Ensure company stays null for contacts
    mockCustomers[customerIndex] = { ...mockCustomers[customerIndex], ...updates, company: null }
  }
  
  return mockCustomers[customerIndex]
}

export const deleteContact = async (id) => {
  await delay()
  const index = mockCustomers.findIndex(c => c.id === parseInt(id))
  if (index === -1) throw new Error('Contact not found')
  
  mockCustomers.splice(index, 1)
  return { success: true }
}

export const addRequestedCarToContact = async (contactId, carData) => {
  await delay()
  const contacts = getContacts()
  const contact = contacts.find(c => c.id === parseInt(contactId))
  if (!contact) throw new Error('Contact not found')
  
  // Find in mockCustomers and update
  const customerIndex = mockCustomers.findIndex(c => c.id === parseInt(contactId))
  if (customerIndex === -1) throw new Error('Contact not found')
  
  // Set the requested car (replacing any existing one)
  mockCustomers[customerIndex].requestedCar = {
    ...carData,
    id: Date.now()
  }
  
  return { ...mockCustomers[customerIndex] }
}

// Convert contact to lead
export const convertContactToLead = async (contactId) => {
  await delay()
  const contacts = getContacts()
  const contact = contacts.find(c => c.id === parseInt(contactId))
  if (!contact) throw new Error('Contact not found')
  if (!contact.requestedCar) throw new Error('Contact must have requested car')
  
  // Import leads API
  const { createLead } = await import('./leads.js')
  
  const newLead = await createLead({
    customerId: contact.id,
    requestedCar: contact.requestedCar,
    source: contact.source || 'Direct',
    tags: contact.tags || [],
    stage: 'Open Lead',
    status: 'Open',
    priority: 'Normal'
  })
  
  return newLead
}

// Convert contact to opportunity
export const convertContactToOpportunity = async (contactId) => {
  await delay()
  const contacts = getContacts()
  const contact = contacts.find(c => c.id === parseInt(contactId))
  if (!contact) throw new Error('Contact not found')
  if (!contact.requestedCar) throw new Error('Contact must have requested car')
  
  // Import opportunities API
  const { createOpportunity } = await import('./opportunities.js')
  
  const newOpp = await createOpportunity({
    customerId: contact.id,
    vehicle: contact.requestedCar, // Opportunity uses 'vehicle' not 'requestedCar'
    source: contact.source || 'Direct',
    tags: contact.tags || [],
    stage: 'Qualified',
    value: contact.requestedCar.price || 0
  })
  
  return newOpp
}

// Fetch all leads associated with a customer
export const fetchLeadsByCustomerId = async (customerId) => {
  await delay()
  // Match by customerId (leads now have customerId field)
  const leads = mockLeads.filter(lead => lead.customerId === parseInt(customerId))
  return { data: leads, total: leads.length }
}

// Fetch all opportunities associated with a customer
export const fetchOpportunitiesByCustomerId = async (customerId) => {
  await delay()
  // Match by customerId (opportunities now have customerId field)
  const opportunities = mockOpportunities.filter(opp => opp.customerId === parseInt(customerId))
  return { data: opportunities, total: opportunities.length }
}

// Fetch all cars associated with a customer (requested, offered, drove, purchased)
export const fetchCustomerCars = async (customerId) => {
  await delay()
  const cars = []
  
  // Get customer from mockCustomers
  const customer = mockCustomers.find(c => c.id === parseInt(customerId))
  const contactId = customer?.id || customerId
  
  // 1. Requested cars - from leads/contacts requestedCar field
  const leads = mockLeads.filter(lead => lead.customerId === parseInt(customerId))
  leads.forEach(lead => {
    if (lead.requestedCar) {
      cars.push({
        ...lead.requestedCar,
        id: `requested-${lead.id}`,
        type: 'requested',
        leadId: lead.id,
        leadStage: lead.stage
      })
    }
  })
  
  // Also check customer's requestedCar
  if (customer?.requestedCar) {
    cars.push({
      ...customer.requestedCar,
      id: `requested-contact-${customer.id}`,
      type: 'requested',
      contactId: customer.id
    })
  }
  
  // 2. Offered cars - from offer activities in opportunities
  const opportunities = mockOpportunities.filter(opp => opp.customerId === parseInt(customerId))
  opportunities.forEach(opp => {
    const offerActivities = mockActivities.filter(
      activity => activity.opportunityId === opp.id && activity.type === 'offer'
    )
    offerActivities.forEach(activity => {
      if (activity.data?.vehicle) {
        cars.push({
          ...activity.data.vehicle,
          id: `offered-${activity.id}`,
          type: 'offered',
          opportunityId: opp.id,
          opportunityStage: opp.stage,
          offerDate: activity.timestamp
        })
      }
    })
  })
  
  // 3. Drove cars - from calendar events with type 'test-drive'
  const testDriveEvents = mockCalendarEvents.filter(
    event => event.customerId === parseInt(customerId) && event.type === 'test-drive'
  )
  testDriveEvents.forEach(event => {
    if (event.vehicle) {
      cars.push({
        brand: event.vehicle.split(' ')[0] || '',
        model: event.vehicle.split(' ').slice(1).join(' ') || '',
        id: `drove-${event.id}`,
        type: 'drove',
        eventId: event.id,
        testDriveDate: event.start,
        vehicle: event.vehicle
      })
    }
  })
  
  // 4. Purchased cars - from opportunities with stage 'Closed Won'
  opportunities.forEach(opp => {
    if (opp.stage === 'Closed Won' && opp.vehicle) {
      cars.push({
        ...opp.vehicle,
        id: `purchased-${opp.id}`,
        type: 'purchased',
        opportunityId: opp.id,
        purchaseDate: opp.contractDate || opp.lastActivity
      })
    }
  })
  
  // 5. Owned vehicles - from customer's vehicles array
  if (customer?.vehicles && Array.isArray(customer.vehicles)) {
    customer.vehicles.forEach(vehicle => {
      if (vehicle.type === 'owned') {
        cars.push({
          ...vehicle,
          id: vehicle.id || `owned-${customer.id}-${Date.now()}`,
          type: 'owned',
          customerId: customer.id
        })
      }
    })
  }
  
  return { data: cars, total: cars.length }
}

// Add vehicle to customer
export const addVehicleToCustomer = async (customerId, vehicleData) => {
  await delay()
  const customerIndex = mockCustomers.findIndex(c => c.id === parseInt(customerId))
  if (customerIndex === -1) throw new Error('Customer not found')
  
  const customer = mockCustomers[customerIndex]
  
  // Initialize vehicles array if it doesn't exist
  if (!customer.vehicles) {
    customer.vehicles = []
  }
  
  // Create vehicle object with ID
  const vehicle = {
    ...vehicleData,
    id: vehicleData.id || Date.now()
  }
  
  // Handle different vehicle types
  if (vehicleData.type === 'requested') {
    // For requested type, also update requestedCar field for backward compatibility
    customer.requestedCar = {
      brand: vehicleData.brand,
      model: vehicleData.model,
      year: vehicleData.year,
      price: vehicleData.price,
      requestType: vehicleData.requestType,
      requestMessage: vehicleData.requestMessage,
      image: vehicleData.image,
      dealership: vehicleData.dealership,
      fuelType: vehicleData.fuelType,
      gearType: vehicleData.gearType,
      kilometers: vehicleData.kilometers,
      id: vehicle.id
    }
  }
  
  // Add vehicle to vehicles array
  customer.vehicles.push(vehicle)
  
  // Update customer in mockCustomers
  mockCustomers[customerIndex] = customer
  
  return { ...customer }
}

// Fetch all tasks associated with a customer
export const fetchTasksByCustomerId = async (customerId) => {
  await delay()
  const tasks = mockTasks.filter(task => task.customerId === parseInt(customerId))
  return { data: tasks, total: tasks.length }
}

// Fetch all tasks associated with a lead
export const fetchTasksByLeadId = async (leadId) => {
  await delay()
  const tasks = mockTasks.filter(task => task.leadId === parseInt(leadId))
  return { data: tasks, total: tasks.length }
}// Fetch all tasks associated with an opportunity
export const fetchTasksByOpportunityId = async (opportunityId) => {
  await delay()
  const tasks = mockTasks.filter(task => task.opportunityId === parseInt(opportunityId))
  return { data: tasks, total: tasks.length }
}
