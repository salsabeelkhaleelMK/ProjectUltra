import { mockCustomers } from './mockData'

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

export const fetchCustomers = async (filters = {}) => {
  await delay()
  
  let results = [...mockCustomers]
  
  if (filters.search) {
    const search = filters.search.toLowerCase()
    results = results.filter(customer => 
      customer.name.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      customer.company?.toLowerCase().includes(search)
    )
  }
  
  return { data: results, total: results.length }
}

export const fetchCustomerById = async (id) => {
  await delay()
  const customer = mockCustomers.find(c => c.id === parseInt(id))
  if (!customer) throw new Error('Customer not found')
  return customer
}

export const createCustomer = async (customerData) => {
  await delay()
  const newCustomer = {
    id: mockCustomers.length + 1,
    ...customerData,
    createdAt: new Date().toISOString(),
    lastContact: new Date().toISOString()
  }
  mockCustomers.push(newCustomer)
  return newCustomer
}

export const updateCustomer = async (id, updates) => {
  await delay()
  const index = mockCustomers.findIndex(c => c.id === parseInt(id))
  if (index === -1) throw new Error('Customer not found')
  
  mockCustomers[index] = { ...mockCustomers[index], ...updates }
  return mockCustomers[index]
}

export const deleteCustomer = async (id) => {
  await delay()
  const index = mockCustomers.findIndex(c => c.id === parseInt(id))
  if (index === -1) throw new Error('Customer not found')
  
  mockCustomers.splice(index, 1)
  return { success: true }
}

