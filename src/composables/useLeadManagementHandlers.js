import { useRouter } from 'vue-router'
import { useLeadsStore } from '@/stores/leads'
import { useUserStore } from '@/stores/user'
import { LEAD_STAGES } from '@/utils/stageMapper'
import { getTransitionHandler } from '@/composables/useLeadStateMachine'
import { formatDate, formatTime } from '@/utils/formatters'

/**
 * Composable for LeadManagementWidget handlers
 * @param {Object} options - Handler configuration
 * @param {Function} options.getLead - Function to get the current lead
 * @param {Object} options.leadState - Lead state machine reactive state
 * @param {Function} options.emit - Emit function for component events
 */
export function useLeadManagementHandlers({ getLead, leadState, emit }) {
  const router = useRouter()
  const leadsStore = useLeadsStore()
  const userStore = useUserStore()

  async function handlePostponed(data) {
    const lead = getLead()
    if (!lead) return

    if (!leadState.canPostpone.value) {
      console.warn('Cannot postpone in current state')
      return
    }
    
    try {
      const dueDateTime = new Date(`${data.date}T${data.time}:00`)
      const isoTimestamp = dueDateTime.toISOString()
      
      const updates = {
        nextActionDue: isoTimestamp
      }
      
      // Add reassignment if provided
      if (data.assigneeId || data.teamId) {
        updates.assignee = data.assignee || null
        updates.assigneeId = data.assigneeId || null
        updates.assigneeType = data.assigneeType || 'user'
        updates.teamId = data.teamId || null
        updates.team = data.team || null
      }
      
      await leadsStore.updateLead(lead.id, updates)
      
      // Create appointment if requested
      if (data.createAppointment) {
        const endTime = new Date(dueDateTime)
        endTime.setHours(endTime.getHours() + 1)
        
        await leadsStore.updateLead(lead.id, {
          scheduledAppointment: {
            id: Date.now(),
            title: `Follow-up Call - ${lead.customer.name}`,
            start: isoTimestamp,
            end: endTime.toISOString(),
            type: 'Call',
            assignee: data.assignee || lead.assignee,
            assigneeId: data.assigneeId || lead.assigneeId,
            assigneeType: data.assigneeType || lead.assigneeType || 'user',
            teamId: data.teamId || lead.teamId,
            team: data.team || lead.team,
            status: 'scheduled'
          }
        })
        
        await leadsStore.addActivity(lead.id, {
          type: 'appointment',
          user: userStore.currentUser?.name || 'You',
          action: 'scheduled follow-up call',
          content: `Follow-up call scheduled for ${formatDate(dueDateTime)} at ${formatTime(dueDateTime)}`,
          data: {
            type: 'Call',
            date: data.date,
            time: data.time,
            assignee: data.assignee || lead.assignee
          }
        })
      }
      
      await leadsStore.addActivity(lead.id, {
        type: 'note',
        user: 'You',
        action: 'postponed lead qualification task',
        content: `Task postponed to ${formatDate(dueDateTime)} at ${formatTime(dueDateTime)}${data.assignee ? ` and reassigned to ${data.assignee}` : ''}`
      })
      
      await leadsStore.fetchLeadById(lead.id)
    } catch (err) {
      console.error('Failed to postpone lead task:', err)
    }
  }

  async function handleValidated(data) {
    const lead = getLead()
    if (!lead) return

    try {
      await leadsStore.updateLead(lead.id, {
        stage: 'Validated'
      })
      
      await leadsStore.addActivity(lead.id, {
        type: 'note',
        user: 'You',
        action: 'validated lead',
        content: 'Lead has been validated and is ready for follow-up'
      })
      
      if (data.scheduleFollowUp && data.appointmentData) {
        const appointmentDateTime = new Date(`${data.appointmentData.date}T${data.appointmentData.time}:00`)
        
        await leadsStore.scheduleFollowUp(lead.id, {
          dateTime: appointmentDateTime.toISOString(),
          assignee: data.appointmentData.assignee || lead.assignee,
          assigneeId: data.appointmentData.assigneeId || null,
          assigneeType: data.appointmentData.assigneeType || 'user',
          teamId: data.appointmentData.teamId || null,
          team: data.appointmentData.team || null
        })
        
        await leadsStore.addActivity(lead.id, {
          type: 'appointment',
          user: 'You',
          action: 'scheduled follow-up call',
          content: `Follow-up call scheduled for ${formatDate(appointmentDateTime)} at ${formatTime(appointmentDateTime)}`
        })
      }
      
      await leadsStore.fetchLeadById(lead.id)
    } catch (err) {
      console.error('Failed to validate lead:', err)
    }
  }

  async function handleQualified() {
    const lead = getLead()
    if (!lead) return

    try {
      const opportunityId = await leadsStore.convertLeadToOpportunity(lead.id)
      
      if (userStore.canAccessOpportunities()) {
        router.push({ path: `/tasks/${opportunityId}`, query: { type: 'opportunity' } })
      } else {
        router.push('/tasks')
      }
    } catch (err) {
      console.error('Failed to qualify lead:', err)
    }
  }

  async function handleCallAttemptLogged(attempt) {
    const lead = getLead()
    if (!lead) return

    try {
      const currentAttempts = lead.contactAttempts || []
      
      await leadsStore.updateLead(lead.id, {
        contactAttempts: [...currentAttempts, attempt],
        lastContactAttempt: attempt.timestamp,
        totalContactAttempts: currentAttempts.length + 1
      })
      
      await leadsStore.addActivity(lead.id, {
        type: 'call',
        user: 'You',
        action: `logged call attempt - ${attempt.outcome}`,
        content: attempt.notes || `Call attempt via ${attempt.channel}`,
        data: {
          outcome: attempt.outcome,
          channel: attempt.channel,
          duration: attempt.duration
        }
      })
      
      await leadsStore.fetchLeadById(lead.id)
    } catch (err) {
      console.error('Failed to log call attempt:', err)
    }
  }

  async function handleNoteSaved(noteData) {
    const lead = getLead()
    if (!lead) return

    try {
      await leadsStore.addActivity(lead.id, {
        type: 'note',
        user: 'You',
        action: 'added a note',
        content: noteData.content || noteData.text || '',
        data: noteData
      })
      
      await leadsStore.fetchLeadById(lead.id)
    } catch (err) {
      console.error('Failed to save note:', err)
    }
  }

  function handleOpenPurchaseMethod() {
    emit('open-purchase-method')
  }

  function handleOpenTradeIn() {
    emit('open-trade-in')
  }

  async function handleAppointmentScheduled(appointmentData) {
    const lead = getLead()
    if (!lead) return

    try {
      const appointmentDateTime = `${appointmentData.date}T${appointmentData.time}:00`
      const endTime = new Date(appointmentDateTime)
      endTime.setHours(endTime.getHours() + 1)
      
      await leadsStore.updateLead(lead.id, {
        scheduledAppointment: {
          id: Date.now(),
          title: `${appointmentData.type} - ${lead.customer.name}`,
          start: appointmentDateTime,
          end: endTime.toISOString(),
          type: appointmentData.type,
          assignee: appointmentData.assignee,
          assigneeId: appointmentData.assigneeId,
          status: 'scheduled',
          location: appointmentData.location || '',
          notes: appointmentData.notes || ''
        }
      })
      
      await leadsStore.addActivity(lead.id, {
        type: 'appointment',
        user: userStore.currentUser?.name || 'You',
        action: 'scheduled an appointment',
        content: `${appointmentData.type} scheduled for ${appointmentData.date} at ${appointmentData.time}`,
        data: {
          type: appointmentData.type,
          date: appointmentData.date,
          time: appointmentData.time,
          assignee: appointmentData.assignee
        }
      })
      
      await leadsStore.fetchLeadById(lead.id)
    } catch (err) {
      console.error('Failed to schedule appointment:', err)
    }
  }

  async function handleDisqualified(data) {
    const lead = getLead()
    if (!lead) return

    // Use state machine to determine if disqualification is allowed
    if (leadState.isClosed.value && !data.force) {
      console.warn('Lead already closed')
      return
    }
    
    try {
      // Use state machine transition handler
      const currentStage = leadState.displayStage.value
      const targetStage = data.reason === 'Duplicate' ? LEAD_STAGES.CLOSED_DUPLICATE 
        : data.category === 'Not Interested' ? LEAD_STAGES.CLOSED_NOT_INTERESTED 
        : LEAD_STAGES.CLOSED_INVALID
      
      const transitionHandler = getTransitionHandler(currentStage, targetStage)
      
      if (transitionHandler) {
        const { updates, activities } = transitionHandler(lead, targetStage, data)
        
        // Apply updates
        await leadsStore.updateLead(lead.id, updates)
        
        // Log all activities
        for (const activity of activities) {
          await leadsStore.addActivity(lead.id, activity)
        }
      } else {
        // Fallback to direct update if no handler found
        const isDuplicate = data.reason === 'Duplicate'
        await leadsStore.updateLead(lead.id, {
          isDisqualified: true,
          disqualifyReason: data.reason,
          isDuplicate: isDuplicate,
          stage: isDuplicate ? 'Closed Failed' : 'Not Valid',
          status: 'Disqualified',
          scheduledAppointment: null,
          nextActionDue: null
        })
        
        await leadsStore.addActivity(lead.id, {
          type: 'note',
          user: 'You',
          action: 'disqualified lead',
          content: `Lead disqualified - Category: ${data.category}, Reason: ${data.reason}`
        })
      }
      
      router.push('/tasks')
    } catch (err) {
      console.error('Failed to disqualify lead:', err)
    }
  }

  async function handleReopen() {
    const lead = getLead()
    if (!lead) return

    try {
      // Use state machine transition handler
      const currentStage = leadState.displayStage.value
      const targetStage = LEAD_STAGES.NEW // Reopen to New stage
      
      const transitionHandler = getTransitionHandler(currentStage, targetStage)
      
      if (transitionHandler) {
        const { updates, activities } = transitionHandler(lead)
        
        // Apply updates
        await leadsStore.updateLead(lead.id, updates)
        
        // Log all activities
        for (const activity of activities) {
          await leadsStore.addActivity(lead.id, activity)
        }
      } else {
        // Fallback to direct update if no handler found
        await leadsStore.updateLead(lead.id, {
          isDisqualified: false,
          disqualifyReason: null,
          disqualifyCategory: null,
          isDuplicate: false,
          stage: 'Open Lead',
          status: 'Open',
          nextActionDue: null, // Clear any old due dates
          scheduledAppointment: null // Clear any old appointments
        })
        
        await leadsStore.addActivity(lead.id, {
          type: 'note',
          user: 'You',
          action: 'reopened lead',
          content: 'Lead has been reopened for qualification'
        })
      }
      
      await leadsStore.fetchLeadById(lead.id)
    } catch (err) {
      console.error('Failed to reopen lead:', err)
    }
  }

  function viewOpportunity() {
    const lead = getLead()
    if (!lead) return

    if (lead.opportunityId) {
      router.push({ path: `/tasks/${lead.opportunityId}`, query: { type: 'opportunity' } })
    }
  }

  return {
    handlePostponed,
    handleValidated,
    handleQualified,
    handleCallAttemptLogged,
    handleNoteSaved,
    handleOpenPurchaseMethod,
    handleOpenTradeIn,
    handleAppointmentScheduled,
    handleDisqualified,
    handleReopen,
    viewOpportunity
  }
}

