import { mockLeads, mockActivities, mockCalendarEvents, mockUsers } from './mockData'

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// ID generation helpers
export const generateLeadId = () => {
  return mockLeads.length > 0 ? Math.max(...mockLeads.map(l => l.id)) + 1 : 1
}

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
    id: generateLeadId(),
    ...leadData,
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    nextActionDue: leadData.nextActionDue || null,
    tags: leadData.tags || []
  }
  mockLeads.push(newLead)
  return newLead
}

export const createLeadFromContact = async (contactId, carData) => {
  await delay()
  const { mockContacts } = await import('./mockData')
  const contact = mockContacts.find(c => c.id === parseInt(contactId))
  if (!contact) throw new Error('Contact not found')
  
  const newLead = {
    id: generateLeadId(),
    customer: {
      id: contact.id,
      name: contact.name,
      initials: contact.initials,
      email: contact.email,
      phone: contact.phone,
      address: contact.address || ''
    },
    requestedCar: carData,
    status: 'Open',
    stage: 'Open Lead',
    priority: 'Normal',
    source: carData.source || 'Direct',
    assignee: null,
    assigneeInitials: '',
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    nextActionDue: null,
    tags: [],
    isDisqualified: false,
    disqualifyReason: null,
    scheduledAppointment: null,
    contactAttempts: []
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

// Schedule follow-up appointment for lead
export const scheduleLeadFollowUp = async (leadId, appointmentData) => {
  await delay()
  const lead = mockLeads.find(l => l.id === parseInt(leadId))
  if (!lead) throw new Error('Lead not found')
  
  // Create calendar event
  const eventId = mockCalendarEvents.length > 0 ? Math.max(...mockCalendarEvents.map(e => e.id)) + 1 : 1
  const appointmentStart = new Date(appointmentData.dateTime)
  const appointmentEnd = new Date(appointmentStart.getTime() + 30 * 60000) // +30 minutes
  
  const calendarEvent = {
    id: eventId,
    title: `Follow-up Call - ${lead.customer.name}`,
    start: appointmentStart.toISOString(),
    end: appointmentEnd.toISOString(),
    type: 'call',
    customer: lead.customer.name,
    customerId: lead.customer.id,
    leadId: lead.id,
    opportunityId: null,
    assignee: appointmentData.assignee || lead.assignee,
    assigneeId: appointmentData.assigneeId || null,
    assigneeType: appointmentData.assigneeType || 'user',
    teamId: appointmentData.teamId || null,
    team: appointmentData.team || 'BDC',
    dealership: lead.fiscalEntity || 'Main',
    status: 'scheduled'
  }
  
  mockCalendarEvents.push(calendarEvent)
  
  // Update lead with appointment reference and due date
  lead.scheduledAppointment = calendarEvent
  lead.nextActionDue = appointmentStart.toISOString()
  lead.lastActivity = new Date().toISOString()
  
  return calendarEvent
}

// Conversion helpers
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

// Detect urgent leads that need qualification
export const detectUrgentLeads = async (userId) => {
  await delay()
  
  const user = mockUsers.find(u => u.id === userId)
  if (!user) return []
  
  const questions = []
  const now = new Date()
  const THRESHOLD_DAYS = 7
  
  // Get all leads assigned to this user
  const userLeads = mockLeads.filter(lead => {
    const userByName = mockUsers.find(u => u.name === lead.assignee)
    return userByName && userByName.id === userId
  })
  
  // Find leads in "Open Lead" stage for 7-14 days without conversion (urgent window)
  for (const lead of userLeads) {
    // Check if lead is in Open Lead stage
    if (lead.stage !== 'Open Lead') continue
    
    // Check if lead is disqualified
    if (lead.isDisqualified) continue
    
    // Calculate days since creation
    const createdDate = new Date(lead.createdAt)
    const daysSinceCreation = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24))
    
    // Only show if 7-14 days old (urgent actionable window)
    if (daysSinceCreation >= THRESHOLD_DAYS && daysSinceCreation <= 14) {
      questions.push({
        id: `lead-qualification-urgency-${lead.id}`,
        type: 'lead-qualification-urgency',
        priority: 1, // Critical
        question: `This lead from ${lead.customer.name} has been in the system for ${daysSinceCreation} days without qualification. Have you been able to contact them?`,
        customer: lead.customer,
        leadId: lead.id,
        lead: lead,
        createdAt: lead.createdAt,
        daysOld: daysSinceCreation
      })
    }
  }
  
  return questions
}

export const fetchTasksDueToday = async () => {
  await delay()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  return mockLeads.filter(lead => {
    if (!lead.nextActionDue) return false
    const dueDate = new Date(lead.nextActionDue)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate >= today && dueDate < tomorrow && !lead.isDisqualified
  })
}

export const fetchTasksDueUpcoming = async (days = 7) => {
  await delay()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const endDate = new Date(today)
  endDate.setDate(endDate.getDate() + days)
  
  return mockLeads.filter(lead => {
    if (!lead.nextActionDue) return false
    const dueDate = new Date(lead.nextActionDue)
    return dueDate >= today && dueDate < endDate && !lead.isDisqualified
  })
}
