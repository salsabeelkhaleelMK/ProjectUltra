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

export const addOpportunityActivity = async (opportunityId, activity) => {
  await delay()
  const newActivity = {
    id: mockActivities.length + 1,
    opportunityId: parseInt(opportunityId),
    timestamp: new Date().toISOString(),
    ...activity
  }
  mockActivities.push(newActivity)
  return newActivity
}

export const updateOpportunityActivity = async (opportunityId, activityId, updates) => {
  await delay()
  const activity = mockActivities.find(a => a.id === parseInt(activityId) && a.opportunityId === parseInt(opportunityId))
  if (!activity) throw new Error('Activity not found')
  
  Object.assign(activity, updates, { timestamp: new Date().toISOString() })
  return activity
}

export const deleteOpportunityActivity = async (opportunityId, activityId) => {
  await delay()
  const index = mockActivities.findIndex(a => a.id === parseInt(activityId) && a.opportunityId === parseInt(opportunityId))
  if (index === -1) throw new Error('Activity not found')
  
  mockActivities.splice(index, 1)
  return { success: true }
}

// Conversion helpers
export const generateOpportunityId = () => {
  return mockOpportunities.length > 0 ? Math.max(...mockOpportunities.map(o => o.id)) + 1 : 1
}

export const createOpportunityFromLead = async (leadData, activities) => {
  await delay()
  
  const newOpportunity = {
    id: generateOpportunityId(),
    customer: leadData.customer,
    requestedCar: leadData.requestedCar,
    vehicle: { ...leadData.requestedCar }, // Copy requestedCar to vehicle
    stage: 'Qualified',
    tags: leadData.tags || [],
    probability: 50,
    value: leadData.requestedCar?.price || 0,
    expectedCloseDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
    assignee: leadData.assignee || 'Michael Thomas',
    source: leadData.source || 'Marketing',
    fiscalEntity: leadData.fiscalEntity || '',
    sourceDetails: leadData.sourceDetails || '',
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString()
  }
  
  mockOpportunities.unshift(newOpportunity)
  
  // Migrate activities
  for (const activity of activities) {
    const newActivity = {
      id: mockActivities.length + 1,
      opportunityId: newOpportunity.id,
      leadId: undefined, // Remove lead reference
      timestamp: activity.timestamp,
      type: activity.type,
      user: activity.user,
      action: activity.action,
      content: activity.content,
      data: activity.data
    }
    mockActivities.push(newActivity)
  }
  
  return newOpportunity
}
