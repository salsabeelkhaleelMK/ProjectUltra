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
