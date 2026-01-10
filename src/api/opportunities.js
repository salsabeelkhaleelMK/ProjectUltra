import { mockOpportunities, mockActivities, mockCalendarEvents, mockUsers, mockCustomers } from './mockData'
import { getDisplayStage, getDeliverySubstatus } from '@/utils/stageMapper'

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Enrich opportunity with customer data from mockCustomers
function enrichOpportunityWithCustomer(opportunity) {
  if (!opportunity) return null
  
  const customer = mockCustomers.find(c => c.id === opportunity.customerId)
  if (!customer) {
    // Fallback if customer not found
    return {
      ...opportunity,
      customer: {
        id: opportunity.customerId,
        name: 'Unknown Customer',
        initials: '??',
        email: '',
        phone: '',
        address: ''
      }
    }
  }
  
  return {
    ...opportunity,
    customer: {
      id: customer.id,
      name: customer.name,
      initials: customer.initials,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    }
  }
}

// Enrich opportunity with display stage, delivery substatus, and customer data
function enrichOpportunityWithStage(opportunity) {
  if (!opportunity) return null
  
  const oppWithCustomer = enrichOpportunityWithCustomer(opportunity)
  const activities = mockActivities.filter(a => a.opportunityId === opportunity.id)
  const displayStage = getDisplayStage({ ...oppWithCustomer, apiStatus: opportunity.stage, activities }, 'opportunity')
  
  // Calculate delivery substatus only for Closed Won opportunities
  const deliverySubstatus = displayStage === 'Closed Won' 
    ? getDeliverySubstatus({ ...oppWithCustomer, displayStage }, activities)
    : null
  
  return {
    ...oppWithCustomer,
    apiStatus: opportunity.stage,
    displayStage,
    deliverySubstatus,
    activities // Include activities for stage calculation
  }
}

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
    results = results.filter(opp => {
      const customer = mockCustomers.find(c => c.id === opp.customerId)
      const customerName = customer?.name || ''
      return customerName.toLowerCase().includes(search) ||
        (opp.vehicle && opp.vehicle.brand && opp.vehicle.brand.toLowerCase().includes(search)) ||
        (opp.vehicle && opp.vehicle.model && opp.vehicle.model.toLowerCase().includes(search))
    })
  }
  
  // Enrich with display stages
  const enrichedResults = results.map(enrichOpportunityWithStage)
  
  return { data: enrichedResults, total: enrichedResults.length }
}

export const fetchOpportunityById = async (id) => {
  await delay()
  const opportunity = mockOpportunities.find(o => o.id === parseInt(id))
  if (!opportunity) throw new Error('Opportunity not found')
  return enrichOpportunityWithStage(opportunity)
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
    customerId: opportunityData.customerId,
    requestedCar: opportunityData.requestedCar || null,
    vehicle: opportunityData.vehicle || opportunityData.requestedCar || null,
    selectedVehicle: opportunityData.selectedVehicle || null,
    stage: opportunityData.stage || 'Qualified',
    tags: opportunityData.tags || [],
    value: opportunityData.value || 0,
    expectedCloseDate: opportunityData.expectedCloseDate || null,
    assignee: opportunityData.assignee || null,
    source: opportunityData.source || 'Direct',
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    scheduledAppointment: opportunityData.scheduledAppointment || null,
    contractDate: opportunityData.contractDate || null
  }
  mockOpportunities.push(newOpportunity)
  return enrichOpportunityWithStage(newOpportunity)
}

export const createOpportunityFromContact = async (contactId, carData) => {
  await delay()
  const { mockContacts } = await import('./mockData')
  const contact = mockContacts.find(c => c.id === parseInt(contactId))
  if (!contact) throw new Error('Contact not found')
  
  const newOpportunity = {
    id: mockOpportunities.length + 1,
    customerId: contact.customerId,
    vehicle: carData,
    requestedCar: carData,
    stage: 'Qualified',
    priority: 'Normal',
    source: carData.source || 'Direct',
    assignee: null,
    assigneeInitials: '',
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    expectedCloseDate: null,
    tags: [],
    value: carData.price || 0
  }
  
  mockOpportunities.push(newOpportunity)
  return enrichOpportunityWithStage(newOpportunity)
}

