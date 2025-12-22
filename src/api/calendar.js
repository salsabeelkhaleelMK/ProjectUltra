import { mockCalendarEvents, calendarEventTypes, calendarDealerships, calendarTeams, mockUsers } from './mockData'

// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

export const fetchCalendarEvents = async (filters = {}) => {
  await delay()
  
  let results = [...mockCalendarEvents]
  
  // Apply filters
  if (filters.onlyMine && filters.currentUserId) {
    results = results.filter(event => event.assigneeId === filters.currentUserId)
  }
  
  if (filters.eventTypes && filters.eventTypes.length > 0) {
    results = results.filter(event => filters.eventTypes.includes(event.type))
  }
  
  if (filters.dealerships && filters.dealerships.length > 0) {
    results = results.filter(event => filters.dealerships.includes(event.dealership))
  }
  
  if (filters.teams && filters.teams.length > 0) {
    results = results.filter(event => filters.teams.includes(event.team))
  }
  
  if (filters.users && filters.users.length > 0) {
    results = results.filter(event => filters.users.includes(event.assigneeId))
  }
  
  if (filters.includeCancelled === false) {
    results = results.filter(event => event.status !== 'cancelled')
  }
  
  if (filters.noShowsOnly) {
    results = results.filter(event => event.status === 'no-show')
  }
  
  if (filters.start && filters.end) {
    results = results.filter(event => {
      const eventStart = new Date(event.start)
      return eventStart >= new Date(filters.start) && eventStart <= new Date(filters.end)
    })
  }
  
  return results
}

export const fetchCalendarFilterOptions = async () => {
  await delay(100)
  
  return {
    eventTypes: [...calendarEventTypes],
    dealerships: calendarDealerships.map(d => d.name),
    teams: calendarTeams.map(t => t.name),
    users: [...mockUsers]
  }
}

export const createCalendarEvent = async (eventData) => {
  await delay()
  
  const newEvent = {
    id: mockCalendarEvents.length + 1,
    ...eventData,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  }
  
  mockCalendarEvents.push(newEvent)
  return newEvent
}

export const updateCalendarEvent = async (id, updates) => {
  await delay()
  
  const index = mockCalendarEvents.findIndex(e => e.id === parseInt(id))
  if (index === -1) throw new Error('Event not found')
  
  mockCalendarEvents[index] = { ...mockCalendarEvents[index], ...updates }
  return mockCalendarEvents[index]
}

export const deleteCalendarEvent = async (id) => {
  await delay()
  
  const index = mockCalendarEvents.findIndex(e => e.id === parseInt(id))
  if (index === -1) throw new Error('Event not found')
  
  mockCalendarEvents.splice(index, 1)
  return { success: true }
}
