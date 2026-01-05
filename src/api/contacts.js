import { mockContacts } from './mockData'

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

export const fetchContacts = async (filters = {}) => {
  await delay()
  
  let results = [...mockContacts]
  
  if (filters.search) {
    const search = filters.search.toLowerCase()
    results = results.filter(contact => 
      contact.name.toLowerCase().includes(search) ||
      contact.email.toLowerCase().includes(search) ||
      contact.company?.toLowerCase().includes(search)
    )
  }
  
  return { data: results, total: results.length }
}

export const fetchContactById = async (id) => {
  await delay()
  const contact = mockContacts.find(c => c.id === parseInt(id))
  if (!contact) throw new Error('Contact not found')
  return contact
}

export const createContact = async (contactData) => {
  await delay()
  const newContact = {
    id: mockContacts.length + 1,
    ...contactData,
    createdAt: new Date().toISOString()
  }
  mockContacts.push(newContact)
  return newContact
}

export const updateContact = async (id, updates) => {
  await delay()
  const index = mockContacts.findIndex(c => c.id === parseInt(id))
  if (index === -1) throw new Error('Contact not found')
  
  mockContacts[index] = { ...mockContacts[index], ...updates }
  return mockContacts[index]
}

export const deleteContact = async (id) => {
  await delay()
  const index = mockContacts.findIndex(c => c.id === parseInt(id))
  if (index === -1) throw new Error('Contact not found')
  
  mockContacts.splice(index, 1)
  return { success: true }
}

export const addRequestedCarToContact = async (contactId, carData) => {
  await delay()
  const contact = mockContacts.find(c => c.id === parseInt(contactId))
  if (!contact) throw new Error('Contact not found')
  
  // Set the requested car (replacing any existing one)
  contact.requestedCar = {
    ...carData,
    id: Date.now()
  }
  
  return { ...contact }
}

// Convert contact to lead
export const convertContactToLead = async (contactId) => {
  await delay()
  const contact = mockContacts.find(c => c.id === parseInt(contactId))
  if (!contact) throw new Error('Contact not found')
  if (!contact.requestedCar) throw new Error('Contact must have requested car')
  
  // Import leads API
  const { createLead } = await import('./leads.js')
  
  const newLead = await createLead({
    customer: {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      address: contact.address || '',
      initials: contact.initials
    },
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
  const contact = mockContacts.find(c => c.id === parseInt(contactId))
  if (!contact) throw new Error('Contact not found')
  if (!contact.requestedCar) throw new Error('Contact must have requested car')
  
  // Import opportunities API
  const { createOpportunity } = await import('./opportunities.js')
  
  const newOpp = await createOpportunity({
    customer: {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      address: contact.address || '',
      initials: contact.initials
    },
    vehicle: contact.requestedCar, // Opportunity uses 'vehicle' not 'requestedCar'
    source: contact.source || 'Direct',
    tags: contact.tags || [],
    stage: 'Qualified',
    value: contact.requestedCar.price || 0
  })
  
  return newOpp
}
