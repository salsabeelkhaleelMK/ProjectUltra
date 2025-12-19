import { mockLeads, mockActivities } from './mockData'

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

export const fetchLeads = async (filters = {}) => {
  await delay()
  
  let results = [...mockLeads]
  
  // Apply filters
  if (filters.status) {
    results = results.filter(lead => lead.status === filters.status)
  }
  if (filters.priority) {
    results = results.filter(lead => lead.priority === filters.priority)
  }
  if (filters.assignee) {
    results = results.filter(lead => lead.assignee === filters.assignee)
  }
  if (filters.search) {
    const search = filters.search.toLowerCase()
    results = results.filter(lead => 
      lead.customer.name.toLowerCase().includes(search) ||
      lead.requestedCar.brand.toLowerCase().includes(search) ||
      lead.requestedCar.model.toLowerCase().includes(search)
    )
  }
  
  return { data: results, total: results.length }
}

export const fetchLeadById = async (id) => {
  await delay()
  const lead = mockLeads.find(l => l.id === parseInt(id))
  if (!lead) throw new Error('Lead not found')
  return lead
}

export const fetchLeadActivities = async (leadId) => {
  await delay()
  return mockActivities.filter(activity => activity.leadId === parseInt(leadId))
}

export const createLead = async (leadData) => {
  await delay()
  const newLead = {
    id: mockLeads.length + 1,
    ...leadData,
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString()
  }
  mockLeads.push(newLead)
  return newLead
}

export const updateLead = async (id, updates) => {
  await delay()
  const index = mockLeads.findIndex(l => l.id === parseInt(id))
  if (index === -1) throw new Error('Lead not found')
  
  mockLeads[index] = { ...mockLeads[index], ...updates, lastActivity: new Date().toISOString() }
  return mockLeads[index]
}

export const deleteLead = async (id) => {
  await delay()
  const index = mockLeads.findIndex(l => l.id === parseInt(id))
  if (index === -1) throw new Error('Lead not found')
  
  mockLeads.splice(index, 1)
  return { success: true }
}

export const addLeadActivity = async (leadId, activity) => {
  await delay()
  const newActivity = {
    id: mockActivities.length + 1,
    leadId: parseInt(leadId),
    timestamp: new Date().toISOString(),
    ...activity
  }
  mockActivities.push(newActivity)
  return newActivity
}

export const updateLeadActivity = async (leadId, activityId, updates) => {
  await delay()
  const activity = mockActivities.find(a => a.id === parseInt(activityId) && a.leadId === parseInt(leadId))
  if (!activity) throw new Error('Activity not found')
  
  Object.assign(activity, updates, { timestamp: new Date().toISOString() })
  return activity
}

export const deleteLeadActivity = async (leadId, activityId) => {
  await delay()
  const index = mockActivities.findIndex(a => a.id === parseInt(activityId) && a.leadId === parseInt(leadId))
  if (index === -1) throw new Error('Activity not found')
  
  mockActivities.splice(index, 1)
  return { success: true }
}

// Conversion helpers
export const generateLeadId = () => {
  return mockLeads.length > 0 ? Math.max(...mockLeads.map(l => l.id)) + 1 : 1
}

export const createLeadFromOpportunity = async (opportunityData, activities) => {
  await delay()
  
  const newLead = {
    id: generateLeadId(),
    customer: opportunityData.customer,
    status: 'Open',
    priority: 'Normal',
    requestedCar: opportunityData.requestedCar,
    carStatus: opportunityData.requestedCar?.stockDays !== null && opportunityData.requestedCar?.stockDays !== undefined ? 'In Stock' : 'Not available',
    requestType: 'Generic Sales',
    source: opportunityData.source || 'Marketing',
    fiscalEntity: opportunityData.fiscalEntity || '',
    sourceDetails: opportunityData.sourceDetails || '',
    assignee: opportunityData.assignee || 'Michael Thomas',
    assigneeInitials: opportunityData.assigneeInitials || 'MT',
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    nextActionDue: '1h',
    tags: opportunityData.tags || [],
    stage: 'Open Lead',
    isDisqualified: false,
    disqualifyReason: null
  }
  
  mockLeads.unshift(newLead)
  
  // Migrate activities
  for (const activity of activities) {
    const newActivity = {
      id: mockActivities.length + 1,
      leadId: newLead.id,
      opportunityId: undefined, // Remove opportunity reference
      timestamp: activity.timestamp,
      type: activity.type,
      user: activity.user,
      action: activity.action,
      content: activity.content,
      data: activity.data
    }
    mockActivities.push(newActivity)
  }
  
  return newLead
}
