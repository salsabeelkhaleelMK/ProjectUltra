/**
 * Composable for LQWidget handler functions
 * Coordinates between call and outcome composables
 * @param {Object} currentUserRef - optional ref to current user for "Updated by" in success state
 */
export function useLQWidgetHandlers(emit, callState, outcomeState, lead, contactAttemptsRef, maxContactAttemptsRef, leadsStore, currentUserRef) {
  const { callData, extractedData, isCallActive, callEnded } = callState
  const {
    showOutcomeSelection,
    selectedOutcome,
    assignment,
    preferences,
    cancelOutcome,
    calculateNextCallDate,
    showScheduleAppointmentModal,
    surveyCompleted,
    surveyResponses,
    showSurvey,
    initCallLogForm,
    callLogDateTime,
    callLogAssignee,
    successState,
    successPerformedAt,
    rescheduleTime,
    aiSuggestionData,
    customDate,
    customTime,
    qualificationMethod,
    qualificationEventType,
    qualificationDurationValue,
    qualificationSelectedDate,
    qualificationSelectedSlot
  } = outcomeState

  const actorName = () => (currentUserRef?.value?.name) || 'Unknown'

  const getNextCallLabel = () => {
    if (rescheduleTime.value === 'tomorrow-9am') return 'Tomorrow 9:00 AM'
    if (rescheduleTime.value === 'monday' && aiSuggestionData.value) {
      return `${aiSuggestionData.value.formattedDate} at ${aiSuggestionData.value.time}`
    }
    if (rescheduleTime.value === 'monday') return 'Monday'
    if (rescheduleTime.value === 'custom' && customDate.value && customTime.value) {
      return `${customDate.value} ${customTime.value}`
    }
    return 'selected time'
  }

  const logManualCall = () => {
    callData.value = {
      channel: 'external',
      notes: '',
      transcription: null
    }
    // Show the call log form first with datetime and assignee, and show outcome selection immediately
    initCallLogForm(true)
  }

  const handleScheduleAppointmentConfirm = async (appointmentData) => {
    showScheduleAppointmentModal.value = false
    emit('appointment-scheduled', appointmentData)
  }

  const handleQualify = () => {
    const attempt = {
      timestamp: new Date().toISOString(),
      outcome: 'interested',
      channel: callData.value?.channel || 'phone',
      notes: callData.value?.notes || '',
      transcription: callData.value?.transcription || null
    }

    emit('call-attempt-logged', attempt)
    emit('validated', { scheduleFollowUp: false })

    const assigneeName = assignment.value?.assignee?.name || 'Unassigned'
    let meeting = null
    let scheduleAppointment = false
    let appointmentData = null

    if (qualificationMethod.value === 'assign-and-schedule' && qualificationSelectedDate.value && qualificationSelectedSlot.value) {
      const d = qualificationSelectedDate.value
      const dateStr = d.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })
      const eventTypeLabel = { 'test-drive': 'Test drive', 'video-call': 'Video call', 'phone-call': 'Phone call', 'in-store-visit': 'In-store visit' }[qualificationEventType.value] || qualificationEventType.value
      scheduleAppointment = true
      appointmentData = {
        datetime: d,
        time: qualificationSelectedSlot.value,
        type: eventTypeLabel,
        assignee: assigneeName,
        duration: qualificationDurationValue.value
      }
      meeting = {
        date: dateStr,
        time: qualificationSelectedSlot.value,
        title: eventTypeLabel,
        name: lead.value?.customer?.name || '',
        location: assigneeName
      }
      emit('appointment-scheduled', appointmentData)
    }

    emit('qualified', {
      assignment: assignment.value,
      preferences: preferences.value,
      scheduleAppointment,
      appointmentData,
      surveyData: surveyCompleted.value ? surveyResponses.value : null
    })

    let statusText = `Qualified - Assigned to ${assigneeName}`
    if (meeting) {
      statusText = `Qualified - Assigned to ${assigneeName}, meeting on ${meeting.date} ${meeting.time}`
    }

    successState.value = { kind: 'qualified', statusText, meeting, actorName: actorName() }
    successPerformedAt.value = new Date()
    cancelOutcome()
  }

  const handleSurveyCompleted = async (responses) => {
    surveyResponses.value = responses
    surveyCompleted.value = true
    showSurvey.value = false
    
    // Create survey activity
    if (leadsStore && lead.value?.id) {
      try {
        await leadsStore.addActivity(lead.value.id, {
          type: 'survey',
          action: 'Lead Qualification Survey',
          content: JSON.stringify(responses),
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        console.error('Failed to save survey activity:', error)
      }
    }
    
    emit('survey-completed', { lead: lead.value, responses })
  }

  const handleSurveyRefused = async () => {
    showSurvey.value = false
    
    // Log survey refusal as activity
    if (leadsStore && lead.value?.id) {
      try {
        await leadsStore.addActivity(lead.value.id, {
          type: 'survey',
          action: 'Lead Qualification Survey',
          content: 'Customer refused to complete survey',
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        console.error('Failed to save survey refusal activity:', error)
      }
    }
    
    emit('survey-refused', { lead: lead.value })
  }

  const handleNotResponding = async () => {
    showSurvey.value = false
    
    // Log not responding as activity
    if (leadsStore && lead.value?.id) {
      try {
        await leadsStore.addActivity(lead.value.id, {
          type: 'survey',
          action: 'Lead Qualification Survey',
          content: 'Customer not responding to survey',
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        console.error('Failed to save survey not responding activity:', error)
      }
    }
    
    emit('not-responding', { lead: lead.value })
  }

  const handleDisqualifyFromInterested = () => {
    // Log the attempt first
    const attempt = {
      timestamp: new Date().toISOString(),
      outcome: 'interested',
      channel: callData.value?.channel || 'phone',
      notes: callData.value?.notes || '',
      transcription: callData.value?.transcription || null
    }
    emit('call-attempt-logged', attempt)
    
    // Then switch to disqualify outcome
    selectedOutcome.value = 'not-valid'
  }

  const handleNoAnswerConfirm = async () => {
    const attempt = {
      timestamp: new Date().toISOString(),
      outcome: 'no-answer',
      channel: callData.value?.channel || 'phone',
      notes: callData.value?.notes || '',
      transcription: callData.value?.transcription || null
    }
    
    emit('call-attempt-logged', attempt)
    
    const nextCallDate = calculateNextCallDate()
    const appointmentDate = nextCallDate.split('T')[0]
    const appointmentTime = new Date(nextCallDate).toTimeString().slice(0, 5)
    
    if (leadsStore && lead.value?.id) {
      try {
        await leadsStore.updateLead(lead.value.id, {
          nextActionDue: nextCallDate,
          status: 'Pending'
        })
      } catch (error) {
        console.error('Failed to update lead status to "to be called back":', error)
      }
    }
    
    emit('postponed', {
      date: appointmentDate,
      time: appointmentTime,
      createAppointment: true
    })
    
    if (contactAttemptsRef?.value + 1 >= maxContactAttemptsRef?.value) {
      emit('disqualified', {
        category: 'Not Interested',
        reason: 'Unreachable'
      })
    }

    const nextLabel = getNextCallLabel()
    successState.value = { kind: 'no-answer', statusText: `Message sent - Rescheduled to ${nextLabel}`, actorName: actorName() }
    successPerformedAt.value = new Date()
    cancelOutcome()
  }

  const handleNotValidConfirm = () => {
    const attempt = {
      timestamp: new Date().toISOString(),
      outcome: 'not-valid',
      channel: callData.value?.channel || 'phone',
      notes: callData.value?.notes || '',
      transcription: callData.value?.transcription || null
    }
    
    emit('call-attempt-logged', attempt)
    emit('disqualified', {
      category: outcomeState.disqualifyCategory.value,
      reason: outcomeState.disqualifyReason.value
    })

    successState.value = { kind: 'not-interested', statusText: 'Closed - Not interested', actorName: actorName() }
    successPerformedAt.value = new Date()
    cancelOutcome()
  }

  const handleNoteSave = (noteData) => {
    outcomeState.showNoteModal.value = false
    emit('note-saved', noteData)
  }

  const handleReopen = () => {
    outcomeState.clearSuccessState()
    outcomeState.resetOutcomeState()
  }

  return {
    logManualCall,
    handleScheduleAppointmentConfirm,
    handleQualify,
    handleDisqualifyFromInterested,
    handleNoAnswerConfirm,
    handleNotValidConfirm,
    handleNoteSave,
    handleSurveyCompleted,
    handleSurveyRefused,
    handleNotResponding,
    handleReopen
  }
}

