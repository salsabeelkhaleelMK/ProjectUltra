import { mockOpportunities, mockActivities, mockCalendarEvents } from './mockData'

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

export const fetchOpportunities = async (filters = {}) => {
  await delay()
  
  let results = [...mockOpportunities]
  
  if (filters.stage) {
    results = results.filter(opp => opp.stage === filters.stage)
  }
  if (filters.assignee) {
    results = results.filter(opp => opp.assignee === filters.assignee)
  }
  if (filters.search) {
    const search = filters.search.toLowerCase()
    results = results.filter(opp => 
      opp.customer.name.toLowerCase().includes(search) ||
      opp.vehicle.brand.toLowerCase().includes(search) ||
      opp.vehicle.model.toLowerCase().includes(search)
    )
  }
  
  return { data: results, total: results.length }
}

export const fetchOpportunityById = async (id) => {
  await delay()
  const opportunity = mockOpportunities.find(o => o.id === parseInt(id))
  if (!opportunity) throw new Error('Opportunity not found')
  return opportunity
}

export const fetchOpportunityActivities = async (opportunityId) => {
  await delay()
  return mockActivities.filter(activity => activity.opportunityId === parseInt(opportunityId))
}

export const fetchAppointmentByCustomerId = async (customerId) => {
  await delay()
  // Find the most recent confirmed appointment for this customer
  const appointments = mockCalendarEvents
    .filter(event => 
      event.customerId === parseInt(customerId) && 
      (event.type === 'appointment' || event.type === 'test-drive' || event.type === 'meeting') &&
      event.status === 'confirmed'
    )
    .sort((a, b) => new Date(b.start) - new Date(a.start))
  
  return appointments.length > 0 ? appointments[0] : null
}

export const createOpportunity = async (opportunityData) => {
  await delay()
  const newOpportunity = {
    id: mockOpportunities.length + 1,
    ...opportunityData,
    createdAt: new Date().toISOString()
  }
  mockOpportunities.push(newOpportunity)
  return newOpportunity
}

export const updateOpportunity = async (id, updates) => {
  await delay()
  const index = mockOpportunities.findIndex(o => o.id === parseInt(id))
  if (index === -1) throw new Error('Opportunity not found')
  
  mockOpportunities[index] = { ...mockOpportunities[index], ...updates }
  return mockOpportunities[index]
}

export const deleteOpportunity = async (id) => {
  await delay()
  const index = mockOpportunities.findIndex(o => o.id === parseInt(id))
  if (index === -1) throw new Error('Opportunity not found')
  
  mockOpportunities.splice(index, 1)
  return { success: true }
}
