import { ref } from 'vue'
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '@/api/calendar'

/**
 * Composable for calendar event handlers
 * Handles creating, updating, deleting, and viewing calendar events
 * 
 * @param {Object} params - Parameters object
 * @param {Ref} params.events - Reactive reference to events array
 * @param {Ref} params.calendarOptions - Reactive reference to calendar options
 * @param {Ref} params.showCreateEventModal - Reactive reference for create modal visibility
 * @param {Ref} params.showQuickViewModal - Reactive reference for quick view modal visibility
 * @param {Ref} params.showEditEventModal - Reactive reference for edit modal visibility
 * @param {Ref} params.selectedEvent - Reactive reference to selected event
 * @param {Ref} params.newEvent - Reactive reference to new event data
 * @returns {Object} Object containing event handlers
 */
export function useCalendarEvents({ events, calendarOptions, showCreateEventModal, showQuickViewModal, showEditEventModal, selectedEvent, newEvent }) {
  
  const handleDateSelect = (selectInfo) => {
    newEvent.value.date = selectInfo.startStr
    showCreateEventModal.value = true
  }

  const handleEventClick = (clickInfo) => {
    const eventId = parseInt(clickInfo.event.id)
    const fullEvent = events.value.find(e => e.id === eventId)
    if (fullEvent) {
      selectedEvent.value = { ...fullEvent }
      showQuickViewModal.value = true
    }
  }

  const handleCreateEvent = async (eventData) => {
    const fullEventData = {
      ...eventData,
      start: `${eventData.date}T${eventData.time || '10:00:00'}`,
      end: `${eventData.date}T${eventData.time || '11:00:00'}`
    }
    const createdEvent = await createCalendarEvent(fullEventData)
    events.value.push(createdEvent)
    calendarOptions.value.events = [...events.value]
    showCreateEventModal.value = false
  }

  const handleDeleteEvent = async (eventId) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteCalendarEvent(eventId)
      events.value = events.value.filter(e => e.id !== eventId)
      calendarOptions.value.events = [...events.value]
      showQuickViewModal.value = false
      selectedEvent.value = null
    }
  }

  const openEditModal = () => {
    showQuickViewModal.value = false
    showEditEventModal.value = true
  }

  const handleSaveEditedEvent = async (eventData) => {
    const updatedData = {
      ...eventData,
      start: `${eventData.date}T${eventData.time || '10:00'}:00`,
      end: `${eventData.date}T${eventData.time || '11:00'}:00`
    }
    await updateCalendarEvent(eventData.id, updatedData)
    const index = events.value.findIndex(e => e.id === eventData.id)
    if (index !== -1) {
      events.value[index] = { ...events.value[index], ...updatedData }
      calendarOptions.value.events = [...events.value]
    }
    showEditEventModal.value = false
  }

  return {
    handleDateSelect,
    handleEventClick,
    handleCreateEvent,
    handleDeleteEvent,
    openEditModal,
    handleSaveEditedEvent
  }
}