export const updateOpportunity = async (id, updates) => {
  await delay()
  const index = mockOpportunities.findIndex(o => o.id === parseInt(id))
  if (index === -1) throw new Error('Opportunity not found')
  
  // Remove displayStage from updates (it's calculated, not stored)
  const { displayStage, ...updatesToStore } = updates
  
  mockOpportunities[index] = { ...mockOpportunities[index], ...updatesToStore }
  return enrichOpportunityWithStage(mockOpportunities[index])
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

// Add vehicle to opportunity (without creating offer or transitioning stage)
export const addVehicleToOpportunity = async (opportunityId, vehicleData) => {
  await delay()
  const opportunity = mockOpportunities.find(o => o.id === parseInt(opportunityId))
  if (!opportunity) throw new Error('Opportunity not found')
  
  // Store the selected vehicle
  opportunity.selectedVehicle = {
    ...vehicleData.vehicle,
    selectionType: vehicleData.type // 'requested', 'stock', 'recommended', 'custom'
  }
  
  // Update last activity timestamp
  opportunity.lastActivity = new Date().toISOString()
  
  // Add activity to track vehicle selection
  const activity = await addOpportunityActivity(opportunityId, {
    type: 'note',
    user: 'You',
    action: 'selected a vehicle',
    content: `Selected ${vehicleData.vehicle.brand} ${vehicleData.vehicle.model} (${vehicleData.vehicle.year}) for this opportunity`
  })
  
  return opportunity
}

// Create offer for opportunity (triggers stage transition to "In Negotiation")
export const createOfferForOpportunity = async (opportunityId, offerData) => {
  await delay()
  const opportunity = mockOpportunities.find(o => o.id === parseInt(opportunityId))
  if (!opportunity) throw new Error('Opportunity not found')
  
  // Create offer activity
  const offerActivity = await addOpportunityActivity(opportunityId, {
    type: 'offer',
    user: 'You',
    action: 'created an offer',
    data: offerData.data
  })
  
  // Transition stage from "Qualified" to "In Negotiation" when offer is created
  if (opportunity.stage === 'Qualified') {
    opportunity.stage = 'In Negotiation'
  }
  
  // Update last activity timestamp
  opportunity.lastActivity = new Date().toISOString()
  
  return { opportunity, activity: offerActivity }
}

// Conversion helpers
export const generateOpportunityId = () => {
  return mockOpportunities.length > 0 ? Math.max(...mockOpportunities.map(o => o.id)) + 1 : 1
}

export const createOpportunityFromLead = async (leadData, activities, options = {}) => {
  await delay()
  
  // Get assignee name from options if provided
  let assigneeName = leadData.assignee || 'Michael Thomas'
  if (options.assigneeId) {
    const assigneeUser = mockUsers.find(u => u.id === options.assigneeId)
    if (assigneeUser) {
      assigneeName = assigneeUser.name
    }
  }
  
  const newOpportunity = {
    id: generateOpportunityId(),
    customerId: leadData.customerId,
    requestedCar: leadData.requestedCar,
    vehicle: { ...leadData.requestedCar }, // Copy requestedCar to vehicle
    stage: 'Qualified',
    tags: leadData.tags || [],
    value: leadData.requestedCar?.price || 0,
    expectedCloseDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
    assignee: assigneeName,
    assigneeId: options.assigneeId || null,
    source: leadData.source || 'Marketing',
    fiscalEntity: leadData.fiscalEntity || '',
    sourceDetails: leadData.sourceDetails || '',
    customerPreferences: options.preferences || null, // Store customer preferences from call
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
  
  return enrichOpportunityWithStage(newOpportunity)
}

// Detect stuck opportunities (inactive for 7+ days)
export const detectStuckOpportunities = async (userId) => {
  await delay()
  
  const user = mockUsers.find(u => u.id === userId)
  if (!user) return []
  
  const questions = []
  const now = new Date()
  const THRESHOLD_DAYS = 7
  
  // Get all opportunities assigned to this user
  const userOpportunities = mockOpportunities.filter(opp => {
    const userByName = mockUsers.find(u => u.name === opp.assignee)
    return userByName && userByName.id === userId
  })
  
  for (const opp of userOpportunities) {
    // Only check Qualified or In Negotiation stages
    if (opp.stage !== 'Qualified' && opp.stage !== 'In Negotiation') continue
    
    // Calculate days since last activity
    const lastActivityDate = new Date(opp.lastActivity)
    const daysSinceActivity = Math.floor((now - lastActivityDate) / (1000 * 60 * 60 * 24))
    
    // Only show if 7-14 days inactive (urgent but not too old)
    if (daysSinceActivity < THRESHOLD_DAYS || daysSinceActivity > 14) continue
    
    // Check if there's a future appointment
    if (opp.scheduledAppointment) {
      const appointmentDate = new Date(opp.scheduledAppointment.start)
      if (appointmentDate > now) continue // Has future appointment
    }
    
    // Check for recent offers (last 7 days)
    const hasRecentOffers = mockActivities.some(activity => {
      if (activity.opportunityId !== opp.id || activity.type !== 'offer') return false
      const activityDate = new Date(activity.timestamp)
      const daysAgo = Math.floor((now - activityDate) / (1000 * 60 * 60 * 24))
      return daysAgo < THRESHOLD_DAYS
    })
    
    if (hasRecentOffers) continue
    
    // This opportunity is stuck
    const enrichedOpp = enrichOpportunityWithCustomer(opp)
    questions.push({
      id: `stuck-opportunity-${opp.id}`,
      type: 'stuck-opportunity',
      priority: 1, // Critical
      question: `This opportunity with ${enrichedOpp.customer.name} has been inactive for ${daysSinceActivity} days. Are they still interested in purchasing?`,
      customer: enrichedOpp.customer,
      opportunityId: opp.id,
      opportunity: enrichedOpp,
      createdAt: opp.lastActivity,
      daysInactive: daysSinceActivity
    })
  }
  
  return questions
}

// Actionable Questions Detection
export const fetchActionableQuestions = async (userId, userRole) => {
  await delay()
  
  const user = mockUsers.find(u => u.id === userId)
  if (!user) return []
  
  const questions = []
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)
  
  // Get all opportunities assigned to this user
  const userOpportunities = mockOpportunities.filter(opp => {
    const userByName = mockUsers.find(u => u.name === opp.assignee)
    return userByName && userByName.id === userId
  })
  
  // Question 1: Appointment in last 1-3 days but no offer added (urgent window)
  for (const opp of userOpportunities) {
    if (!opp.scheduledAppointment) continue
    
    const appointmentDate = new Date(opp.scheduledAppointment.start)
    const daysSinceAppointment = Math.floor((now - appointmentDate) / (1000 * 60 * 60 * 24))
    
    // Only show if appointment was 1-3 days ago (urgent actionable window)
    if (daysSinceAppointment >= 1 && daysSinceAppointment <= 3) {
      // Check if any offers exist for this opportunity
      const hasOffers = mockActivities.some(
        activity => activity.opportunityId === opp.id && activity.type === 'offer'
      )
      
      if (!hasOffers) {
        const enrichedOpp = enrichOpportunityWithCustomer(opp)
        questions.push({
          id: `appt-followup-${opp.id}`,
          type: 'appointment-followup',
          priority: 4, // High priority
          question: `You had an appointment ${daysSinceAppointment === 1 ? 'yesterday' : `${daysSinceAppointment} days ago`} with ${enrichedOpp.customer.name} but no offer is added so far. Did they show up to the appointment?`,
          customer: enrichedOpp.customer,
          opportunityId: opp.id,
          opportunity: enrichedOpp,
          createdAt: opp.scheduledAppointment.start,
          appointmentDate: opp.scheduledAppointment.start
        })
      }
    }
  }
  
  // Question 2: NS task exists but no communications (1-2 days after creation)
  for (const opp of userOpportunities) {
    if (!opp.scheduledAppointment) continue
    
    const appointment = opp.scheduledAppointment
    // Check if appointment has no-show status or noShowCount > 0
    if ((appointment.status === 'no-show' || appointment.noShowCount > 0) && appointment.nsTaskCreatedAt) {
      // Find NS task creation timestamp
      const nsTaskCreatedAt = new Date(appointment.nsTaskCreatedAt)
      const daysSinceNSTask = Math.floor((now - nsTaskCreatedAt) / (1000 * 60 * 60 * 24))
      
      // Only show if 1-2 days after NS task creation (urgent follow-up window)
      if (daysSinceNSTask >= 1 && daysSinceNSTask <= 2) {
        // Check if there are any communications after NS task creation
        const hasCommunications = mockActivities.some(activity => {
          if (activity.opportunityId !== opp.id) return false
          if (!['call', 'email', 'sms', 'whatsapp', 'communication'].includes(activity.type)) return false
          
          const activityDate = new Date(activity.timestamp)
          return activityDate >= nsTaskCreatedAt
        })
        
        if (!hasCommunications) {
          const enrichedOpp = enrichOpportunityWithCustomer(opp)
          questions.push({
            id: `ns-followup-${opp.id}`,
            type: 'ns-followup',
            priority: 3, // High
            question: `You had to follow up with ${enrichedOpp.customer.name} on a missed appointment. Did you call them?`,
            customer: enrichedOpp.customer,
            opportunityId: opp.id,
            opportunity: enrichedOpp,
            createdAt: appointment.nsTaskCreatedAt,
            nsTaskCreatedAt: appointment.nsTaskCreatedAt
          })
        }
      }
    }
  }
  
  // Add stuck opportunities (only for managers and salesmen)
  if (userRole === 'manager' || userRole === 'salesman') {
    const stuckQuestions = await detectStuckOpportunities(userId)
    questions.push(...stuckQuestions)
  }
  
  // Add lead qualification urgency (only for managers and operators)
  if (userRole === 'manager' || userRole === 'operator') {
    const { detectUrgentLeads } = await import('./leads')
    const leadQuestions = await detectUrgentLeads(userId)
    questions.push(...leadQuestions)
  }
  
  // Assign priorities to existing question types
  questions.forEach(q => {
    if (!q.priority) {
      if (q.type === 'appointment-followup') q.priority = 4 // High
      else if (q.type === 'offer-followup') q.priority = 5 // Medium
    }
  })
  
  // Sort by priority (lower number = higher priority) then by age
  questions.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority
    
    const ageA = new Date(a.createdAt || a.appointmentDate)
    const ageB = new Date(b.createdAt || b.appointmentDate)
    return ageA - ageB // Older first
  })
  
  return questions
}

