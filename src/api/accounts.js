import { mockCustomers } from './mockData'

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Filter accounts (customers with company field)
const getAccounts = () => {
  return mockCustomers.filter(c => c.company && c.company !== '')
}

export const fetchAccounts = async (filters = {}) => {
  await delay()
  
  let results = getAccounts()
  
  if (filters.search) {
    const search = filters.search.toLowerCase()
    results = results.filter(account => 
      account.name.toLowerCase().includes(search) ||
      account.email.toLowerCase().includes(search) ||
      account.company?.toLowerCase().includes(search)
    )
  }
  
  return { data: results, total: results.length }
}

export const fetchAccountById = async (id) => {
  await delay()
  const accounts = getAccounts()
  const account = accounts.find(a => a.id === parseInt(id))
  if (!account) throw new Error('Account not found')
  return account
}

export const createAccount = async (accountData) => {
  await delay()
  const newAccount = {
    id: mockCustomers.length + 1,
    ...accountData,
    createdAt: new Date().toISOString(),
    lastContact: new Date().toISOString()
  }
  mockCustomers.push(newAccount)
  return newAccount
}

export const updateAccount = async (id, updates) => {
  await delay()
  const accounts = getAccounts()
  const index = accounts.findIndex(a => a.id === parseInt(id))
  if (index === -1) throw new Error('Account not found')
  
  const customerIndex = mockCustomers.findIndex(c => c.id === parseInt(id))
  if (customerIndex !== -1) {
    mockCustomers[customerIndex] = { ...mockCustomers[customerIndex], ...updates }
  }
  
  return mockCustomers[customerIndex]
}

export const deleteAccount = async (id) => {
  await delay()
  const index = mockCustomers.findIndex(c => c.id === parseInt(id))
  if (index === -1) throw new Error('Account not found')
  
  mockCustomers.splice(index, 1)
  return { success: true }
}

