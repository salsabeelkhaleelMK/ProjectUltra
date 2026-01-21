/**
 * Composable for LQWidget handler functions
 * Coordinates between call and outcome composables
 */
export function useLQWidgetHandlers(emit, callState, outcomeState, lead, contactAttemptsRef, maxContactAttemptsRef, leadsStore) {
  const { callData, extractedData, isCallActive, callEnded } = callState
  const {
    showOutcomeSelection,
    selectedOutcome,
    appointmentScheduled,
    scheduledAppointmentData,
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
    callLogAssignee
  } = outcomeState

  const logManualCall = () => {
    callData.value = {
      channel: 'external',
      notes: '',
      transcription: null
    }
    // Show the call log form first with datetime and assignee
    initCallLogForm()
  }

  const handleScheduleAppointmentConfirm = async (appointmentData) => {
    // Store appointment data for qualify button
    scheduledAppointmentData.value = appointmentData
    appointmentScheduled.value = true
    showScheduleAppointmentModal.value = false
    
    // Emit event to create the appointment immediately
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
    emit('qualified', {
      assignment: assignment.value,
      preferences: preferences.value,
      scheduleAppointment: appointmentScheduled.value,
      appointmentData: scheduledAppointmentData.value,
      surveyData: surveyCompleted.value ? surveyResponses.value : null
    })
    
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
    
    // Create appointment and calendar event
    const nextCallDate = calculateNextCallDate()
    const appointmentDate = nextCallDate.split('T')[0]
    const appointmentTime = new Date(nextCallDate).toTimeString().slice(0, 5)
    
    // Set lead to "to be called back" status by updating nextActionDue
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
    
    cancelOutcome()
  }

  const handleNoteSave = (noteData) => {
    outcomeState.showNoteModal.value = false
    emit('note-saved', noteData)
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
    handleNotResponding
  }
}