// Create NS Task
export const createNSTask = async (opportunityId, assigneeId) => {
  await delay()
  
  const opportunity = mockOpportunities.find(o => o.id === parseInt(opportunityId))
  if (!opportunity) throw new Error('Opportunity not found')
  
  // Update appointment to mark NS task as created
  if (opportunity.scheduledAppointment) {
    opportunity.scheduledAppointment.noShowCount = (opportunity.scheduledAppointment.noShowCount || 0) + 1
    opportunity.scheduledAppointment.nsTaskCreatedAt = new Date().toISOString()
    opportunity.scheduledAppointment.status = 'no-show'
  }
  
  // Add NS task activity
  const nsActivity = {
    id: mockActivities.length + 1,
    opportunityId: parseInt(opportunityId),
    type: 'ns-task-created',
    user: mockUsers.find(u => u.id === assigneeId)?.name || 'System',
    action: 'NS task created',
    content: `No-show task created for missed appointment`,
    timestamp: new Date().toISOString()
  }
  mockActivities.push(nsActivity)
  
  return {
    success: true,
    noShowCount: opportunity.scheduledAppointment?.noShowCount || 0,
    activity: nsActivity
  }
}

// Update opportunity assignee
export const updateOpportunityAssignee = async (opportunityId, assigneeId) => {
  await delay()
  
  const opportunity = mockOpportunities.find(o => o.id === parseInt(opportunityId))
  if (!opportunity) throw new Error('Opportunity not found')
  
  const newAssignee = mockUsers.find(u => u.id === assigneeId)
  if (!newAssignee) throw new Error('User not found')
  
  opportunity.assignee = newAssignee.name
  
  return opportunity
}

export const fetchTasksDueToday = async () => {
  await delay()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  // Opportunities don't have nextActionDue, but we can check lastActivity or expectedCloseDate
  // For now, return opportunities with recent activity or due soon
  return mockOpportunities.filter(opp => {
    if (opp.expectedCloseDate) {
      const closeDate = new Date(opp.expectedCloseDate)
      closeDate.setHours(0, 0, 0, 0)
      return closeDate >= today && closeDate < tomorrow
    }
    return false
  })
}

export const fetchTasksDueUpcoming = async (days = 7) => {
  await delay()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const endDate = new Date(today)
  endDate.setDate(endDate.getDate() + days)
  
  return mockOpportunities.filter(opp => {
    if (opp.expectedCloseDate) {
      const closeDate = new Date(opp.expectedCloseDate)
      return closeDate >= today && closeDate < endDate
    }
    return false
  })
}
